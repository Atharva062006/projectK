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
import { LinkedInVerifiedBadge } from "@/components/ui/Icons";

interface ProfileCard {
  profile_id: string;
  full_name: string;
  profile_image?: string;
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

function AvailabilityStatus({ av }: { av: string }) {
  const displayVal = av || "Available";
  let dotColor = "#1d8348"; // Green
  let textColor = "#1d8348";

  if (displayVal === "Busy") {
    dotColor = "#d70015";
    textColor = "#d70015";
  } else if (displayVal === "Open to work") {
    dotColor = "#b76e00";
    textColor = "#b76e00";
  }

  return (
    <div
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: "6px",
        fontSize: "11px",
        fontWeight: 600,
        textTransform: "uppercase",
        letterSpacing: "0.04em",
        color: textColor,
        lineHeight: 1,
      }}
    >
      <span
        style={{
          width: "6px",
          height: "6px",
          borderRadius: "50%",
          backgroundColor: dotColor,
          display: "inline-block",
          flexShrink: 0,
        }}
      />
      <span style={{ transform: "translateY(0.5px)" }}>{displayVal}</span>
    </div>
  );
}

function FallbackAvatar({ initials }: { initials: string }) {
  return (
    <div
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        width: "100%",
        height: "410px",
        borderRadius: "18px",
        background: "linear-gradient(135deg, #e8eaed 0%, #d2d2d7 100%)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        paddingTop: "70px",
        gap: "10px",
      }}
    >
      <div
        style={{
          width: "60px",
          height: "60px",
          borderRadius: "50%",
          backgroundColor: "rgba(255, 255, 255, 0.85)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          boxShadow: "0 4px 12px rgba(0, 0, 0, 0.06)",
        }}
      >
        <span
          style={{
            fontSize: "24px",
            fontWeight: 600,
            color: APPLE_COLORS.ink,
            letterSpacing: "-0.02em",
          }}
        >
          {initials}
        </span>
      </div>
      <span
        style={{
          fontSize: "11px",
          fontWeight: 600,
          textTransform: "uppercase",
          letterSpacing: "0.06em",
          color: APPLE_COLORS.inkMuted48,
        }}
      >
        OKC Member
      </span>
    </div>
  );
}

