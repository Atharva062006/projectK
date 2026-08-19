"use client";
import { useEffect, useState, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Search, Filter, LayoutGrid, CheckSquare, Square, RefreshCw, Terminal, ArrowUpRight, UserCheck } from "lucide-react";
import { api } from "@/lib/api";

interface ProfileCard {
  profile_id: string;
  full_name: string;
  tagline: string;
  availability: string;
  department: string;
  role_category: string;
  role: string;
  skills: { name: string; level: string }[];
}

interface DirectoryGroups {
  "Core Team": ProfileCard[];
  "Technical Team": ProfileCard[];
  "Other Members": ProfileCard[];
  "Alumni": ProfileCard[];
}

const MOCK_PROFILES: ProfileCard[] = [
  { profile_id: "demo-1", full_name: "Atharva Kulkarni", tagline: "Full Stack Engineer & AI Enthusiast", availability: "Available", department: "Core Team", role_category: "Core Team", role: "member", skills: [{ name: "TypeScript", level: "Expert" }, { name: "Next.js", level: "Expert" }, { name: "PostgreSQL", level: "Intermediate" }] },
  { profile_id: "demo-2", full_name: "Sneha Sharma", tagline: "UI/UX Designer & Frontend Developer", availability: "Open to work", department: "Technical Team", role_category: "Technical Team", role: "member", skills: [{ name: "Figma", level: "Expert" }, { name: "React.js", level: "Expert" }, { name: "HTML5/CSS3", level: "Expert" }] },
  { profile_id: "demo-3", full_name: "Vikram Malhotra", tagline: "DevOps & Cloud Architect", availability: "Busy", department: "Technical Team", role_category: "Technical Team", role: "member", skills: [{ name: "Docker", level: "Expert" }, { name: "Kubernetes", level: "Intermediate" }, { name: "AWS", level: "Expert" }] },
  { profile_id: "demo-4", full_name: "Rohan Das", tagline: "ML Engineer | Embedded Systems Dev", availability: "Available", department: "Technical Team", role_category: "Technical Team", role: "member", skills: [{ name: "Python", level: "Expert" }, { name: "C++", level: "Expert" }, { name: "Embedded Systems", level: "Expert" }] },
  { profile_id: "demo-5", full_name: "Ananya Iyer", tagline: "Systems Engineer & VLSI Designer", availability: "Available", department: "Alumni", role_category: "Alumni", role: "alumni", skills: [{ name: "Verilog", level: "Expert" }, { name: "C (Programming Language)", level: "Expert" }, { name: "VLSI Design", level: "Intermediate" }] },
  { profile_id: "demo-6", full_name: "Rahul Verma", tagline: "Backend Developer & Database Admin", availability: "Open to work", department: "Other Members", role_category: "Other Members", role: "member", skills: [{ name: "Node.js", level: "Expert" }, { name: "Express.js", level: "Expert" }, { name: "PostgreSQL", level: "Expert" }] },
];

