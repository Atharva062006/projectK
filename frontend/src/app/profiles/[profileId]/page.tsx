"use client";
import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { api } from "@/lib/api";
import { useAuth } from "@/context/AuthContext";
import { ArrowLeft, Globe, ArrowUpRight, Mail, MapPin, GraduationCap, CheckCircle, FileText, Edit3 } from "lucide-react";
import { GithubIcon, LinkedinIcon, LinkedInVerifiedBadge } from "@/components/ui/Icons";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Spinner } from "@/components/ui/Spinner";
import { ResumeViewerModal } from "@/components/ui/ResumeViewerModal";
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
  const [resumeModalOpen, setResumeModalOpen] = useState(false);
  const [bioExpanded, setBioExpanded] = useState(false);
  const [skillsExpanded, setSkillsExpanded] = useState(false);
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

  // Bio truncation — 100 words visible, then "Read more"
  const BIO_WORD_LIMIT = 100;
  const bioWords = profile.bio ? profile.bio.split(/\s+/) : [];
  const isBioLong = bioWords.length > BIO_WORD_LIMIT;
  const bioDisplayText = isBioLong && !bioExpanded
    ? bioWords.slice(0, BIO_WORD_LIMIT).join(" ") + "\u2026"
    : (profile.bio ?? "");

  // Skills overflow — show 10, then +N expand
  const SKILLS_LIMIT = 10;
  const allSkills = profile.skills ?? [];
  const visibleSkills = skillsExpanded ? allSkills : allSkills.slice(0, SKILLS_LIMIT);
  const skillsOverflow = allSkills.length - SKILLS_LIMIT;

  // Shared inline-link style for bio / skills controls
  const readMoreStyle: React.CSSProperties = {
    background: "none",
    border: "none",
    padding: 0,
    cursor: "pointer",
    fontSize: "14px",
    fontWeight: 500,
    color: APPLE_COLORS.primary,
    marginLeft: "4px",
    display: "inline",
    letterSpacing: "-0.1px",
  };

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

              {/* Action Buttons */}
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
                  variant={isOwnProfile ? "secondary" : "primary"}
                  size="default"
                  leftGlyph={<FileText size={16} />}
                  onClick={() => setResumeModalOpen(true)}
                >
                  Resume
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

      {/* ── UNIFIED CONTENT SECTION: About · Skills · Projects ─────────────────
           To revert: git checkout a8daa7a -- frontend/src/app/profiles/\[profileId\]/page.tsx
      ── */}
      <section
        style={{
          backgroundColor: APPLE_COLORS.canvasParchment,
          padding: "48px 24px 56px",
          width: "100%",
        }}
      >
        <div
          style={{
            maxWidth: "1024px",
            margin: "0 auto",
            display: "flex",
            flexDirection: "column",
            gap: "32px",
          }}
        >

          {/* ── About ── */}
          <div style={{ maxWidth: "680px" }}>
            <h2
              style={{
                fontSize: "20px",
                fontWeight: 600,
                color: APPLE_COLORS.ink,
                margin: "0 0 12px",
                letterSpacing: "-0.28px",
              }}
            >
              About
            </h2>
            {profile.bio ? (
              <p
                style={{
                  fontSize: "16px",
                  lineHeight: 1.65,
                  color: APPLE_COLORS.inkMuted80,
                  margin: 0,
                  whiteSpace: "pre-line",
                }}
              >
                {bioDisplayText}
                {isBioLong && (
                  <button type="button" onClick={() => setBioExpanded(!bioExpanded)} style={readMoreStyle}>
                    {bioExpanded ? "Read less" : "Read more"}
                  </button>
                )}
              </p>
            ) : (
              <p style={{ fontSize: "14px", color: APPLE_COLORS.inkMuted48, margin: 0 }}>
                No summary provided yet.
              </p>
            )}
          </div>

          {/* ── Skills ── */}
          {allSkills.length > 0 && (
            <div>
              <span
                style={{
                  fontSize: "11px",
                  fontWeight: 600,
                  color: APPLE_COLORS.inkMuted48,
                  textTransform: "uppercase",
                  letterSpacing: "0.08em",
                  display: "block",
                  marginBottom: "10px",
                }}
              >
                Skills
              </span>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "8px", alignItems: "center" }}>
                {visibleSkills.map((sk) => (
                  <span
                    key={sk.skill_id}
                    style={{
                      padding: "7px 15px",
                      borderRadius: APPLE_RADII.pill,
                      backgroundColor: APPLE_COLORS.canvas,
                      border: `1px solid ${APPLE_COLORS.hairline}`,
                      color: APPLE_COLORS.ink,
                      fontSize: "13px",
                      fontWeight: 500,
                      letterSpacing: "-0.1px",
                    }}
                  >
                    {sk.name}
                  </span>
                ))}
                {!skillsExpanded && skillsOverflow > 0 && (
                  <button
                    type="button"
                    onClick={() => setSkillsExpanded(true)}
                    style={{
                      padding: "7px 15px",
                      borderRadius: APPLE_RADII.pill,
                      backgroundColor: "transparent",
                      border: `1px solid ${APPLE_COLORS.primary}`,
                      color: APPLE_COLORS.primary,
                      fontSize: "13px",
                      fontWeight: 500,
                      cursor: "pointer",
                      letterSpacing: "-0.1px",
                    }}
                  >
                    +{skillsOverflow} more
                  </button>
                )}
                {skillsExpanded && skillsOverflow > 0 && (
                  <button
                    type="button"
                    onClick={() => setSkillsExpanded(false)}
                    style={readMoreStyle}
                  >
                    Show less
                  </button>
                )}
              </div>
            </div>
          )}

          {/* ── Achievements ── */}
          {profile.achievements && profile.achievements.length > 0 && (
            <div>
              <span
                style={{
                  fontSize: "11px",
                  fontWeight: 600,
                  color: APPLE_COLORS.inkMuted48,
                  textTransform: "uppercase",
                  letterSpacing: "0.08em",
                  display: "block",
                  marginBottom: "10px",
                }}
              >
                Achievements
              </span>
              <ul style={{ margin: 0, padding: "0 0 0 16px", display: "flex", flexDirection: "column", gap: "6px" }}>
                {profile.achievements.map((a, i) => (
                  <li key={i} style={{ fontSize: "14px", color: APPLE_COLORS.inkMuted80, lineHeight: 1.55 }}>
                    {a}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* ── Certifications ── */}
          {profile.certifications && profile.certifications.length > 0 && (
            <div>
              <span
                style={{
                  fontSize: "11px",
                  fontWeight: 600,
                  color: APPLE_COLORS.inkMuted48,
                  textTransform: "uppercase",
                  letterSpacing: "0.08em",
                  display: "block",
                  marginBottom: "10px",
                }}
              >
                Certifications
              </span>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
                {profile.certifications.map((c, i) => (
                  <span
                    key={i}
                    style={{
                      padding: "6px 14px",
                      borderRadius: APPLE_RADII.pill,
                      backgroundColor: APPLE_COLORS.canvas,
                      border: `1px solid ${APPLE_COLORS.hairline}`,
                      color: APPLE_COLORS.inkMuted80,
                      fontSize: "13px",
                      fontWeight: 400,
                      letterSpacing: "-0.1px",
                    }}
                  >
                    {c}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* ── Hairline divider ── */}
          <div style={{ height: "1px", backgroundColor: APPLE_COLORS.hairline }} />

          {/* ── Selected Works ── */}
          <div>
            <div
              style={{
                display: "flex",
                alignItems: "baseline",
                justifyContent: "space-between",
                marginBottom: "20px",
              }}
            >
              <h2
                style={{
                  fontSize: "20px",
                  fontWeight: 600,
                  color: APPLE_COLORS.ink,
                  margin: 0,
                  letterSpacing: "-0.28px",
                }}
              >
                Selected Works
              </h2>
              {profile.projects && profile.projects.length > 0 && (
                <span style={{ fontSize: "13px", color: APPLE_COLORS.inkMuted48 }}>
                  {profile.projects.length} {profile.projects.length === 1 ? "project" : "projects"}
                </span>
              )}
            </div>

            {profile.projects && profile.projects.length > 0 ? (
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fill, minmax(280px, 340px))",
                  gap: "16px",
                }}
              >
                {profile.projects.map((proj) => (
                  <div
                    key={proj.project_id}
                    style={{
                      backgroundColor: APPLE_COLORS.canvas,
                      borderRadius: APPLE_RADII.lg,
                      borderTop: `1px solid ${APPLE_COLORS.hairline}`,
                      borderRight: `1px solid ${APPLE_COLORS.hairline}`,
                      borderBottom: `1px solid ${APPLE_COLORS.hairline}`,
                      borderLeft: `4px solid ${APPLE_COLORS.primary}`,
                      padding: "20px 22px",
                      display: "flex",
                      flexDirection: "column",
                      gap: "10px",
                    }}
                  >
                    {/* Title */}
                    <h3
                      style={{
                        fontSize: "15px",
                        fontWeight: 600,
                        color: APPLE_COLORS.ink,
                        margin: 0,
                        letterSpacing: "-0.2px",
                      }}
                    >
                      {proj.title}
                    </h3>

                    {/* Tech stack pills */}
                    {proj.tech_stack && (
                      <div style={{ display: "flex", flexWrap: "wrap", gap: "5px" }}>
                        {proj.tech_stack
                          .split(",")
                          .map((t) => t.trim())
                          .filter(Boolean)
                          .map((tech) => (
                            <span
                              key={tech}
                              style={{
                                padding: "3px 9px",
                                borderRadius: APPLE_RADII.pill,
                                backgroundColor: APPLE_COLORS.canvasParchment,
                                border: `1px solid ${APPLE_COLORS.hairline}`,
                                fontSize: "11px",
                                fontWeight: 500,
                                color: APPLE_COLORS.inkMuted48,
                                letterSpacing: "-0.08px",
                              }}
                            >
                              {tech}
                            </span>
                          ))}
                      </div>
                    )}

                    {/* Description */}
                    <p
                      style={{
                        fontSize: "13px",
                        color: APPLE_COLORS.inkMuted48,
                        lineHeight: 1.55,
                        margin: 0,
                        flex: 1,
                      }}
                    >
                      {proj.description || "Production engineering project repository."}
                    </p>

                    {/* Links */}
                    {(proj.demo_link || proj.github_link) && (
                      <div
                        style={{
                          display: "flex",
                          gap: "16px",
                          paddingTop: "10px",
                          borderTop: `1px solid ${APPLE_COLORS.hairline}`,
                        }}
                      >
                        {proj.demo_link && (
                          <a
                            href={proj.demo_link}
                            target="_blank"
                            rel="noreferrer"
                            style={{
                              display: "inline-flex",
                              alignItems: "center",
                              gap: "3px",
                              fontSize: "13px",
                              color: APPLE_COLORS.primary,
                              fontWeight: 500,
                              textDecoration: "none",
                              letterSpacing: "-0.1px",
                            }}
                          >
                            <span>View Pitch</span>
                            <ArrowUpRight size={13} />
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
                              gap: "3px",
                              fontSize: "13px",
                              color: APPLE_COLORS.primary,
                              fontWeight: 500,
                              textDecoration: "none",
                              letterSpacing: "-0.1px",
                            }}
                          >
                            <span>GitHub</span>
                            <span style={{ fontSize: "11px", opacity: 0.7 }}>&lt;/&gt;</span>
                          </a>
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>
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

      {/* ── Resume Viewer Modal ── */}
      <ResumeViewerModal
        open={resumeModalOpen}
        onClose={() => setResumeModalOpen(false)}
        pdfUrl={
          profile.profile_id.startsWith("demo-")
            ? "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf"
            : `${BASE}/profiles/${profile.profile_id}/resume`
        }
        downloadUrl={
          profile.profile_id.startsWith("demo-")
            ? "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf"
            : `${BASE}/profiles/${profile.profile_id}/resume?download=true`
        }
        candidateName={profile.full_name}
      />
    </div>
  );
}
