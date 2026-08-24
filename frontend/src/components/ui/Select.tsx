"use client";
import React, { useState, useRef, useEffect } from "react";
import { ChevronDown } from "lucide-react";
import { APPLE_COLORS, APPLE_RADII } from "@/lib/theme";

export interface OptionProps {
  value: string;
  children: React.ReactNode;
  disabled?: boolean;
}

export function Option({ value, children }: OptionProps) {
  return <option value={value}>{children}</option>;
}

export interface OptionGroupProps {
  label: string;
  children: React.ReactNode;
}

export function OptionGroup({ label, children }: OptionGroupProps) {
  return <optgroup label={label}>{children}</optgroup>;
}

export interface SelectProps {
  label?: string;
  value?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  children: React.ReactNode;
  disabled?: boolean;
  error?: string;
  id?: string;
  darkMode?: boolean;
  style?: React.CSSProperties;
  className?: string;
}

export function Select({
  label,
  value,
  onChange,
  placeholder,
  children,
  disabled,
  error,
  id,
  style,
  className = "",
}: SelectProps) {
  const selectId = id || (label ? label.toLowerCase().replace(/\s+/g, "-") : undefined);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "6px", width: "100%" }}>
      {label && (
        <label
          htmlFor={selectId}
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
      <div style={{ position: "relative", width: "100%", display: "flex", alignItems: "center" }}>
        <select
          id={selectId}
          value={value}
          disabled={disabled}
          onChange={(e) => onChange?.(e.target.value)}
          style={{
            width: "100%",
            height: "38px",
            padding: "0 34px 0 14px",
            backgroundColor: "#ffffff",
            color: value ? APPLE_COLORS.ink : APPLE_COLORS.inkMuted48,
            fontSize: "14px",
            fontFamily: "inherit",
            borderRadius: APPLE_RADII.sm,
            border: `1px solid ${error ? "#d70015" : APPLE_COLORS.hairline}`,
            outline: "none",
            appearance: "none",
            WebkitAppearance: "none",
            MozAppearance: "none",
            cursor: disabled ? "not-allowed" : "pointer",
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
        >
          {placeholder && (
            <option value="" disabled>
              {placeholder}
            </option>
          )}
          {children}
        </select>
        <span
          style={{
            position: "absolute",
            right: "12px",
            pointerEvents: "none",
            display: "flex",
            alignItems: "center",
            color: APPLE_COLORS.inkMuted48,
          }}
        >
          <ChevronDown size={15} />
        </span>
      </div>
      {error && (
        <span style={{ fontSize: "12px", color: "#d70015", marginTop: "2px" }}>{error}</span>
      )}
    </div>
  );
}

export default Select;
