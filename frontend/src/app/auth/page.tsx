"use client";
import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { useTheme } from "@/context/ThemeContext";
import { api } from "@/lib/api";
import ResponseBox from "@/components/ResponseBox";

import Card from "@leafygreen-ui/card";
import Button from "@leafygreen-ui/button";
import { TextInput } from "@leafygreen-ui/text-input";
import { PasswordInput } from "@leafygreen-ui/password-input";
import { Select, Option } from "@leafygreen-ui/select";
import { Tabs, Tab } from "@leafygreen-ui/tabs";
import { H2, Body, Subtitle, Disclaimer } from "@leafygreen-ui/typography";
import { Banner } from "@leafygreen-ui/banner";
import Icon from "@leafygreen-ui/icon";
import { palette } from "@leafygreen-ui/palette";
import { BRAND, SURFACE } from "@/lib/theme";

type AuthMode = "login" | "register" | "forgot";

export default function AuthPage() {
  const router = useRouter();
  const { login, user, logout } = useAuth();
  const { darkMode } = useTheme();
  const [tabIndex, setTabIndex] = useState(0);
  const [forgotMode, setForgotMode] = useState(false);
  const [result, setResult] = useState<{ ok: boolean; message: string } | null>(null);
  const [loading, setLoading] = useState(false);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("member");
  const [resetEmail, setResetEmail] = useState("");

  const textColor = darkMode ? palette.white : palette.black;
  const mutedColor = darkMode ? palette.gray.light1 : palette.gray.dark1;

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setResult(null);
    try {
      const res = await api.auth.login({ email, password });
      setResult({ ok: res.ok, message: res.message });
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
      setResult({ ok: res.ok, message: res.message });
      if (res.ok) {
        setName("");
        setPassword("");
        setTabIndex(0);
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
      setResult({ ok: res.ok, message: res.message });
    } catch {
      setResult({ ok: false, message: "Reset request failed" });
    } finally {
      setLoading(false);
    }
  };

  /* ── Already Logged In ── */
  if (user) {
    return (
      <div style={{ minHeight: "70vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <Card darkMode={darkMode} className="anim-scaleIn" style={{ padding: "40px", textAlign: "center", width: "100%", maxWidth: "380px" }}>
          <div
            style={{
              width: "56px", height: "56px", borderRadius: "16px",
              background: "rgba(0, 237, 100, 0.12)",
              border: `1px solid ${BRAND.primaryBorder}`,
              display: "flex", alignItems: "center", justifyContent: "center",
              margin: "0 auto 16px",
            }}
          >
            <Icon glyph="Person" fill={BRAND.primary} size={24} />
          </div>

          <H2 darkMode={darkMode} style={{ marginBottom: "8px" }}>Active Session</H2>
          <Body darkMode={darkMode} style={{ color: mutedColor, marginBottom: "8px" }}>
            Signed in as <span style={{ color: textColor, fontWeight: 600 }}>{user.username}</span>
          </Body>
          <span
            style={{
              display: "inline-block", fontSize: "10px", padding: "2px 8px",
              borderRadius: "6px", fontWeight: 700, textTransform: "uppercase",
              background: BRAND.primaryBg, border: `1px solid ${BRAND.primaryBorder}`,
              color: BRAND.primary, marginBottom: "24px",
            }}
          >
            {user.role}
          </span>

          <div style={{ display: "flex", gap: "12px" }}>
            <Button
              darkMode={darkMode}
              variant="primary"
              style={{ flex: 1 }}
              onClick={() => router.push(user.role === "admin" ? "/admin" : "/portfolio")}
            >
              Go to Workspace
            </Button>
            <Button
              darkMode={darkMode}
              variant="danger"
              style={{ flex: 1 }}
              onClick={logout}
            >
              Sign Out
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div style={{ minHeight: "80vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "32px 0" }}>
      {/* Brand header */}
      <div className="anim-floatDown" style={{ textAlign: "center", marginBottom: "32px" }}>
        <div style={{ display: "flex", justifyContent: "center", marginBottom: "16px" }}>
          <div style={{ position: "relative" }}>
            <Image src="/okc_main_logo.png" alt="OKC" width={64} height={64} style={{ objectFit: "contain", position: "relative", zIndex: 1 }} />
          </div>
        </div>
        <H2 darkMode={darkMode}>Project K Portal</H2>
        <Body darkMode={darkMode} style={{ color: mutedColor, marginTop: "4px" }}>
          Oyster Kode Club Member Ecosystem
        </Body>
      </div>

      {/* Auth card */}
      <Card darkMode={darkMode} className="anim-scaleIn" style={{ width: "100%", maxWidth: "440px", padding: "28px" }}>
        {!forgotMode ? (
          <>
            <Tabs aria-label="Auth Tabs" darkMode={darkMode} value={tabIndex} onValueChange={(i) => { setTabIndex(Number(i)); setResult(null); }}>
              <Tab name="Sign In">
                <form onSubmit={handleLogin} style={{ paddingTop: "20px", display: "flex", flexDirection: "column", gap: "16px" }}>
                  <TextInput
                    darkMode={darkMode}
                    label="Email Address"
                    type="email"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                  <PasswordInput
                    darkMode={darkMode}
                    label="Password"
                    id="login-password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    autoComplete="current-password"
                  />

                  <div style={{ display: "flex", justifyContent: "flex-end" }}>
                    <Button
                      type="button"
                      darkMode={darkMode}
                      variant="default"
                      size="small"
                      onClick={() => { setForgotMode(true); setResult(null); }}
                    >
                      Forgot Password?
                    </Button>
                  </div>

                  <Button
                    type="submit"
                    darkMode={darkMode}
                    variant="primary"
                    isLoading={loading}
                    loadingText="Authenticating..."
                    style={{ width: "100%" }}
                  >
                    Sign In
                  </Button>
                </form>
              </Tab>

              <Tab name="Create Account">
                <form onSubmit={handleRegister} style={{ paddingTop: "20px", display: "flex", flexDirection: "column", gap: "16px" }}>
                  <TextInput
                    darkMode={darkMode}
                    label="Full Name"
                    placeholder="Your full name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                  />
                  <TextInput
                    darkMode={darkMode}
                    label="Email Address"
                    type="email"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                  <PasswordInput
                    darkMode={darkMode}
                    label="Password"
                    id="register-password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    autoComplete="new-password"
                  />
                  <Select
                    darkMode={darkMode}
                    label="Account Role"
                    value={role}
                    onChange={(val) => setRole(val)}
                  >
                    <Option value="member">Club Member</Option>
                    <Option value="alumni">Club Alumni</Option>
                    <Option value="recruiter">Recruiter</Option>
                    <Option value="guest">Guest / Visitor</Option>
                    <Option value="admin">Administrator</Option>
                  </Select>

                  {(role === "member" || role === "alumni") && (
                    <Banner darkMode={darkMode} variant="warning">
                      Member and Alumni accounts require Admin approval before activation.
                    </Banner>
                  )}

                  <Button
                    type="submit"
                    darkMode={darkMode}
                    variant="primary"
                    isLoading={loading}
                    loadingText="Creating Account..."
                    style={{ width: "100%" }}
                  >
                    Create Account
                  </Button>
                </form>
              </Tab>
            </Tabs>
          </>
        ) : (
          /* ── Forgot Password ── */
          <div className="anim-fadeInUp" style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
            <div>
              <Subtitle darkMode={darkMode}>Reset Password</Subtitle>
              <Body darkMode={darkMode} style={{ color: mutedColor, marginTop: "6px", lineHeight: "1.6" }}>
                Submit your registered email. The reset link will be printed to the backend terminal.
              </Body>
            </div>

            <form onSubmit={handleRequestReset} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              <TextInput
                darkMode={darkMode}
                label="Email Address"
                type="email"
                placeholder="you@example.com"
                value={resetEmail}
                onChange={(e) => setResetEmail(e.target.value)}
                required
              />
              <div style={{ display: "flex", gap: "12px" }}>
                <Button
                  darkMode={darkMode}
                  variant="default"
                  style={{ flex: 1 }}
                  leftGlyph={<Icon glyph="ArrowLeft" />}
                  onClick={() => { setForgotMode(false); setResult(null); }}
                  type="button"
                >
                  Back
                </Button>
                <Button
                  type="submit"
                  darkMode={darkMode}
                  variant="primary"
                  isLoading={loading}
                  loadingText="Sending..."
                  style={{ flex: 1 }}
                >
                  Send Reset Link
                </Button>
              </div>
            </form>
          </div>
        )}

        <ResponseBox result={result} />

        <Disclaimer darkMode={darkMode} style={{ textAlign: "center", marginTop: "16px", color: mutedColor }}>
          Member accounts are provisioned by Club Administration.{" "}
          <Link href="/directory" style={{ color: BRAND.primary }}>
            Browse public directory
          </Link>
        </Disclaimer>
      </Card>
    </div>
  );
}
