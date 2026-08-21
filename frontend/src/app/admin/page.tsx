"use client";
import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { useAuth } from "@/context/AuthContext";
import { useTheme } from "@/context/ThemeContext";
import ResponseBox from "@/components/ResponseBox";

import { Tabs, Tab } from "@leafygreen-ui/tabs";
import { Table, TableHead, HeaderRow, HeaderCell, TableBody, Row, Cell } from "@leafygreen-ui/table";
import Card from "@leafygreen-ui/card";
import Badge from "@leafygreen-ui/badge";
import Button from "@/components/OKCButton";
import { TextInput } from "@leafygreen-ui/text-input";
import { TextArea } from "@leafygreen-ui/text-area";
import { H1, H2, H3, Body, Overline, Label } from "@leafygreen-ui/typography";
import Icon from "@leafygreen-ui/icon";
import { palette } from "@leafygreen-ui/palette";
import { BRAND, SURFACE, STATUS } from "@/lib/theme";
import ConfirmationModal from "@leafygreen-ui/confirmation-modal";

interface PendingUser { user_id: string; profile_id: string; email: string; full_name: string; role: string; created_at: string; }
interface PitchMeta { pitch_id: string; title: string; description?: string; is_active: boolean; created_at: string; member_count: number; }

export default function AdminPage() {
  const { user, token } = useAuth();
  const { darkMode } = useTheme();
  const [tabIndex, setTabIndex] = useState(0);
  const [result, setResult] = useState<{ ok: boolean; message: string; data?: unknown } | null>(null);

  const [pending, setPending] = useState<PendingUser[]>([]);
  const [analytics, setAnalytics] = useState<any>(null);
  const [pitches, setPitches] = useState<PitchMeta[]>([]);

  // Pitch builder state
  const [pitchTitle, setPitchTitle] = useState("");
  const [pitchDesc, setPitchDesc] = useState("");
  const [pitchProfileIds, setPitchProfileIds] = useState("");
  const [createdPitchId, setCreatedPitchId] = useState<string | null>(null);

  // Settings
  const [disableUserId, setDisableUserId] = useState("");
  const [confirmDisable, setConfirmDisable] = useState(false);

  const textColor = darkMode ? palette.white : palette.black;
  const mutedColor = darkMode ? palette.gray.light1 : palette.gray.dark1;
  const borderColor = darkMode ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.08)";

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
      <div style={{ minHeight: "60vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
        {/* Single Card acceptable here — isolated access-denied surface */}
        <Card data-okc-theme="true" darkMode={darkMode} style={{ padding: "40px", textAlign: "center", maxWidth: "380px", width: "100%" }}>
          <div style={{ width: "48px", height: "48px", borderRadius: "12px", background: STATUS.errorBg, border: `1px solid ${STATUS.errorBorder}`, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px" }}>
            <Icon glyph="XWithCircle" fill={STATUS.error} size={20} />
          </div>
          <H2 darkMode={darkMode} style={{ marginBottom: "8px" }}>Access Restricted</H2>
          <Body darkMode={darkMode} style={{ color: mutedColor }}>Your account role does not have permission to access this control panel.</Body>
        </Card>
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
    e.preventDefault(); setResult(null); setCreatedPitchId(null);
    const profileIds = pitchProfileIds.split(",").map((id) => id.trim()).filter(Boolean);
    if (profileIds.length === 0) { setResult({ ok: false, message: "Enter at least one approved profile ID" }); return; }
    const res = await api.pitches.create({ title: pitchTitle, description: pitchDesc, profileIds });
    setResult(res);
    if (res.ok && res.data) {
      const d = res.data as { pitch_id: string };
      setCreatedPitchId(d.pitch_id);
      setPitchTitle(""); setPitchDesc(""); setPitchProfileIds("");
      loadPitches();
    }
  };

  const handleDeactivatePitch = async (pitchId: string) => {
    setResult(null);
    const res = await api.pitches.deactivate(pitchId);
    setResult(res);
    if (res.ok) loadPitches();
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "24px", paddingBottom: "48px" }}>
      {/* Header */}
      <div style={{ paddingBottom: "20px", borderBottom: `1px solid ${SURFACE.border}` }}>
        <H1 darkMode={darkMode}>Administrator Panel</H1>
        <Body darkMode={darkMode} style={{ color: mutedColor, marginTop: "4px" }}>
          Configure memberships and curate shareable talent pitches
        </Body>
      </div>

      <ResponseBox result={result} />

      <Tabs aria-label="Admin Tabs" darkMode={darkMode} value={tabIndex} onValueChange={(v) => setTabIndex(Number(v))}>

        {/* ── Approvals Queue — uses Table for dense enterprise layout ── */}
        <Tab name="Approvals Queue">
          <div style={{ paddingTop: "24px", display: "flex", flexDirection: "column", gap: "16px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <Icon glyph="Clock" fill={BRAND.primary} size={14} />
              <Overline darkMode={darkMode}>Pending Registrations ({pending.length})</Overline>
            </div>

            {pending.length === 0 ? (
              <div style={{ textAlign: "center", padding: "40px 0", color: mutedColor }}>
                <Icon glyph="CheckmarkWithCircle" fill={STATUS.success} size={24} style={{ display: "block", margin: "0 auto 12px" }} />
                <Body darkMode={darkMode} style={{ color: mutedColor }}>No membership requests currently pending activation.</Body>
              </div>
            ) : (
              <Table darkMode={darkMode}>
                <TableHead>
                  <HeaderRow>
                    <HeaderCell>Name</HeaderCell>
                    <HeaderCell>Email</HeaderCell>
                    <HeaderCell>Role</HeaderCell>
                    <HeaderCell>Requested</HeaderCell>
                    <HeaderCell>Profile ID</HeaderCell>
                    <HeaderCell>Action</HeaderCell>
                  </HeaderRow>
                </TableHead>
                <TableBody>
                  {pending.map((datum) => (
                    <Row key={datum.user_id}>
                      <Cell><Body darkMode={darkMode} style={{ fontWeight: 600, fontSize: "13px" }}>{datum.full_name || "New Registrant"}</Body></Cell>
                      <Cell><Body darkMode={darkMode} style={{ fontSize: "12px", color: mutedColor }}>{datum.email}</Body></Cell>
                      <Cell><Badge darkMode={darkMode} variant="lightgray">{datum.role}</Badge></Cell>
                      <Cell><Body darkMode={darkMode} style={{ fontSize: "12px", color: mutedColor }}>{new Date(datum.created_at).toLocaleDateString()}</Body></Cell>
                      <Cell><Body darkMode={darkMode} style={{ fontSize: "10px", color: SURFACE.border, userSelect: "all" }}>{datum.profile_id}</Body></Cell>
                      <Cell>
                        <Button darkMode={darkMode} variant="primary" size="small" onClick={() => handleApprove(datum.profile_id)}>
                          Approve
                        </Button>
                      </Cell>
                    </Row>
                  ))}
                </TableBody>
              </Table>
            )}
          </div>
        </Tab>

        {/* ── System Analytics ── */}
        <Tab name="System Analytics">
          {analytics && (
            <div style={{ paddingTop: "24px", display: "flex", flexDirection: "column", gap: "24px" }}>
              {/* Stat tiles — standalone Cards (no outer wrapper) */}
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "16px" }}>
                {[
                  { label: "Total Members", value: analytics.usersCount.member + analytics.usersCount.alumni, icon: "PersonGroup", color: BRAND.primary },
                  { label: "Approved Users", value: analytics.approvalStatus.approved, icon: "CheckmarkWithCircle", color: STATUS.success },
                  { label: "Showcase Views", value: analytics.totalViews, icon: "Charts", color: palette.blue.base },
                  { label: "CV Downloads", value: analytics.totalDownloads, icon: "Download", color: BRAND.primary },
                ].map((s, i) => (
                  <Card data-okc-theme="true" key={i} darkMode={darkMode} style={{ padding: "20px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                    <div>
                      <Overline darkMode={darkMode}>{s.label}</Overline>
                      <H2 darkMode={darkMode} style={{ marginTop: "8px" }}>{s.value}</H2>
                    </div>
                    <Icon glyph={s.icon as never} fill={s.color} size={24} style={{ opacity: 0.5 }} />
                  </Card>
                ))}
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" }}>
                {/* Skill Trends — standalone Card */}
                <Card data-okc-theme="true" darkMode={darkMode} style={{ padding: "24px" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "20px" }}>
                    <Icon glyph="Code" fill={BRAND.primary} size={14} />
                    <Overline darkMode={darkMode}>Skill Distribution</Overline>
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                    {analytics.skillTrends.length === 0 ? (
                      <Body darkMode={darkMode} style={{ color: mutedColor }}>No skill maps registered.</Body>
                    ) : (
                      analytics.skillTrends.slice(0, 5).map((sk: any) => {
                        const topVal = analytics.skillTrends[0]?.occurrences || 1;
                        const pct = Math.round((sk.occurrences / topVal) * 100);
                        return (
                          <div key={sk.name}>
                            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "4px" }}>
                              <Body darkMode={darkMode} style={{ fontSize: "12px", color: textColor }}>{sk.name}</Body>
                              <Body darkMode={darkMode} style={{ fontSize: "12px", color: mutedColor }}>{sk.occurrences}</Body>
                            </div>
                            <div style={{ height: "6px", background: SURFACE.border, borderRadius: "99px", overflow: "hidden" }}>
                              <div style={{ width: `${pct}%`, height: "100%", background: BRAND.primary }} />
                            </div>
                          </div>
                        );
                      })
                    )}
                  </div>
                </Card>

                {/* Popular Profiles — standalone Card */}
                <Card data-okc-theme="true" darkMode={darkMode} style={{ padding: "24px" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "20px" }}>
                    <Icon glyph="Person" fill={BRAND.primary} size={14} />
                    <Overline darkMode={darkMode}>Popular Profiles</Overline>
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                    {analytics.topViewedProfiles.length === 0 ? (
                      <Body darkMode={darkMode} style={{ color: mutedColor }}>No profile views logged yet.</Body>
                    ) : (
                      analytics.topViewedProfiles.slice(0, 5).map((p: any, i: number) => (
                        <div key={p.profile_id} style={{ display: "flex", justifyContent: "space-between", paddingBottom: "12px", borderBottom: `1px solid ${SURFACE.border}` }}>
                          <Body darkMode={darkMode} style={{ fontSize: "13px" }}>{i + 1}. {p.full_name}</Body>
                          <Badge darkMode={darkMode} variant="green">{p.views_count} views</Badge>
                        </div>
                      ))
                    )}
                  </div>
                </Card>
              </div>
            </div>
          )}
        </Tab>

        {/* ── Pitch Builder — no wrapping Cards; plain sections ── */}
        <Tab name="Pitch Builder">
          <div style={{ paddingTop: "24px", display: "flex", flexDirection: "column", gap: "32px" }}>

            {/* Create Pitch form — plain section, no Card wrapper */}
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "20px" }}>
                <Icon glyph="Megaphone" fill={BRAND.primary} size={14} />
                <Overline darkMode={darkMode}>Create Curated Talent Pitch</Overline>
              </div>
              <form onSubmit={handleCreatePitch} style={{ display: "flex", flexDirection: "column", gap: "16px", maxWidth: "600px" }}>
                <TextInput data-okc-theme="true" darkMode={darkMode} label="Pitch Title" placeholder="e.g. Next.js Developers for Startup Team" value={pitchTitle} onChange={(e) => setPitchTitle(e.target.value)} required />
                <TextArea data-okc-theme="true" darkMode={darkMode} label="Description" placeholder="Summarize the credentials and suitability of chosen candidates..." value={pitchDesc} onChange={(e) => setPitchDesc(e.target.value)} rows={3} />
                <TextArea data-okc-theme="true" darkMode={darkMode} label="Selected Profile IDs (comma-separated UUIDs)" placeholder="e.g. d3b07384-d113-..., ..." value={pitchProfileIds} onChange={(e) => setPitchProfileIds(e.target.value)} rows={2} required />
                <Body darkMode={darkMode} style={{ fontSize: "11px", color: mutedColor }}>Copy IDs from Directory or Approvals queue.</Body>
                <Button type="submit" darkMode={darkMode} variant="primary" leftGlyph={<Icon glyph="Plus" />}>
                  Generate Shareable Pitch URL
                </Button>
              </form>
            </div>

            {/* Created pitch success — Banner, not Card */}
            {createdPitchId && (
              <div
                style={{
                  padding: "16px 20px",
                  borderRadius: "8px",
                  background: STATUS.successBg,
                  border: `1px solid ${STATUS.successBorder}`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  gap: "16px",
                  flexWrap: "wrap",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                  <Icon glyph="Checkmark" fill={STATUS.success} size={14} />
                  <H3 darkMode={darkMode} style={{ fontSize: "14px", color: STATUS.success, margin: 0 }}>Pitch Active —</H3>
                  <Body darkMode={darkMode} style={{ fontSize: "13px", userSelect: "all", color: textColor }}>{createdPitchId}</Body>
                </div>
                <Button as="a" href={`/pitches?id=${createdPitchId}`} target="_blank" darkMode={darkMode} variant="default" size="xsmall" rightGlyph={<Icon glyph="ArrowRight" />}>
                  Open Pitch
                </Button>
              </div>
            )}

            {/* Curated Pitches list — Table, no outer Card */}
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "16px" }}>
                <Icon glyph="List" fill={BRAND.primary} size={14} />
                <Overline darkMode={darkMode}>Curated Pitches ({pitches.length})</Overline>
              </div>

              {pitches.length === 0 ? (
                <Body darkMode={darkMode} style={{ color: mutedColor, textAlign: "center", padding: "20px 0" }}>No pitches created yet.</Body>
              ) : (
                <Table darkMode={darkMode}>
                  <TableHead>
                    <HeaderRow>
                      <HeaderCell>Title</HeaderCell>
                      <HeaderCell>Status</HeaderCell>
                      <HeaderCell>Members</HeaderCell>
                      <HeaderCell>Created</HeaderCell>
                      <HeaderCell>Actions</HeaderCell>
                    </HeaderRow>
                  </TableHead>
                  <TableBody>
                    {pitches.map((datum) => (
                      <Row key={datum.pitch_id}>
                        <Cell>
                          <div>
                            <Body darkMode={darkMode} style={{ fontWeight: 600, fontSize: "13px" }}>{datum.title}</Body>
                            {datum.description && (
                              <Body darkMode={darkMode} style={{ fontSize: "11px", color: mutedColor, marginTop: "2px", display: "-webkit-box", WebkitLineClamp: 1, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
                                {datum.description}
                              </Body>
                            )}
                          </div>
                        </Cell>
                        <Cell><Badge darkMode={darkMode} variant={datum.is_active ? "green" : "red"}>{datum.is_active ? "Active" : "Deactivated"}</Badge></Cell>
                        <Cell><Body darkMode={darkMode} style={{ fontSize: "13px" }}>{datum.member_count}</Body></Cell>
                        <Cell><Body darkMode={darkMode} style={{ fontSize: "12px", color: mutedColor }}>{new Date(datum.created_at).toLocaleDateString()}</Body></Cell>
                        <Cell>
                          <div style={{ display: "flex", gap: "8px" }}>
                            <Button as="a" href={`/pitches?id=${datum.pitch_id}`} target="_blank" darkMode={darkMode} variant="default" size="xsmall">View</Button>
                            {datum.is_active && (
                              <Button darkMode={darkMode} variant="dangerOutline" size="xsmall" onClick={() => handleDeactivatePitch(datum.pitch_id)}>Deactivate</Button>
                            )}
                          </div>
                        </Cell>
                      </Row>
                    ))}
                  </TableBody>
                </Table>
              )}
            </div>
          </div>
        </Tab>

        {/* ── Access Control — single Card for the isolated action ── */}
        <Tab name="Access Control">
          <div style={{ paddingTop: "24px" }}>
            <Card data-okc-theme="true" darkMode={darkMode} style={{ padding: "24px", maxWidth: "600px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "16px" }}>
                <Icon glyph="XWithCircle" fill={STATUS.error} size={14} />
                <Overline darkMode={darkMode}>Disable User Account</Overline>
              </div>
              <Body darkMode={darkMode} style={{ color: mutedColor, marginBottom: "20px" }}>
                Disabling an account sets the approved status to inactive. The user will be logged out and blocked from logging in.
              </Body>

              <TextInput data-okc-theme="true" darkMode={darkMode} label="Target User ID (UUID)" placeholder="e.g. c3f02174-b112-..." value={disableUserId} onChange={(e) => setDisableUserId(e.target.value)} required />

              <Button darkMode={darkMode} variant="danger" style={{ marginTop: "16px", width: "100%" }} onClick={() => setConfirmDisable(true)} disabled={!disableUserId.trim()}>
                Disable Account
              </Button>

              <ConfirmationModal
                darkMode={darkMode}
                open={confirmDisable}
                onConfirm={handleDisable}
                onCancel={() => setConfirmDisable(false)}
                title="Confirm Account Deactivation"
                buttonText="Disable Account"
                variant="danger"
              >
                Are you sure you want to disable this account? The user will immediately lose access to the portal.
              </ConfirmationModal>
            </Card>
          </div>
        </Tab>
      </Tabs>
    </div>
  );
}
