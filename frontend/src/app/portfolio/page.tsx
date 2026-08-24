"use client";
import { useEffect, useState, useRef } from "react";
import { motion } from "framer-motion";
import { api } from "@/lib/api";
import { useAuth } from "@/context/AuthContext";
import { useTheme } from "@/context/ThemeContext";
import ResponseBox from "@/components/ResponseBox";

import Card from "@leafygreen-ui/card";
import Button from "@/components/OKCButton";
import { TextInput } from "@leafygreen-ui/text-input";
import { TextArea } from "@leafygreen-ui/text-area";
import { Select, Option, OptionGroup } from "@leafygreen-ui/select";
import { H1, H2, Body, Overline, Label } from "@leafygreen-ui/typography";
import Icon from "@leafygreen-ui/icon";
import { Banner } from "@leafygreen-ui/banner";
import { Chip } from "@leafygreen-ui/chip";
import { palette } from "@leafygreen-ui/palette";
import { BRAND, SURFACE } from "@/lib/theme";

const GithubIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" width="12" height="12" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22" />
  </svg>
);

interface Skill { skill_id: string; name: string; category: string; level: string; }
interface Project { project_id: string; title: string; description?: string; github_link?: string; tech_stack?: string; demo_link?: string; }
interface ProfileData {
  profile_id: string; full_name: string; tagline?: string; bio?: string; availability?: string;
  department?: string; college?: string; location?: string; yr_of_graduation?: number;
  role_category?: string; completion_percentage: number;
  contact?: { phone?: string; linkedin?: string; github?: string; portfolio_url?: string; };
  skills?: Skill[]; projects?: Project[];
  resumes?: { resume_id: string; file_path: string; uploaded_at: string }[];
  analytics?: { views_count: number; downloads_count: number; clicks_count: number };
}

