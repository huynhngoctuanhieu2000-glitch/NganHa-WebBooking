// ═══════════════════════════════════════
// BookingForm Animation Variants
// Framer Motion animation definitions
// ═══════════════════════════════════════

import { Variants } from 'framer-motion';

// 🔧 ANIMATION CONFIGURATION
const STEP_DURATION = 0.4;
const STEP_OFFSET = 60;
const CARD_SCALE_HOVER = 1.02;
const SUMMARY_FLOAT_Y = 6;

/**
 * Step slide transition for mobile wizard
 * Direction: 1 = forward (slide left), -1 = backward (slide right)
 */
export const stepSlideVariants: Variants = {
  enter: (direction: number) => ({
    x: direction > 0 ? STEP_OFFSET : -STEP_OFFSET,
    opacity: 0,
  }),
  center: {
    x: 0,
    opacity: 1,
    transition: {
      duration: STEP_DURATION,
      ease: [0.25, 0.1, 0.25, 1],
    },
  },
  exit: (direction: number) => ({
    x: direction > 0 ? -STEP_OFFSET : STEP_OFFSET,
    opacity: 0,
    transition: {
      duration: STEP_DURATION * 0.8,
      ease: [0.25, 0.1, 0.25, 1],
    },
  }),
};

/**
 * Fade in for desktop sections
 */
export const sectionFadeVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: (delay: number = 0) => ({
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      delay: delay * 0.1,
      ease: [0.25, 0.1, 0.25, 1],
    },
  }),
};

/**
 * Service card hover effect
 */
export const serviceCardVariants: Variants = {
  idle: { scale: 1 },
  hover: {
    scale: CARD_SCALE_HOVER,
    transition: { duration: 0.2, ease: 'easeOut' },
  },
  tap: {
    scale: 0.98,
    transition: { duration: 0.1 },
  },
  selected: {
    scale: 1,
    transition: { duration: 0.2 },
  },
};

/**
 * Summary sidebar subtle floating animation
 */
export const summaryFloatVariants: Variants = {
  animate: {
    y: [0, -SUMMARY_FLOAT_Y, 0],
    transition: {
      duration: 4,
      repeat: Infinity,
      ease: 'easeInOut',
    },
  },
};

/**
 * Stagger children container
 */
export const staggerContainerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.06,
      delayChildren: 0.1,
    },
  },
};

/**
 * Stagger item
 */
export const staggerItemVariants: Variants = {
  hidden: { opacity: 0, y: 12 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.35, ease: 'easeOut' },
  },
};

/**
 * Progress bar fill
 */
export const progressBarVariants: Variants = {
  initial: { scaleX: 0 },
  animate: (progress: number) => ({
    scaleX: progress,
    transition: { duration: 0.5, ease: [0.25, 0.1, 0.25, 1] },
  }),
};
