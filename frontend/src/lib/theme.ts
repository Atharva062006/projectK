import type React from "react";

/**
 * theme.ts — Centralized design tokens for Project K
 *
 * All brand-level color decisions live here.
 * Disciplinary palette: Linear/Vercel/GitHub restraint.
 * Brand accent color is reserved exclusively for primary actions, active states, and logos.
 */

// ─── Palette Presets ────────────────────────────────────────────────────────
export const PALETTES = {
  /**
   * Refined single-hue warm amber/orange palette
   */
  OKC_OFFICIAL: {
    zest: "#E68B18",
    burntSienna: "#EB6348",
    mandy: "#EB6348",
    frenchRose: "#E68B18",

    gradientStart: "#E68B18",
    primary: "#EB6348",
    accent: "#EB6348",
    gradientEnd: "#E68B18",

    gradient: "linear-gradient(135deg, #E68B18 0%, #EB6348 100%)",
    gradientHover: "linear-gradient(135deg, #D47B0E 0%, #D65136 100%)",
    glow: "rgba(235, 99, 72, 0.20)",

    primaryMuted: "#C44B30",
    primaryBg: "rgba(235, 99, 72, 0.08)",
    primaryBorder: "rgba(235, 99, 72, 0.24)",
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
    glow: "rgba(232, 105, 63, 0.25)",

    primaryMuted: "#C04A28",
    primaryBg: "rgba(232, 105, 63, 0.08)",
    primaryBorder: "rgba(232, 105, 63, 0.24)",
  },
} as const;

/**
 * ⚡ ACTIVE PALETTE SELECTOR:
 */
export const ACTIVE_PALETTE = PALETTES.OKC_OFFICIAL;

// ─── Active Brand Exports ───────────────────────────────────────────────────
export const BRAND = {
  ...ACTIVE_PALETTE,
} as const;

// ─── Semantic Status Colors (Isolated from Brand Accent) ────────────────────
export const STATUS = {
  success: "#30A46C",
  successBg: "rgba(48, 164, 108, 0.12)",
  successBorder: "rgba(48, 164, 108, 0.25)",

  warning: "#F5A623",
  warningBg: "rgba(245, 166, 35, 0.12)",
  warningBorder: "rgba(245, 166, 35, 0.25)",

  error: "#E5484D",
  errorBg: "rgba(229, 72, 77, 0.12)",
  errorBorder: "rgba(229, 72, 77, 0.25)",

  info: "#3B82F6",
  infoBg: "rgba(59, 130, 246, 0.10)",
  infoBorder: "rgba(59, 130, 246, 0.25)",
} as const;

// ─── Surface/Background Layers ──────────────────────────────────────────────
export const SURFACE = {
  page: "#0C0E0F",
  card: "#181C1F",
  elevated: "#21262A",
  input: "#181C1F",
  border: "rgba(255, 255, 255, 0.08)",
} as const;

// ─── Text Colors (WCAG AA Compliant on Dark and Light) ─────────────────────
export const TEXT = {
  primary: "#EDEDED",
  secondary: "#A1A7B0",
  muted: "#8B939E",
} as const;

// ─── Availability Badge Helper (Exclusively uses Status Tokens) ────────────
export function availabilityStyle(av?: string): React.CSSProperties {
  if (av === "Available")
    return { background: STATUS.successBg, border: `1px solid ${STATUS.successBorder}`, color: STATUS.success };
  if (av === "Busy")
    return { background: STATUS.errorBg, border: `1px solid ${STATUS.errorBorder}`, color: STATUS.error };
  return { background: STATUS.warningBg, border: `1px solid ${STATUS.warningBorder}`, color: STATUS.warning };
}
