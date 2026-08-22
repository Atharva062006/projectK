import type React from "react";

/**
 * theme.ts — Centralized design tokens for Project K
 *
 * All brand-level color decisions live here.
 * You can effortlessly toggle or revert palettes by changing ACTIVE_PALETTE.
 */

// ─── Palette Presets ────────────────────────────────────────────────────────
export const PALETTES = {
  /**
   * Official 4-color club palette:
   * • Zest:         #E68B18 (Golden Amber)
   * • Burnt Sienna: #EB6348 (Warm Orange)
   * • Mandy:        #EC535A (Coral Rose)
   * • French Rose:  #EC3877 (Hot Magenta)
   */
  OKC_OFFICIAL: {
    zest: "#E68B18",
    burntSienna: "#EB6348",
    mandy: "#EC535A",
    frenchRose: "#EC3877",

    gradientStart: "#E68B18",
    primary: "#EB6348",
    accent: "#EC535A",
    gradientEnd: "#EC3877",

    gradient: "linear-gradient(135deg, #E68B18 0%, #EB6348 35%, #EC535A 70%, #EC3877 100%)",
    gradientHover: "linear-gradient(135deg, #D47B0E 0%, #D65136 35%, #D64249 70%, #D42866 100%)",
    glow: "rgba(235, 99, 72, 0.35)",

    primaryMuted: "#C44B30",
    primaryBg: "rgba(235, 99, 72, 0.08)",
    primaryBorder: "rgba(235, 99, 72, 0.28)",
  },

  /**
   * Previous High-Contrast Triad preset (easy 1-click revert)
   */
  PREVIOUS_TRIAD: {
    zest: "#F0A500",
    burntSienna: "#E8693F",
    mandy: "#E8693F",
    frenchRose: "#F0387A",

    gradientStart: "#F0A500",
    primary: "#E8693F",
    accent: "#E8693F",
    gradientEnd: "#F0387A",

    gradient: "linear-gradient(135deg, #F0A500 0%, #E8693F 50%, #F0387A 100%)",
    gradientHover: "linear-gradient(135deg, #D98F00 0%, #C4512B 50%, #CC2866 100%)",
    glow: "rgba(232, 105, 63, 0.35)",

    primaryMuted: "#C04A28",
    primaryBg: "rgba(232, 105, 63, 0.08)",
    primaryBorder: "rgba(232, 105, 63, 0.28)",
  },
} as const;

/**
 * ⚡ ACTIVE PALETTE SELECTOR:
 * Change this single reference to switch or revert the theme everywhere!
 */
export const ACTIVE_PALETTE = PALETTES.OKC_OFFICIAL;

// ─── Active Brand Exports ───────────────────────────────────────────────────
export const BRAND = {
  ...ACTIVE_PALETTE,
} as const;

// ─── Semantic Status Colors ─────────────────────────────────────────────────
export const STATUS = {
  success: "#4CAF7D",
  successBg: "rgba(76, 175, 125, 0.10)",
  successBorder: "rgba(76, 175, 125, 0.25)",

  warning: BRAND.zest,
  warningBg: "rgba(230, 139, 24, 0.10)",
  warningBorder: "rgba(230, 139, 24, 0.25)",

  error: BRAND.frenchRose,
  errorBg: "rgba(236, 56, 119, 0.10)",
  errorBorder: "rgba(236, 56, 119, 0.25)",

  info: BRAND.primary,
  infoBg: BRAND.primaryBg,
  infoBorder: BRAND.primaryBorder,
} as const;

// ─── Surface/Background Layers ──────────────────────────────────────────────
export const SURFACE = {
  page: "#0C0E0F",
  card: "#1C2023",
  elevated: "#21282D",
  input: "#1C2023",
  border: "rgba(255, 255, 255, 0.10)",
} as const;

// ─── Text Colors ────────────────────────────────────────────────────────────
export const TEXT = {
  primary: "#E8EDEB",
  secondary: "#89979B",
  muted: "#5C6C75",
} as const;

// ─── Availability Badge Helper ──────────────────────────────────────────────
export function availabilityStyle(av?: string): React.CSSProperties {
  if (av === "Available")
    return { background: STATUS.successBg, border: `1px solid ${STATUS.successBorder}`, color: STATUS.success };
  if (av === "Busy")
    return { background: STATUS.errorBg, border: `1px solid ${STATUS.errorBorder}`, color: STATUS.error };
  return { background: STATUS.warningBg, border: `1px solid ${STATUS.warningBorder}`, color: STATUS.warning };
}
