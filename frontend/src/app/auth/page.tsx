"use client";
import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { api } from "@/lib/api";
import ResponseBox from "@/components/ResponseBox";
import { ShieldAlert, UserPlus, KeyRound, Mail, User as UserIcon, LogIn, UserCog } from "lucide-react";

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
        <div
          className="glass-card rounded-2xl p-8 text-center space-y-5 w-full max-w-sm anim-scaleIn"
        >
          <div
            className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto"
            style={{ background: "linear-gradient(135deg, rgba(240,165,0,0.2), rgba(240,24,112,0.15))", border: "1px solid rgba(240,165,0,0.3)" }}
          >
            <UserIcon size={22} style={{ color: "#f0a500" }} />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-white">Active Session</h2>
            <p className="text-sm text-gray-500 mt-1">Signed in as <span className="text-gray-300 font-medium">{user.username}</span></p>
            <span className="text-xs px-2 py-0.5 rounded-full mt-2 inline-block uppercase font-semibold"
              style={{ background: "rgba(240,165,0,0.1)", border: "1px solid rgba(240,165,0,0.25)", color: "#f0a500" }}>
              {user.role}
            </span>
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => router.push(user.role === "admin" ? "/admin" : "/portfolio")}
              className="btn-brand flex-1 py-2.5 rounded-xl text-sm font-semibold cursor-pointer"
            >
              Go to Workspace
            </button>
            <button
              onClick={logout}
              className="btn-danger flex-1 py-2.5 rounded-xl text-sm font-semibold cursor-pointer"
            >
              Sign Out
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center py-8">
      {/* Brand header above card */}
      <div className="text-center mb-8 anim-floatDown">
        <div className="flex justify-center mb-4">
          <div className="relative">
            <Image src="/okc_main_logo.png" alt="OKC" width={68} height={68} className="object-contain relative z-10" />
            <div className="absolute inset-0 rounded-full blur-xl opacity-40"
              style={{ background: "radial-gradient(circle, rgba(240,165,0,0.4), transparent 70%)" }} />
          </div>
        </div>
        <h1 className="text-2xl font-bold text-white">Project K Portal</h1>
        <p className="text-sm text-gray-500 mt-1">Oyster Kode Club Member Ecosystem</p>
      </div>

      {/* Main auth card */}
      <div className="glass-card w-full max-w-md rounded-2xl p-7 space-y-6 anim-scaleIn">
        {/* Tab switcher — only for login/register */}
        {mode !== "forgot" && (
          <div className="glass-panel flex rounded-xl p-1">
            {[
              { id: "login" as AuthMode, label: "Sign In", icon: LogIn },
              { id: "register" as AuthMode, label: "Create Account", icon: UserCog },
            ].map((tab) => {
              const isActive = mode === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => { setMode(tab.id); setResult(null); }}
                  className={`flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-lg text-sm font-semibold transition-all duration-200 cursor-pointer ${
                    isActive ? "btn-brand shadow-sm" : "btn-ghost border-transparent"
                  }`}
                >
                  <tab.icon size={14} />
                  <span>{tab.label}</span>
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
                <Mail size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none" />
                <input
                  type="email" placeholder="Email Address" value={email}
                  onChange={(e) => setEmail(e.target.value)} required
                  className="glass-input w-full rounded-xl pl-10 pr-4 py-3 text-sm"
                />
              </div>
              <div className="relative">
                <KeyRound size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none" />
                <input
                  type="password" placeholder="Password" value={password}
                  onChange={(e) => setPassword(e.target.value)} required
                  className="glass-input w-full rounded-xl pl-10 pr-4 py-3 text-sm"
                />
              </div>
            </div>

            <div className="flex justify-end">
              <button type="button" onClick={() => setMode("forgot")}
                className="text-sm transition-colors cursor-pointer"
                style={{ color: "#f0a500" }}
                onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.75")}
                onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
              >
                Forgot Password?
              </button>
            </div>

            <button type="submit" disabled={loading}
              className="btn-brand w-full py-3 rounded-xl text-sm font-semibold cursor-pointer">
              {loading ? "Authenticating..." : "Sign In"}
            </button>
          </form>
        )}

        {/* ── REGISTER FORM ── */}
        {mode === "register" && (
          <form onSubmit={handleRegister} className="space-y-4 anim-fadeInUp">
            <div className="space-y-3">
              <div className="relative">
                <UserIcon size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none" />
                <input
                  type="text" placeholder="Full Name" value={name}
                  onChange={(e) => setName(e.target.value)} required
                  className="glass-input w-full rounded-xl pl-10 pr-4 py-3 text-sm"
                />
              </div>
              <div className="relative">
                <Mail size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none" />
                <input
                  type="email" placeholder="Email Address" value={email}
                  onChange={(e) => setEmail(e.target.value)} required
                  className="glass-input w-full rounded-xl pl-10 pr-4 py-3 text-sm"
                />
              </div>
              <div className="relative">
                <KeyRound size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none" />
                <input
                  type="password" placeholder="Choose Password" value={password}
                  onChange={(e) => setPassword(e.target.value)} required
                  className="glass-input w-full rounded-xl pl-10 pr-4 py-3 text-sm"
                />
              </div>
              <select
                value={role} onChange={(e) => setRole(e.target.value)}
                className="glass-select glass-input w-full rounded-xl px-4 py-3 text-sm"
              >
                <option value="member">Club Member</option>
                <option value="alumni">Club Alumni</option>
                <option value="recruiter">Recruiter</option>
                <option value="guest">Guest / Visitor</option>
                <option value="admin">Administrator</option>
              </select>
            </div>

            {(role === "member" || role === "alumni") && (
              <div className="flex gap-2.5 p-3 rounded-xl text-sm anim-fadeInUp"
                style={{ background: "rgba(240,165,0,0.07)", border: "1px solid rgba(240,165,0,0.2)", color: "#d4900a" }}>
                <UserPlus size={15} className="flex-shrink-0 mt-0.5" />
                <span>Member and Alumni accounts require Admin approval before activation.</span>
              </div>
            )}

            <button type="submit" disabled={loading}
              className="btn-brand w-full py-3 rounded-xl text-sm font-semibold cursor-pointer">
              {loading ? "Creating Account..." : "Create Account"}
            </button>
          </form>
        )}

        {/* ── FORGOT PASSWORD ── */}
        {mode === "forgot" && (
          <form onSubmit={handleRequestReset} className="space-y-5 anim-fadeInUp">
            <div>
              <h3 className="text-base font-semibold text-white">Reset Password</h3>
              <p className="text-sm text-gray-500 mt-1 leading-relaxed">
                Submit your registered email. The reset link and token will be printed to the backend terminal.
              </p>
            </div>
            <div className="relative">
              <Mail size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none" />
              <input
                type="email" placeholder="Email Address" value={resetEmail}
                onChange={(e) => setResetEmail(e.target.value)} required
                className="glass-input w-full rounded-xl pl-10 pr-4 py-3 text-sm"
              />
            </div>
            <div className="flex gap-3">
              <button type="button" onClick={() => setMode("login")}
                className="btn-ghost flex-1 py-3 rounded-xl text-sm cursor-pointer">
                ← Back
              </button>
              <button type="submit" disabled={loading}
                className="btn-brand flex-1 py-3 rounded-xl text-sm font-semibold cursor-pointer">
                {loading ? "Sending..." : "Send Reset Link"}
              </button>
            </div>
          </form>
        )}

        <ResponseBox result={result} />

        {/* Footer note */}
        <p className="text-xs text-gray-600 text-center">
          Member accounts are provisioned by Club Administration.{" "}
          <Link href="/directory" className="hover:text-gray-400 transition-colors underline">
            Browse public directory
          </Link>
        </p>
      </div>
    </div>
  );
}
