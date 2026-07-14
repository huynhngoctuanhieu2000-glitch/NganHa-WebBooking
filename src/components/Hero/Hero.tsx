// Hero.tsx - Cinematic Fullscreen Hero (Showcase Style)
'use client';

import { useMemo, useState, useEffect, useCallback, useRef } from 'react';
import { motion } from 'framer-motion';
import { MapPin, Clock, ExternalLink, ChevronDown, ChevronLeft, ChevronRight } from 'lucide-react';
import { BRANCH_LIST } from '@/data/branches';
import {
  heroStagger, fadeInUp, fadeInDown, heroTitle, scaleIn, branchEntrance,
} from './Hero.animation';

// 🔧 UI CONFIGURATION
const HERO_PARTICLE_COUNT = 30;
const COUNTDOWN_HOURS = 24;

// 🔧 TEXT CONTENT
const HERO_TEXT = {
  badge: '✦ Premium Spa & Barbershop ✦',
  subtitle: 'Hệ Thống',
  title: 'NGÂN HÀ',
  subTitle2: 'Barbershop & Spa',
  tagline: 'Nơi nghệ thuật chăm sóc gặp gỡ sự thư giãn đích thực',
  cta1: 'Khám Phá Dịch Vụ',
  cta2: 'Đặt Lịch Ngay',
  scrollHint: 'Cuộn xuống để khám phá',
  countdown: {
    title: 'Ưu đãi đặc biệt kết thúc sau:',
    days: 'Ngày',
    hours: 'Giờ',
    minutes: 'Phút',
    seconds: 'Giây',
  },
};

// ─── useCountdown Hook ───
const useCountdown = () => {
  const getTargetTime = useCallback(() => {
    const stored = typeof window !== 'undefined'
      ? localStorage.getItem('hero-countdown-target')
      : null;

    if (stored) {
      const target = parseInt(stored, 10);
      if (target > Date.now()) return target;
    }

    const target = Date.now() + COUNTDOWN_HOURS * 60 * 60 * 1000;
    if (typeof window !== 'undefined') {
      localStorage.setItem('hero-countdown-target', target.toString());
    }
    return target;
  }, []);

  const [targetTime] = useState(getTargetTime);
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    const tick = () => {
      const diff = Math.max(0, targetTime - Date.now());
      setTimeLeft({
        days: Math.floor(diff / (1000 * 60 * 60 * 24)),
        hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((diff / (1000 * 60)) % 60),
        seconds: Math.floor((diff / 1000) % 60),
      });
    };
    tick();
    const interval = setInterval(tick, 1000);
    return () => clearInterval(interval);
  }, [targetTime]);

  return timeLeft;
};

// ═══════════════════════════════════════════
// HERO COMPONENT
// ═══════════════════════════════════════════

// Video configurations
const HOMEPAGE_VIDEOS = [
  { id: '1', url: '/videos/video1.mp4', poster: 'https://i.ibb.co/fs2MBD4/hero-spa-bg.jpg' },
];

