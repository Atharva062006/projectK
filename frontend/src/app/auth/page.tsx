"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { api } from "@/lib/api";
import ResponseBox from "@/components/ResponseBox";
import { ShieldAlert, UserPlus, KeyRound, Mail, User as UserIcon } from "lucide-react";

type AuthMode = "login" | "register" | "forgot";

export default function AuthPage() {
  const router = useRouter();
  const { login, user, logout } = useAuth();
  const [mode, setMode] = useState<AuthMode>("login");
  const [result, setResult] = useState<{ ok: boolean; message: string; data?: unknown } | null>(null);
  const [loading, setLoading] = useState(false);

  // Form Fields
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
        
        // Wait briefly for local storage write
        setTimeout(() => {
          if (payload.user.role === "admin") {
            router.push("/admin");
          } else if (payload.user.role === "member" || payload.user.role === "alumni") {
            router.push("/portfolio");
          } else {
            router.push("/");
          }
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
      if (res.ok) {
        // Automatically switch to login state with prefilled email
        setName("");
        setPassword("");
        setMode("login");
      }
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

  if (user) {
    return (
      <div className="max-w-md mx-auto py-12">
        <div className="bg-[#0e1017] border border-gray-800 rounded-2xl p-6 text-center space-y-4">
          <div className="w-12 h-12 rounded-full bg-blue-950 border border-blue-800 flex items-center justify-center mx-auto text-blue-400">
            <UserIcon size={20} />
          </div>
          <div>
            <h2 className="text-lg font-mono font-semibold text-white">Active Session Detected</h2>
            <p className="text-xs text-gray-500 font-mono mt-1">Logged in as {user.username} ({user.role})</p>
          </div>
          <div className="flex gap-2">
            <button 
              onClick={() => router.push(user.role === "admin" ? "/admin" : "/portfolio")}
              className="flex-1 bg-blue-700 hover:bg-blue-600 text-white py-2 rounded-lg text-xs font-mono transition-colors cursor-pointer"
            >
              Go to Workspace
            </button>
            <button 
              onClick={logout}
              className="flex-1 bg-red-950 text-red-400 border border-red-900 hover:bg-red-900 hover:text-white py-2 rounded-lg text-xs font-mono transition-colors cursor-pointer"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto py-12">
      <div className="bg-[#0e1017] border border-gray-800 rounded-2xl shadow-xl overflow-hidden p-6 space-y-6">
        
        {/* Tab Headers */}
        <div className="flex border-b border-gray-850 pb-4">
          <button 
            onClick={() => { setMode("login"); setResult(null); }}
            className={`flex-1 text-center text-xs font-mono font-bold tracking-wider uppercase pb-2 transition-all ${
              mode === "login" ? "text-blue-500 border-b-2 border-blue-500" : "text-gray-500 hover:text-gray-300"
            }`}
          >
            Sign In
          </button>
          <button 
            onClick={() => { setMode("register"); setResult(null); }}
            className={`flex-1 text-center text-xs font-mono font-bold tracking-wider uppercase pb-2 transition-all ${
              mode === "register" ? "text-blue-500 border-b-2 border-blue-500" : "text-gray-500 hover:text-gray-300"
            }`}
          >
            Create Account
          </button>
        </div>

        {/* MODE: LOGIN */}
        {mode === "login" && (
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-3">
              <div className="relative">
                <input 
                  type="email" 
                  placeholder="Email Address" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-[#11131c] border border-gray-800 rounded-xl px-4 py-2.5 pl-10 text-xs text-gray-200 placeholder-gray-500 font-mono focus:border-gray-700 outline-none"
                  required 
                />
                <Mail size={14} className="text-gray-600 absolute left-3.5 top-3.5" />
              </div>
              <div className="relative">
                <input 
                  type="password" 
                  placeholder="Password" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-[#11131c] border border-gray-800 rounded-xl px-4 py-2.5 pl-10 text-xs text-gray-200 placeholder-gray-500 font-mono focus:border-gray-700 outline-none"
                  required 
                />
                <KeyRound size={14} className="text-gray-600 absolute left-3.5 top-3.5" />
              </div>
            </div>

            <div className="flex justify-between items-center text-[10px] font-mono">
              <button 
                type="button" 
                onClick={() => setMode("forgot")}
                className="text-gray-500 hover:text-gray-300 underline"
              >
                Forgot Password?
              </button>
            </div>

            <button 
              type="submit" 
              disabled={loading}
              className="w-full bg-blue-700 hover:bg-blue-600 disabled:opacity-50 text-white py-2.5 rounded-xl text-xs font-mono font-semibold transition-colors cursor-pointer"
            >
              {loading ? "Authenticating..." : "Sign In"}
            </button>
          </form>
        )}

        {/* MODE: REGISTER */}
        {mode === "register" && (
          <form onSubmit={handleRegister} className="space-y-4">
            <div className="space-y-3">
              <div className="relative">
                <input 
                  type="text" 
                  placeholder="Full Name" 
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-[#11131c] border border-gray-800 rounded-xl px-4 py-2.5 pl-10 text-xs text-gray-200 placeholder-gray-500 font-mono focus:border-gray-700 outline-none"
                  required 
                />
                <UserIcon size={14} className="text-gray-600 absolute left-3.5 top-3.5" />
              </div>
              <div className="relative">
                <input 
                  type="email" 
                  placeholder="Email Address" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-[#11131c] border border-gray-800 rounded-xl px-4 py-2.5 pl-10 text-xs text-gray-200 placeholder-gray-500 font-mono focus:border-gray-700 outline-none"
                  required 
                />
                <Mail size={14} className="text-gray-600 absolute left-3.5 top-3.5" />
              </div>
              <div className="relative">
                <input 
                  type="password" 
                  placeholder="Choose Password" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-[#11131c] border border-gray-800 rounded-xl px-4 py-2.5 pl-10 text-xs text-gray-200 placeholder-gray-500 font-mono focus:border-gray-700 outline-none"
                  required 
                />
                <KeyRound size={14} className="text-gray-600 absolute left-3.5 top-3.5" />
              </div>
              <div className="relative">
                <select 
                  value={role} 
                  onChange={(e) => setRole(e.target.value)}
                  className="w-full bg-[#11131c] border border-gray-800 rounded-xl px-4 py-2.5 text-xs text-gray-400 font-mono focus:border-gray-700 outline-none"
                >
                  <option value="member">Club Member</option>
                  <option value="alumni">Club Alumni</option>
                  <option value="recruiter">Recruiter</option>
                  <option value="guest">Guest / Visitor</option>
                  <option value="admin">Administrator</option>
                </select>
              </div>
            </div>

            {(role === "member" || role === "alumni") && (
              <div className="p-3 bg-blue-950/40 border border-blue-900/50 rounded-xl flex gap-2.5 text-[10px] font-mono text-blue-400">
                <UserPlus size={16} className="flex-shrink-0" />
                <span>Notice: Member and Alumni profiles are created in "Pending" status and require Admin activation.</span>
              </div>
            )}

            <button 
              type="submit" 
              disabled={loading}
              className="w-full bg-blue-700 hover:bg-blue-600 disabled:opacity-50 text-white py-2.5 rounded-xl text-xs font-mono font-semibold transition-colors cursor-pointer"
            >
              {loading ? "Creating Account..." : "Create Account"}
            </button>
          </form>
        )}

        {/* MODE: FORGOT */}
        {mode === "forgot" && (
          <form onSubmit={handleRequestReset} className="space-y-4">
            <div className="space-y-2">
              <h3 className="text-xs font-mono font-bold text-white uppercase">Reset Password</h3>
              <p className="text-[10px] font-mono text-gray-500 leading-normal">
                Submit your registration email. The reset link and token will be printed directly to the backend node terminal.
              </p>
            </div>
            <div className="relative">
              <input 
                type="email" 
                placeholder="Email Address" 
                value={resetEmail}
                onChange={(e) => setResetEmail(e.target.value)}
                className="w-full bg-[#11131c] border border-gray-800 rounded-xl px-4 py-2.5 pl-10 text-xs text-gray-200 placeholder-gray-500 font-mono focus:border-gray-700 outline-none"
                required 
              />
              <Mail size={14} className="text-gray-600 absolute left-3.5 top-3.5" />
            </div>
            <div className="flex gap-2">
              <button 
                type="button" 
                onClick={() => setMode("login")}
                className="flex-1 bg-gray-900 border border-gray-800 hover:bg-gray-800 text-gray-400 py-2.5 rounded-xl text-xs font-mono transition-colors cursor-pointer"
              >
                Back to Login
              </button>
              <button 
                type="submit" 
                disabled={loading}
                className="flex-1 bg-yellow-700 hover:bg-yellow-600 disabled:opacity-50 text-white py-2.5 rounded-xl text-xs font-mono font-semibold transition-colors cursor-pointer"
              >
                Send Request
              </button>
            </div>
          </form>
        )}

        <ResponseBox result={result} />
      </div>
    </div>
  );
}
