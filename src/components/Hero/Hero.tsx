// Hero.tsx - Cinematic Fullscreen Hero (Showcase Style)
'use client';

import { useMemo, useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { MapPin, Clock, ExternalLink, ChevronDown } from 'lucide-react';
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

const Hero = () => {
  const countdown = useCountdown();

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

      {/* Content */}
      <motion.div
        className="hero-content"
        initial="hidden"
        animate="visible"
        variants={heroStagger}
      >
        {/* Badge */}
        <motion.div className="hero-cinematic-badge" variants={fadeInDown}>
          {HERO_TEXT.badge}
        </motion.div>

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

        {/* Divider */}
        <motion.div className="hero-brand-divider" variants={scaleIn} />

        {/* Tagline */}
        <motion.p className="hero-cinematic-tagline" variants={fadeInUp}>
          {HERO_TEXT.tagline}
        </motion.p>

        {/* Countdown */}
        <motion.div className="hero-countdown" variants={fadeInUp}>
          <span className="hero-countdown__label">{HERO_TEXT.countdown.title}</span>
          <div className="hero-countdown__boxes">
            {[
              { value: countdown.days, label: HERO_TEXT.countdown.days },
              { value: countdown.hours, label: HERO_TEXT.countdown.hours },
              { value: countdown.minutes, label: HERO_TEXT.countdown.minutes },
              { value: countdown.seconds, label: HERO_TEXT.countdown.seconds },
            ].map((unit) => (
              <div key={unit.label} className="hero-countdown__unit">
                <span className="hero-countdown__num">{String(unit.value).padStart(2, '0')}</span>
                <span className="hero-countdown__text">{unit.label}</span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* CTA Buttons */}
        <motion.div className="hero-ctas" variants={fadeInUp}>
          <a href="#services" className="hero-cta-btn hero-cta-primary hero-cta--pill">
            {HERO_TEXT.cta1}
          </a>
          <a href="#booking" className="hero-cta-btn hero-cta-secondary hero-cta--pill">
            {HERO_TEXT.cta2}
          </a>
        </motion.div>

        {/* Scroll Hint */}
        <motion.div className="hero-scroll-hint" variants={fadeInUp}>
          <ChevronDown size={20} className="hero-scroll-icon" />
          <span>{HERO_TEXT.scrollHint}</span>
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
            <h3 className="branch-card-name">{branch.name}</h3>
            <div className="branch-card-info">
              <div className="branch-card-row">
                <MapPin size={14} />
                <span>{branch.address}</span>
              </div>
              <div className="branch-card-row">
                <Clock size={14} />
                <span>Open {branch.hours}</span>
              </div>
              <div className="branch-card-row">
                <Clock size={12} />
                <span className="branch-last-order">Last order: 11:30pm</span>
              </div>
            </div>
            <div className="branch-card-link">
              <ExternalLink size={14} />
              <span>Google Maps</span>
            </div>
          </a>
        ))}
      </motion.div>
    </section>
  );
};

export default Hero;
