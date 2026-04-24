// ═══════════════════════════════════════
// Service Data Layer
// Fetch from Supabase via API, with fallback
// ═══════════════════════════════════════

import { Service } from '@/types';
import type { Service as MenuService, MultiLangString } from '@/components/Menu/types';

const toLocalizedRecord = (value?: MultiLangString | null): Record<string, string> | null => {
  if (!value) return null;

  const localized = Object.entries(value).reduce<Record<string, string>>((acc, [key, text]) => {
    if (typeof text === 'string' && text.trim().length > 0) {
      acc[key] = text;
    }
    return acc;
  }, {});

  return Object.keys(localized).length > 0 ? localized : null;
};

const mapMenuServiceToAppService = (service: MenuService): Service => ({
  id: service.id,
  code: service.id,
  nameVN: service.names?.vi || null,
  nameEN: service.names?.en || null,
  nameCN: service.names?.cn || null,
  nameJP: service.names?.jp || null,
  nameKR: service.names?.kr || null,
  description: toLocalizedRecord(service.descriptions),
  hint: toLocalizedRecord(service.HINT),
  priceVND: Number(service.priceVND) || 0,
  priceUSD: Number(service.priceUSD) || 0,
  duration: Number(service.timeValue) || 0,
  category: service.cat || null,
  imageUrl: service.img || null,
  isActive: service.ACTIVE !== false,
  isBestChoice: service.BEST_CHOICE === true,
  isBestSeller: service.BEST_SELLER === true,
  focusConfig: service.FOCUS_POSITION || null,
  tags: service.TAGS?.map((tag) => tag.vi || tag.en || '').filter(Boolean) || null,
  procedure: null,
  service_description: service.descriptions?.vi || service.descriptions?.en || null,
});

/**
 * Fetch active services from API endpoint.
 * Returns empty array on failure.
 */
export const fetchServices = async (): Promise<Service[]> => {
  try {
    const res = await fetch('/api/services', { cache: 'no-store' });
    if (!res.ok) {
      console.error('[fetchServices] API response not ok:', res.status);
      return [];
    }
    const json = await res.json();

    if (!Array.isArray(json)) {
      console.error('[fetchServices] Unexpected payload shape:', json);
      return [];
    }

    return json.map(mapMenuServiceToAppService);
  } catch (err) {
    console.error('[fetchServices] Failed to fetch services:', err);
    return [];
  }
};
