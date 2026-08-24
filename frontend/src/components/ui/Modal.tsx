"use client";
import React, { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import Button from "./Button";
import { APPLE_COLORS, APPLE_RADII } from "@/lib/theme";

export interface ModalProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  darkMode?: boolean;
}

export function Modal({ open, onClose, title, children }: ModalProps) {
  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <AnimatePresence>
      {open && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 9999,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "20px",
          }}
        >
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            style={{
              position: "absolute",
              inset: 0,
              backgroundColor: "rgba(0, 0, 0, 0.4)",
              backdropFilter: "blur(20px)",
              WebkitBackdropFilter: "blur(20px)",
            }}
          />

          {/* Dialog */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            transition={{ duration: 0.25, ease: [0.25, 1, 0.5, 1] }}
            style={{
              position: "relative",
              width: "100%",
              maxWidth: "480px",
              backgroundColor: "#ffffff",
              borderRadius: APPLE_RADII.lg,
              border: `1px solid ${APPLE_COLORS.hairline}`,
              padding: "28px",
              boxShadow: "0 20px 48px rgba(0, 0, 0, 0.16)",
              zIndex: 1,
            }}
          >
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "16px" }}>
              {title && (
                <h3 style={{ fontSize: "18px", fontWeight: 600, color: APPLE_COLORS.ink, margin: 0, letterSpacing: "-0.28px" }}>
                  {title}
                </h3>
              )}
              <button
                type="button"
                onClick={onClose}
                style={{
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  color: APPLE_COLORS.inkMuted48,
                  padding: "4px",
                  display: "flex",
                  alignItems: "center",
                  borderRadius: "50%",
                }}
              >
                <X size={18} />
              </button>
            </div>
            {children}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

export interface ConfirmationModalProps {
  open: boolean;
  onConfirm: () => void;
  onCancel: () => void;
  title: string;
  buttonText?: string;
  variant?: "danger" | "primary";
  children: React.ReactNode;
  darkMode?: boolean;
}

export function ConfirmationModal({
  open,
  onConfirm,
  onCancel,
  title,
  buttonText = "Confirm",
  variant = "danger",
  children,
}: ConfirmationModalProps) {
  return (
    <Modal open={open} onClose={onCancel} title={title}>
      <div style={{ fontSize: "14px", color: APPLE_COLORS.inkMuted80, lineHeight: 1.5, marginBottom: "24px" }}>
        {children}
      </div>
      <div style={{ display: "flex", justifyContent: "flex-end", gap: "12px" }}>
        <Button variant="default" size="small" onClick={onCancel}>
          Cancel
        </Button>
        <Button variant={variant === "danger" ? "danger" : "primary"} size="small" onClick={onConfirm}>
          {buttonText}
        </Button>
      </div>
    </Modal>
  );
}

export default Modal;
