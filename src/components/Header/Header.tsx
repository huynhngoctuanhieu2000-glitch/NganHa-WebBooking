// Header.tsx - Sticky Navigation with transparent-to-solid effect
'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, ShoppingBag, User, ChevronDown } from 'lucide-react';
import { useHeaderLogic, LANGUAGES } from './Header.logic';

// 🔧 UI CONFIGURATION
const HEADER_TRANSITION_DURATION = 0.3;
const MOBILE_MENU_DURATION = 0.25;

// Navigation items matching Canva design
const NAV_ITEMS = [
  { label: 'Home', href: '/' },
  { label: 'Service', href: '#services' },
  { label: 'Shop', href: '#shop' },
  { label: 'Service Area', href: '#branches' },
  { label: 'Blogs', href: '#blogs' },
  { label: 'Academy', href: '#academy', isComingSoon: true },
  { label: 'Spa home', href: '#hero', isComingSoon: true },
];

const Header = () => {
  const { 
    isMobileMenuOpen, 
    isScrolled, 
    toggleMobileMenu,
    currentLang,
    isLangDropdownOpen,
    toggleLangDropdown,
    handleSelectLanguage,
    langDropdownRef
  } = useHeaderLogic();

  return (
    <motion.header
      className={`site-header ${isScrolled ? 'header-scrolled' : 'header-transparent'}`}
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: HEADER_TRANSITION_DURATION, ease: 'easeOut' }}
    >
      <div className="header-inner-container">
        {/* Top Row: Mobile Toggle, Logo, Right Controls, Desktop Navigation */}
        <div className="header-top-row">
          {/* Logo & Mobile Toggle on the left */}
          <div className="header-top-left">
            <button
              className="header-mobile-toggle"
              onClick={toggleMobileMenu}
              aria-label="Toggle menu"
            >
              {isMobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
            </button>

            <a href="#hero" className="header-logo">
              <span className="header-logo-icon">✦</span>
              <div className="header-logo-text">
                <span className="header-logo-name">Ngân Hà</span>
              </div>
            </a>
          </div>

          {/* Desktop Navigation Centered */}
          <nav className="header-nav-desktop">
            {NAV_ITEMS.map((item) => (
              <a 
                key={item.href} 
                href={item.href} 
                className={`header-nav-link ${item.isComingSoon ? 'dimmed' : ''}`}
              >
                {item.isComingSoon ? (
                  <span className="nav-item-coming-soon">
                    <span className="nav-text-primary">{item.label}</span>
                    <span className="nav-text-secondary">Coming Soon</span>
                  </span>
                ) : (
                  item.label
                )}
              </a>
            ))}
          </nav>

          {/* Right Section: Languages, Login, Cart */}
          <div className="header-right">
            {/* Language Flags (Desktop only) */}
            <div className="header-languages">
              {LANGUAGES.map((lang) => (
                <button
                  key={lang.code}
                  className={`header-lang-btn ${currentLang.code === lang.code ? 'active' : ''}`}
                  onClick={() => handleSelectLanguage(lang)}
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

            {/* Language Flag Selector (Mobile only, <= 1024px) */}
            <div className="mobile-lang-selector" ref={langDropdownRef}>
              <button 
                className="mobile-lang-btn" 
                onClick={toggleLangDropdown}
                aria-expanded={isLangDropdownOpen}
                aria-label="Select language"
              >
                <img
                  src={`https://flagcdn.com/w40/${currentLang.countryCode}.png`}
                  srcSet={`https://flagcdn.com/w80/${currentLang.countryCode}.png 2x`}
                  alt={currentLang.label}
                  className="header-lang-flag-img"
                />
                <ChevronDown size={14} className={`lang-chevron ${isLangDropdownOpen ? 'rotate' : ''}`} />
              </button>
              
              {/* Dropdown Menu */}
              <div className={`lang-dropdown-menu ${isLangDropdownOpen ? 'open' : ''}`}>
                {LANGUAGES.filter(l => l.code !== currentLang.code).map((lang) => (
                  <button
                    key={lang.code}
                    className="lang-dropdown-item"
                    onClick={() => handleSelectLanguage(lang)}
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
            </div>

            {/* Login & Cart */}
            <a href="#login" className="header-icon-btn" aria-label="Log in">
              <User size={20} />
            </a>
            <a href="#cart" className="header-icon-btn" aria-label="Cart">
              <ShoppingBag size={20} />
            </a>
          </div>
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
              <div key={item.href} className="mobile-nav-link-wrapper">
                <a
                  href={item.href}
                  className={`mobile-nav-link ${item.isComingSoon ? 'dimmed' : ''}`}
                  onClick={toggleMobileMenu}
                >
                  {item.label}
                </a>
                {item.isComingSoon && (
                  <span className="coming-soon-badge">Coming Soon</span>
                )}
              </div>
            ))}
          </motion.nav>
        )}
      </AnimatePresence>
    </motion.header>
  );
};

export default Header;
