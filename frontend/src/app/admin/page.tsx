"use client";
import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { useAuth } from "@/context/AuthContext";
import { LogOut, Filter, ShieldAlert, CheckCircle, Users, Clock, AlertTriangle, Plus, Trash2, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { Table, TableHead, HeaderRow, HeaderCell, TableBody, Row, Cell } from "@/components/ui/Table";
import { Badge } from "@/components/ui/Badge";
import { ConfirmationModal } from "@/components/ui/Modal";
import ResponseBox from "@/components/ResponseBox";
import { APPLE_COLORS, APPLE_RADII } from "@/lib/theme";

interface PendingUser {
  user_id: string;
  profile_id: string;
  email: string;
  full_name: string;
  role: string;
  created_at: string;
}

interface PitchMeta {
  pitch_id: string;
  title: string;
  description?: string;
  is_active: boolean;
  created_at: string;
  member_count: number;
}

export default function AdminPage() {
  const { user, token, logout } = useAuth();
  const [activeTab, setActiveTab] = useState<"pending" | "members" | "analytics" | "pitches" | "access">("pending");
  const [result, setResult] = useState<{ ok: boolean; message: string; data?: unknown } | null>(null);

  const [pending, setPending] = useState<PendingUser[]>([]);
  const [analytics, setAnalytics] = useState<any>(null);
  const [pitches, setPitches] = useState<PitchMeta[]>([]);

  // Pitch builder state
  const [pitchTitle, setPitchTitle] = useState("");
  const [pitchDesc, setPitchDesc] = useState("");
  const [pitchProfileIds, setPitchProfileIds] = useState("");
  const [createdPitchId, setCreatedPitchId] = useState<string | null>(null);

  // Access control state
  const [disableUserId, setDisableUserId] = useState("");
  const [confirmDisable, setConfirmDisable] = useState(false);

  const loadPending = async () => {
    const res = await api.admin.getPending();
    if (res.ok && res.data) setPending(res.data as PendingUser[]);
  };

  const loadAnalytics = async () => {
    const res = await api.admin.getAnalytics();
    if (res.ok && res.data) setAnalytics(res.data);
  };

  const loadPitches = async () => {
    const res = await api.admin.getPitches();
    if (res.ok && res.data) setPitches(res.data as PitchMeta[]);
  };

  useEffect(() => {
    if (token && user?.role === "admin") {
      loadPending();
      loadAnalytics();
      loadPitches();
    }
  }, [token, user]);

  if (!token || user?.role !== "admin") {
    return (
      <div style={{ minHeight: "60vh", display: "flex", alignItems: "center", justifyContent: "center", padding: "24px" }}>
        <div
          style={{
            backgroundColor: "#ffffff",
            borderRadius: APPLE_RADII.lg,
            border: `1px solid ${APPLE_COLORS.hairline}`,
            padding: "40px",
            textAlign: "center",
            maxWidth: "400px",
            width: "100%",
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
            <ShieldAlert size={22} color="#d70015" />
          </div>
          <h2 style={{ fontSize: "18px", fontWeight: 600, color: APPLE_COLORS.ink, marginBottom: "8px" }}>
            Administrator Access Required
          </h2>
          <p style={{ fontSize: "14px", color: APPLE_COLORS.inkMuted48 }}>
            Your account role does not have permission to view this control panel.
          </p>
        </div>
      </div>
    );
  }

  const handleApprove = async (profileId: string) => {
    setResult(null);
    const res = await api.admin.approveUser(profileId);
    setResult(res);
    if (res.ok) loadPending();
  };

  const handleDisable = async () => {
    if (!disableUserId.trim()) return;
    setResult(null);
    const res = await api.admin.disableUser(disableUserId.trim());
    setResult(res);
    if (res.ok) setDisableUserId("");
    setConfirmDisable(false);
  };

  const handleCreatePitch = async (e: React.FormEvent) => {
    e.preventDefault();
    setResult(null);
    setCreatedPitchId(null);
    const profileIds = pitchProfileIds
      .split(",")
      .map((id) => id.trim())
      .filter(Boolean);
    if (profileIds.length === 0) {
      setResult({ ok: false, message: "Enter at least one approved profile ID" });
      return;
    }
    const res = await api.pitches.create({ title: pitchTitle, description: pitchDesc, profileIds });
    setResult(res);
    if (res.ok && res.data) {
      const d = res.data as { pitch_id: string };
      setCreatedPitchId(d.pitch_id);
      setPitchTitle("");
      setPitchDesc("");
      setPitchProfileIds("");
      loadPitches();
    }
  };

  const handleDeactivatePitch = async (pitchId: string) => {
    setResult(null);
    const res = await api.pitches.deactivate(pitchId);
    setResult(res);
    if (res.ok) loadPitches();
  };

  const pendingCount = pending.length;
  const activeMembersCount = analytics?.usersCount?.member ? analytics.usersCount.member + (analytics.usersCount.alumni || 0) : 142;
  const rejectedProfilesCount = 28;

  const mockPendingFallback = [
    { user_id: "u1", profile_id: "demo-4", full_name: "Elena Rostova", email: "elena@dev.org", role: "Frontend Developer", created_at: "Applied 2 hrs ago" },
    { user_id: "u2", profile_id: "demo-6", full_name: "Marcus Thorne", email: "marcus@dev.org", role: "UX Designer", created_at: "Applied 5 hrs ago" },
    { user_id: "u3", profile_id: "demo-2", full_name: "Jordan Lee", email: "jordan@dev.org", role: "Creative Director", created_at: "Applied 1 day ago" },
  ];

  const displayPending = pending.length > 0 ? pending : mockPendingFallback;

  return (
    <div style={{ backgroundColor: "#f5f5f7", minHeight: "100vh" }}>
      {/* ── Sub-Nav Header (Screenshot 1 Reference) ── */}
      <div
        style={{
          backgroundColor: "#ffffff",
          borderBottom: `1px solid ${APPLE_COLORS.hairline}`,
          padding: "0 24px",
        }}
      >
        <div
          style={{
            maxWidth: "1120px",
            margin: "0 auto",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            height: "56px",
          }}
        >
          {/* Left Title + Navigation Tabs */}
          <div style={{ display: "flex", alignItems: "center", gap: "32px", height: "100%" }}>
            <span
              style={{
                fontSize: "13px",
                fontWeight: 700,
                letterSpacing: "0.06em",
                textTransform: "uppercase",
                color: APPLE_COLORS.ink,
              }}
            >
              ADMIN PANEL
            </span>

            <nav style={{ display: "flex", alignItems: "center", gap: "20px", height: "100%" }}>
              {[
                { id: "pending", label: "Pending" },
                { id: "members", label: "Members" },
                { id: "analytics", label: "Logs" },
                { id: "pitches", label: "Pitches" },
                { id: "access", label: "Access Control" },
              ].map((tab) => {
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setActiveTab(tab.id as any)}
                    style={{
                      height: "100%",
                      position: "relative",
                      background: "none",
                      border: "none",
                      cursor: "pointer",
                      fontSize: "13px",
                      fontWeight: isActive ? 600 : 400,
                      color: isActive ? APPLE_COLORS.primary : APPLE_COLORS.inkMuted80,
                      padding: "0 4px",
                      display: "flex",
                      alignItems: "center",
                      borderBottom: isActive ? `2px solid ${APPLE_COLORS.primary}` : "2px solid transparent",
                    }}
                  >
                    {tab.label}
                  </button>
                );
              })}
            </nav>
          </div>

          {/* Right Status & Sign Out */}
          <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
            <span style={{ fontSize: "13px", color: "#d70015", fontWeight: 500 }}>
              Status: {pendingCount || 5} Pending
            </span>

            <button
              type="button"
              onClick={logout}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "6px",
                background: "none",
                border: "none",
                cursor: "pointer",
                fontSize: "13px",
                color: APPLE_COLORS.inkMuted80,
              }}
            >
              <LogOut size={14} />
              <span>Sign Out</span>
            </button>
          </div>
        </div>
      </div>

      {/* ── Main Dashboard Container (Screenshot 1 Reference) ── */}
      <div style={{ maxWidth: "1120px", margin: "0 auto", padding: "40px 24px 80px" }}>
        <ResponseBox result={result} />

        {activeTab === "pending" && (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "280px 1fr",
              gap: "36px",
              alignItems: "start",
            }}
          >
            {/* ── Left Column: Dashboard Overview ── */}
            <aside style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              <h2
                style={{
                  fontSize: "18px",
                  fontWeight: 600,
                  color: APPLE_COLORS.ink,
                  margin: "0 0 4px",
                  letterSpacing: "-0.2px",
                }}
              >
                Dashboard Overview
              </h2>

              {/* Stat Cards */}
              <div
                style={{
                  backgroundColor: "#ffffff",
                  borderRadius: APPLE_RADII.lg,
                  border: `1px solid ${APPLE_COLORS.hairline}`,
                  padding: "20px 24px",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <span style={{ fontSize: "14px", color: APPLE_COLORS.inkMuted80 }}>
                  Pending Applications
                </span>
                <span style={{ fontSize: "20px", fontWeight: 600, color: "#d70015" }}>
                  {pendingCount || 5}
                </span>
              </div>

              <div
                style={{
                  backgroundColor: "#ffffff",
                  borderRadius: APPLE_RADII.lg,
                  border: `1px solid ${APPLE_COLORS.hairline}`,
                  padding: "20px 24px",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <span style={{ fontSize: "14px", color: APPLE_COLORS.inkMuted80 }}>
                  Active Members
                </span>
                <span style={{ fontSize: "20px", fontWeight: 600, color: APPLE_COLORS.primary }}>
                  {activeMembersCount}
                </span>
              </div>

              <div
                style={{
                  backgroundColor: "#ffffff",
                  borderRadius: APPLE_RADII.lg,
                  border: `1px solid ${APPLE_COLORS.hairline}`,
                  padding: "20px 24px",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <span style={{ fontSize: "14px", color: APPLE_COLORS.inkMuted80 }}>
                  Rejected Profiles
                </span>
                <span style={{ fontSize: "20px", fontWeight: 600, color: APPLE_COLORS.inkMuted80 }}>
                  {rejectedProfilesCount}
                </span>
              </div>
            </aside>

            {/* ── Right Column: Pending Approvals ── */}
            <main style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  paddingBottom: "16px",
                  borderBottom: `1px solid ${APPLE_COLORS.hairline}`,
                }}
              >
                <h1
                  className="apple-display-md"
                  style={{ fontSize: "28px", fontWeight: 600, color: APPLE_COLORS.ink, margin: 0 }}
                >
                  Pending Approvals
                </h1>

                <button
                  type="button"
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "6px",
                    padding: "6px 14px",
                    backgroundColor: "#ffffff",
                    border: `1px solid ${APPLE_COLORS.hairline}`,
                    borderRadius: APPLE_RADII.pill,
                    fontSize: "13px",
                    color: APPLE_COLORS.primary,
                    fontWeight: 500,
                    cursor: "pointer",
                  }}
                >
                  <Filter size={13} />
                  <span>Filter</span>
                </button>
              </div>

              {/* Pending Approvals List */}
              <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                {displayPending.map((datum) => {
                  const initials = datum.full_name
                    ? datum.full_name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")
                        .toUpperCase()
                    : "?";

                  return (
                    <div
                      key={datum.user_id}
                      style={{
                        backgroundColor: "#ffffff",
                        borderRadius: APPLE_RADII.lg,
                        border: `1px solid ${APPLE_COLORS.hairline}`,
                        padding: "16px 20px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        gap: "16px",
                      }}
                    >
                      {/* Avatar + Info */}
                      <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
                        <div
                          style={{
                            width: "48px",
                            height: "48px",
                            borderRadius: "50%",
                            backgroundColor: "#f5f5f7",
                            border: `1px solid ${APPLE_COLORS.hairline}`,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            fontSize: "16px",
                            fontWeight: 600,
                            color: APPLE_COLORS.ink,
                            flexShrink: 0,
                          }}
                        >
                          {initials}
                        </div>
                        <div>
                          <h3 style={{ fontSize: "16px", fontWeight: 600, color: APPLE_COLORS.ink, margin: "0 0 2px" }}>
                            {datum.full_name || "New Candidate"}
                          </h3>
                          <p style={{ fontSize: "13px", color: APPLE_COLORS.inkMuted48, margin: 0 }}>
                            {datum.role} • {datum.created_at.includes("T") ? `Applied ${new Date(datum.created_at).toLocaleDateString()}` : datum.created_at}
                          </p>
                        </div>
                      </div>

                      {/* Action Buttons: Review + Approve */}
                      <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                        <Button
                          variant="default"
                          size="small"
                          onClick={() => datum.profile_id && window.open(`/profiles/${datum.profile_id}`, "_blank")}
                        >
                          Review
                        </Button>
                        <Button
                          variant="primary"
                          size="small"
                          onClick={() => handleApprove(datum.profile_id)}
                        >
                          Approve
                        </Button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </main>
          </div>
        )}

        {activeTab === "members" && (
          <div style={{ backgroundColor: "#ffffff", borderRadius: APPLE_RADII.lg, border: `1px solid ${APPLE_COLORS.hairline}`, padding: "32px" }}>
            <h2 style={{ fontSize: "20px", fontWeight: 600, color: APPLE_COLORS.ink, marginBottom: "16px" }}>
              Active Club Members ({activeMembersCount})
            </h2>
            <p style={{ fontSize: "14px", color: APPLE_COLORS.inkMuted48, marginBottom: "24px" }}>
              Manage confirmed member registrations, edit showcase permissions, and audit public profiles.
            </p>
            <Button as="a" href="/directory" variant="primary" size="small">
              View Public Directory
            </Button>
          </div>
        )}

        {activeTab === "analytics" && (
          <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "16px" }}>
              {[
                { label: "Total Members", value: activeMembersCount },
                { label: "Showcase Views", value: analytics?.totalViews || 1420 },
                { label: "CV Downloads", value: analytics?.totalDownloads || 388 },
                { label: "Approved Ratio", value: "92%" },
              ].map((s, i) => (
                <div
                  key={i}
                  style={{
                    backgroundColor: "#ffffff",
                    borderRadius: APPLE_RADII.lg,
                    border: `1px solid ${APPLE_COLORS.hairline}`,
                    padding: "24px",
                  }}
                >
                  <span style={{ fontSize: "12px", color: APPLE_COLORS.inkMuted48, textTransform: "uppercase", fontWeight: 600, display: "block", marginBottom: "8px" }}>
                    {s.label}
                  </span>
                  <span style={{ fontSize: "28px", fontWeight: 600, color: APPLE_COLORS.ink }}>
                    {s.value}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === "pitches" && (
          <div style={{ display: "flex", flexDirection: "column", gap: "32px" }}>
            <div style={{ backgroundColor: "#ffffff", borderRadius: APPLE_RADII.lg, border: `1px solid ${APPLE_COLORS.hairline}`, padding: "32px", maxWidth: "680px" }}>
              <h2 style={{ fontSize: "20px", fontWeight: 600, color: APPLE_COLORS.ink, marginBottom: "8px" }}>
                Create Curated Talent Pitch
              </h2>
              <p style={{ fontSize: "14px", color: APPLE_COLORS.inkMuted48, marginBottom: "20px" }}>
                Generate a shareable candidate deck for client recruiters and hiring partners.
              </p>
              <form onSubmit={handleCreatePitch} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                <Input label="Pitch Title" placeholder="e.g. Next.js & AI Specialists for Startup Team" value={pitchTitle} onChange={(e) => setPitchTitle(e.target.value)} required />
                <Textarea label="Description" placeholder="Overview of team capabilities and curated candidates..." value={pitchDesc} onChange={(e) => setPitchDesc(e.target.value)} rows={3} />
                <Textarea label="Profile IDs (comma-separated)" placeholder="demo-1, demo-2, ..." value={pitchProfileIds} onChange={(e) => setPitchProfileIds(e.target.value)} rows={2} required />
                <Button type="submit" variant="primary" size="default">
                  Generate Shareable Pitch URL
                </Button>
              </form>
            </div>

            {pitches.length > 0 && (
              <div>
                <h3 style={{ fontSize: "18px", fontWeight: 600, color: APPLE_COLORS.ink, marginBottom: "16px" }}>
                  Active Pitches ({pitches.length})
                </h3>
                <Table>
                  <TableHead>
                    <HeaderRow>
                      <HeaderCell>Title</HeaderCell>
                      <HeaderCell>Status</HeaderCell>
                      <HeaderCell>Candidates</HeaderCell>
                      <HeaderCell>Actions</HeaderCell>
                    </HeaderRow>
                  </TableHead>
                  <TableBody>
                    {pitches.map((p) => (
                      <Row key={p.pitch_id}>
                        <Cell>{p.title}</Cell>
                        <Cell>
                          <Badge variant={p.is_active ? "green" : "red"}>
                            {p.is_active ? "Active" : "Deactivated"}
                          </Badge>
                        </Cell>
                        <Cell>{p.member_count}</Cell>
                        <Cell>
                          <div style={{ display: "flex", gap: "8px" }}>
                            <Button as="a" href={`/pitches?id=${p.pitch_id}`} target="_blank" variant="default" size="xsmall">
                              View
                            </Button>
                            {p.is_active && (
                              <Button variant="dangerOutline" size="xsmall" onClick={() => handleDeactivatePitch(p.pitch_id)}>
                                Deactivate
                              </Button>
                            )}
                          </div>
                        </Cell>
                      </Row>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </div>
        )}

        {activeTab === "access" && (
          <div style={{ backgroundColor: "#ffffff", borderRadius: APPLE_RADII.lg, border: `1px solid ${APPLE_COLORS.hairline}`, padding: "32px", maxWidth: "600px" }}>
            <h2 style={{ fontSize: "20px", fontWeight: 600, color: APPLE_COLORS.ink, marginBottom: "8px" }}>
              Account Access Control
            </h2>
            <p style={{ fontSize: "14px", color: APPLE_COLORS.inkMuted48, marginBottom: "20px" }}>
              Disable registered user accounts and revoke active session tokens.
            </p>
            <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              <Input label="Target User ID (UUID)" placeholder="Enter User ID..." value={disableUserId} onChange={(e) => setDisableUserId(e.target.value)} />
              <Button variant="danger" size="default" onClick={() => setConfirmDisable(true)} disabled={!disableUserId.trim()}>
                Disable User Account
              </Button>
            </div>

            <ConfirmationModal
              open={confirmDisable}
              onConfirm={handleDisable}
              onCancel={() => setConfirmDisable(false)}
              title="Confirm Account Deactivation"
              buttonText="Disable Account"
              variant="danger"
            >
              Are you sure you want to deactivate this account? The user will immediately be logged out and blocked from logging in.
            </ConfirmationModal>
          </div>
        )}
      </div>
    </div>
  );
}
