import { NextRequest } from 'next/server';
import { createServerClient, type CookieOptions } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { apiResponse } from './apiResponse';

export type AuthContext = {
  user: any;
  supabase: ReturnType<typeof createServerClient>;
};

export type AuthHandler = (
  req: NextRequest,
  ctx: AuthContext,
  params?: any
) => Promise<Response> | Response;

/**
 * HOC Wrapper cho các Admin API routes.
 * Kiểm tra xác thực (cookies) và role admin.
 */
export const withAuth = (handler: AuthHandler) => {
  return async (req: NextRequest, context: any = {}) => {
    const { params } = context;
    try {
      const cookieStore = await cookies();
      
      const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
          cookies: {
            get(name: string) {
              return cookieStore.get(name)?.value;
            },
            set(name: string, value: string, options: CookieOptions) {
              // Not used in server contexts (API routes should just read)
            },
            remove(name: string, options: CookieOptions) {
              // Not used in server contexts
            },
          },
        }
      );

      const { data: { user }, error } = await supabase.auth.getUser();

      if (error || !user) {
        return apiResponse.error('Vui lòng đăng nhập', 'UNAUTHORIZED', 401);
      }

      // Kiểm tra role admin (tùy thuộc vào cách bạn lưu role: user_metadata hoặc bảng Users)
      // Tạm thời check email hoặc user_metadata.role
      const isAdmin = user.user_metadata?.role === 'admin' || user.email === 'admin@nganhaspa.com';
      
      if (!isAdmin) {
        return apiResponse.error('Không có quyền truy cập', 'FORBIDDEN', 403);
      }

      return await handler(req, { user, supabase }, params);
      
    } catch (error: any) {
      console.error('[API Error]', error);
      return apiResponse.error(error.message || 'Lỗi hệ thống', error.code || 'INTERNAL_ERROR', error.status || 500);
    }
  };
};
