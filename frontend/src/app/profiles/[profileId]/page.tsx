"use client";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  ArrowLeft, Mail, Phone, School, MapPin,
  Globe, FileText, Award, GraduationCap, Briefcase, Sparkles
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

const MOCK_PROFILES_DETAIL: Record<string, ProfileData> = {
  "demo-1": { profile_id: "demo-1", full_name: "Atharva Kulkarni", email: "atharva@oysterkode.club", college: "Oyster Institute of Technology", tagline: "Full Stack Engineer & AI Enthusiast", bio: "Passionate software engineer specializing in building high-performance web applications and embedding machine learning models. Active open-source contributor and technical team lead at Oyster Kode Club.", availability: "Available", department: "Core Team", role_category: "Core Team", location: "Mumbai, India", yr_of_graduation: 2026, completion_percentage: 95, contact: { phone: "+91 98765 43210", linkedin: "https://linkedin.com/in/atharva", github: "https://github.com/atharva", portfolio_url: "https://atharvak.dev" }, skills: [{ skill_id: "s1", name: "TypeScript", category: "Languages", level: "Expert" }, { skill_id: "s2", name: "Next.js", category: "Frameworks", level: "Expert" }, { skill_id: "s3", name: "Python", category: "Languages", level: "Expert" }, { skill_id: "s4", name: "PostgreSQL", category: "Databases", level: "Intermediate" }], achievements: ["Winner of National Hackathon 2025 (First Prize out of 500+ teams)", "Built and deployed Oyster Club Portal serving 1000+ active members", "Contributed 20+ PRs to major open-source web frameworks"], certifications: ["AWS Certified Solutions Architect (Associate)", "Deep Learning Specialization by DeepLearning.AI"], projects: [{ project_id: "p1", title: "Distributed Task Scheduler", description: "A high-performance cluster job queue built with Go and gRPC, capable of scheduling 10k jobs per second.", tech_stack: "Go, gRPC, Redis, Docker", github_link: "https://github.com/atharva/scheduler" }, { project_id: "p2", title: "Bento Portfolio Portal", description: "A visual portfolio workspace designed with a modular bento grid layout to showcase member capabilities.", tech_stack: "React, Next.js, Tailwind CSS", github_link: "https://github.com/atharva/bento-portal" }] },
  "demo-2": { profile_id: "demo-2", full_name: "Sneha Sharma", email: "sneha.s@oysterkode.club", college: "School of Design Studies", tagline: "UI/UX Designer & Frontend Developer", bio: "Focusing on crafting gorgeous, modern, and user-centric interfaces. Bridge the gap between engineering complexity and intuitive interaction designs.", availability: "Open to work", department: "Technical Team", role_category: "Technical Team", location: "Bangalore, India", yr_of_graduation: 2025, completion_percentage: 90, contact: { linkedin: "https://linkedin.com/in/sneha", github: "https://github.com/sneha", portfolio_url: "https://sneha.design" }, skills: [{ skill_id: "s5", name: "Figma", category: "Design", level: "Expert" }, { skill_id: "s6", name: "React.js", category: "Frameworks", level: "Expert" }, { skill_id: "s7", name: "Tailwind CSS", category: "Libraries", level: "Expert" }], achievements: ["Designed the official club brand guide and logo framework", "Honorable Mention at Global Interaction Design Awards 2025"], certifications: ["Google UX Design Professional Certificate"], projects: [{ project_id: "p3", title: "Oyster Design System", description: "A comprehensive UI kit built on Tailwind for rapid frontend prototyping.", tech_stack: "Figma, React, Tailwind", github_link: "https://github.com/sneha/oyster-ds" }] },
  "demo-3": { profile_id: "demo-3", full_name: "Vikram Malhotra", email: "vikram@oysterkode.club", college: "Tech State College", tagline: "DevOps & Cloud Architect", bio: "Cloud enthusiast and system orchestrator. Built robust CI/CD deployment setups for several open source projects.", availability: "Busy", department: "Technical Team", role_category: "Technical Team", location: "Pune, India", yr_of_graduation: 2026, completion_percentage: 85, contact: { linkedin: "https://linkedin.com/in/vikram", github: "https://github.com/vikram" }, skills: [{ skill_id: "s8", name: "Docker", category: "DevOps & Cloud", level: "Expert" }, { skill_id: "s9", name: "Kubernetes", category: "DevOps & Cloud", level: "Intermediate" }, { skill_id: "s10", name: "Amazon Web Services (AWS)", category: "DevOps & Cloud", level: "Expert" }], achievements: ["Designed high-availability infrastructure serving 5k daily active users", "Reduced cloud costs by 35% using Kubernetes auto-scaling"], projects: [{ project_id: "p4", title: "K8s Auto-scaler Tool", description: "Custom auto-scaling daemon for cluster nodes metrics.", tech_stack: "Go, Kubernetes API, Prometheus", github_link: "https://github.com/vikram/autoscaler" }] },
  "demo-4": { profile_id: "demo-4", full_name: "Rohan Das", email: "rohan@oysterkode.club", college: "Institute of Engineering", tagline: "ML Engineer | Embedded Systems Dev", bio: "Focused on deep learning pipelines, computer vision, and hardware acceleration for edge computing.", availability: "Available", department: "Technical Team", role_category: "Technical Team", location: "Delhi, India", yr_of_graduation: 2025, completion_percentage: 88, contact: { github: "https://github.com/rohan" }, skills: [{ skill_id: "s11", name: "Python", category: "Languages", level: "Expert" }, { skill_id: "s12", name: "C++", category: "Languages", level: "Expert" }], achievements: ["Optimized CNN models to achieve 40fps on edge Raspberry Pi devices"], projects: [{ project_id: "p5", title: "EdgeVision Shield", description: "Custom firmware and model quantization pipeline for edge target inference.", tech_stack: "Python, C++, PyTorch, RTOS", github_link: "https://github.com/rohan/edgevision" }] },
  "demo-5": { profile_id: "demo-5", full_name: "Ananya Iyer", email: "ananya@oysterkode.club", college: "National Tech Academy", tagline: "Systems Engineer & VLSI Designer", bio: "Systems architect specializing in hardware design, gate arrays, and embedded platform layouts.", availability: "Available", department: "Alumni", role_category: "Alumni", location: "Chennai, India", yr_of_graduation: 2023, completion_percentage: 92, contact: { linkedin: "https://linkedin.com/in/ananya", github: "https://github.com/ananya" }, skills: [{ skill_id: "s14", name: "VHDL / Verilog", category: "Hardware & Systems", level: "Expert" }, { skill_id: "s15", name: "C (Programming Language)", category: "Hardware & Systems", level: "Expert" }], achievements: ["Taped-out 8-bit educational processor core", "Authored research paper on FPGA hardware accelerators"], projects: [{ project_id: "p6", title: "Oyster Core-8", description: "Open-source RISC-like 8-bit microprocessor soft-core in SystemVerilog.", tech_stack: "SystemVerilog, ModelSim, Quartus", github_link: "https://github.com/ananya/oyster-core8" }] },
  "demo-6": { profile_id: "demo-6", full_name: "Rahul Verma", email: "rahul@oysterkode.club", college: "City Engineering College", tagline: "Backend Developer & Database Admin", bio: "Exploring multi-threaded database engines and performance optimization.", availability: "Open to work", department: "Other Members", role_category: "Other Members", location: "Hyderabad, India", yr_of_graduation: 2026, completion_percentage: 80, contact: { github: "https://github.com/rahul" }, skills: [{ skill_id: "s17", name: "Node.js", category: "Languages", level: "Expert" }, { skill_id: "s18", name: "PostgreSQL", category: "Databases", level: "Expert" }], projects: [{ project_id: "p7", title: "Multi-tenant DB Driver", description: "Custom pooling wrapper for PostgreSQL to optimize multi-tenant connection lifetimes.", tech_stack: "Node.js, PostgreSQL, Redis", github_link: "https://github.com/rahul/db-pool-wrapper" }] },
};

