"use client";
import { useEffect, useState, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { api } from "@/lib/api";
import { Search, RotateCw, LayoutGrid, List, ChevronDown, Check, UserCheck } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Badge, Chip } from "@/components/ui/Badge";
import { Spinner } from "@/components/ui/Spinner";
import { APPLE_COLORS, APPLE_RADII } from "@/lib/theme";

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
  Alumni: ProfileCard[];
}

const MOCK_PROFILES: ProfileCard[] = [
  { profile_id: "demo-1", full_name: "Alex Mercer", tagline: "Full Stack Engineer & AI Enthusiast", availability: "Available", department: "Core Team", role_category: "Core Team", role: "member", skills: [{ name: "TypeScript", level: "Expert" }, { name: "Next.js", level: "Expert" }, { name: "PostgreSQL", level: "Intermediate" }] },
  { profile_id: "demo-2", full_name: "Samira Jones", tagline: "AI / Machine Learning Researcher", availability: "Open to work", department: "Technical Team", role_category: "Technical Team", role: "member", skills: [{ name: "Python", level: "Expert" }, { name: "PyTorch", level: "Expert" }] },
  { profile_id: "demo-3", full_name: "Vikram Malhotra", tagline: "DevOps & Cloud Systems Architect", availability: "Busy", department: "Technical Team", role_category: "Technical Team", role: "member", skills: [{ name: "Docker", level: "Expert" }, { name: "Kubernetes", level: "Intermediate" }, { name: "AWS", level: "Expert" }] },
  { profile_id: "demo-4", full_name: "Elena Rostova", tagline: "Senior UX Engineer & Generative Artist", availability: "Available", department: "Core Team", role_category: "Core Team", role: "member", skills: [{ name: "Figma", level: "Expert" }, { name: "Three.js", level: "Expert" }, { name: "React", level: "Expert" }] },
  { profile_id: "demo-5", full_name: "Ananya Iyer", tagline: "Systems Engineer & VLSI Designer", availability: "Available", department: "Alumni", role_category: "Alumni", role: "alumni", skills: [{ name: "Verilog", level: "Expert" }, { name: "VLSI Design", level: "Intermediate" }] },
  { profile_id: "demo-6", full_name: "Marcus Thorne", tagline: "Backend Developer & Distributed Systems", availability: "Open to work", department: "Technical Team", role_category: "Technical Team", role: "member", skills: [{ name: "Go", level: "Expert" }, { name: "gRPC", level: "Expert" }, { name: "Redis", level: "Intermediate" }] },
];

