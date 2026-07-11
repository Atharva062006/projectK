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
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" strokeLinecap="round" strokeLinejoin="round" />
    <rect x="2" y="9" width="4" height="12" />
    <circle cx="4" cy="4" r="2" />
  </svg>
);

interface PitchMember {
  profile_id: string; 
  full_name: string; 
  tagline?: string; 
  department?: string;
  availability?: string; 
  role_category?: string; 
  email?: string;
  phone?: string; 
  linkedin?: string; 
  github?: string; 
  portfolio_url?: string;
  skills?: { name: string; level: string }[];
}

interface Pitch {
  pitch_id: string; 
  title: string; 
  description?: string; 
  is_active: boolean;
  created_at: string; 
  members?: PitchMember[];
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
    setLoading(true);
    setResult(null);
    try {
      const res = await api.pitches.get(id.trim());
      setResult(res);
      if (res.ok) {
        setPitch(res.data as Pitch);
      } else {
        setPitch(null);
      }
    } catch {
      setResult({ ok: false, message: "Connection to pitch services failed" });
      setPitch(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const id = searchParams.get("id");
    if (id) {
      setPitchId(id);
      loadPitch(id);
    }
  }, [searchParams]);

  const handleSubmitLookup = (e: React.FormEvent) => {
    e.preventDefault();
    if (pitchId.trim()) {
      router.push(`/pitches?id=${pitchId.trim()}`);
    }
  };

