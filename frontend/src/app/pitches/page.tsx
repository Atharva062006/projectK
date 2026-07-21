"use client";
import { useEffect, useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { api } from "@/lib/api";
import { useAuth } from "@/context/AuthContext";
import ResponseBox from "@/components/ResponseBox";
import { Radio, Globe, Search, Calendar } from "lucide-react";

const GithubIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" width="14" height="14" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22" />
  </svg>
);

const LinkedinIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" width="14" height="14" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
    <rect x="2" y="9" width="4" height="12" /><circle cx="4" cy="4" r="2" />
  </svg>
);

interface PitchMember {
  profile_id: string; full_name: string; tagline?: string; department?: string;
  availability?: string; role_category?: string; email?: string; phone?: string;
  linkedin?: string; github?: string; portfolio_url?: string;
  skills?: { name: string; level: string }[];
}

interface Pitch {
  pitch_id: string; title: string; description?: string; is_active: boolean;
  created_at: string; members?: PitchMember[];
}

function PitchViewerContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { user } = useAuth();

  const [pitchId, setPitchId] = useState("");
  const [pitch, setPitch] = useState<Pitch | null>(null);
  const [result, setResult] = useState<{ ok: boolean; message: string; data?: unknown } | null>(null);
  const [loading, setLoading] = useState(false);

  const loadPitch = async (id: string) => {
    if (!id.trim()) return;
    setLoading(true); setResult(null);
    try {
      const res = await api.pitches.get(id.trim());
      setResult(res);
      setPitch(res.ok ? (res.data as Pitch) : null);
    } catch {
      setResult({ ok: false, message: "Connection to pitch services failed" });
      setPitch(null);
    } finally { setLoading(false); }
  };

  useEffect(() => {
    const id = searchParams.get("id");
    if (id) { setPitchId(id); loadPitch(id); }
  }, [searchParams]);

  const handleSubmitLookup = (e: React.FormEvent) => {
    e.preventDefault();
    if (pitchId.trim()) router.push(`/pitches?id=${pitchId.trim()}`);
  };

  const handleDeactivate = async () => {
    if (!pitch) return;
    setResult(null);
    const res = await api.pitches.deactivate(pitch.pitch_id);
    setResult(res);
    if (res.ok) setPitch({ ...pitch, is_active: false });
  };

  return (
    <div className="space-y-5">
      {/* Lookup */}
      <div className="glass-card rounded-2xl p-5 space-y-4">
        <div className="section-header flex items-center gap-2">
          <Search size={14} style={{ color: "#f0a500" }} />
          <h2 className="section-title">Load Curated Pitch</h2>
        </div>
        <form onSubmit={handleSubmitLookup} className="flex gap-2">
          <input
            type="text"
            placeholder="Enter Pitch Access Token (UUID)..."
            value={pitchId}
            onChange={(e) => setPitchId(e.target.value)}
            className="glass-input flex-1 rounded-xl px-4 py-2.5 text-sm"
            required
          />
          <button type="submit" disabled={loading}
            className="btn-brand px-5 py-2.5 rounded-xl text-sm font-semibold cursor-pointer">
            {loading ? "Loading..." : "Load Pitch"}
          </button>
        </form>
      </div>

      <ResponseBox result={result} />

      {/* Pitch Display */}
      {pitch && (
        <div className="space-y-5">
          {/* Pitch Header */}
          <div className="glass-card rounded-2xl p-6 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
              <div className="space-y-2">
                <h1 className="text-xl font-bold text-white">{pitch.title}</h1>
                <p className="text-sm text-gray-400 leading-relaxed">{pitch.description || "No summary provided."}</p>
                <div className="flex items-center gap-3 text-xs text-gray-500 pt-1">
                  <span className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full border"
                    style={pitch.is_active
                      ? { background: "rgba(34,197,94,0.1)", borderColor: "rgba(34,197,94,0.25)", color: "#4ade80" }
                      : { background: "rgba(239,68,68,0.1)", borderColor: "rgba(239,68,68,0.25)", color: "#f87171" }}>
                    <Radio size={10} className={pitch.is_active ? "animate-pulse" : ""} />
                    {pitch.is_active ? "Active Link" : "Link Expired"}
                  </span>
                  <span className="flex items-center gap-1">
                    <Calendar size={10} />
                    Created {new Date(pitch.created_at).toLocaleDateString()}
                  </span>
                </div>
              </div>

              {user?.role === "admin" && pitch.is_active && (
                <button onClick={handleDeactivate}
                  className="btn-danger px-4 py-2 rounded-lg text-sm cursor-pointer self-start">
                  Deactivate Pitch
                </button>
              )}
            </div>
          </div>

          {/* Members */}
          {pitch.members && pitch.members.length > 0 ? (
            <div className="space-y-4">
              <h2 className="section-title px-1">Selected Candidates ({pitch.members.length})</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {pitch.members.map((m) => {
                  const initials = m.full_name ? m.full_name.split(" ").map((n) => n[0]).join("").toUpperCase() : "?";
                  return (
                    <div key={m.profile_id} className="glass-card rounded-2xl p-5 flex flex-col justify-between gap-4">
                      <div className="space-y-3">
                        <div className="flex items-center gap-3">
                          <div
                            className="w-10 h-10 rounded-xl flex items-center justify-center text-sm font-bold text-white flex-shrink-0"
                            style={{ background: "linear-gradient(135deg, rgba(240,165,0,0.22), rgba(240,24,112,0.18))", border: "1px solid rgba(240,165,0,0.2)" }}
                          >
                            {initials}
                          </div>
                          <div>
                            <h3 className="font-semibold text-sm text-white">{m.full_name}</h3>
                            <p className="text-xs text-gray-500 mt-0.5 line-clamp-1">{m.tagline || "Oyster Kode Club Talent"}</p>
                          </div>
                        </div>
                        {m.skills && m.skills.length > 0 && (
                          <div className="flex flex-wrap gap-1">
                            {m.skills.slice(0, 4).map((sk) => (
                              <span key={sk.name} className="text-[10px] px-2 py-0.5 rounded"
                                style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.09)", color: "#9ca3af" }}>
                                {sk.name}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>

                      <div className="border-t pt-3 space-y-2" style={{ borderColor: "rgba(255,255,255,0.07)" }}>
                        <div className="flex flex-wrap gap-x-3 gap-y-1 text-xs text-gray-400">
                          {m.email && <span>✉ {m.email}</span>}
                          {m.phone && <span>✆ {m.phone}</span>}
                        </div>
                        <div className="flex items-center gap-3">
                          {m.github && (
                            <a href={m.github} target="_blank" className="flex items-center gap-1 text-xs text-gray-400 hover:text-white transition-colors">
                              <GithubIcon /> GitHub
                            </a>
                          )}
                          {m.linkedin && (
                            <a href={m.linkedin} target="_blank" className="flex items-center gap-1 text-xs text-gray-400 hover:text-white transition-colors">
                              <LinkedinIcon /> LinkedIn
                            </a>
                          )}
                          {m.portfolio_url && (
                            <a href={m.portfolio_url} target="_blank" className="flex items-center gap-1 text-xs text-gray-400 hover:text-white transition-colors">
                              <Globe size={12} /> Portfolio
                            </a>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ) : (
            <div className="glass-card rounded-2xl p-8 text-center text-sm text-gray-500">
              No profiles selected in this pitch presentation.
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default function PitchesPage() {
  return (
    <Suspense fallback={<div className="text-sm text-gray-500 py-6">Initializing pitch viewer...</div>}>
      <PitchViewerContent />
    </Suspense>
  );
}
