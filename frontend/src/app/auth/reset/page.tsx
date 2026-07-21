"use client";
import React, { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { api } from "@/lib/api";
import ResponseBox from "@/components/ResponseBox";
import { KeyRound, Lock, Eye, EyeOff } from "lucide-react";

function ResetPasswordFormContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token") || "";

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{ ok: boolean; message: string } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) { setResult({ ok: false, message: "Invalid or missing recovery token." }); return; }
    if (password.length < 6) { setResult({ ok: false, message: "Password must be at least 6 characters long." }); return; }
    if (password !== confirmPassword) { setResult({ ok: false, message: "Passwords do not match." }); return; }
    setLoading(true);
    setResult(null);
    try {
      const res = await api.auth.resetPassword(token, password);
      setResult(res);
      if (res.ok) setTimeout(() => router.push("/auth"), 2000);
    } catch {
      setResult({ ok: false, message: "Server connection failed. Try again later." });
    } finally {
      setLoading(false);
    }
  };

  if (!token) {
    return (
      <div className="glass-card rounded-2xl p-8 text-center space-y-5">
        <div className="w-12 h-12 rounded-xl flex items-center justify-center mx-auto btn-danger">
          <Lock size={20} />
        </div>
        <div>
          <h2 className="text-base font-semibold text-white">Invalid Reset Link</h2>
          <p className="text-sm text-gray-500 mt-1">No recovery token found in URL. Please verify your email link or request a new one.</p>
        </div>
        <button
          onClick={() => router.push("/auth")}
          className="btn-ghost w-full py-2.5 rounded-xl text-sm cursor-pointer"
        >
          Back to Login
        </button>
      </div>
    );
  }

  return (
    <div className="glass-card rounded-2xl p-8 space-y-6 anim-scaleIn">
      <div className="text-center space-y-3">
        <div
          className="w-12 h-12 rounded-xl flex items-center justify-center mx-auto"
          style={{ background: "rgba(240,165,0,0.12)", border: "1px solid rgba(240,165,0,0.28)", color: "#f0a500" }}
        >
          <KeyRound size={20} />
        </div>
        <h2 className="text-base font-semibold text-white">Reset Your Password</h2>
        <p className="text-sm text-gray-500">Enter a new secure password for your account.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-1.5">
          <label className="text-xs text-gray-500 font-medium block">New Password</label>
          <div className="relative">
            <Lock size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none" />
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Min. 6 characters"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="glass-input w-full rounded-xl pl-10 pr-10 py-3 text-sm"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300 transition-colors"
            >
              {showPassword ? <EyeOff size={14} /> : <Eye size={14} />}
            </button>
          </div>
        </div>

        <div className="space-y-1.5">
          <label className="text-xs text-gray-500 font-medium block">Confirm New Password</label>
          <div className="relative">
            <Lock size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none" />
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Re-enter password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              className="glass-input w-full rounded-xl pl-10 pr-4 py-3 text-sm"
            />
          </div>
        </div>

        {result && <ResponseBox ok={result.ok} message={result.message} />}

        <button
          type="submit"
          disabled={loading}
          className="btn-brand w-full py-3 rounded-xl text-sm font-semibold cursor-pointer"
        >
          {loading ? "Updating..." : "Update Password"}
        </button>

        <button
          type="button"
          onClick={() => router.push("/auth")}
          className="btn-ghost w-full py-2.5 rounded-xl text-sm cursor-pointer"
        >
          Back to Login
        </button>
      </form>
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <div className="min-h-[75vh] flex items-center justify-center py-8">
      <div className="w-full max-w-md">
        <Suspense fallback={
          <div className="glass-card rounded-2xl p-8 text-center text-sm text-gray-500">
            Initializing password recovery form...
          </div>
        }>
          <ResetPasswordFormContent />
        </Suspense>
      </div>
    </div>
  );
}
