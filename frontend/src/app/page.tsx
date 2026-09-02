"use client";
import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, ArrowRight, Sparkles, Laptop, Building2, UserCheck, Star } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { APPLE_COLORS, APPLE_RADII, APPLE_SHADOW } from "@/lib/theme";
import { fadeInUp, fadeInScale, staggerContainer } from "@/lib/animations";

interface Testimonial {
  name: string;
  role: string;
  quote: string;
  rating: number;
}

interface FAQItem {
  question: string;
  answer: string;
}

const TESTIMONIALS: Testimonial[] = [
  {
    name: "Yashraj Shinde",
    role: "Computer Science, TY RIT",
    quote: "Being part of Oyster Kode Club has been transformative. The Code 404 competition helped me improve my problem-solving skills significantly.",
    rating: 5,
  },
  {
    name: "Suryakant Koli",
    role: "Computer Science, SY RIT",
    quote: "The community and the coding culture has made me build consistency and discipline towards coding",
    rating: 5,
  },
  {
    name: "Harshal Kumbhar",
    role: "SDE Intern, RSquareSoft",
    quote: "The supportive community and mentorship opportunities at Oyster Kode Club have been invaluable for my growth as a developer.",
    rating: 5,
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
      "Yes. Every public member profile includes direct links to download verified PDF resumes uploaded by the candidate.",
  },
];

const STATS = [
  { value: "40+", label: "Verified Members", icon: UserCheck },
  { value: "25+", label: "Completed Projects", icon: Laptop },
  { value: "8+", label: "Alumni at Big Tech", icon: Building2 },
  { value: "100%", label: "Student-Led", icon: Sparkles },
];

const EXPERTISE_AREAS = [
  {
    title: "Full Stack",
    description: "Architecting scalable web and mobile applications from end to end.",
    href: "/directory?search=Next.js",
  },
  {
    title: "AI/ML",
    description: "Developing intelligent systems and predictive models.",
    href: "/directory?search=Python",
  },
  {
    title: "Hardware & VLSI",
    description: "Designing the physical foundations of tomorrow's computing.",
    href: "/directory?search=VLSI",
  },
  {
    title: "Cloud & DevOps",
    description: "Building robust, automated infrastructure for global scale.",
    href: "/directory?search=Docker",
  },
];

