/*
 * File: Standard/Footer.tsx
 * Chức năng: Thanh trạng thái (Status Bar) dưới cùng.
 * Logic chi tiết:
 * - Hiển thị tổng tiền (VND & USD) và tổng số lượng items trong cart.
 * - Nút "Back": Quay lại trang Home/Lựa chọn Menu.
 * - Nút "Cart": Mở CartDrawer để xem chi tiết giỏ hàng.
 * - Sử dụng animation slide-up nhe khi xuất hiện.
 * Tác giả: TunHisu
 * Ngày cập nhật: 2026-01-31
 */
'use client';
import React from 'react';
import { ShoppingCart, ArrowLeft, ArrowRight } from 'lucide-react';
import { formatCurrency } from '@/components/Menu/utils';

interface FooterProps {
    totalVND: number;
    totalUSD: number;
    totalItems: number;
    maxMinutes: number;
    lang: string;
    onBack: () => void;
    onToggleCart: () => void;
}

const TEXT = {
    total_est: { vi: 'TỔNG DỰ KIẾN', en: 'TOTAL ESTIMATED', cn: '预计总额', jp: '合計(推定)', kr: '예상 합계' },
    back: { vi: 'QUAY LẠI', en: 'BACK', cn: '返回', jp: '戻る', kr: '뒤로' },
    mins: { vi: 'phút', en: 'mins', cn: '分钟', jp: '分', kr: '분' },
};

export default function Footer({ totalVND, totalUSD, totalItems, maxMinutes, lang, onBack, onToggleCart }: FooterProps) {
    const t = (key: keyof typeof TEXT) => TEXT[key][lang as keyof typeof TEXT['total_est']] || TEXT[key]['en'];

    return (
        <div
            className="w-full px-4 flex items-center justify-between gap-3 animate-[slide-up_0.3s_ease-out] bg-[#111111] border-t border-gray-800 shadow-[0_-4px_20px_rgba(0,0,0,0.5)]"
            style={{
                position: 'fixed',
                bottom: 0,
                left: 0,
                right: 0,
                zIndex: 50,
                paddingTop: '1rem',
                paddingBottom: 'calc(1rem + env(safe-area-inset-bottom))'
            }}
        >

            {/* Nút Back (vòng tròn tối) */}
            <button onClick={onBack} className="w-12 h-12 shrink-0 rounded-full bg-[#1e1e1e] border border-gray-800 flex items-center justify-center text-white hover:bg-gray-800 active:scale-95 transition-all shadow-lg">
                <ArrowLeft size={20} />
            </button>

            {/* Thông tin Tiền & Thời gian */}
            <div className="flex-1 flex flex-col justify-center min-w-0 h-12">
                {maxMinutes > 0 && (
                    <div className="text-[10px] text-gray-400 font-bold tracking-[0.15em] uppercase flex items-center justify-center gap-1 whitespace-nowrap leading-none mb-1">
                        {t('total_est')} <span className="text-[#d4af37] font-bold ml-1">• {maxMinutes} {t('mins')}</span>
                    </div>
                )}
                <div className="flex items-baseline justify-center gap-1.5 whitespace-nowrap">
                    <span className="text-[20px] font-black text-white leading-none">{formatCurrency(totalVND)}</span>
                    <span className="text-[11px] text-gray-500 font-bold leading-none">VND</span>

                    <span className="text-gray-500 mx-0.5 text-sm font-light leading-none">/</span>

                    <span className="text-[20px] font-black text-red-600 leading-none">{totalUSD}</span>
                    <span className="text-[11px] text-red-600 font-bold leading-none">USD</span>
                </div>
            </div>

            {/* Nút Giỏ hàng (Nâu vàng bo góc vuông) */}
            <button onClick={onToggleCart} className="h-12 w-[72px] shrink-0 bg-[#d4af37] text-black rounded-[14px] shadow-lg active:scale-95 transition-all flex items-center justify-center gap-1.5 relative overflow-visible">
                <ShoppingCart className="w-[18px] h-[18px]" strokeWidth={2.5} />
                <ArrowRight className="w-[16px] h-[16px] animate-slide-right" strokeWidth={2.5} />
                <span className={`absolute -top-1.5 -right-1.5 bg-red-600 text-white text-[10px] font-bold w-5 h-5 flex items-center justify-center rounded-full border border-[#111111] transition-all transform duration-300 ${totalItems > 0 ? 'opacity-100 scale-100' : 'opacity-0 scale-0'}`}>{totalItems}</span>
            </button>
        </div>
    );
}