"use client";
import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { useAuth } from "@/context/AuthContext";
import ResponseBox from "@/components/ResponseBox";
import { Users, UserCheck, UserX, BarChart2, Award, FileText, ArrowUpRight, FolderPlus, Radio, Plus, ShieldAlert, CheckCircle2 } from "lucide-react";

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

const inputClass = "neo-input w-full rounded-lg px-3.5 py-2.5 font-mono text-sm";
const labelClass = "text-xs font-mono font-bold uppercase text-slate-400 block mb-1";

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
        <div className="neo-card rounded-xl p-8 text-center space-y-4 max-w-sm w-full border-2 border-slate-800 shadow-neo">
          <div className="w-12 h-12 rounded-lg flex items-center justify-center mx-auto btn-danger">
            <UserX size={22} />
          </div>
          <h2 className="font-mono font-bold text-sm uppercase">[ ACCESS RESTRICTED ]</h2>
          <p className="font-mono text-xs text-slate-400">Your account does not possess administrator privileges.</p>
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
    { id: "pitches", label: "Pitch Generator" },
    { id: "settings", label: "Access Control" },
  ];

  return (
    <div className="space-y-6">
      
      {/* Control Panel Header */}
      <div className="neo-card rounded-xl p-6 border-2 border-slate-800 shadow-neo flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="neo-badge neo-badge-pink mb-2 inline-block">[ SYSTEM DASHBOARD ]</div>
          <h1 className="text-2xl font-mono font-black uppercase tracking-tight">Admin Control Panel</h1>
          <p className="text-xs font-mono text-slate-400 mt-1">Review membership registrations, monitor directory analytics, and curate pitches</p>
        </div>
      </div>

      {/* Neobrutalist Tab Switcher */}
      <div className="neo-card rounded-xl p-2 border-2 border-slate-800 shadow-neo flex gap-2 overflow-x-auto bg-tech-grid">
        {TABS.map((t) => {
          const isActive = tab === t.id;
          return (
            <button key={t.id}
              onClick={() => { setTab(t.id); setResult(null); }}
              className={`flex-shrink-0 font-mono text-xs uppercase font-bold px-5 py-2.5 rounded-lg transition-all cursor-pointer ${
                isActive ? "neo-btn-brand" : "neo-btn-ghost border-transparent"
              }`}
            >
              [ {t.label.toUpperCase()} ]
            </button>
          );
        })}
      </div>

      <ResponseBox result={result} />

      {/* ── Approvals Queue ── */}
      {tab === "pending" && (
        <div className="neo-card rounded-xl p-6 sm:p-8 space-y-6 border-2 border-slate-800 shadow-neo">
          <div className="section-header flex items-center justify-between pb-3 border-b border-slate-800">
            <div className="flex items-center gap-2">
              <UserCheck size={16} className="text-amber-400" />
              <h2 className="font-mono font-bold text-sm uppercase tracking-wider">[ QUEUED REGISTRATIONS: {pending.length} ]</h2>
            </div>
          </div>

          {pending.length === 0 ? (
            <div className="neo-card rounded-lg p-10 text-center font-mono text-xs text-slate-400 border border-slate-800">
              [ NO PENDING MEMBERSHIP REQUESTS CURRENTLY QUEUED ]
            </div>
          ) : (
            <div className="space-y-4">
              {pending.map((u) => (
                <div key={u.user_id}
                  className="neo-card rounded-lg p-5 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4 neo-card-hover">
                  <div className="space-y-1.5 font-mono">
                    <div className="font-bold text-sm text-slate-100">{u.full_name || "New Registrant"}</div>
                    <div className="text-xs text-amber-400">{u.email}</div>
                    <div className="flex items-center gap-2 text-[10px] text-slate-400 pt-1">
                      <span className="neo-badge neo-badge-pink text-[9px]">{u.role}</span>
                      <span>Requested: {new Date(u.created_at).toLocaleDateString()}</span>
                    </div>
                    <div className="text-[10px] text-slate-500 select-all">profile_id: {u.profile_id}</div>
                  </div>

                  <button onClick={() => handleApprove(u.profile_id)}
                    className="neo-btn-brand font-mono text-xs uppercase font-bold px-6 py-3 rounded-lg cursor-pointer self-start sm:self-center">
                    [ APPROVE USER ]
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ── System Analytics ── */}
      {tab === "analytics" && analytics && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {[
              { label: "Total Talent", value: analytics.usersCount.member + analytics.usersCount.alumni, icon: Users, badge: "neo-badge-amber" },
              { label: "Approved Accounts", value: analytics.approvalStatus.approved, icon: UserCheck, badge: "neo-badge-green" },
              { label: "Directory Views", value: analytics.totalViews, icon: BarChart2, badge: "neo-badge-pink" },
              { label: "CV Downloads", value: analytics.totalDownloads, icon: FileText, badge: "neo-badge-amber" },
            ].map((stat, i) => (
              <div key={i} className="neo-card rounded-xl p-5 border-2 border-slate-800 shadow-neo flex items-center justify-between">
                <div>
                  <span className={`neo-badge ${stat.badge} text-[10px]`}>[ {stat.label.toUpperCase()} ]</span>
                  <div className="text-3xl font-mono font-black text-slate-100 mt-2">{stat.value}</div>
                </div>
                <stat.icon size={22} className="text-slate-500" />
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Skill Distribution */}
            <div className="neo-card rounded-xl p-6 space-y-4 border-2 border-slate-800 shadow-neo">
              <div className="section-header pb-2 border-b border-slate-800">
                <span className="neo-badge neo-badge-amber text-[10px]">[ TECH MATRIX ]</span>
                <h3 className="font-mono font-bold text-sm uppercase mt-1">Skill Distribution Trends</h3>
              </div>

              <div className="space-y-3 font-mono">
                {analytics.skillTrends.length === 0 ? (
                  <p className="text-xs text-slate-500">No skill data indexed yet.</p>
                ) : (
                  analytics.skillTrends.slice(0, 5).map((sk) => {
                    const topVal = analytics.skillTrends[0]?.occurrences || 1;
                    const pct = Math.round((sk.occurrences / topVal) * 100);
                    return (
                      <div key={sk.name} className="space-y-1">
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-slate-300 font-bold">{sk.name}</span>
                          <span className="text-amber-400">{sk.occurrences} candidates</span>
                        </div>
                        <div className="w-full h-2 rounded-full overflow-hidden bg-slate-900 border border-slate-800">
                          <div className="h-2 rounded-full brand-gradient" style={{ width: `${pct}%` }} />
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>

            {/* Popular Profiles */}
            <div className="neo-card rounded-xl p-6 space-y-4 border-2 border-slate-800 shadow-neo">
              <div className="section-header pb-2 border-b border-slate-800">
                <span className="neo-badge neo-badge-pink text-[10px]">[ HIGH IMPACT ]</span>
                <h3 className="font-mono font-bold text-sm uppercase mt-1">Most Viewed Talent Profiles</h3>
              </div>

              <div className="space-y-2 font-mono">
                {analytics.topViewedProfiles.length === 0 ? (
                  <p className="text-xs text-slate-500">No profile views logged.</p>
                ) : (
                  analytics.topViewedProfiles.slice(0, 5).map((p, i) => (
                    <div key={p.profile_id}
                      className="flex items-center justify-between text-xs py-2 border-b border-slate-800/60 last:border-0">
                      <span className="text-slate-300 font-bold"><span className="text-slate-500 mr-2">#{i + 1}</span>{p.full_name}</span>
                      <span className="neo-badge neo-badge-amber text-[10px]">{p.views_count} VIEWS</span>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── Pitch Generator ── */}
      {tab === "pitches" && (
        <div className="space-y-6">
          <form onSubmit={handleCreatePitch} className="neo-card rounded-xl p-6 sm:p-8 space-y-4 border-2 border-slate-800 shadow-neo">
            <div className="section-header pb-2 border-b border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <FolderPlus size={16} className="text-amber-400" />
                <h2 className="font-mono font-bold text-sm uppercase tracking-wider">[ GENERATE SHAREABLE TALENT PITCH ]</h2>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className={labelClass}>Pitch Title</label>
                <input type="text" value={pitchTitle} onChange={(e) => setPitchTitle(e.target.value)}
                  className={inputClass} placeholder="e.g. Next.js & AI Developers for Startup Cohort" required />
              </div>
              <div>
                <label className={labelClass}>Pitch Summary / Description</label>
                <textarea value={pitchDesc} onChange={(e) => setPitchDesc(e.target.value)}
                  className={`${inputClass} resize-none`} rows={3}
                  placeholder="Overview of candidate background and project suitability..." />
              </div>
              <div>
                <label className={labelClass}>Selected Candidate Profile IDs (comma-separated UUIDs)</label>
                <textarea value={pitchProfileIds} onChange={(e) => setPitchProfileIds(e.target.value)}
                  className={`${inputClass} resize-none`} rows={2}
                  placeholder="e.g. demo-1, demo-2..." required />
              </div>
            </div>

            <button type="submit"
              className="neo-btn-brand w-full py-3 rounded-lg font-mono text-xs uppercase tracking-wider cursor-pointer flex items-center justify-center gap-2">
              <Plus size={15} /> [ GENERATE PITCH TOKEN ]
            </button>
          </form>

          {createdPitchId && (
            <div className="neo-card rounded-xl p-5 space-y-2 border-2 border-emerald-500/40 bg-emerald-950/20 shadow-neo">
              <div className="flex items-center gap-2 font-mono text-xs font-bold text-emerald-400">
                <CheckCircle2 size={15} /> [ PITCH CREATED SUCCESSFULLY ]
              </div>
              <p className="font-mono text-xs text-slate-300">Access Token / Link:</p>
              <div className="flex items-center justify-between rounded-lg px-4 py-2.5 font-mono text-xs neo-card border border-slate-800 bg-slate-950">
                <span className="text-amber-400 select-all font-bold">{createdPitchId}</span>
                <a href={`/pitches?id=${createdPitchId}`} target="_blank"
                  className="neo-badge neo-badge-amber text-[10px] flex items-center gap-1">
                  <span>OPEN PITCH</span> <ArrowUpRight size={11} />
                </a>
              </div>
            </div>
          )}

          {/* Pitches Feed */}
          <div className="neo-card rounded-xl p-6 sm:p-8 space-y-4 border-2 border-slate-800 shadow-neo">
            <div className="section-header pb-2 border-b border-slate-800">
              <h2 className="font-mono font-bold text-sm uppercase tracking-wider">[ CREATED PITCHES ({pitches.length}) ]</h2>
            </div>
            <div className="space-y-3 font-mono">
              {pitches.length === 0 ? (
                <p className="text-xs text-slate-500 text-center py-6">[ NO CURATED PITCHES CREATED YET ]</p>
              ) : (
                pitches.map((p) => (
                  <div key={p.pitch_id}
                    className="neo-card rounded-lg p-5 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4 neo-card-hover">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-sm text-slate-100">{p.title}</span>
                        <span className={p.is_active ? "neo-badge neo-badge-green text-[9px]" : "neo-badge neo-badge-red text-[9px]"}>
                          [ {p.is_active ? "ACTIVE" : "DEACTIVATED"} ]
                        </span>
                      </div>
                      {p.description && <p className="font-sans text-xs text-slate-400 line-clamp-1">{p.description}</p>}
                      <p className="text-[10px] text-slate-500">Created: {new Date(p.created_at).toLocaleDateString()} · Candidates: {p.member_count}</p>
                    </div>

                    <div className="flex items-center gap-3 shrink-0 text-xs">
                      <a href={`/pitches?id=${p.pitch_id}`} target="_blank"
                        className="neo-badge neo-badge-amber text-[10px]">
                        VIEW PITCH
                      </a>
                      {p.is_active && (
                        <button type="button" onClick={() => handleDeactivatePitch(p.pitch_id)}
                          className="neo-badge neo-badge-red text-[10px] cursor-pointer">
                          DEACTIVATE
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
        <form onSubmit={handleDisable} className="neo-card rounded-xl p-6 sm:p-8 space-y-4 max-w-xl border-2 border-slate-800 shadow-neo">
          <div className="section-header pb-2 border-b border-slate-800 flex items-center gap-2">
            <UserX size={16} className="text-red-400" />
            <h2 className="font-mono font-bold text-sm uppercase tracking-wider">[ DISABLE MEMBER ACCOUNT ]</h2>
          </div>
          <p className="font-sans text-xs text-slate-400 leading-relaxed">
            Disabling an account sets the user status to inactive. The target member will be logged out and prohibited from authenticating.
          </p>
          <div>
            <label className={labelClass}>Target User ID (UUID)</label>
            <input type="text" value={disableUserId} onChange={(e) => setDisableUserId(e.target.value)}
              className={inputClass} placeholder="e.g. c3f02174-b112-..." required />
          </div>
          <button type="submit"
            className="btn-danger w-full py-3 rounded-lg font-mono text-xs uppercase tracking-wider cursor-pointer">
            [ CONFIRM DISABLE ACCOUNT ]
          </button>
        </form>
      )}

    </div>
  );
}
