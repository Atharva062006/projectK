"use client";
import { useEffect, useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { api } from "@/lib/api";
import { useAuth } from "@/context/AuthContext";
import ResponseBox from "@/components/ResponseBox";
import { Radio, Globe, Search, Calendar, Terminal, ShieldAlert, ArrowUpRight } from "lucide-react";

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
    <div className="space-y-6">
      
      {/* Pitch Access Token Lookup Card */}
      <div className="neo-card rounded-xl p-6 space-y-4 border-2 border-slate-800 shadow-neo">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <Search size={16} className="text-amber-400" />
            <h2 className="font-mono font-bold text-sm uppercase tracking-wider">[ RECRUITMENT PITCH LOOKUP ]</h2>
          </div>
          <span className="neo-badge neo-badge-amber text-[10px]">[ PITCH_ID ACCESS ]</span>
        </div>

        <form onSubmit={handleSubmitLookup} className="flex flex-col sm:flex-row gap-3">
          <input
            type="text"
            placeholder="Enter Pitch Access Token (UUID)..."
            value={pitchId}
            onChange={(e) => setPitchId(e.target.value)}
            className="neo-input flex-1 rounded-lg px-4 py-3 font-mono text-sm"
            required
          />
          <button type="submit" disabled={loading}
            className="neo-btn-brand px-6 py-3 rounded-lg font-mono text-xs uppercase tracking-wider cursor-pointer">
            {loading ? "[ LOADING... ]" : "[ LOAD PITCH ]"}
          </button>
        </form>
      </div>

      <ResponseBox result={result} />

      {/* Pitch Presentation Card */}
      {pitch && (
        <div className="space-y-6">
          {/* Pitch Header */}
          <div className="neo-card rounded-xl p-6 sm:p-8 space-y-4 border-2 border-slate-800 shadow-neo">
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <span className={pitch.is_active ? "neo-badge neo-badge-green" : "neo-badge neo-badge-red"}>
                    [ {pitch.is_active ? "ACTIVE PRESENTATION" : "EXPIRED LINK"} ]
                  </span>
                  <span className="neo-badge text-slate-400 border-slate-800">
                    <Calendar size={10} className="inline mr-1" />
                    CREATED: {new Date(pitch.created_at).toLocaleDateString()}
                  </span>
                </div>

                <h1 className="text-2xl font-mono font-black text-slate-100">{pitch.title}</h1>
                <p className="text-sm font-sans text-slate-300 leading-relaxed max-w-3xl">{pitch.description || "No pitch summary provided."}</p>
              </div>

              {user?.role === "admin" && pitch.is_active && (
                <button onClick={handleDeactivate}
                  className="btn-danger px-4 py-2.5 rounded-lg font-mono text-xs uppercase tracking-wider cursor-pointer self-start">
                  Deactivate Pitch
                </button>
              )}
            </div>
          </div>

          {/* Members / Candidates List */}
          {pitch.members && pitch.members.length > 0 ? (
            <div className="space-y-4">
              <div className="flex items-center justify-between px-1">
                <h2 className="font-mono font-bold text-sm uppercase tracking-wider text-slate-300">
                  [ CANDIDATES INCLUDED: {pitch.members.length} ]
                </h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {pitch.members.map((m) => {
                  const initials = m.full_name ? m.full_name.split(" ").map((n) => n[0]).join("").toUpperCase() : "?";
                  return (
                    <div key={m.profile_id} className="neo-card rounded-xl p-6 border border-slate-800 flex flex-col justify-between gap-4 neo-card-hover">
                      <div className="space-y-3">
                        <div className="flex items-center gap-3">
                          <div className="w-11 h-11 rounded-lg flex items-center justify-center font-mono text-xs font-bold text-white flex-shrink-0 brand-gradient shadow-neo-sm">
                            {initials}
                          </div>
                          <div>
                            <h3 className="font-mono font-bold text-sm text-slate-100">{m.full_name}</h3>
                            <p className="text-xs font-mono text-slate-400 line-clamp-1">{m.tagline || "Oyster Kode Club Talent"}</p>
                          </div>
                        </div>

                        {m.skills && m.skills.length > 0 && (
                          <div className="flex flex-wrap gap-1.5 pt-1">
                            {m.skills.slice(0, 4).map((sk) => (
                              <span key={sk.name} className="neo-badge text-[10px] text-slate-400 border-slate-800 bg-slate-900/60">
                                {sk.name}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>

                      {/* Contact & Links */}
                      <div className="pt-3 border-t border-slate-800 space-y-2">
                        <div className="flex flex-wrap gap-x-4 gap-y-1 font-mono text-xs text-slate-400">
                          {m.email && <span>✉ {m.email}</span>}
                          {m.phone && <span>✆ {m.phone}</span>}
                        </div>

                        <div className="flex items-center gap-4 pt-1 font-mono text-xs">
                          {m.github && (
                            <a href={m.github} target="_blank" className="flex items-center gap-1.5 text-slate-300 hover:text-amber-400 transition-colors">
                              <GithubIcon /> <span>GitHub</span>
                            </a>
                          )}
                          {m.linkedin && (
                            <a href={m.linkedin} target="_blank" className="flex items-center gap-1.5 text-slate-300 hover:text-amber-400 transition-colors">
                              <LinkedinIcon /> <span>LinkedIn</span>
                            </a>
                          )}
                          {m.portfolio_url && (
                            <a href={m.portfolio_url} target="_blank" className="flex items-center gap-1.5 text-slate-300 hover:text-amber-400 transition-colors">
                              <Globe size={13} /> <span>Portfolio</span>
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
            <div className="neo-card rounded-xl p-10 text-center font-mono text-sm text-slate-400 border border-slate-800">
              [ NO TALENT PROFILES SELECTED IN THIS PITCH PRESENTATION ]
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default function PitchesPage() {
  return (
    <Suspense fallback={
      <div className="font-mono text-sm text-amber-400 py-10 text-center">
        [ INITIALIZING PITCH SERVICES... ]
      </div>
    }>
      <PitchViewerContent />
    </Suspense>
  );
}
