"use client";
import React, { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { api } from "@/lib/api";
import { useTheme } from "@/context/ThemeContext";
import ResponseBox from "@/components/ResponseBox";

import Card from "@leafygreen-ui/card";
import { PasswordInput } from "@leafygreen-ui/password-input";
import Button from "@/components/OKCButton";
import { H2, Body } from "@leafygreen-ui/typography";
import Icon from "@leafygreen-ui/icon";
import { palette } from "@leafygreen-ui/palette";
import { Spinner } from "@leafygreen-ui/loading-indicator";
import { BRAND, STATUS } from "@/lib/theme";

function ResetPasswordFormContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { darkMode } = useTheme();
  const token = searchParams.get("token") || "";

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{ ok: boolean; message: string; data?: unknown } | null>(null);

  const mutedColor = darkMode ? palette.gray.light1 : palette.gray.dark1;

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
      <Card data-okc-theme="true" darkMode={darkMode} style={{ padding: "32px", textAlign: "center" }}>
        <div style={{ width: "48px", height: "48px", borderRadius: "12px", background: STATUS.errorBg, border: `1px solid ${STATUS.errorBorder}`, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px" }}>
          <Icon glyph="Lock" fill={STATUS.error} size={20} />
        </div>
        <H2 darkMode={darkMode} style={{ marginBottom: "8px" }}>Invalid Reset Link</H2>
        <Body darkMode={darkMode} style={{ color: mutedColor, marginBottom: "24px" }}>
          No recovery token found in URL. Please verify your email link or request a new one.
        </Body>
        <Button darkMode={darkMode} variant="default" onClick={() => router.push("/auth")} style={{ width: "100%" }}>
          Back to Login
        </Button>
      </Card>
    );
  }

  return (
    <Card data-okc-theme="true" darkMode={darkMode} className="anim-scaleIn" style={{ padding: "32px" }}>
      <div style={{ textAlign: "center", marginBottom: "24px" }}>
        <div style={{ width: "48px", height: "48px", borderRadius: "12px", background: BRAND.primaryBg, border: `1px solid ${BRAND.primaryBorder}`, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px" }}>
          <Icon glyph="Key" fill={BRAND.primary} size={20} />
        </div>
        <H2 darkMode={darkMode} style={{ marginBottom: "8px" }}>Reset Your Password</H2>
        <Body darkMode={darkMode} style={{ color: mutedColor }}>Enter a new secure password for your account.</Body>
      </div>

      <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
        <PasswordInput data-okc-theme="true"
          darkMode={darkMode}
          label="New Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <PasswordInput data-okc-theme="true"
          darkMode={darkMode}
          label="Confirm New Password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
        />

        <ResponseBox result={result} />

        <Button type="submit" darkMode={darkMode} variant="primary" isLoading={loading} style={{ width: "100%", marginTop: "8px" }}>
          Update Password
        </Button>

        <Button type="button" darkMode={darkMode} variant="default" onClick={() => router.push("/auth")} style={{ width: "100%" }}>
          Back to Login
        </Button>
      </form>
    </Card>
  );
}

export default function ResetPasswordPage() {
  return (
    <div style={{ minHeight: "75vh", display: "flex", alignItems: "center", justifyContent: "center", padding: "32px" }}>
      <div style={{ width: "100%", maxWidth: "440px" }}>
        <Suspense fallback={<div style={{ textAlign: "center", padding: "40px" }}><Spinner /></div>}>
          <ResetPasswordFormContent />
        </Suspense>
      </div>
    </div>
  );
}
