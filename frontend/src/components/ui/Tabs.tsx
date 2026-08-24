"use client";
import React from "react";
import { motion } from "framer-motion";
import { APPLE_COLORS, APPLE_RADII } from "@/lib/theme";

export interface TabProps {
  name: string;
  children?: React.ReactNode;
}

export function Tab({ children }: TabProps) {
  return <>{children}</>;
}

export interface TabsProps {
  value: number;
  onValueChange: (index: number) => void;
  children: React.ReactElement<TabProps> | React.ReactElement<TabProps>[];
  darkMode?: boolean;
  "aria-label"?: string;
  style?: React.CSSProperties;
}

export function Tabs({ value, onValueChange, children, style }: TabsProps) {
  const tabs = React.Children.toArray(children) as React.ReactElement<TabProps>[];
  const activeTabContent = tabs[value]?.props?.children;

  return (
    <div style={{ display: "flex", flexDirection: "column", width: "100%", ...style }}>
      {/* Tab Navigation Strip */}
      <div
        role="tablist"
        style={{
          display: "flex",
          alignItems: "center",
          gap: "8px",
          borderBottom: `1px solid ${APPLE_COLORS.hairline}`,
          paddingBottom: "2px",
          overflowX: "auto",
        }}
      >
        {tabs.map((tab, idx) => {
          const isActive = value === idx;
          return (
            <button
              key={tab.props.name || idx}
              role="tab"
              type="button"
              aria-selected={isActive}
              onClick={() => onValueChange(idx)}
              style={{
                position: "relative",
                background: "none",
                border: "none",
                padding: "8px 16px",
                fontSize: "14px",
                fontWeight: isActive ? 600 : 400,
                color: isActive ? APPLE_COLORS.primary : APPLE_COLORS.inkMuted80,
                cursor: "pointer",
                fontFamily: "inherit",
                letterSpacing: "-0.2px",
                transition: "color 0.15s ease",
                whiteSpace: "nowrap",
              }}
            >
              <span>{tab.props.name}</span>
              {isActive && (
                <motion.div
                  layoutId="apple-tab-indicator"
                  style={{
                    position: "absolute",
                    bottom: "-3px",
                    left: 0,
                    right: 0,
                    height: "2px",
                    backgroundColor: APPLE_COLORS.primary,
                    borderRadius: "1px",
                  }}
                  transition={{ duration: 0.25, ease: [0.25, 1, 0.5, 1] }}
                />
              )}
            </button>
          );
        })}
      </div>

      {/* Active Tab Panel */}
      <div role="tabpanel" style={{ width: "100%" }}>
        {activeTabContent}
      </div>
    </div>
  );
}

export default Tabs;
