"use client";
import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/context/AuthContext";
import { User, Menu, X, ChevronDown, UserCheck, Edit3, ShieldAlert, LogOut } from "lucide-react";
import { APPLE_COLORS, APPLE_RADII } from "@/lib/theme";

export default function Navbar() {
  const { user, profileId, logout } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
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

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  const initials = user?.username
    ? user.username
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
    : "?";

  const navLinks = [
    { href: "/directory", label: "Directory" },
    { href: "/pitches", label: "Pitches" },
    { href: "/#about", label: "About" },
  ];

  return (
    <header
      style={{
        position: "sticky",
        top: 0,
        zIndex: 1000,
        backgroundColor: APPLE_COLORS.surfaceBlack,
        height: "44px",
        display: "flex",
        alignItems: "center",
        width: "100%",
        borderBottom: "1px solid rgba(255, 255, 255, 0.08)",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: "1024px",
          margin: "0 auto",
          padding: "0 20px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          height: "100%",
        }}
      >
        {/* ── Left: Logo ── */}
        <Link
          href="/"
          style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
            textDecoration: "none",
            color: "#ffffff",
          }}
        >
          <Image
            src="/okc_main_logo.png"
            alt="OKC Logo"
            width={18}
            height={18}
            style={{ objectFit: "contain" }}
          />
          <span
            style={{
              fontSize: "12px",
              fontWeight: 600,
              letterSpacing: "0.04em",
              textTransform: "uppercase",
              color: "#ffffff",
              whiteSpace: "nowrap",
            }}
          >
            OYSTER KODE CLUB
          </span>
        </Link>

        {/* ── Center: Desktop Nav Links ── */}
        <nav
          style={{
            display: "none",
            alignItems: "center",
            gap: "24px",
          }}
          className="md:flex"
        >
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                style={{
                  fontSize: "12px",
                  fontWeight: isActive ? 500 : 400,
                  color: isActive ? "#ffffff" : "rgba(255, 255, 255, 0.72)",
                  textDecoration: "none",
                  letterSpacing: "-0.12px",
                  transition: "color 0.15s ease",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.color = "#ffffff")}
                onMouseLeave={(e) =>
                  (e.currentTarget.style.color = isActive ? "#ffffff" : "rgba(255, 255, 255, 0.72)")
                }
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        {/* ── Right: Auth / Profile Dropdown ── */}
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          {user ? (
            <div style={{ position: "relative" }} ref={menuRef}>
              <button
                type="button"
                onClick={() => setMenuOpen(!menuOpen)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "6px",
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  color: "#ffffff",
                  padding: "4px 8px",
                  borderRadius: APPLE_RADII.pill,
                }}
              >
                <span
                  style={{
                    width: "22px",
                    height: "22px",
                    borderRadius: "50%",
                    backgroundColor: APPLE_COLORS.primary,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "10px",
                    fontWeight: 700,
                    color: "#ffffff",
                  }}
                >
                  {initials}
                </span>
                <span
                  style={{
                    fontSize: "12px",
                    color: "rgba(255, 255, 255, 0.85)",
                    maxWidth: "80px",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                  }}
                >
                  {user.username}
                </span>
                <ChevronDown size={12} color="rgba(255,255,255,0.6)" />
              </button>

              <AnimatePresence>
                {menuOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -4, scale: 0.96 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -4, scale: 0.96 }}
                    transition={{ duration: 0.18, ease: [0.25, 1, 0.5, 1] }}
                    style={{
                      position: "absolute",
                      top: "calc(100% + 6px)",
                      right: 0,
                      minWidth: "220px",
                      backgroundColor: "#ffffff",
                      border: `1px solid ${APPLE_COLORS.hairline}`,
                      borderRadius: APPLE_RADII.lg,
                      boxShadow: "0 16px 36px rgba(0, 0, 0, 0.12)",
                      padding: "8px",
                      zIndex: 1001,
                      overflow: "hidden",
                    }}
                  >
                    <div style={{ padding: "8px 12px 10px" }}>
                      <p style={{ fontSize: "11px", color: APPLE_COLORS.inkMuted48, margin: 0 }}>
                        Signed in as
                      </p>
                      <p
                        style={{
                          fontSize: "14px",
                          fontWeight: 600,
                          color: APPLE_COLORS.ink,
                          margin: "2px 0 6px",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap",
                        }}
                      >
                        {user.username}
                      </p>
                      <span
                        style={{
                          fontSize: "10px",
                          padding: "2px 6px",
                          borderRadius: "4px",
                          backgroundColor: "rgba(0, 102, 204, 0.08)",
                          color: APPLE_COLORS.primary,
                          textTransform: "uppercase",
                          fontWeight: 600,
                          letterSpacing: "0.04em",
                        }}
                      >
                        {user.role}
                      </span>
                    </div>

                    <div style={{ height: "1px", backgroundColor: APPLE_COLORS.hairline, margin: "4px 0" }} />

                    {(user.role === "member" || user.role === "alumni") && (
                      <>
                        {profileId && (
                          <Link
                            href={`/profiles/${profileId}`}
                            onClick={() => setMenuOpen(false)}
                            style={{
                              display: "flex",
                              alignItems: "center",
                              gap: "10px",
                              padding: "8px 12px",
                              borderRadius: APPLE_RADII.sm,
                              fontSize: "13px",
                              color: APPLE_COLORS.ink,
                              textDecoration: "none",
                              transition: "background-color 0.15s ease",
                            }}
                            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#f5f5f7")}
                            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "transparent")}
                          >
                            <UserCheck size={14} color={APPLE_COLORS.primary} />
                            <span>View Showcase</span>
                          </Link>
                        )}
                        <Link
                          href="/portfolio"
                          onClick={() => setMenuOpen(false)}
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "10px",
                            padding: "8px 12px",
                            borderRadius: APPLE_RADII.sm,
                            fontSize: "13px",
                            color: APPLE_COLORS.ink,
                            textDecoration: "none",
                            transition: "background-color 0.15s ease",
                          }}
                          onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#f5f5f7")}
                          onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "transparent")}
                        >
                          <Edit3 size={14} color={APPLE_COLORS.primary} />
                          <span>Edit Portfolio</span>
                        </Link>
                      </>
                    )}

                    {user.role === "admin" && (
                      <Link
                        href="/admin"
                        onClick={() => setMenuOpen(false)}
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "10px",
                          padding: "8px 12px",
                          borderRadius: APPLE_RADII.sm,
                          fontSize: "13px",
                          color: APPLE_COLORS.ink,
                          textDecoration: "none",
                          transition: "background-color 0.15s ease",
                        }}
                        onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#f5f5f7")}
                        onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "transparent")}
                      >
                        <ShieldAlert size={14} color={APPLE_COLORS.primary} />
                        <span>Admin Dashboard</span>
                      </Link>
                    )}

                    <div style={{ height: "1px", backgroundColor: APPLE_COLORS.hairline, margin: "4px 0" }} />

                    <div
                      onClick={() => {
                        logout();
                        setMenuOpen(false);
                      }}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "10px",
                        padding: "8px 12px",
                        borderRadius: APPLE_RADII.sm,
                        fontSize: "13px",
                        color: "#d70015",
                        cursor: "pointer",
                        transition: "background-color 0.15s ease",
                      }}
                      onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "rgba(215, 0, 21, 0.06)")}
                      onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "transparent")}
                    >
                      <LogOut size={14} color="#d70015" />
                      <span>Sign Out</span>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ) : (
            <Link
              href="/auth"
              style={{
                display: "flex",
                alignItems: "center",
                gap: "4px",
                fontSize: "12px",
                color: "#ffffff",
                textDecoration: "none",
                padding: "3px 10px",
                borderRadius: APPLE_RADII.pill,
                backgroundColor: "rgba(255, 255, 255, 0.12)",
                transition: "background-color 0.15s ease",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "rgba(255, 255, 255, 0.22)")}
              onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "rgba(255, 255, 255, 0.12)")}
            >
              <User size={12} />
              <span>Sign In</span>
            </Link>
          )}

          {/* Mobile hamburger button */}
          <button
            type="button"
            className="md:hidden"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              color: "#ffffff",
              display: "flex",
              alignItems: "center",
              padding: "4px",
            }}
          >
            {mobileMenuOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            style={{
              position: "absolute",
              top: "44px",
              left: 0,
              right: 0,
              backgroundColor: APPLE_COLORS.surfaceBlack,
              borderBottom: "1px solid rgba(255, 255, 255, 0.12)",
              padding: "16px 20px",
              display: "flex",
              flexDirection: "column",
              gap: "14px",
              zIndex: 999,
            }}
          >
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                style={{
                  fontSize: "14px",
                  color: "#ffffff",
                  textDecoration: "none",
                }}
              >
                {link.label}
              </Link>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
