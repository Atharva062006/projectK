"use client";
import { useEffect, useState, useRef } from "react";
import { motion } from "framer-motion";
import { api } from "@/lib/api";
import { useAuth } from "@/context/AuthContext";
import { User, FileText, Upload, Code, Laptop, Trash2, Save, Plus, ExternalLink, Lock } from "lucide-react";
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
  const { user, token, refreshProfileId } = useAuth();
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [allSkills, setAllSkills] = useState<Skill[]>([]);
  const [result, setResult] = useState<{ ok: boolean; message: string; data?: unknown } | null>(null);
  const [loading, setLoading] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);
  const BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api/v1";

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

  const loadData = async () => {
    try {
      const res = await api.profile.getMe();
      if (res.ok && res.data) {
        const d = res.data as ProfileData;
        setProfile(d);
        setPf({
          full_name: d.full_name || "",
          tagline: d.tagline || "",
          bio: d.bio || "",
          availability: d.availability || "",
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
    }
  };

  useEffect(() => {
    if (token) loadData();
  }, [token]);

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
      setResult({ ok: false, message: "Please select a PDF file first" });
      return;
    }
    const fd = new FormData();
    fd.append("resume", file);
    setLoading(true);
    const res = await api.profile.uploadResume(fd);
    setResult(res);
    if (res.ok) {
      if (fileRef.current) fileRef.current.value = "";
      await loadData();
    }
    setLoading(false);
  };

  return (
    <div style={{ maxWidth: "1080px", margin: "0 auto", padding: "40px 24px 80px" }}>
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

        {profile && (
          <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
            <div style={{ textAlign: "right" }}>
              <span style={{ fontSize: "11px", color: APPLE_COLORS.inkMuted48, textTransform: "uppercase", fontWeight: 600, display: "block" }}>
                Profile Quality
              </span>
              <span style={{ fontSize: "20px", fontWeight: 600, color: APPLE_COLORS.primary }}>
                {profile.completion_percentage}%
              </span>
            </div>
            <div style={{ width: "100px", height: "6px", borderRadius: "99px", backgroundColor: APPLE_COLORS.hairline, overflow: "hidden" }}>
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

            <form onSubmit={handleUploadResume} style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              <div
                style={{
                  border: `2px dashed ${APPLE_COLORS.hairline}`,
                  borderRadius: APPLE_RADII.md,
                  padding: "28px 20px",
                  textAlign: "center",
                  backgroundColor: "#fafafc",
                  cursor: "pointer",
                  position: "relative",
                }}
              >
                <input type="file" accept=".pdf" ref={fileRef} style={{ position: "absolute", inset: 0, opacity: 0, cursor: "pointer" }} required />
                <Upload size={22} color={APPLE_COLORS.inkMuted48} style={{ margin: "0 auto 8px" }} />
                <span style={{ fontSize: "13px", fontWeight: 500, color: APPLE_COLORS.ink, display: "block" }}>
                  Select PDF Resume
                </span>
                <span style={{ fontSize: "11px", color: APPLE_COLORS.inkMuted48 }}>Max file size: 5MB</span>
              </div>
              <Button type="submit" variant="default" size="small" isLoading={loading}>
                Upload Verified CV
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
