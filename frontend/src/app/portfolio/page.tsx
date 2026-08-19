"use client";
import { useEffect, useState, useRef } from "react";
import { User, FileText, Award, Briefcase, Plus, Save, ShieldAlert, Upload, Trash2, Terminal, ExternalLink } from "lucide-react";
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

const inputClass = "neo-input w-full rounded-lg px-3.5 py-2.5 font-mono text-sm";
const labelClass = "text-xs font-mono font-bold uppercase text-slate-400 block mb-1";

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
        <div className="neo-card rounded-xl p-8 text-center space-y-4 max-w-sm w-full border-2 border-slate-800 shadow-neo">
          <div className="w-12 h-12 rounded-lg flex items-center justify-center mx-auto neo-badge neo-badge-amber">
            <ShieldAlert size={22} />
          </div>
          <h2 className="font-mono font-bold text-base uppercase">[ AUTHENTICATION REQUIRED ]</h2>
          <p className="text-xs font-mono text-slate-400">Please sign in to access your portfolio workspace.</p>
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
      
      {/* Workspace Header */}
      <div className="neo-card rounded-xl p-6 border-2 border-slate-800 shadow-neo flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="neo-badge neo-badge-amber mb-2 inline-block">[ BENTO WORKSPACE ]</div>
          <h1 className="text-2xl font-mono font-black uppercase tracking-tight">Portfolio Configuration</h1>
          <p className="text-xs font-mono text-slate-400 mt-1">Configure your talent profile, skill matrix, and project showcases</p>
        </div>

        {profile && (
          <div className="neo-card rounded-lg p-4 flex items-center gap-5 border border-slate-800 bg-slate-950/60">
            <div>
              <div className="text-[10px] font-mono text-slate-500 uppercase">[ QUALITY INDEX ]</div>
              <div className="text-xs font-mono text-slate-300 mt-0.5">Profile Completion</div>
            </div>
            <div className="text-right">
              <span className="text-2xl font-mono font-black brand-text">{profile.completion_percentage}%</span>
              <div className="w-28 rounded-full h-1.5 mt-1.5 overflow-hidden bg-slate-800">
                <div className="brand-gradient h-1.5 rounded-full" style={{ width: `${profile.completion_percentage}%` }} />
              </div>
            </div>
          </div>
        )}
      </div>

      <ResponseBox result={result} />

      {/* Analytics Panels */}
      {profile?.analytics && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          {[
            { label: "Profile Views", sublabel: "Directory views logged", value: profile.analytics.views_count || 0, badge: "neo-badge-amber" },
            { label: "Resume Downloads", sublabel: "Times CV was fetched", value: profile.analytics.downloads_count || 0, badge: "neo-badge-pink" },
            { label: "Link Clicks", sublabel: "GitHub / LinkedIn redirects", value: profile.analytics.clicks_count || 0, badge: "neo-badge-green" },
          ].map((stat, i) => (
            <div key={i} className="neo-card rounded-xl p-5 border border-slate-800 shadow-neo-sm flex items-center justify-between">
              <div>
                <span className={`neo-badge ${stat.badge} text-[10px]`}>[ {stat.label.toUpperCase()} ]</span>
                <div className="text-xs font-mono text-slate-400 mt-1.5">{stat.sublabel}</div>
              </div>
              <div className="text-3xl font-mono font-black text-slate-100">{stat.value}</div>
            </div>
          ))}
        </div>
      )}

      {/* Main Editor Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Core Details — 2 columns */}
        <div className="md:col-span-2 neo-card rounded-xl p-6 sm:p-8 space-y-6 border-2 border-slate-800 shadow-neo">
          <div className="section-header flex items-center justify-between pb-3 border-b border-slate-800">
            <div className="flex items-center gap-2">
              <User size={16} className="text-amber-400" />
              <h2 className="font-mono font-bold text-sm uppercase tracking-wider">[ CORE PROFILE DETAILS ]</h2>
            </div>
            <span className="neo-badge neo-badge-amber text-[10px]">[ SYSTEM RECORD ]</span>
          </div>

          <form onSubmit={handleProfileSave} className="space-y-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                { label: "Full Name", key: "full_name", type: "text", placeholder: "" },
                { label: "Tagline / Title", key: "tagline", type: "text", placeholder: "e.g. Full Stack Engineer" },
                { label: "Department / Team", key: "department", type: "text", placeholder: "e.g. Core Team" },
                { label: "Graduation Year", key: "yr_of_graduation", type: "number", placeholder: "2026" },
                { label: "College / Institution", key: "college", type: "text", placeholder: "e.g. Technology Institute" },
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
              <label className={labelClass}>Biography / Technical Focus</label>
              <textarea value={pf.bio} onChange={(e) => setPf({ ...pf, bio: e.target.value })}
                className={`${inputClass} resize-none`} rows={3}
                placeholder="Briefly describe your engineering focus, key frameworks, and background..." />
            </div>

            <div>
              <label className={labelClass}>Availability Status</label>
              <select value={pf.availability} onChange={(e) => setPf({ ...pf, availability: e.target.value })}
                className={`${inputClass} glass-select`}>
                <option value="">Select status...</option>
                <option value="Available">Available</option>
                <option value="Busy">Busy</option>
                <option value="Open to work">Open to work</option>
              </select>
            </div>

            {/* Social Links */}
            <div className="pt-4 border-t border-slate-800 space-y-4">
              <h3 className="font-mono text-xs font-bold uppercase text-slate-400">[ SOCIAL & CONTACT CONNECTIONS ]</h3>
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
              className="neo-btn-brand w-full py-3 rounded-lg font-mono text-xs uppercase tracking-wider cursor-pointer flex items-center justify-center gap-2">
              <Save size={14} />
              <span>[ SAVE PROFILE DETAILS ]</span>
            </button>
          </form>
        </div>

        {/* Right Column: CV + Skills */}
        <div className="space-y-6">
          
          {/* Resume Upload Panel */}
          <div className="neo-card rounded-xl p-6 space-y-4 border-2 border-slate-800 shadow-neo">
            <div className="section-header flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <FileText size={15} className="text-amber-400" />
                <h2 className="font-mono font-bold text-sm uppercase tracking-wider">[ CURRICULUM VITAE ]</h2>
              </div>
            </div>

            <form onSubmit={handleUploadResume} className="space-y-3">
              <div className="relative border-2 border-dashed border-slate-800 rounded-lg p-5 text-center cursor-pointer transition-colors hover:border-amber-400 bg-slate-950/40">
                <input type="file" accept=".pdf" ref={fileRef} className="absolute inset-0 opacity-0 cursor-pointer" required />
                <Upload size={24} className="mx-auto mb-2 text-slate-500" />
                <p className="font-mono text-xs text-slate-300">Select PDF resume</p>
                <p className="font-mono text-[10px] text-slate-500 mt-1">Maximum file size: 5MB</p>
              </div>
              <button type="submit" disabled={loading} className="neo-btn-ghost w-full py-2.5 rounded-lg font-mono text-xs uppercase tracking-wider cursor-pointer">
                [ UPLOAD PDF RESUME ]
              </button>
            </form>

            {profile?.resumes && profile.resumes.length > 0 && (
              <div className="pt-3 border-t border-slate-800">
                <p className="font-mono text-[10px] text-slate-500 uppercase font-bold mb-2">[ ACTIVE CV FILE ]</p>
                <div className="flex items-center justify-between rounded-lg px-3.5 py-2.5 font-mono text-xs neo-card border border-slate-800 bg-slate-950/60">
                  <span className="text-slate-300">Resume Uploaded</span>
                  <a href={`${BASE}/profiles/${profile.profile_id}/resume`} target="_blank"
                    className="neo-badge neo-badge-amber text-[10px] flex items-center gap-1">
                    <span>DOWNLOAD</span>
                    <ExternalLink size={10} />
                  </a>
                </div>
              </div>
            )}
          </div>

          {/* Skills Matrix */}
          <div className="neo-card rounded-xl p-6 space-y-4 border-2 border-slate-800 shadow-neo">
            <div className="section-header flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <Award size={15} className="text-amber-400" />
                <h2 className="font-mono font-bold text-sm uppercase tracking-wider">[ SKILL MATRIX ]</h2>
              </div>
            </div>

            <form onSubmit={handleAddSkill} className="space-y-3">
              <select value={selectedSkillId} onChange={(e) => setSelectedSkillId(e.target.value)}
                className={`${inputClass} glass-select`} required>
                <option value="">Select skill from database...</option>
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
                className="neo-btn-ghost w-full py-2.5 rounded-lg font-mono text-xs uppercase tracking-wider cursor-pointer flex items-center justify-center gap-1.5">
                <Plus size={14} /> [ LINK SKILL ]
              </button>
            </form>

            <div className="pt-3 border-t border-slate-800">
              <p className="font-mono text-[10px] text-slate-500 uppercase font-bold mb-2">
                [ LINKED SKILLS: {profile?.skills?.length || 0} ]
              </p>
              {profile?.skills && profile.skills.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {profile.skills.map((s) => (
                    <div key={s.skill_id}
                      className="flex items-center gap-1.5 neo-badge neo-badge-amber">
                      <span>{s.name}</span>
                      <span className="text-[9px] opacity-75">({s.level})</span>
                      <button type="button" onClick={() => handleRemoveSkill(s.skill_id)}
                        className="ml-1 text-slate-400 hover:text-red-400 transition-colors cursor-pointer">
                        <Trash2 size={11} />
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="font-mono text-xs text-slate-500">No skills linked yet.</p>
              )}
            </div>
          </div>

        </div>
      </div>

      {/* Projects Showcase Section */}
      <div className="neo-card rounded-xl p-6 sm:p-8 space-y-6 border-2 border-slate-800 shadow-neo">
        <div className="section-header flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <Briefcase size={16} className="text-amber-400" />
            <h2 className="font-mono font-bold text-sm uppercase tracking-wider">[ REPOSITORY & PROJECT SHOWCASE ]</h2>
          </div>
          <span className="neo-badge neo-badge-pink text-[10px]">[ BENTO GRID ]</span>
        </div>

        {/* Add Project Form */}
        <form onSubmit={handleAddProject}
          className="neo-card rounded-lg p-5 space-y-4 border border-slate-800 bg-slate-950/60">
          <p className="font-mono text-xs font-bold text-slate-300 uppercase">[ ADD FEATURED REPOSITORY / PROJECT ]</p>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[
              { placeholder: "Project Title", key: "title", type: "text", required: true },
              { placeholder: "Tech Stack (e.g. Next.js, Docker, Python)", key: "tech_stack", type: "text", required: false },
              { placeholder: "GitHub Repository URL", key: "github_link", type: "url", required: false },
              { placeholder: "Live Demo URL", key: "demo_link", type: "url", required: false },
            ].map(({ placeholder, key, type, required }) => (
              <input key={key} type={type} placeholder={placeholder} required={required}
                value={newProj[key as keyof typeof newProj]}
                onChange={(e) => setNewProj({ ...newProj, [key]: e.target.value })}
                className={inputClass} />
            ))}
          </div>

          <textarea placeholder="Project Overview & Architectural Details" rows={2}
            value={newProj.description}
            onChange={(e) => setNewProj({ ...newProj, description: e.target.value })}
            className={`${inputClass} resize-none w-full`} />

          <button type="submit"
            className="neo-btn-brand px-6 py-2.5 rounded-lg font-mono text-xs uppercase tracking-wider cursor-pointer flex items-center gap-2">
            <Plus size={14} /> [ ADD PROJECT ]
          </button>
        </form>

        {/* Existing Projects Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {profile?.projects && profile.projects.length > 0 ? (
            profile.projects.map((p) => (
              <div key={p.project_id}
                className="neo-card rounded-lg p-5 border border-slate-800 flex flex-col justify-between min-h-[160px] neo-card-hover">
                <div>
                  <div className="flex justify-between items-start">
                    <h3 className="font-mono font-bold text-sm text-slate-100">{p.title}</h3>
                    <button type="button" onClick={() => handleDeleteProject(p.project_id)}
                      className="text-slate-500 hover:text-red-400 transition-colors p-1 cursor-pointer">
                      <Trash2 size={14} />
                    </button>
                  </div>
                  <p className="font-sans text-xs text-slate-400 mt-2 line-clamp-2 leading-relaxed">{p.description}</p>
                </div>

                <div className="flex items-center justify-between border-t border-slate-800/80 pt-3 mt-3">
                  <span className="neo-badge text-[10px] text-slate-400 border-slate-800">{p.tech_stack || "General Project"}</span>
                  <div className="flex items-center gap-3 font-mono text-xs">
                    {p.github_link && (
                      <a href={p.github_link} target="_blank"
                        className="flex items-center gap-1 text-slate-400 hover:text-white transition-colors">
                        <GithubIcon /> <span>GitHub</span>
                      </a>
                    )}
                    {p.demo_link && (
                      <a href={p.demo_link} target="_blank"
                        className="text-amber-400 font-bold hover:underline flex items-center gap-1">
                        <span>Demo</span> <ExternalLink size={10} />
                      </a>
                    )}
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-full py-8 text-center font-mono text-xs text-slate-500 neo-card rounded-lg border border-slate-800">
              [ NO PROJECTS ADDED YET. FILL FORM ABOVE TO POPULATE BENTO REPOSITORY ]
            </div>
          )}
        </div>
      </div>

    </div>
  );
}
