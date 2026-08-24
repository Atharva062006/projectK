"use client";
import { useEffect, useState, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
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

/**
 * MemberShowcaseCard — High-fidelity card matching reference design
 * Left: Normal State | Right: Hover State with frosted glass & glow
 */
function MemberShowcaseCard({
  profile,
  darkMode,
  textColor,
  mutedColor,
}: {
  profile: ProfileCard;
  darkMode: boolean;
  textColor: string;
  mutedColor: string;
}) {
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
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      whileHover={{ y: -6, scale: 1.01 }}
      transition={{ duration: 0.28, ease: [0.25, 1, 0.5, 1] }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      style={{
        borderRadius: "20px",
        background: darkMode ? "#14171A" : "#F0F2F5",
        border: `1px solid ${isHovered ? BRAND.primaryBorder : "rgba(255,255,255,0.08)"}`,
        overflow: "hidden",
        position: "relative",
        boxShadow: isHovered
          ? `0 20px 40px rgba(0, 0, 0, 0.5), 0 0 24px ${BRAND.primaryBg}`
          : darkMode
          ? "0 4px 20px rgba(0,0,0,0.25)"
          : "0 4px 20px rgba(0,0,0,0.06)",
        transition: "border-color 0.3s ease, box-shadow 0.3s ease",
        display: "flex",
        flexDirection: "column",
        minHeight: "340px",
      }}
    >
      {/* ── Full-Card Ambient Backdrop (Clean Dark Surface) ── */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: darkMode ? "#181C1F" : "#FFFFFF",
          pointerEvents: "none",
          zIndex: 0,
        }}
      />

      <Link
        href={`/profiles/${profile.profile_id}`}
        style={{ textDecoration: "none", color: "inherit", display: "flex", flexDirection: "column", height: "100%", position: "relative", zIndex: 1 }}
      >
        {/* ── Top Visual / Avatar Area ── */}
        <div
          style={{
            position: "relative",
            height: "155px",
            width: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {/* Top Badges Overlay */}
          <div
            style={{
              position: "absolute",
              top: "12px",
              left: "12px",
              right: "12px",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              zIndex: 2,
            }}
          >
            {/* Subdued Neutral Gray Role Badge */}
            <span
              style={{
                fontSize: "10px",
                fontWeight: 600,
                textTransform: "uppercase",
                letterSpacing: "0.04em",
                padding: "3px 8px",
                borderRadius: "6px",
                background: darkMode ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.05)",
                color: mutedColor,
                border: `1px solid ${darkMode ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.08)"}`,
              }}
            >
              {profile.role_category}
            </span>

            <AvailabilityChip av={profile.availability} />
          </div>

          {/* Large Center Avatar */}
          <motion.div
            animate={{ scale: isHovered ? 1.05 : 1 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            style={{
              width: "72px",
              height: "72px",
              borderRadius: "50%",
              background: darkMode ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.06)",
              border: `1px solid ${darkMode ? "rgba(255,255,255,0.12)" : "rgba(0,0,0,0.10)"}`,
              padding: "2px",
              boxShadow: isHovered
                ? "0 6px 16px rgba(0,0,0,0.3)"
                : "0 2px 8px rgba(0,0,0,0.12)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              position: "relative",
              zIndex: 1,
            }}
          >
            <div
              style={{
                width: "100%",
                height: "100%",
                borderRadius: "50%",
                background: darkMode ? "#14171A" : "#F4F6F8",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "22px",
                fontWeight: 700,
                color: textColor,
                letterSpacing: "-0.02em",
              }}
            >
              {initials}
            </div>
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
            height: "58%",
            background: darkMode ? "#1C2023" : "#FFFFFF",
            borderTop: `1px solid ${darkMode ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.06)"}`,
            pointerEvents: "none",
            zIndex: 1,
          }}
        />

        {/* ── Progressive Blur Backdrop Layer (Revealed as the solid panel slides down) ── */}
        <motion.div
          initial={false}
          animate={{
            opacity: isHovered ? 1 : 0,
          }}
          transition={{ duration: 0.32, ease: "easeOut" }}
          style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            height: "72%",
            background: darkMode
              ? "linear-gradient(to top, rgba(14, 17, 20, 0.90) 0%, rgba(14, 17, 20, 0.65) 45%, rgba(14, 17, 20, 0.12) 80%, transparent 100%)"
              : "linear-gradient(to top, rgba(255, 255, 255, 0.90) 0%, rgba(255, 255, 255, 0.65) 45%, rgba(255, 255, 255, 0.12) 80%, transparent 100%)",
            backdropFilter: "blur(20px) saturate(160%)",
            WebkitBackdropFilter: "blur(20px) saturate(160%)",
            maskImage: "linear-gradient(to top, rgba(0,0,0,1) 0%, rgba(0,0,0,1) 50%, rgba(0,0,0,0) 100%)",
            WebkitMaskImage: "linear-gradient(to top, rgba(0,0,0,1) 0%, rgba(0,0,0,1) 50%, rgba(0,0,0,0) 100%)",
            pointerEvents: "none",
            zIndex: 2,
          }}
        />

        {/* ── Crisp Text Content Area (Sits directly on top of the blur) ── */}
        <div
          style={{
            marginTop: "auto",
            padding: "20px 20px 18px",
            display: "flex",
            flexDirection: "column",
            gap: "10px",
            position: "relative",
            zIndex: 3,
            background: "transparent",
          }}
        >
          {/* Name + Verified Badge */}
          <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
            <H3
              darkMode={darkMode}
              style={{
                fontSize: "16px",
                fontWeight: 700,
                margin: 0,
                color: textColor,
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
              }}
            >
              {profile.full_name}
            </H3>
            {/* Green Verified Badge */}
            <span
              title="Verified Member"
              style={{
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                width: "16px",
                height: "16px",
                borderRadius: "50%",
                background: "#00A35C",
                color: "#FFFFFF",
                fontSize: "10px",
                fontWeight: 800,
                flexShrink: 0,
              }}
            >
              ✓
            </span>
          </div>

          {/* Tagline */}
          <Body
            darkMode={darkMode}
            style={{
              fontSize: "12px",
              color: mutedColor,
              margin: 0,
              lineHeight: "1.45",
              height: "36px",
              overflow: "hidden",
              textOverflow: "ellipsis",
              display: "-webkit-box",
              WebkitLineClamp: 2,
              WebkitBoxOrient: "vertical",
            }}
          >
            {profile.tagline || "Active Engineering Member"}
          </Body>

          {/* Skill Pills */}
          <div style={{ display: "flex", flexWrap: "wrap", gap: "4px", minHeight: "22px" }}>
            {profile.skills?.slice(0, 3).map((sk) => (
              <Badge key={sk.name} darkMode={darkMode} variant="lightgray">
                {sk.name}
              </Badge>
            ))}
          </div>

          {/* Divider */}
          <div style={{ height: "1px", background: SURFACE.border, margin: "4px 0" }} />

          {/* Footer stats & Action CTA (Matching Reference Button) */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              marginTop: "auto",
              paddingTop: "2px",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "10px", fontSize: "11px", color: mutedColor }}>
              <span style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                <Icon glyph="Person" size={12} /> {profile.department}
              </span>
            </div>

            {/* Reference-styled Follow/View Profile Pill Button */}
            <motion.div
              animate={{
                background: isHovered ? BRAND.gradient : darkMode ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.06)",
                color: isHovered ? "#FFFFFF" : textColor,
                boxShadow: isHovered ? `0 4px 14px ${BRAND.glow}` : "none",
              }}
              transition={{ duration: 0.22 }}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "4px",
                padding: "5px 12px",
                borderRadius: "99px",
                fontSize: "11px",
                fontWeight: 600,
                border: `1px solid ${isHovered ? "transparent" : darkMode ? "rgba(255,255,255,0.12)" : "rgba(0,0,0,0.08)"}`,
                cursor: "pointer",
              }}
            >
              <span>View Profile</span>
              <span style={{ fontSize: "12px", fontWeight: 700 }}>+</span>
            </motion.div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}

