// Header.tsx - Sticky Navigation with transparent-to-solid effect
'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, ShoppingBag, User } from 'lucide-react';
import { useHeaderLogic } from './Header.logic';

// 🔧 UI CONFIGURATION
const HEADER_TRANSITION_DURATION = 0.3;
const MOBILE_MENU_DURATION = 0.25;

// Navigation items matching Canva design
const NAV_ITEMS = [
  { label: 'Service', href: '#services' },
  { label: 'Shop', href: '#shop' },
  { label: 'Service Area', href: '#branches' },
  { label: 'Blogs', href: '#blogs' },
  { label: 'Academy', href: '#academy' },
  { label: 'Spa home', href: '#hero' },
];

// Language flags (using ISO 3166-1 alpha-2 country codes for flagcdn)
const LANGUAGES = [
  { code: 'vi', countryCode: 'vn', label: 'Tiếng Việt' },
  { code: 'en', countryCode: 'gb', label: 'English' },
  { code: 'cn', countryCode: 'cn', label: '中文' },
  { code: 'jp', countryCode: 'jp', label: '日本語' },
  { code: 'kr', countryCode: 'kr', label: '한국어' },
];

const Header = () => {
  const { isMobileMenuOpen, isScrolled, toggleMobileMenu } = useHeaderLogic();

  return (
    <motion.header
      className={`site-header ${isScrolled ? 'header-scrolled' : 'header-transparent'}`}
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: HEADER_TRANSITION_DURATION, ease: 'easeOut' }}
    >
      <div className="header-inner">
        {/* Logo */}
        <a href="#hero" className="header-logo">
          <span className="header-logo-icon">✦</span>
          <div className="header-logo-text">
            <span className="header-logo-name">Ngân Hà</span>
            <span className="header-logo-sub">let us understand you</span>
          </div>
        </a>

        {/* Desktop Navigation */}
        <nav className="header-nav-desktop">
          {NAV_ITEMS.map((item) => (
            <a key={item.href} href={item.href} className="header-nav-link">
              {item.label}
            </a>
          ))}
        </nav>

        {/* Right Section: Languages, Login, Cart */}
        <div className="header-right">
          {/* Language Flags */}
          <div className="header-languages">
            {LANGUAGES.map((lang) => (
              <button
                key={lang.code}
                className="header-lang-btn"
                title={lang.label}
                aria-label={`Switch to ${lang.label}`}
              >
                <img
                  src={`https://flagcdn.com/w40/${lang.countryCode}.png`}
                  srcSet={`https://flagcdn.com/w80/${lang.countryCode}.png 2x`}
                  alt={lang.label}
                  className="header-lang-flag-img"
                />
              </button>
            ))}
          </div>

          {/* Login & Cart */}
          <a href="#login" className="header-icon-btn" aria-label="Log in">
            <User size={20} />
            <span className="header-icon-label">Log in</span>
          </a>
          <a href="#cart" className="header-icon-btn" aria-label="Cart">
            <ShoppingBag size={20} />
          </a>

          {/* Mobile Menu Toggle */}
          <button
            className="header-mobile-toggle"
            onClick={toggleMobileMenu}
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Drawer */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.nav
            className="header-mobile-menu"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: MOBILE_MENU_DURATION }}
          >
            {NAV_ITEMS.map((item) => (
              <a
                key={item.href}
                href={item.href}
                className="mobile-nav-link"
                onClick={toggleMobileMenu}
              >
                {item.label}
              </a>
            ))}
            <div className="mobile-lang-row">
              {LANGUAGES.map((lang) => (
                <button key={lang.code} className="header-lang-btn" title={lang.label}>
                  <img
                    src={`https://flagcdn.com/w40/${lang.countryCode}.png`}
                    srcSet={`https://flagcdn.com/w80/${lang.countryCode}.png 2x`}
                    alt={lang.label}
                    className="header-lang-flag-img"
                  />
                </button>
              ))}
            </div>
          </motion.nav>
        )}
      </AnimatePresence>
    </motion.header>
  );
};

export default Header;
