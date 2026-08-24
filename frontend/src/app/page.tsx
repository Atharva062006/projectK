"use client";
import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  motion,
  useMotionValue,
  animate,
  useReducedMotion,
  useInView,
} from "framer-motion";

import Card from "@leafygreen-ui/card";
import Button from "@/components/OKCButton";
import Badge from "@leafygreen-ui/badge";
import {
  H1,
  H2,
  H3,
  Subtitle,
  Body,
  Label,
  Overline,
} from "@leafygreen-ui/typography";
import Icon from "@leafygreen-ui/icon";
import { ExpandableCard } from "@leafygreen-ui/expandable-card";
import { palette } from "@leafygreen-ui/palette";
import { useTheme } from "@/context/ThemeContext";
import { BRAND, SURFACE } from "@/lib/theme";
import {
  Globe,
  Brain,
  Cpu,
  Cloud,
  Quote,
  ArrowUpRight,
  Sparkles,
} from "lucide-react";

interface Testimonial {
  name: string;
  role: string;
  company: string;
  quote: string;
  gradYear: number;
  featured?: boolean;
}

interface FAQItem {
  question: string;
  answer: string;
}

const TESTIMONIALS: Testimonial[] = [
  {
    name: "Rohan Kulkarni",
    role: "Software Engineer",
    company: "Google",
    quote:
      "Being part of Oyster Kode Club was a defining milestone. The technical autonomy, peer architecture reviews, and shipping production-grade open source projects prepared me directly for industry standards at scale.",
    gradYear: 2024,
    featured: true,
  },
  {
    name: "Meera Sen",
    role: "Hardware Engineer",
    company: "Intel Corporation",
    quote:
      "The club's focus on low-level systems integration and FPGA hardware design is rare. It bridged the gap between academic theory and silicon validation.",
    gradYear: 2023,
  },
  {
    name: "Kabir Mehta",
    role: "Founding Engineer",
    company: "DevFlow Labs",
    quote:
      "The portfolio showcase portal eliminates recruiter friction. Hiring teams get immediate access to verified repos, live demos, and validated resumes.",
    gradYear: 2022,
  },
];

const FAQS: FAQItem[] = [
  {
    question: "What is Project K?",
    answer:
      "Project K is the official talent discovery and portfolio ecosystem of Oyster Kode Club. It gives verified members and alumni dedicated showcase profiles featuring engineering projects, live demos, and downloadable resumes.",
  },
  {
    question: "Who can create a profile on this platform?",
    answer:
      "Only active members and confirmed alumni of Oyster Kode Club who have an approved account can build and maintain a public portfolio profile.",
  },
  {
    question: "How are member accounts approved?",
    answer:
      "Club administrators review registrations to verify current club membership or alumni credentials before public portfolio visibility is enabled.",
  },
  {
    question: "Can recruiters download member resumes directly?",
    answer:
      "Yes. Every public member profile includes direct links to download verified PDF resumes uploaded by the candidate without paywalls or friction.",
  },
];

const STATS_DATA = [
  { target: 40, suffix: "+", label: "Verified Members", glyph: "Person" },
  { target: 25, suffix: "+", label: "Completed Projects", glyph: "Laptop" },
  { target: 8, suffix: "+", label: "Alumni at Big Tech", glyph: "Building" },
  { target: 100, suffix: "%", label: "Student-Led", glyph: "Sparkle" },
];

const DOMAINS = [
  {
    title: "Full Stack & Web Systems",
    tech: "React · Next.js · Node.js · PostgreSQL",
    icon: Globe,
    href: "/directory?search=Next.js",
  },
  {
    title: "AI & Machine Learning",
    tech: "PyTorch · Python · LLMs · OpenCV",
    icon: Brain,
    href: "/directory?search=Python",
  },
  {
    title: "Hardware & VLSI Systems",
    tech: "Verilog · VHDL · FPGA · Embedded C",
    icon: Cpu,
    href: "/directory?search=VLSI",
  },
  {
    title: "Cloud & DevOps Infrastructure",
    tech: "Docker · AWS · Kubernetes · CI/CD",
    icon: Cloud,
    href: "/directory?search=Docker",
  },
];

/**
 * Animated Stat Item in a continuous horizontal strip
 */
