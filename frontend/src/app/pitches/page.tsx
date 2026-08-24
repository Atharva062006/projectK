"use client";
import { useEffect, useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { api } from "@/lib/api";
import { useAuth } from "@/context/AuthContext";
import ResponseBox from "@/components/ResponseBox";

import Card from "@leafygreen-ui/card";
import { TextInput } from "@leafygreen-ui/text-input";
import Button from "@/components/OKCButton";
import Badge from "@leafygreen-ui/badge";
import { H1, H2, H3, Body, Overline } from "@leafygreen-ui/typography";
import Icon from "@leafygreen-ui/icon";
import { palette } from "@leafygreen-ui/palette";
import { Spinner } from "@leafygreen-ui/loading-indicator";
import { BRAND, SURFACE, STATUS } from "@/lib/theme";

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
    <div style={{ display: "flex", flexDirection: "column", gap: "24px", paddingBottom: "48px" }}>
      {/* Lookup */}
      <Card data-okc-theme="true" darkMode={true} style={{ padding: "24px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "20px" }}>
          <Icon glyph="Search" fill={palette.gray.light1} size={14} />
          <Overline darkMode={true} style={{ color: palette.gray.light1 }}>Load Curated Pitch</Overline>
        </div>
        <form onSubmit={handleSubmitLookup} style={{ display: "flex", gap: "12px", alignItems: "flex-end" }}>
          <div style={{ flex: 1 }}>
            <TextInput data-okc-theme="true"
              darkMode={true}
              label="Pitch Access Token (UUID)"
              placeholder="Enter Pitch ID..."
              value={pitchId}
              onChange={(e) => setPitchId(e.target.value)}
              required
            />
          </div>
          <Button type="submit" darkMode={true} variant="primary" disabled={loading} style={{ height: "36px" }}>
            {loading ? "Loading..." : "Load Pitch"}
          </Button>
        </form>
      </Card>

      <ResponseBox result={result} />

      {/* Pitch Display */}
      {pitch && (
        <div className="anim-fadeInUp" style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
          {/* Pitch Header */}
          <Card data-okc-theme="true" darkMode={true} style={{ padding: "32px", position: "relative", overflow: "hidden" }}>
            {/* Background glow based on active state */}
            <div style={{ position: "absolute", inset: 0, backgroundColor: pitch.is_active ? "rgba(0,237,100,0.05)" : "rgba(255,0,0,0.05)", pointerEvents: "none" }} />
            
            <div style={{ display: "flex", flexDirection: "column", gap: "16px", position: "relative", zIndex: 1 }}>
              <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: "16px", flexWrap: "wrap" }}>
                <div>
                  <H1 darkMode={true} style={{ fontSize: "24px", marginBottom: "8px" }}>{pitch.title}</H1>
                  <Body darkMode={true} style={{ color: palette.gray.light1, lineHeight: "1.7" }}>
                    {pitch.description || "No summary provided."}
                  </Body>
                </div>
                {user?.role === "admin" && pitch.is_active && (
                  <Button darkMode={true} variant="danger" size="small" onClick={handleDeactivate}>
                    Deactivate Pitch
                  </Button>
                )}
              </div>

              <div style={{ display: "flex", alignItems: "center", gap: "12px", paddingTop: "16px", borderTop: `1px solid ${SURFACE.border}` }}>
                <Badge darkMode={true} variant={pitch.is_active ? "green" : "red"}>
                  {pitch.is_active ? "Active Link" : "Link Expired"}
                </Badge>
                <div style={{ display: "flex", alignItems: "center", gap: "6px", color: palette.gray.light1 }}>
                  <Icon glyph="Calendar" size={12} />
                  <Body darkMode={true} style={{ fontSize: "12px" }}>Created {new Date(pitch.created_at).toLocaleDateString()}</Body>
                </div>
              </div>
            </div>
          </Card>

          {/* Members */}
          {pitch.members && pitch.members.length > 0 ? (
            <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              <Overline darkMode={true} style={{ display: "block" }}>Selected Candidates ({pitch.members.length})</Overline>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: "16px" }}>
                {pitch.members.map((m) => {
                  const initials = m.full_name ? m.full_name.split(" ").map((n) => n[0]).join("").toUpperCase() : "?";
                  return (
                    <Card data-okc-theme="true" key={m.profile_id} darkMode={true} style={{ padding: "20px", display: "flex", flexDirection: "column", justifyContent: "space-between", gap: "16px" }}>
                      <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                          <div style={{ width: "48px", height: "48px", borderRadius: "12px", background: palette.gray.dark2, border: `1px solid ${palette.gray.dark1}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "14px", fontWeight: 700, color: palette.white, flexShrink: 0 }}>
                            {initials}
                          </div>
                          <div>
                            <H3 darkMode={true} style={{ fontSize: "14px", marginBottom: "2px" }}>{m.full_name}</H3>
                            <Body darkMode={true} style={{ fontSize: "12px", color: palette.gray.light1, display: "-webkit-box", WebkitLineClamp: 1, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
                              {m.tagline || "Oyster Kode Club Talent"}
                            </Body>
                          </div>
                        </div>
                        {m.skills && m.skills.length > 0 && (
                          <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
                            {m.skills.slice(0, 4).map((sk) => (
                              <Badge key={sk.name} darkMode={true} variant="lightgray">{sk.name}</Badge>
                            ))}
                          </div>
                        )}
                      </div>

                      <div style={{ display: "flex", flexDirection: "column", gap: "12px", paddingTop: "12px", borderTop: `1px solid ${SURFACE.border}` }}>
                        <div style={{ display: "flex", flexWrap: "wrap", gap: "12px" }}>
                          {m.email && (
                            <div style={{ display: "flex", alignItems: "center", gap: "4px", color: palette.gray.light1 }}>
                              <Icon glyph="Envelope" size={10} />
                              <Body darkMode={true} style={{ fontSize: "11px" }}>{m.email}</Body>
                            </div>
                          )}
                          {m.phone && (
                            <div style={{ display: "flex", alignItems: "center", gap: "4px", color: palette.gray.light1 }}>
                              <Icon glyph="Phone" size={10} />
                              <Body darkMode={true} style={{ fontSize: "11px" }}>{m.phone}</Body>
                            </div>
                          )}
                        </div>
                        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                          {m.github && <Button as="a" href={m.github} target="_blank" darkMode={true} variant="default" size="xsmall" leftGlyph={<GithubIcon />}>GitHub</Button>}
                          {m.linkedin && <Button as="a" href={m.linkedin} target="_blank" darkMode={true} variant="default" size="xsmall" leftGlyph={<LinkedinIcon />}>LinkedIn</Button>}
                          {m.portfolio_url && <Button as="a" href={m.portfolio_url} target="_blank" darkMode={true} variant="default" size="xsmall" leftGlyph={<Icon glyph="Globe" />}>Portfolio</Button>}
                        </div>
                      </div>
                    </Card>
                  );
                })}
              </div>
            </div>
          ) : (
            <div style={{ padding: "48px 32px", textAlign: "center" }}>
              <Icon glyph="Apps" fill={palette.gray.base} size={28} style={{ display: "block", margin: "0 auto 12px" }} />
              <Body darkMode={true} style={{ color: palette.gray.light1 }}>No profiles selected in this pitch presentation.</Body>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default function PitchesPage() {
  return (
    <Suspense fallback={<div style={{ minHeight: "40vh", display: "flex", alignItems: "center", justifyContent: "center" }}><Spinner /></div>}>
      <PitchViewerContent />
    </Suspense>
  );
}
