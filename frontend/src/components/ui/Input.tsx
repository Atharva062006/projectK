"use client";
import React from "react";
import { Search } from "lucide-react";
import { APPLE_COLORS, APPLE_RADII } from "@/lib/theme";

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  isSearch?: boolean;
  error?: string;
  darkMode?: boolean;
  leftIcon?: React.ReactNode;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ label, isSearch, error, className = "", style, leftIcon, id, type, ...props }, ref) => {
    const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, "-") : undefined);
    const searchMode = isSearch || type === "search";

    return (
      <div style={{ display: "flex", flexDirection: "column", gap: "6px", width: "100%" }}>
        {label && (
          <label
            htmlFor={inputId}
            style={{
              fontSize: "13px",
              fontWeight: 500,
              color: APPLE_COLORS.ink,
              letterSpacing: "-0.12px",
            }}
          >
            {label}
          </label>
        )}
        <div style={{ position: "relative", display: "flex", alignItems: "center", width: "100%" }}>
          {searchMode ? (
            <span
              style={{
                position: "absolute",
                left: "14px",
                display: "flex",
                alignItems: "center",
                color: APPLE_COLORS.inkMuted48,
                pointerEvents: "none",
              }}
            >
              <Search size={16} />
            </span>
          ) : leftIcon ? (
            <span
              style={{
                position: "absolute",
                left: "12px",
                display: "flex",
                alignItems: "center",
                color: APPLE_COLORS.inkMuted48,
                pointerEvents: "none",
              }}
            >
              {leftIcon}
            </span>
          ) : null}
          <input
            ref={ref}
            id={inputId}
            type={type}
            style={{
              width: "100%",
              height: searchMode ? "44px" : "38px",
              padding: searchMode
                ? "0 18px 0 40px"
                : leftIcon
                ? "0 14px 0 36px"
                : "0 14px",
              backgroundColor: "#ffffff",
              color: APPLE_COLORS.ink,
              fontSize: searchMode ? "15px" : "14px",
              fontFamily: "inherit",
              borderRadius: searchMode ? APPLE_RADII.pill : APPLE_RADII.sm,
              border: `1px solid ${error ? "#d70015" : APPLE_COLORS.hairline}`,
              outline: "none",
              transition: "border-color 0.18s ease, box-shadow 0.18s ease",
              letterSpacing: "-0.2px",
              ...style,
            }}
            onFocus={(e) => {
              e.currentTarget.style.borderColor = APPLE_COLORS.primaryFocus;
              e.currentTarget.style.boxShadow = `0 0 0 3px rgba(0, 113, 227, 0.15)`;
            }}
            onBlur={(e) => {
              e.currentTarget.style.borderColor = error ? "#d70015" : APPLE_COLORS.hairline;
              e.currentTarget.style.boxShadow = "none";
            }}
            className={className}
            {...props}
          />
        </div>
        {error && (
          <span style={{ fontSize: "12px", color: "#d70015", marginTop: "2px" }}>{error}</span>
        )}
      </div>
    );
  }
);

Input.displayName = "Input";
export default Input;
