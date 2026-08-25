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
      }}
    >
      <svg
        width={size}
        height={size}
        viewBox="0 0 24 24"
        style={{
          animation: "spin 0.8s linear infinite",
        }}
      >
        <circle
          cx="12"
          cy="12"
          r="9"
          fill="none"
          stroke="rgba(0, 0, 0, 0.1)"
          strokeWidth="2.5"
        />
        <circle
          cx="12"
          cy="12"
          r="9"
          fill="none"
          stroke={color}
          strokeWidth="2.5"
          strokeDasharray="40 100"
          strokeLinecap="round"
        />
      </svg>
    </div>
  );
}

export default Spinner;
