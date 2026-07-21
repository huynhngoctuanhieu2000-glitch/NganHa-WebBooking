'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { Minimize2 } from 'lucide-react';

// 🔧 UI CONFIGURATION
const HEADER_HEIGHT_PX = 80;

const ServiceBook = () => {
  const [isFullscreen, setIsFullscreen] = useState(false);

  const handleMessage = useCallback((event: MessageEvent) => {
    if (!event.data || typeof event.data.type !== 'string') return;

    if (event.data.type === 'flipmenu:galaxy-entered') {
      setIsFullscreen(true);
    } else if (event.data.type === 'flipmenu:book-returned') {
      setIsFullscreen(false);
    }
  }, []);

  useEffect(() => {
    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, [handleMessage]);

  return (
    <div
      className={`w-full flex items-center justify-center transition-all duration-700 ${
        isFullscreen
          ? 'fixed left-0 right-0 bottom-0 z-[40] bg-[#0A0A0A] p-0'
          : 'min-h-[700px] py-8 relative'
      }`}
      style={isFullscreen ? { top: `${HEADER_HEIGHT_PX}px` } : undefined}
    >
      {isFullscreen && (
        <button
          onClick={() => setIsFullscreen(false)}
          className="absolute top-4 right-4 z-50 p-2 bg-white/10 hover:bg-white/20 text-white rounded-full backdrop-blur-sm transition-all"
          title="Thu nhỏ"
        >
          <Minimize2 size={22} />
        </button>
      )}

      <iframe
        src="/flipmenu/index.html"
        className={`w-full border-none overflow-hidden shadow-2xl transition-all duration-700 ${
          isFullscreen
            ? 'h-full max-w-full rounded-none'
            : 'max-w-[1200px] h-[700px] lg:h-[850px] rounded-2xl'
        }`}
        title="Ngan Ha Spa 3D Menu"
        allowFullScreen
      />
    </div>
  );
};

export default ServiceBook;
