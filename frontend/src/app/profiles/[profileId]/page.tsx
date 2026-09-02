"use client";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { api } from "@/lib/api";
import { useAuth } from "@/context/AuthContext";
import { Download, ArrowLeft, Globe, ArrowUpRight, Mail, MapPin, GraduationCap, CheckCircle, Eye, Edit3 } from "lucide-react";
import { GithubIcon, LinkedinIcon, LinkedInVerifiedBadge } from "@/components/ui/Icons";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Spinner } from "@/components/ui/Spinner";
import { APPLE_COLORS, APPLE_RADII, APPLE_SHADOW } from "@/lib/theme";

interface ContactInfo {
  phone?: string;
  linkedin?: string;
  github?: string;
  portfolio_url?: string;
}

interface Skill {
  skill_id: string;
  name: string;
  category: string;
  level: string;
}

interface Project {
  project_id: string;
  title: string;
  description?: string;
  github_link?: string;
  tech_stack?: string;
  demo_link?: string;
}

interface ProfileData {
  profile_id: string;
  user_id?: string;
  full_name: string;
  profile_image?: string;
  email?: string;
  phone?: string;
  college?: string;
  tagline?: string;
  bio?: string;
  availability?: string;
  department?: string;
  location?: string;
  yr_of_graduation?: number;
  role_category?: string;
  completion_percentage: number;
  contact?: ContactInfo;
  skills?: Skill[];
  projects?: Project[];
  achievements?: string[];
  certifications?: string[];
}

const MOCK_PROFILES_DETAIL: Record<string, ProfileData> = {
  "demo-1": {
    profile_id: "demo-1",
    full_name: "Alex Mercer",
    email: "alex.mercer@oysterkode.club",
    college: "Oyster Institute of Technology",
    tagline: "Senior UX Engineer & Generative Artist",
    bio: "Bridging the gap between aesthetic form and systematic function. With a background in both classical graphic design and modern front-end architecture, I specialize in building digital experiences that feel intuitive and look spectacular. My recent work focuses on integrating subtle, performant WebGL interactions into standard DOM flows to elevate the perceived value of standard web products.\n\nCurrently exploring the intersection of generative AI and user interface design to create adaptive, highly personalized structural layouts for editorial platforms.",
    availability: "Available",
    department: "Core Team",
    role_category: "Core Team",
    location: "San Francisco, CA",
    yr_of_graduation: 2026,
    completion_percentage: 95,
    contact: {
      phone: "+1 (555) 234-5678",
      linkedin: "https://linkedin.com",
      github: "https://github.com",
      portfolio_url: "https://alexmercer.design",
    },
    skills: [
      { skill_id: "s1", name: "Creative Coding", category: "Design", level: "Expert" },
      { skill_id: "s2", name: "Interaction Design", category: "Design", level: "Expert" },
      { skill_id: "s3", name: "Design Systems", category: "Engineering", level: "Expert" },
      { skill_id: "s4", name: "Three.js", category: "Graphics", level: "Expert" },
      { skill_id: "s5", name: "React Architecture", category: "Engineering", level: "Expert" },
      { skill_id: "s6", name: "Typography", category: "Design", level: "Expert" },
    ],
    achievements: [
      "Winner of National Interaction Design Showcase 2025",
      "Created design system adopted across 12 open-source web products",
      "Speaker at Web Creative Standards Summit",
    ],
    certifications: [
      "Advanced WebGL & Shader Computation",
      "Professional HCI & Systems Ergonomics",
    ],
    projects: [
      {
        project_id: "p1",
        title: "Aura Editorial Platform",
        description: "A headless CMS frontend with fluid typography and dynamic theming.",
        tech_stack: "Next.js, Tailwind, GraphQL",
        demo_link: "https://aura-editorial.dev",
        github_link: "https://github.com",
      },
      {
        project_id: "p2",
        title: "Fluid Morph WebGL",
        description: "An experimental shader library for subtle, performant background animations.",
        tech_stack: "Three.js, GLSL, Vite",
        github_link: "https://github.com",
      },
    ],
  },
  "demo-2": {
    profile_id: "demo-2",
    full_name: "Samira Jones",
    email: "samira.j@oysterkode.club",
    college: "School of Engineering Studies",
    tagline: "AI / Machine Learning Researcher",
    bio: "Focused on deep learning models, neural architecture search, and scalable inference backends. Active research collaborator in multi-modal LLM reasoning pipelines.",
    availability: "Open to work",
    department: "Technical Team",
    role_category: "Technical Team",
    location: "Boston, MA",
    yr_of_graduation: 2025,
    completion_percentage: 90,
    contact: {
      linkedin: "https://linkedin.com",
      github: "https://github.com",
    },
    skills: [
      { skill_id: "s7", name: "PyTorch", category: "ML", level: "Expert" },
      { skill_id: "s8", name: "Python", category: "Languages", level: "Expert" },
      { skill_id: "s9", name: "CUDA", category: "Systems", level: "Intermediate" },
      { skill_id: "s10", name: "Transformers", category: "ML", level: "Expert" },
    ],
    projects: [
      {
        project_id: "p3",
        title: "Neural Vision Compiler",
        description: "High throughput inference acceleration toolkit for quantized vision models.",
        tech_stack: "PyTorch, C++, TensorRT",
        github_link: "https://github.com",
      },
    ],
  },
};

