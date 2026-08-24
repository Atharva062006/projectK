"use client";
import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { APPLE_COLORS, APPLE_RADII } from "@/lib/theme";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "secondary-pill" | "dark-utility" | "pearl" | "danger" | "dangerOutline" | "ghost" | "default";
  size?: "xsmall" | "small" | "default" | "large";
  isLoading?: boolean;
  loadingText?: string;
  leftGlyph?: React.ReactNode;
  rightGlyph?: React.ReactNode;
  as?: React.ElementType | typeof Link | "a";
  href?: string;
  target?: string;
  rel?: string;
  darkMode?: boolean;
}

const SIZE_STYLES = {
  xsmall: { height: "26px", fontSize: "11px", padding: "0 10px", gap: "4px" },
  small: { height: "32px", fontSize: "13px", padding: "0 14px", gap: "6px" },
  default: { height: "40px", fontSize: "15px", padding: "0 18px", gap: "8px" },
  large: { height: "48px", fontSize: "17px", padding: "0 24px", gap: "10px" },
};

export const Button = React.forwardRef<HTMLElement, ButtonProps>(
  (
    {
      variant = "default",
      size = "default",
      isLoading = false,
      loadingText,
      leftGlyph,
      rightGlyph,
      as: Component,
      href,
      target,
      rel,
      children,
      disabled,
      className = "",
      style,
      type = "button",
      ...props
    },
    ref
  ) => {
    const sz = SIZE_STYLES[size] || SIZE_STYLES.default;
    const isDisabled = disabled || isLoading;

    let variantStyles: React.CSSProperties = {};

    switch (variant) {
      case "primary":
        variantStyles = {
          backgroundColor: APPLE_COLORS.primary,
          color: "#ffffff",
          borderRadius: APPLE_RADII.pill,
          border: "none",
          fontWeight: 500,
        };
        break;
      case "secondary":
      case "secondary-pill":
        variantStyles = {
          backgroundColor: "transparent",
          color: APPLE_COLORS.primary,
          border: `1px solid ${APPLE_COLORS.primary}`,
          borderRadius: APPLE_RADII.pill,
          fontWeight: 500,
        };
        break;
      case "dark-utility":
        variantStyles = {
          backgroundColor: APPLE_COLORS.ink,
          color: "#ffffff",
          borderRadius: APPLE_RADII.sm,
          border: "none",
          fontWeight: 500,
        };
        break;
      case "pearl":
        variantStyles = {
          backgroundColor: APPLE_COLORS.surfacePearl,
          color: APPLE_COLORS.inkMuted80,
          border: "1px solid rgba(0, 0, 0, 0.08)",
          borderRadius: APPLE_RADII.md,
          fontWeight: 500,
        };
        break;
      case "danger":
        variantStyles = {
          backgroundColor: "#d70015",
          color: "#ffffff",
          borderRadius: APPLE_RADII.pill,
          border: "none",
          fontWeight: 500,
        };
        break;
      case "dangerOutline":
        variantStyles = {
          backgroundColor: "transparent",
          color: "#d70015",
          border: "1px solid rgba(215, 0, 21, 0.4)",
          borderRadius: APPLE_RADII.pill,
          fontWeight: 500,
        };
        break;
      case "ghost":
        variantStyles = {
          backgroundColor: "transparent",
          color: APPLE_COLORS.ink,
          border: "none",
          borderRadius: APPLE_RADII.sm,
          fontWeight: 400,
        };
        break;
      case "default":
      default:
        variantStyles = {
          backgroundColor: "#f5f5f7",
          color: APPLE_COLORS.ink,
          border: "1px solid rgba(0, 0, 0, 0.08)",
          borderRadius: APPLE_RADII.pill,
          fontWeight: 400,
        };
        break;
    }

    const baseStyle: React.CSSProperties = {
      display: "inline-flex",
      alignItems: "center",
      justifyContent: "center",
      cursor: isDisabled ? "not-allowed" : "pointer",
      opacity: isDisabled ? 0.6 : 1,
      fontFamily: "inherit",
      textDecoration: "none",
      whiteSpace: "nowrap",
      userSelect: "none",
      transition: "background-color 0.18s ease, color 0.18s ease, border-color 0.18s ease",
      ...sz,
      ...variantStyles,
      ...style,
    };

    const content = (
      <>
        {leftGlyph && !isLoading && (
          <span style={{ display: "inline-flex", alignItems: "center" }}>{leftGlyph}</span>
        )}
        {isLoading ? (
          <span style={{ display: "inline-flex", alignItems: "center", gap: "6px" }}>
            <span
              style={{
                width: "12px",
                height: "12px",
                borderRadius: "50%",
                border: "2px solid rgba(0,0,0,0.15)",
                borderTopColor: variant === "primary" || variant === "dark-utility" ? "#fff" : APPLE_COLORS.primary,
                animation: "spin 0.7s linear infinite",
                display: "inline-block",
              }}
            />
            <span>{loadingText || children}</span>
          </span>
        ) : (
          children
        )}
        {rightGlyph && !isLoading && (
          <span style={{ display: "inline-flex", alignItems: "center" }}>{rightGlyph}</span>
        )}
      </>
    );

    if (href || Component === Link || Component === "a") {
      const Comp = Component || (href ? Link : "a");
      return (
        <motion.div
          whileTap={isDisabled ? undefined : { scale: 0.95 }}
          style={{ display: "inline-flex" }}
        >
          <Comp
            href={href || "#"}
            target={target}
            rel={rel}
            style={baseStyle}
            className={className}
            {...(props as any)}
          >
            {content}
          </Comp>
        </motion.div>
      );
    }

    return (
      <motion.button
        ref={ref as any}
        type={type}
        disabled={isDisabled}
        whileTap={isDisabled ? undefined : { scale: 0.95 }}
        style={baseStyle}
        className={className}
        {...(props as any)}
      >
        {content}
      </motion.button>
    );
  }
);

Button.displayName = "Button";
export default Button;
