"use client";
import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { useTheme } from "@/context/ThemeContext";
import { User as UserIcon, ChevronDown, LogOut, LayoutDashboard, FileEdit, Sun, Moon, Terminal, Briefcase } from "lucide-react";

export default function Navbar() {
  const { user, profileId, logout } = useAuth();
  const { theme, toggleTheme, brandStyle, toggleBrandStyle } = useTheme();
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
    { href: "/", label: "Home" },
    { href: "/directory", label: "Talent Directory" },
    { href: "/pitches", label: "Pitches Board" },
  ];

  const isLight = theme === "light";

  return (
    <nav
      className="sticky top-0 z-50 border-b h-14 flex items-center shadow-neo-sm"
      style={{
        background: isLight ? "#ffffff" : "#0a0c12",
        borderColor: isLight ? "#cbd5e1" : "#1e2433",
      }}
    >
      <div className="max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-3">

        {/* Left: Logo & Portal Tag */}
        <div className="flex items-center gap-3">
          <Link href="/" className="flex items-center gap-2.5 select-none group flex-shrink-0">
            <Image
              src="/okc_main_logo.png"
              alt="OKC Logo"
              width={22}
              height={22}
              className="object-contain transition-transform duration-300 group-hover:scale-110"
            />
            <Image
              src="/name_logo.png"
              alt="Oyster Kode Club"
              width={96}
              height={16}
              style={{ width: "auto", height: "auto" }}
              loading="eager"
              className="object-contain hidden sm:block opacity-90 group-hover:opacity-100 transition-opacity"
            />
          </Link>

          {/* Minimal Neobrutalist Code Pill */}
          <div className="hidden lg:inline-flex items-center gap-1.5 neo-badge neo-badge-amber">
            <Terminal size={11} />
            <span>[ DEV_PORTAL: ONLINE ]</span>
          </div>
        </div>

        {/* Center: Nav Links */}
        <div className="flex items-center gap-1.5">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className="relative px-3.5 py-1.5 text-xs font-mono font-bold tracking-wide rounded-md transition-all duration-150"
                style={{
                  color: isActive
                    ? (brandStyle === "linkedin" ? "#0a66c2" : "#f0a500")
                    : isLight ? "#475569" : "#94a3b8",
                  background: isActive
                    ? (brandStyle === "linkedin" ? (isLight ? "#e8f2fe" : "rgba(10,102,194,0.18)") : (isLight ? "#fef3c7" : "rgba(240,165,0,0.12)"))
                    : "transparent",
                  border: isActive
                    ? `1px solid ${brandStyle === "linkedin" ? "#0a66c2" : "#f0a500"}`
                    : "1px solid transparent",
                }}
              >
                {link.label}
              </Link>
            );
          })}
        </div>

        {/* Right: Theme Toggle + LinkedIn Switcher + Auth */}
        <div className="flex items-center gap-2 flex-shrink-0">
          
          {/* LinkedIn vs OKC Brand Toggle */}
          <button
            onClick={toggleBrandStyle}
            title={brandStyle === "linkedin" ? "Switch to Official OKC Theme" : "Switch to LinkedIn Look"}
            className="px-2.5 py-1 rounded-md text-[11px] font-mono font-bold flex items-center gap-1.5 transition-all cursor-pointer shadow-neo-sm border"
            style={
              brandStyle === "linkedin"
                ? { background: "#0a66c2", color: "#ffffff", borderColor: "#004182" }
                : { background: "rgba(240,165,0,0.12)", color: "#f0a500", borderColor: "#f0a500" }
            }
          >
            <Briefcase size={12} />
            <span>{brandStyle === "linkedin" ? "LINKEDIN LOOK" : "OKC GRADIENT"}</span>
          </button>

          {/* Dark / Light toggle */}
          <button
            onClick={toggleTheme}
            title={isLight ? "Switch to Dark Mode" : "Switch to Light Mode"}
            className="w-8 h-8 rounded-md flex items-center justify-center transition-all cursor-pointer neo-btn-ghost"
          >
            {isLight ? <Moon size={14} /> : <Sun size={14} />}
          </button>

          {/* Auth */}
          <div className="relative" ref={dropdownRef}>
            {user ? (
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="flex items-center gap-2 px-3 py-1.5 rounded-md text-xs font-mono font-bold neo-btn-ghost cursor-pointer"
              >
                <div
                  className="w-4 h-4 rounded-full text-[9px] font-bold flex items-center justify-center text-white flex-shrink-0 brand-gradient"
                >
                  {initials}
                </div>
                <span className="max-w-[85px] truncate">{user.username}</span>
                <ChevronDown
                  size={12}
                  className="transition-transform duration-200"
                  style={{ transform: dropdownOpen ? "rotate(180deg)" : "rotate(0deg)" }}
                />
              </button>
            ) : (
              <Link
                href="/auth"
                className="btn-brand text-xs px-4 py-1.5 rounded-md font-mono uppercase tracking-wider cursor-pointer"
              >
                Sign In
              </Link>
            )}

            {/* Dropdown */}
            {dropdownOpen && user && (
              <div
                className="absolute right-0 mt-2 w-48 rounded-md shadow-neo p-1.5 z-50 anim-floatDown"
                style={{
                  background: isLight ? "#ffffff" : "#0d0f17",
                  border: `1px solid ${isLight ? "#cbd5e1" : "#1e2433"}`,
                }}
              >
                <div className="px-3 py-2 border-b mb-1 border-gray-800"
                  style={{ borderColor: isLight ? "#cbd5e1" : "#1e2433" }}>
                  <p className="text-[10px] font-mono text-gray-500 uppercase">Signed in as</p>
                  <p className="text-xs font-bold truncate" style={{ color: isLight ? "#0f172a" : "#ffffff" }}>
                    {user.username}
                  </p>
                  <span className="neo-badge neo-badge-amber mt-1 inline-block text-[9px]">
                    {user.role}
                  </span>
                </div>

                {(user.role === "member" || user.role === "alumni") && (
                  <>
                    {profileId && (
                      <Link href={`/profiles/${profileId}`} onClick={() => setDropdownOpen(false)}
                        className="flex items-center gap-2 px-3 py-1.5 text-xs font-mono font-medium rounded transition-colors"
                        style={{ color: isLight ? "#334155" : "#cbd5e1" }}
                        onMouseEnter={(e) => { (e.currentTarget as HTMLAnchorElement).style.background = isLight ? "#f1f5f9" : "#161b28"; }}
                        onMouseLeave={(e) => { (e.currentTarget as HTMLAnchorElement).style.background = "transparent"; }}>
                        <UserIcon size={13} />
                        <span>View Showcase</span>
                      </Link>
                    )}
                    <Link href="/portfolio" onClick={() => setDropdownOpen(false)}
                      className="flex items-center gap-2 px-3 py-1.5 text-xs font-mono font-medium rounded transition-colors"
                      style={{ color: isLight ? "#334155" : "#cbd5e1" }}
                      onMouseEnter={(e) => { (e.currentTarget as HTMLAnchorElement).style.background = isLight ? "#f1f5f9" : "#161b28"; }}
                      onMouseLeave={(e) => { (e.currentTarget as HTMLAnchorElement).style.background = "transparent"; }}>
                      <FileEdit size={13} />
                      <span>Edit Portfolio</span>
                    </Link>
                  </>
                )}

                {user.role === "admin" && (
                  <Link href="/admin" onClick={() => setDropdownOpen(false)}
                    className="flex items-center gap-2 px-3 py-1.5 text-xs font-mono font-medium rounded transition-colors"
                    style={{ color: isLight ? "#334155" : "#cbd5e1" }}
                    onMouseEnter={(e) => { (e.currentTarget as HTMLAnchorElement).style.background = isLight ? "#f1f5f9" : "#161b28"; }}
                    onMouseLeave={(e) => { (e.currentTarget as HTMLAnchorElement).style.background = "transparent"; }}>
                    <LayoutDashboard size={13} />
                    <span>Admin Panel</span>
                  </Link>
                )}

                <div className="border-t mt-1 pt-1"
                  style={{ borderColor: isLight ? "#cbd5e1" : "#1e2433" }}>
                  <button
                    onClick={() => { logout(); setDropdownOpen(false); }}
                    className="w-full flex items-center gap-2 px-3 py-1.5 text-xs font-mono text-red-500 font-bold cursor-pointer rounded transition-colors"
                    onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.background = "rgba(239,68,68,0.1)"; }}
                    onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.background = "transparent"; }}
                  >
                    <LogOut size={13} />
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
