"use client";
import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/context/AuthContext";
import { useTheme } from "@/context/ThemeContext";

import Button from "@/components/OKCButton";
import IconButton from "@leafygreen-ui/icon-button";
import LeafyGreenProvider from "@leafygreen-ui/leafygreen-provider";
import Icon from "@leafygreen-ui/icon";
import { palette } from "@leafygreen-ui/palette";
import { BRAND } from "@/lib/theme";

export default function Navbar() {
  const { user, profileId, logout } = useAuth();
  const { darkMode, toggleTheme } = useTheme();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    }
    if (menuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [menuOpen]);

  const initials = user?.username
    ? user.username
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
    : "?";

  const navLinks = [
    { href: "/directory", label: "Members" },
    { href: "/pitches", label: "Pitches" },
  ];

  const navBorder = darkMode
    ? "rgba(255,255,255,0.08)"
    : "rgba(0,0,0,0.08)";

  return (
    <LeafyGreenProvider darkMode={darkMode}>
      <div style={{ position: "sticky", top: 0, zIndex: 999, padding: "20px 24px 16px", pointerEvents: "none" }}>
        <motion.nav
          initial={{ y: -18, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.45, ease: [0.25, 1, 0.5, 1] }}
          style={{
            maxWidth: "1080px",
            margin: "0 auto",
            height: "60px",
            display: "flex",
            alignItems: "center",
            background: darkMode ? "rgba(22, 26, 29, 0.78)" : "rgba(255, 255, 255, 0.85)",
            backdropFilter: "blur(16px)",
            WebkitBackdropFilter: "blur(16px)",
            border: `1px solid ${navBorder}`,
            borderRadius: "16px",
            boxShadow: darkMode ? "0 8px 32px rgba(0,0,0,0.35)" : "0 8px 32px rgba(0,0,0,0.08)",
            pointerEvents: "auto",
            transition: "all 0.3s ease",
          }}
        >
          <div
            style={{
              width: "100%",
              padding: "0 20px",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: "16px",
            }}
          >
          {/* ── Left: Logo ── */}
          <Link
            href="/"
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              flexShrink: 0,
              textDecoration: "none",
            }}
          >
            <Image
              src="/okc_main_logo.png"
              alt="OKC Logo"
              width={22}
              height={22}
              style={{ objectFit: "contain" }}
            />
            <Image
              src="/name_logo.png"
              alt="Oyster Kode Club"
              width={96}
              height={14}
              style={{ objectFit: "contain", width: "auto", height: "auto" }}
              loading="eager"
            />
          </Link>

          {/* ── Center: Nav Links (Clean, Flat design) ── */}
          <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className="okc-nav-link"
                  style={{
                    padding: "6px 14px",
                    borderRadius: "8px",
                    fontSize: "13px",
                    fontWeight: isActive ? 600 : 500,
                    color: isActive
                      ? BRAND.primary
                      : darkMode
                      ? palette.gray.light1
                      : palette.gray.dark1,
                    background: isActive
                      ? darkMode
                        ? "rgba(255, 255, 255, 0.08)"
                        : "rgba(0, 0, 0, 0.06)"
                      : "transparent",
                    textDecoration: "none",
                    transition: "all 0.15s ease",
                    border: "none",
                  }}
                >
                  {link.label}
                </Link>
              );
            })}
          </div>

          {/* ── Right: Theme Toggle + Auth ── */}
          <div style={{ display: "flex", alignItems: "center", gap: "8px", flexShrink: 0 }}>
            {/* Dark / Light toggle */}
            <IconButton
              aria-label={darkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
              onClick={toggleTheme}
              darkMode={darkMode}
            >
              <Icon glyph={darkMode ? "Sun" : "Moon"} />
            </IconButton>

            {/* Auth */}
            {user ? (
              <div style={{ position: "relative" }} ref={menuRef}>
                <motion.button
                  whileTap={{ scale: 0.97 }}
                  onClick={() => setMenuOpen(!menuOpen)}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                    padding: "4px 10px 4px 6px",
                    borderRadius: "99px",
                    border: `1px solid ${menuOpen ? BRAND.primaryBorder : darkMode ? "rgba(255,255,255,0.12)" : "rgba(0,0,0,0.10)"}`,
                    background: menuOpen ? BRAND.primaryBg : darkMode ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.04)",
                    cursor: "pointer",
                    color: darkMode ? palette.white : palette.black,
                    transition: "all 0.15s ease",
                  }}
                >
                  <span
                    style={{
                      width: "22px",
                      height: "22px",
                      borderRadius: "50%",
                      background: BRAND.gradient,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: "10px",
                      fontWeight: 700,
                      color: "#fff",
                      flexShrink: 0,
                    }}
                  >
                    {initials}
                  </span>
                  <span style={{ fontSize: "12px", fontWeight: 600, maxWidth: "80px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                    {user.username}
                  </span>
                  <motion.span
                    animate={{ rotate: menuOpen ? 180 : 0 }}
                    transition={{ duration: 0.2 }}
                    style={{ display: "flex", alignItems: "center", color: darkMode ? palette.gray.light1 : palette.gray.dark1 }}
                  >
                    <Icon glyph="CaretDown" size={12} />
                  </motion.span>
                </motion.button>

                <AnimatePresence>
                  {menuOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: -6, scale: 0.96 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -6, scale: 0.96 }}
                      transition={{ duration: 0.18, ease: [0.25, 1, 0.5, 1] }}
                      style={{
                        position: "absolute",
                        top: "calc(100% + 8px)",
                        right: 0,
                        minWidth: "210px",
                        background: darkMode ? "#181C1F" : "#FFFFFF",
                        border: `1px solid ${darkMode ? "rgba(255,255,255,0.10)" : "rgba(0,0,0,0.08)"}`,
                        borderRadius: "14px",
                        boxShadow: darkMode ? "0 12px 32px rgba(0,0,0,0.5), 0 0 0 1px rgba(255,255,255,0.04)" : "0 12px 32px rgba(0,0,0,0.12)",
                        padding: "6px",
                        zIndex: 1000,
                        overflow: "hidden",
                      }}
                    >
                      {/* User info Header */}
                      <div style={{ padding: "8px 10px 8px" }}>
                        <p style={{ fontSize: "10px", color: palette.gray.base, margin: 0 }}>Signed in as</p>
                        <p style={{ fontSize: "13px", fontWeight: 700, color: darkMode ? palette.white : palette.black, margin: "2px 0 6px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                          {user.username}
                        </p>
                        <span
                          style={{
                            fontSize: "9px",
                            padding: "2px 6px",
                            borderRadius: "4px",
                            background: BRAND.primaryBg,
                            border: `1px solid ${BRAND.primaryBorder}`,
                            color: BRAND.primary,
                            textTransform: "uppercase",
                            fontWeight: 700,
                            letterSpacing: "0.05em",
                          }}
                        >
                          {user.role}
                        </span>
                      </div>

                      <div style={{ height: "1px", background: darkMode ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.06)", margin: "4px 0" }} />

                      {/* Links */}
                      {(user.role === "member" || user.role === "alumni") && (
                        <>
                          {profileId && (
                            <Link
                              href={`/profiles/${profileId}`}
                              onClick={() => setMenuOpen(false)}
                              className="okc-menu-item"
                              style={{
                                display: "flex",
                                alignItems: "center",
                                gap: "10px",
                                padding: "8px 10px",
                                borderRadius: "8px",
                                fontSize: "13px",
                                color: darkMode ? palette.gray.light1 : palette.gray.dark2,
                                textDecoration: "none",
                                transition: "all 0.15s ease",
                              }}
                            >
                              <Icon glyph="Person" size={14} />
                              <span>View Showcase</span>
                            </Link>
                          )}
                          <Link
                            href="/portfolio"
                            onClick={() => setMenuOpen(false)}
                            className="okc-menu-item"
                            style={{
                              display: "flex",
                              alignItems: "center",
                              gap: "10px",
                              padding: "8px 10px",
                              borderRadius: "8px",
                              fontSize: "13px",
                              color: darkMode ? palette.gray.light1 : palette.gray.dark2,
                              textDecoration: "none",
                              transition: "all 0.15s ease",
                            }}
                          >
                            <Icon glyph="Edit" size={14} />
                            <span>Edit Portfolio</span>
                          </Link>
                        </>
                      )}

                      {user.role === "admin" && (
                        <Link
                          href="/admin"
                          onClick={() => setMenuOpen(false)}
                          className="okc-menu-item"
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "10px",
                            padding: "8px 10px",
                            borderRadius: "8px",
                            fontSize: "13px",
                            color: darkMode ? palette.gray.light1 : palette.gray.dark2,
                            textDecoration: "none",
                            transition: "all 0.15s ease",
                          }}
                        >
                          <Icon glyph="Settings" size={14} />
                          <span>Admin Dashboard</span>
                        </Link>
                      )}

                      <div style={{ height: "1px", background: darkMode ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.06)", margin: "4px 0" }} />

                      {/* Sign Out */}
                      <div
                        onClick={() => {
                          logout();
                          setMenuOpen(false);
                        }}
                        className="okc-menu-item-destructive"
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "10px",
                          padding: "8px 10px",
                          borderRadius: "8px",
                          fontSize: "13px",
                          fontWeight: 500,
                          color: "#EC3877",
                          cursor: "pointer",
                          transition: "all 0.15s ease",
                        }}
                      >
                        <Icon glyph="LogOut" size={14} fill="#EC3877" />
                        <span>Sign Out</span>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <Button
                as={Link}
                href="/auth"
                darkMode={darkMode}
                variant="primary"
                size="xsmall"
              >
                Sign In
              </Button>
            )}
          </div>
        </div>
      </motion.nav>
    </div>
    </LeafyGreenProvider>
  );
}
