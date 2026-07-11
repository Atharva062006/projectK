"use client";
import { useEffect, useState, useRef } from "react";
import {
  User, FileText, Award,
  Briefcase, Plus, Save,
  ShieldAlert, Upload, Trash2
} from "lucide-react";
import { api } from "@/lib/api";

const GithubIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" width="14" height="14" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22" />
  </svg>
);

const LinkedinIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" width="14" height="14" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" strokeLinecap="round" strokeLinejoin="round" />
    <rect x="2" y="9" width="4" height="12" />
    <circle cx="4" cy="4" r="2" />
  </svg>
);
import { useAuth } from "@/context/AuthContext";
import ResponseBox from "@/components/ResponseBox";

interface Skill { skill_id: string; name: string; category: string; level: string; }
interface Project { project_id: string; title: string; description?: string; github_link?: string; tech_stack?: string; demo_link?: string; }
interface ProfileData {
  profile_id: string; full_name: string; tagline?: string; bio?: string; availability?: string;
  department?: string; college?: string; location?: string; yr_of_graduation?: number;
  role_category?: string; completion_percentage: number;
  contact?: { phone?: string; linkedin?: string; github?: string; portfolio_url?: string; };
  skills?: Skill[]; projects?: Project[];
  resumes?: { resume_id: string; file_path: string; uploaded_at: string }[];
}

