"use client";
import { useTheme } from "@/context/ThemeContext";
import LeafyGreenProvider from "@leafygreen-ui/leafygreen-provider";
import { ReactNode } from "react";
import { motion } from "framer-motion";
import { pageVariants } from "@/lib/animations";

/** Wraps children in LeafyGreenProvider (wired to the ThemeContext) + Framer Motion entry animation */
export function PageWrapper({ children }: { children: ReactNode }) {
  const { darkMode } = useTheme();

  return (
    <LeafyGreenProvider darkMode={darkMode}>
      <motion.div
        variants={pageVariants}
        initial="initial"
        animate="animate"
        exit="exit"
      >
        {children}
      </motion.div>
    </LeafyGreenProvider>
  );
}