function DirectoryContent() {
  const { darkMode } = useTheme();
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
          gap: "24px",
          alignItems: "start",
        }}
      >
        {/* ── Sidebar Filters — one Card is acceptable here as a distinct elevated surface ── */}
        <Card data-okc-theme="true"
          darkMode={darkMode}
          style={{ padding: "20px", position: "sticky", top: "72px", display: "flex", flexDirection: "column", gap: "20px" }}
        >
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
              <Icon glyph="Filter" fill={mutedColor} size={14} />
              <Overline darkMode={darkMode} style={{ color: mutedColor }}>Filters</Overline>
            </div>
            <Button
              darkMode={darkMode}
              variant="default"
              size="xsmall"
              leftGlyph={<Icon glyph="Refresh" />}
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
        <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
          {/* Search + View Mode Switcher Header */}
          <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
            <div style={{ flex: 1 }}>
              <TextInput data-okc-theme="true"
                aria-label="Search profiles"
                darkMode={darkMode}
                placeholder="Search by name, tagline, or tech stack..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                type="search"
              />
            </div>

            {/* View Mode Toggle (Grid / List) */}
            <div
              style={{
                display: "flex",
                background: darkMode ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.05)",
                padding: "3px",
                borderRadius: "8px",
                border: `1px solid ${SURFACE.border}`,
                gap: "2px",
                flexShrink: 0,
              }}
            >
              <button
                type="button"
                onClick={() => setViewMode("grid")}
                title="Bento Showcase View"
                style={{
                  border: "none",
                  background: viewMode === "grid" ? (darkMode ? "#21262A" : "#FFFFFF") : "transparent",
                  color: viewMode === "grid" ? textColor : mutedColor,
                  padding: "6px 10px",
                  borderRadius: "6px",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: "4px",
                  fontSize: "12px",
                  fontWeight: 600,
                  boxShadow: viewMode === "grid" ? "0 2px 6px rgba(0,0,0,0.2)" : "none",
                  transition: "all 0.15s ease",
                }}
              >
                <Icon glyph="Menu" size={14} /> Grid
              </button>
              <button
                type="button"
                onClick={() => setViewMode("list")}
                title="Compact List View"
                style={{
                  border: "none",
                  background: viewMode === "list" ? (darkMode ? "#21262A" : "#FFFFFF") : "transparent",
                  color: viewMode === "list" ? textColor : mutedColor,
                  padding: "6px 10px",
                  borderRadius: "6px",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: "4px",
                  fontSize: "12px",
                  fontWeight: 600,
                  boxShadow: viewMode === "list" ? "0 2px 6px rgba(0,0,0,0.2)" : "none",
                  transition: "all 0.15s ease",
                }}
              >
                <Icon glyph="Folder" size={14} /> List
              </button>
            </div>
          </div>

          {/* Loading */}
          {isLoading && (
            <div style={{ display: "flex", justifyContent: "center", padding: "60px 0" }}>
              <Spinner darkMode={darkMode} />
            </div>
          )}

          {/* ── Profile Results (Bento Grid vs Compact List) ── */}
          {!isLoading && (
            <div>
              <AnimatePresence mode="popLayout">
                {filteredProfiles.length === 0 ? (
                  <motion.div
                    key="empty"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.2 }}
                    style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "80px 0", gap: "12px" }}
                  >
                    <Icon glyph="Apps" fill={mutedColor} size={32} />
                    <Body darkMode={darkMode} style={{ color: mutedColor }}>
                      No profiles match the current filters
                    </Body>
                  </motion.div>
                ) : viewMode === "grid" ? (
                  /* ── Bento Grid matching Reference Image ── */
                  <motion.div
                    key="grid"
                    layout
                    style={{
                      display: "grid",
                      gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))",
                      gap: "20px",
                    }}
                  >
                    {filteredProfiles.map((p) => (
                      <MemberShowcaseCard
                        key={p.profile_id}
                        profile={p}
                        darkMode={darkMode}
                        textColor={textColor}
                        mutedColor={mutedColor}
                      />
                    ))}
                  </motion.div>
                ) : (
                  /* ── Compact List View ── */
                  <motion.div
                    key="list"
                    layout
                    style={{ display: "flex", flexDirection: "column", gap: "0" }}
                  >
                    {filteredProfiles.map((p, i) => {
                      const initials = p.full_name
                        ? p.full_name.split(" ").map((n) => n[0]).join("").toUpperCase()
                        : "?";
                      const isHovered = hoveredId === p.profile_id;
                      return (
                        <motion.div
                          layout
                          key={p.profile_id}
                          initial={{ opacity: 0, y: 8 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, scale: 0.97 }}
                          transition={{ duration: 0.22, delay: Math.min(i * 0.03, 0.2) }}
                        >
                          <Link
                            href={`/profiles/${p.profile_id}`}
                            style={{ textDecoration: "none", display: "block" }}
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
                        </motion.div>
                      );
                    })}
                  </motion.div>
                )}
              </AnimatePresence>
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
