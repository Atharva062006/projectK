/**
 * theme.ts — Centralized design tokens for Project K
 *
 * All brand-level color decisions live here.
 * To switch from LeafyGreen's palette to a custom one,
 * update the values in this file only — no component changes needed.
 *
 * Current palette: MongoDB LeafyGreen (dark mode defaults)
 */

// ─── Brand accent (currently LG green; swap here if needed) ────────────────
export const BRAND = {
  /** Primary interactive color */
  primary: "#00ED64",
  /** Slightly muted primary for hover states */
  primaryMuted: "#00A35C",
  /** Very subtle tinted background for highlight surfaces */
  primaryBg: "rgba(0, 237, 100, 0.08)",
  /** Border for highlighted surfaces */
  primaryBorder: "rgba(0, 237, 100, 0.25)",
} as const;

// ─── Semantic status colors (LG-aligned) ───────────────────────────────────
export const STATUS = {
  success: "#00ED64",
  successBg: "rgba(0, 237, 100, 0.10)",
  successBorder: "rgba(0, 237, 100, 0.25)",

  warning: "#FFC010",
  warningBg: "rgba(255, 192, 16, 0.10)",
  warningBorder: "rgba(255, 192, 16, 0.25)",

  error: "#CF4A22",
  errorBg: "rgba(207, 74, 34, 0.10)",
  errorBorder: "rgba(207, 74, 34, 0.25)",

  info: "#016BF8",
  infoBg: "rgba(1, 107, 248, 0.10)",
  infoBorder: "rgba(1, 107, 248, 0.25)",
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
