// Hero.animation.ts - Entrance animations
export const heroAnimations = {
  container: { initial: { opacity: 0 }, animate: { opacity: 1 }, transition: { duration: 1 } },
  title: { initial: { y: 40, opacity: 0 }, animate: { y: 0, opacity: 1 }, transition: { delay: 0.3, duration: 0.8 } },
  cta: { initial: { y: 20, opacity: 0 }, animate: { y: 0, opacity: 1 }, transition: { delay: 0.6, duration: 0.6 } },
};
