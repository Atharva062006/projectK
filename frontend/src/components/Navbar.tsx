"use client";
import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { User as UserIcon, ChevronDown, LogOut, LayoutDashboard, FileEdit } from "lucide-react";

export default function Navbar() {
  const { user, profileId, logout } = useAuth();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const initials = user?.username ? user.username.split(" ").map(n => n[0]).join("").toUpperCase() : "?";

  return (
    <nav className="bg-[#0e1017] border-b border-gray-800 px-6 py-4 flex items-center justify-between sticky top-0 z-50">
      {/* Left side: Logo */}
      <Link href="/" className="flex items-center gap-3 select-none cursor-pointer">
        <div className="w-6 h-6 rounded-lg bg-blue-600 flex items-center justify-center font-bold text-xs text-white">K</div>
        <span className="font-semibold text-white tracking-wide text-sm font-mono uppercase">Oyster Kode Club</span>
      </Link>

      {/* Center: Navigation Links */}
      <div className="flex items-center gap-6">
        <Link href="/" className="text-xs font-mono text-gray-400 hover:text-white transition-colors">
          Members
        </Link>
        <Link href="/pitches" className="text-xs font-mono text-gray-400 hover:text-white transition-colors">
          Pitches
        </Link>
      </div>

      {/* Right side: Auth Action / Dropdown */}
      <div className="relative" ref={dropdownRef}>
        {user ? (
          <button
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="flex items-center gap-2 bg-[#1b1e2c] border border-gray-700 hover:bg-[#25293c] px-3 py-1.5 rounded-lg text-white font-mono text-xs transition-all cursor-pointer"
          >
            <div className="w-5 h-5 rounded-full bg-blue-700 text-[10px] font-bold flex items-center justify-center text-white">
              {initials}
            </div>
            <span className="max-w-[100px] truncate">{user.username}</span>
            <ChevronDown size={12} className="text-gray-400" />
          </button>
        ) : (
          <Link
            href="/auth"
            className="text-xs bg-[#1b1e2c] border border-gray-700 hover:bg-[#25293c] px-3.5 py-1.5 rounded-lg text-white font-mono transition-all"
          >
            Login/Signup
          </Link>
        )}

        {/* Dropdown Menu */}
        {dropdownOpen && user && (
          <div className="absolute right-0 mt-2 w-48 bg-[#0e1017] border border-gray-800 rounded-xl shadow-xl py-1 z-50">
            <div className="px-3 py-2 border-b border-gray-800 text-[10px] font-mono text-gray-500">
              Role: <span className="text-gray-300 font-bold uppercase">{user.role}</span>
            </div>

            {/* Member / Alumni Actions */}
            {(user.role === "member" || user.role === "alumni") && (
              <>
                {profileId && (
                  <Link
                    href={`/profiles/${profileId}`}
                    onClick={() => setDropdownOpen(false)}
                    className="flex items-center gap-2 px-3 py-2 text-xs font-mono text-gray-300 hover:bg-gray-800 hover:text-white transition-colors"
                  >
                    <UserIcon size={12} />
                    <span>View Showcase</span>
                  </Link>
                )}
                <Link
                  href="/portfolio"
                  onClick={() => setDropdownOpen(false)}
                  className="flex items-center gap-2 px-3 py-2 text-xs font-mono text-gray-300 hover:bg-gray-800 hover:text-white transition-colors"
                >
                  <FileEdit size={12} />
                  <span>Edit Portfolio</span>
                </Link>
              </>
            )}

            {/* Admin Actions */}
            {user.role === "admin" && (
              <Link
                href="/admin"
                onClick={() => setDropdownOpen(false)}
                className="flex items-center gap-2 px-3 py-2 text-xs font-mono text-gray-300 hover:bg-gray-800 hover:text-white transition-colors"
              >
                <LayoutDashboard size={12} />
                <span>Admin Dashboard</span>
              </Link>
            )}

            <button
              onClick={() => {
                logout();
                setDropdownOpen(false);
              }}
              className="w-full flex items-center gap-2 px-3 py-2 text-xs font-mono text-red-400 hover:bg-gray-800 hover:text-red-300 transition-colors border-t border-gray-850 mt-1"
            >
              <LogOut size={12} />
              <span>Logout</span>
            </button>
          </div>
        )}
      </div>
    </nav>
  );
}
