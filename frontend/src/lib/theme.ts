/**
 * theme.ts — Centralized design tokens for Project K
 *
 * All brand-level color decisions live here.
 * To switch from LeafyGreen's palette to a custom one,
 * update the values in this file only — no component changes needed.
 *
 * Current palette: MongoDB LeafyGreen (dark mode defaults)
 */

// ─── Brand accent — OKC club gradient: Amber → Orange → Magenta ────────────
export const BRAND = {
  /** Gradient start — amber/gold */
  gradientStart: "#F0A500",
  /** Gradient mid — orange (primary interactive color) */
  primary: "#E8693F",
  /** Gradient end — hot pink / magenta */
  gradientEnd: "#F0387A",
  /** Full CSS gradient string */
  gradient: "linear-gradient(135deg, #F0A500 0%, #E8693F 50%, #F0387A 100%)",
  /** Slightly muted primary for hover states */
  primaryMuted: "#C04A28",
  /** Very subtle tinted background for highlight surfaces */
  primaryBg: "rgba(232, 105, 63, 0.08)",
  /** Border for highlighted surfaces */
  primaryBorder: "rgba(232, 105, 63, 0.28)",
} as const;

// ─── Semantic status colors (LG-aligned) ───────────────────────────────────
export const STATUS = {
  success: "#4CAF7D",
  successBg: "rgba(76, 175, 125, 0.10)",
  successBorder: "rgba(76, 175, 125, 0.25)",

  warning: "#F0A500",
  warningBg: "rgba(240, 165, 0, 0.10)",
  warningBorder: "rgba(240, 165, 0, 0.25)",

  error: "#F0387A",
  errorBg: "rgba(240, 56, 122, 0.10)",
  errorBorder: "rgba(240, 56, 122, 0.25)",

  info: "#E8693F",
  infoBg: "rgba(232, 105, 63, 0.10)",
  infoBorder: "rgba(232, 105, 63, 0.25)",
} as const;

// ─── Surface/background layers (LG dark palette) ───────────────────────────
export const SURFACE = {
  /** Page root background */
  page: "#0C0E0F",
  /** First-level card */
  card: "#1C2023",
  /** Elevated panel (modal, drawer) */
  elevated: "#21282D",
  /** Input field background */
  input: "#1C2023",
  /** Divider / border */
  border: "rgba(255, 255, 255, 0.10)",
} as const;

// ─── Text colors (LG dark) ─────────────────────────────────────────────────
export const TEXT = {
  primary: "#E8EDEB",
  secondary: "#89979B",
  muted: "#5C6C75",
} as const;

// ─── Availability badge helper ─────────────────────────────────────────────
export function availabilityStyle(av?: string): React.CSSProperties {
  if (av === "Available")
    return { background: STATUS.successBg, border: `1px solid ${STATUS.successBorder}`, color: STATUS.success };
  if (av === "Busy")
    return { background: STATUS.errorBg, border: `1px solid ${STATUS.errorBorder}`, color: STATUS.error };
  return { background: STATUS.warningBg, border: `1px solid ${STATUS.warningBorder}`, color: STATUS.warning };
}

// ─── Re-export React for the helper type ──────────────────────────────────
import type React from "react";