function StatItem({
  target,
  suffix,
  label,
  glyph,
  index,
  darkMode,
  textColor,
  mutedColor,
  borderColor,
  shouldReduceMotion,
}: {
  target: number;
  suffix: string;
  label: string;
  glyph: string;
  index: number;
  darkMode: boolean;
  textColor: string;
  mutedColor: string;
  borderColor: string;
  shouldReduceMotion: boolean;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-40px" });
  const motionVal = useMotionValue(0);
  const [displayCount, setDisplayCount] = useState(shouldReduceMotion ? target : 0);

  useEffect(() => {
    if (shouldReduceMotion) {
      setDisplayCount(target);
      return;
    }
    if (isInView) {
      const controls = animate(motionVal, target, {
        duration: 0.9,
        delay: index * 0.1,
        ease: "easeOut",
        onUpdate: (latest) => setDisplayCount(Math.round(latest)),
      });
      return () => controls.stop();
    }
  }, [isInView, shouldReduceMotion, target, index, motionVal]);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 14 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.35, delay: index * 0.1, ease: "easeOut" }}
      style={{
        flex: "1 1 200px",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: "8px",
        padding: "32px 24px",
        borderRight: index < STATS_DATA.length - 1 ? `1px solid ${borderColor}` : "none",
      }}
    >
      <Icon glyph={glyph as never} fill={mutedColor} size={20} />
      <H2 darkMode={darkMode} style={{ color: textColor, margin: 0, fontSize: "32px", fontWeight: 800, letterSpacing: "-0.02em" }}>
        {displayCount}
        {suffix}
      </H2>
      <Label htmlFor={`stat-${index}`} darkMode={darkMode} style={{ color: mutedColor, textAlign: "center", fontSize: "12px", fontWeight: 500 }}>
        {label}
      </Label>
    </motion.div>
  );
}

