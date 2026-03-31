// ═══════════════════════════════════════
// Category Images & Intent Filter Data
// Mapping for BookingForm Curator redesign
// ═══════════════════════════════════════

// 🔧 CONFIGURATION
export const INTENT_FILTERS = {
  relaxation: ['body', 'foot'],
  beauty: ['facial', 'hair wash', 'manicure & pedicure'],
  recovery: ['body', 'foot', 'additional'],
  grooming: ['barber', 'ear clean', 'heel skin shave'],
} as const;

export type IntentKey = keyof typeof INTENT_FILTERS;

export const INTENT_DISPLAY: Record<
  IntentKey,
  { labelVi: string; labelEn: string; emoji: string; description: string }
> = {
  relaxation: {
    labelVi: 'Thư giãn',
    labelEn: 'Relaxation',
    emoji: '😌',
    description: 'Massage, liệu pháp xoa dịu căng thẳng',
  },
  beauty: {
    labelVi: 'Làm đẹp',
    labelEn: 'Beauty',
    emoji: '✨',
    description: 'Chăm sóc da, tóc và móng',
  },
  recovery: {
    labelVi: 'Phục hồi',
    labelEn: 'Recovery',
    emoji: '💪',
    description: 'Trị liệu, phục hồi cơ thể',
  },
  grooming: {
    labelVi: 'Cắt tóc',
    labelEn: 'Grooming',
    emoji: '✂️',
    description: 'Tóc, râu và chăm sóc nam giới',
  },
};

export interface CategoryDisplayInfo {
  label: string;        // English label
  labelVi: string;      // Vietnamese label
  image: string;        // /public/images/* path
  gradient: string;     // Tailwind gradient classes (fallback)
  description: string;  // Short tagline
  descriptionVi: string;
  icon: string;         // Lucide icon name
}

/**
 * Display info for each service category.
 * Images are existing assets in /public/images/.
 */
export const CATEGORY_DISPLAY: Record<string, CategoryDisplayInfo> = {
  body: {
    label: 'Body Treatment',
    labelVi: 'Trị Liệu Cơ Thể',
    image: '/images/body-treatment-full.png',
    gradient: 'from-amber-900/80 to-stone-900/90',
    description: 'Deep muscle relaxation',
    descriptionVi: 'Thư giãn cơ sâu',
    icon: 'Sparkles',
  },
  facial: {
    label: 'Facial Care',
    labelVi: 'Chăm Sóc Da Mặt',
    image: '/images/facial.png',
    gradient: 'from-rose-900/80 to-stone-900/90',
    description: 'Radiant skin refresh',
    descriptionVi: 'Làn da rạng rỡ',
    icon: 'UserCircle',
  },
  'hair wash': {
    label: 'Hair Wash',
    labelVi: 'Gội Đầu',
    image: '/images/hair-wash.png',
    gradient: 'from-indigo-900/80 to-stone-900/90',
    description: 'Cleanse & nourish',
    descriptionVi: 'Làm sạch & dưỡng tóc',
    icon: 'Waves',
  },
  barber: {
    label: 'Barber',
    labelVi: 'Cắt Tóc & Cạo Râu',
    image: '/images/barbershop.png',
    gradient: 'from-zinc-800/80 to-stone-900/90',
    description: "Sharp & refined gentleman's cut",
    descriptionVi: 'Phong cách nam tính',
    icon: 'Scissors',
  },
  'ear clean': {
    label: 'Ear Clean',
    labelVi: 'Lấy Ráy Tai',
    image: '/images/ear-clean.png',
    gradient: 'from-teal-900/80 to-stone-900/90',
    description: 'Deep ear cleansing',
    descriptionVi: 'Vệ sinh tai sâu',
    icon: 'Zap',
  },
  foot: {
    label: 'Foot Care',
    labelVi: 'Chăm Sóc Bàn Chân',
    image: '/images/heel-care.png',
    gradient: 'from-emerald-900/80 to-stone-900/90',
    description: 'Soothing foot relief',
    descriptionVi: 'Thư giãn đôi chân',
    icon: 'Wind',
  },
  'heel skin shave': {
    label: 'Heel Care',
    labelVi: 'Chăm Sóc Gót Chân',
    image: '/images/heel-care.png',
    gradient: 'from-emerald-900/80 to-stone-900/90',
    description: 'Smooth & restore',
    descriptionVi: 'Làm đẹp gót chân',
    icon: 'Footprints',
  },
  'manicure & pedicure': {
    label: 'Nail Care',
    labelVi: 'Chăm Sóc Móng',
    image: '/images/facial.png',
    gradient: 'from-pink-900/80 to-stone-900/90',
    description: 'Beautiful nails',
    descriptionVi: 'Làm đẹp móng tay chân',
    icon: 'Hand',
  },
  additional: {
    label: 'Additional',
    labelVi: 'Dịch Vụ Khác',
    image: '/images/about-spa.png',
    gradient: 'from-violet-900/80 to-stone-900/90',
    description: 'Special treatments',
    descriptionVi: 'Các liệu trình đặc biệt',
    icon: 'PlusCircle',
  },
};

/**
 * Get display info for a category, with fallback.
 */
export const getCategoryDisplay = (category: string): CategoryDisplayInfo => {
  const key = category.toLowerCase().trim();
  return (
    CATEGORY_DISPLAY[key] ?? {
      label: category,
      labelVi: category,
      image: '/images/about-treatment.png',
      gradient: 'from-stone-800/80 to-stone-900/90',
      description: 'Premium service',
      descriptionVi: 'Dịch vụ cao cấp',
    }
  );
};
