'use client';

import React, { useRef, useState, useCallback, useEffect, forwardRef } from 'react';
import HTMLFlipBook from 'react-pageflip';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Clock, Sparkles, Loader2 } from 'lucide-react';

import { Service, getServiceName, getServiceDescription } from '@/types';
import { fetchServices } from '@/data/services';

// 🔧 UI CONFIGURATION
const BOOK_WIDTH = 550;
const BOOK_HEIGHT = 680;
const FLIP_DURATION = 1200; // ms
const SHOW_SHADOW = true;
const MOBILE_WIDTH = 340;
const MOBILE_HEIGHT = 580;

// Format price
const formatPrice = (price: number) => {
  return new Intl.NumberFormat('vi-VN').format(price);
};

// Page component wrapper (required by react-pageflip)
const Page = forwardRef<HTMLDivElement, { children: React.ReactNode; className?: string }>(
  ({ children, className = '' }, ref) => {
    return (
      <div ref={ref} className={`page ${className}`}>
        {children}
      </div>
    );
  }
);
Page.displayName = 'Page';

// Cover Page
const CoverPage = forwardRef<HTMLDivElement>((_, ref) => {
  return (
    <Page ref={ref} className="cover-page">
      <div className="cover-content">
        <div className="cover-ornament top" />
        <div className="cover-center">
          <Sparkles className="cover-icon" size={40} />
          <h1 className="cover-title">
            <span className="cover-title-sub">NGÂN HÀ</span>
            <span className="cover-title-main">SPA & BARBERSHOP</span>
          </h1>
          <div className="cover-divider" />
          <h2 className="cover-subtitle">Our Services</h2>
          <p className="cover-tagline">Premium Experience • Trải Nghiệm Đặc Quyền</p>
        </div>
        <div className="cover-ornament bottom" />
        <p className="cover-hint">Lật trang để xem dịch vụ →</p>
      </div>
    </Page>
  );
});
CoverPage.displayName = 'CoverPage';

// Service Page
const ServicePage = forwardRef<HTMLDivElement, { service: Service; index: number }>(
  ({ service, index }, ref) => {
    const name = getServiceName(service, 'en');
    const nameVi = getServiceName(service, 'vi');
    const description = getServiceDescription(service, 'en');
    const imageUrl = service.imageUrl || '/images/default-service.png';

    return (
      <Page ref={ref} className="service-page">
        <div className="service-content">
          {/* Page number */}
          <div className="page-number">{index + 1}</div>

          {/* Service image */}
          <div className="service-image-wrapper">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={imageUrl}
              alt={name}
              className="service-image"
              loading="eager"
            />
            <div className="service-image-overlay" />
          </div>

          {/* Service info */}
          <div className="service-info">
            <h3 className="service-name">{name}</h3>
            <p className="service-name-vi">{nameVi}</p>

            <div className="service-divider" />

            <p className="service-description">{description}</p>

            <div className="service-details">
              <div className="service-duration">
                <Clock size={16} />
                <span>{service.duration} minutes</span>
              </div>
            </div>

            <div className="service-pricing">
              <div className="price-vnd">{formatPrice(service.priceVND)}₫</div>
              <div className="price-divider">|</div>
              <div className="price-usd">${service.priceUSD}</div>
            </div>

            <button className="book-button">
              <Sparkles size={16} />
              <span>Đặt Lịch Ngay</span>
            </button>
          </div>
        </div>
      </Page>
    );
  }
);
ServicePage.displayName = 'ServicePage';

// Back Cover
const BackCover = forwardRef<HTMLDivElement>((_, ref) => {
  return (
    <Page ref={ref} className="back-cover">
      <div className="back-content">
        <div className="cover-ornament top" />
        <div className="back-center">
          <h2 className="back-title">Thank You</h2>
          <p className="back-subtitle">Cảm ơn quý khách</p>
          <div className="cover-divider" />
          <div className="back-info">
            <p>📍 11 Ngô Đức Kế, Q1, TP.HCM</p>
            <p>🕘 9:00 AM - 12:00 AM</p>
          </div>
          <button className="book-button large">
            <Sparkles size={20} />
            <span>BOOK NOW</span>
          </button>
        </div>
        <div className="cover-ornament bottom" />
      </div>
    </Page>
  );
});
BackCover.displayName = 'BackCover';

