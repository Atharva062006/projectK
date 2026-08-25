"use client";
import { useEffect, useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { api } from "@/lib/api";
import { useAuth } from "@/context/AuthContext";
import ResponseBox from "@/components/ResponseBox";
import { Search, Calendar, Globe, Mail, Phone, ArrowLeft, CheckCircle } from "lucide-react";
import { GithubIcon, LinkedinIcon } from "@/components/ui/Icons";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Badge } from "@/components/ui/Badge";
import { Spinner } from "@/components/ui/Spinner";
import { APPLE_COLORS, APPLE_RADII } from "@/lib/theme";

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
      setPitch(res.ok ? (res.data as Pitch) : null);
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
    <div style={{ maxWidth: "1024px", margin: "0 auto", padding: "40px 24px 80px" }}>
      {/* ── Lookup Card ── */}
      <div
        style={{
          backgroundColor: "#ffffff",
          borderRadius: APPLE_RADII.lg,
          border: `1px solid ${APPLE_COLORS.hairline}`,
          padding: "28px",
          marginBottom: "28px",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "16px" }}>
          <Search size={16} color={APPLE_COLORS.primary} />
          <h2 style={{ fontSize: "16px", fontWeight: 600, color: APPLE_COLORS.ink, margin: 0 }}>
            Load Curated Pitch Deck
          </h2>
        </div>

        <form onSubmit={handleSubmitLookup} style={{ display: "flex", gap: "12px", alignItems: "flex-end" }}>
          <div style={{ flex: 1 }}>
            <Input
              label="Pitch Access Token (UUID)"
              placeholder="Enter Pitch ID..."
              value={pitchId}
              onChange={(e) => setPitchId(e.target.value)}
              required
            />
          </div>
          <Button type="submit" variant="primary" size="default" isLoading={loading}>
            Load Pitch
          </Button>
        </form>
      </div>

      <ResponseBox result={result} />

      {/* ── Pitch Showcase ── */}
      {pitch && (
        <div style={{ display: "flex", flexDirection: "column", gap: "24px", marginTop: "24px" }}>
          {/* Header Card */}
          <div
            style={{
              backgroundColor: "#ffffff",
              borderRadius: APPLE_RADII.lg,
              border: `1px solid ${APPLE_COLORS.hairline}`,
              padding: "32px",
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "16px", flexWrap: "wrap", marginBottom: "12px" }}>
              <div>
                <h1 className="apple-display-md" style={{ fontSize: "26px", margin: "0 0 8px" }}>
                  {pitch.title}
                </h1>
                <p style={{ fontSize: "15px", color: APPLE_COLORS.inkMuted80, margin: 0, lineHeight: 1.5 }}>
                  {pitch.description || "No summary provided."}
                </p>
              </div>

              {user?.role === "admin" && pitch.is_active && (
                <Button variant="dangerOutline" size="small" onClick={handleDeactivate}>
                  Deactivate Pitch
                </Button>
              )}
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: "14px", paddingTop: "16px", borderTop: `1px solid ${APPLE_COLORS.hairline}` }}>
              <Badge variant={pitch.is_active ? "green" : "red"}>
                {pitch.is_active ? "Active Deck" : "Link Expired"}
              </Badge>
              <div style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "12px", color: APPLE_COLORS.inkMuted48 }}>
                <Calendar size={13} />
                <span>Created {new Date(pitch.created_at).toLocaleDateString()}</span>
              </div>
            </div>
          </div>

          {/* Members List */}
          {pitch.members && pitch.members.length > 0 ? (
            <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              <span style={{ fontSize: "13px", fontWeight: 600, color: APPLE_COLORS.inkMuted80, textTransform: "uppercase", letterSpacing: "0.04em" }}>
                Curated Candidates ({pitch.members.length})
              </span>

              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "20px" }}>
                {pitch.members.map((m) => {
                  const initials = m.full_name ? m.full_name.split(" ").map((n) => n[0]).join("").toUpperCase() : "?";
                  return (
                    <div
                      key={m.profile_id}
                      style={{
                        backgroundColor: "#ffffff",
                        borderRadius: APPLE_RADII.lg,
                        border: `1px solid ${APPLE_COLORS.hairline}`,
                        padding: "24px",
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "space-between",
                        gap: "16px",
                      }}
                    >
                      <div>
                        <div style={{ display: "flex", alignItems: "center", gap: "14px", marginBottom: "12px" }}>
                          <div
                            style={{
                              width: "48px",
                              height: "48px",
                              borderRadius: "50%",
                              backgroundColor: "#f5f5f7",
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
                              {m.full_name}
                            </h3>
                            <p style={{ fontSize: "13px", color: APPLE_COLORS.inkMuted48, margin: 0 }}>
                              {m.tagline || "Engineering Member"}
                            </p>
                          </div>
                        </div>

                        {m.skills && m.skills.length > 0 && (
                          <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
                            {m.skills.slice(0, 4).map((sk) => (
                              <Badge key={sk.name} variant="lightgray">
                                {sk.name}
                              </Badge>
                            ))}
                          </div>
                        )}
                      </div>

                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", paddingTop: "14px", borderTop: `1px solid ${APPLE_COLORS.hairline}` }}>
                        <div style={{ display: "flex", gap: "8px" }}>
                          {m.github && (
                            <Button as="a" href={m.github} target="_blank" variant="default" size="xsmall" leftGlyph={<GithubIcon />}>
                              GitHub
                            </Button>
                          )}
                          {m.linkedin && (
                            <Button as="a" href={m.linkedin} target="_blank" variant="default" size="xsmall" leftGlyph={<LinkedinIcon />}>
                              LinkedIn
                            </Button>
                          )}
                        </div>
                        <Button as="a" href={`/profiles/${m.profile_id}`} target="_blank" variant="primary" size="xsmall">
                          View Profile
                        </Button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ) : (
            <div style={{ padding: "48px 24px", textAlign: "center", color: APPLE_COLORS.inkMuted48 }}>
              No candidates assigned to this pitch deck.
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default function PitchesPage() {
  return (
    <Suspense
      fallback={
        <div style={{ minHeight: "50vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <Spinner size={32} />
        </div>
      }
    >
      <PitchViewerContent />
    </Suspense>
  );
}
