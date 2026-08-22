"use client";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { api } from "@/lib/api";
import { useTheme } from "@/context/ThemeContext";

import Card from "@leafygreen-ui/card";
import Badge from "@leafygreen-ui/badge";
import Button from "@/components/OKCButton";
import { Chip } from "@leafygreen-ui/chip";
import { H1, H2, H3, Body, Overline, Label } from "@leafygreen-ui/typography";
import Icon from "@leafygreen-ui/icon";
import { Spinner } from "@leafygreen-ui/loading-indicator";
import { Banner } from "@leafygreen-ui/banner";
import { palette } from "@leafygreen-ui/palette";
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

interface ContactInfo { phone?: string; linkedin?: string; github?: string; portfolio_url?: string; }
interface Skill { skill_id: string; name: string; category: string; level: string; }
interface Project { project_id: string; title: string; description?: string; github_link?: string; tech_stack?: string; demo_link?: string; }
interface ProfileData {
  profile_id: string; full_name: string; email?: string; phone?: string; college?: string;
  tagline?: string; bio?: string; availability?: string; department?: string;
  location?: string; yr_of_graduation?: number; role_category?: string;
  completion_percentage: number; contact?: ContactInfo;
  skills?: Skill[]; projects?: Project[];
  achievements?: string[]; certifications?: string[];
}

// ── Demo data (unchanged from original) ───────────────────────────────────
const MOCK_PROFILES_DETAIL: Record<string, ProfileData> = {
  "demo-1": { profile_id: "demo-1", full_name: "Atharva Kulkarni", email: "atharva@oysterkode.club", college: "Oyster Institute of Technology", tagline: "Full Stack Engineer & AI Enthusiast", bio: "Passionate software engineer specializing in building high-performance web applications and embedding machine learning models. Active open-source contributor and technical team lead at Oyster Kode Club.", availability: "Available", department: "Core Team", role_category: "Core Team", location: "Mumbai, India", yr_of_graduation: 2026, completion_percentage: 95, contact: { phone: "+91 98765 43210", linkedin: "https://linkedin.com/in/atharva", github: "https://github.com/atharva", portfolio_url: "https://atharvak.dev" }, skills: [{ skill_id: "s1", name: "TypeScript", category: "Languages", level: "Expert" }, { skill_id: "s2", name: "Next.js", category: "Frameworks", level: "Expert" }, { skill_id: "s3", name: "Python", category: "Languages", level: "Expert" }, { skill_id: "s4", name: "PostgreSQL", category: "Databases", level: "Intermediate" }], achievements: ["Winner of National Hackathon 2025 (First Prize out of 500+ teams)", "Built and deployed Oyster Club Portal serving 1000+ active members", "Contributed 20+ PRs to major open-source web frameworks"], certifications: ["AWS Certified Solutions Architect (Associate)", "Deep Learning Specialization by DeepLearning.AI"], projects: [{ project_id: "p1", title: "Distributed Task Scheduler", description: "A high-performance cluster job queue built with Go and gRPC, capable of scheduling 10k jobs per second.", tech_stack: "Go, gRPC, Redis, Docker", github_link: "https://github.com/atharva/scheduler" }, { project_id: "p2", title: "Bento Portfolio Portal", description: "A visual portfolio workspace designed with a modular bento grid layout to showcase member capabilities.", tech_stack: "React, Next.js, Tailwind CSS", github_link: "https://github.com/atharva/bento-portal" }] },
  "demo-2": { profile_id: "demo-2", full_name: "Sneha Sharma", email: "sneha.s@oysterkode.club", college: "School of Design Studies", tagline: "UI/UX Designer & Frontend Developer", bio: "Focusing on crafting gorgeous, modern, and user-centric interfaces. Bridge the gap between engineering complexity and intuitive interaction designs.", availability: "Open to work", department: "Technical Team", role_category: "Technical Team", location: "Bangalore, India", yr_of_graduation: 2025, completion_percentage: 90, contact: { linkedin: "https://linkedin.com/in/sneha", github: "https://github.com/sneha", portfolio_url: "https://sneha.design" }, skills: [{ skill_id: "s5", name: "Figma", category: "Design", level: "Expert" }, { skill_id: "s6", name: "React.js", category: "Frameworks", level: "Expert" }, { skill_id: "s7", name: "Tailwind CSS", category: "Libraries", level: "Expert" }], achievements: ["Designed the official club brand guide and logo framework", "Honorable Mention at Global Interaction Design Awards 2025"], certifications: ["Google UX Design Professional Certificate"], projects: [{ project_id: "p3", title: "Oyster Design System", description: "A comprehensive UI kit built on Tailwind for rapid frontend prototyping.", tech_stack: "Figma, React, Tailwind", github_link: "https://github.com/sneha/oyster-ds" }] },
  "demo-3": { profile_id: "demo-3", full_name: "Vikram Malhotra", email: "vikram@oysterkode.club", college: "Tech State College", tagline: "DevOps & Cloud Architect", bio: "Cloud enthusiast and system orchestrator. Built robust CI/CD deployment setups for several open source projects.", availability: "Busy", department: "Technical Team", role_category: "Technical Team", location: "Pune, India", yr_of_graduation: 2026, completion_percentage: 85, contact: { linkedin: "https://linkedin.com/in/vikram", github: "https://github.com/vikram" }, skills: [{ skill_id: "s8", name: "Docker", category: "DevOps & Cloud", level: "Expert" }, { skill_id: "s9", name: "Kubernetes", category: "DevOps & Cloud", level: "Intermediate" }, { skill_id: "s10", name: "Amazon Web Services (AWS)", category: "DevOps & Cloud", level: "Expert" }], achievements: ["Designed high-availability infrastructure serving 5k daily active users", "Reduced cloud costs by 35% using Kubernetes auto-scaling"], projects: [{ project_id: "p4", title: "K8s Auto-scaler Tool", description: "Custom auto-scaling daemon for cluster nodes metrics.", tech_stack: "Go, Kubernetes API, Prometheus", github_link: "https://github.com/vikram/autoscaler" }] },
};

