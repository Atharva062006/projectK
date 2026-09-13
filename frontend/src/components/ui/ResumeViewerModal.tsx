"use client";
import React, { useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Download, FileText } from "lucide-react";
import { Button } from "./Button";
import { APPLE_COLORS, APPLE_RADII } from "@/lib/theme";

export interface ResumeViewerModalProps {
  open: boolean;
  onClose: () => void;
  /** URL used to embed the PDF in the iframe (view endpoint) */
  pdfUrl: string;
  /** URL used for the download button (download=true endpoint) */
  downloadUrl: string;
  candidateName?: string;
}

export function ResumeViewerModal({
  open,
  onClose,
  pdfUrl,
  downloadUrl,
  candidateName,
}: ResumeViewerModalProps) {
  const downloadAnchorRef = useRef<HTMLAnchorElement>(null);

  // Body scroll lock — same pattern as existing Modal.tsx
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

  // Escape key closes modal
  useEffect(() => {
    if (!open) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [open, onClose]);

  const handleDownload = () => {
    downloadAnchorRef.current?.click();
  };

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
            padding: "24px",
          }}
        >
          {/* ── Backdrop ── */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
            style={{
              position: "absolute",
              inset: 0,
              backgroundColor: "rgba(0, 0, 0, 0.72)",
              backdropFilter: "blur(20px) saturate(180%)",
              WebkitBackdropFilter: "blur(20px) saturate(180%)",
            }}
          />

          {/* ── Modal Shell ── */}
          <motion.div
            initial={{ opacity: 0, scale: 0.97, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.97, y: 12 }}
            transition={{ duration: 0.28, ease: [0.25, 1, 0.5, 1] }}
            style={{
              position: "relative",
              width: "90vw",
              height: "90vh",
              maxWidth: "1100px",
              backgroundColor: APPLE_COLORS.canvas,
              borderRadius: APPLE_RADII.lg,
              border: `1px solid ${APPLE_COLORS.hairline}`,
              display: "flex",
              flexDirection: "column",
              overflow: "hidden",
              zIndex: 1,
            }}
          >
            {/* ── Header bar — sub-nav-frosted spec ── */}
            <div
              style={{
                height: "52px",
                flexShrink: 0,
                backgroundColor: APPLE_COLORS.canvasParchment,
                borderBottom: `1px solid ${APPLE_COLORS.hairline}`,
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "0 16px 0 20px",
              }}
            >
              {/* Left: icon + title */}
              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <FileText
                  size={15}
                  color={APPLE_COLORS.inkMuted48}
                  strokeWidth={1.8}
                />
                <span
                  style={{
                    fontSize: "14px",
                    fontWeight: 600,
                    color: APPLE_COLORS.ink,
                    letterSpacing: "-0.224px",
                    lineHeight: 1.29,
                  }}
                >
                  {candidateName ? `${candidateName} — Résumé` : "Résumé"}
                </span>
              </div>

              {/* Right: circular close button — button-icon-circular spec */}
              <button
                type="button"
                onClick={onClose}
                aria-label="Close resume viewer"
                style={{
                  width: "30px",
                  height: "30px",
                  borderRadius: APPLE_RADII.full,
                  backgroundColor: APPLE_COLORS.surfaceChipTranslucent,
                  border: "none",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: APPLE_COLORS.ink,
                  flexShrink: 0,
                  transition: "background-color 0.15s ease",
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLButtonElement).style.backgroundColor =
                    "rgba(210, 210, 215, 0.90)";
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLButtonElement).style.backgroundColor =
                    APPLE_COLORS.surfaceChipTranslucent;
                }}
              >
                <X size={14} strokeWidth={2} />
              </button>
            </div>

            {/* ── PDF Viewer Body ── */}
            <div style={{ flex: 1, overflow: "hidden", position: "relative" }}>
              <iframe
                src={pdfUrl}
                title={candidateName ? `${candidateName}'s Résumé` : "Résumé"}
                style={{
                  width: "100%",
                  height: "100%",
                  border: "none",
                  display: "block",
                  backgroundColor: "#525659",
                }}
              />
            </div>

            {/* ── Footer bar — floating-sticky-bar spec ── */}
            <div
              style={{
                height: "64px",
                flexShrink: 0,
                backgroundColor: "rgba(245, 245, 247, 0.85)",
                backdropFilter: "blur(20px) saturate(180%)",
                WebkitBackdropFilter: "blur(20px) saturate(180%)",
                borderTop: `1px solid ${APPLE_COLORS.hairline}`,
                display: "flex",
                alignItems: "center",
                justifyContent: "flex-end",
                padding: "0 20px",
              }}
            >
              {/* Hidden anchor for programmatic download */}
              {/* eslint-disable-next-line jsx-a11y/anchor-has-content */}
              <a
                ref={downloadAnchorRef}
                href={downloadUrl}
                download="resume.pdf"
                target="_blank"
                rel="noreferrer"
                style={{ display: "none" }}
                aria-hidden="true"
              />

              <Button
                variant="primary"
                size="default"
                leftGlyph={<Download size={15} />}
                onClick={handleDownload}
              >
                Download
              </Button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

export default ResumeViewerModal;
