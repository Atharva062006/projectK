"use client";
import { useTheme } from "@/context/ThemeContext";
import LeafyGreenProvider from "@leafygreen-ui/leafygreen-provider";
import { ReactNode } from "react";

/** Wraps children in LeafyGreenProvider (wired to the ThemeContext) + entry animation */
export function PageWrapper({ children }: { children: ReactNode }) {
  const { darkMode } = useTheme();

  return (
    <LeafyGreenProvider darkMode={darkMode}>
      <div className="anim-fadeInUp">{children}</div>
    </LeafyGreenProvider>
  );
}