export default function PortfolioPage() {
  const { user, token, refreshProfileId } = useAuth();
  const { darkMode } = useTheme();
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [allSkills, setAllSkills] = useState<Skill[]>([]);
  const [result, setResult] = useState<{ ok: boolean; message: string; data?: unknown } | null>(null);
  const [loading, setLoading] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);
  const BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api/v1";

  const [pf, setPf] = useState({ full_name: "", tagline: "", bio: "", availability: "", department: "", college: "", location: "", yr_of_graduation: "" });
  const [contact, setContact] = useState({ phone: "", linkedin: "", github: "", portfolio_url: "" });
  const [newProj, setNewProj] = useState({ title: "", description: "", github_link: "", tech_stack: "", demo_link: "" });
  const [selectedSkillId, setSelectedSkillId] = useState("");
  const [selectedSkillLevel, setSelectedSkillLevel] = useState("Intermediate");

  const textColor = darkMode ? palette.white : palette.black;
  const mutedColor = darkMode ? palette.gray.light1 : palette.gray.dark1;
  const borderColor = darkMode ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.08)";

  const loadData = async () => {
    try {
      const res = await api.profile.getMe();
      if (res.ok && res.data) {
        const d = res.data as ProfileData;
        setProfile(d);
        setPf({ full_name: d.full_name || "", tagline: d.tagline || "", bio: d.bio || "", availability: d.availability || "", department: d.department || "", college: d.college || "", location: d.location || "", yr_of_graduation: d.yr_of_graduation ? String(d.yr_of_graduation) : "" });
        setContact({ phone: d.contact?.phone || "", linkedin: d.contact?.linkedin || "", github: d.contact?.github || "", portfolio_url: d.contact?.portfolio_url || "" });
      }
      const skillsRes = await api.profile.getSkills();
      if (skillsRes.ok && skillsRes.data) setAllSkills(skillsRes.data as Skill[]);
    } catch (err) { console.error("Failed to load portfolio data", err); }
  };

  useEffect(() => { if (token) loadData(); }, [token]);

  if (!token) {
    return (
      <div style={{ minHeight: "60vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
        {/* Single Card for isolated auth-required state */}
        <Card data-okc-theme="true" darkMode={darkMode} style={{ padding: "40px", textAlign: "center", maxWidth: "380px", width: "100%" }}>
          <div style={{ width: "48px", height: "48px", borderRadius: "12px", background: darkMode ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.05)", border: `1px solid ${SURFACE.border}`, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px" }}>
            <Icon glyph="Lock" fill={mutedColor} size={20} />
          </div>
          <H2 darkMode={darkMode} style={{ marginBottom: "8px" }}>Authentication Required</H2>
          <Body darkMode={darkMode} style={{ color: mutedColor }}>You must be logged in to manage your portfolio.</Body>
        </Card>
      </div>
    );
  }

  const handleProfileSave = async (e: React.FormEvent) => {
    e.preventDefault(); setLoading(true); setResult(null);
    const body = { ...pf, yr_of_graduation: pf.yr_of_graduation ? Number(pf.yr_of_graduation) : null, phone: contact.phone, linkedin: contact.linkedin, github: contact.github, portfolio_url: contact.portfolio_url };
    const res = await api.profile.updateMe(body);
    setResult(res);
    if (res.ok) { await loadData(); await refreshProfileId(); }
    setLoading(false);
  };

  const handleAddSkill = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedSkillId) return;
    const res = await api.profile.addSkill(selectedSkillId, selectedSkillLevel);
    setResult(res);
    if (res.ok) { setSelectedSkillId(""); await loadData(); }
  };

  const handleRemoveSkill = async (skillId: string) => {
    const res = await api.profile.removeSkill(skillId);
    setResult(res); if (res.ok) await loadData();
  };

  const handleAddProject = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProj.title) return;
    const res = await api.profile.addProject(newProj);
    setResult(res);
    if (res.ok) { setNewProj({ title: "", description: "", github_link: "", tech_stack: "", demo_link: "" }); await loadData(); }
  };

  const handleDeleteProject = async (projectId: string) => {
    const res = await api.profile.deleteProject(projectId);
    setResult(res); if (res.ok) await loadData();
  };

  const handleUploadResume = async (e: React.FormEvent) => {
    e.preventDefault();
    const file = fileRef.current?.files?.[0];
    if (!file) { setResult({ ok: false, message: "Please select a PDF file first" }); return; }
    const fd = new FormData(); fd.append("resume", file);
    setLoading(true);
    const res = await api.profile.uploadResume(fd);
    setResult(res);
    if (res.ok) { if (fileRef.current) fileRef.current.value = ""; await loadData(); }
    setLoading(false);
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "24px", paddingBottom: "48px" }}>
      {/* Header — plain div with inline completion stat, no Card */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "16px", paddingBottom: "20px", borderBottom: `1px solid ${SURFACE.border}` }}>
        <div>
          <H1 darkMode={darkMode}>Workspace Dashboard</H1>
          <Body darkMode={darkMode} style={{ color: mutedColor, marginTop: "4px" }}>
            Configure your portfolio details and project showcases
          </Body>
        </div>
        {profile && (
          <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
            <div>
              <Overline darkMode={darkMode} style={{ color: mutedColor }}>Profile Quality</Overline>
              <Body darkMode={darkMode} style={{ fontSize: "11px", color: mutedColor }}>Completion</Body>
            </div>
            <div style={{ textAlign: "right" }}>
              <H2 darkMode={darkMode} style={{ color: textColor, margin: 0, fontWeight: 700 }}>{profile.completion_percentage}%</H2>
              <div style={{ width: "112px", height: "6px", borderRadius: "99px", background: SURFACE.border, overflow: "hidden", marginTop: "6px" }}>
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${profile.completion_percentage}%` }}
                  transition={{ duration: 0.8, ease: "easeOut" }}
                  style={{ height: "100%", borderRadius: "99px", background: BRAND.gradient }}
                />
              </div>
            </div>
          </div>
        )}
      </div>

      <ResponseBox result={result} />

      {/* Analytics — standalone stat tiles (no outer wrapper = valid) */}
      {profile?.analytics && (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: "16px" }}>
          {[
            { label: "Profile Views", sub: "Portfolio views logged", value: profile.analytics.views_count || 0 },
            { label: "Resume Downloads", sub: "Times CV was downloaded", value: profile.analytics.downloads_count || 0 },
            { label: "Link Clicks", sub: "Social link redirects", value: profile.analytics.clicks_count || 0 },
          ].map((s, i) => (
            <Card data-okc-theme="true" key={i} darkMode={darkMode} style={{ padding: "16px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div>
                <Overline darkMode={darkMode} style={{ color: mutedColor }}>{s.label}</Overline>
                <Body darkMode={darkMode} style={{ fontSize: "11px", color: mutedColor }}>{s.sub}</Body>
              </div>
              <H2 darkMode={darkMode} style={{ color: textColor, margin: 0, fontWeight: 700 }}>{s.value}</H2>
            </Card>
          ))}
        </div>
      )}

      {/* Editor grid */}
      <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: "20px", alignItems: "start" }}>
        {/* Core Details — standalone Card (an isolated editor surface) */}
        <Card data-okc-theme="true" darkMode={darkMode} style={{ padding: "24px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "6px", marginBottom: "20px" }}>
            <Icon glyph="Person" fill={mutedColor} size={14} />
            <Overline darkMode={darkMode} style={{ color: mutedColor }}>Core Profile Settings</Overline>
          </div>
          <form onSubmit={handleProfileSave} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
              <TextInput data-okc-theme="true" darkMode={darkMode} label="Full Name" value={pf.full_name} onChange={(e) => setPf({ ...pf, full_name: e.target.value })} required />
              <TextInput data-okc-theme="true" darkMode={darkMode} label="Tagline / Title" placeholder="e.g. Full Stack Developer" value={pf.tagline} onChange={(e) => setPf({ ...pf, tagline: e.target.value })} />
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
              <TextInput data-okc-theme="true" darkMode={darkMode} label="College / University" placeholder="e.g. University of Engineering" value={pf.college} onChange={(e) => setPf({ ...pf, college: e.target.value })} />
              <TextInput data-okc-theme="true" darkMode={darkMode} label="Location" placeholder="e.g. San Francisco, CA" value={pf.location} onChange={(e) => setPf({ ...pf, location: e.target.value })} />
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "12px" }}>
              <Select data-okc-theme="true" darkMode={darkMode} label="Availability" value={pf.availability} onChange={(val) => setPf({ ...pf, availability: val })}>
                <Option value="Available">Available</Option>
                <Option value="Open to work">Open to work</Option>
                <Option value="Busy">Busy</Option>
              </Select>
              <Select data-okc-theme="true" darkMode={darkMode} label="Department" value={pf.department} onChange={(val) => setPf({ ...pf, department: val })}>
                <Option value="Core Team">Core Team</Option>
                <Option value="Technical Team">Technical Team</Option>
                <Option value="Other Members">Other Members</Option>
                <Option value="Alumni">Alumni</Option>
              </Select>
              <TextInput data-okc-theme="true" darkMode={darkMode} label="Grad Year" type="number" placeholder="2025" value={pf.yr_of_graduation} onChange={(e) => setPf({ ...pf, yr_of_graduation: e.target.value })} />
            </div>
            <TextArea data-okc-theme="true" darkMode={darkMode} label="Biography" placeholder="Tell us about yourself..." value={pf.bio} onChange={(e) => setPf({ ...pf, bio: e.target.value })} rows={3} />

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
              <TextInput data-okc-theme="true" darkMode={darkMode} label="Phone Number" placeholder="+1 (555) 000-0000" value={contact.phone} onChange={(e) => setContact({ ...contact, phone: e.target.value })} />
              <TextInput data-okc-theme="true" darkMode={darkMode} label="Portfolio URL" placeholder="https://mywebsite.dev" value={contact.portfolio_url} onChange={(e) => setContact({ ...contact, portfolio_url: e.target.value })} />
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
              <TextInput data-okc-theme="true" darkMode={darkMode} label="LinkedIn Profile" placeholder="https://linkedin.com/in/..." value={contact.linkedin} onChange={(e) => setContact({ ...contact, linkedin: e.target.value })} />
              <TextInput data-okc-theme="true" darkMode={darkMode} label="GitHub Profile" placeholder="https://github.com/..." value={contact.github} onChange={(e) => setContact({ ...contact, github: e.target.value })} />
            </div>

            <Button type="submit" darkMode={darkMode} variant="primary" isLoading={loading} style={{ alignSelf: "flex-start", marginTop: "8px" }}>
              Save Profile Settings
            </Button>
          </form>
        </Card>

        {/* Right column */}
        <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
          {/* Resume Upload — standalone Card (isolated action surface) */}
          <Card data-okc-theme="true" darkMode={darkMode} style={{ padding: "20px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "6px", marginBottom: "16px" }}>
              <Icon glyph="File" fill={mutedColor} size={14} />
              <Overline darkMode={darkMode} style={{ color: mutedColor }}>Curriculum Vitae</Overline>
            </div>
            <form onSubmit={handleUploadResume} style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              <div
                style={{ position: "relative", border: `2px dashed ${SURFACE.border}`, borderRadius: "12px", padding: "28px 20px", textAlign: "center", cursor: "pointer", transition: "border-color 0.15s ease" }}
                onMouseEnter={(e) => (e.currentTarget.style.borderColor = darkMode ? "rgba(255,255,255,0.24)" : "rgba(0,0,0,0.24)")}
                onMouseLeave={(e) => (e.currentTarget.style.borderColor = SURFACE.border)}
              >
                <input type="file" accept=".pdf" ref={fileRef} style={{ position: "absolute", inset: 0, opacity: 0, cursor: "pointer" }} required />
                <Icon glyph="Upload" fill={mutedColor} size={24} style={{ margin: "0 auto 8px", display: "block" }} />
                <Body darkMode={darkMode} style={{ color: mutedColor, fontSize: "13px" }}>Select PDF resume</Body>
                <Body darkMode={darkMode} style={{ color: mutedColor, fontSize: "11px", marginTop: "4px" }}>Maximum file size: 5MB</Body>
              </div>
              <Button type="submit" darkMode={darkMode} variant="default" isLoading={loading} style={{ width: "100%" }}>
                Upload PDF Resume
              </Button>
            </form>
            {profile?.resumes && profile.resumes.length > 0 && (
              <div style={{ paddingTop: "12px", marginTop: "12px", borderTop: `1px solid ${SURFACE.border}` }}>
                <Label htmlFor="resume-cv" darkMode={darkMode} style={{ color: mutedColor, display: "block", marginBottom: "8px" }}>Active CV</Label>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "8px 12px", borderRadius: "8px", background: SURFACE.card, border: `1px solid ${SURFACE.border}` }}>
                  <Body darkMode={darkMode} style={{ fontSize: "12px" }}>Resume Uploaded</Body>
                  <Button as="a" href={`${BASE}/profiles/${profile.profile_id}/resume`} target="_blank" darkMode={darkMode} variant="default" size="xsmall" leftGlyph={<Icon glyph="Download" />}>
                    Download
                  </Button>
                </div>
              </div>
            )}
          </Card>

          {/* Skills — standalone Card (isolated action surface) */}
          <Card data-okc-theme="true" darkMode={darkMode} style={{ padding: "20px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "6px", marginBottom: "16px" }}>
              <Icon glyph="Code" fill={mutedColor} size={14} />
              <Overline darkMode={darkMode} style={{ color: mutedColor }}>Manage Skills</Overline>
            </div>
            <form onSubmit={handleAddSkill} style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
              <Select data-okc-theme="true" darkMode={darkMode} label="Skill" value={selectedSkillId} onChange={(val) => setSelectedSkillId(val)} placeholder="Select skill...">
                {[...new Set(allSkills.map((s) => s.category))].sort().map((cat) => (
                  <OptionGroup key={cat} label={cat}>
                    {allSkills.filter((s) => s.category === cat).map((s) => (
                      <Option key={s.skill_id} value={s.skill_id}>{s.name}</Option>
                    ))}
                  </OptionGroup>
                ))}
              </Select>
              <Select data-okc-theme="true" darkMode={darkMode} label="Level" value={selectedSkillLevel} onChange={(val) => setSelectedSkillLevel(val)}>
                <Option value="Beginner">Beginner</Option>
                <Option value="Intermediate">Intermediate</Option>
                <Option value="Expert">Expert</Option>
              </Select>
              <Button type="submit" darkMode={darkMode} variant="default" size="small" leftGlyph={<Icon glyph="Plus" />} style={{ width: "100%" }}>
                Link Skill
              </Button>
            </form>

            <div style={{ paddingTop: "12px", marginTop: "12px", borderTop: `1px solid ${SURFACE.border}` }}>
              <Label htmlFor="skills-list" darkMode={darkMode} style={{ color: mutedColor, display: "block", marginBottom: "8px" }}>
                Linked Skills ({profile?.skills?.length || 0})
              </Label>
              {profile?.skills && profile.skills.length > 0 ? (
                <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
                  {profile.skills.map((s) => (
                    <Chip
                      key={s.skill_id}
                      darkMode={darkMode}
                      label={`${s.name} (${s.level})`}
                      variant="green"
                      onDismiss={() => handleRemoveSkill(s.skill_id)}
                    />
                  ))}
                </div>
              ) : (
                <Body darkMode={darkMode} style={{ fontSize: "12px", color: mutedColor }}>No skills linked yet.</Body>
              )}
            </div>
          </Card>
        </div>
      </div>

      {/* ── Projects section — no outer Card wrapper ── */}
      <div style={{ paddingTop: "8px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "6px", marginBottom: "20px", paddingTop: "16px", borderTop: `1px solid ${SURFACE.border}` }}>
          <Icon glyph="Laptop" fill={mutedColor} size={14} />
          <Overline darkMode={darkMode} style={{ color: mutedColor }}>Projects Showcase Manager</Overline>
        </div>

        {/* Add Project form — plain section, no nested Card */}
        <div style={{ marginBottom: "24px", padding: "20px", borderRadius: "8px", border: `1px solid ${borderColor}` }}>
          <Overline darkMode={darkMode} style={{ display: "block", marginBottom: "12px" }}>Add Project</Overline>
          <form onSubmit={handleAddProject} style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
              <TextInput data-okc-theme="true" darkMode={darkMode} label="Project Title" value={newProj.title} onChange={(e) => setNewProj({ ...newProj, title: e.target.value })} required />
              <TextInput data-okc-theme="true" darkMode={darkMode} label="Tech Stack" placeholder="React, Docker..." value={newProj.tech_stack} onChange={(e) => setNewProj({ ...newProj, tech_stack: e.target.value })} />
              <TextInput data-okc-theme="true" darkMode={darkMode} label="GitHub URL" placeholder="https://github.com/..." value={newProj.github_link} onChange={(e) => setNewProj({ ...newProj, github_link: e.target.value })} />
              <TextInput data-okc-theme="true" darkMode={darkMode} label="Demo URL" placeholder="https://..." value={newProj.demo_link} onChange={(e) => setNewProj({ ...newProj, demo_link: e.target.value })} />
            </div>
            <TextArea data-okc-theme="true" darkMode={darkMode} label="Description" placeholder="Project overview..." value={newProj.description} onChange={(e) => setNewProj({ ...newProj, description: e.target.value })} rows={2} />
            <Button type="submit" darkMode={darkMode} variant="primary" size="small" leftGlyph={<Icon glyph="Plus" />}>
              Add Project
            </Button>
          </form>
        </div>

        {/* Existing projects — individual Cards per project (distinct content objects) */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "16px" }}>
          {profile?.projects && profile.projects.length > 0 ? (
            profile.projects.map((p) => (
              <Card data-okc-theme="true" key={p.project_id} darkMode={darkMode} style={{ padding: "16px", display: "flex", flexDirection: "column", gap: "12px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <Body darkMode={darkMode} style={{ fontWeight: 600, marginBottom: "4px" }}>{p.title}</Body>
                    <Body darkMode={darkMode} style={{ fontSize: "12px", color: mutedColor, display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
                      {p.description}
                    </Body>
                  </div>
                  <Button
                    darkMode={darkMode}
                    variant="dangerOutline"
                    size="xsmall"
                    leftGlyph={<Icon glyph="Trash" />}
                    onClick={() => handleDeleteProject(p.project_id)}
                    style={{ flexShrink: 0, marginLeft: "8px" }}
                  />
                </div>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", paddingTop: "8px", borderTop: `1px solid ${SURFACE.border}` }}>
                  <Body darkMode={darkMode} style={{ fontSize: "10px", color: mutedColor }}>{p.tech_stack}</Body>
                  <div style={{ display: "flex", gap: "6px" }}>
                    {p.github_link && <Button as="a" href={p.github_link} target="_blank" darkMode={darkMode} variant="default" size="xsmall" leftGlyph={<GithubIcon />}>GitHub</Button>}
                    {p.demo_link && <Button as="a" href={p.demo_link} target="_blank" darkMode={darkMode} variant="primary" size="xsmall">Demo</Button>}
                  </div>
                </div>
              </Card>
            ))
          ) : (
            <Body darkMode={darkMode} style={{ color: mutedColor, textAlign: "center", padding: "32px 0", gridColumn: "1 / -1" }}>
              No projects added yet. Fill the form above to add your projects.
            </Body>
          )}
        </div>
      </div>
    </div>
  );
}
