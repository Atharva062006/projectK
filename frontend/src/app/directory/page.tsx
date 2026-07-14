"use client";
import { useEffect, useState, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Search, User, Filter, LayoutGrid, CheckSquare, Square, RefreshCw } from "lucide-react";
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

// Gorgeous fallback data for high-fidelity demo
const MOCK_PROFILES: ProfileCard[] = [
  {
    profile_id: "demo-1",
    full_name: "Atharva Kulkarni",
    tagline: "Full Stack Engineer & AI Enthusiast",
    availability: "Available",
    department: "Core Team",
    role_category: "Core Team",
    role: "member",
    skills: [{ name: "TypeScript", level: "Expert" }, { name: "Next.js", level: "Expert" }, { name: "PostgreSQL", level: "Intermediate" }]
  },
  {
    profile_id: "demo-2",
    full_name: "Sneha Sharma",
    tagline: "UI/UX Designer & Frontend Developer",
    availability: "Open to work",
    department: "Technical Team",
    role_category: "Technical Team",
    role: "member",
    skills: [{ name: "Figma", level: "Expert" }, { name: "React.js", level: "Expert" }, { name: "HTML5/CSS3", level: "Expert" }]
  },
  {
    profile_id: "demo-3",
    full_name: "Vikram Malhotra",
    tagline: "DevOps & Cloud Architect",
    availability: "Busy",
    department: "Technical Team",
    role_category: "Technical Team",
    role: "member",
    skills: [{ name: "Docker", level: "Expert" }, { name: "Kubernetes", level: "Intermediate" }, { name: "AWS", level: "Expert" }]
  },
  {
    profile_id: "demo-4",
    full_name: "Rohan Das",
    tagline: "ML Engineer | Embedded Systems Dev",
    availability: "Available",
    department: "Technical Team",
    role_category: "Technical Team",
    role: "member",
    skills: [{ name: "Python", level: "Expert" }, { name: "C++", level: "Expert" }, { name: "Embedded Systems", level: "Expert" }]
  },
  {
    profile_id: "demo-5",
    full_name: "Ananya Iyer",
    tagline: "Systems Engineer & VLSI Designer",
    availability: "Available",
    department: "Alumni",
    role_category: "Alumni",
    role: "alumni",
    skills: [{ name: "Verilog", level: "Expert" }, { name: "C (Programming Language)", level: "Expert" }, { name: "VLSI Design", level: "Intermediate" }]
  },
  {
    profile_id: "demo-6",
    full_name: "Rahul Verma",
    tagline: "Backend Developer & Database Admin",
    availability: "Open to work",
    department: "Other Members",
    role_category: "Other Members",
    role: "member",
    skills: [{ name: "Node.js", level: "Expert" }, { name: "Express.js", level: "Expert" }, { name: "PostgreSQL", level: "Expert" }]
  }
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

  // Update query state if search parameter changes
  useEffect(() => {
    if (initialQuery) {
      setSearchQuery(initialQuery);
    }
  }, [initialQuery]);

  const fetchProfiles = async () => {
    setIsLoading(true);
    try {
      const res = await api.directory.search({});
      if (res.ok && res.data) {
        const grouped = res.data as DirectoryGroups;
        const flattened: ProfileCard[] = [];
        Object.values(grouped).forEach(list => {
          if (Array.isArray(list)) {
            flattened.push(...list);
          }
        });
        setDbProfiles(flattened);
        setUseMock(flattened.length === 0);
      } else {
        setUseMock(true);
      }
    } catch {
      setUseMock(true);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProfiles();
  }, []);

  const activeProfiles = useMock ? MOCK_PROFILES : dbProfiles;

  // Filter Categories
  const categoriesList = ["Core Team", "Technical Team", "Other Members", "Alumni"];
  // Filter Availabilities
  const availabilityOptions = ["Available", "Busy", "Open to work"];
  // Filter Skills
  const commonSkills = ["TypeScript", "Next.js", "Python", "Docker", "Figma", "C++"];

  const toggleCategory = (cat: string) => {
    setSelectedCategories(prev =>
      prev.includes(cat) ? prev.filter(c => c !== cat) : [...prev, cat]
    );
  };

  const toggleAvailability = (av: string) => {
    setSelectedAvailability(prev =>
      prev.includes(av) ? prev.filter(a => a !== av) : [...prev, av]
    );
  };

  const toggleSkill = (skill: string) => {
    setSelectedSkills(prev =>
      prev.includes(skill) ? prev.filter(s => s !== skill) : [...prev, skill]
    );
  };

  // Filter profiles on frontend dynamically for smooth responsive search
  const filteredProfiles = activeProfiles.filter(p => {
    if (searchQuery.trim() !== "") {
      const s = searchQuery.toLowerCase();
      const matchesName = p.full_name?.toLowerCase().includes(s);
      const matchesTagline = p.tagline?.toLowerCase().includes(s);
      const matchesSkills = p.skills?.some(sk => sk.name.toLowerCase().includes(s));
      if (!matchesName && !matchesTagline && !matchesSkills) return false;
    }
    if (selectedCategories.length > 0 && !selectedCategories.includes(p.role_category)) {
      return false;
    }
    if (selectedAvailability.length > 0 && !selectedAvailability.includes(p.availability)) {
      return false;
    }
    if (selectedSkills.length > 0) {
      const hasAllSkills = selectedSkills.every(sKey =>
        p.skills?.some(sk => sk.name.toLowerCase() === sKey.toLowerCase())
      );
      if (!hasAllSkills) return false;
    }
    return true;
  });

  return (
    <div className="min-h-screen bg-[#090a0f] text-gray-200">
      <div className="border border-gray-800 rounded-xl overflow-hidden bg-[#0d0e15] shadow-2xl">
        <div className="grid grid-cols-1 lg:grid-cols-4 min-h-[750px]">
          
          {/* LEFT SIDEBAR - FILTERS */}
          <div className="border-r border-gray-800 p-6 bg-[#0c0d13] space-y-6">
            <div className="flex items-center gap-2 border-b border-gray-800 pb-3">
              <Filter size={14} className="text-blue-400" />
              <h2 className="text-xs font-mono font-bold tracking-wider uppercase text-gray-400">Filters</h2>
              <button 
                onClick={fetchProfiles} 
                className="ml-auto text-xs text-gray-500 hover:text-blue-400 p-1 transition-colors"
                title="Sync database data"
              >
                <RefreshCw size={12} className={isLoading ? "animate-spin" : ""} />
              </button>
            </div>

            {/* Role Categories */}
            <div className="space-y-2">
              <h3 className="text-xs font-mono text-gray-400 font-semibold mb-2">Role Category</h3>
              {categoriesList.map(cat => {
                const checked = selectedCategories.includes(cat);
                return (
                  <div 
                    key={cat} 
                    onClick={() => toggleCategory(cat)}
                    className="flex items-center gap-2.5 text-xs text-gray-400 hover:text-white cursor-pointer select-none py-1"
                  >
                    {checked ? (
                      <CheckSquare size={14} className="text-blue-500 fill-blue-950" />
                    ) : (
                      <Square size={14} className="text-gray-600" />
                    )}
                    <span className="font-mono">{cat}</span>
                  </div>
                );
              })}
            </div>

            {/* Availability */}
            <div className="space-y-2 pt-2 border-t border-gray-800">
              <h3 className="text-xs font-mono text-gray-400 font-semibold mb-2">Availability</h3>
              {availabilityOptions.map(av => {
                const checked = selectedAvailability.includes(av);
                return (
                  <div 
                    key={av} 
                    onClick={() => toggleAvailability(av)}
                    className="flex items-center gap-2.5 text-xs text-gray-400 hover:text-white cursor-pointer select-none py-1"
                  >
                    {checked ? (
                      <CheckSquare size={14} className="text-blue-500 fill-blue-950" />
                    ) : (
                      <Square size={14} className="text-gray-600" />
                    )}
                    <span className="font-mono">{av}</span>
                  </div>
                );
              })}
            </div>

            {/* Core Tech Stack */}
            <div className="space-y-2 pt-2 border-t border-gray-800">
              <h3 className="text-xs font-mono text-gray-400 font-semibold mb-2">Skills</h3>
              <div className="flex flex-wrap gap-1.5 pt-1">
                {commonSkills.map(sk => {
                  const active = selectedSkills.includes(sk);
                  return (
                    <button
                      key={sk}
                      onClick={() => toggleSkill(sk)}
                      className={`text-[10px] font-mono px-2.5 py-1 rounded-full border transition-all ${
                        active 
                          ? "bg-blue-950 text-blue-300 border-blue-600" 
                          : "bg-[#14151f] text-gray-400 border-gray-800 hover:border-gray-700"
                      }`}
                    >
                      {sk}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Data Mode Tag */}
            <div className="pt-8 border-t border-gray-800">
              <div className="rounded-lg bg-[#11131c] border border-gray-800 p-3 text-[11px] font-mono text-gray-500 space-y-1">
                <div>Data Source: {useMock ? <span className="text-yellow-500">Demo Fallback</span> : <span className="text-green-500">Live Backend API</span>}</div>
                <div>Loaded: {activeProfiles.length} cards</div>
              </div>
            </div>
          </div>

          {/* MAIN AREA - SEARCH & CARDS GRID */}
          <div className="col-span-3 p-6 bg-[#0a0b10] flex flex-col">
            
            {/* Search Input Box */}
            <div className="flex items-center gap-3 bg-[#0d0e15] border border-gray-800 rounded-xl px-4 py-3 mb-6 shadow-inner focus-within:border-gray-700 transition-colors">
              <Search size={16} className="text-gray-500" />
              <input
                type="text"
                placeholder="Search profiles by name, availability, or tech stack keywords..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-transparent border-none outline-none text-sm text-gray-200 w-full placeholder-gray-500 font-mono"
              />
            </div>

            {/* Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 flex-1">
              {filteredProfiles.length === 0 ? (
                <div className="col-span-full flex flex-col items-center justify-center py-20 text-center space-y-2">
                  <LayoutGrid size={32} className="text-gray-700" />
                  <p className="text-sm font-mono text-gray-500">No member profiles match the current filter selection</p>
                </div>
              ) : (
                filteredProfiles.map((p) => {
                  const initials = p.full_name ? p.full_name.split(" ").map(n => n[0]).join("").toUpperCase() : "?";
                  
                  return (
                    <Link
                      href={`/profiles/${p.profile_id}`}
                      key={p.profile_id}
                      className="group block bg-[#0e1017] border border-gray-800 hover:border-blue-600 rounded-xl p-4 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg flex flex-col justify-between h-[210px]"
                    >
                      <div className="space-y-3">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-600/35 to-indigo-950/70 border border-blue-500/20 flex items-center justify-center text-sm font-mono font-bold text-blue-300">
                            {initials}
                          </div>
                          <div>
                            <h3 className="font-semibold text-sm text-white group-hover:text-blue-400 transition-colors font-mono">{p.full_name}</h3>
                            <p className="text-[10px] text-gray-500 font-mono mt-0.5 line-clamp-1">{p.tagline}</p>
                          </div>
                        </div>

                        <div className="text-[11px] font-mono text-gray-400 space-y-0.5">
                          <div>Dept: {p.department || "Technical Team"}</div>
                        </div>
                      </div>

                      <div className="space-y-3 border-t border-gray-800/60 pt-3">
                        <div className="flex flex-wrap gap-1">
                          {p.skills?.slice(0, 3).map(sk => (
                            <span 
                              key={sk.name} 
                              className="text-[9px] font-mono bg-[#141620] text-gray-300 px-2 py-0.5 rounded border border-gray-800"
                            >
                              {sk.name}
                            </span>
                          ))}
                        </div>

                        <div className="flex items-center justify-between">
                          <span className={`text-[9px] font-mono px-2 py-0.5 rounded-full ${
                            p.availability === "Available" 
                              ? "bg-green-950/80 text-green-300 border border-green-900" 
                              : p.availability === "Busy" 
                                ? "bg-red-950/80 text-red-300 border border-red-900"
                                : "bg-blue-950/80 text-blue-300 border border-blue-900"
                          }`}>
                            {p.availability}
                          </span>
                          <span className="text-[10px] font-mono text-blue-500 group-hover:translate-x-0.5 transition-transform">
                            View Profile &rarr;
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
    <Suspense fallback={<div className="min-h-screen bg-[#090a0f] text-gray-400 flex items-center justify-center font-mono text-xs">Initializing member directory...</div>}>
      <DirectoryContent />
    </Suspense>
  );
}