export default function LandingPage() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const toggleFaq = (index: number) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", width: "100%", margin: 0, padding: 0 }}>
      {/* ── TILE 1: Dark Hero Tile with OysterTeam5 Background Image (Screenshot 4 Reference) ── */}
      <section
        style={{
          position: "relative",
          overflow: "hidden",
          color: "#ffffff",
          minHeight: "82vh",
          padding: "120px 24px 100px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          textAlign: "center",
          width: "100%",
          backgroundColor: "#141416",
        }}
      >
        {/* Background Image: OysterTeam5 */}
        <Image
          src="/OysterTeam5.jpg"
          alt="Oyster Kode Club Team"
          fill
          priority
          sizes="100vw"
          style={{
            objectFit: "cover",
            objectPosition: "center 35%",
            zIndex: 0,
          }}
        />

        {/* Apple Cinematic Dark Scrim Overlay */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            width: "100%",
            height: "100%",
            backgroundColor: "rgba(12, 12, 14, 0.82)",
            background: "linear-gradient(180deg, rgba(12, 12, 14, 0.85) 0%, rgba(15, 15, 17, 0.82) 50%, rgba(18, 18, 20, 0.92) 100%)",
            backdropFilter: "blur(3px)",
            WebkitBackdropFilter: "blur(3px)",
            zIndex: 1,
          }}
        />

        {/* Content Staged on Top */}
        <motion.div
          variants={staggerContainer(0.1)}
          initial="initial"
          animate="animate"
          style={{
            position: "relative",
            zIndex: 2,
            maxWidth: "840px",
            margin: "0 auto",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          {/* Eyebrow */}
          <motion.div variants={fadeInUp}>
            <span
              style={{
                fontSize: "12px",
                fontWeight: 600,
                letterSpacing: "0.08em",
                textTransform: "uppercase",
                color: "rgba(255, 255, 255, 0.7)",
                display: "block",
                marginBottom: "20px",
              }}
            >
              ARTIFICIAL INTELLIGENCE & MACHINE LEARNING
            </span>
          </motion.div>

          {/* Hero Quote Headline */}
          <motion.div variants={fadeInUp}>
            <h1
              className="apple-hero-display"
              style={{
                color: "#ffffff",
                marginBottom: "24px",
                fontSize: "clamp(32px, 5.5vw, 56px)",
                lineHeight: 1.12,
                fontWeight: 600,
                letterSpacing: "-0.03em",
                textShadow: "0 2px 20px rgba(0, 0, 0, 0.5)",
              }}
            >
              &ldquo;Architecting intelligence requires more than algorithms. It demands intuition.&rdquo;
            </h1>
          </motion.div>

          {/* Hero Tagline / Subtitle */}
          <motion.div variants={fadeInUp}>
            <p
              style={{
                fontSize: "clamp(16px, 2vw, 20px)",
                lineHeight: 1.5,
                color: "rgba(255, 255, 255, 0.85)",
                maxWidth: "680px",
                margin: "0 auto 36px",
                letterSpacing: "-0.2px",
                fontWeight: 400,
                textShadow: "0 1px 12px rgba(0, 0, 0, 0.5)",
              }}
            >
              Discover elite engineering talent specialized in deep learning, neural networks, and scalable AI infrastructure.
            </p>
          </motion.div>

          {/* Action CTAs */}
          <motion.div
            variants={fadeInUp}
            style={{ display: "flex", gap: "14px", justifyContent: "center", flexWrap: "wrap" }}
          >
            <Button
              as={Link}
              href="/directory"
              variant="primary"
              size="default"
              rightGlyph={<ArrowRight size={15} />}
            >
              Browse Directory
            </Button>
            <Button
              as={Link}
              href="/auth"
              variant="secondary-pill"
              size="default"
              style={{ color: "#ffffff", borderColor: "rgba(255,255,255,0.4)" }}
            >
              Join Club
            </Button>
          </motion.div>
        </motion.div>
      </section>

      {/* ── TILE 2: Light Canvas Tile — "Areas of Expertise" (Screenshot 4 Reference) ── */}
      <section
        style={{
          backgroundColor: APPLE_COLORS.canvasParchment,
          padding: "80px 24px",
          width: "100%",
        }}
      >
        <div style={{ maxWidth: "1080px", margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: "48px" }}>
            <h2
              className="apple-display-md"
              style={{ color: APPLE_COLORS.ink, marginBottom: "8px" }}
            >
              Areas of Expertise
            </h2>
            <p style={{ fontSize: "16px", color: APPLE_COLORS.inkMuted48, margin: 0 }}>
              Specialized disciplines and modern technical foundations
            </p>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
              gap: "20px",
            }}
          >
            {EXPERTISE_AREAS.map((area, idx) => (
              <motion.div
                key={idx}
                whileHover={{ y: -3, transition: { duration: 0.18 } }}
                style={{ height: "100%" }}
              >
                <div
                  style={{
                    backgroundColor: "#ffffff",
                    borderRadius: APPLE_RADII.lg,
                    border: `1px solid ${APPLE_COLORS.hairline}`,
                    padding: "28px 24px",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between",
                    height: "100%",
                    minHeight: "190px",
                    boxSizing: "border-box",
                  }}
                >
                  <div>
                    <h3
                      style={{
                        fontSize: "19px",
                        fontWeight: 600,
                        color: APPLE_COLORS.ink,
                        margin: "0 0 10px",
                        letterSpacing: "-0.24px",
                      }}
                    >
                      {area.title}
                    </h3>
                    <p
                      style={{
                        fontSize: "14px",
                        color: APPLE_COLORS.inkMuted48,
                        lineHeight: 1.5,
                        margin: 0,
                      }}
                    >
                      {area.description}
                    </p>
                  </div>

                  <Link
                    href={area.href}
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "4px",
                      fontSize: "14px",
                      color: APPLE_COLORS.primary,
                      fontWeight: 500,
                      textDecoration: "none",
                      marginTop: "20px",
                      letterSpacing: "-0.1px",
                    }}
                  >
                    <span>Learn more</span>
                    <span>→</span>
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── TILE 3: Dark Editorial Stats Tile ── */}
      <section
        style={{
          backgroundColor: APPLE_COLORS.surfaceTile2,
          color: "#ffffff",
          padding: "64px 24px",
          width: "100%",
        }}
      >
        <div
          style={{
            maxWidth: "1024px",
            margin: "0 auto",
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
            gap: "24px",
            textAlign: "center",
          }}
        >
          {STATS.map((s, i) => {
            const IconComp = s.icon;
            return (
              <div
                key={i}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  padding: "16px 12px",
                }}
              >
                <span
                  style={{
                    fontSize: "36px",
                    fontWeight: 600,
                    color: "#ffffff",
                    letterSpacing: "-0.03em",
                    lineHeight: 1.1,
                    marginBottom: "8px",
                  }}
                >
                  {s.value}
                </span>
                <span
                  style={{
                    fontSize: "13px",
                    color: "rgba(255, 255, 255, 0.72)",
                    fontWeight: 400,
                    letterSpacing: "-0.1px",
                  }}
                >
                  {s.label}
                </span>
              </div>
            );
          })}
        </div>
      </section>

      {/* ── TILE 4: Testimonials & FAQ Section ── */}
      <section
        id="about"
        style={{
          backgroundColor: "#ffffff",
          padding: "80px 24px",
          width: "100%",
        }}
      >
        <div style={{ maxWidth: "1024px", margin: "0 auto", display: "flex", flexDirection: "column", gap: "64px" }}>
          {/* Testimonials */}
          <div>
            <div style={{ textAlign: "center", marginBottom: "40px" }}>
              <span style={{ fontSize: "11px", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.08em", color: APPLE_COLORS.primary, display: "block", marginBottom: "6px" }}>
                COMMUNITY REVIEWS
              </span>
              <h2 className="apple-display-md" style={{ color: APPLE_COLORS.ink, margin: "0 0 8px" }}>
                What Our Members Say
              </h2>
              <p style={{ fontSize: "15px", color: APPLE_COLORS.inkMuted48, margin: 0 }}>
                Hear from our members about their experiences and growth with Oyster Kode Club
              </p>
            </div>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
                gap: "24px",
              }}
            >
              {TESTIMONIALS.map((t, idx) => (
                <div
                  key={idx}
                  style={{
                    backgroundColor: APPLE_COLORS.canvasParchment,
                    borderRadius: APPLE_RADII.lg,
                    border: `1px solid ${APPLE_COLORS.hairline}`,
                    padding: "24px",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between",
                  }}
                >
                  <div>
                    {/* Header with Name & Role (Clean Typography without Photo) */}
                    <div style={{ marginBottom: "12px" }}>
                      <h3 style={{ fontSize: "16px", fontWeight: 600, color: APPLE_COLORS.ink, margin: 0 }}>
                        {t.name}
                      </h3>
                      <p style={{ fontSize: "12px", color: APPLE_COLORS.inkMuted48, margin: "2px 0 0" }}>
                        {t.role}
                      </p>
                    </div>

                    {/* 5-Star Rating */}
                    <div style={{ display: "flex", gap: "4px", marginBottom: "14px" }}>
                      {Array.from({ length: t.rating }).map((_, i) => (
                        <Star key={i} size={15} fill="#f59e0b" color="#f59e0b" />
                      ))}
                    </div>

                    {/* Quote */}
                    <p
                      style={{
                        fontSize: "14px",
                        color: APPLE_COLORS.inkMuted80,
                        lineHeight: 1.6,
                        fontStyle: "italic",
                        margin: 0,
                      }}
                    >
                      &ldquo;{t.quote}&rdquo;
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* FAQ Accordion */}
          <div>
            <div style={{ textAlign: "center", marginBottom: "32px" }}>
              <h2 className="apple-display-md" style={{ color: APPLE_COLORS.ink, margin: "0 0 6px" }}>
                Frequently Asked Questions
              </h2>
              <p style={{ fontSize: "15px", color: APPLE_COLORS.inkMuted48, margin: 0 }}>
                Everything you need to know about the talent ecosystem
              </p>
            </div>

            <div style={{ maxWidth: "760px", margin: "0 auto", display: "flex", flexDirection: "column", gap: "10px" }}>
              {FAQS.map((faq, i) => {
                const isOpen = openFaq === i;
                return (
                  <div
                    key={i}
                    style={{
                      backgroundColor: APPLE_COLORS.canvasParchment,
                      borderRadius: APPLE_RADII.md,
                      border: `1px solid ${APPLE_COLORS.hairline}`,
                      overflow: "hidden",
                    }}
                  >
                    <button
                      type="button"
                      onClick={() => toggleFaq(i)}
                      style={{
                        width: "100%",
                        padding: "18px 20px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        background: "none",
                        border: "none",
                        cursor: "pointer",
                        textAlign: "left",
                        fontSize: "15px",
                        fontWeight: 600,
                        color: APPLE_COLORS.ink,
                        letterSpacing: "-0.2px",
                      }}
                    >
                      <span>{faq.question}</span>
                      <motion.span
                        animate={{ rotate: isOpen ? 180 : 0 }}
                        transition={{ duration: 0.2 }}
                        style={{ display: "flex", alignItems: "center", color: APPLE_COLORS.inkMuted48 }}
                      >
                        <ChevronDown size={18} />
                      </motion.span>
                    </button>

                    <AnimatePresence>
                      {isOpen && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          exit={{ opacity: 0, height: 0 }}
                          transition={{ duration: 0.22, ease: [0.25, 1, 0.5, 1] }}
                          style={{ overflow: "hidden" }}
                        >
                          <div style={{ padding: "0 20px 18px", fontSize: "14px", color: APPLE_COLORS.inkMuted80, lineHeight: 1.6 }}>
                            {faq.answer}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* ── PARCHMENT FOOTER (appledesign.md specification) ── */}
      <footer
        style={{
          backgroundColor: APPLE_COLORS.canvasParchment,
          padding: "56px 24px 40px",
          borderTop: `1px solid ${APPLE_COLORS.hairline}`,
          width: "100%",
        }}
      >
        <div style={{ maxWidth: "1024px", margin: "0 auto" }}>
          {/* Main Footer Links & Brand */}
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-start",
              flexWrap: "wrap",
              gap: "32px",
              paddingBottom: "36px",
              borderBottom: `1px solid ${APPLE_COLORS.hairline}`,
            }}
          >
            <div>
              <span
                style={{
                  fontSize: "14px",
                  fontWeight: 600,
                  color: APPLE_COLORS.ink,
                  textTransform: "uppercase",
                  letterSpacing: "0.04em",
                  display: "block",
                  marginBottom: "8px",
                }}
              >
                OYSTER KODE CLUB
              </span>
              <p style={{ fontSize: "13px", color: APPLE_COLORS.inkMuted48, maxWidth: "340px", lineHeight: 1.5, margin: 0 }}>
                Official portfolio ecosystem showcasing verified technical talent and student engineering achievements.
              </p>
            </div>

            <div style={{ display: "flex", gap: "48px", flexWrap: "wrap" }}>
              <div>
                <span style={{ fontSize: "12px", fontWeight: 600, color: APPLE_COLORS.ink, display: "block", marginBottom: "12px" }}>
                  Directory
                </span>
                <div style={{ display: "flex", flexDirection: "column", gap: "8px", fontSize: "13px", color: APPLE_COLORS.inkMuted80 }}>
                  <Link href="/directory" style={{ textDecoration: "none", color: "inherit" }}>All Members</Link>
                  <Link href="/directory?search=Next.js" style={{ textDecoration: "none", color: "inherit" }}>Full Stack</Link>
                  <Link href="/directory?search=Python" style={{ textDecoration: "none", color: "inherit" }}>AI / Machine Learning</Link>
                  <Link href="/directory?search=VLSI" style={{ textDecoration: "none", color: "inherit" }}>Hardware & Systems</Link>
                </div>
              </div>

              <div>
                <span style={{ fontSize: "12px", fontWeight: 600, color: APPLE_COLORS.ink, display: "block", marginBottom: "12px" }}>
                  Portal
                </span>
                <div style={{ display: "flex", flexDirection: "column", gap: "8px", fontSize: "13px", color: APPLE_COLORS.inkMuted80 }}>
                  <Link href="/pitches" style={{ textDecoration: "none", color: "inherit" }}>Pitch Showcase</Link>
                  <Link href="/auth" style={{ textDecoration: "none", color: "inherit" }}>Member Sign In</Link>
                  <Link href="/portfolio" style={{ textDecoration: "none", color: "inherit" }}>Workspace Dashboard</Link>
                  <Link href="/admin" style={{ textDecoration: "none", color: "inherit" }}>Administration</Link>
                </div>
              </div>
            </div>
          </div>

          {/* Legal / Copyright Bottom Row */}
          <div
            style={{
              paddingTop: "24px",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              flexWrap: "wrap",
              gap: "16px",
              fontSize: "12px",
              color: APPLE_COLORS.inkMuted48,
            }}
          >
            <div style={{ display: "flex", gap: "20px", flexWrap: "wrap" }}>
              <Link href="#" style={{ color: "inherit", textDecoration: "none" }}>Terms of Service</Link>
              <Link href="#" style={{ color: "inherit", textDecoration: "none" }}>Privacy Policy</Link>
              <Link href="#" style={{ color: "inherit", textDecoration: "none" }}>Contact Support</Link>
              <Link href="#" style={{ color: "inherit", textDecoration: "none" }}>Member Guidelines</Link>
            </div>
            <div>
              © {new Date().getFullYear()} Oyster Kode Club. All rights reserved.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
