import { Variants } from "framer-motion";

/**
 * Standardized easing curves and transition timings for Project K
 */
export const EASINGS = {
  easeOutQuart: [0.25, 1, 0.5, 1] as const,
  easeInOutQuart: [0.76, 0, 0.24, 1] as const,
  springGentle: { type: "spring", stiffness: 260, damping: 20 },
  springBouncy: { type: "spring", stiffness: 380, damping: 18 },
  springSnappy: { type: "spring", stiffness: 450, damping: 30 },
};

/**
 * Page & Container animation variants
 */
export const pageVariants: Variants = {
  initial: { opacity: 0, y: 14 },
  animate: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.35,
      ease: EASINGS.easeOutQuart,
    },
  },
  exit: {
    opacity: 0,
    y: -10,
    transition: {
      duration: 0.2,
      ease: EASINGS.easeInOutQuart,
    },
  },
};

/**
 * Stagger parent container variant
 */
export const staggerContainer = (staggerChildren = 0.08, delayChildren = 0): Variants => ({
  initial: {},
  animate: {
    transition: {
      staggerChildren,
      delayChildren,
    },
  },
});

/**
 * Item reveal variants (Fade In + Upward slide)
 */
export const fadeInUp: Variants = {
  initial: { opacity: 0, y: 20 },
  animate: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.45,
      ease: EASINGS.easeOutQuart,
    },
  },
};

/**
 * Item reveal variants (Fade In + Scale Up)
 */
export const fadeInScale: Variants = {
  initial: { opacity: 0, scale: 0.94 },
  animate: {
    opacity: 1,
    scale: 1,
    transition: {
      duration: 0.4,
      ease: EASINGS.easeOutQuart,
    },
  },
};

/**
 * Floating / pulse effect for logos & hero focal elements
 */
export const floatingHero: Variants = {
  initial: { y: 0 },
  animate: {
    y: [-4, 4, -4],
    transition: {
      duration: 4,
      repeat: Infinity,
      ease: "easeInOut",
    },
  },
};

/**
 * Interactive hover lift for cards
 */
export const hoverCardLift = {
  whileHover: {
    y: -4,
    transition: { duration: 0.2, ease: EASINGS.easeOutQuart },
  },
  whileTap: {
    scale: 0.98,
    transition: { duration: 0.1 },
  },
};

/**
 * Interactive button tap / hover
 */
export const tapPress = {
  whileHover: {
    scale: 1.02,
    transition: { duration: 0.15 },
  },
  whileTap: {
    scale: 0.97,
    transition: { duration: 0.1 },
  },
};