function AvailabilityStatus({ av }: { av: string }) {
  let dotColor = "#1d8348"; // Green
  let textColor = "#1d8348";

  if (av === "Busy") {
    dotColor = "#d70015";
    textColor = "#d70015";
  } else if (av === "Open to work") {
    dotColor = "#b76e00";
    textColor = "#b76e00";
  }

  return (
    <div style={{ display: "inline-flex", alignItems: "center", gap: "5px", fontSize: "11px", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.04em", color: textColor }}>
      <span style={{ width: "6px", height: "6px", borderRadius: "50%", backgroundColor: dotColor }} />
      <span>{av}</span>
    </div>
  );
}

/**
 * MemberShowcaseCard — Apple Design System Card with preserved signature interactive hover physics
 */
function MemberShowcaseCard({ profile }: { profile: ProfileCard }) {
  const [isHovered, setIsHovered] = useState(false);

  const initials = profile.full_name
    ? profile.full_name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
    : "?";

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.96 }}
      whileHover={{ y: -5, scale: 1.01 }}
      transition={{ duration: 0.28, ease: [0.25, 1, 0.5, 1] }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      style={{
        borderRadius: APPLE_RADII.lg,
        backgroundColor: "#ffffff",
        border: `1px solid ${isHovered ? APPLE_COLORS.primary : APPLE_COLORS.hairline}`,
        overflow: "hidden",
        position: "relative",
        display: "flex",
        flexDirection: "column",
        minHeight: "360px",
        boxSizing: "border-box",
        transition: "border-color 0.25s ease",
      }}
    >
      <Link
        href={`/profiles/${profile.profile_id}`}
        style={{ textDecoration: "none", color: "inherit", display: "flex", flexDirection: "column", height: "100%", position: "relative", zIndex: 1 }}
      >
        {/* ── Top Visual / Avatar Area ── */}
        <div
          style={{
            position: "relative",
            height: "160px",
            width: "100%",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            padding: "16px 16px 0",
            backgroundColor: isHovered ? "#fafafc" : "#ffffff",
            transition: "background-color 0.25s ease",
          }}
        >
          {/* Top Badges Bar */}
          <div
            style={{
              position: "absolute",
              top: "14px",
              left: "16px",
              right: "16px",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              zIndex: 2,
            }}
          >
            <span
              style={{
                fontSize: "10px",
                fontWeight: 600,
                textTransform: "uppercase",
                letterSpacing: "0.05em",
                padding: "3px 8px",
                borderRadius: "4px",
                backgroundColor: "#f5f5f7",
                color: APPLE_COLORS.inkMuted80,
                border: "1px solid rgba(0, 0, 0, 0.06)",
              }}
            >
              {profile.role_category}
            </span>

            <AvailabilityStatus av={profile.availability} />
          </div>

          {/* Center Avatar */}
          <motion.div
            animate={{ scale: isHovered ? 1.06 : 1 }}
            transition={{ duration: 0.28, ease: [0.25, 1, 0.5, 1] }}
            style={{
              width: "76px",
              height: "76px",
              borderRadius: "50%",
              backgroundColor: "#f5f5f7",
              border: `2px solid ${isHovered ? APPLE_COLORS.primary : APPLE_COLORS.hairline}`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              marginTop: "16px",
              transition: "border-color 0.25s ease",
            }}
          >
            <span
              style={{
                fontSize: "22px",
                fontWeight: 600,
                color: APPLE_COLORS.ink,
                letterSpacing: "-0.02em",
              }}
            >
              {initials}
            </span>
          </motion.div>
        </div>

        {/* ── Solid Bottom Card Panel that SLIDES DOWN on hover ── */}
        <motion.div
          initial={false}
          animate={{
            y: isHovered ? "105%" : "0%",
            opacity: isHovered ? 0 : 1,
          }}
          transition={{ duration: 0.35, ease: [0.32, 0.72, 0, 1] }}
          style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            height: "56%",
            backgroundColor: "#ffffff",
            borderTop: `1px solid ${APPLE_COLORS.hairline}`,
            pointerEvents: "none",
            zIndex: 1,
          }}
        />

        {/* ── Progressive Blur Layer revealed on hover ── */}
        <motion.div
          initial={false}
          animate={{
            opacity: isHovered ? 1 : 0,
          }}
          transition={{ duration: 0.3, ease: "easeOut" }}
          style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            height: "68%",
            background: "linear-gradient(to top, rgba(255, 255, 255, 0.98) 0%, rgba(255, 255, 255, 0.85) 60%, rgba(255, 255, 255, 0.1) 100%)",
            backdropFilter: "blur(20px)",
            WebkitBackdropFilter: "blur(20px)",
            pointerEvents: "none",
            zIndex: 2,
          }}
        />

        {/* ── Text Content & Action CTA ── */}
        <div
          style={{
            marginTop: "auto",
            padding: "16px 20px 20px",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            textAlign: "center",
            gap: "8px",
            position: "relative",
            zIndex: 3,
          }}
        >
          {/* Full Name + Badge */}
          <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
            <h3
              style={{
                fontSize: "17px",
                fontWeight: 600,
                color: APPLE_COLORS.ink,
                margin: 0,
                letterSpacing: "-0.24px",
              }}
            >
              {profile.full_name}
            </h3>
            <span
              style={{
                fontSize: "9px",
                fontWeight: 700,
                padding: "2px 5px",
                borderRadius: "3px",
                backgroundColor: APPLE_COLORS.ink,
                color: "#ffffff",
                letterSpacing: "0.04em",
              }}
            >
              OYSTER KODE
            </span>
          </div>

          {/* Tagline */}
          <p
            style={{
              fontSize: "13px",
              color: APPLE_COLORS.inkMuted48,
              margin: 0,
              lineHeight: 1.4,
              height: "36px",
              overflow: "hidden",
              textOverflow: "ellipsis",
              display: "-webkit-box",
              WebkitLineClamp: 2,
              WebkitBoxOrient: "vertical",
            }}
          >
            {profile.tagline || "Active Engineering Member"}
          </p>

          {/* Skill Badges */}
          <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: "6px", minHeight: "24px" }}>
            {profile.skills?.slice(0, 3).map((sk) => (
              <span
                key={sk.name}
                style={{
                  fontSize: "10px",
                  fontWeight: 600,
                  textTransform: "uppercase",
                  letterSpacing: "0.04em",
                  padding: "2px 8px",
                  borderRadius: APPLE_RADII.pill,
                  backgroundColor: "#f5f5f7",
                  color: APPLE_COLORS.inkMuted80,
                }}
              >
                {sk.name}
              </span>
            ))}
          </div>

          {/* Action Button: View Profile (Full Width Action Blue Pill) */}
          <div style={{ width: "100%", marginTop: "12px" }}>
            <div
              style={{
                width: "100%",
                height: "36px",
                borderRadius: APPLE_RADII.pill,
                backgroundColor: APPLE_COLORS.primary,
                color: "#ffffff",
                fontSize: "13px",
                fontWeight: 500,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                transition: "background-color 0.18s ease",
              }}
            >
              View Profile
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}

