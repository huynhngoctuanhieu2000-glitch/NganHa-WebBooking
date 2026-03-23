// ═══════════════════════════════════════
// Service Data Layer
// Fetch from Supabase via API, with fallback
// ═══════════════════════════════════════

import { Service } from '@/types';

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
    return json.services || [];
  } catch (err) {
    console.error('[fetchServices] Failed to fetch services:', err);
    return [];
  }
};
