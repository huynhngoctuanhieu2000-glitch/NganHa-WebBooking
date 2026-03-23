// /api/chat/route.ts - Gemini AI chat endpoint for Ngan Ha Spa
import { GoogleGenerativeAI } from '@google/generative-ai';
import { NextRequest, NextResponse } from 'next/server';

// ═══════════════════════════════════════
// Spa Knowledge Base (injected into system prompt)
// ═══════════════════════════════════════

const SPA_KNOWLEDGE = `
## Spa Ngân Hà - Thông tin

### Chi nhánh
- **Ngan Ha Barbershop**: 11 Ngô Đức Kế, P. Sài Gòn, Quận 1, TP.HCM
  - Giờ mở cửa: 9:00 AM - 12:00 AM (Last order 11:30 PM)
  - Google Maps: https://maps.app.goo.gl/8XBkjsJicXqdNsZk7

### Dịch vụ & Giá

1. **Ear Clean Package / Gói Lấy Ráy Tai**
   - Bao gồm: Lấy ráy tai / Massage đầu cổ vai / Massage chân với thảo dược
   - Thời gian: 70 phút
   - Giá: 650,000 VND (~$30 USD)

2. **Heel Skin Shave Package / Gói Cạo Da Gót Chân**
   - Bao gồm: Cạo da gót chân / Massage chân với thảo dược
   - Thời gian: 70 phút
   - Giá: 600,000 VND (~$27 USD)

3. **Hair Wash Package / Gói Gội Đầu Dưỡng Sinh**
   - Bao gồm: Gội đầu / Massage đầu cổ vai / Massage toàn thân & chân
   - Thời gian: 90 phút
   - Giá: 770,000 VND (~$35 USD)

4. **Facial Package / Gói Chăm Sóc Da Mặt**
   - Bao gồm: Chăm sóc da mặt / Cạo mặt / Massage đầu cổ vai / Gội nhanh / Massage toàn thân
   - Thời gian: 90 phút
   - Giá: 800,000 VND (~$36 USD)

5. **Barbershop Package / Gói Barbershop**
   - Bao gồm: Cạo râu / Cắt móng / Massage toàn thân / Lấy ráy tai / Cạo gót / Gội đầu / Đắp mặt nạ
   - Thời gian: 120 phút
   - Giá: 800,000 VND (~$39 USD)
   - Lưu ý: Available 11am - 7pm

### Website đặt lịch
- URL: https://nganha.vercel.app/
- Khách có thể đặt lịch online qua website
`;

// Language instruction templates
const LANGUAGE_INSTRUCTIONS: Record<string, string> = {
  vi: 'Trả lời bằng tiếng Việt. Dùng giọng văn thân thiện, lịch sự như nhân viên spa chuyên nghiệp.',
  en: 'Reply in English. Use a friendly, professional spa receptionist tone.',
  cn: '用中文回答。使用友好、专业的水疗接待员语气。',
  jp: '日本語で返答してください。フレンドリーでプロフェッショナルなスパ受付の口調を使ってください。',
  kr: '한국어로 답변해 주세요. 친절하고 전문적인 스파 안내원의 어조를 사용하세요.',
};

const buildSystemPrompt = (locale: string): string => {
  const langInstruction = LANGUAGE_INSTRUCTIONS[locale] || LANGUAGE_INSTRUCTIONS.vi;

  return `Bạn là trợ lý AI của Spa Ngân Hà (Ngan Ha Barbershop & Spa) tại Quận 1, TP. Hồ Chí Minh.

${langInstruction}

Quy tắc:
1. Chỉ trả lời các câu hỏi liên quan đến spa, dịch vụ, giá cả, đặt lịch, địa chỉ, giờ mở cửa.
2. Khi khách hỏi về dịch vụ, luôn nêu đầy đủ thông tin: tên, thời gian, giá, nội dung gói.
3. Khi có cơ hội, gợi ý khách đặt lịch.
4. Trả lời ngắn gọn, súc tích (tối đa 150 từ). Dùng emoji phù hợp.
5. Nếu khách hỏi ngoài phạm vi spa, lịch sự từ chối và hướng lại về dịch vụ spa.
6. Định dạng câu trả lời dễ đọc, sử dụng bullet points khi liệt kê.

${SPA_KNOWLEDGE}`;
};