const availabilityBadge = (av?: string) => {
  if (av === "Available") return { background: "rgba(34,197,94,0.1)", border: "1px solid rgba(34,197,94,0.25)", color: "#4ade80" };
  if (av === "Busy") return { background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.25)", color: "#f87171" };
  return { background: "rgba(240,165,0,0.1)", border: "1px solid rgba(240,165,0,0.25)", color: "#f0a500" };
};

export default function ProfileDetailPage() {
  const { profileId } = useParams<{ profileId: string }>();
  const router = useRouter();
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api/v1";

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
      <div className="min-h-[60vh] flex items-center justify-center text-sm text-gray-500">
        Loading profile details...
      </div>
    );
  }

  if (error || !profile) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="glass-card rounded-2xl p-8 text-center space-y-4 max-w-sm w-full">
          <p className="text-sm text-red-400">❌ {error || "Profile not found"}</p>
          <button onClick={() => router.push("/")}
            className="btn-ghost w-full py-2.5 rounded-xl text-sm cursor-pointer">
            ← Back to Directory
          </button>
        </div>
      </div>
    );
  }

  const initials = profile.full_name ? profile.full_name.split(" ").map((n) => n[0]).join("").toUpperCase() : "?";
  const iconColor = "#f0a500";

  return (
    <div className="space-y-5 anim-fadeInUp">
      {/* Nav bar */}
      <div className="flex items-center justify-between">
        <button onClick={() => router.push("/")}
          className="flex items-center gap-2 text-sm text-gray-400 hover:text-white transition-colors cursor-pointer">
          <ArrowLeft size={14} /> Directory
        </button>
        <a
          href={profile.profile_id.startsWith("demo-") ? "#" : `${BASE}/profiles/${profile.profile_id}/resume`}
          target="_blank"
          onClick={() => profile.profile_id.startsWith("demo-") && alert("Demo resume download logged!")}
          className="btn-brand flex items-center gap-2 text-sm px-4 py-2 rounded-lg cursor-pointer"
        >
          <FileText size={14} /> Download Resume
        </a>
      </div>

      {/* Bento Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Avatar tile */}
        <div className="glass-card rounded-2xl p-6 flex flex-col items-center justify-center h-[220px] relative overflow-hidden">
          <div className="absolute inset-0 pointer-events-none"
            style={{ background: "radial-gradient(ellipse at 50% 0%, rgba(240,165,0,0.08), transparent 70%)" }} />
          <div
            className="w-24 h-24 rounded-2xl flex items-center justify-center text-2xl font-bold text-white relative z-10"
            style={{ background: "linear-gradient(135deg, rgba(240,165,0,0.25), rgba(240,24,112,0.2))", border: "1px solid rgba(240,165,0,0.25)" }}
          >
            {initials}
          </div>
          <div className="mt-4 text-xs px-3 py-1 rounded-full relative z-10"
            style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", color: "#9ca3af" }}>
            {profile.role_category || "Technical Team"}
          </div>
        </div>

        {/* Core info tile */}
        <div className="md:col-span-2 glass-card rounded-2xl p-6 flex flex-col justify-between min-h-[220px]">
          <div className="space-y-3">
            <div>
              <h1 className="text-xl font-bold text-white">{profile.full_name}</h1>
              <p className="text-sm text-gray-400 mt-0.5">{profile.tagline || "Oyster Kode Club Active Member"}</p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm text-gray-400">
              {profile.email && <div className="flex items-center gap-2"><Mail size={13} style={{ color: iconColor }} /><span className="truncate">{profile.email}</span></div>}
              {(profile.contact?.phone || profile.phone) && <div className="flex items-center gap-2"><Phone size={13} style={{ color: iconColor }} /><span>{profile.contact?.phone || profile.phone}</span></div>}
              {profile.college && <div className="flex items-center gap-2 col-span-full"><School size={13} style={{ color: iconColor }} /><span className="truncate">{profile.college}</span></div>}
              {profile.location && <div className="flex items-center gap-2"><MapPin size={13} style={{ color: iconColor }} /><span>{profile.location}</span></div>}
              {profile.yr_of_graduation && <div className="flex items-center gap-2"><GraduationCap size={13} style={{ color: iconColor }} /><span>Graduation: {profile.yr_of_graduation}</span></div>}
            </div>
          </div>
          <div className="border-t pt-4 mt-3 flex items-center justify-between" style={{ borderColor: "rgba(255,255,255,0.07)" }}>
            <div className="flex items-center gap-2">
              {profile.contact?.github && (
                <a href={profile.contact.github} target="_blank"
                  className="w-8 h-8 rounded-lg flex items-center justify-center transition-colors text-gray-400 hover:text-white"
                  style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)" }}>
                  <GithubIcon />
                </a>
              )}
              {profile.contact?.linkedin && (
                <a href={profile.contact.linkedin} target="_blank"
                  className="w-8 h-8 rounded-lg flex items-center justify-center transition-colors text-gray-400 hover:text-white"
                  style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)" }}>
                  <LinkedinIcon />
                </a>
              )}
              {profile.contact?.portfolio_url && (
                <a href={profile.contact.portfolio_url} target="_blank"
                  className="w-8 h-8 rounded-lg flex items-center justify-center transition-colors text-gray-400 hover:text-white"
                  style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)" }}>
                  <Globe size={13} />
                </a>
              )}
            </div>
            <span className="text-xs px-2.5 py-1 rounded-full" style={availabilityBadge(profile.availability)}>
              {profile.availability || "Offline"}
            </span>
          </div>
        </div>

        {/* Bio tile */}
        <div className="md:col-span-2 glass-card rounded-2xl p-5 space-y-3">
          <div className="section-header flex items-center gap-2">
            <Briefcase size={13} style={{ color: iconColor }} />
            <h2 className="section-title">Biography / Core Focus</h2>
          </div>
          <p className="text-sm text-gray-400 leading-relaxed">{profile.bio || "No biography added yet."}</p>
        </div>

        {/* Quality Index tile */}
        <div className="glass-card rounded-2xl p-5 flex flex-col justify-between">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <Sparkles size={13} style={{ color: iconColor }} />
              <h2 className="section-title">Quality Index</h2>
            </div>
            <p className="text-xs text-gray-500 leading-normal">Percentage of profile details, links, and projects configured.</p>
          </div>
          <div className="pt-4">
            <div className="flex items-end justify-between">
              <span className="text-sm text-gray-400">Completion</span>
              <span className="text-2xl font-bold" style={{ color: "#f0a500" }}>{profile.completion_percentage}%</span>
            </div>
            <div className="w-full rounded-full h-1.5 mt-2 overflow-hidden" style={{ background: "rgba(255,255,255,0.07)" }}>
              <div className="progress-brand h-1.5 rounded-full" style={{ width: `${profile.completion_percentage}%` }} />
            </div>
          </div>
        </div>

        {/* Achievements */}
        <div className="glass-card rounded-2xl p-5 space-y-3">
          <div className="section-header flex items-center gap-2">
            <Award size={13} style={{ color: iconColor }} />
            <h2 className="section-title">Achievements</h2>
          </div>
          <ul className="space-y-2.5">
            {profile.achievements && profile.achievements.length > 0 ? (
              profile.achievements.map((ach, i) => (
                <li key={i} className="text-sm text-gray-400 leading-relaxed border-l-2 pl-3"
                  style={{ borderColor: "rgba(240,165,0,0.4)" }}>{ach}</li>
              ))
            ) : (
              <li className="text-sm text-gray-600">No achievements listed yet.</li>
            )}
          </ul>
        </div>

        {/* Certifications */}
        <div className="glass-card rounded-2xl p-5 space-y-3">
          <div className="section-header flex items-center gap-2">
            <GraduationCap size={13} style={{ color: iconColor }} />
            <h2 className="section-title">Certifications</h2>
          </div>
          <ul className="space-y-2.5">
            {profile.certifications && profile.certifications.length > 0 ? (
              profile.certifications.map((cert, i) => (
                <li key={i} className="text-sm text-gray-400 leading-relaxed border-l-2 pl-3"
                  style={{ borderColor: "rgba(240,24,112,0.4)" }}>{cert}</li>
              ))
            ) : (
              <li className="text-sm text-gray-600">No certifications listed yet.</li>
            )}
          </ul>
        </div>

        {/* Skills */}
        <div className="glass-card rounded-2xl p-5 space-y-3">
          <div className="section-header flex items-center gap-2">
            <Sparkles size={13} style={{ color: iconColor }} />
            <h2 className="section-title">Verified Skills</h2>
          </div>
          <div className="flex flex-wrap gap-1.5 pt-1">
            {profile.skills && profile.skills.length > 0 ? (
              profile.skills.map((sk) => (
                <span key={sk.name} className="text-xs px-2.5 py-1 rounded"
                  style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", color: "#d1d5db" }}>
                  {sk.name} <span className="text-gray-600">({sk.level})</span>
                </span>
              ))
            ) : (
              <span className="text-sm text-gray-600">No skills associated yet.</span>
            )}
          </div>
        </div>

        {/* Projects full width */}
        <div className="col-span-1 md:col-span-3 glass-card rounded-2xl p-5 space-y-4">
          <div className="section-header flex items-center gap-2">
            <Briefcase size={13} style={{ color: iconColor }} />
            <h2 className="section-title">Projects Showcase</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {profile.projects && profile.projects.length > 0 ? (
              profile.projects.map((proj) => (
                <div key={proj.project_id}
                  className="rounded-xl p-4 space-y-3 transition-all"
                  style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}
                  onMouseEnter={(e) => (e.currentTarget.style.borderColor = "rgba(240,165,0,0.25)")}
                  onMouseLeave={(e) => (e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)")}
                >
                  <div>
                    <h3 className="text-sm font-semibold text-white">{proj.title}</h3>
                    <p className="text-xs text-gray-400 mt-1 leading-relaxed line-clamp-2">{proj.description}</p>
                  </div>
                  <div className="flex items-center justify-between border-t pt-2" style={{ borderColor: "rgba(255,255,255,0.07)" }}>
                    <span className="text-[10px] text-gray-600">{proj.tech_stack}</span>
                    <div className="flex gap-3 text-xs">
                      {proj.github_link && (
                        <a href={proj.github_link} target="_blank"
                          className="flex items-center gap-1 text-gray-400 hover:text-white transition-colors">
                          <GithubIcon /> GitHub
                        </a>
                      )}
                      {proj.demo_link && (
                        <a href={proj.demo_link} target="_blank"
                          className="transition-opacity hover:opacity-75" style={{ color: "#f0a500" }}>
                          Demo
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="col-span-full py-6 text-center text-sm text-gray-600">No projects showcased yet.</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
