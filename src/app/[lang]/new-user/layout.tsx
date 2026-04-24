'use client';

import React, { useEffect } from 'react';
import { MenuProvider } from '@/components/Menu/MenuContext';
import IOSViewportFix from '@/components/IOSViewportFix';

export default function NewUserLayout({ children }: { children: React.ReactNode }) {
    // Khóa cuộn của toàn bộ trang (Cả html và body) để triệt tiêu 100% thanh cuộn desktop
    useEffect(() => {
        const originalHtmlOverflow = document.documentElement.style.overflow;
        const originalBodyOverflow = document.body.style.overflow;
        
        document.documentElement.style.overflow = 'hidden';
        document.body.style.overflow = 'hidden';
        
        return () => {
            document.documentElement.style.overflow = originalHtmlOverflow;
            document.body.style.overflow = originalBodyOverflow;
        };
    }, []);

    return (
        <MenuProvider>
            <IOSViewportFix />
            <div 
                className="fixed inset-0 w-full overflow-hidden bg-black z-50"
                style={{ height: 'var(--app-height, 100dvh)' }}
            >
                {children}
            </div>
        </MenuProvider>
    );
}
