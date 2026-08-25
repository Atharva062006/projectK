"use client";
import React, { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { api } from "@/lib/api";
import ResponseBox from "@/components/ResponseBox";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Spinner } from "@/components/ui/Spinner";
import { KeyRound, Lock, ArrowLeft } from "lucide-react";
import { APPLE_COLORS, APPLE_RADII } from "@/lib/theme";

function ResetPasswordFormContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token") || "";

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{ ok: boolean; message: string; data?: unknown } | null>(null);

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
      if (res.ok) setTimeout(() => router.push("/auth"), 2000);
    } catch {
      setResult({ ok: false, message: "Server connection failed. Try again later." });
    } finally {
      setLoading(false);
    }
  };

  if (!token) {
    return (
      <div
        style={{
          backgroundColor: "#ffffff",
          borderRadius: APPLE_RADII.lg,
          border: `1px solid ${APPLE_COLORS.hairline}`,
          padding: "36px",
          textAlign: "center",
        }}
      >
        <div
          style={{
            width: "48px",
            height: "48px",
            borderRadius: "50%",
            backgroundColor: "rgba(215, 0, 21, 0.08)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            margin: "0 auto 16px",
          }}
        >
          <Lock size={20} color="#d70015" />
        </div>
        <h2 style={{ fontSize: "18px", fontWeight: 600, color: APPLE_COLORS.ink, marginBottom: "6px" }}>
          Invalid Recovery Link
        </h2>
        <p style={{ fontSize: "14px", color: APPLE_COLORS.inkMuted48, marginBottom: "24px" }}>
          No recovery token found in URL. Please check your email link or request a new reset link.
        </p>
        <Button variant="default" size="small" onClick={() => router.push("/auth")} style={{ width: "100%" }}>
          Back to Login
        </Button>
      </div>
    );
  }

  return (
    <div
      style={{
        backgroundColor: "#ffffff",
        borderRadius: APPLE_RADII.lg,
        border: `1px solid ${APPLE_COLORS.hairline}`,
        padding: "36px",
      }}
    >
      <div style={{ textAlign: "center", marginBottom: "24px" }}>
        <div
          style={{
            width: "48px",
            height: "48px",
            borderRadius: "50%",
            backgroundColor: "rgba(0, 102, 204, 0.08)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            margin: "0 auto 14px",
          }}
        >
          <KeyRound size={20} color={APPLE_COLORS.primary} />
        </div>
        <h2 style={{ fontSize: "20px", fontWeight: 600, color: APPLE_COLORS.ink, marginBottom: "6px" }}>
          Reset Password
        </h2>
        <p style={{ fontSize: "13px", color: APPLE_COLORS.inkMuted48, margin: 0 }}>
          Enter a new secure password for your account.
        </p>
      </div>

      <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
        <Input
          label="New Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <Input
          label="Confirm New Password"
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
        />

        <ResponseBox result={result} />

        <Button type="submit" variant="primary" size="default" isLoading={loading} style={{ width: "100%", marginTop: "8px" }}>
          Update Password
        </Button>

        <Button type="button" variant="default" size="default" onClick={() => router.push("/auth")} style={{ width: "100%" }}>
          Back to Login
        </Button>
      </form>
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <div style={{ minHeight: "75vh", display: "flex", alignItems: "center", justifyContent: "center", padding: "32px 24px" }}>
      <div style={{ width: "100%", maxWidth: "420px" }}>
        <Suspense fallback={<div style={{ textAlign: "center", padding: "40px" }}><Spinner size={32} /></div>}>
          <ResetPasswordFormContent />
        </Suspense>
      </div>
    </div>
  );
}
