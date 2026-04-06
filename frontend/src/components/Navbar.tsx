"use client";

import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { useState } from "react";

export default function Navbar() {
  const { user, login, logout } = useAuth();

  return (
    <nav className="bg-white dark:bg-zinc-900 border-b-[3px] border-black dark:border-white shadow-[4px_4px_0px_0px_#2f2f2f] flex justify-between items-center w-full px-6 py-4 fixed top-0 z-50">
      <div className="text-2xl font-black italic text-black dark:text-white">CLUB_PORTAL</div>
      
      {/* Navigation Links */}
      <div className="hidden md:flex items-center gap-8">
        <Link 
          href="/" 
          className="font-extrabold uppercase tracking-tighter text-black dark:text-white hover:bg-secondary-container hover:text-black hover:underline decoration-[3px] underline-offset-4 transition-colors px-2 py-1"
        >
          Home
        </Link>
        <Link 
          href="/members" 
          className="font-extrabold uppercase tracking-tighter text-black dark:text-white hover:bg-secondary-container hover:text-black hover:underline decoration-[3px] underline-offset-4 transition-colors px-2 py-1"
        >
          Members
        </Link>
        {user && (
          <Link 
            href={`/profile/${user.id}`} 
            className="font-extrabold uppercase tracking-tighter text-black dark:text-white hover:bg-secondary-container hover:text-black hover:underline decoration-[3px] underline-offset-4 transition-colors px-2 py-1"
          >
            My Profile
          </Link>
        )}
      </div>

      <div className="flex items-center gap-4">
        {user ? (
          <div className="flex items-center gap-4">
            <span className="font-bold text-sm tracking-widest hidden md:inline-block">[{user.name}]</span>
            <button 
              onClick={logout} 
              className="bg-black text-white border-[3px] border-black px-4 py-1.5 font-extrabold uppercase tracking-tighter hover:bg-error hover:border-error transition-all"
            >
              Logout
            </button>
          </div>
        ) : (
          <>
            <button 
              onClick={login} 
              className="font-extrabold uppercase tracking-tighter text-black dark:text-white hover:text-primary transition-colors"
            >
              Login
            </button>
            <button 
              onClick={login} 
              className="bg-primary text-white border-[3px] border-black px-6 py-2 font-extrabold uppercase tracking-tighter neo-shadow active:translate-x-[2px] active:translate-y-[2px] active:shadow-none transition-all"
            >
              Sign Up
            </button>
          </>
        )}
      </div>
    </nav>
  );
}
