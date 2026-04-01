import { LanguageCode } from './types';

// Hàm helper để lấy text theo ngôn ngữ
// Hỗ trợ fallback về 'en' nếu không tìm thấy ngôn ngữ yêu cầu
export const getText = (source: any, lang: string): string => {
    if (!source) return '';

    // Chuẩn hóa lang code (ví dụ 'vi' -> 'vi' nếu cần)
    // Giả sử source key luôn là lowercase hoặc uppercase tùy convention, ta sẽ check cả 2

    const key = lang.toLowerCase();

    // Check key trực tiếp
    if (source[key]) return source[key];

    // Fallback: Check các biến thể phổ biến
    if (key === 'vi' && source['vi']) return source['vi'];
    if (key === 'vi' && source['vi']) return source['vi'];

    // Check Uppercase key (VD trong data Service NAMES: { EN: "...", VN: "..." })
    const upperKey = key.toUpperCase();
    if (source[upperKey]) return source[upperKey];
    if (key === 'vi' && source['VN']) return source['VN'];

    // Default fallback
    return source['en'] || source['EN'] || '';
};