  const handleDeactivate = async () => {
    if (!pitch) return;
    setResult(null);
    const res = await api.pitches.deactivate(pitch.pitch_id);
    setResult(res);
    if (res.ok) {
      setPitch({ ...pitch, is_active: false });
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Header Lookup */}
      <div className="bg-[#0e1017] border border-gray-800 rounded-2xl p-6 space-y-4">
        <div className="flex items-center gap-2 border-b border-gray-800 pb-3">
          <Search size={14} className="text-blue-400" />
          <h2 className="text-xs font-mono font-bold tracking-wider uppercase text-gray-400">Load Curated Pitch</h2>
        </div>

        <form onSubmit={handleSubmitLookup} className="flex gap-2">
          <input 
            type="text"
            placeholder="Enter Pitch Access Token (UUID)..."
            value={pitchId}
            onChange={(e) => setPitchId(e.target.value)}
            className="flex-1 bg-[#11131c] border border-gray-800 rounded-lg px-3 py-2 text-xs text-gray-200 placeholder-gray-500 font-mono focus:border-gray-700 outline-none"
            required
          />
          <button 
            type="submit" 
            disabled={loading}
            className="bg-blue-700 hover:bg-blue-600 text-white font-mono text-xs font-semibold px-4 py-2 rounded-lg transition-colors cursor-pointer"
          >
            {loading ? "Loading..." : "Load Pitch"}
          </button>
        </form>
      </div>

      <ResponseBox result={result} />

      {/* Pitch Display */}
      {pitch && (
        <div className="space-y-6">
          
          {/* Pitch Info Header */}
          <div className="bg-[#0e1017] border border-gray-800 rounded-2xl p-6 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
              <div className="space-y-2">
                <h1 className="text-xl font-bold text-white font-mono">{pitch.title}</h1>
                <p className="text-xs text-gray-400 font-mono leading-relaxed">{pitch.description || "No curation summary provided."}</p>
                
                <div className="flex items-center gap-3 text-[10px] font-mono text-gray-500 pt-2">
                  <span className={`flex items-center gap-1.5 px-2.5 py-0.5 rounded-full border ${
                    pitch.is_active 
                      ? "bg-green-950/60 text-green-300 border-green-900" 
                      : "bg-red-950/60 text-red-300 border-red-900"
                  }`}>
                    <Radio size={10} className={pitch.is_active ? "animate-pulse" : ""} />
                    <span>{pitch.is_active ? "Active Link" : "Link Expired"}</span>
                  </span>
                  
                  <span className="flex items-center gap-1">
                    <Calendar size={10} />
                    <span>Created: {new Date(pitch.created_at).toLocaleDateString()}</span>
                  </span>
                </div>
              </div>

              {user?.role === "admin" && pitch.is_active && (
                <button
                  onClick={handleDeactivate}
                  className="bg-red-950 text-red-400 border border-red-900 hover:bg-red-900 hover:text-white px-3 py-1.5 rounded-lg text-xs font-mono transition-colors cursor-pointer self-start sm:self-center"
                >
                  Deactivate Pitch
                </button>
              )}
            </div>
          </div>

          {/* Members Showcase */}
          {pitch.members && pitch.members.length > 0 ? (
            <div className="space-y-4">
              <h2 className="text-xs font-mono font-bold tracking-wider uppercase text-gray-400 border-b border-gray-850 pb-2">Selected Candidates ({pitch.members.length})</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {pitch.members.map((m) => {
                  const initials = m.full_name ? m.full_name.split(" ").map(n => n[0]).join("").toUpperCase() : "?";
                  return (
                    <div key={m.profile_id} className="bg-[#0e1017] border border-gray-800 rounded-2xl p-5 flex flex-col justify-between h-[250px]">
                      
                      {/* Top Header Card Info */}
                      <div className="space-y-3">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600/30 to-indigo-950 border border-blue-500/20 flex items-center justify-center text-xs font-mono font-bold text-blue-300">
                            {initials}
                          </div>
                          <div>
                            <h3 className="font-semibold text-xs text-white font-mono">{m.full_name}</h3>
                            <p className="text-[10px] text-gray-500 font-mono mt-0.5 line-clamp-1">{m.tagline || "Oyster Kode Club Talent"}</p>
                          </div>
                        </div>

                        {/* Skills */}
                        {m.skills && m.skills.length > 0 && (
                          <div className="flex flex-wrap gap-1 pt-1">
                            {m.skills.slice(0, 4).map((sk) => (
                              <span 
                                key={sk.name} 
                                className="text-[9px] font-mono bg-[#141620] text-gray-300 px-2 py-0.5 rounded border border-gray-850"
                              >
                                {sk.name}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>

                      {/* Contact Details & Links */}
                      <div className="border-t border-gray-850 pt-3 space-y-2 mt-3">
                        <div className="flex flex-wrap gap-x-3 gap-y-1.5 text-[10px] font-mono text-gray-400">
                          {m.email && <div className="flex items-center gap-1"><span className="text-gray-500">Email:</span> <span className="text-gray-300">{m.email}</span></div>}
                          {m.phone && <div className="flex items-center gap-1"><span className="text-gray-500">Phone:</span> <span className="text-gray-300">{m.phone}</span></div>}
                        </div>

                        <div className="flex items-center justify-between pt-1">
                          <div className="flex items-center gap-2">
                            {m.github && (
                              <a href={m.github} target="_blank" className="text-[10px] font-mono text-blue-400 hover:underline flex items-center gap-0.5">
                                <GithubIcon />
                                <span>GitHub</span>
                              </a>
                            )}
                            {m.linkedin && (
                              <a href={m.linkedin} target="_blank" className="text-[10px] font-mono text-blue-400 hover:underline flex items-center gap-0.5">
                                <LinkedinIcon />
                                <span>LinkedIn</span>
                              </a>
                            )}
                            {m.portfolio_url && (
                              <a href={m.portfolio_url} target="_blank" className="text-[10px] font-mono text-purple-400 hover:underline flex items-center gap-0.5">
                                <Globe size={10} />
                                <span>Portfolio</span>
                              </a>
                            )}
                          </div>
                        </div>
                      </div>

                    </div>
                  );
                })}
              </div>
            </div>
          ) : (
            <div className="bg-[#0e1017] border border-gray-800 rounded-2xl p-8 text-center text-xs font-mono text-gray-500">
              No profiles are selected inside this pitch presentation.
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default function PitchesPage() {
  return (
    <Suspense fallback={<div className="text-xs font-mono text-gray-500 py-6">Initializing pitch viewer...</div>}>
      <PitchViewerContent />
    </Suspense>
  );
}
