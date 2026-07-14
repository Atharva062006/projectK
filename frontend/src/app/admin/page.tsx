"use client";
import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { useAuth } from "@/context/AuthContext";
import ResponseBox from "@/components/ResponseBox";
import { 
  Users, UserCheck, UserX, BarChart2, Award, 
  FileText, ArrowUpRight, FolderPlus, Radio, Plus
} from "lucide-react";

type Tab = "pending" | "analytics" | "pitches" | "settings";

interface PendingUser {
  user_id: string;
  profile_id: string;
  full_name: string;
  email: string;
  role: string;
  created_at: string;
}

interface Analytics {
  usersCount: Record<string, number>;
  approvalStatus: { approved: number; pending: number };
  totalViews: number;
  totalDownloads: number;
  skillTrends: { name: string; category: string; occurrences: number }[];
  topViewedProfiles: { profile_id: string; full_name: string; views_count: number }[];
  resumeDownloadStats: { profile_id: string; full_name: string; download_count: number }[];
}

interface AdminPitch {
  pitch_id: string;
  title: string;
  description?: string;
  is_active: boolean;
  created_at: string;
  member_count: number;
}

export default function AdminPage() {
  const { user, token } = useAuth();
  const [tab, setTab] = useState<Tab>("pending");
  const [pending, setPending] = useState<PendingUser[]>([]);
  const [analytics, setAnalytics] = useState<Analytics | null>(null);
  const [pitches, setPitches] = useState<AdminPitch[]>([]);
  const [result, setResult] = useState<{ ok: boolean; message: string; data?: unknown } | null>(null);
  
  // Disable user form
  const [disableUserId, setDisableUserId] = useState("");

  // Pitch Builder form
  const [pitchTitle, setPitchTitle] = useState("");
  const [pitchDesc, setPitchDesc] = useState("");
  const [pitchProfileIds, setPitchProfileIds] = useState("");
  const [createdPitchId, setCreatedPitchId] = useState<string | null>(null);

  const loadPending = async () => {
    try {
      const res = await api.admin.getPending();
      if (res.ok) {
        setPending((res.data as PendingUser[]) || []);
      } else {
        setResult(res);
      }
    } catch {
      setResult({ ok: false, message: "Failed to connect to approvals queue" });
    }
  };

  const loadAnalytics = async () => {
    try {
      const res = await api.admin.getAnalytics();
      if (res.ok) {
        setAnalytics(res.data as Analytics);
      } else {
        setResult(res);
      }
    } catch {
      setResult({ ok: false, message: "Failed to fetch analytics statistics" });
    }
  };

  const loadPitches = async () => {
    try {
      const res = await api.admin.getPitches();
      if (res.ok) {
        setPitches((res.data as AdminPitch[]) || []);
      } else {
        setResult(res);
      }
    } catch {
      setResult({ ok: false, message: "Failed to fetch active pitches overview" });
    }
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
      <div className="max-w-md mx-auto py-12">
        <div className="bg-[#0e1017] border border-gray-800 rounded-2xl p-6 text-center space-y-4">
          <div className="w-12 h-12 rounded-full bg-red-950/40 border border-red-950 flex items-center justify-center mx-auto text-red-400">
            <UserX size={20} />
          </div>
          <h2 className="text-sm font-mono font-semibold text-white">Administrator Access Required</h2>
          <p className="text-xs text-gray-500 font-mono">Your account role does not have permission to view this control panel.</p>
        </div>
      </div>
    );
  }

  const handleApprove = async (profileId: string) => {
    setResult(null);
    const res = await api.admin.approveUser(profileId);
    setResult(res);
    if (res.ok) {
      loadPending();
    }
  };

  const handleDisable = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!disableUserId.trim()) return;
    setResult(null);
    const res = await api.admin.disableUser(disableUserId.trim());
    setResult(res);
    if (res.ok) {
      setDisableUserId("");
    }
  };

  const handleCreatePitch = async (e: React.FormEvent) => {
    e.preventDefault();
    setResult(null);
    setCreatedPitchId(null);
    const profileIds = pitchProfileIds.split(",").map(id => id.trim()).filter(Boolean);
    if (profileIds.length === 0) {
      setResult({ ok: false, message: "Enter at least one approved profile ID" });
      return;
    }
    const res = await api.pitches.create({
      title: pitchTitle,
      description: pitchDesc,
      profileIds
    });
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
    if (res.ok) {
      loadPitches();
    }
  };

  const tabs: { id: Tab; label: string }[] = [
    { id: "pending", label: "Approvals Queue" },
    { id: "analytics", label: "System Analytics" },
    { id: "pitches", label: "Pitch Builder" },
    { id: "settings", label: "Access Control" },
  ];

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="border-b border-gray-800 pb-5">
        <h1 className="text-2xl font-bold text-white font-mono tracking-wide">Administrator Panel</h1>
        <p className="text-xs text-gray-500 font-mono mt-1">Configure active memberships and curate shareable pitches</p>
      </div>

      {/* Tabs list */}
      <div className="flex gap-1 bg-[#0e1017] p-1 border border-gray-800 rounded-xl overflow-x-auto">
        {tabs.map((t) => (
          <button 
            key={t.id} 
            onClick={() => { setTab(t.id); setResult(null); }}
            className={`flex-shrink-0 text-xs font-mono px-4 py-2 rounded-lg transition-colors cursor-pointer ${
              tab === t.id ? "bg-blue-700 text-white" : "text-gray-400 hover:text-white"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      <ResponseBox result={result} />

      {/* TAB: APPROVALS QUEUE */}
      {tab === "pending" && (
        <div className="space-y-4">
          <div className="flex items-center justify-between border-b border-gray-850 pb-2">
            <h2 className="text-xs font-mono font-bold text-gray-400 uppercase tracking-wider">Pending Registrations ({pending.length})</h2>
          </div>
          {pending.length === 0 ? (
            <div className="bg-[#0e1017] border border-gray-800 rounded-2xl p-8 text-center text-xs font-mono text-gray-500">
              No membership requests currently pending activation.
            </div>
          ) : (
            <div className="space-y-3">
              {pending.map((u) => (
                <div key={u.user_id} className="bg-[#0e1017] border border-gray-800 rounded-2xl p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="space-y-1">
                    <div className="font-semibold text-xs text-white font-mono">{u.full_name || "New Registrant"}</div>
                    <div className="text-[11px] text-gray-400 font-mono">{u.email}</div>
                    <div className="flex gap-2 text-[10px] font-mono text-gray-500 pt-1">
                      <span className="bg-[#141620] border border-gray-800 text-gray-400 px-2 py-0.5 rounded uppercase">{u.role}</span>
                      <span>Request date: {new Date(u.created_at).toLocaleDateString()}</span>
                    </div>
                    <div className="text-[9px] font-mono text-gray-600 select-all pt-1">profile_id: {u.profile_id}</div>
                  </div>
                  
                  <button 
                    onClick={() => handleApprove(u.profile_id)}
                    className="bg-blue-700 hover:bg-blue-600 text-white font-mono text-xs font-semibold px-4 py-2 rounded-lg transition-colors cursor-pointer self-start sm:self-center"
                  >
                    Approve User
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB: SYSTEM ANALYTICS */}
      {tab === "analytics" && analytics && (
        <div className="space-y-6">
          
          {/* Bento Stats Summary */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-[#0e1017] border border-gray-800 rounded-2xl p-4 flex items-center justify-between">
              <div>
                <span className="text-[10px] font-mono text-gray-500 uppercase font-semibold">Total Members</span>
                <div className="text-xl font-bold text-white font-mono mt-1">{analytics.usersCount.member + analytics.usersCount.alumni}</div>
              </div>
              <Users size={20} className="text-blue-500/50" />
            </div>

            <div className="bg-[#0e1017] border border-gray-800 rounded-2xl p-4 flex items-center justify-between">
              <div>
                <span className="text-[10px] font-mono text-gray-500 uppercase font-semibold">Approved Users</span>
                <div className="text-xl font-bold text-green-400 font-mono mt-1">{analytics.approvalStatus.approved}</div>
              </div>
              <UserCheck size={20} className="text-green-500/50" />
            </div>

            <div className="bg-[#0e1017] border border-gray-800 rounded-2xl p-4 flex items-center justify-between">
              <div>
                <span className="text-[10px] font-mono text-gray-500 uppercase font-semibold">Showcase Views</span>
                <div className="text-xl font-bold text-white font-mono mt-1">{analytics.totalViews}</div>
              </div>
              <BarChart2 size={20} className="text-indigo-500/50" />
            </div>

            <div className="bg-[#0e1017] border border-gray-800 rounded-2xl p-4 flex items-center justify-between">
              <div>
                <span className="text-[10px] font-mono text-gray-500 uppercase font-semibold">CV Downloads</span>
                <div className="text-xl font-bold text-white font-mono mt-1">{analytics.totalDownloads}</div>
              </div>
              <FileText size={20} className="text-purple-500/50" />
            </div>
          </div>

          {/* Sub analytics: Skill trends + viewed profiles */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Skill Trends */}
            <div className="bg-[#0e1017] border border-gray-800 rounded-2xl p-5 space-y-4">
              <div className="flex items-center gap-2 border-b border-gray-800/80 pb-2">
                <Award size={14} className="text-blue-400" />
                <h3 className="text-xs font-mono font-bold uppercase text-gray-400">Skill Distribution</h3>
              </div>
              
              <div className="space-y-2">
                {analytics.skillTrends.length === 0 ? (
                  <p className="text-xs font-mono text-gray-500">No skill maps registered.</p>
                ) : (
                  analytics.skillTrends.slice(0, 5).map(sk => {
                    const topVal = analytics.skillTrends[0]?.occurrences || 1;
                    const pct = Math.round((sk.occurrences / topVal) * 100);
                    return (
                      <div key={sk.name} className="space-y-1">
                        <div className="flex items-center justify-between text-xs font-mono">
                          <span className="text-gray-300">{sk.name}</span>
                          <span className="text-gray-500">{sk.occurrences} matches</span>
                        </div>
                        <div className="w-full bg-[#141520] h-1.5 rounded-full overflow-hidden">
                          <div className="bg-blue-600 h-1.5 rounded-full" style={{ width: `${pct}%` }} />
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>

            {/* Top Viewed Profiles */}
            <div className="bg-[#0e1017] border border-gray-800 rounded-2xl p-5 space-y-4">
              <div className="flex items-center gap-2 border-b border-gray-800/80 pb-2">
                <BarChart2 size={14} className="text-blue-400" />
                <h3 className="text-xs font-mono font-bold uppercase text-gray-400">Popular Profiles</h3>
              </div>

              <div className="space-y-2">
                {analytics.topViewedProfiles.length === 0 ? (
                  <p className="text-xs font-mono text-gray-500">No profile views logged yet.</p>
                ) : (
                  analytics.topViewedProfiles.slice(0, 5).map((p, i) => (
                    <div key={p.profile_id} className="flex items-center justify-between text-xs font-mono py-1 border-b border-gray-850 last:border-0">
                      <span className="text-gray-300"><span className="text-gray-500 mr-1.5">{i+1}.</span>{p.full_name}</span>
                      <span className="text-xs text-blue-400 font-bold">{p.views_count} views</span>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB: PITCH BUILDER */}
      {tab === "pitches" && (
        <div className="space-y-6">
          <form onSubmit={handleCreatePitch} className="bg-[#0e1017] border border-gray-800 rounded-2xl p-6 space-y-4">
            <div className="flex items-center gap-2 border-b border-gray-800 pb-3">
              <FolderPlus size={14} className="text-blue-400" />
              <h2 className="text-xs font-mono font-bold tracking-wider uppercase text-gray-400">Create Curated Talent Pitch</h2>
            </div>

            <div className="space-y-3">
              <div className="space-y-1">
                <label className="text-[10px] font-mono text-gray-500">Pitch Title</label>
                <input 
                  type="text" 
                  value={pitchTitle} 
                  onChange={(e) => setPitchTitle(e.target.value)}
                  className="w-full bg-[#11131c] border border-gray-800 rounded-lg px-3 py-2 text-xs text-gray-200 outline-none focus:border-gray-700 font-mono"
                  placeholder="e.g. Next.js Developers for Startup Team"
                  required
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-mono text-gray-500">Description</label>
                <textarea 
                  value={pitchDesc} 
                  onChange={(e) => setPitchDesc(e.target.value)}
                  className="w-full bg-[#11131c] border border-gray-800 rounded-lg px-3 py-2 text-xs text-gray-200 outline-none focus:border-gray-700 font-mono"
                  placeholder="Summarize the credentials and suitability of the chosen candidates..."
                  rows={3}
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-mono text-gray-500">Selected Profile IDs (comma-separated UUIDs)</label>
                <textarea 
                  value={pitchProfileIds} 
                  onChange={(e) => setPitchProfileIds(e.target.value)}
                  className="w-full bg-[#11131c] border border-gray-800 rounded-lg px-3 py-2 text-xs text-gray-200 outline-none focus:border-gray-700 font-mono"
                  placeholder="e.g. d3b07384-d113-40a2-a89e-2f3b9090b84c, ..."
                  rows={2}
                  required
                />
                <p className="text-[9px] font-mono text-gray-600">Copy profile IDs from Directory cards or the Approvals queue list.</p>
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-blue-700 hover:bg-blue-600 text-white font-mono text-xs font-semibold py-2.5 rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1.5"
            >
              <Plus size={12} />
              <span>Generate Shareable Pitch URL</span>
            </button>
          </form>

          {createdPitchId && (
            <div className="bg-green-950/60 border border-green-900 rounded-2xl p-5 space-y-2">
              <div className="flex items-center gap-2 text-green-300 font-mono text-xs font-bold">
                <Radio size={14} className="animate-pulse" />
                <span>Pitch Page Active</span>
              </div>
              <p className="text-[11px] font-mono text-gray-400">Share the generated Pitch ID below with recruiters or stakeholders:</p>
              <div className="flex items-center justify-between bg-[#0e1017] border border-gray-800 p-2.5 rounded-lg">
                <span className="text-xs text-gray-300 font-mono select-all">{createdPitchId}</span>
                <a 
                  href={`/pitches?id=${createdPitchId}`} 
                  onClick={(e) => {
                    e.preventDefault();
                    window.location.href = `/pitches?id=${createdPitchId}`;
                  }}
                  className="text-xs text-blue-500 hover:underline flex items-center gap-1 font-mono"
                >
                  <span>Open</span>
                  <ArrowUpRight size={10} />
                </a>
              </div>
            </div>
          )}

          {/* Pitches list overview */}
          <div className="bg-[#0e1017] border border-gray-800 rounded-2xl p-6 space-y-4 mt-6">
            <div className="flex items-center gap-2 border-b border-gray-800 pb-3">
              <Radio size={14} className="text-blue-400" />
              <h2 className="text-xs font-mono font-bold tracking-wider uppercase text-gray-400">Curated Pitches Overview ({pitches.length})</h2>
            </div>

            <div className="space-y-3 font-mono text-xs">
              {pitches.length === 0 ? (
                <p className="text-gray-500 text-center py-4">No pitches have been created yet.</p>
              ) : (
                pitches.map((p) => (
                  <div key={p.pitch_id} className="bg-[#11131c] border border-gray-800 rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-white text-xs">{p.title}</span>
                        <span className={`text-[9px] px-2 py-0.5 rounded-full ${
                          p.is_active 
                            ? "bg-green-950/80 text-green-300 border border-green-900" 
                            : "bg-red-950/80 text-red-300 border border-red-900"
                        }`}>
                          {p.is_active ? "Active" : "Deactivated"}
                        </span>
                      </div>
                      {p.description && <p className="text-[10px] text-gray-500 line-clamp-1">{p.description}</p>}
                      <p className="text-[9px] text-gray-600">Created: {new Date(p.created_at).toLocaleDateString()} &bull; Members: {p.member_count}</p>
                    </div>

                    <div className="flex items-center gap-3 shrink-0">
                      <a
                        href={`/pitches?id=${p.pitch_id}`}
                        target="_blank"
                        className="text-blue-400 hover:text-blue-300 hover:underline"
                      >
                        View
                      </a>
                      {p.is_active && (
                        <button
                          type="button"
                          onClick={() => handleDeactivatePitch(p.pitch_id)}
                          className="text-red-400 hover:text-red-300 hover:underline cursor-pointer"
                        >
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

      {/* TAB: ACCESS CONTROL (Disable Users) */}
      {tab === "settings" && (
        <div className="space-y-6">
          <form onSubmit={handleDisable} className="bg-[#0e1017] border border-gray-800 rounded-2xl p-6 space-y-4">
            <div className="flex items-center gap-2 border-b border-gray-800 pb-3">
              <UserX size={14} className="text-red-400" />
              <h2 className="text-xs font-mono font-bold tracking-wider uppercase text-gray-400">Disable User Account</h2>
            </div>
            
            <p className="text-[11px] font-mono text-gray-500 leading-relaxed">
              Disabling an account sets the approved status to inactive. The target user will be logged out and blocked from logging in.
            </p>

            <div className="space-y-1">
              <label className="text-[10px] font-mono text-gray-500">Target User ID (UUID)</label>
              <input 
                type="text" 
                value={disableUserId} 
                onChange={(e) => setDisableUserId(e.target.value)}
                className="w-full bg-[#11131c] border border-gray-800 rounded-lg px-3 py-2 text-xs text-gray-200 outline-none focus:border-gray-700 font-mono"
                placeholder="e.g. c3f02174-b112-..."
                required
              />
            </div>

            <button
              type="submit"
              className="w-full bg-red-950 text-red-400 border border-red-900 hover:bg-red-900 hover:text-white py-2.5 rounded-xl text-xs font-mono font-bold transition-all cursor-pointer"
            >
              Disable Account
            </button>
          </form>
        </div>
      )}

    </div>
  );
}
