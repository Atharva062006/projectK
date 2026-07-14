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
    if (!token) {
      setResult({ ok: false, message: "Invalid or missing recovery token." });
      return;
    }
    if (password.length < 6) {
      setResult({ ok: false, message: "Password must be at least 6 characters long." });
      return;
    }
    if (password !== confirmPassword) {
      setResult({ ok: false, message: "Passwords do not match." });
      return;
    }

    setLoading(true);
    setResult(null);

    try {
      const res = await api.auth.resetPassword(token, password);
      setResult(res);
      if (res.ok) {
        setTimeout(() => {
          router.push("/auth");
        }, 2000);
      }
    } catch {
      setResult({ ok: false, message: "Server connection failed. Try again later." });
    } finally {
      setLoading(false);
    }
  };

  if (!token) {
    return (
      <div className="bg-[#0e1017] border border-gray-800 rounded-2xl p-6 text-center space-y-4">
        <div className="w-12 h-12 rounded-full bg-red-950/40 border border-red-950 flex items-center justify-center mx-auto text-red-400">
          <Lock size={20} />
        </div>
        <h2 className="text-sm font-mono font-semibold text-white">Invalid Reset Link</h2>
        <p className="text-xs text-gray-500 font-mono">No recovery token was found in the URL. Please verify your email link or request a new one.</p>
        <button 
          onClick={() => router.push("/auth")}
          className="text-xs bg-[#1b1e2c] border border-gray-700 hover:bg-[#25293c] px-4 py-2 rounded-lg text-white font-mono transition-all w-full cursor-pointer"
        >
          Back to Login
        </button>
      </div>
    );
  }

  return (
    <div className="bg-[#0e1017] border border-gray-800 rounded-2xl p-6 space-y-6">
      <div className="text-center space-y-2">
        <div className="w-12 h-12 rounded-full bg-blue-950 border border-blue-800 flex items-center justify-center mx-auto text-blue-400">
          <KeyRound size={20} />
        </div>
        <h2 className="text-sm font-mono font-semibold text-white">Reset Your Password</h2>
        <p className="text-xs text-gray-500 font-mono">Enter a new secure password for your account.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4 font-mono text-xs">
        <div className="space-y-1.5">
          <label className="text-gray-400 font-semibold block">New Password</label>
          <div className="flex items-center gap-2 bg-[#0c0d13] border border-gray-800 rounded-lg px-3 py-2.5 relative">
            <Lock size={14} className="text-gray-500" />
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Min. 6 characters"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="bg-transparent border-none outline-none text-white w-full placeholder-gray-600"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 text-gray-500 hover:text-gray-400"
            >
              {showPassword ? <EyeOff size={14} /> : <Eye size={14} />}
            </button>
          </div>
        </div>

        <div className="space-y-1.5">
          <label className="text-gray-400 font-semibold block">Confirm New Password</label>
          <div className="flex items-center gap-2 bg-[#0c0d13] border border-gray-800 rounded-lg px-3 py-2.5">
            <Lock size={14} className="text-gray-500" />
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Re-enter password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              className="bg-transparent border-none outline-none text-white w-full placeholder-gray-600"
            />
          </div>
        </div>

        {result && <ResponseBox ok={result.ok} message={result.message} />}

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 hover:bg-blue-500 font-semibold py-2.5 rounded-lg text-white transition-all disabled:opacity-50 cursor-pointer text-center"
        >
          {loading ? "Updating Password..." : "Update Password"}
        </button>
      </form>
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <div className="max-w-md mx-auto py-12">
      <Suspense fallback={<div className="text-center font-mono text-xs text-gray-500">Initializing password recovery form...</div>}>
        <ResetPasswordFormContent />
      </Suspense>
    </div>
  );
}
