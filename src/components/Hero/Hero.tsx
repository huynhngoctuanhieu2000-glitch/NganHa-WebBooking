// Hero.tsx - Fullscreen Hero Section with Background Image/Video
'use client';

import { motion } from 'framer-motion';
import { MapPin, Clock, ExternalLink } from 'lucide-react';
import { BRANCH_LIST } from '@/data/branches';
import { heroAnimations } from './Hero.animation';

// 🔧 UI CONFIGURATION
const HERO_MIN_HEIGHT = '100vh';
const OVERLAY_OPACITY = 0.55;
const CTA_BORDER_RADIUS = '8px';
const BRANCH_CARD_BLUR = '16px';

const Hero = () => {
  // TODO: Replace with Supabase Storage URL when video is ready
  const heroVideoUrl = process.env.NEXT_PUBLIC_HERO_VIDEO_URL || '';
  const heroImageUrl = '/images/hero-bg.png';

  return (
    <section id="hero" className="hero-section">
      {/* Background: Video or Image fallback */}
      <div className="hero-bg">
        {heroVideoUrl ? (
          <video
            className="hero-video"
            autoPlay
            muted
            loop
            playsInline
            poster={heroImageUrl}
          >
            <source src={heroVideoUrl} type="video/mp4" />
          </video>
        ) : (
          <div
            className="hero-image"
            style={{ backgroundImage: `url(${heroImageUrl})` }}
          />
        )}
        <div
          className="hero-overlay"
          style={{ '--overlay-opacity': OVERLAY_OPACITY } as React.CSSProperties}
        />
      </div>

      {/* Hero Content */}
      <div className="hero-content">
        {/* Logo & Branding */}
        <motion.div
          className="hero-branding"
          {...heroAnimations.title}
        >
          <span className="hero-brand-sub">NGÂN HÀ</span>
          <h1 className="hero-brand-main">Barbershop & Spa</h1>
          <div className="hero-brand-divider" />
          <p className="hero-brand-tagline">Premium Experience Since 2020</p>
        </motion.div>

        {/* CTA Buttons */}
        <motion.div
          className="hero-ctas"
          {...heroAnimations.cta}
        >
          <a
            href="#booking"
            className="hero-cta-btn hero-cta-primary"
            style={{ borderRadius: CTA_BORDER_RADIUS }}
          >
            BOOK NOW
          </a>
          <a
            href="#promotions"
            className="hero-cta-btn hero-cta-secondary"
            style={{ borderRadius: CTA_BORDER_RADIUS }}
          >
            PROMOTIONS
          </a>
        </motion.div>

        {/* Branch Cards */}
        <motion.div
          className="hero-branches"
          initial={{ y: 40, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.9, duration: 0.7 }}
        >
          {BRANCH_LIST.map((branch) => (
            <a
              key={branch.id}
              href={branch.googleMaps}
              target="_blank"
              rel="noopener noreferrer"
              className="branch-card"
              style={{ backdropFilter: `blur(${BRANCH_CARD_BLUR})` }}
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
      </div>
    </section>
  );
};

export default Hero;
