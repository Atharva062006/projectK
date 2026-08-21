"use client";
import { useEffect, useState, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { api } from "@/lib/api";
import { useTheme } from "@/context/ThemeContext";

import Card from "@leafygreen-ui/card";
import Badge from "@leafygreen-ui/badge";
import { TextInput } from "@leafygreen-ui/text-input";
import { Checkbox } from "@leafygreen-ui/checkbox";
import Button from "@/components/OKCButton";
import { Chip } from "@leafygreen-ui/chip";
import { Body, H3, Overline, Label } from "@leafygreen-ui/typography";
import Icon from "@leafygreen-ui/icon";
import { Spinner } from "@leafygreen-ui/loading-indicator";
import { palette } from "@leafygreen-ui/palette";
import { BRAND, SURFACE, STATUS, availabilityStyle } from "@/lib/theme";

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
  { profile_id: "demo-1", full_name: "Atharva Kulkarni", tagline: "Full Stack Engineer & AI Enthusiast", availability: "Available", department: "Core Team", role_category: "Core Team", role: "member", skills: [{ name: "TypeScript", level: "Expert" }, { name: "Next.js", level: "Expert" }, { name: "PostgreSQL", level: "Intermediate" }] },
  { profile_id: "demo-2", full_name: "Sneha Sharma", tagline: "UI/UX Designer & Frontend Developer", availability: "Open to work", department: "Technical Team", role_category: "Technical Team", role: "member", skills: [{ name: "Figma", level: "Expert" }, { name: "React.js", level: "Expert" }, { name: "HTML5/CSS3", level: "Expert" }] },
  { profile_id: "demo-3", full_name: "Vikram Malhotra", tagline: "DevOps & Cloud Architect", availability: "Busy", department: "Technical Team", role_category: "Technical Team", role: "member", skills: [{ name: "Docker", level: "Expert" }, { name: "Kubernetes", level: "Intermediate" }, { name: "AWS", level: "Expert" }] },
  { profile_id: "demo-4", full_name: "Rohan Das", tagline: "ML Engineer | Embedded Systems Dev", availability: "Available", department: "Technical Team", role_category: "Technical Team", role: "member", skills: [{ name: "Python", level: "Expert" }, { name: "C++", level: "Expert" }] },
  { profile_id: "demo-5", full_name: "Ananya Iyer", tagline: "Systems Engineer & VLSI Designer", availability: "Available", department: "Alumni", role_category: "Alumni", role: "alumni", skills: [{ name: "Verilog", level: "Expert" }, { name: "VLSI Design", level: "Intermediate" }] },
  { profile_id: "demo-6", full_name: "Rahul Verma", tagline: "Backend Developer & Database Admin", availability: "Open to work", department: "Other Members", role_category: "Other Members", role: "member", skills: [{ name: "Node.js", level: "Expert" }, { name: "PostgreSQL", level: "Expert" }] },
];

function AvailabilityChip({ av }: { av: string }) {
  const { darkMode } = useTheme();
  const variantMap: Record<string, "green" | "yellow" | "gray" | "red"> = {
    Available: "green",
    "Open to work": "yellow",
    Busy: "red",
  };
  return <Chip darkMode={darkMode} label={av} variant={variantMap[av] ?? "gray"} />;
}