const Hero = () => {
  const countdown = useCountdown();
  const [activeVideoIndex, setActiveVideoIndex] = useState(0);
  const [loadedIndices, setLoadedIndices] = useState<number[]>([0]);
  
  const videoRefs = useRef<(HTMLVideoElement | null)[]>([]);
  const touchStartX = useRef(0);
  const touchEndX = useRef(0);
  const lastScrollTime = useRef(0);

  const handleNextVideo = useCallback(() => {
    setActiveVideoIndex((prev) => (prev + 1) % HOMEPAGE_VIDEOS.length);
  }, []);

  const handlePrevVideo = useCallback(() => {
    setActiveVideoIndex((prev) => (prev - 1 + HOMEPAGE_VIDEOS.length) % HOMEPAGE_VIDEOS.length);
  }, []);

  // Swipe detection
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.targetTouches[0].clientX;
    touchEndX.current = e.targetTouches[0].clientX;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    touchEndX.current = e.targetTouches[0].clientX;
  };

  const handleTouchEnd = () => {
    const diffX = touchStartX.current - touchEndX.current;
    const minSwipeDistance = 50;
    if (Math.abs(diffX) > minSwipeDistance) {
      if (diffX > 0) {
        handleNextVideo();
      } else {
        handlePrevVideo();
      }
    }
  };

  // Lazy load video index
  useEffect(() => {
    if (!loadedIndices.includes(activeVideoIndex)) {
      setLoadedIndices((prev) => [...prev, activeVideoIndex]);
    }
  }, [activeVideoIndex, loadedIndices]);

  // Handle Play/Pause
  useEffect(() => {
    videoRefs.current.forEach((video, idx) => {
      if (video) {
        if (idx === activeVideoIndex) {
          video.play().catch(() => {});
        } else {
          video.pause();
        }
      }
    });
  }, [activeVideoIndex, loadedIndices]);

  // Horizontal scroll trackpad detection with debounce
  useEffect(() => {
    const handleWheel = (e: WheelEvent) => {
      const now = Date.now();
      if (now - lastScrollTime.current < 800) return;

      // Detect horizontal scroll (trackpad)
      if (Math.abs(e.deltaX) > 20) {
        lastScrollTime.current = now;
        if (e.deltaX > 0) {
          handleNextVideo();
        } else {
          handlePrevVideo();
        }
      }
    };

    const element = document.getElementById('hero');
    if (element) {
      element.addEventListener('wheel', handleWheel, { passive: true });
    }
    return () => {
      if (element) {
        element.removeEventListener('wheel', handleWheel);
      }
    };
  }, [handleNextVideo, handlePrevVideo]);

  // Memoize particles to avoid hydration mismatch
  const particles = useMemo(() =>
    Array.from({ length: HERO_PARTICLE_COUNT }).map((_, i) => ({
      id: i,
      left: `${(i * 3.33) % 100}%`,
      top: `${(i * 7.77) % 100}%`,
      delay: `${(i * 0.2) % 6}s`,
      duration: `${4 + (i * 0.13) % 4}s`,
    })),
  []);

  return (
    <section id="hero" className="hero-section hero-section--cinematic">
      {/* Particles */}
      <div className="hero-particles">
        {particles.map((p) => (
          <div key={p.id} className="hero-particle" style={{
            left: p.left,
            top: p.top,
            animationDelay: p.delay,
            animationDuration: p.duration,
          }} />
        ))}
      </div>

      {/* Animated Gradient BG */}
      <div className="hero-gradient-bg" />

      {/* Background Videos with Lazy-load & Cross-fade */}
      <div 
        className="hero-bg"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {HOMEPAGE_VIDEOS.map((video, idx) => {
          const isActive = idx === activeVideoIndex;
          const isLoaded = loadedIndices.includes(idx);
          return (
            <div
              key={video.id}
              className={`hero-video-wrapper ${isActive ? 'active' : ''}`}
              style={{
                position: 'absolute',
                inset: 0,
                opacity: isActive ? 1 : 0,
                transition: 'opacity 800ms ease-in-out',
                zIndex: isActive ? 1 : 0,
              }}
            >
              {isLoaded ? (
                <video
                  ref={(el) => {
                    videoRefs.current[idx] = el;
                  }}
                  className="hero-video"
                  src={video.url}
                  poster={video.poster}
                  autoPlay={isActive}
                  muted
                  loop
                  playsInline
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                  }}
                />
              ) : (
                <div
                  className="hero-image"
                  style={{ backgroundImage: `url(${video.poster})` }}
                />
              )}
            </div>
          );
        })}
        <div className="hero-overlay" style={{ zIndex: 2 }} />
      </div>

      {/* Content */}
      <motion.div
        className="hero-content"
        initial="hidden"
        animate="visible"
        variants={heroStagger}
      >


        {/* Subtitle */}
        <motion.span className="hero-cinematic-sub" variants={fadeInUp}>
          {HERO_TEXT.subtitle}
        </motion.span>

        {/* Main Title */}
        <motion.h1 className="hero-cinematic-title" variants={heroTitle}>
          {HERO_TEXT.title}
        </motion.h1>

        {/* Sub Title 2 */}
        <motion.span className="hero-cinematic-sub2" variants={fadeInUp}>
          {HERO_TEXT.subTitle2}
        </motion.span>



        {/* Countdown */}
        <motion.div className="hero-countdown" variants={fadeInUp}>
          <div className="hero-countdown__label">{HERO_TEXT.countdown.title}</div>
          <div className="hero-countdown__boxes">
            {Object.entries(countdown).map(([unit, value]) => (
              <div key={unit} className="hero-countdown__unit">
                <span className="hero-countdown__num">{value.toString().padStart(2, '0')}</span>
                <span className="hero-countdown__text">{HERO_TEXT.countdown[unit as keyof typeof HERO_TEXT.countdown] || unit}</span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* CTA Buttons */}
        <motion.div className="hero-ctas" variants={fadeInUp}>
          <a href="#services" className="hero-cta-btn hero-cta-primary hero-cta--pill">
            {HERO_TEXT.cta1}
          </a>
          <a href="/en/new-user/select-menu" className="hero-cta-btn hero-cta-secondary hero-cta--pill">
            {HERO_TEXT.cta2}
          </a>
        </motion.div>

        {/* Chevrons Navigation for Desktop */}
        {HOMEPAGE_VIDEOS.length > 1 && (
          <div className="hero-nav-controls" style={{ zIndex: 10 }}>
            <button
              onClick={handlePrevVideo}
              className="hero-nav-arrow hero-nav-arrow--left"
              aria-label="Previous Video"
            >
              <ChevronLeft size={28} />
            </button>
            <button
              onClick={handleNextVideo}
              className="hero-nav-arrow hero-nav-arrow--right"
              aria-label="Next Video"
            >
              <ChevronRight size={28} />
            </button>
          </div>
        )}

        {/* Pagination Dots & Text */}
        {HOMEPAGE_VIDEOS.length > 1 && (
          <div className="hero-pagination" style={{ zIndex: 10 }}>
            <span className="hero-pagination-number">
              {String(activeVideoIndex + 1).padStart(2, '0')} / {String(HOMEPAGE_VIDEOS.length).padStart(2, '0')}
            </span>
            <div className="hero-pagination-dots">
              {HOMEPAGE_VIDEOS.map((_, idx) => (
                <button
                  key={idx}
                  className={`hero-pagination-dot ${idx === activeVideoIndex ? 'active' : ''}`}
                  onClick={() => setActiveVideoIndex(idx)}
                  aria-label={`Go to video ${idx + 1}`}
                />
              ))}
            </div>
          </div>
        )}

        {/* Scroll Hint */}
        <motion.div className="hero-scroll-hint" variants={fadeInUp}>
          <ChevronDown size={20} className="hero-scroll-icon" />
          <span className="hero-scroll-text">{HERO_TEXT.scrollHint}</span>
        </motion.div>
      </motion.div>

      {/* Branch Cards — kept below hero content */}
      <motion.div
        className="hero-branches"
        variants={branchEntrance}
        initial="hidden"
        animate="visible"
      >
        {BRANCH_LIST.map((branch) => (
          <a
            key={branch.id}
            href={branch.googleMaps}
            target="_blank"
            rel="noopener noreferrer"
            className="branch-card"
          >
            <div className="branch-card-info">
              <div className="branch-card-row">
                <MapPin size={18} />
                <span>{branch.address}</span>
              </div>
              <div className="branch-card-row">
                <Clock size={18} />
                <span>Open {branch.hours}</span>
              </div>
              <div className="branch-card-row">
                <Clock size={18} />
                <span className="branch-last-order">Last order: 11:30pm</span>
              </div>
            </div>
          </a>
        ))}
      </motion.div>
    </section>
  );
};

export default Hero;
