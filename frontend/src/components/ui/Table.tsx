"use client";
import React from "react";
import { APPLE_COLORS, APPLE_RADII } from "@/lib/theme";

export function Table({ children, darkMode, style, className = "" }: { children: React.ReactNode; darkMode?: boolean; style?: React.CSSProperties; className?: string }) {
  return (
    <div
      style={{
        width: "100%",
        overflowX: "auto",
        backgroundColor: "#ffffff",
        borderRadius: APPLE_RADII.lg,
        border: `1px solid ${APPLE_COLORS.hairline}`,
        ...style,
      }}
      className={className}
    >
      <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left", fontSize: "13px" }}>
        {children}
      </table>
    </div>
  );
}

export function TableHead({ children }: { children: React.ReactNode }) {
  return <thead style={{ borderBottom: `1px solid ${APPLE_COLORS.hairline}`, backgroundColor: APPLE_COLORS.canvasParchment }}>{children}</thead>;
}

export function HeaderRow({ children }: { children: React.ReactNode }) {
  return <tr>{children}</tr>;
}

export function HeaderCell({ children, style }: { children: React.ReactNode; style?: React.CSSProperties }) {
  return (
    <th
      style={{
        padding: "12px 16px",
        fontWeight: 600,
        color: APPLE_COLORS.inkMuted80,
        fontSize: "12px",
        letterSpacing: "-0.1px",
        textTransform: "uppercase",
        ...style,
      }}
    >
      {children}
    </th>
  );
}

export function TableBody({ children }: { children: React.ReactNode }) {
  return <tbody>{children}</tbody>;
}

export function Row({ children, style }: { children: React.ReactNode; style?: React.CSSProperties }) {
  return (
    <tr
      style={{
        borderBottom: `1px solid rgba(0, 0, 0, 0.05)`,
        transition: "background-color 0.15s ease",
        ...style,
      }}
      onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#fafafc")}
      onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "transparent")}
    >
      {children}
    </tr>
  );
}

export function Cell({ children, style }: { children: React.ReactNode; style?: React.CSSProperties }) {
  return (
    <td style={{ padding: "12px 16px", color: APPLE_COLORS.ink, verticalAlign: "middle", ...style }}>
      {children}
    </td>
  );
}
