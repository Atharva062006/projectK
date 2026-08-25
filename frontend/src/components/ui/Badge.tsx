"use client";
import React from "react";
import { APPLE_COLORS, APPLE_RADII } from "@/lib/theme";
import { X } from "lucide-react";

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: "default" | "lightgray" | "green" | "yellow" | "red" | "blue" | "dark";
  darkMode?: boolean;
  children: React.ReactNode;
}

export function Badge({ variant = "default", children, darkMode, style, className = "", ...props }: BadgeProps) {
  let bg: string = "#f5f5f7";
  let color: string = APPLE_COLORS.ink;
  let border: string = "1px solid rgba(0, 0, 0, 0.06)";

  switch (variant) {
    case "green":
      bg = "rgba(46, 133, 64, 0.08)";
      color = "#1d8348";
      border = "1px solid rgba(46, 133, 64, 0.20)";
      break;
    case "yellow":
      bg = "rgba(183, 110, 0, 0.08)";
      color = "#b76e00";
      border = "1px solid rgba(183, 110, 0, 0.20)";
      break;
    case "red":
      bg = "rgba(215, 0, 21, 0.08)";
      color = "#d70015";
      border = "1px solid rgba(215, 0, 21, 0.20)";
      break;
    case "blue":
      bg = "rgba(0, 102, 204, 0.08)";
      color = APPLE_COLORS.primary;
      border = "1px solid rgba(0, 102, 204, 0.20)";
      break;
    case "dark":
      bg = APPLE_COLORS.surfaceTile1;
      color = "#ffffff";
      border = "1px solid rgba(255, 255, 255, 0.12)";
      break;
    case "lightgray":
    case "default":
    default:
      bg = "#f5f5f7";
      color = APPLE_COLORS.inkMuted80;
      border = "1px solid rgba(0, 0, 0, 0.06)";
      break;
  }

  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        padding: "3px 8px",
        borderRadius: APPLE_RADII.pill,
        fontSize: "11px",
        fontWeight: 500,
        letterSpacing: "-0.1px",
        lineHeight: "1.2",
        backgroundColor: bg,
        color: color,
        border: border,
        whiteSpace: "nowrap",
        ...style,
      }}
      className={className}
      {...props}
    >
      {children}
    </span>
  );
}

export interface ChipProps {
  label: string;
  variant?: "green" | "yellow" | "red" | "gray" | "blue" | "default";
  onClick?: () => void;
  onDismiss?: () => void;
  darkMode?: boolean;
  selected?: boolean;
  style?: React.CSSProperties;
}

export function Chip({ label, variant = "gray", onClick, onDismiss, selected, style }: ChipProps) {
  const isGreen = variant === "green" || selected;
  let bg: string = isGreen ? "rgba(0, 102, 204, 0.08)" : "#f5f5f7";
  let color: string = isGreen ? APPLE_COLORS.primary : APPLE_COLORS.inkMuted80;
  let border: string = isGreen ? `1px solid rgba(0, 102, 204, 0.28)` : "1px solid rgba(0, 0, 0, 0.08)";

  if (variant === "red") {
    bg = "rgba(215, 0, 21, 0.08)";
    color = "#d70015";
    border = "1px solid rgba(215, 0, 21, 0.20)";
  } else if (variant === "yellow") {
    bg = "rgba(183, 110, 0, 0.08)";
    color = "#b76e00";
    border = "1px solid rgba(183, 110, 0, 0.20)";
  }

  return (
    <span
      onClick={onClick}
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: "6px",
        padding: "4px 10px",
        borderRadius: APPLE_RADII.pill,
        fontSize: "12px",
        fontWeight: 500,
        backgroundColor: bg,
        color: color,
        border: border,
        cursor: onClick || onDismiss ? "pointer" : "default",
        userSelect: "none",
        transition: "all 0.15s ease",
        ...style,
      }}
    >
      <span>{label}</span>
      {onDismiss && (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onDismiss();
          }}
          style={{
            background: "none",
            border: "none",
            cursor: "pointer",
            padding: 0,
            display: "flex",
            alignItems: "center",
            color: "inherit",
          }}
        >
          <X size={12} />
        </button>
      )}
    </span>
  );
}

export default Badge;
