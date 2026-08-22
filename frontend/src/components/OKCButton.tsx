"use client";
/**
 * OKCButton — Branded Button wrapper for Project K
 *
 * variant="primary"  → OKC amber→orange→magenta gradient with Framer Motion tactile press/hover physics
 * all other variants → delegates to @leafygreen-ui/button unchanged
 */
import React from "react";
import LGButton from "@leafygreen-ui/button";
import { motion } from "framer-motion";
import { BRAND } from "@/lib/theme";

// ── Gradient constants mapped to central theme ──────────────────────────────
const G    = BRAND.gradient;
const GH   = BRAND.gradientHover;
const GLOW = BRAND.glow;

// ── Size map ────────────────────────────────────────────────────────────────
const SZ: Record<string, { height: string; fontSize: string; padding: string; textTransform?: string; letterSpacing?: string }> = {
  xsmall:  { height: "22px", fontSize: "11px", padding: "0 10px", textTransform: "uppercase", letterSpacing: "0.4px" },
  small:   { height: "28px", fontSize: "13px", padding: "0 12px" },
  default: { height: "36px", fontSize: "13px", padding: "0 16px" },
  large:   { height: "48px", fontSize: "18px", padding: "0 20px" },
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default function OKCButton(props: any) {
  const {
    variant = "default",
    size = "default",
    darkMode,
    disabled,
    isLoading,
    loadingText,
    leftGlyph,
    rightGlyph,
    children,
    onClick,
    type = "button",
    as: Tag,
    href,
    target,
    rel,
    style,
    className,
    title,
    ...rest
  } = props;

  /* Non-primary: pass through to LeafyGreen as-is */
  if (variant !== "primary") {
    return (
      <LGButton
        variant={variant}
        size={size}
        darkMode={darkMode}
        disabled={disabled}
        isLoading={isLoading}
        loadingText={loadingText}
        leftGlyph={leftGlyph}
        rightGlyph={rightGlyph}
        onClick={onClick}
        type={type}
        as={Tag}
        href={href}
        target={target}
        rel={rel}
        style={style}
        className={className}
        title={title}
        {...rest}
      >
        {children}
      </LGButton>
    );
  }

  /* Primary: gradient native element with Framer Motion tactile feedback */
  const sz = SZ[size] ?? SZ.default;
  const isDisabled = disabled || isLoading;

  const baseStyle: React.CSSProperties = {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "6px",
    height: sz.height,
    padding: sz.padding,
    fontSize: sz.fontSize,
    fontWeight: 600,
    letterSpacing: sz.letterSpacing,
    textTransform: sz.textTransform as React.CSSProperties["textTransform"] ?? "none",
    fontFamily: "inherit",
    borderRadius: "6px",
    border: "none",
    cursor: isDisabled ? "not-allowed" : "pointer",
    outline: "none",
    textDecoration: "none",
    color: "#fff",
    background: isDisabled ? (darkMode ? "#3A3D40" : "#ccc") : G,
    opacity: isDisabled ? 0.6 : 1,
    transition: "background 0.18s ease, box-shadow 0.18s ease, opacity 0.15s ease",
    whiteSpace: "nowrap",
    userSelect: "none",
    ...style,
  };

  const onEnter = (e: React.MouseEvent<HTMLElement>) => {
    if (!isDisabled) {
      e.currentTarget.style.background = GH;
      e.currentTarget.style.boxShadow = `0 0 0 3px ${GLOW}`;
    }
  };
  const onLeave = (e: React.MouseEvent<HTMLElement>) => {
    if (!isDisabled) {
      e.currentTarget.style.background = G;
      e.currentTarget.style.boxShadow = "none";
    }
  };

  const inner = (
    <>
      {leftGlyph && !isLoading && (
        <span style={{ display: "flex", alignItems: "center", flexShrink: 0 }}>{leftGlyph}</span>
      )}
      {isLoading ? (
        <span style={{ display: "flex", alignItems: "center", gap: "6px" }}>
          <span
            style={{
              width: "12px", height: "12px", borderRadius: "50%",
              border: "2px solid rgba(255,255,255,0.35)",
              borderTopColor: "#fff",
              animation: "spin 0.7s linear infinite",
              display: "inline-block",
            }}
          />
          {loadingText || children}
        </span>
      ) : children ? (
        <span>{children}</span>
      ) : null}
      {rightGlyph && !isLoading && (
        <span style={{ display: "flex", alignItems: "center", flexShrink: 0 }}>{rightGlyph}</span>
      )}
    </>
  );

  /* Render as motion.a when href given or as="a" */
  const isLink = href != null || Tag === "a";
  if (isLink) {
    return (
      <motion.a
        href={href}
        target={target}
        rel={rel ?? (target === "_blank" ? "noopener noreferrer" : undefined)}
        style={baseStyle}
        className={className}
        title={title}
        whileHover={isDisabled ? undefined : { scale: 1.02 }}
        whileTap={isDisabled ? undefined : { scale: 0.97 }}
        onMouseEnter={onEnter}
        onMouseLeave={onLeave}
        {...rest}
      >
        {inner}
      </motion.a>
    );
  }

  return (
    <motion.button
      type={type}
      disabled={isDisabled}
      aria-disabled={isDisabled || undefined}
      onClick={isDisabled ? undefined : onClick}
      style={baseStyle}
      className={className}
      title={title}
      whileHover={isDisabled ? undefined : { scale: 1.02 }}
      whileTap={isDisabled ? undefined : { scale: 0.97 }}
      onMouseEnter={onEnter}
      onMouseLeave={onLeave}
      {...rest}
    >
      {inner}
    </motion.button>
  );
}