// Main ServiceBook Component
const ServiceBook = () => {
  const bookRef = useRef<any>(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [services, setServices] = useState<Service[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch services from Supabase
  useEffect(() => {
    const loadServices = async () => {
      setIsLoading(true);
      const data = await fetchServices();
      setServices(data);
      setIsLoading(false);
    };
    loadServices();
  }, []);

  const onFlip = useCallback((e: any) => {
    setCurrentPage(e.data);
  }, []);

  const onInit = useCallback((e: any) => {
    setTotalPages(e.data.pages);
  }, []);

  const goNext = () => {
    bookRef.current?.pageFlip()?.flipNext();
  };

  const goPrev = () => {
    bookRef.current?.pageFlip()?.flipPrev();
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="book-container flex items-center justify-center min-h-[400px]">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-10 h-10 text-[#D4AF37] animate-spin" />
          <p className="text-white/60 font-serif italic text-lg">Loading services...</p>
        </div>
      </div>
    );
  }

  // No services found
  if (services.length === 0) {
    return (
      <div className="book-container flex items-center justify-center min-h-[400px]">
        <p className="text-white/60 font-serif italic text-lg">No services available</p>
      </div>
    );
  }

  return (
    <motion.div
      className="book-container"
      initial={{ opacity: 0, y: 60, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
    >
      <div className="book-wrapper">
        <HTMLFlipBook
          ref={bookRef}
          width={BOOK_WIDTH}
          height={BOOK_HEIGHT}
          size="stretch"
          minWidth={MOBILE_WIDTH}
          minHeight={MOBILE_HEIGHT}
          maxWidth={BOOK_WIDTH}
          maxHeight={BOOK_HEIGHT}
          maxShadowOpacity={SHOW_SHADOW ? 0.6 : 0}
          showCover={true}
          flippingTime={FLIP_DURATION}
          className="service-book"
          startPage={0}
          drawShadow={SHOW_SHADOW}
          usePortrait={true}
          startZIndex={0}
          autoSize={true}
          clickEventForward={true}
          useMouseEvents={true}
          swipeDistance={30}
          showPageCorners={true}
          disableFlipByClick={false}
          onFlip={onFlip}
          onInit={onInit}
          mobileScrollSupport={false}
          style={{}}
        >
          <CoverPage />
          {services.map((service, index) => (
            <ServicePage key={service.id} service={service} index={index} />
          ))}
          <BackCover />
        </HTMLFlipBook>
      </div>

      {/* Navigation */}
      <motion.div
        className="book-navigation"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6, duration: 0.6 }}
      >
        <button
          onClick={goPrev}
          className="nav-button"
          disabled={currentPage === 0}
        >
          <ChevronLeft size={24} />
        </button>

        <div className="page-indicator">
          <AnimatePresence mode="wait">
            <motion.span
              key={currentPage}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              transition={{ duration: 0.2 }}
            >
              {currentPage === 0
                ? 'Bìa trước'
                : currentPage >= totalPages - 1
                ? 'Bìa sau'
                : `Dịch vụ ${currentPage} / ${services.length}`}
            </motion.span>
          </AnimatePresence>
        </div>

        <button
          onClick={goNext}
          className="nav-button"
          disabled={currentPage >= totalPages - 1}
        >
          <ChevronRight size={24} />
        </button>
      </motion.div>

      {/* Instruction */}
      <motion.p
        className="book-instruction"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2, duration: 0.8 }}
      >
        💡 Vuốt hoặc click vào cạnh trang để lật • Swipe or click page edge to flip
      </motion.p>
    </motion.div>
  );
};

export default ServiceBook;
