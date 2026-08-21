"use client";
import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { useTheme } from "@/context/ThemeContext";

import Button from "@/components/OKCButton";
import IconButton from "@leafygreen-ui/icon-button";
import { Menu, MenuItem, MenuSeparator } from "@leafygreen-ui/menu";
import LeafyGreenProvider from "@leafygreen-ui/leafygreen-provider";
import Icon from "@leafygreen-ui/icon";
import { palette } from "@leafygreen-ui/palette";

export default function Navbar() {
  const { user, profileId, logout } = useAuth();
  const { darkMode, toggleTheme } = useTheme();
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = usePathname();

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

  const navBg = darkMode
    ? "rgba(12, 14, 15, 0.92)"
    : "rgba(255, 255, 255, 0.95)";
  const navBorder = darkMode
    ? "rgba(255,255,255,0.08)"
    : "rgba(0,0,0,0.08)";

  return (
    <LeafyGreenProvider darkMode={darkMode}>
      <div style={{ position: "sticky", top: 0, zIndex: 999, padding: "20px 24px 16px", pointerEvents: "none" }}>
        <nav
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

          {/* ── Center: Nav Links ── */}
          <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  style={{
                    padding: "4px 12px",
                    borderRadius: "6px",
                    fontSize: "13px",
                    fontWeight: isActive ? 600 : 400,
                    color: isActive
                      ? "#E8693F"
                      : darkMode
                      ? palette.gray.light1
                      : palette.gray.dark1,
                    background: isActive
                      ? "rgba(232, 105, 63, 0.08)"
                      : "transparent",
                    textDecoration: "none",
                    transition: "all 0.15s ease",
                    borderBottom: isActive
                      ? "2px solid #E8693F"
                      : "2px solid transparent",
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
              <Menu
                open={menuOpen}
                setOpen={setMenuOpen}
                darkMode={darkMode}
                trigger={
                  <Button
                    darkMode={darkMode}
                    size="xsmall"
                    leftGlyph={
                      <span
                        style={{
                          width: "18px",
                          height: "18px",
                          borderRadius: "50%",
                          background: "linear-gradient(135deg, #F0A500 0%, #E8693F 50%, #F0387A 100%)",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          fontSize: "9px",
                          fontWeight: 700,
                          color: "#fff",
                          flexShrink: 0,
                        }}
                      >
                        {initials}
                      </span>
                    }
                    rightGlyph={<Icon glyph="CaretDown" />}
                  >
                    <span style={{ maxWidth: "80px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                      {user.username}
                    </span>
                  </Button>
                }
              >
                <div
                  style={{
                    padding: "8px 12px 6px",
                    borderBottom: `1px solid ${darkMode ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.08)"}`,
                    marginBottom: "4px",
                  }}
                >
                  <p style={{ fontSize: "10px", color: palette.gray.base, margin: 0 }}>Signed in as</p>
                  <p
                    style={{
                      fontSize: "13px",
                      fontWeight: 600,
                      color: darkMode ? palette.white : palette.black,
                      margin: "2px 0 4px",
                    }}
                  >
                    {user.username}
                  </p>
                  <span
                    style={{
                      fontSize: "9px",
                      padding: "2px 6px",
                      borderRadius: "4px",
                      background: "rgba(232, 105, 63, 0.10)",
                      border: "1px solid rgba(232, 105, 63, 0.28)",
                      color: "#E8693F",
                      textTransform: "uppercase",
                      fontWeight: 700,
                      letterSpacing: "0.05em",
                    }}
                  >
                    {user.role}
                  </span>
                </div>

                {(user.role === "member" || user.role === "alumni") && (
                  <>
                    {profileId && (
                      <MenuItem
                        as={Link}
                        href={`/profiles/${profileId}`}
                        glyph={<Icon glyph="Person" />}
                        onClick={() => setMenuOpen(false)}
                      >
                        View Showcase
                      </MenuItem>
                    )}
                    <MenuItem
                      as={Link}
                      href="/portfolio"
                      glyph={<Icon glyph="Edit" />}
                      onClick={() => setMenuOpen(false)}
                    >
                      Edit Portfolio
                    </MenuItem>
                  </>
                )}

                {user.role === "admin" && (
                  <MenuItem
                    as={Link}
                    href="/admin"
                    glyph={<Icon glyph="Settings" />}
                    onClick={() => setMenuOpen(false)}
                  >
                    Admin Dashboard
                  </MenuItem>
                )}

                <MenuSeparator />

                <MenuItem
                  glyph={<Icon glyph="LogOut" />}
                  variant="destructive"
                  onClick={() => {
                    logout();
                    setMenuOpen(false);
                  }}
                >
                  Sign Out
                </MenuItem>
              </Menu>
            ) : (
              <Button
                as={Link}
                href="/auth"
                darkMode={darkMode}
                variant="primary"
                size="xsmall"
              >
                Login
              </Button>
            )}
          </div>
        </div>
        </nav>
      </div>
    </LeafyGreenProvider>
  );
}
