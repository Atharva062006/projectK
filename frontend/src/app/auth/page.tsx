"use client";
import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { api } from "@/lib/api";
import ResponseBox from "@/components/ResponseBox";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Select, Option } from "@/components/ui/Select";
import { Tabs, Tab } from "@/components/ui/Tabs";
import { User, Lock, ArrowLeft, CheckCircle2 } from "lucide-react";
import { APPLE_COLORS, APPLE_RADII } from "@/lib/theme";

export default function AuthPage() {
  const router = useRouter();
  const { login, user, logout } = useAuth();
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

  /* ── Already Logged In State ── */
  if (user) {
    return (
      <div style={{ minHeight: "75vh", display: "flex", alignItems: "center", justifyContent: "center", padding: "24px" }}>
        <div
          style={{
            backgroundColor: "#ffffff",
            borderRadius: APPLE_RADII.lg,
            border: `1px solid ${APPLE_COLORS.hairline}`,
            padding: "40px",
            textAlign: "center",
            width: "100%",
            maxWidth: "400px",
          }}
        >
          <div
            style={{
              width: "56px",
              height: "56px",
              borderRadius: "50%",
              backgroundColor: "rgba(0, 102, 204, 0.08)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              margin: "0 auto 16px",
            }}
          >
            <User size={24} color={APPLE_COLORS.primary} />
          </div>

          <h2 style={{ fontSize: "20px", fontWeight: 600, color: APPLE_COLORS.ink, marginBottom: "6px" }}>
            Active Session
          </h2>
          <p style={{ fontSize: "14px", color: APPLE_COLORS.inkMuted48, marginBottom: "8px" }}>
            Signed in as <span style={{ color: APPLE_COLORS.ink, fontWeight: 600 }}>{user.username}</span>
          </p>
          <span
            style={{
              display: "inline-block",
              fontSize: "11px",
              padding: "3px 10px",
              borderRadius: APPLE_RADII.pill,
              fontWeight: 600,
              textTransform: "uppercase",
              backgroundColor: "#f5f5f7",
              color: APPLE_COLORS.primary,
              marginBottom: "24px",
            }}
          >
            {user.role}
          </span>

          <div style={{ display: "flex", gap: "12px" }}>
            <Button
              variant="primary"
              style={{ flex: 1 }}
              onClick={() => router.push(user.role === "admin" ? "/admin" : "/portfolio")}
            >
              Workspace
            </Button>
            <Button
              variant="default"
              style={{ flex: 1 }}
              onClick={logout}
            >
              Sign Out
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: "80vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "48px 24px" }}>
      {/* Brand Header */}
      <div style={{ textAlign: "center", marginBottom: "32px" }}>
        <Image src="/okc_main_logo.png" alt="OKC" width={48} height={48} style={{ objectFit: "contain", margin: "0 auto 12px", display: "block" }} />
        <h1 className="apple-display-md" style={{ fontSize: "24px", margin: "0 0 4px" }}>
          Project K Portal
        </h1>
        <p style={{ fontSize: "14px", color: APPLE_COLORS.inkMuted48, margin: 0 }}>
          Oyster Kode Club Talent Ecosystem
        </p>
      </div>

      {/* Auth Card */}
      <div
        style={{
          width: "100%",
          maxWidth: "420px",
          backgroundColor: "#ffffff",
          borderRadius: APPLE_RADII.lg,
          border: `1px solid ${APPLE_COLORS.hairline}`,
          padding: "32px",
        }}
      >
        {!forgotMode ? (
          <>
            <Tabs value={tabIndex} onValueChange={(i) => { setTabIndex(Number(i)); setResult(null); }}>
              <Tab name="Sign In">
                <form onSubmit={handleLogin} style={{ paddingTop: "24px", display: "flex", flexDirection: "column", gap: "16px" }}>
                  <Input
                    label="Email Address"
                    type="email"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                  <Input
                    label="Password"
                    type="password"
                    id="login-password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    autoComplete="current-password"
                    required
                  />

                  <div style={{ display: "flex", justifyContent: "flex-end" }}>
                    <button
                      type="button"
                      onClick={() => { setForgotMode(true); setResult(null); }}
                      style={{
                        background: "none",
                        border: "none",
                        cursor: "pointer",
                        fontSize: "12px",
                        color: APPLE_COLORS.primary,
                        padding: 0,
                      }}
                    >
                      Forgot Password?
                    </button>
                  </div>

                  <Button
                    type="submit"
                    variant="primary"
                    size="default"
                    isLoading={loading}
                    loadingText="Authenticating..."
                    style={{ width: "100%", marginTop: "4px" }}
                  >
                    Sign In
                  </Button>
                </form>
              </Tab>

              <Tab name="Create Account">
                <form onSubmit={handleRegister} style={{ paddingTop: "24px", display: "flex", flexDirection: "column", gap: "16px" }}>
                  <Input
                    label="Full Name"
                    placeholder="Your full name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                  />
                  <Input
                    label="Email Address"
                    type="email"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                  <Input
                    label="Password"
                    type="password"
                    id="register-password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    autoComplete="new-password"
                    required
                  />
                  <Select
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
                    <div style={{ padding: "10px 14px", backgroundColor: "rgba(183, 110, 0, 0.08)", border: "1px solid rgba(183, 110, 0, 0.2)", borderRadius: "8px", fontSize: "12px", color: "#b76e00" }}>
                      Member & Alumni accounts require Admin approval before activation.
                    </div>
                  )}

                  <Button
                    type="submit"
                    variant="primary"
                    size="default"
                    isLoading={loading}
                    loadingText="Creating Account..."
                    style={{ width: "100%", marginTop: "4px" }}
                  >
                    Create Account
                  </Button>
                </form>
              </Tab>
            </Tabs>

            {/* Divider */}
            <div style={{ display: "flex", alignItems: "center", margin: "24px 0 18px" }}>
              <div style={{ flex: 1, borderBottom: `1px solid ${APPLE_COLORS.hairline}` }} />
              <span style={{ padding: "0 12px", fontSize: "11px", color: APPLE_COLORS.inkMuted48, textTransform: "uppercase" }}>or</span>
              <div style={{ flex: 1, borderBottom: `1px solid ${APPLE_COLORS.hairline}` }} />
            </div>

            {/* Google Auth Button */}
            <button
              type="button"
              disabled={loading}
              onClick={triggerGoogleLogin}
              style={{
                width: "100%",
                height: "38px",
                borderRadius: APPLE_RADII.pill,
                border: `1px solid ${APPLE_COLORS.hairline}`,
                backgroundColor: "#ffffff",
                color: APPLE_COLORS.ink,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "8px",
                fontWeight: 500,
                fontSize: "13px",
                cursor: loading ? "not-allowed" : "pointer",
                transition: "background-color 0.18s ease",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#fafafc")}
              onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "#ffffff")}
            >
              <svg width="16" height="16" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
              </svg>
              <span>Continue with Google</span>
            </button>
          </>
        ) : (
          /* ── Forgot Password Form ── */
          <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
            <div>
              <h2 style={{ fontSize: "18px", fontWeight: 600, color: APPLE_COLORS.ink, margin: "0 0 6px" }}>
                Reset Password
              </h2>
              <p style={{ fontSize: "13px", color: APPLE_COLORS.inkMuted48, margin: 0, lineHeight: 1.5 }}>
                Submit your registered email address to receive password reset instructions.
              </p>
            </div>

            <form onSubmit={handleRequestReset} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              <Input
                label="Email Address"
                type="email"
                placeholder="you@example.com"
                value={resetEmail}
                onChange={(e) => setResetEmail(e.target.value)}
                required
              />
              <div style={{ display: "flex", gap: "10px" }}>
                <Button
                  type="button"
                  variant="default"
                  style={{ flex: 1 }}
                  leftGlyph={<ArrowLeft size={13} />}
                  onClick={() => { setForgotMode(false); setResult(null); }}
                >
                  Back
                </Button>
                <Button
                  type="submit"
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

        <p style={{ fontSize: "12px", color: APPLE_COLORS.inkMuted48, textAlign: "center", marginTop: "24px", marginBottom: 0 }}>
          Looking for talent?{" "}
          <Link href="/directory" style={{ color: APPLE_COLORS.primary, textDecoration: "none", fontWeight: 500 }}>
            Browse public directory
          </Link>
        </p>
      </div>
    </div>
  );
}
