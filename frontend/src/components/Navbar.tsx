"use client";
import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { useTheme } from "@/context/ThemeContext";
import { User as UserIcon, ChevronDown, LogOut, LayoutDashboard, FileEdit, Sun, Moon } from "lucide-react";

export default function Navbar() {
  const { user, profileId, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const initials = user?.username
    ? user.username.split(" ").map((n) => n[0]).join("").toUpperCase()
    : "?";

  const navLinks = [
    { href: "/directory", label: "Members" },
    { href: "/pitches", label: "Pitches" },
  ];

  const isLight = theme === "light";

  return (
    <nav
      className="sticky top-0 z-50 border-b h-12 flex items-center"
      style={{
        background: isLight
          ? "rgba(255, 255, 255, 0.95)"
          : "rgba(7, 8, 13, 0.88)",
        backdropFilter: "blur(16px)",
        WebkitBackdropFilter: "blur(16px)",
        borderColor: isLight
          ? "rgba(0, 0, 0, 0.08)"
          : "rgba(255, 255, 255, 0.08)",
      }}
    >
      <div className="max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-4">

        {/* Left: Logo */}
        <Link href="/" className="flex items-center gap-2 select-none group flex-shrink-0">
          <Image
            src="/okc_main_logo.png"
            alt="OKC Logo"
            width={18}
            height={18}
            className="object-contain transition-transform duration-300 group-hover:scale-105"
          />
          <Image
            src="/name_logo.png"
            alt="Oyster Kode Club"
            width={88}
            height={14}
            style={{ width: "auto", height: "auto" }}
            loading="eager"
            className="object-contain hidden sm:block opacity-90 group-hover:opacity-100 transition-opacity"
          />
        </Link>

        {/* Center: Nav Links */}
        <div className="flex items-center gap-1">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className="relative px-3 py-1 text-xs font-medium rounded-md transition-all duration-200"
                style={{
                  color: isActive
                    ? "#f0a500"
                    : isLight ? "#4b5563" : "#9ca3af",
                  background: isActive
                    ? "rgba(240,165,0,0.08)"
                    : "transparent",
                }}
                onMouseEnter={(e) => {
                  if (!isActive) (e.currentTarget as HTMLAnchorElement).style.color = isLight ? "#111827" : "#ffffff";
                }}
                onMouseLeave={(e) => {
                  if (!isActive) (e.currentTarget as HTMLAnchorElement).style.color = isLight ? "#4b5563" : "#9ca3af";
                }}
              >
                {link.label}
                {isActive && (
                  <span
                    className="absolute bottom-0 left-1/2 -translate-x-1/2 h-[2px] w-3.5 rounded-full"
                    style={{ background: "linear-gradient(90deg, #f0a500, #f01870)" }}
                  />
                )}
              </Link>
            );
          })}
        </div>

        {/* Right: Theme Toggle + Auth */}
        <div className="flex items-center gap-2 flex-shrink-0">
          {/* Dark / Light toggle */}
          <button
            onClick={toggleTheme}
            title={isLight ? "Switch to Dark Mode" : "Switch to Light Mode"}
            className="w-7 h-7 rounded-md flex items-center justify-center transition-all cursor-pointer"
            style={{
              background: isLight ? "rgba(0,0,0,0.05)" : "rgba(255,255,255,0.06)",
              border: `1px solid ${isLight ? "rgba(0,0,0,0.1)" : "rgba(255,255,255,0.1)"}`,
              color: isLight ? "#374151" : "#9ca3af",
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLButtonElement).style.borderColor = "rgba(240,165,0,0.45)";
              (e.currentTarget as HTMLButtonElement).style.color = "#f0a500";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLButtonElement).style.borderColor = isLight ? "rgba(0,0,0,0.1)" : "rgba(255,255,255,0.1)";
              (e.currentTarget as HTMLButtonElement).style.color = isLight ? "#374151" : "#9ca3af";
            }}
          >
            {isLight ? <Moon size={13} /> : <Sun size={13} />}
          </button>

          {/* Auth */}
          <div className="relative" ref={dropdownRef}>
            {user ? (
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="flex items-center gap-1.5 px-2 py-1 rounded-md text-xs font-medium transition-all cursor-pointer"
                style={{
                  background: isLight ? "rgba(0,0,0,0.04)" : "rgba(255,255,255,0.05)",
                  border: `1px solid ${isLight ? "rgba(0,0,0,0.1)" : "rgba(255,255,255,0.1)"}`,
                  color: isLight ? "#111827" : "#e8eaf0",
                }}
              >
                <div
                  className="w-4 h-4 rounded-full text-[9px] font-bold flex items-center justify-center text-white flex-shrink-0"
                  style={{ background: "linear-gradient(135deg, #f0a500, #f01870)" }}
                >
                  {initials}
                </div>
                <span className="max-w-[75px] truncate">{user.username}</span>
                <ChevronDown
                  size={11}
                  className="text-gray-400 transition-transform duration-200"
                  style={{ transform: dropdownOpen ? "rotate(180deg)" : "rotate(0deg)" }}
                />
              </button>
            ) : (
              <Link
                href="/auth"
                className="btn-brand text-xs px-3 py-1 rounded-md text-white font-medium cursor-pointer"
              >
                Login
              </Link>
            )}

            {/* Dropdown */}
            {dropdownOpen && user && (
              <div
                className="absolute right-0 mt-1.5 w-44 rounded-lg shadow-xl py-1 z-50 anim-floatDown"
                style={{
                  background: isLight ? "#ffffff" : "rgba(10,11,16,0.98)",
                  border: `1px solid ${isLight ? "rgba(0,0,0,0.1)" : "rgba(255,255,255,0.1)"}`,
                  boxShadow: "0 10px 30px rgba(0,0,0,0.15)",
                }}
              >
                <div className="px-3 py-1.5 border-b mb-1"
                  style={{ borderColor: isLight ? "rgba(0,0,0,0.07)" : "rgba(255,255,255,0.06)" }}>
                  <p className="text-[10px] text-gray-400">Signed in as</p>
                  <p className="text-xs font-semibold truncate" style={{ color: isLight ? "#111827" : "#ffffff" }}>
                    {user.username}
                  </p>
                  <span
                    className="text-[9px] px-1.5 py-0.2 rounded mt-0.5 inline-block uppercase font-bold"
                    style={{ background: "rgba(240,165,0,0.12)", border: "1px solid rgba(240,165,0,0.25)", color: "#f0a500" }}
                  >
                    {user.role}
                  </span>
                </div>

                {(user.role === "member" || user.role === "alumni") && (
                  <>
                    {profileId && (
                      <Link href={`/profiles/${profileId}`} onClick={() => setDropdownOpen(false)}
                        className="flex items-center gap-2 px-2.5 py-1 text-xs rounded mx-0.5 transition-colors"
                        style={{ color: isLight ? "#374151" : "#d1d5db" }}
                        onMouseEnter={(e) => { (e.currentTarget as HTMLAnchorElement).style.background = isLight ? "#f3f4f6" : "rgba(255,255,255,0.05)"; }}
                        onMouseLeave={(e) => { (e.currentTarget as HTMLAnchorElement).style.background = "transparent"; }}>
                        <UserIcon size={12} className="text-gray-400" />
                        <span>View Showcase</span>
                      </Link>
                    )}
                    <Link href="/portfolio" onClick={() => setDropdownOpen(false)}
                      className="flex items-center gap-2 px-2.5 py-1 text-xs rounded mx-0.5 transition-colors"
                      style={{ color: isLight ? "#374151" : "#d1d5db" }}
                      onMouseEnter={(e) => { (e.currentTarget as HTMLAnchorElement).style.background = isLight ? "#f3f4f6" : "rgba(255,255,255,0.05)"; }}
                      onMouseLeave={(e) => { (e.currentTarget as HTMLAnchorElement).style.background = "transparent"; }}>
                      <FileEdit size={12} className="text-gray-400" />
                      <span>Edit Portfolio</span>
                    </Link>
                  </>
                )}

                {user.role === "admin" && (
                  <Link href="/admin" onClick={() => setDropdownOpen(false)}
                    className="flex items-center gap-2 px-2.5 py-1 text-xs rounded mx-0.5 transition-colors"
                    style={{ color: isLight ? "#374151" : "#d1d5db" }}
                    onMouseEnter={(e) => { (e.currentTarget as HTMLAnchorElement).style.background = isLight ? "#f3f4f6" : "rgba(255,255,255,0.05)"; }}
                    onMouseLeave={(e) => { (e.currentTarget as HTMLAnchorElement).style.background = "transparent"; }}>
                    <LayoutDashboard size={12} className="text-gray-400" />
                    <span>Admin Dashboard</span>
                  </Link>
                )}

                <div className="border-t mt-1 pt-1"
                  style={{ borderColor: isLight ? "rgba(0,0,0,0.07)" : "rgba(255,255,255,0.06)" }}>
                  <button
                    onClick={() => { logout(); setDropdownOpen(false); }}
                    className="w-full flex items-center gap-2 px-2.5 py-1 text-xs text-red-400 hover:text-red-500 cursor-pointer rounded transition-colors"
                    onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.background = "rgba(239,68,68,0.07)"; }}
                    onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.background = "transparent"; }}
                  >
                    <LogOut size={12} />
                    <span>Sign Out</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
