"use client";
import React from "react";
import { APPLE_COLORS } from "@/lib/theme";

export interface SpinnerProps {
  size?: number;
  color?: string;
  darkMode?: boolean;
}

export function Spinner({ size = 24, color = APPLE_COLORS.primary }: SpinnerProps) {
  return (
    <div
      style={{
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        width: size,
        height: size,
        flexShrink: 0,
      }}
    >
      <span
        style={{
          width: size,
          height: size,
          borderRadius: "50%",
          border: `2.5px solid rgba(0, 0, 0, 0.1)`,
          borderTopColor: color,
          animation: "spin 0.5s linear infinite",
          display: "inline-block",
          boxSizing: "border-box",
        }}
      />
    </div>
  );
}

export default Spinner;
