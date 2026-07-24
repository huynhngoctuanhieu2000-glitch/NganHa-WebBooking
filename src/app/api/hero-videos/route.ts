import { NextResponse } from 'next/server';
import { apiResponse } from '@/lib/api/apiResponse';
import { getSupabaseAdmin } from '@/lib/supabase-server';

const DEFAULT_VIDEOS = [
  { id: '1', url: '/videos/video1.mp4', poster: 'https://i.ibb.co/fs2MBD4/hero-spa-bg.jpg', sort_order: 1 },
  { id: '0720', url: '/videos/0720.mp4', poster: 'https://i.ibb.co/fs2MBD4/hero-spa-bg.jpg', sort_order: 2 },
];

export async function GET() {
  try {
    const supabase = getSupabaseAdmin();
    const { data } = await supabase.from('SystemConfigs').select('value').eq('key', 'hero_videos').single();
    
    if (data && data.value && Array.isArray(data.value) && data.value.length > 0) {
      return apiResponse.success(data.value);
    }
    
    // Nếu chưa có, trả về default
    return apiResponse.success(DEFAULT_VIDEOS);
  } catch (error: any) {
    console.error('Lỗi khi lấy video trang chủ:', error);
    return apiResponse.success(DEFAULT_VIDEOS);
  }
}
