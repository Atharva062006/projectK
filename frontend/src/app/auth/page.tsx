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
import Button from "@/components/OKCButton";
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
  const [mounted, setMounted] = useState(false);
  const [tabIndex, setTabIndex] = useState(0);
  const [forgotMode, setForgotMode] = useState(false);
  const [result, setResult] = useState<{ ok: boolean; message: string } | null>(null);
  const [loading, setLoading] = useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

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

  const handleGoogleAuth = async (idToken: string) => {
    setLoading(true);
    setResult(null);
    try {
      const res = await api.auth.googleLogin(idToken);
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
      setResult({ ok: false, message: "Google authentication failed" });
    } finally {
      setLoading(false);
    }
  };

  // Load and initialize Google Identity Services SDK
  React.useEffect(() => {
    const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || "518016029614-ff19n263kgru5vhu4st5o19ibetcpis0.apps.googleusercontent.com";
    if (typeof window === "undefined" || !clientId) return;

    const script = document.createElement("script");
    script.src = "https://accounts.google.com/gsi/client";
    script.async = true;
    script.defer = true;
    script.onload = () => {
      if ((window as any).google?.accounts?.id) {
        (window as any).google.accounts.id.initialize({
          client_id: clientId,
          callback: (response: { credential?: string }) => {
            if (response.credential) {
              handleGoogleAuth(response.credential);
            }
          },
        });
      }
    };
    document.head.appendChild(script);

    return () => {
      if (document.head.contains(script)) {
        document.head.removeChild(script);
      }
    };
  }, []);

  const triggerGoogleLogin = () => {
    if ((window as any).google?.accounts?.id) {
      (window as any).google.accounts.id.prompt();
    } else {
      const token = prompt("Google SDK loading... If popup blocked, enter token manually:");
      if (token) handleGoogleAuth(token);
    }
  };

  if (!mounted) return null;

  /* ── Already Logged In ── */
  if (user) {
    return (
      <div style={{ minHeight: "70vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <Card data-okc-theme="true" darkMode={darkMode} className="anim-scaleIn" style={{ padding: "40px", textAlign: "center", width: "100%", maxWidth: "380px" }}>
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
      <Card data-okc-theme="true" darkMode={darkMode} className="anim-scaleIn" style={{ width: "100%", maxWidth: "440px", padding: "28px" }}>
        {!forgotMode ? (
          <>
            <Tabs aria-label="Auth Tabs" darkMode={darkMode} value={tabIndex} onValueChange={(i) => { setTabIndex(Number(i)); setResult(null); }}>
              <Tab name="Sign In">
                <form onSubmit={handleLogin} style={{ paddingTop: "20px", display: "flex", flexDirection: "column", gap: "16px" }}>
                  <TextInput data-okc-theme="true"
                    darkMode={darkMode}
                    label="Email Address"
                    type="email"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                  <PasswordInput data-okc-theme="true"
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
                  <TextInput data-okc-theme="true"
                    darkMode={darkMode}
                    label="Full Name"
                    placeholder="Your full name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                  />
                  <TextInput data-okc-theme="true"
                    darkMode={darkMode}
                    label="Email Address"
                    type="email"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                  <PasswordInput data-okc-theme="true"
                    darkMode={darkMode}
                    label="Password"
                    id="register-password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    autoComplete="new-password"
                  />
                  <Select data-okc-theme="true"
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

            {/* Divider */}
            <div style={{ display: "flex", alignItems: "center", margin: "24px 0 16px" }}>
              <div style={{ flex: 1, borderBottom: `1px solid ${darkMode ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.1)"}` }} />
              <span style={{ padding: "0 12px", fontSize: "12px", color: mutedColor, textTransform: "uppercase", letterSpacing: "0.5px" }}>or</span>
              <div style={{ flex: 1, borderBottom: `1px solid ${darkMode ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.1)"}` }} />
            </div>

            {/* Google Auth Button */}
            <button
              type="button"
              disabled={loading}
              onClick={triggerGoogleLogin}
              style={{
                width: "100%",
                padding: "10px 16px",
                borderRadius: "8px",
                border: `1px solid ${darkMode ? "rgba(255,255,255,0.15)" : "rgba(0,0,0,0.15)"}`,
                background: darkMode ? "rgba(255,255,255,0.05)" : "#ffffff",
                color: textColor,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "10px",
                fontWeight: 600,
                fontSize: "14px",
                cursor: loading ? "not-allowed" : "pointer",
                opacity: loading ? 0.7 : 1,
                transition: "all 0.2s ease"
              }}
            >
              <svg width="18" height="18" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
              </svg>
              Continue with Google
            </button>
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
              <TextInput data-okc-theme="true"
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
