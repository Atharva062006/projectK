"use client";
import React from "react";
import { APPLE_COLORS, APPLE_RADII } from "@/lib/theme";

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  variant?: "light" | "parchment" | "dark" | "dark-2";
  darkMode?: boolean;
}

export function Card({
  children,
  variant = "light",
  darkMode,
  style,
  className = "",
  ...props
}: CardProps) {
  let bg: string = APPLE_COLORS.canvas;
  let border: string = APPLE_COLORS.hairline;
  let color: string = APPLE_COLORS.ink;

  if (variant === "parchment") {
    bg = APPLE_COLORS.canvasParchment;
  } else if (variant === "dark" || darkMode) {
    bg = APPLE_COLORS.surfaceTile1;
    border = APPLE_COLORS.hairlineDark;
    color = APPLE_COLORS.bodyOnDark;
  } else if (variant === "dark-2") {
    bg = APPLE_COLORS.surfaceTile2;
    border = APPLE_COLORS.hairlineDark;
    color = APPLE_COLORS.bodyOnDark;
  }

  return (
    <div
      style={{
        backgroundColor: bg,
        borderRadius: APPLE_RADII.lg,
        border: `1px solid ${border}`,
        color: color,
        padding: "24px",
        position: "relative",
        boxSizing: "border-box",
        ...style,
      }}
      className={className}
      {...props}
    >
      {children}
    </div>
  );
}

export default Card;