function DirectoryContent() {
  const searchParams = useSearchParams();
  const initialQuery = searchParams.get("search") || "";

  const [searchQuery, setSearchQuery] = useState(initialQuery);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedAvailability, setSelectedAvailability] = useState<string[]>([]);
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);
  const [dbProfiles, setDbProfiles] = useState<ProfileCard[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [useMock, setUseMock] = useState(false);

  useEffect(() => {
    if (initialQuery) setSearchQuery(initialQuery);
  }, [initialQuery]);

  const fetchProfiles = async () => {
    setIsLoading(true);
    try {
      const res = await api.directory.search({});
      if (res.ok && res.data) {
        const grouped = res.data as DirectoryGroups;
        const flattened: ProfileCard[] = [];
        Object.values(grouped).forEach((list) => { if (Array.isArray(list)) flattened.push(...list); });
        setDbProfiles(flattened);
        setUseMock(flattened.length === 0);
      } else setUseMock(true);
    } catch { setUseMock(true); }
    finally { setIsLoading(false); }
  };

  useEffect(() => { fetchProfiles(); }, []);

  const cleanDbProfiles = dbProfiles.filter(
    (p) => p.full_name && !p.full_name.toLowerCase().includes("xyz")
  );

  const activeProfiles = [...cleanDbProfiles, ...MOCK_PROFILES];
  const categoriesList = ["Core Team", "Technical Team", "Other Members", "Alumni"];
  const availabilityOptions = ["Available", "Busy", "Open to work"];
  const commonSkills = ["TypeScript", "Next.js", "Python", "Docker", "Figma", "C++"];

  const toggleCategory = (cat: string) => setSelectedCategories((p) => p.includes(cat) ? p.filter((c) => c !== cat) : [...p, cat]);
  const toggleAvailability = (av: string) => setSelectedAvailability((p) => p.includes(av) ? p.filter((a) => a !== av) : [...p, av]);
  const toggleSkill = (sk: string) => setSelectedSkills((p) => p.includes(sk) ? p.filter((s) => s !== sk) : [...p, sk]);

  const filteredProfiles = activeProfiles.filter((p) => {
    if (searchQuery.trim()) {
      const s = searchQuery.toLowerCase();
      if (!p.full_name?.toLowerCase().includes(s) && !p.tagline?.toLowerCase().includes(s) && !p.skills?.some((sk) => sk.name.toLowerCase().includes(s))) return false;
    }
    if (selectedCategories.length > 0 && !selectedCategories.includes(p.role_category)) return false;
    if (selectedAvailability.length > 0 && !selectedAvailability.includes(p.availability)) return false;
    if (selectedSkills.length > 0 && !selectedSkills.every((sKey) => p.skills?.some((sk) => sk.name.toLowerCase() === sKey.toLowerCase()))) return false;
    return true;
  });

  const getBadgeClass = (av: string) => {
    if (av === "Available") return "neo-badge neo-badge-green";
    if (av === "Busy") return "neo-badge neo-badge-red";
    return "neo-badge neo-badge-amber";
  };

  return (
    <div className="min-h-screen">
      <div className="neo-card rounded-xl overflow-hidden border-2 border-slate-800 shadow-neo">
        <div className="grid grid-cols-1 lg:grid-cols-4 min-h-[700px]">

          {/* ── Sidebar Filters (Neobrutalist Panel) ── */}
          <div className="p-5 space-y-6 border-b lg:border-b-0 lg:border-r border-slate-800 bg-tech-grid">
            <div className="section-header flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <Filter size={15} className="text-amber-400" />
                <h2 className="font-mono font-bold text-sm uppercase tracking-wider">[ RECRUIT FILTERS ]</h2>
              </div>
              <button
                onClick={fetchProfiles}
                className="text-slate-400 hover:text-amber-400 transition-colors p-1 cursor-pointer"
                title="Refresh talent directory"
              >
                <RefreshCw size={13} className={isLoading ? "animate-spin" : ""} />
              </button>
            </div>

            {/* Role Categories */}
            <div className="space-y-2">
              <h3 className="text-xs font-mono font-bold uppercase text-slate-400">[ TEAM CATEGORY ]</h3>
              {categoriesList.map((cat) => {
                const checked = selectedCategories.includes(cat);
                return (
                  <div key={cat} onClick={() => toggleCategory(cat)}
                    className="flex items-center gap-2.5 font-mono text-xs text-slate-300 hover:text-white cursor-pointer select-none py-1 transition-colors">
                    {checked
                      ? <CheckSquare size={14} className="text-amber-400" />
                      : <Square size={14} className="text-slate-600" />}
                    <span>{cat}</span>
                  </div>
                );
              })}
            </div>

            {/* Availability */}
            <div className="pt-4 border-t border-slate-800 space-y-2">
              <h3 className="text-xs font-mono font-bold uppercase text-slate-400">[ STATUS & AVAILABILITY ]</h3>
              {availabilityOptions.map((av) => {
                const checked = selectedAvailability.includes(av);
                return (
                  <div key={av} onClick={() => toggleAvailability(av)}
                    className="flex items-center gap-2.5 font-mono text-xs text-slate-300 hover:text-white cursor-pointer select-none py-1 transition-colors">
                    {checked
                      ? <CheckSquare size={14} className="text-amber-400" />
                      : <Square size={14} className="text-slate-600" />}
                    <span>{av}</span>
                  </div>
                );
              })}
            </div>

            {/* Skills Filter */}
            <div className="pt-4 border-t border-slate-800 space-y-2">
              <h3 className="text-xs font-mono font-bold uppercase text-slate-400">[ TECH STACK FILTER ]</h3>
              <div className="flex flex-wrap gap-1.5">
                {commonSkills.map((sk) => {
                  const active = selectedSkills.includes(sk);
                  return (
                    <button key={sk} onClick={() => toggleSkill(sk)}
                      className={`neo-badge cursor-pointer transition-all ${active ? "neo-badge-amber" : "text-slate-400 border-slate-800"}`}
                    >
                      {sk}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* System Status Pill */}
            <div className="pt-4 border-t border-slate-800">
              <div className="neo-card rounded-lg p-3 text-xs font-mono space-y-1 bg-slate-950/60 border border-slate-800">
                <div className="flex justify-between items-center">
                  <span className="text-slate-500">INDEX:</span>
                  <span className="font-bold text-amber-400">{filteredProfiles.length} PROFILES</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-500">SOURCE:</span>
                  <span className="font-bold text-emerald-400">{useMock ? "OFFLINE DEMO" : "LIVE VERIFIED"}</span>
                </div>
              </div>
            </div>
          </div>

          {/* ── Main Talent Cards Panel ── */}
          <div className="col-span-3 p-6 flex flex-col gap-6">
            
            {/* Search Input */}
            <div className="flex items-center gap-3 neo-card rounded-xl px-4 py-3 border-2 border-slate-800 shadow-neo-sm">
              <Search size={18} className="text-amber-400 flex-shrink-0" />
              <input
                type="text"
                placeholder="Search talent by name, role, skills (e.g. Next.js, Python, Verilog)..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-transparent border-none outline-none font-mono text-sm text-slate-100 w-full placeholder-slate-500"
              />
            </div>

            {/* Profile Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 flex-1">
              {filteredProfiles.length === 0 ? (
                <div className="col-span-full flex flex-col items-center justify-center py-24 text-center space-y-3 neo-card rounded-xl border border-slate-800">
                  <LayoutGrid size={36} className="text-slate-600" />
                  <p className="font-mono text-sm text-slate-400">[ NO MATCHING TALENT PROFILES FOUND ]</p>
                  <p className="text-xs text-slate-500">Try clearing query parameters or selecting different skills.</p>
                </div>
              ) : (
                filteredProfiles.map((p, i) => {
                  const initials = p.full_name ? p.full_name.split(" ").map((n) => n[0]).join("").toUpperCase() : "?";
                  return (
                    <Link
                      href={`/profiles/${p.profile_id}`}
                      key={p.profile_id}
                      className={`neo-card neo-card-hover rounded-xl p-5 border border-slate-800 flex flex-col justify-between min-h-[255px] h-full overflow-hidden transition-all anim-fadeInUp anim-delay-${Math.min(i + 1, 8)}`}
                    >
                      <div className="space-y-3">
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-lg flex items-center justify-center font-mono text-xs font-bold text-white flex-shrink-0 brand-gradient shadow-neo-sm">
                              {initials}
                            </div>
                            <div className="min-w-0">
                              <h3 className="font-mono font-bold text-sm text-slate-100 group-hover:text-amber-400 transition-colors truncate">{p.full_name}</h3>
                              <p className="text-xs text-slate-400 line-clamp-1">{p.tagline}</p>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="neo-badge neo-badge-pink text-[10px]">{p.department || "Technical Team"}</span>
                        </div>
                      </div>

                      {/* Skills & Action */}
                      <div className="pt-3 border-t border-slate-800/80 space-y-3 mt-auto">
                        <div className="flex flex-wrap gap-1">
                          {p.skills?.slice(0, 3).map((sk) => (
                            <span key={sk.name} className="neo-badge text-[10px] text-slate-400 border-slate-800 bg-slate-900/60 max-w-[145px] truncate" title={sk.name}>
                              {sk.name}
                            </span>
                          ))}
                        </div>
                        <div className="flex items-center justify-between pt-1">
                          <span className={getBadgeClass(p.availability)}>[ {(p.availability || "Available").toUpperCase()} ]</span>
                          <span className="font-mono text-xs font-bold text-amber-400 flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                            PORTFOLIO <ArrowUpRight size={13} />
                          </span>
                        </div>
                      </div>
                    </Link>
                  );
                })
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function DirectoryPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center font-mono text-sm text-amber-400">
        [ LOADING TALENT DIRECTORY... ]
      </div>
    }>
      <DirectoryContent />
    </Suspense>
  );
}