function DirectoryContent() {
  const searchParams = useSearchParams();
  const initialQuery = searchParams.get("search") || "";

  const [searchQuery, setSearchQuery] = useState(initialQuery);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedAvailability, setSelectedAvailability] = useState<string[]>([]);
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);
  const [dbProfiles, setDbProfiles] = useState<ProfileCard[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [useMock, setUseMock] = useState(false);
  const [pageLimit, setPageLimit] = useState(8);

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
        Object.values(grouped).forEach((list) => {
          if (Array.isArray(list)) flattened.push(...list);
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
  const categoriesList = ["Core Team", "Technical Team", "Other Members", "Alumni"];
  const availabilityOptions = ["Available", "Busy", "Open to work"];
  const commonSkills = ["TypeScript", "Next.js", "Python", "Docker", "Figma", "C++", "PyTorch", "Go"];

  const toggleCategory = (cat: string) =>
    setSelectedCategories((p) => (p.includes(cat) ? p.filter((c) => c !== cat) : [...p, cat]));
  const toggleAvailability = (av: string) =>
    setSelectedAvailability((p) => (p.includes(av) ? p.filter((a) => a !== av) : [...p, av]));
  const toggleSkill = (sk: string) =>
    setSelectedSkills((p) => (p.includes(sk) ? p.filter((s) => s !== sk) : [...p, sk]));
  const resetFilters = () => {
    setSelectedCategories([]);
    setSelectedAvailability([]);
    setSelectedSkills([]);
    setSearchQuery("");
  };

  const filteredProfiles = activeProfiles.filter((p) => {
    if (searchQuery.trim()) {
      const s = searchQuery.toLowerCase();
      if (
        !p.full_name?.toLowerCase().includes(s) &&
        !p.tagline?.toLowerCase().includes(s) &&
        !p.skills?.some((sk) => sk.name.toLowerCase().includes(s))
      )
        return false;
    }
    if (selectedCategories.length > 0 && !selectedCategories.includes(p.role_category)) return false;
    if (selectedAvailability.length > 0 && !selectedAvailability.includes(p.availability)) return false;
    if (
      selectedSkills.length > 0 &&
      !selectedSkills.every((sKey) =>
        p.skills?.some((sk) => sk.name.toLowerCase() === sKey.toLowerCase())
      )
    )
      return false;
    return true;
  });

  const visibleProfiles = filteredProfiles.slice(0, pageLimit);

  return (
    <div style={{ maxWidth: "1120px", margin: "0 auto", padding: "32px 24px 80px", minHeight: "100vh" }}>
      {/* ── Sub-header / Title Area (Screenshot 3 Reference) ── */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "28px",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <Search size={24} color={APPLE_COLORS.primary} />
          <h1
            className="apple-display-md"
            style={{ color: APPLE_COLORS.primary, margin: 0, fontWeight: 600 }}
          >
            Directory
          </h1>
        </div>

        <Button as={Link} href="/auth" variant="primary" size="default">
          Join Club
        </Button>
      </div>

      {/* ── Search Bar + View Switcher ── */}
      <div style={{ display: "flex", gap: "16px", alignItems: "center", marginBottom: "32px" }}>
        <div style={{ flex: 1 }}>
          <Input
            isSearch
            placeholder="Search by name, tagline, or tech stack..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {/* Grid / List Switcher */}
        <div
          style={{
            display: "flex",
            backgroundColor: "#ffffff",
            border: `1px solid ${APPLE_COLORS.hairline}`,
            borderRadius: APPLE_RADII.sm,
            padding: "3px",
            gap: "2px",
            flexShrink: 0,
          }}
        >
          <button
            type="button"
            onClick={() => setViewMode("grid")}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "6px",
              padding: "6px 12px",
              borderRadius: "6px",
              border: "none",
              backgroundColor: viewMode === "grid" ? "#f5f5f7" : "transparent",
              color: viewMode === "grid" ? APPLE_COLORS.ink : APPLE_COLORS.inkMuted48,
              fontSize: "13px",
              fontWeight: 500,
              cursor: "pointer",
            }}
          >
            <LayoutGrid size={14} />
            <span>Grid</span>
          </button>

          <button
            type="button"
            onClick={() => setViewMode("list")}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "6px",
              padding: "6px 12px",
              borderRadius: "6px",
              border: "none",
              backgroundColor: viewMode === "list" ? "#f5f5f7" : "transparent",
              color: viewMode === "list" ? APPLE_COLORS.ink : APPLE_COLORS.inkMuted48,
              fontSize: "13px",
              fontWeight: 500,
              cursor: "pointer",
            }}
          >
            <List size={14} />
            <span>List</span>
          </button>
        </div>
      </div>

      {/* ── Main Layout: Sidebar Filters + Members Grid ── */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "240px 1fr",
          gap: "32px",
          alignItems: "start",
        }}
      >
        {/* ── Left Sidebar: Filters ── */}
        <aside
          style={{
            backgroundColor: "#ffffff",
            borderRadius: APPLE_RADII.lg,
            border: `1px solid ${APPLE_COLORS.hairline}`,
            padding: "24px",
            position: "sticky",
            top: "60px",
            display: "flex",
            flexDirection: "column",
            gap: "24px",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <span
              style={{
                fontSize: "11px",
                fontWeight: 600,
                letterSpacing: "0.06em",
                textTransform: "uppercase",
                color: APPLE_COLORS.inkMuted48,
              }}
            >
              FILTERS
            </span>
            <button
              type="button"
              onClick={resetFilters}
              title="Reset Filters"
              style={{
                background: "none",
                border: "none",
                cursor: "pointer",
                padding: "2px",
                color: APPLE_COLORS.inkMuted48,
                display: "flex",
                alignItems: "center",
              }}
            >
              <RotateCw size={14} />
            </button>
          </div>

          {/* Role Category Checkboxes */}
          <div>
            <span
              style={{
                fontSize: "14px",
                fontWeight: 600,
                color: APPLE_COLORS.ink,
                display: "block",
                marginBottom: "12px",
              }}
            >
              Role Category
            </span>
            <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
              {categoriesList.map((cat) => {
                const checked = selectedCategories.includes(cat);
                return (
                  <label
                    key={cat}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "10px",
                      fontSize: "13px",
                      color: APPLE_COLORS.inkMuted80,
                      cursor: "pointer",
                      userSelect: "none",
                    }}
                  >
                    <input
                      type="checkbox"
                      checked={checked}
                      onChange={() => toggleCategory(cat)}
                      style={{
                        accentColor: APPLE_COLORS.primary,
                        cursor: "pointer",
                        width: "15px",
                        height: "15px",
                      }}
                    />
                    <span>{cat}</span>
                  </label>
                );
              })}
            </div>
          </div>

          {/* Availability Checkboxes */}
          <div>
            <span
              style={{
                fontSize: "14px",
                fontWeight: 600,
                color: APPLE_COLORS.ink,
                display: "block",
                marginBottom: "12px",
              }}
            >
              Availability
            </span>
            <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
              {availabilityOptions.map((av) => {
                const checked = selectedAvailability.includes(av);
                return (
                  <label
                    key={av}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "10px",
                      fontSize: "13px",
                      color: APPLE_COLORS.inkMuted80,
                      cursor: "pointer",
                      userSelect: "none",
                    }}
                  >
                    <input
                      type="checkbox"
                      checked={checked}
                      onChange={() => toggleAvailability(av)}
                      style={{
                        accentColor: APPLE_COLORS.primary,
                        cursor: "pointer",
                        width: "15px",
                        height: "15px",
                      }}
                    />
                    <span>{av}</span>
                  </label>
                );
              })}
            </div>
          </div>

          {/* Skills Pill Chips */}
          <div>
            <span
              style={{
                fontSize: "14px",
                fontWeight: 600,
                color: APPLE_COLORS.ink,
                display: "block",
                marginBottom: "12px",
              }}
            >
              Skills
            </span>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
              {commonSkills.map((sk) => {
                const isSelected = selectedSkills.includes(sk);
                return (
                  <button
                    key={sk}
                    type="button"
                    onClick={() => toggleSkill(sk)}
                    style={{
                      padding: "4px 10px",
                      borderRadius: APPLE_RADII.pill,
                      border: `1px solid ${isSelected ? APPLE_COLORS.primary : APPLE_COLORS.hairline}`,
                      backgroundColor: isSelected ? "rgba(0, 102, 204, 0.08)" : "#f5f5f7",
                      color: isSelected ? APPLE_COLORS.primary : APPLE_COLORS.inkMuted80,
                      fontSize: "12px",
                      fontWeight: isSelected ? 600 : 400,
                      cursor: "pointer",
                      transition: "all 0.15s ease",
                    }}
                  >
                    {sk}
                  </button>
                );
              })}
            </div>
          </div>
        </aside>

        {/* ── Right Content: Results ── */}
        <div>
          {isLoading ? (
            <div style={{ display: "flex", justifyContent: "center", padding: "80px 0" }}>
              <Spinner size={32} />
            </div>
          ) : filteredProfiles.length === 0 ? (
            <div
              style={{
                backgroundColor: "#ffffff",
                borderRadius: APPLE_RADII.lg,
                border: `1px solid ${APPLE_COLORS.hairline}`,
                padding: "64px 24px",
                textAlign: "center",
              }}
            >
              <p style={{ fontSize: "16px", color: APPLE_COLORS.inkMuted48, margin: "0 0 16px" }}>
                No members found matching your search criteria.
              </p>
              <Button variant="default" size="small" onClick={resetFilters}>
                Clear All Filters
              </Button>
            </div>
          ) : viewMode === "grid" ? (
            /* ── Bento Grid of Member Cards ── */
            <div style={{ display: "flex", flexDirection: "column", gap: "32px" }}>
              <motion.div
                layout
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))",
                  gap: "20px",
                }}
              >
                {visibleProfiles.map((p) => (
                  <MemberShowcaseCard key={p.profile_id} profile={p} />
                ))}
              </motion.div>

              {/* Show more button */}
              {filteredProfiles.length > visibleProfiles.length && (
                <div style={{ display: "flex", justifyContent: "center", marginTop: "16px" }}>
                  <button
                    type="button"
                    onClick={() => setPageLimit((p) => p + 8)}
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "8px",
                      padding: "10px 24px",
                      backgroundColor: "#ffffff",
                      borderRadius: APPLE_RADII.pill,
                      border: `1px solid ${APPLE_COLORS.hairline}`,
                      color: APPLE_COLORS.ink,
                      fontSize: "14px",
                      fontWeight: 500,
                      cursor: "pointer",
                      boxShadow: "0 2px 8px rgba(0, 0, 0, 0.04)",
                      transition: "background-color 0.15s ease",
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#fafafc")}
                    onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "#ffffff")}
                  >
                    <span>Show more</span>
                    <ChevronDown size={16} />
                  </button>
                </div>
              )}
            </div>
          ) : (
            /* ── List View Table ── */
            <div
              style={{
                backgroundColor: "#ffffff",
                borderRadius: APPLE_RADII.lg,
                border: `1px solid ${APPLE_COLORS.hairline}`,
                overflow: "hidden",
              }}
            >
              {visibleProfiles.map((p, idx) => (
                <Link
                  key={p.profile_id}
                  href={`/profiles/${p.profile_id}`}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    padding: "18px 24px",
                    borderBottom:
                      idx < visibleProfiles.length - 1
                        ? `1px solid ${APPLE_COLORS.hairline}`
                        : "none",
                    textDecoration: "none",
                    color: "inherit",
                    transition: "background-color 0.15s ease",
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#fafafc")}
                  onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "transparent")}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
                    <div
                      style={{
                        width: "44px",
                        height: "44px",
                        borderRadius: "50%",
                        backgroundColor: "#f5f5f7",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: "14px",
                        fontWeight: 600,
                        color: APPLE_COLORS.ink,
                      }}
                    >
                      {p.full_name.charAt(0)}
                    </div>
                    <div>
                      <h4 style={{ fontSize: "15px", fontWeight: 600, margin: "0 0 2px" }}>
                        {p.full_name}
                      </h4>
                      <p style={{ fontSize: "12px", color: APPLE_COLORS.inkMuted48, margin: 0 }}>
                        {p.tagline}
                      </p>
                    </div>
                  </div>

                  <div style={{ display: "flex", alignItems: "center", gap: "24px" }}>
                    <div style={{ display: "flex", gap: "6px" }}>
                      {p.skills?.slice(0, 2).map((sk) => (
                        <span
                          key={sk.name}
                          style={{
                            fontSize: "11px",
                            padding: "2px 8px",
                            borderRadius: APPLE_RADII.pill,
                            backgroundColor: "#f5f5f7",
                            color: APPLE_COLORS.inkMuted80,
                          }}
                        >
                          {sk.name}
                        </span>
                      ))}
                    </div>
                    <AvailabilityStatus av={p.availability} />
                    <span style={{ color: APPLE_COLORS.primary, fontSize: "14px", fontWeight: 500 }}>
                      →
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function DirectoryPage() {
  return (
    <Suspense
      fallback={
        <div style={{ minHeight: "60vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <Spinner size={32} />
        </div>
      }
    >
      <DirectoryContent />
    </Suspense>
  );
}
