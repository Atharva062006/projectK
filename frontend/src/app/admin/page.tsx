"use client";
import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { useAuth } from "@/context/AuthContext";
import ResponseBox from "@/components/ResponseBox";
import { Users, UserCheck, UserX, BarChart2, Award, FileText, ArrowUpRight, FolderPlus, Radio, Plus } from "lucide-react";

type Tab = "pending" | "analytics" | "pitches" | "settings";

interface PendingUser {
  user_id: string; profile_id: string; full_name: string; email: string; role: string; created_at: string;
}

interface Analytics {
  usersCount: Record<string, number>;
  approvalStatus: { approved: number; pending: number };
  totalViews: number; totalDownloads: number;
  skillTrends: { name: string; category: string; occurrences: number }[];
  topViewedProfiles: { profile_id: string; full_name: string; views_count: number }[];
  resumeDownloadStats: { profile_id: string; full_name: string; download_count: number }[];
}

interface AdminPitch {
  pitch_id: string; title: string; description?: string; is_active: boolean; created_at: string; member_count: number;
}

const inputClass = "glass-input w-full rounded-xl px-3 py-2.5 text-sm";
const labelClass = "text-xs text-gray-500 font-medium block mb-1";

export default function AdminPage() {
  const { user, token } = useAuth();
  const [tab, setTab] = useState<Tab>("pending");
  const [pending, setPending] = useState<PendingUser[]>([]);
  const [analytics, setAnalytics] = useState<Analytics | null>(null);
  const [pitches, setPitches] = useState<AdminPitch[]>([]);
  const [result, setResult] = useState<{ ok: boolean; message: string; data?: unknown } | null>(null);
  const [disableUserId, setDisableUserId] = useState("");
  const [pitchTitle, setPitchTitle] = useState("");
  const [pitchDesc, setPitchDesc] = useState("");
  const [pitchProfileIds, setPitchProfileIds] = useState("");
  const [createdPitchId, setCreatedPitchId] = useState<string | null>(null);

  const loadPending = async () => {
    try {
      const res = await api.admin.getPending();
      if (res.ok) setPending((res.data as PendingUser[]) || []);
      else setResult(res);
    } catch { setResult({ ok: false, message: "Failed to connect to approvals queue" }); }
  };

  const loadAnalytics = async () => {
    try {
      const res = await api.admin.getAnalytics();
      if (res.ok) setAnalytics(res.data as Analytics);
      else setResult(res);
    } catch { setResult({ ok: false, message: "Failed to fetch analytics" }); }
  };

  const loadPitches = async () => {
    try {
      const res = await api.admin.getPitches();
      if (res.ok) setPitches((res.data as AdminPitch[]) || []);
      else setResult(res);
    } catch { setResult({ ok: false, message: "Failed to fetch pitches" }); }
  };

  useEffect(() => {
    if (token && user?.role === "admin") {
      if (tab === "pending") loadPending();
      else if (tab === "analytics") loadAnalytics();
      else if (tab === "pitches") loadPitches();
    }
  }, [token, user, tab]);

  if (!token || user?.role !== "admin") {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="glass-card rounded-2xl p-8 text-center space-y-4 max-w-sm w-full">
          <div className="w-12 h-12 rounded-xl flex items-center justify-center mx-auto btn-danger">
            <UserX size={20} />
          </div>
          <h2 className="text-base font-semibold text-white">Access Restricted</h2>
          <p className="text-sm text-gray-500">Your account role does not have permission to access this control panel.</p>
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

  const handleDisable = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!disableUserId.trim()) return;
    setResult(null);
    const res = await api.admin.disableUser(disableUserId.trim());
    setResult(res);
    if (res.ok) setDisableUserId("");
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

  const TABS: { id: Tab; label: string }[] = [
    { id: "pending", label: "Approvals Queue" },
    { id: "analytics", label: "System Analytics" },
    { id: "pitches", label: "Pitch Builder" },
    { id: "settings", label: "Access Control" },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="pb-5 border-b" style={{ borderColor: "rgba(255,255,255,0.07)" }}>
        <h1 className="text-2xl font-bold text-white">Administrator Panel</h1>
        <p className="text-sm text-gray-500 mt-1">Configure memberships and curate shareable talent pitches</p>
      </div>

      {/* Tab Switcher */}
      <div className="glass-panel flex gap-1 p-1 rounded-xl overflow-x-auto">
        {TABS.map((t) => {
          const isActive = tab === t.id;
          return (
            <button key={t.id}
              onClick={() => { setTab(t.id); setResult(null); }}
              className={`flex-shrink-0 text-sm px-4 py-2 rounded-lg font-semibold transition-all cursor-pointer ${
                isActive ? "btn-brand shadow-sm" : "btn-ghost border-transparent"
              }`}
            >
              {t.label}
            </button>
          );
        })}
      </div>

      <ResponseBox result={result} />

      {/* ── Approvals ── */}
      {tab === "pending" && (
        <div className="space-y-4">
          <h2 className="section-title">Pending Registrations ({pending.length})</h2>
          {pending.length === 0 ? (
            <div className="glass-card rounded-2xl p-8 text-center text-sm text-gray-500">
              No membership requests currently pending activation.
            </div>
          ) : (
            <div className="space-y-3">
              {pending.map((u) => (
                <div key={u.user_id}
                  className="glass-card rounded-2xl p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="space-y-1">
                    <div className="font-semibold text-sm text-white">{u.full_name || "New Registrant"}</div>
                    <div className="text-sm text-gray-400">{u.email}</div>
                    <div className="flex gap-2 text-xs text-gray-500 pt-0.5">
                      <span className="px-2 py-0.5 rounded uppercase"
                        style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", color: "#9ca3af" }}>
                        {u.role}
                      </span>
                      <span>Requested: {new Date(u.created_at).toLocaleDateString()}</span>
                    </div>
                    <div className="text-[10px] text-gray-600 select-all">profile_id: {u.profile_id}</div>
                  </div>
                  <button onClick={() => handleApprove(u.profile_id)}
                    className="btn-brand text-sm font-semibold px-5 py-2.5 rounded-lg cursor-pointer self-start sm:self-center">
                    Approve
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ── Analytics ── */}
      {tab === "analytics" && analytics && (
        <div className="space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { label: "Total Members", value: analytics.usersCount.member + analytics.usersCount.alumni, icon: Users, color: "#f0a500" },
              { label: "Approved Users", value: analytics.approvalStatus.approved, icon: UserCheck, color: "#4ade80" },
              { label: "Showcase Views", value: analytics.totalViews, icon: BarChart2, color: "#e879f9" },
              { label: "CV Downloads", value: analytics.totalDownloads, icon: FileText, color: "#f0a500" },
            ].map((stat, i) => (
              <div key={i} className="glass-card rounded-2xl p-4 flex items-center justify-between">
                <div>
                  <span className="text-xs text-gray-500 uppercase font-semibold">{stat.label}</span>
                  <div className="text-2xl font-bold text-white mt-1">{stat.value}</div>
                </div>
                <stat.icon size={20} style={{ color: stat.color, opacity: 0.5 }} />
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Skill Trends */}
            <div className="glass-card rounded-2xl p-5 space-y-4">
              <div className="section-header flex items-center gap-2">
                <Award size={14} style={{ color: "#f0a500" }} />
                <h3 className="section-title">Skill Distribution</h3>
              </div>
              <div className="space-y-3">
                {analytics.skillTrends.length === 0 ? (
                  <p className="text-sm text-gray-500">No skill maps registered.</p>
                ) : (
                  analytics.skillTrends.slice(0, 5).map((sk) => {
                    const topVal = analytics.skillTrends[0]?.occurrences || 1;
                    const pct = Math.round((sk.occurrences / topVal) * 100);
                    return (
                      <div key={sk.name} className="space-y-1">
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-gray-300">{sk.name}</span>
                          <span className="text-gray-500">{sk.occurrences}</span>
                        </div>
                        <div className="w-full h-1.5 rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.07)" }}>
                          <div className="h-1.5 rounded-full" style={{ width: `${pct}%`, background: "linear-gradient(90deg, #f0a500, #f01870)" }} />
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>

            {/* Top Profiles */}
            <div className="glass-card rounded-2xl p-5 space-y-4">
              <div className="section-header flex items-center gap-2">
                <BarChart2 size={14} style={{ color: "#f0a500" }} />
                <h3 className="section-title">Popular Profiles</h3>
              </div>
              <div className="space-y-2">
                {analytics.topViewedProfiles.length === 0 ? (
                  <p className="text-sm text-gray-500">No profile views logged yet.</p>
                ) : (
                  analytics.topViewedProfiles.slice(0, 5).map((p, i) => (
                    <div key={p.profile_id}
                      className="flex items-center justify-between text-sm py-1.5 border-b last:border-0"
                      style={{ borderColor: "rgba(255,255,255,0.06)" }}>
                      <span className="text-gray-300"><span className="text-gray-600 mr-2">{i + 1}.</span>{p.full_name}</span>
                      <span className="font-semibold" style={{ color: "#f0a500" }}>{p.views_count} views</span>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── Pitch Builder ── */}
      {tab === "pitches" && (
        <div className="space-y-5">
          {/* Create Pitch Form */}
          <form onSubmit={handleCreatePitch} className="glass-card rounded-2xl p-6 space-y-4">
            <div className="section-header flex items-center gap-2">
              <FolderPlus size={14} style={{ color: "#f0a500" }} />
              <h2 className="section-title">Create Curated Talent Pitch</h2>
            </div>
            <div className="space-y-3">
              <div>
                <label className={labelClass}>Pitch Title</label>
                <input type="text" value={pitchTitle} onChange={(e) => setPitchTitle(e.target.value)}
                  className={inputClass} placeholder="e.g. Next.js Developers for Startup Team" required />
              </div>
              <div>
                <label className={labelClass}>Description</label>
                <textarea value={pitchDesc} onChange={(e) => setPitchDesc(e.target.value)}
                  className={`${inputClass} resize-none`} rows={3}
                  placeholder="Summarize the credentials and suitability of chosen candidates..." />
              </div>
              <div>
                <label className={labelClass}>Selected Profile IDs (comma-separated UUIDs)</label>
                <textarea value={pitchProfileIds} onChange={(e) => setPitchProfileIds(e.target.value)}
                  className={`${inputClass} resize-none`} rows={2}
                  placeholder="e.g. d3b07384-d113-..., ..." required />
                <p className="text-xs text-gray-600 mt-1">Copy IDs from Directory cards or Approvals queue list.</p>
              </div>
            </div>
            <button type="submit"
              className="btn-brand w-full py-3 rounded-xl text-sm font-semibold cursor-pointer flex items-center justify-center gap-2">
              <Plus size={14} /> Generate Shareable Pitch URL
            </button>
          </form>

          {createdPitchId && (
            <div className="rounded-2xl p-5 space-y-2"
              style={{ background: "rgba(34,197,94,0.07)", border: "1px solid rgba(34,197,94,0.2)" }}>
              <div className="flex items-center gap-2 text-sm font-semibold" style={{ color: "#4ade80" }}>
                <Radio size={13} className="animate-pulse" /> Pitch Page Active
              </div>
              <p className="text-sm text-gray-400">Share the Pitch ID below:</p>
              <div className="flex items-center justify-between rounded-lg px-3 py-2"
                style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.09)" }}>
                <span className="text-sm text-gray-300 select-all">{createdPitchId}</span>
                <a href={`/pitches?id=${createdPitchId}`}
                  onClick={(e) => { e.preventDefault(); window.location.href = `/pitches?id=${createdPitchId}`; }}
                  className="flex items-center gap-1 text-sm font-medium transition-opacity cursor-pointer"
                  style={{ color: "#f0a500" }}>
                  Open <ArrowUpRight size={12} />
                </a>
              </div>
            </div>
          )}

          {/* Pitches List */}
          <div className="glass-card rounded-2xl p-6 space-y-4">
            <div className="section-header flex items-center gap-2">
              <Radio size={14} style={{ color: "#f0a500" }} />
              <h2 className="section-title">Curated Pitches ({pitches.length})</h2>
            </div>
            <div className="space-y-3">
              {pitches.length === 0 ? (
                <p className="text-sm text-gray-500 text-center py-4">No pitches created yet.</p>
              ) : (
                pitches.map((p) => (
                  <div key={p.pitch_id}
                    className="rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                    style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)" }}>
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-sm text-white">{p.title}</span>
                        <span className="text-xs px-2 py-0.5 rounded-full"
                          style={p.is_active
                            ? { background: "rgba(34,197,94,0.1)", border: "1px solid rgba(34,197,94,0.2)", color: "#4ade80" }
                            : { background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.2)", color: "#f87171" }}>
                          {p.is_active ? "Active" : "Deactivated"}
                        </span>
                      </div>
                      {p.description && <p className="text-xs text-gray-500 line-clamp-1">{p.description}</p>}
                      <p className="text-xs text-gray-600">
                        Created: {new Date(p.created_at).toLocaleDateString()} · Members: {p.member_count}
                      </p>
                    </div>
                    <div className="flex items-center gap-4 shrink-0 text-sm">
                      <a href={`/pitches?id=${p.pitch_id}`} target="_blank"
                        className="transition-opacity hover:opacity-75" style={{ color: "#f0a500" }}>
                        View
                      </a>
                      {p.is_active && (
                        <button type="button" onClick={() => handleDeactivatePitch(p.pitch_id)}
                          className="text-red-400 hover:text-red-300 transition-colors cursor-pointer">
                          Deactivate
                        </button>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}

      {/* ── Access Control ── */}
      {tab === "settings" && (
        <div>
          <form onSubmit={handleDisable} className="glass-card rounded-2xl p-6 space-y-4 max-w-xl">
            <div className="section-header flex items-center gap-2">
              <UserX size={14} className="text-red-400" />
              <h2 className="section-title">Disable User Account</h2>
            </div>
            <p className="text-sm text-gray-500 leading-relaxed">
              Disabling an account sets the approved status to inactive. The user will be logged out and blocked from logging in.
            </p>
            <div>
              <label className={labelClass}>Target User ID (UUID)</label>
              <input type="text" value={disableUserId} onChange={(e) => setDisableUserId(e.target.value)}
                className={inputClass} placeholder="e.g. c3f02174-b112-..." required />
            </div>
            <button type="submit"
              className="btn-danger w-full py-2.5 rounded-xl text-sm font-semibold cursor-pointer">
              Disable Account
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