// ═══════════════════════════════════════
// API Route Handler
// ═══════════════════════════════════════

// ═══════════════════════════════════════
// Retry helper for rate limiting
// ═══════════════════════════════════════

const MAX_RETRIES = 3;
const RETRY_DELAYS = [2000, 5000, 10000]; // ms

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

// Rate limit error messages per locale
const RATE_LIMIT_MESSAGES: Record<string, string> = {
  vi: 'Hệ thống đang bận, vui lòng thử lại sau vài giây nhé! 🙏',
  en: 'System is busy, please try again in a few seconds! 🙏',
  cn: '系统繁忙，请稍后再试！🙏',
  jp: 'システムが混雑しています。数秒後にもう一度お試しください！🙏',
  kr: '시스템이 바쁩니다. 몇 초 후에 다시 시도해 주세요! 🙏',
};

// ═══════════════════════════════════════
// API Route Handler
// ═══════════════════════════════════════

export const POST = async (request: NextRequest) => {
  try {
    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      console.error('[AI Chat] GEMINI_API_KEY is not set');
      return NextResponse.json(
        { error: 'GEMINI_API_KEY is not configured' },
        { status: 500 },
      );
    }

    const body = await request.json();
    const { message, locale = 'vi', history = [] } = body;

    if (!message || typeof message !== 'string') {
      return NextResponse.json(
        { error: 'Message is required' },
        { status: 400 },
      );
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });

    // Build chat history for Gemini (skip greeting message to avoid confusion)
    const chatHistory = history
      .filter((m: { role: string; content: string }) => m.content && m.role)
      .slice(0, -1) // Remove the last message (it's the current one)
      .map((m: { role: string; content: string }) => ({
        role: m.role === 'assistant' ? 'model' : 'user',
        parts: [{ text: m.content }],
      }));

    // Ensure history starts with 'user' role (Gemini requirement)
    const validHistory = chatHistory.length > 0 && chatHistory[0].role === 'model'
      ? chatHistory.slice(1)
      : chatHistory;

    const chat = model.startChat({
      history: validHistory,
      generationConfig: {
        maxOutputTokens: 500,
        temperature: 0.7,
      },
      systemInstruction: buildSystemPrompt(locale),
    });

    // Retry logic for rate limiting
    let lastError: unknown = null;
    for (let attempt = 0; attempt <= MAX_RETRIES; attempt++) {
      try {
        const result = await chat.sendMessage(message);
        const reply = result.response.text();
        return NextResponse.json({ reply });
      } catch (err: unknown) {
        lastError = err;
        const errMsg = err instanceof Error ? err.message : String(err);

        // Check if it's a rate limit error (429 or "retry" in message)
        const isRateLimit = errMsg.includes('429') || errMsg.toLowerCase().includes('retry') || errMsg.toLowerCase().includes('resource');

        if (isRateLimit && attempt < MAX_RETRIES) {
          console.log(`[AI Chat] Rate limited, retrying in ${RETRY_DELAYS[attempt]}ms (attempt ${attempt + 1}/${MAX_RETRIES})`);
          await sleep(RETRY_DELAYS[attempt]);
          continue;
        }

        // Not a rate limit error or out of retries
        break;
      }
    }

    // All retries failed
    const errorMessage = lastError instanceof Error ? lastError.message : String(lastError);
    const isRateLimit = errorMessage.includes('429') || errorMessage.toLowerCase().includes('retry');
    console.error('[AI Chat API Error]', errorMessage);

    if (isRateLimit) {
      return NextResponse.json({
        reply: RATE_LIMIT_MESSAGES[locale] || RATE_LIMIT_MESSAGES.vi,
      });
    }

    return NextResponse.json(
      { error: 'Internal server error', details: errorMessage },
      { status: 500 },
    );
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error('[AI Chat API Fatal Error]', errorMessage);
    return NextResponse.json(
      { error: 'Internal server error', details: errorMessage },
      { status: 500 },
    );
  }
};
