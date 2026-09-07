"use client";
import { useEffect, useState, useRef } from "react";
import { motion } from "framer-motion";
import { api } from "@/lib/api";
import { useAuth } from "@/context/AuthContext";
import { User, FileText, Upload, Code, Laptop, Trash2, Save, Plus, ExternalLink, Lock, Eye, Clock, Building2, Compass, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { Select, Option, OptionGroup } from "@/components/ui/Select";
import { Chip } from "@/components/ui/Badge";
import { Spinner } from "@/components/ui/Spinner";
import ResponseBox from "@/components/ResponseBox";
import { APPLE_COLORS, APPLE_RADII } from "@/lib/theme";

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
  full_name: string;
  profile_image?: string;
  tagline?: string;
  bio?: string;
  availability?: string;
  department?: string;
  college?: string;
  location?: string;
  yr_of_graduation?: number;
  role_category?: string;
  completion_percentage: number;
  contact?: {
    phone?: string;
    linkedin?: string;
    github?: string;
    portfolio_url?: string;
  };
  skills?: Skill[];
  projects?: Project[];
  resumes?: { resume_id: string; file_path: string; uploaded_at: string }[];
  analytics?: { views_count: number; downloads_count: number; clicks_count: number };
}

export default function PortfolioPage() {
  const { user, token, profileId, refreshProfileId } = useAuth();
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [allSkills, setAllSkills] = useState<Skill[]>([]);
  const [result, setResult] = useState<{ ok: boolean; message: string; data?: unknown } | null>(null);
  const [loading, setLoading] = useState(false);
  const [avatarLoading, setAvatarLoading] = useState(false);
  const [isDataLoading, setIsDataLoading] = useState(true);
  const [selectedFileName, setSelectedFileName] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const avatarRef = useRef<HTMLInputElement>(null);
  const BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api/v1";

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFileName(file.name);
    }
  };

  const [pf, setPf] = useState({
    full_name: "",
    tagline: "",
    bio: "",
    availability: "",
    department: "",
    college: "",
    location: "",
    yr_of_graduation: "",
  });

  const [contact, setContact] = useState({
    phone: "",
    linkedin: "",
    github: "",
    portfolio_url: "",
  });

  const [newProj, setNewProj] = useState({
    title: "",
    description: "",
    github_link: "",
    tech_stack: "",
    demo_link: "",
  });

  const [selectedSkillId, setSelectedSkillId] = useState("");
  const [selectedSkillLevel, setSelectedSkillLevel] = useState("Intermediate");

  const loadData = async (showFullSpinner = false) => {
    if (showFullSpinner) {
      setIsDataLoading(true);
    }
    try {
      const res = await api.profile.getMe();
      if (res.ok && res.data) {
        const d = res.data as ProfileData;
        setProfile(d);
        setPf({
          full_name: d.full_name || user?.username || "",
          tagline: d.tagline || "",
          bio: d.bio || "",
          availability: d.availability || "Available",
          department: d.department || "",
          college: d.college || "",
          location: d.location || "",
          yr_of_graduation: d.yr_of_graduation ? String(d.yr_of_graduation) : "",
        });
        setContact({
          phone: d.contact?.phone || "",
          linkedin: d.contact?.linkedin || "",
          github: d.contact?.github || "",
          portfolio_url: d.contact?.portfolio_url || "",
        });
      }
      const skillsRes = await api.profile.getSkills();
      if (skillsRes.ok && skillsRes.data) setAllSkills(skillsRes.data as Skill[]);
    } catch (err) {
      console.error("Failed to load portfolio data", err);
    } finally {
      if (showFullSpinner) {
        setIsDataLoading(false);
      }
    }
  };

  useEffect(() => {
    if (token) {
      if (user?.role === "guest" || user?.role === "recruiter") {
        setIsDataLoading(false);
      } else {
        loadData(true);
      }
    }
  }, [token, user?.role]);

  if (!token) {
    return (
      <div style={{ minHeight: "60vh", display: "flex", alignItems: "center", justifyContent: "center", padding: "24px" }}>
        <div
          style={{
            backgroundColor: "#ffffff",
            borderRadius: APPLE_RADII.lg,
            border: `1px solid ${APPLE_COLORS.hairline}`,
            padding: "40px",
            textAlign: "center",
            maxWidth: "400px",
            width: "100%",
          }}
        >
          <div
            style={{
              width: "48px",
              height: "48px",
              borderRadius: "50%",
              backgroundColor: "rgba(0, 102, 204, 0.08)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              margin: "0 auto 16px",
            }}
          >
            <Lock size={20} color={APPLE_COLORS.primary} />
          </div>
          <h2 style={{ fontSize: "18px", fontWeight: 600, color: APPLE_COLORS.ink, marginBottom: "8px" }}>
            Authentication Required
          </h2>
          <p style={{ fontSize: "14px", color: APPLE_COLORS.inkMuted48 }}>
            Please sign in to manage your talent profile and portfolio projects.
          </p>
        </div>
      </div>
    );
  }

  if (isDataLoading) {
    return (
      <div style={{ minHeight: "60vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "16px" }}>
        <Spinner size={32} />
        <p style={{ fontSize: "14px", color: APPLE_COLORS.inkMuted48 }}>Loading your workspace data...</p>
      </div>
    );
  }

  // ── Guest Account Informational View ──
  if (user?.role === "guest") {
    return (
      <div style={{ maxWidth: "800px", margin: "0 auto", padding: "60px 24px 80px" }}>
        <div
          style={{
            backgroundColor: "#ffffff",
            borderRadius: APPLE_RADII.lg,
            border: `1px solid ${APPLE_COLORS.hairline}`,
            padding: "48px 40px",
            textAlign: "center",
          }}
        >
          <div
            style={{
              width: "56px",
              height: "56px",
              borderRadius: "50%",
              backgroundColor: "rgba(0, 102, 204, 0.08)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              margin: "0 auto 20px",
            }}
          >
            <Compass size={28} color={APPLE_COLORS.primary} />
          </div>
          <span
            style={{
              fontSize: "11px",
              fontWeight: 600,
              textTransform: "uppercase",
              letterSpacing: "0.08em",
              color: APPLE_COLORS.primary,
              display: "block",
              marginBottom: "8px",
            }}
          >
            Guest Account
          </span>
          <h1
            className="apple-display-md"
            style={{ fontSize: "28px", fontWeight: 700, color: APPLE_COLORS.ink, marginBottom: "14px" }}
          >
            Welcome to Project K
          </h1>
          <p
            style={{
              fontSize: "15px",
              color: APPLE_COLORS.inkMuted48,
              lineHeight: 1.6,
              maxWidth: "540px",
              margin: "0 auto 32px",
            }}
          >
            You are signed in as a <strong>Guest</strong>. Guest access allows you to explore verified talent profiles, discover engineering projects, and inspect technical skillsets across Oyster Kode Club.
          </p>
          <div
            style={{
              backgroundColor: APPLE_COLORS.canvasParchment,
              borderRadius: APPLE_RADII.md,
              border: `1px solid ${APPLE_COLORS.hairline}`,
              padding: "20px 24px",
              textAlign: "left",
              maxWidth: "540px",
              margin: "0 auto 36px",
            }}
          >
            <div style={{ fontSize: "13px", fontWeight: 600, color: APPLE_COLORS.ink, marginBottom: "8px" }}>
              Your Access Privileges
            </div>
            <ul style={{ margin: 0, paddingLeft: "18px", fontSize: "13px", color: APPLE_COLORS.inkMuted80, lineHeight: 1.6 }}>
              <li>Browse all verified member portfolios and student showcases</li>
              <li>Filter candidates by tech stack, availability, and graduation year</li>
              <li>Inspect member GitHub repositories and live project demos</li>
            </ul>
            <div style={{ fontSize: "12px", color: APPLE_COLORS.inkMuted48, marginTop: "12px" }}>
              Note: Portfolio creation, resume uploads, and directory showcase pages are reserved for active Club Members and Alumni.
            </div>
          </div>
          <div style={{ display: "flex", gap: "14px", justifyContent: "center", flexWrap: "wrap" }}>
            <Button
              as="a"
              href="/directory"
              variant="primary"
              size="default"
              rightGlyph={<ArrowRight size={15} />}
            >
              Explore Talent Directory
            </Button>
            <Button
              as="a"
              href="/about"
              variant="secondary"
              size="default"
            >
              About Oyster Kode Club
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // ── Recruiter Portal View ──
  if (user?.role === "recruiter") {
    return (
      <div style={{ maxWidth: "840px", margin: "0 auto", padding: "60px 24px 80px" }}>
        <div
          style={{
            backgroundColor: "#ffffff",
            borderRadius: APPLE_RADII.lg,
            border: `1px solid ${APPLE_COLORS.hairline}`,
            padding: "48px 40px",
            textAlign: "center",
          }}
        >
          <div
            style={{
              width: "56px",
              height: "56px",
              borderRadius: "50%",
              backgroundColor: "rgba(0, 102, 204, 0.08)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              margin: "0 auto 20px",
            }}
          >
            <Building2 size={28} color={APPLE_COLORS.primary} />
          </div>
          <span
            style={{
              fontSize: "11px",
              fontWeight: 600,
              textTransform: "uppercase",
              letterSpacing: "0.08em",
              color: APPLE_COLORS.primary,
              display: "block",
              marginBottom: "8px",
            }}
          >
            Recruiter Portal
          </span>
          <h1
            className="apple-display-md"
            style={{ fontSize: "28px", fontWeight: 700, color: APPLE_COLORS.ink, marginBottom: "14px" }}
          >
            Talent Discovery Workspace
          </h1>
          <p
            style={{
              fontSize: "15px",
              color: APPLE_COLORS.inkMuted48,
              lineHeight: 1.6,
              maxWidth: "560px",
              margin: "0 auto 32px",
            }}
          >
            Welcome, <strong>{user.username}</strong>. You have verified recruiter access to discover emerging engineering talent, evaluate technical portfolios, and download candidate resumes directly.
          </p>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
              gap: "16px",
              textAlign: "left",
              maxWidth: "680px",
              margin: "0 auto 36px",
            }}
          >
            <div
              style={{
                backgroundColor: APPLE_COLORS.canvasParchment,
                borderRadius: APPLE_RADII.md,
                border: `1px solid ${APPLE_COLORS.hairline}`,
                padding: "18px 20px",
              }}
            >
              <div style={{ fontSize: "14px", fontWeight: 600, color: APPLE_COLORS.ink, marginBottom: "4px" }}>
                Direct Resume Access
              </div>
              <p style={{ fontSize: "12px", color: APPLE_COLORS.inkMuted48, margin: 0, lineHeight: 1.4 }}>
                Download verified candidate PDF resumes directly from any student profile in the directory.
              </p>
            </div>
            <div
              style={{
                backgroundColor: APPLE_COLORS.canvasParchment,
                borderRadius: APPLE_RADII.md,
                border: `1px solid ${APPLE_COLORS.hairline}`,
                padding: "18px 20px",
              }}
            >
              <div style={{ fontSize: "14px", fontWeight: 600, color: APPLE_COLORS.ink, marginBottom: "4px" }}>
                Verified Projects
              </div>
              <p style={{ fontSize: "12px", color: APPLE_COLORS.inkMuted48, margin: 0, lineHeight: 1.4 }}>
                Inspect live demos, GitHub repositories, and full tech stacks evaluated by the club.
              </p>
            </div>
          </div>
          <div style={{ display: "flex", gap: "14px", justifyContent: "center", flexWrap: "wrap" }}>
            <Button
              as="a"
              href="/directory"
              variant="primary"
              size="default"
              rightGlyph={<ArrowRight size={15} />}
            >
              Browse Talent Directory
            </Button>
            <Button
              as="a"
              href="/directory?search=Next.js"
              variant="secondary"
              size="default"
            >
              Filter by Skills
            </Button>
          </div>
        </div>
      </div>
    );
  }

  const handleProfileSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setResult(null);
    const body = {
      ...pf,
      yr_of_graduation: pf.yr_of_graduation ? Number(pf.yr_of_graduation) : null,
      phone: contact.phone,
      linkedin: contact.linkedin,
      github: contact.github,
      portfolio_url: contact.portfolio_url,
    };
    const res = await api.profile.updateMe(body);
    setResult(res);
    if (res.ok) {
      await loadData();
      await refreshProfileId();
    }
    setLoading(false);
  };

  const handleAddSkill = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedSkillId) return;
    const res = await api.profile.addSkill(selectedSkillId, selectedSkillLevel);
    setResult(res);
    if (res.ok) {
      setSelectedSkillId("");
      await loadData();
    }
  };

  const handleRemoveSkill = async (skillId: string) => {
    const res = await api.profile.removeSkill(skillId);
    setResult(res);
    if (res.ok) await loadData();
  };

  const handleAddProject = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProj.title) return;
    const res = await api.profile.addProject(newProj);
    setResult(res);
    if (res.ok) {
      setNewProj({ title: "", description: "", github_link: "", tech_stack: "", demo_link: "" });
      await loadData();
    }
  };

  const handleDeleteProject = async (projectId: string) => {
    const res = await api.profile.deleteProject(projectId);
    setResult(res);
    if (res.ok) await loadData();
  };

  const handleUploadResume = async (e: React.FormEvent) => {
    e.preventDefault();
    const file = fileRef.current?.files?.[0];
    if (!file) {
      setResult({ ok: false, message: "Please select a PDF file first." });
      return;
    }

    if (file.type !== "application/pdf" && !file.name.toLowerCase().endsWith(".pdf")) {
      setResult({ ok: false, message: "Only PDF files (.pdf) are allowed for resume uploads." });
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setResult({ ok: false, message: "Resume file size exceeds the 5MB limit. Please select a smaller PDF." });
      return;
    }

    const fd = new FormData();
    fd.append("resume", file);
    setLoading(true);
    setResult(null);

    try {
      const res = await api.profile.uploadResume(fd);
      setResult(res);
      if (res.ok) {
        if (fileRef.current) fileRef.current.value = "";
        setSelectedFileName(null);
        await loadData(false);
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to upload resume.";
      setResult({ ok: false, message: msg });
    } finally {
      setLoading(false);
    }
  };

  const handleUploadAvatar = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    // Clear value immediately so re-selecting the exact same file fires onChange every time
    e.target.value = "";
    if (!file) return;

    if (!file.type.startsWith("image/") && !/\.(jpg|jpeg|png|webp|gif|svg)$/i.test(file.name)) {
      setResult({ ok: false, message: "Please select a valid image file (JPG, PNG, WEBP, etc.)." });
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setResult({ ok: false, message: "Profile photo exceeds the 5MB limit. Please select a smaller image." });
      return;
    }

    const fd = new FormData();
    fd.append("avatar", file);
    setAvatarLoading(true);
    setResult(null);

    try {
      const res = await api.profile.uploadAvatar(fd);
      setResult(res);
      if (res.ok) {
        await loadData(false);
        await refreshProfileId();
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to upload profile photo.";
      setResult({ ok: false, message: msg });
    } finally {
      setAvatarLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: "1080px", margin: "0 auto", padding: "40px 24px 80px" }}>
      {/* ── Pending Admin Approval Notice ── */}
      {!user?.is_approved && (user?.role === "member" || user?.role === "alumni") && (
        <div
          style={{
            backgroundColor: "rgba(183, 110, 0, 0.06)",
            border: "1px solid rgba(183, 110, 0, 0.22)",
            borderRadius: APPLE_RADII.md,
            padding: "16px 20px",
            marginBottom: "24px",
            display: "flex",
            alignItems: "flex-start",
            gap: "14px",
          }}
        >
          <Clock size={20} color="#b76e00" style={{ marginTop: "2px", flexShrink: 0 }} />
          <div>
            <div style={{ fontSize: "14px", fontWeight: 600, color: "#b76e00", marginBottom: "4px" }}>
              Account Pending Administrator Verification
            </div>
            <div style={{ fontSize: "13px", color: APPLE_COLORS.inkMuted80, lineHeight: 1.5 }}>
              Your account registration is currently awaiting verification by club administrators. Once approved, your showcase will appear in the public Talent Directory. In the meantime, you can complete and update your profile details, engineering projects, skills, and resume below.
            </div>
          </div>
        </div>
      )}

      {/* ── Header ── */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: "16px",
          paddingBottom: "24px",
          borderBottom: `1px solid ${APPLE_COLORS.hairline}`,
          marginBottom: "28px",
        }}
      >
        <div>
          <h1 className="apple-display-md" style={{ fontSize: "28px", margin: "0 0 4px" }}>
            Workspace Dashboard
          </h1>
          <p style={{ fontSize: "14px", color: APPLE_COLORS.inkMuted48, margin: 0 }}>
            Configure your showcase credentials, disciplines, and engineering projects
          </p>
        </div>

        {(profile || profileId) && (
          <div style={{ display: "flex", alignItems: "center", gap: "20px", flexWrap: "wrap" }}>
            <Button
              as="a"
              href={`/profiles/${profile?.profile_id || profileId}`}
              variant="secondary"
              size="small"
              leftGlyph={<ExternalLink size={14} />}
            >
              View Public Showcase
            </Button>
            {profile && (
              <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                <div style={{ textAlign: "right" }}>
                  <span style={{ fontSize: "11px", color: APPLE_COLORS.inkMuted48, textTransform: "uppercase", fontWeight: 600, display: "block" }}>
                    Profile Quality
                  </span>
                  <span style={{ fontSize: "18px", fontWeight: 600, color: APPLE_COLORS.primary }}>
                    {profile.completion_percentage}%
                  </span>
                </div>
                <div style={{ width: "80px", height: "6px", borderRadius: "99px", backgroundColor: APPLE_COLORS.hairline, overflow: "hidden" }}>
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${profile.completion_percentage}%` }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    style={{ height: "100%", backgroundColor: APPLE_COLORS.primary }}
                  />
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      <ResponseBox result={result} />

      {/* ── Main 2-Column Form ── */}
      <div style={{ display: "grid", gridTemplateColumns: "1.8fr 1.2fr", gap: "28px", alignItems: "start", marginTop: "24px" }}>
        {/* Left Column: Core Profile Details */}
        <div
          style={{
            backgroundColor: "#ffffff",
            borderRadius: APPLE_RADII.lg,
            border: `1px solid ${APPLE_COLORS.hairline}`,
            padding: "32px",
          }}
        >
          {/* Profile Photo (Cloudinary Avatar) */}
          <div style={{ display: "flex", alignItems: "center", gap: "20px", marginBottom: "24px", paddingBottom: "24px", borderBottom: `1px solid ${APPLE_COLORS.hairline}` }}>
            <div style={{ position: "relative", width: "72px", height: "72px", borderRadius: "50%", overflow: "hidden", backgroundColor: "rgba(0, 102, 204, 0.08)", border: `2px solid ${APPLE_COLORS.primary}`, flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
              {profile?.profile_image ? (
                <img src={profile.profile_image} alt="Avatar" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
              ) : (
                <User size={32} color={APPLE_COLORS.primary} />
              )}
            </div>
            <div style={{ flex: 1 }}>
              <h3 style={{ fontSize: "14px", fontWeight: 600, color: APPLE_COLORS.ink, margin: "0 0 4px" }}>
                Profile Photo
              </h3>
              <p style={{ fontSize: "12px", color: APPLE_COLORS.inkMuted48, margin: "0 0 4px", lineHeight: 1.4 }}>
                Upload your picture (Cloudinary image storage, max 5MB).
              </p>
              <p style={{ fontSize: "11px", color: APPLE_COLORS.primary, margin: "0 0 10px", lineHeight: 1.4, fontWeight: 500 }}>
                Recommended: 4:5 portrait (min 600×750px, ideally 800×1000px). Face centered in upper 60% for crisp display on member cards &amp; hover animations.
              </p>
              <div style={{ display: "flex", gap: "10px" }}>
                <input
                  ref={avatarRef}
                  type="file"
                  accept="image/*"
                  onChange={handleUploadAvatar}
                  style={{ display: "none" }}
                />
                <Button
                  type="button"
                  variant="secondary"
                  size="small"
                  isLoading={avatarLoading}
                  onClick={() => avatarRef.current?.click()}
                  leftGlyph={<Upload size={14} />}
                >
                  {profile?.profile_image ? "Change Photo" : "Upload Photo"}
                </Button>
              </div>
            </div>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "24px" }}>
            <User size={18} color={APPLE_COLORS.primary} />
            <h2 style={{ fontSize: "18px", fontWeight: 600, color: APPLE_COLORS.ink, margin: 0 }}>
              Personal & Academic Details
            </h2>
          </div>

          <form onSubmit={handleProfileSave} style={{ display: "flex", flexDirection: "column", gap: "18px" }}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "14px" }}>
              <Input label="Full Name" value={pf.full_name} onChange={(e) => setPf({ ...pf, full_name: e.target.value })} required />
              <Input label="Tagline / Role" placeholder="e.g. Full Stack Engineer" value={pf.tagline} onChange={(e) => setPf({ ...pf, tagline: e.target.value })} />
              <Input label="Department" placeholder="e.g. Core Team" value={pf.department} onChange={(e) => setPf({ ...pf, department: e.target.value })} />
              <Input label="Graduation Year" type="number" placeholder="2026" value={pf.yr_of_graduation} onChange={(e) => setPf({ ...pf, yr_of_graduation: e.target.value })} />
              <Input label="College / University" value={pf.college} onChange={(e) => setPf({ ...pf, college: e.target.value })} />
              <Input label="Location" placeholder="e.g. San Francisco, CA" value={pf.location} onChange={(e) => setPf({ ...pf, location: e.target.value })} />
            </div>

            <Textarea label="Biography / Core Focus" placeholder="Brief technical summary and career background..." value={pf.bio} onChange={(e) => setPf({ ...pf, bio: e.target.value })} rows={3} />

            <Select label="Availability Status" value={pf.availability} onChange={(val) => setPf({ ...pf, availability: val })}>
              <Option value="">Select status...</Option>
              <Option value="Available">Available</Option>
              <Option value="Busy">Busy</Option>
              <Option value="Open to work">Open to work</Option>
            </Select>

            {/* Social Connections */}
            <div style={{ paddingTop: "20px", borderTop: `1px solid ${APPLE_COLORS.hairline}`, marginTop: "4px" }}>
              <h3 style={{ fontSize: "14px", fontWeight: 600, color: APPLE_COLORS.ink, marginBottom: "14px" }}>
                Social Connections
              </h3>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "14px" }}>
                <Input label="Phone" placeholder="+1..." value={contact.phone} onChange={(e) => setContact({ ...contact, phone: e.target.value })} />
                <Input label="GitHub URL" placeholder="https://github.com/..." value={contact.github} onChange={(e) => setContact({ ...contact, github: e.target.value })} />
                <Input label="LinkedIn URL" placeholder="https://linkedin.com/in/..." value={contact.linkedin} onChange={(e) => setContact({ ...contact, linkedin: e.target.value })} />
                <Input label="Portfolio Website" placeholder="https://..." value={contact.portfolio_url} onChange={(e) => setContact({ ...contact, portfolio_url: e.target.value })} />
              </div>
            </div>

            <Button type="submit" variant="primary" size="default" isLoading={loading} leftGlyph={<Save size={15} />} style={{ marginTop: "10px" }}>
              Save Profile Details
            </Button>
          </form>
        </div>

        {/* Right Column: Resume & Skills */}
        <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
          {/* Resume Upload */}
          <div
            style={{
              backgroundColor: "#ffffff",
              borderRadius: APPLE_RADII.lg,
              border: `1px solid ${APPLE_COLORS.hairline}`,
              padding: "24px",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "16px" }}>
              <FileText size={18} color={APPLE_COLORS.primary} />
              <h2 style={{ fontSize: "16px", fontWeight: 600, color: APPLE_COLORS.ink, margin: 0 }}>
                Curriculum Vitae (PDF)
              </h2>
            </div>

            {/* Persistent Display of Uploaded Resume or Selected File */}
            {(selectedFileName || (profile?.resumes && profile.resumes.length > 0)) && (
              <div
                style={{
                  backgroundColor: "rgba(0, 102, 204, 0.05)",
                  border: `1px solid rgba(0, 102, 204, 0.2)`,
                  borderRadius: APPLE_RADII.md,
                  padding: "14px 16px",
                  marginBottom: "16px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  gap: "12px",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "10px", overflow: "hidden" }}>
                  <FileText size={20} color={APPLE_COLORS.primary} style={{ flexShrink: 0 }} />
                  <div style={{ overflow: "hidden" }}>
                    <span
                      style={{
                        fontSize: "13px",
                        fontWeight: 600,
                        color: APPLE_COLORS.ink,
                        display: "block",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {selectedFileName || (profile?.resumes && profile.resumes[0]?.file_path?.split("/").pop()) || "Uploaded_CV.pdf"}
                    </span>
                    <span style={{ fontSize: "11px", color: APPLE_COLORS.inkMuted48, display: "block" }}>
                      {selectedFileName
                        ? "Ready to upload"
                        : `Active CV • ${profile?.resumes?.[0]?.uploaded_at ? new Date(profile.resumes[0].uploaded_at).toLocaleDateString() : "Verified"}`}
                    </span>
                  </div>
                </div>

                {profile?.resumes && profile.resumes.length > 0 && !selectedFileName && (
                  <a
                    href={`${BASE}/profiles/${profile.profile_id}/resume`}
                    target="_blank"
                    rel="noreferrer"
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "4px",
                      fontSize: "12px",
                      fontWeight: 600,
                      color: APPLE_COLORS.primary,
                      textDecoration: "none",
                      padding: "4px 8px",
                      borderRadius: "6px",
                      backgroundColor: "#ffffff",
                      border: `1px solid ${APPLE_COLORS.hairline}`,
                      whiteSpace: "nowrap",
                      flexShrink: 0,
                    }}
                  >
                    <Eye size={13} />
                    <span>View</span>
                  </a>
                )}
              </div>
            )}

            <form onSubmit={handleUploadResume} style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              <div
                style={{
                  border: `2px dashed ${APPLE_COLORS.hairline}`,
                  borderRadius: APPLE_RADII.md,
                  padding: "20px 16px",
                  textAlign: "center",
                  backgroundColor: "#fafafc",
                  cursor: "pointer",
                  position: "relative",
                }}
              >
                <input
                  type="file"
                  accept=".pdf"
                  ref={fileRef}
                  onChange={handleFileSelect}
                  style={{ position: "absolute", inset: 0, opacity: 0, cursor: "pointer" }}
                />
                <Upload size={20} color={APPLE_COLORS.inkMuted48} style={{ margin: "0 auto 6px" }} />
                <span style={{ fontSize: "13px", fontWeight: 500, color: APPLE_COLORS.ink, display: "block" }}>
                  {selectedFileName ? "Change Selected PDF File" : "Select PDF Resume"}
                </span>
                <span style={{ fontSize: "11px", color: APPLE_COLORS.inkMuted48 }}>Max file size: 5MB</span>
              </div>
              <Button type="submit" variant="default" size="small" isLoading={loading}>
                {selectedFileName ? "Upload Selected CV" : "Update CV File"}
              </Button>
            </form>
          </div>

          {/* Manage Skills */}
          <div
            style={{
              backgroundColor: "#ffffff",
              borderRadius: APPLE_RADII.lg,
              border: `1px solid ${APPLE_COLORS.hairline}`,
              padding: "24px",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "16px" }}>
              <Code size={18} color={APPLE_COLORS.primary} />
              <h2 style={{ fontSize: "16px", fontWeight: 600, color: APPLE_COLORS.ink, margin: 0 }}>
                Manage Disciplines
              </h2>
            </div>

            <form onSubmit={handleAddSkill} style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
              <Select label="Skill" value={selectedSkillId} onChange={(val) => setSelectedSkillId(val)} placeholder="Select skill...">
                {[...new Set(allSkills.map((s) => s.category))].sort().map((cat) => (
                  <OptionGroup key={cat} label={cat}>
                    {allSkills.filter((s) => s.category === cat).map((s) => (
                      <Option key={s.skill_id} value={s.skill_id}>
                        {s.name}
                      </Option>
                    ))}
                  </OptionGroup>
                ))}
              </Select>

              <Select label="Proficiency Level" value={selectedSkillLevel} onChange={(val) => setSelectedSkillLevel(val)}>
                <Option value="Beginner">Beginner</Option>
                <Option value="Intermediate">Intermediate</Option>
                <Option value="Expert">Expert</Option>
              </Select>

              <Button type="submit" variant="default" size="small" leftGlyph={<Plus size={13} />}>
                Link Skill
              </Button>
            </form>

            <div style={{ paddingTop: "16px", marginTop: "16px", borderTop: `1px solid ${APPLE_COLORS.hairline}` }}>
              <span style={{ fontSize: "12px", color: APPLE_COLORS.inkMuted48, fontWeight: 600, display: "block", marginBottom: "8px" }}>
                Linked Skills ({profile?.skills?.length || 0})
              </span>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
                {profile?.skills && profile.skills.length > 0 ? (
                  profile.skills.map((s) => (
                    <Chip key={s.skill_id} label={`${s.name} (${s.level})`} onDismiss={() => handleRemoveSkill(s.skill_id)} />
                  ))
                ) : (
                  <span style={{ fontSize: "12px", color: APPLE_COLORS.inkMuted48 }}>No disciplines linked yet.</span>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Projects Showcase Manager ── */}
      <div style={{ marginTop: "32px" }}>
        <div
          style={{
            backgroundColor: "#ffffff",
            borderRadius: APPLE_RADII.lg,
            border: `1px solid ${APPLE_COLORS.hairline}`,
            padding: "32px",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "20px" }}>
            <Laptop size={18} color={APPLE_COLORS.primary} />
            <h2 style={{ fontSize: "18px", fontWeight: 600, color: APPLE_COLORS.ink, margin: 0 }}>
              Projects Showcase
            </h2>
          </div>

          {/* Add Project Form */}
          <form onSubmit={handleAddProject} style={{ display: "flex", flexDirection: "column", gap: "14px", marginBottom: "28px", paddingBottom: "24px", borderBottom: `1px solid ${APPLE_COLORS.hairline}` }}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "14px" }}>
              <Input label="Project Title" placeholder="e.g. Distributed Consensus Engine" value={newProj.title} onChange={(e) => setNewProj({ ...newProj, title: e.target.value })} required />
              <Input label="Tech Stack" placeholder="e.g. Go, Raft, gRPC" value={newProj.tech_stack} onChange={(e) => setNewProj({ ...newProj, tech_stack: e.target.value })} />
              <Input label="GitHub URL" placeholder="https://github.com/..." value={newProj.github_link} onChange={(e) => setNewProj({ ...newProj, github_link: e.target.value })} />
              <Input label="Live Demo URL" placeholder="https://..." value={newProj.demo_link} onChange={(e) => setNewProj({ ...newProj, demo_link: e.target.value })} />
            </div>
            <Textarea label="Project Description" placeholder="Architecture details and problem statement..." value={newProj.description} onChange={(e) => setNewProj({ ...newProj, description: e.target.value })} rows={2} />
            <div>
              <Button type="submit" variant="primary" size="small" leftGlyph={<Plus size={14} />}>
                Add Project to Showcase
              </Button>
            </div>
          </form>

          {/* Existing Projects List */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "16px" }}>
            {profile?.projects && profile.projects.length > 0 ? (
              profile.projects.map((p) => (
                <div
                  key={p.project_id}
                  style={{
                    backgroundColor: APPLE_COLORS.canvasParchment,
                    borderRadius: APPLE_RADII.md,
                    border: `1px solid ${APPLE_COLORS.hairline}`,
                    padding: "20px",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between",
                  }}
                >
                  <div>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "6px" }}>
                      <h4 style={{ fontSize: "15px", fontWeight: 600, color: APPLE_COLORS.ink, margin: 0 }}>
                        {p.title}
                      </h4>
                      <button
                        type="button"
                        onClick={() => handleDeleteProject(p.project_id)}
                        style={{
                          background: "none",
                          border: "none",
                          cursor: "pointer",
                          color: "#d70015",
                          padding: "2px",
                        }}
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                    <p style={{ fontSize: "13px", color: APPLE_COLORS.inkMuted48, margin: 0, lineHeight: 1.4 }}>
                      {p.description}
                    </p>
                  </div>
                  <div style={{ fontSize: "11px", color: APPLE_COLORS.primary, fontWeight: 500, marginTop: "14px" }}>
                    {p.tech_stack}
                  </div>
                </div>
              ))
            ) : (
              <p style={{ fontSize: "13px", color: APPLE_COLORS.inkMuted48, margin: 0 }}>
                No projects showcased yet.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