export default function LandingPage() {
  const { darkMode } = useTheme();
  const shouldReduceMotion = useReducedMotion() ?? false;

  const textColor = darkMode ? palette.white : palette.black;
  const mutedColor = darkMode ? palette.gray.light1 : palette.gray.dark1;
  const borderColor = darkMode ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.08)";

  const featuredTestimonial = TESTIMONIALS.find((t) => t.featured) || TESTIMONIALS[0];
  const secondaryTestimonials = TESTIMONIALS.filter((t) => !t.featured);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "88px", paddingBottom: "88px" }}>

      {/* ── 1. HERO SECTION — Crafted Wordmark & Kicker ── */}
      <div
        style={{
          textAlign: "center",
          padding: "56px 24px 32px",
          position: "relative",
        }}
      >
        <motion.div
          initial={{ opacity: 0, scale: shouldReduceMotion ? 1 : 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
          style={{ maxWidth: "680px", margin: "0 auto", position: "relative", zIndex: 1 }}
        >
          {/* Deliberate One-Line Kicker Badge */}
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "8px",
              padding: "5px 12px",
              borderRadius: "99px",
              background: darkMode ? "rgba(255,255,255,0.04)" : "rgba(0,0,0,0.04)",
              border: `1px solid ${borderColor}`,
              marginBottom: "24px",
            }}
          >
            <span
              style={{
                width: "6px",
                height: "6px",
                borderRadius: "50%",
                background: BRAND.primary,
              }}
            />
            <span
              style={{
                fontSize: "11px",
                fontWeight: 600,
                letterSpacing: "0.08em",
                textTransform: "uppercase",
                color: mutedColor,
              }}
            >
              Oyster Kode Club · Talent Showcase
            </span>
          </div>

          {/* Crafted H1 Wordmark */}
          <H1
            darkMode={darkMode}
            style={{
              color: textColor,
              fontSize: "52px",
              fontWeight: 800,
              lineHeight: "1.08",
              marginBottom: "20px",
              letterSpacing: "-0.03em",
            }}
          >
            PROJECT K
          </H1>

          <Body
            darkMode={darkMode}
            style={{
              color: mutedColor,
              marginBottom: "36px",
              lineHeight: "1.7",
              fontSize: "16px",
              maxWidth: "580px",
              margin: "0 auto 36px",
            }}
          >
            The official structured portfolio directory of Oyster Kode Club. Discover skill-based talent,
            inspect verified engineering projects, and download candidate resumes.
          </Body>

          <div style={{ display: "flex", gap: "12px", justifyContent: "center", flexWrap: "wrap" }}>
            <Button
              as={Link}
              href="/directory"
              darkMode={darkMode}
              variant="primary"
              rightGlyph={<Icon glyph="ArrowRight" />}
            >
              Browse Member Directory
            </Button>
            <Button
              as={Link}
              href="/auth"
              darkMode={darkMode}
              variant="default"
            >
              Join Portal
            </Button>
          </div>
        </motion.div>
      </div>

      {/* ── 2. STATS BAR — Single Connected Horizontal Strip ── */}
      <div
        style={{
          display: "flex",
          alignItems: "stretch",
          justifyContent: "center",
          flexWrap: "wrap",
          borderTop: `1px solid ${borderColor}`,
          borderBottom: `1px solid ${borderColor}`,
          background: darkMode ? "rgba(255,255,255,0.015)" : "rgba(0,0,0,0.01)",
        }}
      >
        {STATS_DATA.map((s, i) => (
          <StatItem
            key={i}
            target={s.target}
            suffix={s.suffix}
            label={s.label}
            glyph={s.glyph}
            index={i}
            darkMode={darkMode}
            textColor={textColor}
            mutedColor={mutedColor}
            borderColor={borderColor}
            shouldReduceMotion={shouldReduceMotion}
          />
        ))}
      </div>

      {/* ── 3. CORE ENGINEERING DOMAINS — Prominent H2 & Lucide-Icon Grid ── */}
      <section>
        <div
          style={{
            display: "flex",
            alignItems: "flex-end",
            justifyContent: "space-between",
            marginBottom: "32px",
            flexWrap: "wrap",
            gap: "16px",
          }}
        >
          <div>
            <Overline darkMode={darkMode} style={{ color: mutedColor }}>Core Engineering Domains</Overline>
            <H2
              darkMode={darkMode}
              style={{
                fontSize: "28px",
                fontWeight: 700,
                margin: "4px 0 8px",
                color: textColor,
                letterSpacing: "-0.01em",
              }}
            >
              Explore Technical Subdivisions
            </H2>
            <Body darkMode={darkMode} style={{ color: mutedColor, fontSize: "14px", lineHeight: "1.6", maxWidth: "560px" }}>
              Filter club engineers by technical discipline, tech stack specializations, and production architecture.
            </Body>
          </div>
          <Button
            as={Link}
            href="/directory"
            darkMode={darkMode}
            variant="default"
            size="small"
            rightGlyph={<Icon glyph="ArrowRight" />}
          >
            All Filters
          </Button>
        </div>

        {/* 4-Tile Grid with Distinct Lucide Icons */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-40px" }}
          variants={{
            hidden: { opacity: 0 },
            visible: {
              opacity: 1,
              transition: {
                staggerChildren: shouldReduceMotion ? 0 : 0.08,
              },
            },
          }}
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
            gap: "20px",
          }}
        >
          {DOMAINS.map((d, i) => {
            const IconComponent = d.icon;
            return (
              <motion.div
                key={i}
                variants={{
                  hidden: { opacity: 0, y: shouldReduceMotion ? 0 : 18 },
                  visible: { opacity: 1, y: 0, transition: { duration: 0.35, ease: "easeOut" } },
                }}
                whileHover={{ y: shouldReduceMotion ? 0 : -4, transition: { duration: 0.18 } }}
                whileTap={{ scale: 0.98 }}
              >
                <Link
                  href={d.href}
                  style={{ textDecoration: "none", display: "block", height: "100%" }}
                >
                  <div
                    style={{
                      padding: "24px",
                      borderRadius: "14px",
                      border: `1px solid ${borderColor}`,
                      cursor: "pointer",
                      transition: "all 0.2s ease",
                      height: "100%",
                      background: darkMode ? "#181C1F" : "#FFFFFF",
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "space-between",
                      gap: "18px",
                    }}
                    onMouseEnter={(e) => {
                      (e.currentTarget as HTMLDivElement).style.borderColor = darkMode ? "rgba(255,255,255,0.22)" : "rgba(0,0,0,0.18)";
                      (e.currentTarget as HTMLDivElement).style.boxShadow = darkMode ? "0 8px 24px rgba(0,0,0,0.4)" : "0 8px 24px rgba(0,0,0,0.06)";
                    }}
                    onMouseLeave={(e) => {
                      (e.currentTarget as HTMLDivElement).style.borderColor = borderColor;
                      (e.currentTarget as HTMLDivElement).style.boxShadow = "none";
                    }}
                  >
                    <div>
                      {/* Neutral Lucide Domain Icon Box */}
                      <div
                        style={{
                          width: "40px",
                          height: "40px",
                          borderRadius: "10px",
                          background: darkMode ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.04)",
                          border: `1px solid ${borderColor}`,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          color: textColor,
                          marginBottom: "16px",
                        }}
                      >
                        <IconComponent size={18} strokeWidth={2} />
                      </div>

                      <H3 darkMode={darkMode} style={{ fontSize: "16px", fontWeight: 700, margin: "0 0 6px", color: textColor }}>
                        {d.title}
                      </H3>
                      <Body darkMode={darkMode} style={{ fontSize: "12px", color: mutedColor, lineHeight: "1.5" }}>
                        {d.tech}
                      </Body>
                    </div>

                    <div style={{ display: "flex", alignItems: "center", gap: "4px", fontSize: "12px", fontWeight: 500, color: mutedColor }}>
                      <span>View members</span>
                      <ArrowUpRight size={13} />
                    </div>
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </motion.div>
      </section>

      {/* ── 4. ALUMNI SUCCESS — Prominent H2 & Asymmetric Bento Layout ── */}
      <section>
        <div style={{ marginBottom: "32px" }}>
          <Overline darkMode={darkMode} style={{ color: mutedColor }}>Alumni & Member Outcomes</Overline>
          <H2
            darkMode={darkMode}
            style={{
              fontSize: "28px",
              fontWeight: 700,
              margin: "4px 0 8px",
              color: textColor,
              letterSpacing: "-0.01em",
            }}
          >
            Proven Industry Impact
          </H2>
          <Body darkMode={darkMode} style={{ color: mutedColor, fontSize: "14px", lineHeight: "1.6", maxWidth: "580px" }}>
            Hear directly from graduates and active contributors thriving at high-growth engineering teams.
          </Body>
        </div>

        {/* Asymmetric 2-Column Bento Layout */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
            gap: "20px",
            alignItems: "stretch",
          }}
        >
          {/* Featured Hero Testimonial Card (Left Column) */}
          <motion.div
            initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.35, ease: "easeOut" }}
            style={{ display: "flex", height: "100%" }}
          >
            <Card
              data-okc-theme="true"
              darkMode={darkMode}
              style={{
                padding: "32px",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                gap: "24px",
                width: "100%",
                borderRadius: "16px",
                background: darkMode ? "#181C1F" : "#FFFFFF",
                border: `1px solid ${borderColor}`,
              }}
            >
              <div>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "16px" }}>
                  <Badge darkMode={darkMode} variant="lightgray">Featured Graduate</Badge>
                  <Quote size={20} color={mutedColor} style={{ opacity: 0.6 }} />
                </div>

                <Body
                  darkMode={darkMode}
                  style={{
                    fontStyle: "italic",
                    color: textColor,
                    lineHeight: "1.75",
                    fontSize: "15px",
                    fontWeight: 500,
                  }}
                >
                  &ldquo;{featuredTestimonial.quote}&rdquo;
                </Body>
              </div>

              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  paddingTop: "16px",
                  borderTop: `1px solid ${SURFACE.border}`,
                }}
              >
                <div>
                  <Subtitle darkMode={darkMode} style={{ fontSize: "14px", fontWeight: 700, color: textColor, margin: 0 }}>
                    {featuredTestimonial.name}
                  </Subtitle>
                  <Body darkMode={darkMode} style={{ fontSize: "12px", color: mutedColor, marginTop: "2px" }}>
                    {featuredTestimonial.role} @ <strong style={{ color: textColor }}>{featuredTestimonial.company}</strong>
                  </Body>
                </div>
                <Badge darkMode={darkMode} variant="lightgray">Class of {featuredTestimonial.gradYear}</Badge>
              </div>
            </Card>
          </motion.div>

          {/* Stacked Secondary Testimonial Cards (Right Column) */}
          <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
            {secondaryTestimonials.map((t, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.35, delay: i * 0.1, ease: "easeOut" }}
                style={{ flex: 1, display: "flex" }}
              >
                <Card
                  data-okc-theme="true"
                  darkMode={darkMode}
                  style={{
                    padding: "24px",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between",
                    gap: "16px",
                    width: "100%",
                    borderRadius: "14px",
                  }}
                >
                  <Body
                    darkMode={darkMode}
                    style={{
                      fontStyle: "italic",
                      color: mutedColor,
                      lineHeight: "1.65",
                      fontSize: "13px",
                    }}
                  >
                    &ldquo;{t.quote}&rdquo;
                  </Body>

                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      paddingTop: "12px",
                      borderTop: `1px solid ${SURFACE.border}`,
                    }}
                  >
                    <div>
                      <Subtitle darkMode={darkMode} style={{ fontSize: "13px", fontWeight: 700, color: textColor, margin: 0 }}>
                        {t.name}
                      </Subtitle>
                      <Body darkMode={darkMode} style={{ fontSize: "11px", color: mutedColor, marginTop: "2px" }}>
                        {t.role} @ {t.company}
                      </Body>
                    </div>
                    <Badge darkMode={darkMode} variant="lightgray">{t.gradYear}</Badge>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 5. FAQ SECTION — Prominent H2 & Clean Single-Column List ── */}
      <section>
        <div style={{ marginBottom: "32px" }}>
          <Overline darkMode={darkMode} style={{ color: mutedColor }}>Knowledge Base</Overline>
          <H2
            darkMode={darkMode}
            style={{
              fontSize: "28px",
              fontWeight: 700,
              margin: "4px 0 8px",
              color: textColor,
              letterSpacing: "-0.01em",
            }}
          >
            Frequently Asked Questions
          </H2>
          <Body darkMode={darkMode} style={{ color: mutedColor, fontSize: "14px", lineHeight: "1.6", maxWidth: "580px" }}>
            Key details regarding profile verification, recruiter access, and community membership.
          </Body>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "10px", maxWidth: "860px" }}>
          {FAQS.map((faq, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.3, ease: "easeOut" }}
            >
              <ExpandableCard
                data-okc-theme="true"
                darkMode={darkMode}
                title={faq.question}
                flagText="FAQ"
              >
                <Body darkMode={darkMode} style={{ color: mutedColor, lineHeight: "1.65", fontSize: "14px" }}>
                  {faq.answer}
                </Body>
              </ExpandableCard>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── 6. FOOTER — Completely Static, Plain JSX, Zero Cards ── */}
      <footer
        style={{
          paddingTop: "48px",
          borderTop: `1px solid ${borderColor}`,
        }}
      >
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))",
            gap: "32px",
            marginBottom: "32px",
          }}
        >
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "12px" }}>
              <Image src="/okc_main_logo.png" alt="OKC" width={22} height={22} style={{ objectFit: "contain" }} />
              <Subtitle darkMode={darkMode} style={{ fontSize: "12px", fontWeight: 700, letterSpacing: "0.05em" }}>
                OYSTER KODE CLUB
              </Subtitle>
            </div>
            <Body darkMode={darkMode} style={{ fontSize: "12px", color: mutedColor, lineHeight: "1.6" }}>
              Official portfolio showcase ecosystem built by our student-led engineering community.
            </Body>
          </div>

          <div>
            <Overline darkMode={darkMode} style={{ marginBottom: "12px", color: mutedColor }}>Browse</Overline>
            <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
              {[["Web Systems", "/directory?search=Next.js"], ["Data Systems", "/directory?search=Python"], ["VLSI & Hardware", "/directory?search=VLSI"], ["DevOps & Cloud", "/directory?search=Docker"]].map(([label, href]) => (
                <Link key={href} href={href} style={{ fontSize: "13px", color: mutedColor, textDecoration: "none", transition: "color 0.15s" }}>
                  {label}
                </Link>
              ))}
            </div>
          </div>

          <div>
            <Overline darkMode={darkMode} style={{ marginBottom: "12px", color: mutedColor }}>Portal</Overline>
            <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
              {[["Member Directory", "/directory"], ["Pitch Showcase", "/pitches"], ["Join Portal", "/auth"], ["Admin Panel", "/admin"]].map(([label, href]) => (
                <Link key={href} href={href} style={{ fontSize: "13px", color: mutedColor, textDecoration: "none", transition: "color 0.15s" }}>
                  {label}
                </Link>
              ))}
            </div>
          </div>

          <div>
            <Overline darkMode={darkMode} style={{ marginBottom: "12px", color: mutedColor }}>Contact</Overline>
            <Body darkMode={darkMode} style={{ fontSize: "12px", color: mutedColor }}>
              Questions or partnerships?
            </Body>
            <Body darkMode={darkMode} style={{ fontSize: "13px", color: textColor, marginTop: "4px", fontWeight: 500 }}>
              contact@oysterkode.club
            </Body>
          </div>
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: "12px",
            paddingTop: "20px",
            borderTop: `1px solid ${borderColor}`,
          }}
        >
          <Body darkMode={darkMode} style={{ fontSize: "11px", color: mutedColor }}>
            © {new Date().getFullYear()} Oyster Kode Club. All Rights Reserved.
          </Body>
          <div style={{ display: "flex", gap: "16px" }}>
            {["Privacy", "Terms"].map((l) => (
              <Link key={l} href="#" style={{ fontSize: "11px", color: mutedColor, textDecoration: "none" }}>
                {l}
              </Link>
            ))}
          </div>
        </div>
      </footer>
    </div>
  );
}
