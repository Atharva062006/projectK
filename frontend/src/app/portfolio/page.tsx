"use client";
import { useEffect, useState, useRef } from "react";
import { User, FileText, Award, Briefcase, Plus, Save, ShieldAlert, Upload, Trash2 } from "lucide-react";
import { api } from "@/lib/api";
import { useAuth } from "@/context/AuthContext";
import ResponseBox from "@/components/ResponseBox";

const GithubIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" width="14" height="14" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" {...props}>
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

const inputClass = "glass-input w-full rounded-xl px-3 py-2.5 text-sm";
const labelClass = "text-xs text-gray-500 font-medium block mb-1";

export default function PortfolioPage() {
  const { user, token, refreshProfileId } = useAuth();
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
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="glass-card rounded-2xl p-8 text-center space-y-4 max-w-sm w-full">
          <div className="w-12 h-12 rounded-xl flex items-center justify-center mx-auto"
            style={{ background: "rgba(240,165,0,0.12)", border: "1px solid rgba(240,165,0,0.28)", color: "#f0a500" }}>
            <ShieldAlert size={20} />
          </div>
          <h2 className="text-base font-semibold text-white">Authentication Required</h2>
          <p className="text-sm text-gray-500">You must be logged in to manage your portfolio.</p>
        </div>
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
    setResult(res);
    if (res.ok) await loadData();
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
    setResult(res);
    if (res.ok) await loadData();
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
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-5 border-b" style={{ borderColor: "rgba(255,255,255,0.07)" }}>
        <div>
          <h1 className="text-2xl font-bold text-white">Workspace Dashboard</h1>
          <p className="text-sm text-gray-500 mt-1">Configure your portfolio details and project showcases</p>
        </div>

        {profile && (
          <div className="glass-card rounded-xl p-4 flex items-center gap-5">
            <div>
              <div className="text-xs text-gray-500 font-semibold uppercase">Quality Index</div>
              <div className="text-xs text-gray-600 mt-0.5">Profile Completion</div>
            </div>
            <div className="text-right">
              <span className="text-2xl font-bold" style={{ color: "#f0a500" }}>{profile.completion_percentage}%</span>
              <div className="w-28 rounded-full h-1.5 mt-1.5 overflow-hidden" style={{ background: "rgba(255,255,255,0.07)" }}>
                <div className="progress-brand h-1.5 rounded-full" style={{ width: `${profile.completion_percentage}%` }} />
              </div>
            </div>
          </div>
        )}
      </div>

      <ResponseBox result={result} />

      {/* Analytics */}
      {profile?.analytics && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[
            { label: "Profile Views", sublabel: "Portfolio views logged", value: profile.analytics.views_count || 0, color: "#f0a500" },
            { label: "Resume Downloads", sublabel: "Times CV was downloaded", value: profile.analytics.downloads_count || 0, color: "#f01870" },
            { label: "Link Clicks", sublabel: "Social link redirects tracked", value: profile.analytics.clicks_count || 0, color: "#4ade80" },
          ].map((stat, i) => (
            <div key={i} className="glass-card rounded-xl p-4 flex items-center justify-between">
              <div>
                <div className="text-xs text-gray-500 font-semibold uppercase">{stat.label}</div>
                <div className="text-xs text-gray-600 mt-0.5">{stat.sublabel}</div>
              </div>
              <div className="text-2xl font-bold" style={{ color: stat.color }}>{stat.value}</div>
            </div>
          ))}
        </div>
      )}

      {/* Editor Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* Core Details — 2 cols */}
        <div className="md:col-span-2 glass-card rounded-2xl p-6 space-y-5">
          <div className="section-header flex items-center gap-2">
            <User size={14} style={{ color: "#f0a500" }} />
            <h2 className="section-title">Core Profile Settings</h2>
          </div>
          <form onSubmit={handleProfileSave} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                { label: "Full Name", key: "full_name", type: "text", placeholder: "" },
                { label: "Tagline / Title", key: "tagline", type: "text", placeholder: "e.g. Full Stack Developer" },
                { label: "Department", key: "department", type: "text", placeholder: "e.g. Core Team" },
                { label: "Graduation Year", key: "yr_of_graduation", type: "number", placeholder: "2026" },
                { label: "College / Institution", key: "college", type: "text", placeholder: "" },
                { label: "Location", key: "location", type: "text", placeholder: "e.g. Bangalore, India" },
              ].map(({ label, key, type, placeholder }) => (
                <div key={key}>
                  <label className={labelClass}>{label}</label>
                  <input type={type} value={pf[key as keyof typeof pf]} placeholder={placeholder}
                    onChange={(e) => setPf({ ...pf, [key]: e.target.value })}
                    className={inputClass} required={key === "full_name"} />
                </div>
              ))}
            </div>

            <div>
              <label className={labelClass}>Biography / Core Focus</label>
              <textarea value={pf.bio} onChange={(e) => setPf({ ...pf, bio: e.target.value })}
                className={`${inputClass} resize-none`} rows={3}
                placeholder="Write a brief overview of your projects and interests..." />
            </div>

            <div>
              <label className={labelClass}>Availability Status</label>
              <select value={pf.availability} onChange={(e) => setPf({ ...pf, availability: e.target.value })}
                className={`${inputClass} glass-select`}>
                <option value="">Choose status...</option>
                <option value="Available">Available</option>
                <option value="Busy">Busy</option>
                <option value="Open to work">Open to work</option>
              </select>
            </div>

            {/* Social Links */}
            <div className="border-t pt-4 space-y-4" style={{ borderColor: "rgba(255,255,255,0.07)" }}>
              <h3 className="text-sm font-semibold text-gray-400">Social Connections</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[
                  { label: "Phone", key: "phone", type: "text", placeholder: "+91..." },
                  { label: "GitHub Link", key: "github", type: "url", placeholder: "https://github.com/..." },
                  { label: "LinkedIn Link", key: "linkedin", type: "url", placeholder: "https://linkedin.com/in/..." },
                  { label: "Portfolio Link", key: "portfolio_url", type: "url", placeholder: "https://..." },
                ].map(({ label, key, type, placeholder }) => (
                  <div key={key}>
                    <label className={labelClass}>{label}</label>
                    <input type={type} value={contact[key as keyof typeof contact]} placeholder={placeholder}
                      onChange={(e) => setContact({ ...contact, [key]: e.target.value })}
                      className={inputClass} />
                  </div>
                ))}
              </div>
            </div>

            <button type="submit" disabled={loading}
              className="btn-brand w-full py-3 rounded-xl text-sm font-semibold cursor-pointer flex items-center justify-center gap-2">
              <Save size={14} />
              <span>Save Profile Details</span>
            </button>
          </form>
        </div>

        {/* Right column: CV + Skills */}
        <div className="space-y-5">
          {/* Resume Upload */}
          <div className="glass-card rounded-2xl p-5 space-y-4">
            <div className="section-header flex items-center gap-2">
              <FileText size={14} style={{ color: "#f0a500" }} />
              <h2 className="section-title">Curriculum Vitae</h2>
            </div>
            <form onSubmit={handleUploadResume} className="space-y-3">
              <div className="relative border-2 border-dashed rounded-xl p-5 text-center cursor-pointer transition-colors"
                style={{ borderColor: "rgba(255,255,255,0.1)", background: "rgba(255,255,255,0.02)" }}
                onMouseEnter={(e) => (e.currentTarget.style.borderColor = "rgba(240,165,0,0.35)")}
                onMouseLeave={(e) => (e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)")}
              >
                <input type="file" accept=".pdf" ref={fileRef} className="absolute inset-0 opacity-0 cursor-pointer" required />
                <Upload size={22} className="mx-auto mb-2 text-gray-600" />
                <p className="text-sm text-gray-400">Select PDF resume</p>
                <p className="text-xs text-gray-600 mt-0.5">Maximum file size: 5MB</p>
              </div>
              <button type="submit" disabled={loading} className="btn-ghost w-full py-2.5 rounded-xl text-sm cursor-pointer">
                Upload PDF Resume
              </button>
            </form>
            {profile?.resumes && profile.resumes.length > 0 && (
              <div className="border-t pt-3" style={{ borderColor: "rgba(255,255,255,0.07)" }}>
                <p className="text-xs text-gray-500 uppercase font-semibold mb-2">Active CV</p>
                <div className="flex items-center justify-between rounded-lg px-3 py-2 text-sm"
                  style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.09)" }}>
                  <span className="text-gray-300 text-xs">Resume Uploaded</span>
                  <a href={`${BASE}/profiles/${profile.profile_id}/resume`} target="_blank"
                    className="text-xs font-medium transition-colors" style={{ color: "#f0a500" }}
                    onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.75")}
                    onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}>
                    Download
                  </a>
                </div>
              </div>
            )}
          </div>

          {/* Skills */}
          <div className="glass-card rounded-2xl p-5 space-y-4">
            <div className="section-header flex items-center gap-2">
              <Award size={14} style={{ color: "#f0a500" }} />
              <h2 className="section-title">Manage Skills</h2>
            </div>
            <form onSubmit={handleAddSkill} className="space-y-2">
              <select value={selectedSkillId} onChange={(e) => setSelectedSkillId(e.target.value)}
                className={`${inputClass} glass-select`} required>
                <option value="">Select skill...</option>
                {[...new Set(allSkills.map((s) => s.category))].sort().map((cat) => (
                  <optgroup key={cat} label={cat}>
                    {allSkills.filter((s) => s.category === cat).map((s) => (
                      <option key={s.skill_id} value={s.skill_id}>{s.name}</option>
                    ))}
                  </optgroup>
                ))}
              </select>
              <select value={selectedSkillLevel} onChange={(e) => setSelectedSkillLevel(e.target.value)}
                className={`${inputClass} glass-select`}>
                <option>Beginner</option>
                <option>Intermediate</option>
                <option>Expert</option>
              </select>
              <button type="submit"
                className="btn-ghost w-full py-2 rounded-xl text-sm cursor-pointer flex items-center justify-center gap-1.5">
                <Plus size={13} /> Link Skill
              </button>
            </form>

            <div className="border-t pt-3" style={{ borderColor: "rgba(255,255,255,0.07)" }}>
              <p className="text-xs text-gray-500 uppercase font-semibold mb-2">
                Linked Skills ({profile?.skills?.length || 0})
              </p>
              {profile?.skills && profile.skills.length > 0 ? (
                <div className="flex flex-wrap gap-1.5">
                  {profile.skills.map((s) => (
                    <div key={s.skill_id}
                      className="flex items-center gap-1 pl-2.5 pr-1.5 py-1 rounded-full text-xs"
                      style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", color: "#d1d5db" }}>
                      <span>{s.name}</span>
                      <span className="text-gray-600 text-[10px]">({s.level})</span>
                      <button type="button" onClick={() => handleRemoveSkill(s.skill_id)}
                        className="ml-1 text-gray-600 hover:text-red-400 transition-colors cursor-pointer">
                        <Trash2 size={10} />
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-gray-600">No skills linked yet.</p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Projects Section */}
      <div className="glass-card rounded-2xl p-6 space-y-5">
        <div className="section-header flex items-center gap-2">
          <Briefcase size={14} style={{ color: "#f0a500" }} />
          <h2 className="section-title">Projects Showcase Manager</h2>
        </div>

        {/* Add Project Form */}
        <form onSubmit={handleAddProject}
          className="rounded-xl p-4 space-y-3"
          style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)" }}>
          <p className="text-xs font-semibold text-gray-400 uppercase">Add Project</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {[
              { placeholder: "Project Title", key: "title", type: "text", required: true },
              { placeholder: "Tech Stack (e.g. React, Docker)", key: "tech_stack", type: "text", required: false },
              { placeholder: "GitHub Repository URL", key: "github_link", type: "url", required: false },
              { placeholder: "Live Demo URL", key: "demo_link", type: "url", required: false },
            ].map(({ placeholder, key, type, required }) => (
              <input key={key} type={type} placeholder={placeholder} required={required}
                value={newProj[key as keyof typeof newProj]}
                onChange={(e) => setNewProj({ ...newProj, [key]: e.target.value })}
                className={`${inputClass}`} />
            ))}
          </div>
          <textarea placeholder="Project Description" rows={2}
            value={newProj.description}
            onChange={(e) => setNewProj({ ...newProj, description: e.target.value })}
            className={`${inputClass} resize-none w-full`} />
          <button type="submit"
            className="btn-brand px-4 py-2 rounded-lg text-sm font-semibold cursor-pointer flex items-center gap-1.5">
            <Plus size={13} /> Add Project
          </button>
        </form>

        {/* Existing Projects */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {profile?.projects && profile.projects.length > 0 ? (
            profile.projects.map((p) => (
              <div key={p.project_id}
                className="rounded-xl p-4 flex flex-col justify-between h-[145px]"
                style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)" }}>
                <div>
                  <div className="flex justify-between items-start">
                    <h3 className="font-semibold text-sm text-white">{p.title}</h3>
                    <button type="button" onClick={() => handleDeleteProject(p.project_id)}
                      className="text-gray-600 hover:text-red-400 transition-colors p-0.5 cursor-pointer">
                      <Trash2 size={13} />
                    </button>
                  </div>
                  <p className="text-xs text-gray-500 mt-1 line-clamp-2">{p.description}</p>
                </div>
                <div className="flex items-center justify-between border-t pt-2 mt-2" style={{ borderColor: "rgba(255,255,255,0.07)" }}>
                  <span className="text-[10px] text-gray-600">{p.tech_stack}</span>
                  <div className="flex gap-3">
                    {p.github_link && (
                      <a href={p.github_link} target="_blank"
                        className="flex items-center gap-1 text-xs text-gray-400 hover:text-white transition-colors">
                        <GithubIcon /> GitHub
                      </a>
                    )}
                    {p.demo_link && (
                      <a href={p.demo_link} target="_blank"
                        className="text-xs transition-colors" style={{ color: "#f0a500" }}>
                        Demo
                      </a>
                    )}
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-full py-6 text-center text-sm text-gray-600">
              No projects added yet. Fill the form above to add your projects.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
