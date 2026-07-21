"use client";
import { useEffect, useState, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Search, Filter, LayoutGrid, CheckSquare, Square, RefreshCw } from "lucide-react";
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

  const activeProfiles = useMock ? MOCK_PROFILES : dbProfiles;
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

  const availabilityBadgeStyle = (av: string) => {
    if (av === "Available") return { background: "rgba(34,197,94,0.1)", border: "1px solid rgba(34,197,94,0.25)", color: "#22c55e" };
    if (av === "Busy") return { background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.25)", color: "#ef4444" };
    return { background: "rgba(240,165,0,0.1)", border: "1px solid rgba(240,165,0,0.25)", color: "#f0a500" };
  };

  return (
    <div className="min-h-screen">
      <div className="glass-card rounded-2xl overflow-hidden">
        <div className="grid grid-cols-1 lg:grid-cols-4 min-h-[680px]">

          {/* ── Sidebar Filters ── */}
          <div className="glass-panel border-r p-5 space-y-5">
            <div className="section-header flex items-center gap-2">
              <Filter size={14} style={{ color: "#f0a500" }} />
              <h2 className="section-title !mb-0">Filters</h2>
              <button
                onClick={fetchProfiles}
                className="ml-auto text-gray-500 hover:text-gray-300 transition-colors p-1 cursor-pointer"
                title="Refresh data"
              >
                <RefreshCw size={12} className={isLoading ? "animate-spin" : ""} />
              </button>
            </div>

            {/* Role Categories */}
            <div className="space-y-1">
              <h3 className="text-xs text-gray-500 font-semibold mb-2">Role Category</h3>
              {categoriesList.map((cat) => {
                const checked = selectedCategories.includes(cat);
                return (
                  <div key={cat} onClick={() => toggleCategory(cat)}
                    className="flex items-center gap-2.5 text-sm text-gray-400 hover:text-white cursor-pointer select-none py-1 transition-colors">
                    {checked
                      ? <CheckSquare size={14} style={{ color: "#f0a500" }} />
                      : <Square size={14} className="text-gray-500" />}
                    <span>{cat}</span>
                  </div>
                );
              })}
            </div>

            {/* Availability */}
            <div className="section-header pt-3 space-y-1">
              <h3 className="text-xs text-gray-500 font-semibold mb-2">Availability</h3>
              {availabilityOptions.map((av) => {
                const checked = selectedAvailability.includes(av);
                return (
                  <div key={av} onClick={() => toggleAvailability(av)}
                    className="flex items-center gap-2.5 text-sm text-gray-400 hover:text-white cursor-pointer select-none py-1 transition-colors">
                    {checked
                      ? <CheckSquare size={14} style={{ color: "#f0a500" }} />
                      : <Square size={14} className="text-gray-500" />}
                    <span>{av}</span>
                  </div>
                );
              })}
            </div>

            {/* Skills */}
            <div className="section-header pt-3 space-y-2">
              <h3 className="text-xs text-gray-500 font-semibold mb-2">Skills</h3>
              <div className="flex flex-wrap gap-1.5">
                {commonSkills.map((sk) => {
                  const active = selectedSkills.includes(sk);
                  return (
                    <button key={sk} onClick={() => toggleSkill(sk)}
                      className="text-xs px-2.5 py-1 rounded-full border transition-all cursor-pointer"
                      style={active
                        ? { background: "rgba(240,165,0,0.12)", borderColor: "rgba(240,165,0,0.4)", color: "#f0a500" }
                        : { background: "rgba(255,255,255,0.04)", borderColor: "rgba(255,255,255,0.1)", color: "#6b7280" }}
                    >
                      {sk}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Data source tag */}
            <div className="section-header pt-3 !mb-0">
              <div className="glass-panel rounded-lg p-3 text-xs text-gray-500 space-y-1">
                <div>Source: {useMock ? <span className="text-yellow-500 font-medium">Demo Fallback</span> : <span className="text-green-500 font-medium">Live API</span>}</div>
                <div>{activeProfiles.length} profiles loaded</div>
              </div>
            </div>
          </div>

          {/* ── Main Panel ── */}
          <div className="col-span-3 p-5 flex flex-col gap-5">
            {/* Search */}
            <div className="glass-panel flex items-center gap-3 rounded-xl px-4 py-2.5">
              <Search size={16} className="text-gray-500 flex-shrink-0" />
              <input
                type="text"
                placeholder="Search by name, tagline, or tech stack..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-transparent border-none outline-none text-sm text-gray-200 w-full placeholder-gray-500"
              />
            </div>

            {/* Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 flex-1">
              {filteredProfiles.length === 0 ? (
                <div className="col-span-full flex flex-col items-center justify-center py-20 text-center space-y-3">
                  <LayoutGrid size={30} className="text-gray-500" />
                  <p className="text-sm text-gray-500">No profiles match the current filters</p>
                </div>
              ) : (
                filteredProfiles.map((p, i) => {
                  const initials = p.full_name ? p.full_name.split(" ").map((n) => n[0]).join("").toUpperCase() : "?";
                  return (
                    <Link
                      href={`/profiles/${p.profile_id}`}
                      key={p.profile_id}
                      className={`glass-card glass-card-hover group block rounded-xl p-4 flex flex-col justify-between h-[200px] transition-all anim-fadeInUp anim-delay-${Math.min(i + 1, 8)}`}
                    >
                      <div className="space-y-3">
                        <div className="flex items-center gap-3">
                          <div
                            className="w-10 h-10 rounded-xl flex items-center justify-center text-sm font-bold text-white flex-shrink-0"
                            style={{ background: "linear-gradient(135deg, rgba(240,165,0,0.25), rgba(240,24,112,0.2))", border: "1px solid rgba(240,165,0,0.2)" }}
                          >
                            {initials}
                          </div>
                          <div className="min-w-0">
                            <h3 className="font-semibold text-sm text-white group-hover:text-[#f0a500] transition-colors truncate">{p.full_name}</h3>
                            <p className="text-xs text-gray-400 mt-0.5 line-clamp-1">{p.tagline}</p>
                          </div>
                        </div>
                        <p className="text-xs text-gray-500">{p.department || "Technical Team"}</p>
                      </div>

                      <div className="section-header pt-3 space-y-2 !mb-0">
                        <div className="flex flex-wrap gap-1">
                          {p.skills?.slice(0, 3).map((sk) => (
                            <span key={sk.name} className="glass-panel text-[10px] px-2 py-0.5 rounded text-gray-400">
                              {sk.name}
                            </span>
                          ))}
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] px-2 py-0.5 rounded-full font-medium" style={availabilityBadgeStyle(p.availability)}>
                            {p.availability}
                          </span>
                          <span className="text-xs text-gray-500 group-hover:text-[#f0a500] transition-colors">
                            View →
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
      <div className="min-h-screen flex items-center justify-center text-sm text-gray-500">
        Loading member directory...
      </div>
    }>
      <DirectoryContent />
    </Suspense>
  );
}