/**
 * MemberShowcaseCard — Apple Design System Card with Smooth Appear/Disappear Hover State
 * Matches reference design in media_1788694242522.png & media_1788694261198.png
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
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.96 }}
      whileHover={{ y: -2 }}
      transition={{ duration: 0.2, ease: [0.25, 1, 0.5, 1] }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      style={{
        borderRadius: "28px",
        backgroundColor: "#ffffff",
        border: `1px solid ${isHovered ? "rgba(0, 0, 0, 0.12)" : "rgba(0, 0, 0, 0.07)"}`,
        boxShadow: isHovered
          ? "0 14px 32px rgba(0, 0, 0, 0.08)"
          : "0 4px 16px rgba(0, 0, 0, 0.04)",
        overflow: "hidden",
        position: "relative",
        display: "flex",
        flexDirection: "column",
        height: "430px",
        minHeight: "430px",
        boxSizing: "border-box",
        isolation: "isolate",
        WebkitMaskImage: "-webkit-radial-gradient(white, black)",
        transition: "border-color 0.35s ease, box-shadow 0.35s ease",
      }}
    >
      <Link
        href={`/profiles/${profile.profile_id}`}
        prefetch={true}
        style={{
          textDecoration: "none",
          color: "inherit",
          display: "block",
          width: "100%",
          height: "100%",
          position: "relative",
        }}
      >
        {/* ── Layer 1: Default Framed Photo (Stationary, height 236px, radius 18px concentric) ── */}
        <div
          style={{
            position: "absolute",
            top: "10px",
            left: "10px",
            right: "10px",
            height: "236px",
            borderRadius: "18px",
            overflow: "hidden",
            backgroundColor: "#f0f0f2",
            isolation: "isolate",
            WebkitMaskImage: "-webkit-radial-gradient(white, black)",
            zIndex: 1,
          }}
        >
          {profile.profile_image ? (
            <img
              src={profile.profile_image}
              alt={profile.full_name}
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                width: "100%",
                height: "410px",
                borderRadius: "18px",
                objectFit: "cover",
                objectPosition: "center 16%",
              }}
            />
          ) : (
            <FallbackAvatar initials={initials} />
          )}
        </div>

        {/* ── Layer 2: Hover Full Photo & Frosted Mist (Concentric 18px radius, zero corner leak) ── */}
        <div
          style={{
            position: "absolute",
            top: "10px",
            left: "10px",
            right: "10px",
            height: "410px",
            borderRadius: "18px",
            overflow: "hidden",
            backgroundColor: "#f0f0f2",
            opacity: isHovered ? 1 : 0,
            transition: "opacity 0.35s cubic-bezier(0.2, 0.8, 0.2, 1)",
            zIndex: 3,
            pointerEvents: "none",
            isolation: "isolate",
            WebkitMaskImage: "-webkit-radial-gradient(white, black)",
          }}
        >
          {profile.profile_image ? (
            <img
              src={profile.profile_image}
              alt={profile.full_name}
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                width: "100%",
                height: "410px",
                borderRadius: "18px",
                objectFit: "cover",
                objectPosition: "center 16%",
              }}
            />
          ) : (
            <FallbackAvatar initials={initials} />
          )}

          {/* Frosted Mist Overlay within the full photo frame */}
          <div
            style={{
              position: "absolute",
              inset: 0,
              borderRadius: "18px",
              background:
                "linear-gradient(180deg, rgba(255, 255, 255, 0) 0%, rgba(255, 255, 255, 0) 28%, rgba(255, 255, 255, 0.2) 44%, rgba(255, 255, 255, 0.6) 60%, rgba(255, 255, 255, 0.88) 76%, rgba(255, 255, 255, 0.98) 100%)",
              backdropFilter: "blur(20px)",
              WebkitBackdropFilter: "blur(20px)",
              maskImage:
                "linear-gradient(180deg, rgba(0, 0, 0, 0) 0%, rgba(0, 0, 0, 0) 28%, rgba(0, 0, 0, 0.25) 44%, rgba(0, 0, 0, 0.75) 60%, rgba(0, 0, 0, 1) 75%)",
              WebkitMaskImage:
                "linear-gradient(180deg, rgba(0, 0, 0, 0) 0%, rgba(0, 0, 0, 0) 28%, rgba(0, 0, 0, 0.25) 44%, rgba(0, 0, 0, 0.75) 60%, rgba(0, 0, 0, 1) 75%)",
            }}
          />
        </div>

        {/* ── Layer 3: Floating Availability Badge (Pinned to top-right) ── */}
        <div
          style={{
            position: "absolute",
            top: "18px",
            right: "18px",
            zIndex: 12,
            pointerEvents: "none",
          }}
        >
          <div
            style={{
              padding: "4px 10px",
              borderRadius: APPLE_RADII.pill,
              backgroundColor: "rgba(255, 255, 255, 0.88)",
              backdropFilter: "blur(12px)",
              WebkitBackdropFilter: "blur(12px)",
              border: "1px solid rgba(255, 255, 255, 0.7)",
              boxShadow: "0 2px 8px rgba(0, 0, 0, 0.04)",
              display: "inline-flex",
              alignItems: "center",
            }}
          >
            <AvailabilityStatus av={profile.availability} />
          </div>
        </div>

        {/* ── Layer 4: Transparent Content Container (Inside 10px card border) ── */}
        <div
          style={{
            position: "absolute",
            bottom: "10px",
            left: "10px",
            right: "10px",
            height: "174px",
            zIndex: 10,
            backgroundColor: "transparent",
            background: "none",
            padding: "16px 14px 10px 14px",
            display: "flex",
            flexDirection: "column",
            boxSizing: "border-box",
          }}
        >
          {/* Full Name + LinkedIn Verified Badge */}
          <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
            <h3
              style={{
                fontSize: "17px",
                fontWeight: 600,
                color: APPLE_COLORS.ink,
                margin: 0,
                letterSpacing: "-0.24px",
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
              }}
            >
              {profile.full_name}
            </h3>
            <LinkedInVerifiedBadge size={16} />
          </div>

          {/* Tagline (2-line clamped) */}
          <p
            style={{
              fontSize: "13px",
              color: APPLE_COLORS.inkMuted48,
              margin: "4px 0 8px",
              lineHeight: 1.4,
              height: "36px",
              overflow: "hidden",
              textOverflow: "ellipsis",
              display: "-webkit-box",
              WebkitLineClamp: 2,
              WebkitBoxOrient: "vertical",
            }}
          >
            {profile.tagline || "Active Engineering Member at Oyster Kode Club"}
          </p>

          {/* Skills Badges (if available) */}
          {profile.skills && profile.skills.length > 0 && (
            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                gap: "5px",
                minHeight: "22px",
              }}
            >
              {profile.skills.slice(0, 3).map((sk) => (
                <span
                  key={sk.name}
                  style={{
                    fontSize: "10px",
                    fontWeight: 600,
                    textTransform: "uppercase",
                    letterSpacing: "0.04em",
                    padding: "3px 8px",
                    borderRadius: APPLE_RADII.pill,
                    backgroundColor: isHovered ? "rgba(255, 255, 255, 0.85)" : "#f5f5f7",
                    color: isHovered ? APPLE_COLORS.ink : APPLE_COLORS.inkMuted80,
                    border: isHovered ? "1px solid rgba(255, 255, 255, 0.9)" : "1px solid rgba(0, 0, 0, 0.04)",
                    boxShadow: isHovered ? "0 1px 4px rgba(0, 0, 0, 0.04)" : "none",
                    transition: "all 0.3s ease",
                  }}
                >
                  {sk.name}
                </span>
              ))}
            </div>
          )}

          {/* Spacer */}
          <div style={{ flex: 1 }} />

          {/* Bottom Action Bar */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <span style={{ fontSize: "11px", color: APPLE_COLORS.inkMuted48, fontWeight: 500 }}>
              {profile.skills?.length || 0} skills listed
            </span>

            <div
              style={{
                borderRadius: APPLE_RADII.pill,
                backgroundColor: isHovered ? "#ffffff" : "#f5f5f7",
                color: APPLE_COLORS.ink,
                fontSize: "12px",
                fontWeight: 500,
                padding: "6px 14px",
                display: "inline-flex",
                alignItems: "center",
                gap: "4px",
                border: "1px solid rgba(0, 0, 0, 0.06)",
                boxShadow: isHovered ? "0 3px 10px rgba(0, 0, 0, 0.08)" : "none",
                transition: "all 0.25s ease",
              }}
            >
              <span>View Profile</span>
              <span style={{ fontSize: "13px" }}>&rarr;</span>
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
  const [isLoading, setIsLoading] = useState(true);
  const [pageLimit, setPageLimit] = useState(12);

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
      } else {
        setDbProfiles([]);
      }
    } catch (err) {
      console.error("Directory fetch notice", err);
      setDbProfiles([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProfiles();
  }, []);

  const activeProfiles = dbProfiles;
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
            <div
              style={{
                backgroundColor: "#ffffff",
                borderRadius: APPLE_RADII.lg,
                border: `1px solid ${APPLE_COLORS.hairline}`,
                padding: "96px 24px",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                gap: "16px",
                minHeight: "400px",
              }}
            >
              <Spinner size={36} color={APPLE_COLORS.primary} />
              <div style={{ textAlign: "center" }}>
                <p
                  style={{
                    fontSize: "15px",
                    fontWeight: 600,
                    color: APPLE_COLORS.ink,
                    margin: "0 0 4px",
                    letterSpacing: "-0.01em",
                  }}
                >
                  Loading Directory
                </p>
                <p
                  style={{
                    fontSize: "13px",
                    color: APPLE_COLORS.inkMuted48,
                    margin: 0,
                  }}
                >
                  Fetching verified member profiles from server...
                </p>
              </div>
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
