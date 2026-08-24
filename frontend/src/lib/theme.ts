import type React from "react";

/**
 * theme.ts — Strict Apple Design System Tokens (appledesign.md)
 *
 * Single Brand Accent Color: Action Blue (#0066cc)
 * No decorative gradients. Pure photographic and structural clarity.
 */

export const APPLE_COLORS = {
  // Brand & Accent
  primary: "#0066cc",          // Action Blue: universal interactive color
  primaryFocus: "#0071e3",     // Focus Blue: keyboard focus ring outline
  primaryOnDark: "#2997ff",    // Sky Link Blue: in-copy links on dark surfaces

  // Surface Canvas
  canvas: "#ffffff",           // Pure White: content, utility cards, store tiles
  canvasParchment: "#f5f5f7",  // Parchment: signature Apple off-white alternating canvas & footer
  surfacePearl: "#fafafc",     // Pearl Button: fill for secondary ghost/capsule buttons
  surfaceTile1: "#272729",     // Near-Black Tile 1: primary dark-tile surface
  surfaceTile2: "#2a2a2c",     // Near-Black Tile 2: micro-step lighter dark tile
  surfaceTile3: "#252527",     // Near-Black Tile 3: dark tile 3 / player frame
  surfaceBlack: "#000000",     // Pure Black: global nav bar, void overlays
  surfaceChipTranslucent: "rgba(210, 210, 215, 0.64)", // Translucent chip gray over photography

  // Text Ink
  ink: "#1d1d1f",              // Near-Black Ink: headlines & body on light surfaces
  body: "#1d1d1f",             // Default body copy tone
  bodyOnDark: "#ffffff",       // Text on dark tiles & global nav
  bodyMuted: "#86868b",        // Secondary copy on light/dark surfaces
  inkMuted80: "#333333",       // Secondary text on Pearl Button surfaces
  inkMuted48: "#6e6e73",       // Secondary labels, captions, and legal fine-print

  // Hairlines & Dividers
  hairline: "#e0e0e0",         // 1px hairline border on utility cards
  hairlineDark: "rgba(255, 255, 255, 0.12)",
  dividerSoft: "rgba(0, 0, 0, 0.04)",
  borderSubtle: "rgba(0, 0, 0, 0.08)",
} as const;

export const APPLE_RADII = {
  none: "0px",
  xs: "5px",
  sm: "8px",     // Dark utility buttons, thumbnail frames
  md: "11px",    // Pearl Button capsules
  lg: "18px",    // Utility cards, portrait visual cards, project frames
  pill: "9999px",// Blue pill CTAs, search inputs, tag chips
  full: "50%",   // Circular control chips
} as const;

export const APPLE_SHADOW = {
  // The SINGLE drop-shadow in the entire Apple design system (reserved for product/portrait imagery)
  product: "rgba(0, 0, 0, 0.22) 3px 5px 30px 0px",
  productLight: "0 12px 32px rgba(0, 0, 0, 0.08)",
} as const;

// Backward-compatible BRAND export mapping cleanly to Apple design language
export const BRAND = {
  primary: APPLE_COLORS.primary,
  primaryFocus: APPLE_COLORS.primaryFocus,
  primaryOnDark: APPLE_COLORS.primaryOnDark,
  primaryBg: "rgba(0, 102, 204, 0.08)",
  primaryBorder: "rgba(0, 102, 204, 0.28)",
  glow: "rgba(0, 102, 204, 0.25)",
  gradient: APPLE_COLORS.primary, // Apple uses solid Action Blue
  gradientHover: "#005bb5",
  ink: APPLE_COLORS.ink,
  muted: APPLE_COLORS.inkMuted48,
} as const;

export const STATUS = {
  success: "#1d8348",
  successBg: "rgba(46, 133, 64, 0.08)",
  successBorder: "rgba(46, 133, 64, 0.20)",

  warning: "#b76e00",
  warningBg: "rgba(183, 110, 0, 0.08)",
  warningBorder: "rgba(183, 110, 0, 0.20)",

  error: "#d70015",
  errorBg: "rgba(215, 0, 21, 0.08)",
  errorBorder: "rgba(215, 0, 21, 0.20)",

  info: APPLE_COLORS.primary,
  infoBg: "rgba(0, 102, 204, 0.08)",
  infoBorder: "rgba(0, 102, 204, 0.20)",
} as const;

export const SURFACE = {
  page: APPLE_COLORS.canvasParchment,
  card: APPLE_COLORS.canvas,
  elevated: APPLE_COLORS.surfacePearl,
  input: APPLE_COLORS.canvas,
  border: APPLE_COLORS.hairline,
} as const;

export const TEXT = {
  primary: APPLE_COLORS.ink,
  secondary: APPLE_COLORS.inkMuted48,
  muted: APPLE_COLORS.inkMuted48,
  onDark: APPLE_COLORS.bodyOnDark,
} as const;

export function availabilityStyle(av?: string): React.CSSProperties {
  if (av === "Available")
    return { background: STATUS.successBg, border: `1px solid ${STATUS.successBorder}`, color: STATUS.success };
  if (av === "Busy")
    return { background: STATUS.errorBg, border: `1px solid ${STATUS.errorBorder}`, color: STATUS.error };
  return { background: STATUS.warningBg, border: `1px solid ${STATUS.warningBorder}`, color: STATUS.warning };
}
