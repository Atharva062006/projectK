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
    <rect x="2" y="9" width="4" height="12" />
    <circle cx="4" cy="4" r="2" />
  </svg>
);

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
  full_name: string;
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

// Complete mock detail profiles mapping for interactive demo
const MOCK_PROFILES_DETAIL: Record<string, ProfileData> = {
  "demo-1": {
    profile_id: "demo-1",
    full_name: "Atharva Kulkarni",
    email: "atharva@oysterkode.club",
    college: "Oyster Institute of Technology",
    tagline: "Full Stack Engineer & AI Enthusiast",
    bio: "Passionate software engineer specializing in building high-performance web applications and embedding machine learning models. Active open-source contributor and technical team lead at Oyster Kode Club. Exploring low-latency systems and distributed backend pipelines.",
    availability: "Available",
    department: "Core Team",
    role_category: "Core Team",
    location: "Mumbai, India",
    yr_of_graduation: 2026,
    completion_percentage: 95,
    contact: {
      phone: "+91 98765 43210",
      linkedin: "https://linkedin.com/in/atharva",
      github: "https://github.com/atharva",
      portfolio_url: "https://atharvak.dev"
    },
    skills: [
      { skill_id: "s1", name: "TypeScript", category: "Languages", level: "Expert" },
      { skill_id: "s2", name: "Next.js", category: "Frameworks", level: "Expert" },
      { skill_id: "s3", name: "Python", category: "Languages", level: "Expert" },
      { skill_id: "s4", name: "PostgreSQL", category: "Databases", level: "Intermediate" }
    ],
    achievements: [
      "Winner of National Hackathon 2025 (First Prize out of 500+ teams)",
      "Built and deployed Oyster Club Portal serving 1000+ active members",
      "Contributed 20+ PRs to major open-source web frameworks"
    ],
    certifications: [
      "AWS Certified Solutions Architect (Associate)",
      "Deep Learning Specialization by DeepLearning.AI",
      "Advanced Data Structures & Algorithms (Coursera)"
    ],
    projects: [
      {
        project_id: "p1",
        title: "Distributed Task Scheduler",
        description: "A high-performance cluster job queue built with Go and gRPC, capable of scheduling 10k jobs per second.",
        tech_stack: "Go, gRPC, Redis, Docker",
        github_link: "https://github.com/atharva/scheduler"
      },
      {
        project_id: "p2",
        title: "Bento Portfolio Portal",
        description: "A visual portfolio workspace designed with a modular bento grid layout to showcase member capabilities.",
        tech_stack: "React, Next.js, Tailwind CSS",
        github_link: "https://github.com/atharva/bento-portal"
      }
    ]
  },
  "demo-2": {
    profile_id: "demo-2",
    full_name: "Sneha Sharma",
    email: "sneha.s@oysterkode.club",
    college: "School of Design Studies",
    tagline: "UI/UX Designer & Frontend Developer",
    bio: "Focusing on crafting gorgeous, modern, and user-centric interfaces. Bridge the gap between engineering complexity and intuitive interaction designs. Experienced in React, Tailwind, Figma prototyping, and design systems.",
    availability: "Open to work",
    department: "Technical Team",
    role_category: "Technical Team",
    location: "Bangalore, India",
    yr_of_graduation: 2025,
    completion_percentage: 90,
    contact: {
      phone: "+91 87654 32109",
      linkedin: "https://linkedin.com/in/sneha",
      github: "https://github.com/sneha",
      portfolio_url: "https://sneha.design"
    },
    skills: [
      { skill_id: "s5", name: "Figma", category: "Design", level: "Expert" },
      { skill_id: "s6", name: "React.js", category: "Frameworks", level: "Expert" },
      { skill_id: "s7", name: "Tailwind CSS", category: "Libraries", level: "Expert" }
    ],
    achievements: [
      "Designed the official club brand guide and logo framework",
      "Honorable Mention at Global Interaction Design Awards 2025"
    ],
    certifications: [
      "Google UX Design Professional Certificate",
      "Interaction Design Foundation Certified Professional"
    ],
    projects: [
      {
        project_id: "p3",
        title: "Oyster Design System",
        description: "A comprehensive UI kit built on Tailwind for rapid frontend prototyping across all club tools.",
        tech_stack: "Figma, React, Tailwind",
        github_link: "https://github.com/sneha/oyster-ds"
      }
    ]
  },
  "demo-3": {
    profile_id: "demo-3",
    full_name: "Vikram Malhotra",
    email: "vikram@oysterkode.club",
    college: "Tech State College",
    tagline: "DevOps & Cloud Architect",
    bio: "Cloud enthusiast and system orchestrator. Interested in container networks, cluster automation, and scalable cluster monitoring systems. Built robust CI/CD deployment setups for several open source projects.",
    availability: "Busy",
    department: "Technical Team",
    role_category: "Technical Team",
    location: "Pune, India",
    yr_of_graduation: 2026,
    completion_percentage: 85,
    contact: {
      phone: "+91 76543 21098",
      linkedin: "https://linkedin.com/in/vikram",
      github: "https://github.com/vikram",
      portfolio_url: "https://vikram.io"
    },
    skills: [
      { skill_id: "s8", name: "Docker", category: "DevOps & Cloud", level: "Expert" },
      { skill_id: "s9", name: "Kubernetes", category: "DevOps & Cloud", level: "Intermediate" },
      { skill_id: "s10", name: "Amazon Web Services (AWS)", category: "DevOps & Cloud", level: "Expert" }
    ],
    achievements: [
      "Designed high-availability infrastructure serving 5k daily active users",
      "Reduced cloud computing costs by 35% using Kubernetes auto-scaling"
    ],
    projects: [
      {
        project_id: "p4",
        title: "K8s Auto-scaler Tool",
        description: "Custom auto-scaling daemon listening to system telemetry and adjusting cluster nodes metrics.",
        tech_stack: "Go, Kubernetes API, Prometheus",
        github_link: "https://github.com/vikram/autoscaler"
      }
    ]
  },
  "demo-4": {
    profile_id: "demo-4",
    full_name: "Rohan Das",
    email: "rohan@oysterkode.club",
    college: "Institute of Engineering",
    tagline: "ML Engineer | Embedded Systems Dev",
    bio: "Focused on deep learning pipelines, computer vision systems, and hardware acceleration for edge computing deployments. Bridging the gap between neural network complexity and resource-constrained edge platforms.",
    availability: "Available",
    department: "Technical Team",
    role_category: "Technical Team",
    location: "Delhi, India",
    yr_of_graduation: 2025,
    completion_percentage: 88,
    contact: {
      phone: "+91 65432 10987",
      linkedin: "https://linkedin.com/in/rohan",
      github: "https://github.com/rohan",
      portfolio_url: "https://rohan.ai"
    },
    skills: [
      { skill_id: "s11", name: "Python", category: "Languages", level: "Expert" },
      { skill_id: "s12", name: "C++", category: "Languages", level: "Expert" },
      { skill_id: "s13", name: "Embedded Systems", category: "Hardware & Systems", level: "Expert" }
    ],
    achievements: [
      "Optimized CNN models to achieve 40fps on edge Raspberry Pi devices",
      "Designed custom micro-controller shields for agricultural sensor arrays"
    ],
    projects: [
      {
        project_id: "p5",
        title: "EdgeVision Shield",
        description: "Custom firmware and model quantization pipeline for edge target inference processing.",
        tech_stack: "Python, C++, PyTorch, RTOS",
        github_link: "https://github.com/rohan/edgevision"
      }
    ]
  },
  "demo-5": {
    profile_id: "demo-5",
    full_name: "Ananya Iyer",
    email: "ananya@oysterkode.club",
    college: "National Tech Academy",
    tagline: "Systems Engineer & VLSI Designer",
    bio: "Systems architect specializing in hardware design description, gate arrays, and embedded platform layouts. Active alumni working in VLSI chip design tooling.",
    availability: "Available",
    department: "Alumni",
    role_category: "Alumni",
    location: "Chennai, India",
    yr_of_graduation: 2023,
    completion_percentage: 92,
    contact: {
      phone: "+91 54321 09876",
      linkedin: "https://linkedin.com/in/ananya",
      github: "https://github.com/ananya",
      portfolio_url: "https://ananya.systems"
    },
    skills: [
      { skill_id: "s14", name: "VHDL / Verilog", category: "Hardware & Systems", level: "Expert" },
      { skill_id: "s15", name: "C (Programming Language)", category: "Hardware & Systems", level: "Expert" },
      { skill_id: "s16", name: "VLSI Design", category: "Hardware & Systems", level: "Intermediate" }
    ],
    achievements: [
      "Successfully taped-out 8-bit educational processor core",
      "Authored research paper on FPGA hardware accelerators for neural nets"
    ],
    projects: [
      {
        project_id: "p6",
        title: "Oyster Core-8",
        description: "An open-source RISC-like 8-bit microprocessor soft-core designed in SystemVerilog.",
        tech_stack: "SystemVerilog, ModelSim, Quartus",
        github_link: "https://github.com/ananya/oyster-core8"
      }
    ]
  },
  "demo-6": {
    profile_id: "demo-6",
    full_name: "Rahul Verma",
    email: "rahul@oysterkode.club",
    college: "City Engineering College",
    tagline: "Backend Developer & Database Admin",
    bio: "Exploring multi-threaded database engines, performance optimizations, and cloud database integrations. Database administrator and backend query tuner.",
    availability: "Open to work",
    department: "Other Members",
    role_category: "Other Members",
    location: "Hyderabad, India",
    yr_of_graduation: 2026,
    completion_percentage: 80,
    contact: {
      phone: "+91 43210 98765",
      linkedin: "https://linkedin.com/in/rahul",
      github: "https://github.com/rahul",
      portfolio_url: "https://rahulverma.dev"
    },
    skills: [
      { skill_id: "s17", name: "Node.js", category: "Languages", level: "Expert" },
      { skill_id: "s18", name: "Express.js", category: "Frameworks", level: "Expert" },
      { skill_id: "s19", name: "PostgreSQL", category: "Databases", level: "Expert" }
    ],
    projects: [
      {
        project_id: "p7",
        title: "Multi-tenant DB Driver",
        description: "Custom pooling wrapper for PostgreSQL to optimize multi-tenant connection lifetimes.",
        tech_stack: "Node.js, PostgreSQL, Redis",
        github_link: "https://github.com/rahul/db-pool-wrapper"
      }
    ]
  }
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

    // Check if it is a demo fallback profile
    if (profileId.startsWith("demo-")) {
      const demoData = MOCK_PROFILES_DETAIL[profileId];
      if (demoData) {
        setProfile(demoData);
      } else {
        // Simple default demo profile
        setProfile({
          profile_id: profileId,
          full_name: "Club Member",
          tagline: "Engineering Showcase Profile",
          bio: "This is a preloaded profile showcase card.",
          availability: "Available",
          completion_percentage: 75
        });
      }
      setIsLoading(false);
    } else {
      // Fetch from backend API
      api.profile.getProfile(profileId)
        .then((res) => {
          if (res.ok && res.data) {
            setProfile(res.data as ProfileData);
          } else {
            setError(res.message || "Failed to load profile details");
          }
        })
        .catch(() => setError("Backend connection error"))
        .finally(() => setIsLoading(false));
    }
  }, [profileId]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#090a0f] text-gray-400 flex items-center justify-center font-mono text-sm">
        Loading bento profile details...
      </div>
    );
  }

  if (error || !profile) {
    return (
      <div className="min-h-screen bg-[#090a0f] text-gray-400 p-6 flex flex-col items-center justify-center">
        <div className="max-w-md w-full bg-[#0e1017] border border-gray-800 rounded-xl p-6 text-center space-y-4">
          <p className="text-red-400 font-mono text-sm">❌ Error: {error || "Profile not found"}</p>
          <button 
            onClick={() => router.push("/")}
            className="text-xs bg-[#1b1e2c] border border-gray-700 hover:bg-[#25293c] px-4 py-2 rounded-lg text-white font-mono transition-all"
          >
            &larr; Back to Directory
          </button>
        </div>
      </div>
    );
  }

  const initials = profile.full_name ? profile.full_name.split(" ").map(n => n[0]).join("").toUpperCase() : "?";

  return (
    <div className="min-h-screen bg-[#090a0f] text-gray-200 py-6">
      
      {/* Outer Border Wireframe wrapper */}
      <div className="border border-gray-800 rounded-xl overflow-hidden bg-[#0d0e15] shadow-2xl p-6 space-y-6">
        
        {/* Navigation & Header Actions */}
        <div className="flex items-center justify-between border-b border-gray-800 pb-4">
          <button 
            onClick={() => router.push("/")}
            className="flex items-center gap-2 text-xs font-mono text-gray-400 hover:text-white transition-colors"
          >
            <ArrowLeft size={14} />
            <span>Directory</span>
          </button>
          
          <a
            href={profile.profile_id.startsWith("demo-") ? "#" : `${BASE}/profiles/${profile.profile_id}/resume`}
            target="_blank"
            onClick={() => profile.profile_id.startsWith("demo-") && alert("Demo resume download logged! (Database logs resume_downloads for actual members)")}
            className="flex items-center gap-2 text-xs bg-blue-600 hover:bg-blue-500 hover:shadow-blue-900/40 px-4 py-2 rounded-lg text-white font-mono transition-all"
          >
            <FileText size={14} />
            <span>Download Resume</span>
          </a>
        </div>

        {/* BENTO GRID LAYOUT */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          
          {/* Tile 1: Photo / Avatar circular container (Row 1, Left) */}
          <div className="bg-[#0e1017] border border-gray-800 rounded-2xl p-6 flex flex-col items-center justify-center h-[240px] relative overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-600/10 to-transparent opacity-40" />
            <div className="w-28 h-28 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-950 border-4 border-[#0d0e15] flex items-center justify-center text-3xl font-mono font-bold text-white shadow-xl relative z-10">
              {initials}
            </div>
            <div className="mt-4 text-xs font-mono text-gray-400 bg-[#141620] px-3 py-1 rounded-full border border-gray-800 relative z-10">
              {profile.role_category || "Technical Team"}
            </div>
          </div>

          {/* Tile 2: Core info (Row 1, Right Span 2) */}
          <div className="md:col-span-2 bg-[#0e1017] border border-gray-800 rounded-2xl p-6 flex flex-col justify-between min-h-[240px]">
            <div className="space-y-3">
              <div>
                <h1 className="text-2xl font-bold text-white font-mono tracking-wide">{profile.full_name}</h1>
                <p className="text-xs text-gray-400 font-mono mt-1">{profile.tagline || "Oyster Kode Club Active Member"}</p>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs font-mono text-gray-400 pt-2">
                {profile.email && <div className="flex items-center gap-2"><span><Mail size={12} className="text-blue-400" /></span> <span>{profile.email}</span></div>}
                {(profile.contact?.phone || profile.phone) && <div className="flex items-center gap-2"><span><Phone size={12} className="text-blue-400" /></span> <span>{profile.contact?.phone || profile.phone}</span></div>}
                {profile.college && <div className="flex items-center gap-2 col-span-1 sm:col-span-2"><span><School size={12} className="text-blue-400" /></span> <span className="truncate">{profile.college}</span></div>}
                {profile.location && <div className="flex items-center gap-2"><span><MapPin size={12} className="text-blue-400" /></span> <span>{profile.location}</span></div>}
                {profile.yr_of_graduation && <div className="flex items-center gap-2"><span><GraduationCap size={12} className="text-blue-400" /></span> <span>Graduation: {profile.yr_of_graduation}</span></div>}
              </div>
            </div>

            {/* Social profiles clickable links */}
            <div className="border-t border-gray-800/80 pt-4 mt-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                {profile.contact?.github && (
                  <a href={profile.contact.github} target="_blank" className="w-8 h-8 rounded-lg bg-[#141520] hover:bg-[#1b1d2b] border border-gray-800 flex items-center justify-center text-gray-400 hover:text-white transition-colors">
                    <GithubIcon />
                  </a>
                )}
                {profile.contact?.linkedin && (
                  <a href={profile.contact.linkedin} target="_blank" className="w-8 h-8 rounded-lg bg-[#141520] hover:bg-[#1b1d2b] border border-gray-800 flex items-center justify-center text-gray-400 hover:text-white transition-colors">
                    <LinkedinIcon />
                  </a>
                )}
                {profile.contact?.portfolio_url && (
                  <a href={profile.contact.portfolio_url} target="_blank" className="w-8 h-8 rounded-lg bg-[#141520] hover:bg-[#1b1d2b] border border-gray-800 flex items-center justify-center text-gray-400 hover:text-white transition-colors">
                    <Globe size={14} />
                  </a>
                )}
              </div>

              <div className="flex items-center gap-2 text-right">
                <span className="text-[10px] font-mono text-gray-500">Status</span>
                <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full ${
                  profile.availability === "Available" ? "bg-green-950/80 text-green-300 border border-green-900" : "bg-gray-850 text-gray-400 border border-gray-800"
                }`}>{profile.availability || "Offline"}</span>
              </div>
            </div>
          </div>

          {/* Tile 3: Summary / Bio (Row 2, Full width or 2 Columns) */}
          <div className="md:col-span-2 bg-[#0e1017] border border-gray-800 rounded-2xl p-6 space-y-3">
            <div className="flex items-center gap-2 border-b border-gray-800/80 pb-2">
              <Briefcase size={14} className="text-blue-400" />
              <h2 className="text-xs font-mono font-bold tracking-wider uppercase text-gray-400">Biography / Core Focus</h2>
            </div>
            <p className="text-xs font-mono leading-relaxed text-gray-400">{profile.bio || "No biography details added to this profile yet."}</p>
          </div>

          {/* Tile 4: Dynamic completion (Row 2, Right Tile) */}
          <div className="bg-[#0e1017] border border-gray-800 rounded-2xl p-6 flex flex-col justify-between">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Sparkles size={14} className="text-blue-400" />
                <h2 className="text-xs font-mono font-bold tracking-wider uppercase text-gray-400">Quality Index</h2>
              </div>
              <p className="text-[11px] font-mono text-gray-500 leading-normal">Percentage of details, contact links, and projects set up by this user.</p>
            </div>
            <div className="pt-4">
              <div className="flex items-end justify-between font-mono">
                <span className="text-xs text-gray-400">Completion</span>
                <span className="text-xl font-bold text-blue-400">{profile.completion_percentage}%</span>
              </div>
              <div className="w-full bg-gray-800 rounded-full h-2 mt-1.5 overflow-hidden">
                <div className="bg-blue-600 h-2 rounded-full transition-all duration-500" style={{ width: `${profile.completion_percentage}%` }} />
              </div>
            </div>
          </div>

          {/* Tile 5: Achievements (Row 3, Left) */}
          <div className="bg-[#0e1017] border border-gray-800 rounded-2xl p-6 space-y-3">
            <div className="flex items-center gap-2 border-b border-gray-800/80 pb-2">
              <Award size={14} className="text-blue-400" />
              <h2 className="text-xs font-mono font-bold tracking-wider uppercase text-gray-400">Achievements</h2>
            </div>
            <ul className="space-y-2.5">
              {profile.achievements && profile.achievements.length > 0 ? (
                profile.achievements.map((ach, i) => (
                  <li key={i} className="text-[11px] font-mono text-gray-400 leading-relaxed border-l-2 border-blue-500/40 pl-2">
                    {ach}
                  </li>
                ))
              ) : (
                <li className="text-[11px] font-mono text-gray-500">No achievements populated yet.</li>
              )}
            </ul>
          </div>

          {/* Tile 6: Certifications (Row 3, Middle) */}
          <div className="bg-[#0e1017] border border-gray-800 rounded-2xl p-6 space-y-3">
            <div className="flex items-center gap-2 border-b border-gray-800/80 pb-2">
              <GraduationCap size={14} className="text-blue-400" />
              <h2 className="text-xs font-mono font-bold tracking-wider uppercase text-gray-400">Certifications</h2>
            </div>
            <ul className="space-y-2.5">
              {profile.certifications && profile.certifications.length > 0 ? (
                profile.certifications.map((cert, i) => (
                  <li key={i} className="text-[11px] font-mono text-gray-400 leading-relaxed border-l-2 border-indigo-500/40 pl-2">
                    {cert}
                  </li>
                ))
              ) : (
                <li className="text-[11px] font-mono text-gray-500">No certifications listed yet.</li>
              )}
            </ul>
          </div>

          {/* Tile 7: Core Tech Stack Skills (Row 3, Right) */}
          <div className="bg-[#0e1017] border border-gray-800 rounded-2xl p-6 space-y-3">
            <div className="flex items-center gap-2 border-b border-gray-800/80 pb-2">
              <Sparkles size={14} className="text-blue-400" />
              <h2 className="text-xs font-mono font-bold tracking-wider uppercase text-gray-400">Verified Skills</h2>
            </div>
            <div className="flex flex-wrap gap-1.5 pt-1">
              {profile.skills && profile.skills.length > 0 ? (
                profile.skills.map(sk => (
                  <span 
                    key={sk.name} 
                    className="text-[10px] font-mono bg-[#141620] text-gray-300 px-2.5 py-1 rounded border border-gray-800"
                  >
                    {sk.name} <span className="text-[9px] text-gray-500">({sk.level})</span>
                  </span>
                ))
              ) : (
                <span className="text-[11px] font-mono text-gray-500">No skills associated yet.</span>
              )}
            </div>
          </div>

          {/* Tile 8: Projects Showcase Grid (Row 4, Spans all columns) */}
          <div className="col-span-1 md:col-span-3 bg-[#0e1017] border border-gray-800 rounded-2xl p-6 space-y-4">
            <div className="flex items-center gap-2 border-b border-gray-800/80 pb-2">
              <Briefcase size={14} className="text-blue-400" />
              <h2 className="text-xs font-mono font-bold tracking-wider uppercase text-gray-400">Projects Showcase</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {profile.projects && profile.projects.length > 0 ? (
                profile.projects.map(proj => (
                  <div key={proj.project_id} className="bg-[#11131c] border border-gray-800 hover:border-gray-700 p-4 rounded-xl space-y-3 transition-colors">
                    <div>
                      <h3 className="text-sm font-semibold text-white font-mono">{proj.title}</h3>
                      <p className="text-[11px] text-gray-400 font-mono mt-1 leading-relaxed line-clamp-2">{proj.description}</p>
                    </div>
                    
                    <div className="flex items-center justify-between border-t border-gray-800/50 pt-2 mt-2">
                      <span className="text-[9px] font-mono text-gray-500">{proj.tech_stack}</span>
                      <div className="flex gap-2">
                        {proj.github_link && (
                          <a href={proj.github_link} target="_blank" className="text-[10px] font-mono text-blue-500 hover:underline">
                            GitHub
                          </a>
                        )}
                        {proj.demo_link && (
                          <a href={proj.demo_link} target="_blank" className="text-[10px] font-mono text-purple-500 hover:underline">
                            Demo Link
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="col-span-full py-4 text-center text-xs font-mono text-gray-500">No project showcases populated.</div>
              )}
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
