// Header.logic.ts - Header business logic
'use client';

import { useState, useEffect } from 'react';

export const useHeaderLogic = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY || window.pageYOffset || document.documentElement.scrollTop || 0;
      setIsScrolled(scrollY > 50);
    };

    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    document.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', handleScroll);
      document.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const toggleMobileMenu = () => setIsMobileMenuOpen((prev) => !prev);

  return { isMobileMenuOpen, isScrolled, toggleMobileMenu };
};
