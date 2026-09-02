/**
 * animations.ts — Apple Micro-interaction physics & transitions
 *
 * Micro-interactions in the Apple design system:
 * - Active state: transform: scale(0.95)
 * - Transitions: smooth cubic-bezier easing
 */
import type { Variants } from "framer-motion";

export const appleEase: [number, number, number, number] = [0.25, 1, 0.5, 1];

export const pageVariants: Variants = {
  initial: { opacity: 0 },
  animate: { opacity: 1, transition: { duration: 0.12, ease: "easeOut" } },
  exit: { opacity: 0, transition: { duration: 0.1, ease: "easeIn" } },
};

export const fadeInUp: Variants = {
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.45, ease: appleEase } },
};

export const fadeInScale: Variants = {
  initial: { opacity: 0, scale: 0.98 },
  animate: { opacity: 1, scale: 1, transition: { duration: 0.4, ease: appleEase } },
};

export const staggerContainer = (staggerChildren = 0.08, delayChildren = 0): Variants => ({
  initial: {},
  animate: {
    transition: {
      staggerChildren,
      delayChildren,
    },
  },
});

export const floatingHero: Variants = {
  initial: { y: 0 },
  animate: {
    y: [-3, 3, -3],
    transition: {
      duration: 6,
      repeat: Infinity,
      ease: "easeInOut",
    },
  },
};
