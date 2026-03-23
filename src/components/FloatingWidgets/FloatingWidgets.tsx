// FloatingWidgets.tsx - Fixed contact buttons (right side) + Voice Search
'use client';

import { MapPin, Phone, MessageCircle } from 'lucide-react';
import { SOCIAL_LINKS, BRANCHES } from '@/lib/constants';
import VoiceSearch from '@/components/VoiceSearch/VoiceSearch';

// 🔧 UI CONFIGURATION
const WIDGET_SIZE = 44; // Touch target >= 44px (mobile-first)
const WIDGET_GAP = 12;

const FloatingWidgets = () => {
  return (
    <div
      className="floating-widgets"
      style={{ gap: `${WIDGET_GAP}px` }}
    >
      {/* AI Voice Search */}
      <VoiceSearch />

      {/* Location - Google Maps */}
      <a
        href={BRANCHES.BARBERSHOP.googleMaps}
        target="_blank"
        rel="noopener noreferrer"
        className="floating-btn floating-location"
        aria-label="View on Google Maps"
        style={{ width: WIDGET_SIZE, height: WIDGET_SIZE }}
      >
        <MapPin size={20} />
      </a>

      {/* Hotline */}
      <a
        href={SOCIAL_LINKS.HOTLINE}
        className="floating-btn floating-phone"
        aria-label="Call hotline"
        style={{ width: WIDGET_SIZE, height: WIDGET_SIZE }}
      >
        <Phone size={20} />
      </a>

      {/* Chat - Zalo */}
      <a
        href={SOCIAL_LINKS.ZALO}
        target="_blank"
        rel="noopener noreferrer"
        className="floating-btn floating-chat"
        aria-label="Chat on Zalo"
        style={{ width: WIDGET_SIZE, height: WIDGET_SIZE }}
      >
        <MessageCircle size={20} />
      </a>
    </div>
  );
};

export default FloatingWidgets;