function DirectoryContent() {
  const { darkMode } = useTheme();
  const searchParams = useSearchParams();
  const initialQuery = searchParams.get("search") || "";

  const [searchQuery, setSearchQuery] = useState(initialQuery);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedAvailability, setSelectedAvailability] = useState<string[]>([]);
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);
  const [dbProfiles, setDbProfiles] = useState<ProfileCard[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [useMock, setUseMock] = useState(false);
  const [hoveredId, setHoveredId] = useState<string | null>(null);

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

  const textColor = darkMode ? palette.white : palette.black;
  const mutedColor = darkMode ? palette.gray.light1 : palette.gray.dark1;
  const hoverBg = darkMode ? "rgba(255,255,255,0.04)" : "rgba(0,0,0,0.03)";

  return (
    <div style={{ minHeight: "100vh" }}>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "240px 1fr",
          gap: "20px",
          alignItems: "start",
        }}
      >
        {/* ── Sidebar Filters — one Card is acceptable here as a distinct elevated surface ── */}
        <Card
          darkMode={darkMode}
          style={{ padding: "20px", position: "sticky", top: "72px", display: "flex", flexDirection: "column", gap: "20px" }}
        >
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
              <Icon glyph="Filter" fill={BRAND.primary} size={14} />
              <Overline darkMode={darkMode}>Filters</Overline>
            </div>
            <Button
              darkMode={darkMode}
              variant="default"
              size="xsmall"
              leftGlyph={<Icon glyph={isLoading ? "Refresh" : "Refresh"} />}
              onClick={fetchProfiles}
              title="Refresh data"
            />
          </div>

          {/* Role Categories */}
          <div>
            <Label htmlFor="category-filter" darkMode={darkMode} style={{ display: "block", marginBottom: "8px", color: mutedColor }}>
              Role Category
            </Label>
            {categoriesList.map((cat) => (
              <Checkbox
                key={cat}
                darkMode={darkMode}
                label={cat}
                checked={selectedCategories.includes(cat)}
                onChange={() => toggleCategory(cat)}
                style={{ marginBottom: "6px" }}
              />
            ))}
          </div>

          {/* Availability */}
          <div>
            <Label htmlFor="availability-filter" darkMode={darkMode} style={{ display: "block", marginBottom: "8px", color: mutedColor }}>
              Availability
            </Label>
            {availabilityOptions.map((av) => (
              <Checkbox
                key={av}
                darkMode={darkMode}
                label={av}
                checked={selectedAvailability.includes(av)}
                onChange={() => toggleAvailability(av)}
                style={{ marginBottom: "6px" }}
              />
            ))}
          </div>

          {/* Skills — Chip filter bar */}
          <div>
            <Label htmlFor="level-filter" darkMode={darkMode} style={{ display: "block", marginBottom: "8px", color: mutedColor }}>
              Skills
            </Label>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
              {commonSkills.map((sk) => (
                <Chip
                  key={sk}
                  darkMode={darkMode}
                  label={sk}
                  variant={selectedSkills.includes(sk) ? "green" : "gray"}
                  onClick={() => toggleSkill(sk)}
                />
              ))}
            </div>
          </div>

          {/* Data source */}
          <div>
            <Body darkMode={darkMode} style={{ fontSize: "11px", color: mutedColor }}>
              Source:{" "}
              <span style={{ color: useMock ? STATUS.warning : STATUS.success, fontWeight: 600 }}>
                {useMock ? "Demo Fallback" : "Live API"}
              </span>
            </Body>
            <Body darkMode={darkMode} style={{ fontSize: "11px", color: mutedColor }}>
              {activeProfiles.length} profiles loaded
            </Body>
          </div>
        </Card>

        {/* ── Main Panel ── */}
        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          {/* Search */}
          <TextInput
            aria-label="Search profiles"
            darkMode={darkMode}
            placeholder="Search by name, tagline, or tech stack..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            type="search"
          />

          {/* Loading */}
          {isLoading && (
            <div style={{ display: "flex", justifyContent: "center", padding: "40px 0" }}>
              <Spinner darkMode={darkMode} />
            </div>
          )}

          {/* Profile results — hover-based divs, no Card per item ── */}
          {!isLoading && (
            <div style={{ display: "flex", flexDirection: "column", gap: "0" }}>
              {filteredProfiles.length === 0 ? (
                <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "80px 0", gap: "12px" }}>
                  <Icon glyph="Apps" fill={mutedColor} size={32} />
                  <Body darkMode={darkMode} style={{ color: mutedColor }}>
                    No profiles match the current filters
                  </Body>
                </div>
              ) : (
                filteredProfiles.map((p, i) => {
                  const initials = p.full_name
                    ? p.full_name.split(" ").map((n) => n[0]).join("").toUpperCase()
                    : "?";
                  const isHovered = hoveredId === p.profile_id;
                  return (
                    <Link
                      href={`/profiles/${p.profile_id}`}
                      key={p.profile_id}
                      style={{ textDecoration: "none" }}
                      className={`anim-fadeInUp anim-delay-${Math.min(i + 1, 8)}`}
                    >
                      <div
                        onMouseEnter={() => setHoveredId(p.profile_id)}
                        onMouseLeave={() => setHoveredId(null)}
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "16px",
                          padding: "16px",
                          borderRadius: "8px",
                          background: isHovered ? hoverBg : "transparent",
                          transition: "background 0.15s ease",
                          cursor: "pointer",
                          borderBottom: `1px solid ${darkMode ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.06)"}`,
                        }}
                      >
                        {/* Avatar */}
                        <div
                          style={{
                            width: "44px", height: "44px", borderRadius: "10px",
                            background: darkMode ? palette.gray.dark2 : palette.gray.light2,
                            border: `1px solid ${darkMode ? palette.gray.dark1 : palette.gray.light1}`,
                            display: "flex", alignItems: "center", justifyContent: "center",
                            fontSize: "13px", fontWeight: 700, color: textColor, flexShrink: 0,
                          }}
                        >
                          {initials}
                        </div>

                        {/* Name + tagline */}
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <H3
                            darkMode={darkMode}
                            style={{ fontSize: "14px", margin: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}
                          >
                            {p.full_name}
                          </H3>
                          <Body
                            darkMode={darkMode}
                            style={{ fontSize: "12px", color: mutedColor, marginTop: "2px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}
                          >
                            {p.tagline}
                          </Body>
                        </div>

                        {/* Skill Badges */}
                        <div style={{ display: "flex", flexWrap: "wrap", gap: "4px", flexShrink: 0, maxWidth: "200px" }}>
                          {p.skills?.slice(0, 3).map((sk) => (
                            <Badge key={sk.name} darkMode={darkMode} variant="lightgray">{sk.name}</Badge>
                          ))}
                        </div>

                        {/* Availability chip */}
                        <div style={{ flexShrink: 0 }}>
                          <AvailabilityChip av={p.availability} />
                        </div>

                        {/* Arrow hint on hover */}
                        <Body
                          darkMode={darkMode}
                          style={{
                            fontSize: "13px", color: BRAND.primary, flexShrink: 0,
                            opacity: isHovered ? 1 : 0, transition: "opacity 0.15s ease",
                          }}
                        >
                          →
                        </Body>
                      </div>
                    </Link>
                  );
                })
              )}
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
        <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <Spinner />
        </div>
      }
    >
      <DirectoryContent />
    </Suspense>
  );
}
