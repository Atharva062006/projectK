"use client";
import React from "react";
import { APPLE_COLORS, APPLE_RADII } from "@/lib/theme";

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  darkMode?: boolean;
}

export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ label, error, className = "", style, id, ...props }, ref) => {
    const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, "-") : undefined);

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
        <textarea
          ref={ref}
          id={inputId}
          style={{
            width: "100%",
            padding: "10px 14px",
            backgroundColor: "#ffffff",
            color: APPLE_COLORS.ink,
            fontSize: "14px",
            fontFamily: "inherit",
            borderRadius: APPLE_RADII.sm,
            border: `1px solid ${error ? "#d70015" : APPLE_COLORS.hairline}`,
            outline: "none",
            resize: "vertical",
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
        {error && (
          <span style={{ fontSize: "12px", color: "#d70015", marginTop: "2px" }}>{error}</span>
        )}
      </div>
    );
  }
);

Textarea.displayName = "Textarea";
export default Textarea;