export default function ProfileDetailPage() {
  const { profileId } = useParams<{ profileId: string }>();
  const router = useRouter();
  const { user, profileId: authProfileId } = useAuth();
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api/v1";

  const isOwnProfile = Boolean(
    profile && (
      profile.profile_id === authProfileId || 
      (typeof window !== "undefined" && profile.profile_id === localStorage.getItem("pk_profile_id")) ||
      (user && profile.user_id === user.user_id)
    )
  );

  useEffect(() => {
    if (!profileId) return;
    if (profileId.startsWith("demo-")) {
      const demoData = MOCK_PROFILES_DETAIL[profileId] || MOCK_PROFILES_DETAIL["demo-1"];
      setProfile(demoData);
      setIsLoading(false);
    } else {
      api.profile
        .getProfile(profileId)
        .then((res) => {
          if (res.ok && res.data) {
            setProfile(res.data as ProfileData);
          } else {
            setError(res.message || "Failed to load profile");
          }
        })
        .catch(() => setError("Backend connection error"))
        .finally(() => setIsLoading(false));
    }
  }, [profileId]);

  if (isLoading) {
    return (
      <div style={{ minHeight: "60vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <Spinner size={32} />
      </div>
    );
  }

  if (error || !profile) {
    return (
      <div style={{ minHeight: "60vh", display: "flex", alignItems: "center", justifyContent: "center", padding: "24px" }}>
        <div
          style={{
            backgroundColor: "#ffffff",
            borderRadius: APPLE_RADII.lg,
            border: `1px solid ${APPLE_COLORS.hairline}`,
            padding: "40px",
            textAlign: "center",
            maxWidth: "420px",
            width: "100%",
          }}
        >
          <h2 style={{ fontSize: "20px", fontWeight: 600, color: APPLE_COLORS.ink, marginBottom: "8px" }}>
            Profile Not Found
          </h2>
          <p style={{ fontSize: "14px", color: APPLE_COLORS.inkMuted48, marginBottom: "24px" }}>
            {error || "The requested talent showcase is unavailable."}
          </p>
          <Button variant="primary" size="small" onClick={() => router.push("/directory")}>
            Back to Directory
          </Button>
        </div>
      </div>
    );
  }

  const initials = profile.full_name
    ? profile.full_name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
    : "?";

  return (
    <div style={{ display: "flex", flexDirection: "column", width: "100%", margin: 0, padding: 0 }}>
      {/* ── SECTION 1: Profile Hero Card ── */}
      <section
        style={{
          backgroundColor: "#ffffff",
          padding: "56px 24px 64px",
          borderBottom: `1px solid ${APPLE_COLORS.hairline}`,
          width: "100%",
        }}
      >
        <div style={{ maxWidth: "1024px", margin: "0 auto" }}>
          {/* Own Profile Preview Banner */}
          {isOwnProfile && (
            <div
              style={{
                backgroundColor: "rgba(0, 102, 204, 0.05)",
                border: `1px solid rgba(0, 102, 204, 0.2)`,
                borderRadius: APPLE_RADII.md,
                padding: "12px 18px",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                gap: "12px",
                marginBottom: "24px",
                flexWrap: "wrap",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <CheckCircle size={16} color={APPLE_COLORS.primary} />
                <span style={{ fontSize: "13px", color: APPLE_COLORS.ink, fontWeight: 500 }}>
                  This is your public showcase preview as seen by recruiters and visitors.
                </span>
              </div>
              <Button
                as={Link}
                href="/portfolio"
                variant="primary"
                size="small"
                leftGlyph={<Edit3 size={13} />}
              >
                Edit Portfolio
              </Button>
            </div>
          )}

          {/* Back link */}
          <div style={{ marginBottom: "28px" }}>
            <Link
              href="/directory"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "6px",
                fontSize: "14px",
                color: APPLE_COLORS.primary,
                textDecoration: "none",
                fontWeight: 500,
              }}
            >
              <ArrowLeft size={14} />
              <span>Back to Directory</span>
            </Link>
          </div>

          {/* Hero Grid: Portrait + Info */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
              gap: "48px",
              alignItems: "center",
            }}
          >
            {/* Left: Candidate Card (Reference Image Styled) */}
            <div style={{ display: "flex", justifyContent: "center" }}>
              <div
                style={{
                  width: "100%",
                  maxWidth: "340px",
                  borderRadius: "28px",
                  backgroundColor: "#ffffff",
                  border: "6px solid #ffffff",
                  boxShadow: "0 20px 48px rgba(0, 0, 0, 0.1)",
                  overflow: "hidden",
                  position: "relative",
                  display: "flex",
                  flexDirection: "column",
                }}
              >
                {/* Image / Visual Container */}
                <div
                  style={{
                    position: "relative",
                    width: "100%",
                    height: "360px",
                    backgroundColor: "#e8ecef",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    overflow: "hidden",
                  }}
                >
                  {profile.profile_image ? (
                    <img
                      src={profile.profile_image}
                      alt={profile.full_name}
                      style={{ width: "100%", height: "100%", objectFit: "cover" }}
                    />
                  ) : (
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        gap: "8px",
                        color: APPLE_COLORS.inkMuted80,
                      }}
                    >
                      <span style={{ fontSize: "64px", fontWeight: 700, letterSpacing: "-0.03em" }}>
                        {initials}
                      </span>
                      <span
                        style={{
                          fontSize: "11px",
                          fontWeight: 600,
                          textTransform: "uppercase",
                          letterSpacing: "0.08em",
                          color: APPLE_COLORS.primary,
                        }}
                      >
                        VERIFIED TALENT
                      </span>
                    </div>
                  )}
                </div>

                {/* Bottom Card Detail Panel (Matching Reference Image) */}
                <div
                  style={{
                    padding: "20px 22px 24px",
                    backgroundColor: "#ffffff",
                    display: "flex",
                    flexDirection: "column",
                    gap: "8px",
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                    <h2
                      style={{
                        fontSize: "22px",
                        fontWeight: 700,
                        color: "#1d1d1f",
                        margin: 0,
                        letterSpacing: "-0.3px",
                      }}
                    >
                      {profile.full_name}
                    </h2>
                    <LinkedInVerifiedBadge size={22} />
                  </div>

                  <p
                    style={{
                      fontSize: "14px",
                      color: "#6e6e73",
                      margin: 0,
                      lineHeight: 1.45,
                    }}
                  >
                    {profile.tagline || profile.bio?.slice(0, 90) || "Verified Oyster Kode Club Talent"}
                  </p>
                </div>
              </div>
            </div>

            {/* Right: Candidate Details & Resume CTAs */}
            <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
              <div>
                <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "8px" }}>
                  <h1
                    className="apple-display-lg"
                    style={{ color: APPLE_COLORS.ink, margin: 0, fontSize: "clamp(28px, 4vw, 40px)" }}
                  >
                    {profile.full_name}
                  </h1>
                  <LinkedInVerifiedBadge size={26} />
                </div>

                <p
                  style={{
                    fontSize: "20px",
                    fontWeight: 400,
                    color: APPLE_COLORS.inkMuted80,
                    margin: 0,
                    letterSpacing: "-0.2px",
                  }}
                >
                  {profile.tagline || "Senior Engineer & Technology Leader"}
                </p>
              </div>

              {/* Action Buttons: View Resume & Download Resume */}
              <div style={{ display: "flex", flexWrap: "wrap", gap: "12px", alignItems: "center" }}>
                {isOwnProfile && (
                  <Button
                    as={Link}
                    href="/portfolio"
                    variant="primary"
                    size="default"
                    leftGlyph={<Edit3 size={16} />}
                  >
                    Edit Portfolio
                  </Button>
                )}

                <Button
                  as="a"
                  href={
                    profile.profile_id.startsWith("demo-")
                      ? "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf"
                      : `${BASE}/profiles/${profile.profile_id}/resume`
                  }
                  target="_blank"
                  rel="noreferrer"
                  variant={isOwnProfile ? "secondary" : "primary"}
                  size="default"
                  leftGlyph={<Eye size={16} />}
                >
                  View Resume
                </Button>

                <Button
                  as="a"
                  href={
                    profile.profile_id.startsWith("demo-")
                      ? "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf"
                      : `${BASE}/profiles/${profile.profile_id}/resume?download=true`
                  }
                  target="_blank"
                  rel="noreferrer"
                  variant="secondary"
                  size="default"
                  leftGlyph={<Download size={16} />}
                >
                  Download Resume
                </Button>
              </div>

              {/* Candidate Metadata */}
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
                  gap: "12px",
                  paddingTop: "16px",
                  borderTop: `1px solid ${APPLE_COLORS.hairline}`,
                  fontSize: "13px",
                  color: APPLE_COLORS.inkMuted48,
                }}
              >
                {profile.email && (
                  <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                    <Mail size={14} color={APPLE_COLORS.primary} />
                    <span>{profile.email}</span>
                  </div>
                )}
                {profile.location && (
                  <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                    <MapPin size={14} color={APPLE_COLORS.primary} />
                    <span>{profile.location}</span>
                  </div>
                )}
                {profile.college && (
                  <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                    <GraduationCap size={14} color={APPLE_COLORS.primary} />
                    <span>{profile.college}</span>
                  </div>
                )}
              </div>

              {/* Social / Portfolio Links */}
              <div style={{ display: "flex", gap: "10px", paddingTop: "4px" }}>
                {profile.contact?.github && (
                  <Button as="a" href={profile.contact.github} target="_blank" variant="default" size="xsmall" leftGlyph={<GithubIcon />}>
                    GitHub
                  </Button>
                )}
                {profile.contact?.linkedin && (
                  <Button as="a" href={profile.contact.linkedin} target="_blank" variant="default" size="xsmall" leftGlyph={<LinkedinIcon />}>
                    LinkedIn
                  </Button>
                )}
                {profile.contact?.portfolio_url && (
                  <Button as="a" href={profile.contact.portfolio_url} target="_blank" variant="default" size="xsmall" leftGlyph={<Globe size={13} />}>
                    Website
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── SECTION 2: Biography & Core Disciplines (2 columns) (Screenshot 2 Reference) ── */}
      <section
        style={{
          backgroundColor: APPLE_COLORS.canvasParchment,
          padding: "72px 24px",
          borderBottom: `1px solid ${APPLE_COLORS.hairline}`,
          width: "100%",
        }}
      >
        <div
          style={{
            maxWidth: "1024px",
            margin: "0 auto",
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
            gap: "56px",
            alignItems: "start",
          }}
        >
          {/* Left Column: Biography */}
          <div>
            <h2
              className="apple-display-md"
              style={{ color: APPLE_COLORS.ink, marginBottom: "20px", fontSize: "28px" }}
            >
              Biography
            </h2>
            <div
              style={{
                fontSize: "16px",
                lineHeight: 1.65,
                color: APPLE_COLORS.inkMuted80,
                display: "flex",
                flexDirection: "column",
                gap: "16px",
                whiteSpace: "pre-line",
              }}
            >
              {profile.bio || "No biography provided for this profile yet."}
            </div>
          </div>

          {/* Right Column: Core Disciplines */}
          <div>
            <h2
              className="apple-display-md"
              style={{ color: APPLE_COLORS.ink, marginBottom: "20px", fontSize: "28px" }}
            >
              Core Disciplines
            </h2>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "10px" }}>
              {profile.skills && profile.skills.length > 0 ? (
                profile.skills.map((sk) => (
                  <span
                    key={sk.name}
                    style={{
                      padding: "8px 16px",
                      borderRadius: APPLE_RADII.pill,
                      backgroundColor: "#ffffff",
                      border: `1px solid ${APPLE_COLORS.hairline}`,
                      color: APPLE_COLORS.ink,
                      fontSize: "14px",
                      fontWeight: 500,
                      letterSpacing: "-0.1px",
                      boxShadow: "0 1px 4px rgba(0, 0, 0, 0.02)",
                    }}
                  >
                    {sk.name}
                  </span>
                ))
              ) : (
                <p style={{ fontSize: "14px", color: APPLE_COLORS.inkMuted48 }}>No disciplines linked.</p>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* ── SECTION 3: Selected Works / Projects (Screenshot 2 Reference) ── */}
      <section
        style={{
          backgroundColor: "#ffffff",
          padding: "72px 24px",
          width: "100%",
        }}
      >
        <div style={{ maxWidth: "1024px", margin: "0 auto" }}>
          <div style={{ marginBottom: "36px" }}>
            <h2
              className="apple-display-md"
              style={{ color: APPLE_COLORS.ink, margin: "0 0 6px", fontSize: "28px" }}
            >
              Selected Works
            </h2>
            <p style={{ fontSize: "15px", color: APPLE_COLORS.inkMuted48, margin: 0 }}>
              Curated engineering projects and production systems
            </p>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
              gap: "28px",
            }}
          >
            {profile.projects && profile.projects.length > 0 ? (
              profile.projects.map((proj) => (
                <div
                  key={proj.project_id}
                  style={{
                    backgroundColor: APPLE_COLORS.canvasParchment,
                    borderRadius: APPLE_RADII.lg,
                    border: `1px solid ${APPLE_COLORS.hairline}`,
                    overflow: "hidden",
                    display: "flex",
                    flexDirection: "column",
                  }}
                >
                  {/* Visual Preview Frame */}
                  <div
                    style={{
                      height: "180px",
                      width: "100%",
                      backgroundColor: "#ffffff",
                      borderBottom: `1px solid ${APPLE_COLORS.hairline}`,
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      justifyContent: "center",
                      padding: "20px",
                    }}
                  >
                    <span style={{ fontSize: "16px", fontWeight: 600, color: APPLE_COLORS.inkMuted80 }}>
                      {proj.title}
                    </span>
                    <span style={{ fontSize: "12px", color: APPLE_COLORS.inkMuted48, marginTop: "4px" }}>
                      {proj.tech_stack || "Full Stack Application"}
                    </span>
                  </div>

                  {/* Project Details */}
                  <div style={{ padding: "24px", display: "flex", flexDirection: "column", justifyContent: "space-between", flex: 1 }}>
                    <div>
                      <h3 style={{ fontSize: "17px", fontWeight: 600, color: APPLE_COLORS.ink, margin: "0 0 8px" }}>
                        {proj.title}
                      </h3>
                      <p style={{ fontSize: "14px", color: APPLE_COLORS.inkMuted48, lineHeight: 1.5, margin: 0 }}>
                        {proj.description || "Production engineering project repository."}
                      </p>
                    </div>

                    <div style={{ display: "flex", gap: "16px", marginTop: "24px" }}>
                      {proj.demo_link && (
                        <a
                          href={proj.demo_link}
                          target="_blank"
                          rel="noreferrer"
                          style={{
                            display: "inline-flex",
                            alignItems: "center",
                            gap: "4px",
                            fontSize: "13px",
                            color: APPLE_COLORS.primary,
                            fontWeight: 500,
                            textDecoration: "none",
                          }}
                        >
                          <span>View Pitch</span>
                          <ArrowUpRight size={14} />
                        </a>
                      )}
                      {proj.github_link && (
                        <a
                          href={proj.github_link}
                          target="_blank"
                          rel="noreferrer"
                          style={{
                            display: "inline-flex",
                            alignItems: "center",
                            gap: "4px",
                            fontSize: "13px",
                            color: APPLE_COLORS.primary,
                            fontWeight: 500,
                            textDecoration: "none",
                          }}
                        >
                          <span>GitHub Repository</span>
                          <span>&lt;/&gt;</span>
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <p style={{ fontSize: "14px", color: APPLE_COLORS.inkMuted48 }}>
                No projects showcased yet.
              </p>
            )}
          </div>
        </div>
      </section>

      {/* ── PARCHMENT FOOTER (appledesign.md specification) ── */}
      <footer
        style={{
          backgroundColor: APPLE_COLORS.canvasParchment,
          padding: "56px 24px 40px",
          borderTop: `1px solid ${APPLE_COLORS.hairline}`,
          width: "100%",
        }}
      >
        <div style={{ maxWidth: "1024px", margin: "0 auto" }}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              flexWrap: "wrap",
              gap: "20px",
              fontSize: "12px",
              color: APPLE_COLORS.inkMuted48,
            }}
          >
            <div style={{ display: "flex", gap: "20px", flexWrap: "wrap" }}>
              <Link href="#" style={{ color: "inherit", textDecoration: "none" }}>Terms of Service</Link>
              <Link href="#" style={{ color: "inherit", textDecoration: "none" }}>Privacy Policy</Link>
              <Link href="#" style={{ color: "inherit", textDecoration: "none" }}>Contact Support</Link>
              <Link href="#" style={{ color: "inherit", textDecoration: "none" }}>Member Guidelines</Link>
            </div>
            <div>
              © {new Date().getFullYear()} Oyster Kode Club. All rights reserved.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
