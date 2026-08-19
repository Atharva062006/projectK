"use client";
import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { api } from "@/lib/api";
import ResponseBox from "@/components/ResponseBox";
import { ShieldAlert, UserPlus, KeyRound, Mail, User as UserIcon, LogIn, UserCog, Terminal } from "lucide-react";

type AuthMode = "login" | "register" | "forgot";

export default function AuthPage() {
  const router = useRouter();
  const { login, user, logout } = useAuth();
  const [mode, setMode] = useState<AuthMode>("login");
  const [result, setResult] = useState<{ ok: boolean; message: string; data?: unknown } | null>(null);
  const [loading, setLoading] = useState(false);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("member");
  const [resetEmail, setResetEmail] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setResult(null);
    try {
      const res = await api.auth.login({ email, password });
      setResult(res);
      if (res.ok && res.data) {
        const payload = res.data as { token: string; user: Parameters<typeof login>[1] };
        login(payload.token, payload.user);
        setTimeout(() => {
          if (payload.user.role === "admin") router.push("/admin");
          else if (payload.user.role === "member" || payload.user.role === "alumni") router.push("/portfolio");
          else router.push("/");
        }, 100);
      }
    } catch {
      setResult({ ok: false, message: "Server connection failed" });
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setResult(null);
    try {
      const res = await api.auth.register({ name, email, password, role });
      setResult(res);
      if (res.ok) { setName(""); setPassword(""); setMode("login"); }
    } catch {
      setResult({ ok: false, message: "Registration service failed" });
    } finally {
      setLoading(false);
    }
  };

  const handleRequestReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setResult(null);
    try {
      const res = await api.auth.requestReset(resetEmail);
      setResult(res);
    } catch {
      setResult({ ok: false, message: "Reset request failed" });
    } finally {
      setLoading(false);
    }
  };

  /* ── Already Logged In ── */
  if (user) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center">
        <div className="neo-card rounded-xl p-8 text-center space-y-5 w-full max-w-sm border-2 border-slate-800 shadow-neo anim-scaleIn">
          <div className="w-14 h-14 rounded-xl flex items-center justify-center mx-auto brand-gradient shadow-neo-brand">
            <UserIcon size={24} className="text-white" />
          </div>
          <div>
            <span className="neo-badge neo-badge-green">[ ACTIVE SESSION ]</span>
            <h2 className="font-mono font-bold text-base text-slate-100 mt-2">{user.username}</h2>
            <div className="mt-1">
              <span className="neo-badge neo-badge-amber text-[10px]">[ {(user?.role || "member").toUpperCase()} ]</span>
            </div>
          </div>
          <div className="flex gap-3 pt-2">
            <button
              onClick={() => router.push(user.role === "admin" ? "/admin" : "/portfolio")}
              className="neo-btn-brand flex-1 py-2.5 rounded-lg font-mono text-xs uppercase tracking-wider cursor-pointer"
            >
              [ WORKSPACE ]
            </button>
            <button
              onClick={logout}
              className="btn-danger flex-1 py-2.5 rounded-lg font-mono text-xs uppercase tracking-wider cursor-pointer"
            >
              [ SIGN OUT ]
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center py-8">
      
      {/* Brand Header */}
      <div className="text-center mb-8 anim-floatDown">
        <div className="flex justify-center mb-3">
          <div className="relative logo-3d-animated p-2 rounded-lg border border-slate-800 bg-slate-900/60 shadow-neo-sm">
            <Image src="/okc_main_logo.png" alt="OKC" width={64} height={64} className="object-contain" />
          </div>
        </div>
        <div className="neo-badge neo-badge-amber mb-2 inline-block">[ AUTHENTICATION GATEWAY ]</div>
        <h1 className="text-3xl font-mono font-black uppercase tracking-tight">PROJECT K PORTAL</h1>
        <p className="font-mono text-xs text-slate-400 mt-1">Oyster Kode Club Talent & Recruitment Ecosystem</p>
      </div>

      {/* Main Auth Card */}
      <div className="neo-card w-full max-w-md rounded-xl p-8 space-y-6 border-2 border-slate-800 shadow-neo bg-tech-grid anim-scaleIn">
        
        {/* Tab Switcher */}
        {mode !== "forgot" && (
          <div className="neo-card rounded-lg p-1.5 flex gap-2 border border-slate-800 bg-slate-950/80">
            {[
              { id: "login" as AuthMode, label: "Sign In", icon: LogIn },
              { id: "register" as AuthMode, label: "Register", icon: UserCog },
            ].map((tab) => {
              const isActive = mode === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => { setMode(tab.id); setResult(null); }}
                  className={`flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-md font-mono text-xs uppercase font-bold transition-all cursor-pointer ${
                    isActive ? "neo-btn-brand" : "neo-btn-ghost border-transparent"
                  }`}
                >
                  <tab.icon size={14} />
                  <span>[ {tab.label.toUpperCase()} ]</span>
                </button>
              );
            })}
          </div>
        )}

        {/* ── LOGIN FORM ── */}
        {mode === "login" && (
          <form onSubmit={handleLogin} className="space-y-4 anim-fadeInUp">
            <div className="space-y-3">
              <div className="relative">
                <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none" />
                <input
                  type="email" placeholder="Email Address" value={email}
                  onChange={(e) => setEmail(e.target.value)} required
                  className="neo-input w-full rounded-lg pl-10 pr-4 py-3 font-mono text-sm"
                />
              </div>
              <div className="relative">
                <KeyRound size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none" />
                <input
                  type="password" placeholder="Password" value={password}
                  onChange={(e) => setPassword(e.target.value)} required
                  className="neo-input w-full rounded-lg pl-10 pr-4 py-3 font-mono text-sm"
                />
              </div>
            </div>

            <div className="flex justify-end font-mono text-xs">
              <button type="button" onClick={() => setMode("forgot")}
                className="text-amber-400 font-bold hover:underline cursor-pointer">
                [ Forgot Password? ]
              </button>
            </div>

            <button type="submit" disabled={loading}
              className="neo-btn-brand w-full py-3.5 rounded-lg font-mono text-xs uppercase font-bold tracking-wider cursor-pointer">
              {loading ? "[ AUTHENTICATING... ]" : "[ SIGN IN TO PORTAL ]"}
            </button>
          </form>
        )}

        {/* ── REGISTER FORM ── */}
        {mode === "register" && (
          <form onSubmit={handleRegister} className="space-y-4 anim-fadeInUp">
            <div className="space-y-3">
              <div className="relative">
                <UserIcon size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none" />
                <input
                  type="text" placeholder="Full Name" value={name}
                  onChange={(e) => setName(e.target.value)} required
                  className="neo-input w-full rounded-lg pl-10 pr-4 py-3 font-mono text-sm"
                />
              </div>
              <div className="relative">
                <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none" />
                <input
                  type="email" placeholder="Email Address" value={email}
                  onChange={(e) => setEmail(e.target.value)} required
                  className="neo-input w-full rounded-lg pl-10 pr-4 py-3 font-mono text-sm"
                />
              </div>
              <div className="relative">
                <KeyRound size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none" />
                <input
                  type="password" placeholder="Choose Password" value={password}
                  onChange={(e) => setPassword(e.target.value)} required
                  className="neo-input w-full rounded-lg pl-10 pr-4 py-3 font-mono text-sm"
                />
              </div>

              <select
                value={role} onChange={(e) => setRole(e.target.value)}
                className="glass-select neo-input w-full rounded-lg px-4 py-3 font-mono text-sm"
              >
                <option value="member">Club Member</option>
                <option value="alumni">Club Alumni</option>
                <option value="recruiter">Recruiter / Guest</option>
                <option value="guest">Guest / Visitor</option>
                <option value="admin">Administrator</option>
              </select>
            </div>

            {(role === "member" || role === "alumni") && (
              <div className="neo-card rounded-lg p-3 text-xs font-mono border border-amber-500/30 bg-amber-950/20 text-amber-300 flex gap-2">
                <UserPlus size={16} className="flex-shrink-0 text-amber-400 mt-0.5" />
                <span>Member and Alumni accounts require Admin approval before activation.</span>
              </div>
            )}

            <button type="submit" disabled={loading}
              className="neo-btn-brand w-full py-3.5 rounded-lg font-mono text-xs uppercase font-bold tracking-wider cursor-pointer">
              {loading ? "[ CREATING ACCOUNT... ]" : "[ CREATE ACCOUNT ]"}
            </button>
          </form>
        )}

        {/* ── FORGOT PASSWORD ── */}
        {mode === "forgot" && (
          <form onSubmit={handleRequestReset} className="space-y-5 anim-fadeInUp">
            <div>
              <div className="neo-badge neo-badge-amber mb-2 inline-block">[ SECURITY RESET ]</div>
              <h3 className="font-mono font-bold text-sm text-slate-100">Reset Password Token</h3>
              <p className="font-mono text-xs text-slate-400 mt-1 leading-relaxed">
                Submit your registered email address to receive reset instructions.
              </p>
            </div>
            <div className="relative">
              <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none" />
              <input
                type="email" placeholder="Email Address" value={resetEmail}
                onChange={(e) => setResetEmail(e.target.value)} required
                className="neo-input w-full rounded-lg pl-10 pr-4 py-3 font-mono text-sm"
              />
            </div>
            <div className="flex gap-3">
              <button type="button" onClick={() => setMode("login")}
                className="neo-btn-ghost flex-1 py-3 rounded-lg font-mono text-xs uppercase font-bold cursor-pointer">
                ← [ BACK ]
              </button>
              <button type="submit" disabled={loading}
                className="neo-btn-brand flex-1 py-3 rounded-lg font-mono text-xs uppercase font-bold cursor-pointer">
                {loading ? "[ SENDING... ]" : "[ REQUEST RESET ]"}
              </button>
            </div>
          </form>
        )}

        <ResponseBox result={result} />

        <p className="font-mono text-[11px] text-slate-500 text-center">
          Member profiles are verified by Club Administration.{" "}
          <Link href="/directory" className="text-slate-300 font-bold hover:underline">
            [ Browse Public Directory ]
          </Link>
        </p>
      </div>
    </div>
  );
}
