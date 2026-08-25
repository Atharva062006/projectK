"use client";
import { ReactNode } from "react";
import { motion } from "framer-motion";
import { pageVariants } from "@/lib/animations";

/** Clean Apple Page Motion Wrapper */
export function PageWrapper({ children }: { children: ReactNode }) {
  return (
    <motion.div
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      style={{ width: "100%" }}
    >
      {children}
    </motion.div>
  );
}