export default function PortfolioPage() {
  const { user, token, refreshProfileId } = useAuth();
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [allSkills, setAllSkills] = useState<Skill[]>([]);
  const [result, setResult] = useState<{ ok: boolean; message: string; data?: unknown } | null>(null);
  const [loading, setLoading] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);
  const BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api/v1";

  // Form states
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
        setPf({
          full_name: d.full_name || "", tagline: d.tagline || "", bio: d.bio || "",
          availability: d.availability || "", department: d.department || "",
          college: d.college || "", location: d.location || "",
          yr_of_graduation: d.yr_of_graduation ? String(d.yr_of_graduation) : ""
        });
        setContact({
          phone: d.contact?.phone || "", linkedin: d.contact?.linkedin || "",
          github: d.contact?.github || "", portfolio_url: d.contact?.portfolio_url || ""
        });
      }

      const skillsRes = await api.profile.getSkills();
      if (skillsRes.ok && skillsRes.data) {
        setAllSkills(skillsRes.data as Skill[]);
      }
    } catch (err) {
      console.error("Failed to load initial portfolio data", err);
    }
  };

  useEffect(() => {
    if (token) {
      loadData();
    }
  }, [token]);

  if (!token) {
    return (
      <div className="max-w-md mx-auto py-12">
        <div className="bg-[#0e1017] border border-gray-800 rounded-2xl p-6 text-center space-y-4">
          <div className="w-12 h-12 rounded-full bg-yellow-950/40 border border-yellow-950 flex items-center justify-center mx-auto text-yellow-400">
            <ShieldAlert size={20} />
          </div>
          <h2 className="text-sm font-mono font-semibold text-white">Authentication Required</h2>
          <p className="text-xs text-gray-500 font-mono">You must log in to view and configure your portfolio.</p>
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
      portfolio_url: contact.portfolio_url
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
    if (res.ok) {
      await loadData();
    }
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
    if (res.ok) {
      await loadData();
    }
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
    <div className="space-y-6">

      {/* Header and completion */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-gray-800 pb-5">
        <div>
          <h1 className="text-2xl font-bold text-white font-mono tracking-wide">Workspace Dashboard</h1>
          <p className="text-xs text-gray-500 font-mono mt-1">Configure your bento portfolio details and project showcases</p>
        </div>

        {profile && (
          <div className="bg-[#0e1017] border border-gray-800 rounded-xl p-4 flex items-center gap-4 w-full md:w-auto">
            <div className="text-left font-mono">
              <div className="text-xs text-gray-400 font-bold uppercase">Quality Index</div>
              <div className="text-[10px] text-gray-500 mt-0.5">Completion Rate</div>
            </div>
            <div className="text-right ml-auto">
              <span className="text-2xl font-mono font-bold text-blue-400">{profile.completion_percentage}%</span>
              <div className="w-28 bg-gray-800 rounded-full h-1.5 mt-1">
                <div className="bg-blue-600 h-1.5 rounded-full transition-all duration-500" style={{ width: `${profile.completion_percentage}%` }} />
              </div>
            </div>
          </div>
        )}
      </div>

      <ResponseBox result={result} />

      {/* Bento Editor Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

        {/* Card 1: Core Details Form (Spans 2 columns) */}
        <div className="md:col-span-2 bg-[#0e1017] border border-gray-800 rounded-2xl p-6 space-y-4">
          <div className="flex items-center gap-2 border-b border-gray-800 pb-3">
            <User size={14} className="text-blue-400" />
            <h2 className="text-xs font-mono font-bold tracking-wider uppercase text-gray-400">Core Profile Settings</h2>
          </div>

          <form onSubmit={handleProfileSave} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-[10px] font-mono text-gray-500">Full Name</label>
                <input
                  type="text"
                  value={pf.full_name}
                  onChange={(e) => setPf({ ...pf, full_name: e.target.value })}
                  className="w-full bg-[#11131c] border border-gray-800 rounded-lg px-3 py-2 text-xs text-gray-200 outline-none focus:border-gray-700 font-mono"
                  required
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-mono text-gray-500">Tagline / Title</label>
                <input
                  type="text"
                  value={pf.tagline}
                  onChange={(e) => setPf({ ...pf, tagline: e.target.value })}
                  className="w-full bg-[#11131c] border border-gray-800 rounded-lg px-3 py-2 text-xs text-gray-200 outline-none focus:border-gray-700 font-mono"
                  placeholder="e.g. Full Stack Developer"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-mono text-gray-500">Department</label>
                <input
                  type="text"
                  value={pf.department}
                  onChange={(e) => setPf({ ...pf, department: e.target.value })}
                  className="w-full bg-[#11131c] border border-gray-800 rounded-lg px-3 py-2 text-xs text-gray-200 outline-none focus:border-gray-700 font-mono"
                  placeholder="e.g. Core Team, Engineering"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-mono text-gray-500">Graduation Year</label>
                <input
                  type="number"
                  value={pf.yr_of_graduation}
                  onChange={(e) => setPf({ ...pf, yr_of_graduation: e.target.value })}
                  className="w-full bg-[#11131c] border border-gray-800 rounded-lg px-3 py-2 text-xs text-gray-200 outline-none focus:border-gray-700 font-mono"
                  placeholder="2026"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-mono text-gray-500">College / Institution</label>
                <input
                  type="text"
                  value={pf.college}
                  onChange={(e) => setPf({ ...pf, college: e.target.value })}
                  className="w-full bg-[#11131c] border border-gray-800 rounded-lg px-3 py-2 text-xs text-gray-200 outline-none focus:border-gray-700 font-mono"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-mono text-gray-500">Location</label>
                <input
                  type="text"
                  value={pf.location}
                  onChange={(e) => setPf({ ...pf, location: e.target.value })}
                  className="w-full bg-[#11131c] border border-gray-800 rounded-lg px-3 py-2 text-xs text-gray-200 outline-none focus:border-gray-700 font-mono"
                  placeholder="e.g. Bangalore, India"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-mono text-gray-500">Biography / Core Focus</label>
              <textarea
                value={pf.bio}
                onChange={(e) => setPf({ ...pf, bio: e.target.value })}
                className="w-full bg-[#11131c] border border-gray-800 rounded-lg px-3 py-2 text-xs text-gray-200 outline-none focus:border-gray-700 font-mono"
                rows={3}
                placeholder="Write a brief overview of your projects and interests..."
              />
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-mono text-gray-500">Availability Status</label>
              <select
                value={pf.availability}
                onChange={(e) => setPf({ ...pf, availability: e.target.value })}
                className="w-full bg-[#11131c] border border-gray-800 rounded-lg px-3 py-2 text-xs text-gray-400 outline-none focus:border-gray-700 font-mono"
              >
                <option value="">Choose status...</option>
                <option value="Available">Available</option>
                <option value="Busy">Busy</option>
                <option value="Open to work">Open to work</option>
              </select>
            </div>

            {/* Sub-contact details */}
            <div className="border-t border-gray-800/80 pt-4 space-y-4">
              <h3 className="text-xs font-mono font-semibold text-gray-400">Social Connections</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-mono text-gray-500">Phone</label>
                  <input
                    type="text"
                    value={contact.phone}
                    onChange={(e) => setContact({ ...contact, phone: e.target.value })}
                    className="w-full bg-[#11131c] border border-gray-800 rounded-lg px-3 py-2 text-xs text-gray-200 outline-none focus:border-gray-700 font-mono"
                    placeholder="+91..."
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-mono text-gray-500">GitHub Link</label>
                  <input
                    type="url"
                    value={contact.github}
                    onChange={(e) => setContact({ ...contact, github: e.target.value })}
                    className="w-full bg-[#11131c] border border-gray-800 rounded-lg px-3 py-2 text-xs text-gray-200 outline-none focus:border-gray-700 font-mono"
                    placeholder="https://github.com/..."
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-mono text-gray-500">LinkedIn Link</label>
                  <input
                    type="url"
                    value={contact.linkedin}
                    onChange={(e) => setContact({ ...contact, linkedin: e.target.value })}
                    className="w-full bg-[#11131c] border border-gray-800 rounded-lg px-3 py-2 text-xs text-gray-200 outline-none focus:border-gray-700 font-mono"
                    placeholder="https://linkedin.com/in/..."
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-mono text-gray-500">Portfolio Link</label>
                  <input
                    type="url"
                    value={contact.portfolio_url}
                    onChange={(e) => setContact({ ...contact, portfolio_url: e.target.value })}
                    className="w-full bg-[#11131c] border border-gray-800 rounded-lg px-3 py-2 text-xs text-gray-200 outline-none focus:border-gray-700 font-mono"
                    placeholder="https://..."
                  />
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-700 hover:bg-blue-600 disabled:opacity-50 text-white font-mono text-xs font-bold py-2.5 rounded-xl transition-all cursor-pointer flex items-center justify-center gap-2"
            >
              <Save size={14} />
              <span>Save Core Profile Details</span>
            </button>
          </form>
        </div>

        {/* Column 2: Resume & Skills (Right column) */}
        <div className="space-y-6">

          {/* Resume Upload Box */}
          <div className="bg-[#0e1017] border border-gray-800 rounded-2xl p-6 space-y-4">
            <div className="flex items-center gap-2 border-b border-gray-800 pb-3">
              <FileText size={14} className="text-blue-400" />
              <h2 className="text-xs font-mono font-bold tracking-wider uppercase text-gray-400">Curriculum Vitae</h2>
            </div>

            <form onSubmit={handleUploadResume} className="space-y-3">
              <div className="border-2 border-dashed border-gray-800 hover:border-gray-700 rounded-xl p-4 text-center cursor-pointer relative bg-[#11131c]/50 transition-colors">
                <input
                  type="file"
                  accept=".pdf"
                  ref={fileRef}
                  className="absolute inset-0 opacity-0 cursor-pointer"
                  required
                />
                <Upload size={24} className="mx-auto text-gray-600 mb-2" />
                <p className="text-[10px] font-mono text-gray-400">Select PDF resume</p>
                <p className="text-[9px] font-mono text-gray-500 mt-1">Maximum file size: 5MB</p>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-[#1b1e2c] border border-gray-700 hover:bg-[#25293c] text-white font-mono text-xs py-2 rounded-lg transition-colors cursor-pointer"
              >
                Upload PDF Resume
              </button>
            </form>

            {profile?.resumes && profile.resumes.length > 0 && (
              <div className="border-t border-gray-850 pt-3 space-y-2">
                <p className="text-[10px] font-mono text-gray-500 uppercase font-semibold">Active CV</p>
                {profile.resumes.slice(0, 1).map((r) => (
                  <div key={r.resume_id} className="bg-[#11131c] border border-gray-800 rounded-lg p-2.5 flex items-center justify-between text-xs font-mono">
                    <span className="truncate max-w-[120px] text-gray-300">Active CV Uploaded</span>
                    <a
                      href={`${BASE}/profiles/${profile.profile_id}/resume`}
                      target="_blank"
                      className="text-xs text-blue-500 hover:underline"
                    >
                      Download
                    </a>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Skills Management */}
          <div className="bg-[#0e1017] border border-gray-800 rounded-2xl p-6 space-y-4">
            <div className="flex items-center gap-2 border-b border-gray-800 pb-3">
              <Award size={14} className="text-blue-400" />
              <h2 className="text-xs font-mono font-bold tracking-wider uppercase text-gray-400">Manage Skills</h2>
            </div>

            <form onSubmit={handleAddSkill} className="space-y-3">
              <div className="space-y-2">
                <select
                  value={selectedSkillId}
                  onChange={(e) => setSelectedSkillId(e.target.value)}
                  className="w-full bg-[#11131c] border border-gray-800 rounded-lg px-3 py-2 text-xs text-gray-400 outline-none focus:border-gray-700 font-mono"
                  required
                >
                  <option value="">Select skill...</option>
                  {[...new Set(allSkills.map(s => s.category))].sort().map(cat => (
                    <optgroup key={cat} label={cat}>
                      {allSkills.filter(s => s.category === cat).map(s => (
                        <option key={s.skill_id} value={s.skill_id}>{s.name}</option>
                      ))}
                    </optgroup>
                  ))}
                </select>

                <select
                  value={selectedSkillLevel}
                  onChange={(e) => setSelectedSkillLevel(e.target.value)}
                  className="w-full bg-[#11131c] border border-gray-800 rounded-lg px-3 py-2 text-xs text-gray-400 outline-none focus:border-gray-700 font-mono"
                >
                  <option>Beginner</option>
                  <option>Intermediate</option>
                  <option>Expert</option>
                </select>
              </div>

              <button
                type="submit"
                className="w-full bg-[#1b1e2c] border border-gray-700 hover:bg-[#25293c] text-white font-mono text-xs py-2 rounded-lg transition-colors cursor-pointer flex items-center justify-center gap-1.5"
              >
                <Plus size={12} />
                <span>Link Skill</span>
              </button>
            </form>

            <div className="border-t border-gray-850 pt-3">
              <p className="text-[10px] font-mono text-gray-500 uppercase font-semibold mb-2">Linked Skills ({profile?.skills?.length || 0})</p>

              {profile?.skills && profile.skills.length > 0 ? (
                <div className="flex flex-wrap gap-1.5">
                  {profile.skills.map((s) => (
                    <div
                      key={s.skill_id}
                      className="flex items-center gap-1 bg-[#11131c] border border-gray-800 rounded-full pl-2.5 pr-1.5 py-0.5 text-[10px] font-mono text-gray-300"
                    >
                      <span>{s.name}</span>
                      <span className="text-[9px] text-gray-500">({s.level})</span>
                      <button
                        type="button"
                        onClick={() => handleRemoveSkill(s.skill_id)}
                        className="text-gray-500 hover:text-red-400 p-0.5 ml-1 transition-colors"
                      >
                        <Trash2 size={10} />
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-[10px] font-mono text-gray-500">No skills linked yet.</p>
              )}
            </div>
          </div>

        </div>

      </div>

      {/* Row 2: Projects Grid (Spans full width) */}
      <div className="bg-[#0e1017] border border-gray-800 rounded-2xl p-6 space-y-6">
        <div className="flex items-center gap-2 border-b border-gray-800 pb-3">
          <Briefcase size={14} className="text-blue-400" />
          <h2 className="text-xs font-mono font-bold tracking-wider uppercase text-gray-400">Projects Showcase Manager</h2>
        </div>

        {/* Add Project Form */}
        <form onSubmit={handleAddProject} className="bg-[#11131c]/50 border border-gray-800 p-4 rounded-xl space-y-3">
          <p className="text-[10px] font-mono font-bold text-gray-400 uppercase">Add Project Showcase</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <input
              type="text"
              placeholder="Project Title"
              value={newProj.title}
              onChange={(e) => setNewProj({ ...newProj, title: e.target.value })}
              className="bg-[#11131c] border border-gray-800 rounded-lg px-3 py-2 text-xs text-gray-200 outline-none focus:border-gray-700 font-mono w-full"
              required
            />
            <input
              type="text"
              placeholder="Tech Stack (e.g. React, Docker)"
              value={newProj.tech_stack}
              onChange={(e) => setNewProj({ ...newProj, tech_stack: e.target.value })}
              className="bg-[#11131c] border border-gray-800 rounded-lg px-3 py-2 text-xs text-gray-200 outline-none focus:border-gray-700 font-mono w-full"
            />
            <input
              type="url"
              placeholder="GitHub Repository URL"
              value={newProj.github_link}
              onChange={(e) => setNewProj({ ...newProj, github_link: e.target.value })}
              className="bg-[#11131c] border border-gray-800 rounded-lg px-3 py-2 text-xs text-gray-200 outline-none focus:border-gray-700 font-mono w-full"
            />
            <input
              type="url"
              placeholder="Live Demo URL"
              value={newProj.demo_link}
              onChange={(e) => setNewProj({ ...newProj, demo_link: e.target.value })}
              className="bg-[#11131c] border border-gray-800 rounded-lg px-3 py-2 text-xs text-gray-200 outline-none focus:border-gray-700 font-mono w-full"
            />
          </div>
          <textarea
            placeholder="Project Description"
            value={newProj.description}
            onChange={(e) => setNewProj({ ...newProj, description: e.target.value })}
            className="bg-[#11131c] border border-gray-800 rounded-lg px-3 py-2 text-xs text-gray-200 outline-none focus:border-gray-700 font-mono w-full"
            rows={2}
          />
          <button
            type="submit"
            className="bg-blue-700 hover:bg-blue-600 text-white font-mono text-xs font-semibold px-4 py-2 rounded-lg transition-colors cursor-pointer flex items-center gap-1.5"
          >
            <Plus size={12} />
            <span>Add Showcase Project</span>
          </button>
        </form>

        {/* Existing Projects List */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {profile?.projects && profile.projects.length > 0 ? (
            profile.projects.map((p) => (
              <div key={p.project_id} className="bg-[#11131c] border border-gray-800 rounded-xl p-4 flex flex-col justify-between h-[150px]">
                <div>
                  <div className="flex justify-between items-start">
                    <h3 className="font-semibold text-xs text-white font-mono">{p.title}</h3>
                    <button
                      type="button"
                      onClick={() => handleDeleteProject(p.project_id)}
                      className="text-gray-500 hover:text-red-400 transition-colors p-1"
                    >
                      <Trash2 size={12} />
                    </button>
                  </div>
                  <p className="text-[10px] text-gray-400 font-mono mt-1 leading-normal line-clamp-2">{p.description}</p>
                </div>

                <div className="flex items-center justify-between border-t border-gray-850 pt-2 mt-2">
                  <span className="text-[9px] font-mono text-gray-500">{p.tech_stack}</span>
                  <div className="flex gap-2">
                    {p.github_link && <a href={p.github_link} target="_blank" className="text-[10px] font-mono text-blue-500 hover:underline">GitHub</a>}
                    {p.demo_link && <a href={p.demo_link} target="_blank" className="text-[10px] font-mono text-purple-500 hover:underline">Demo</a>}
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-full py-6 text-center text-xs font-mono text-gray-500">
              No projects added to showcase. Fill form above to add projects.
            </div>
          )}
        </div>
      </div>

    </div>
  );
}
