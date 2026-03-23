// serviceImages.ts - Mapping from group key to local generated image path
// Images are generated AI images stored in /public/images/services/

// ═══════════════════════════════════════
// Service Image Mapping
// ═══════════════════════════════════════

/**
 * Maps a service group key (category_slug-name) to a local image path.
 * Falls back to a default image if no mapping is found.
 */

const DEFAULT_SERVICE_IMAGE = '/images/services/aroma-oil.png';

export const SERVICE_IMAGES: Record<string, string> = {
  // Body category
  'body_aroma-oil': '/images/services/aroma-oil.png',
  'body_coconut-oil': '/images/services/coconut-oil.png',
  'body_shiatsu': '/images/services/shiatsu.png',
  'body_hotstone': '/images/services/hotstone.png',
  'body_thai': '/images/services/thai.png',
  'body_four-hand': '/images/services/four-hand.png',

  // Foot category
  'foot_professional-foot-massage': '/images/services/foot-massage.png',
  'foot_foot-massage': '/images/services/foot-massage.png',

  // Hair Wash category
  'hair wash_hair-wash': '/images/services/hair-wash.png',
  'hair-wash_hair-wash': '/images/services/hair-wash.png',

  // Facial category
  'facial_facial': '/images/services/facial.png',

  // Ear Clean category
  'ear clean_ear-clean': '/images/services/ear-clean.png',
  'ear-clean_ear-clean': '/images/services/ear-clean.png',
};

/**
 * Get image path for a grouped service.
 * Tries exact match, then partial match by category, then default.
 */
export const getServiceImage = (groupKey: string): string => {
  // Try exact match
  if (SERVICE_IMAGES[groupKey]) {
    return SERVICE_IMAGES[groupKey];
  }

  // Try partial match (check if any key contains part of the groupKey)
  const lowerKey = groupKey.toLowerCase();
  for (const [key, path] of Object.entries(SERVICE_IMAGES)) {
    if (lowerKey.includes(key.split('_')[1]) || key.includes(lowerKey.split('_')[1])) {
      return path;
    }
  }

  // Try category-based match
  const category = lowerKey.split('_')[0];
  const categoryImages: Record<string, string> = {
    body: '/images/services/aroma-oil.png',
    foot: '/images/services/foot-massage.png',
    'hair wash': '/images/services/hair-wash.png',
    'hair-wash': '/images/services/hair-wash.png',
    facial: '/images/services/facial.png',
    'ear clean': '/images/services/ear-clean.png',
    'ear-clean': '/images/services/ear-clean.png',
    combo: '/images/services/aroma-oil.png',
  };

  return categoryImages[category] || DEFAULT_SERVICE_IMAGE;
};