function availabilityBadgeVariant(av?: string): "green" | "yellow" | "red" | "lightgray" {
  if (av === "Available") return "green";
  if (av === "Busy") return "red";
  if (av === "Open to work") return "yellow";
  return "lightgray";
}

// Shared section separator
function SectionDivider({ darkMode }: { darkMode: boolean }) {
  return (
    <div
      style={{
        borderTop: `1px solid ${darkMode ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.08)"}`,
        margin: "8px 0",
      }}
    />
  );
}

export default function ProfileDetailPage() {
  const { profileId } = useParams<{ profileId: string }>();
  const router = useRouter();
  const { darkMode } = useTheme();
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api/v1";

  const textColor = darkMode ? palette.white : palette.black;
  const mutedColor = darkMode ? palette.gray.light1 : palette.gray.dark1;

  useEffect(() => {
    if (!profileId) return;
    if (profileId.startsWith("demo-")) {
      const demoData = MOCK_PROFILES_DETAIL[profileId];
      setProfile(demoData || { profile_id: profileId, full_name: "Club Member", tagline: "Engineering Showcase Profile", availability: "Available", completion_percentage: 75 });
      setIsLoading(false);
    } else {
      api.profile.getProfile(profileId)
        .then((res) => { if (res.ok && res.data) setProfile(res.data as ProfileData); else setError(res.message || "Failed to load profile"); })
        .catch(() => setError("Backend connection error"))
        .finally(() => setIsLoading(false));
    }
  }, [profileId]);

  if (isLoading) {
    return (
      <div style={{ minHeight: "60vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <Spinner darkMode={darkMode} />
      </div>
    );
  }

  if (error || !profile) {
    return (
      <div style={{ minHeight: "60vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
        {/* Single Card for error state — isolated distinct surface */}
        <Card data-okc-theme="true" darkMode={darkMode} style={{ padding: "40px", textAlign: "center", maxWidth: "380px", width: "100%" }}>
          <Banner darkMode={darkMode} variant="danger" style={{ marginBottom: "20px" }}>
            {error || "Profile not found"}
          </Banner>
          <Button
            darkMode={darkMode}
            variant="default"
            leftGlyph={<Icon glyph="ArrowLeft" />}
            onClick={() => router.push("/directory")}
          >
            Back to Directory
          </Button>
        </Card>
      </div>
    );
  }

  const initials = profile.full_name
    ? profile.full_name.split(" ").map((n) => n[0]).join("").toUpperCase()
    : "?";

  return (
    <div className="anim-fadeInUp" style={{ display: "flex", flexDirection: "column", gap: "0", paddingBottom: "48px", maxWidth: "860px", margin: "0 auto" }}>

      {/* ── Top nav bar ── */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "36px" }}>
        <Button
          darkMode={darkMode}
          variant="default"
          size="small"
          leftGlyph={<Icon glyph="ArrowLeft" />}
          onClick={() => router.push("/directory")}
        >
          Directory
        </Button>
      </div>

      {/* ── HEADER — avatar + name + tagline + meta, no Card ── */}
      <div style={{ display: "flex", alignItems: "flex-start", gap: "24px", marginBottom: "32px" }}>
        {/* Avatar circle */}
        <div
          style={{
            width: "80px", height: "80px", borderRadius: "20px", flexShrink: 0,
            background: SURFACE.elevated,
            border: `1px solid ${BRAND.primaryBorder}`,
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: "24px", fontWeight: 700, color: BRAND.primary,
          }}
        >
          {initials}
        </div>

        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: "flex", alignItems: "center", gap: "12px", flexWrap: "wrap", marginBottom: "6px" }}>
            <H1 darkMode={darkMode} style={{ fontSize: "26px", margin: 0 }}>{profile.full_name}</H1>
            <Badge darkMode={darkMode} variant={availabilityBadgeVariant(profile.availability)}>
              {profile.availability || "Offline"}
            </Badge>
            {profile.role_category && (
              <Badge darkMode={darkMode} variant="lightgray">{profile.role_category}</Badge>
            )}
          </div>
          <Body darkMode={darkMode} style={{ color: mutedColor, marginBottom: "12px", fontSize: "15px" }}>
            {profile.tagline || "Oyster Kode Club Active Member"}
          </Body>

          {/* Meta row */}
          <div style={{ display: "flex", flexWrap: "wrap", gap: "16px" }}>
            {profile.email && (
              <div style={{ display: "flex", alignItems: "center", gap: "5px" }}>
                <Icon glyph="Envelope" fill={BRAND.primary} size={12} />
                <Body darkMode={darkMode} style={{ fontSize: "12px", color: mutedColor }}>{profile.email}</Body>
              </div>
            )}
            {(profile.contact?.phone || profile.phone) && (
              <div style={{ display: "flex", alignItems: "center", gap: "5px" }}>
                <Icon glyph="Phone" fill={BRAND.primary} size={12} />
                <Body darkMode={darkMode} style={{ fontSize: "12px", color: mutedColor }}>{profile.contact?.phone || profile.phone}</Body>
              </div>
            )}
            {profile.college && (
              <div style={{ display: "flex", alignItems: "center", gap: "5px" }}>
                <Icon glyph="University" fill={BRAND.primary} size={12} />
                <Body darkMode={darkMode} style={{ fontSize: "12px", color: mutedColor }}>{profile.college}</Body>
              </div>
            )}
            {profile.location && (
              <div style={{ display: "flex", alignItems: "center", gap: "5px" }}>
                <Icon glyph="Map" fill={BRAND.primary} size={12} />
                <Body darkMode={darkMode} style={{ fontSize: "12px", color: mutedColor }}>{profile.location}</Body>
              </div>
            )}
            {profile.yr_of_graduation && (
              <div style={{ display: "flex", alignItems: "center", gap: "5px" }}>
                <Icon glyph="GraduationCap" fill={BRAND.primary} size={12} />
                <Body darkMode={darkMode} style={{ fontSize: "12px", color: mutedColor }}>Class of {profile.yr_of_graduation}</Body>
              </div>
            )}
          </div>

          {/* Social buttons */}
          <div style={{ display: "flex", gap: "8px", marginTop: "14px" }}>
            {profile.contact?.github && (
              <Button as="a" href={profile.contact.github} target="_blank" darkMode={darkMode} variant="default" size="xsmall" leftGlyph={<GithubIcon />}>GitHub</Button>
            )}
            {profile.contact?.linkedin && (
              <Button as="a" href={profile.contact.linkedin} target="_blank" darkMode={darkMode} variant="default" size="xsmall" leftGlyph={<LinkedinIcon />}>LinkedIn</Button>
            )}
            {profile.contact?.portfolio_url && (
              <Button as="a" href={profile.contact.portfolio_url} target="_blank" darkMode={darkMode} variant="default" size="xsmall" leftGlyph={<Icon glyph="Globe" />}>Portfolio</Button>
            )}
          </div>
        </div>
      </div>

      <SectionDivider darkMode={darkMode} />

      {/* ── ABOUT — plain section, no Card ── */}
      <div style={{ padding: "28px 0" }}>
        <Overline darkMode={darkMode} style={{ display: "block", marginBottom: "12px" }}>About</Overline>
        <Body darkMode={darkMode} style={{ color: mutedColor, lineHeight: "1.75", fontSize: "14px" }}>
          {profile.bio || "No biography added yet."}
        </Body>
      </div>

      <SectionDivider darkMode={darkMode} />

      {/* ── SKILLS — plain section, no Card ── */}
      <div style={{ padding: "28px 0" }}>
        <Overline darkMode={darkMode} style={{ display: "block", marginBottom: "12px" }}>Skills</Overline>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
          {profile.skills && profile.skills.length > 0 ? (
            profile.skills.map((sk) => (
              <Chip key={sk.name} darkMode={darkMode} label={`${sk.name} · ${sk.level}`} variant="green" />
            ))
          ) : (
            <Body darkMode={darkMode} style={{ color: mutedColor }}>No skills associated yet.</Body>
          )}
        </div>
      </div>

      <SectionDivider darkMode={darkMode} />

      {/* ── PROJECTS — section label + individual Cards (distinct content objects) ── */}
      <div style={{ padding: "28px 0" }}>
        <Overline darkMode={darkMode} style={{ display: "block", marginBottom: "16px" }}>Projects</Overline>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "12px" }}>
          {profile.projects && profile.projects.length > 0 ? (
            profile.projects.map((proj) => (
              <Card data-okc-theme="true"
                key={proj.project_id}
                darkMode={darkMode}
                style={{ padding: "16px", display: "flex", flexDirection: "column", gap: "12px" }}
              >
                <div>
                  <H3 darkMode={darkMode} style={{ fontSize: "14px", marginBottom: "6px" }}>{proj.title}</H3>
                  <Body darkMode={darkMode} style={{ fontSize: "12px", color: mutedColor, lineHeight: "1.6", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
                    {proj.description}
                  </Body>
                </div>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", paddingTop: "8px", borderTop: `1px solid ${SURFACE.border}` }}>
                  <Body darkMode={darkMode} style={{ fontSize: "10px", color: mutedColor }}>{proj.tech_stack}</Body>
                  <div style={{ display: "flex", gap: "8px" }}>
                    {proj.github_link && (
                      <Button as="a" href={proj.github_link} target="_blank" darkMode={darkMode} variant="default" size="xsmall" leftGlyph={<GithubIcon />}>GitHub</Button>
                    )}
                    {proj.demo_link && (
                      <Button as="a" href={proj.demo_link} target="_blank" darkMode={darkMode} variant="primary" size="xsmall">Demo</Button>
                    )}
                  </div>
                </div>
              </Card>
            ))
          ) : (
            <Body darkMode={darkMode} style={{ color: mutedColor, padding: "32px 0" }}>
              No projects showcased yet.
            </Body>
          )}
        </div>
      </div>

      <SectionDivider darkMode={darkMode} />

      {/* ── ACHIEVEMENTS — plain section, no Card ── */}
      {profile.achievements && profile.achievements.length > 0 && (
        <>
          <div style={{ padding: "28px 0" }}>
            <Overline darkMode={darkMode} style={{ display: "block", marginBottom: "12px" }}>Achievements</Overline>
            <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: "10px" }}>
              {profile.achievements.map((ach, i) => (
                <li key={i} style={{ borderLeft: `2px solid ${BRAND.primaryBorder}`, paddingLeft: "12px" }}>
                  <Body darkMode={darkMode} style={{ fontSize: "13px", color: mutedColor, lineHeight: "1.6" }}>{ach}</Body>
                </li>
              ))}
            </ul>
          </div>
          <SectionDivider darkMode={darkMode} />
        </>
      )}

      {/* ── CERTIFICATIONS — plain section, no Card ── */}
      {profile.certifications && profile.certifications.length > 0 && (
        <>
          <div style={{ padding: "28px 0" }}>
            <Overline darkMode={darkMode} style={{ display: "block", marginBottom: "12px" }}>Certifications</Overline>
            <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: "10px" }}>
              {profile.certifications.map((cert, i) => (
                <li key={i} style={{ borderLeft: `2px solid rgba(1,107,248,0.4)`, paddingLeft: "12px" }}>
                  <Body darkMode={darkMode} style={{ fontSize: "13px", color: mutedColor, lineHeight: "1.6" }}>{cert}</Body>
                </li>
              ))}
            </ul>
          </div>
          <SectionDivider darkMode={darkMode} />
        </>
      )}

      {/* ── Profile Quality strip — inline, no Card ── */}
      <div style={{ padding: "20px 0", display: "flex", alignItems: "center", gap: "16px" }}>
        <Label htmlFor="completion-bar" darkMode={darkMode} style={{ color: mutedColor, flexShrink: 0 }}>Profile Quality</Label>
        <div style={{ flex: 1, height: "6px", borderRadius: "99px", background: SURFACE.border, overflow: "hidden" }}>
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${profile.completion_percentage}%` }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            style={{ height: "100%", borderRadius: "99px", background: BRAND.gradient }}
          />
        </div>
        <H2 darkMode={darkMode} style={{ color: BRAND.primary, margin: 0, fontSize: "18px" }}>{profile.completion_percentage}%</H2>
      </div>

      <SectionDivider darkMode={darkMode} />

      {/* ── RESUME CTA — ONE Card for this distinct action ── */}
      <Card data-okc-theme="true"
        darkMode={darkMode}
        style={{ padding: "24px", marginTop: "12px", display: "flex", alignItems: "center", justifyContent: "space-between", gap: "16px", flexWrap: "wrap" }}
      >
        <div>
          <Overline darkMode={darkMode}>Curriculum Vitae</Overline>
          <Body darkMode={darkMode} style={{ color: mutedColor, marginTop: "4px", fontSize: "13px" }}>
            Download the verified resume for this member profile.
          </Body>
        </div>
        <Button
          as="a"
          href={profile.profile_id.startsWith("demo-") ? "#" : `${BASE}/profiles/${profile.profile_id}/resume`}
          target="_blank"
          darkMode={darkMode}
          variant="primary"
          leftGlyph={<Icon glyph="Download" />}
          onClick={() => profile.profile_id.startsWith("demo-") && alert("Demo resume download logged!")}
        >
          Download Resume
        </Button>
      </Card>
    </div>
  );
}
