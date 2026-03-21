'use client';

import React, { useRef, useState, useCallback, forwardRef } from 'react';
import HTMLFlipBook from 'react-pageflip';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Clock, Sparkles } from 'lucide-react';
import Image from 'next/image';

// 🔧 UI CONFIGURATION
const BOOK_WIDTH = 550;
const BOOK_HEIGHT = 680;
const FLIP_DURATION = 1200; // ms
const SHOW_SHADOW = true;
const MOBILE_WIDTH = 340;
const MOBILE_HEIGHT = 580;

// Service data
const SERVICES = [
  {
    id: 1,
    name: 'Ear Clean Package',
    nameVi: 'Gói Lấy Ráy Tai',
    description: 'Ear Cleaning / Head Neck Shoulder / Foot Massage with Herbal Wash',
    descriptionVi: 'Lấy ráy tai / Massage đầu cổ vai / Massage chân với thảo dược',
    duration: 70,
    priceVND: 650000,
    priceUSD: 30,
    image: '/images/ear-clean.png',
    color: '#C9A348',
  },
  {
    id: 2,
    name: 'Heel Skin Shave Package',
    nameVi: 'Gói Cạo Da Gót Chân',
    description: 'Heel Skin Shave / Foot Massage with Herbal Wash',
    descriptionVi: 'Cạo da gót chân / Massage chân với thảo dược',
    duration: 70,
    priceVND: 600000,
    priceUSD: 27,
    image: '/images/heel-care.png',
    color: '#D4AF37',
  },
  {
    id: 3,
    name: 'Hair Wash Package',
    nameVi: 'Gói Gội Đầu Dưỡng Sinh',
    description: 'Hair Wash / Head Neck Shoulder / Body & Foot Massage',
    descriptionVi: 'Gội đầu / Massage đầu cổ vai / Massage toàn thân & chân',
    duration: 90,
    priceVND: 770000,
    priceUSD: 35,
    image: '/images/hair-wash.png',
    color: '#B8860B',
  },
  {
    id: 4,
    name: 'Facial Package',
    nameVi: 'Gói Chăm Sóc Da Mặt',
    description: 'Facial / Shave / Head Neck Shoulder / Quick Hair Wash / Body & Foot Massage',
    descriptionVi: 'Chăm sóc da mặt / Cạo mặt / Massage đầu cổ vai / Gội nhanh / Massage toàn thân',
    duration: 90,
    priceVND: 800000,
    priceUSD: 36,
    image: '/images/facial.png',
    color: '#DAA520',
  },
  {
    id: 5,
    name: 'Barbershop Package',
    nameVi: 'Gói Barbershop',
    description: 'Beard Shave / Nail Cut / Body Massage / Ear Clean / Heel Shave / Hair Wash / Face Mask',
    descriptionVi: 'Cạo râu / Cắt móng / Massage toàn thân / Lấy ráy tai / Cạo gót / Gội đầu / Đắp mặt nạ',
    duration: 120,
    priceVND: 800000,
    priceUSD: 39,
    image: '/images/barbershop.png',
    color: '#E8B931',
    note: 'Available 11am - 7pm',
  },
];

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
const ServicePage = forwardRef<HTMLDivElement, { service: typeof SERVICES[0]; index: number }>(
  ({ service, index }, ref) => {
    return (
      <Page ref={ref} className="service-page">
        <div className="service-content">
          {/* Page number */}
          <div className="page-number">{index + 1}</div>

          {/* Service image */}
          <div className="service-image-wrapper">
            <Image
              src={service.image}
              alt={service.name}
              width={500}
              height={260}
              className="service-image"
              priority
            />
            <div className="service-image-overlay" />
            {service.note && (
              <div className="service-badge">{service.note}</div>
            )}
          </div>

          {/* Service info */}
          <div className="service-info">
            <h3 className="service-name">{service.name}</h3>
            <p className="service-name-vi">{service.nameVi}</p>

            <div className="service-divider" />

            <p className="service-description">{service.description}</p>

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
          {SERVICES.map((service, index) => (
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
                : `Dịch vụ ${currentPage} / ${SERVICES.length}`}
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
