"use client";
import React from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Code,
  Users,
  Target,
  Award,
  ArrowRight,
  GraduationCap,
  Sparkles,
  ChevronRight,
  UserCheck,
  Laptop,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { APPLE_COLORS, APPLE_RADII, APPLE_SHADOW } from "@/lib/theme";
import { fadeInUp, staggerContainer } from "@/lib/animations";

export default function AboutPage() {
  const PILLARS = [
    {
      icon: Code,
      title: "Coding Excellence",
      description: "Cultivating algorithmic depth, data structure fluency, and modern full-stack software architecture principles.",
    },
    {
      icon: Users,
      title: "Community & Mentorship",
      description: "A collaborative student ecosystem where senior engineers guide juniors through code reviews, pairing, and peer learning.",
    },
    {
      icon: Target,
      title: "Placement Preparation",
      description: "Structured interview preparation, system design simulations, and competitive programming challenges for top-tier roles.",
    },
    {
      icon: Award,
      title: "Real-World Engineering",
      description: "Designing, building, and deploying real production software and open-source systems that solve real campus problems.",
    },
  ];

  return (
    <div style={{ display: "flex", flexDirection: "column", width: "100%", margin: 0, padding: 0 }}>
      {/* ── TILE 1: Dark Hero Tile (SF Pro Display, Strict Apple Aesthetic) ── */}
      <section
        style={{
          position: "relative",
          overflow: "hidden",
          minHeight: "72vh",
          padding: "120px 24px 90px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          textAlign: "center",
          width: "100%",
          backgroundColor: "#141416",
          color: "#ffffff",
        }}
      >
        <motion.div
          variants={staggerContainer(0.12, 0.05)}
          initial="initial"
          animate="animate"
          style={{ maxWidth: "860px", margin: "0 auto", position: "relative", zIndex: 10 }}
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
              STUDENT-LED ENGINEERING EXCELLENCE &bull; RIT
            </span>
          </motion.div>

          {/* Headline */}
          <motion.h1
            variants={fadeInUp}
            className="apple-hero-display"
            style={{
              fontSize: "clamp(34px, 5.5vw, 56px)",
              fontWeight: 600,
              lineHeight: 1.08,
              letterSpacing: "-0.03em",
              color: "#ffffff",
              marginBottom: "22px",
            }}
          >
            About Oyster Kode Club
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            variants={fadeInUp}
            style={{
              fontSize: "clamp(16px, 2vw, 20px)",
              color: "rgba(255, 255, 255, 0.82)",
              fontWeight: 400,
              lineHeight: 1.5,
              maxWidth: "680px",
              margin: "0 auto 36px",
              letterSpacing: "-0.2px",
            }}
          >
            Empowering students through rigorous code craftsmanship, peer mentorship, and real-world technology innovation at Rajarambapu Institute of Technology.
          </motion.p>

          {/* CTAs */}
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
              Explore Talent Directory
            </Button>
            <Button
              as={Link}
              href="/auth"
              variant="secondary-pill"
              size="default"
              style={{ color: "#ffffff", borderColor: "rgba(255, 255, 255, 0.35)" }}
            >
              Join Club
            </Button>
          </motion.div>
        </motion.div>
      </section>

      {/* ── TILE 2: Light Parchment Tile — "Our Story & Leadership" ── */}
      <section
        style={{
          padding: "96px 24px",
          backgroundColor: APPLE_COLORS.canvasParchment,
          position: "relative",
          width: "100%",
        }}
      >
        <div style={{ maxWidth: "1080px", margin: "0 auto" }}>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
              gap: "56px",
              alignItems: "center",
            }}
          >
            {/* Left Column: Team Photograph in Apple Utility Frame */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, ease: [0.25, 1, 0.5, 1] }}
            >
              <div
                style={{
                  position: "relative",
                  height: "440px",
                  borderRadius: APPLE_RADII.lg,
                  overflow: "hidden",
                  boxShadow: APPLE_SHADOW.productLight,
                  border: `1px solid ${APPLE_COLORS.hairline}`,
                  backgroundColor: "#1c1c1e",
                }}
              >
                <Image
                  src="/OysterTeam5.jpg"
                  alt="Oyster Kode Club Team"
                  fill
                  sizes="(max-width: 768px) 100vw, 50vw"
                  style={{
                    objectFit: "cover",
                    objectPosition: "center 30%",
                  }}
                />
                <div
                  style={{
                    position: "absolute",
                    inset: 0,
                    background: "linear-gradient(180deg, transparent 50%, rgba(0, 0, 0, 0.72) 100%)",
                  }}
                />
                <div
                  style={{
                    position: "absolute",
                    bottom: 0,
                    left: 0,
                    right: 0,
                    padding: "24px",
                    color: "#ffffff",
                  }}
                >
                  <span
                    style={{
                      fontSize: "11px",
                      textTransform: "uppercase",
                      letterSpacing: "0.08em",
                      fontWeight: 600,
                      color: "rgba(255, 255, 255, 0.8)",
                      display: "block",
                      marginBottom: "4px",
                    }}
                  >
                    Oyster Kode Club Community
                  </span>
                  <p style={{ fontSize: "14px", color: "rgba(255, 255, 255, 0.95)", margin: 0, fontWeight: 500 }}>
                    Building real-world software foundations and nurturing future technology leaders.
                  </p>
                </div>
              </div>
            </motion.div>

            {/* Right Column: Mission Text & Faculty Coordinator */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1, ease: [0.25, 1, 0.5, 1] }}
            >
              <span
                style={{
                  fontSize: "12px",
                  fontWeight: 600,
                  textTransform: "uppercase",
                  letterSpacing: "0.08em",
                  color: APPLE_COLORS.primary,
                  display: "block",
                  marginBottom: "8px",
                }}
              >
                Our Journey
              </span>
              <h2
                className="apple-display-md"
                style={{
                  fontSize: "clamp(28px, 4vw, 36px)",
                  fontWeight: 600,
                  color: APPLE_COLORS.ink,
                  lineHeight: 1.2,
                  marginBottom: "20px",
                  letterSpacing: "-0.02em",
                }}
              >
                Engineering with Purpose
              </h2>
              <p
                style={{
                  fontSize: "16px",
                  color: APPLE_COLORS.inkMuted48,
                  lineHeight: 1.6,
                  marginBottom: "16px",
                }}
              >
                The Oyster Kode Club at Rajarambapu Institute of Technology is an engineering collective dedicated to fostering technical curiosity, disciplined coding practice, and collaborative project execution.
              </p>
              <p
                style={{
                  fontSize: "16px",
                  color: APPLE_COLORS.inkMuted48,
                  lineHeight: 1.6,
                  marginBottom: "28px",
                }}
              >
                Through hackathons, structured workshops, competitive coding rounds, and community software releases, members develop the confidence and architectural maturity required for high-impact engineering careers.
              </p>

              {/* Quiet Monochrome Metric Counters */}
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: "16px",
                  marginBottom: "28px",
                }}
              >
                <div
                  style={{
                    backgroundColor: "#ffffff",
                    padding: "20px 22px",
                    borderRadius: APPLE_RADII.md,
                    border: `1px solid ${APPLE_COLORS.hairline}`,
                  }}
                >
                  <div
                    style={{
                      fontSize: "32px",
                      fontWeight: 600,
                      color: APPLE_COLORS.primary,
                      lineHeight: 1,
                      marginBottom: "6px",
                      letterSpacing: "-0.02em",
                    }}
                  >
                    70+
                  </div>
                  <div style={{ fontSize: "13px", fontWeight: 500, color: APPLE_COLORS.inkMuted48 }}>
                    Active Members
                  </div>
                </div>

                <div
                  style={{
                    backgroundColor: "#ffffff",
                    padding: "20px 22px",
                    borderRadius: APPLE_RADII.md,
                    border: `1px solid ${APPLE_COLORS.hairline}`,
                  }}
                >
                  <div
                    style={{
                      fontSize: "32px",
                      fontWeight: 600,
                      color: APPLE_COLORS.primary,
                      lineHeight: 1,
                      marginBottom: "6px",
                      letterSpacing: "-0.02em",
                    }}
                  >
                    10+
                  </div>
                  <div style={{ fontSize: "13px", fontWeight: 500, color: APPLE_COLORS.inkMuted48 }}>
                    Events &amp; Hackathons
                  </div>
                </div>
              </div>

              {/* Faculty Coordinator Card */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "14px",
                  padding: "16px 20px",
                  backgroundColor: "#ffffff",
                  borderRadius: APPLE_RADII.md,
                  border: `1px solid ${APPLE_COLORS.hairline}`,
                }}
              >
                <div
                  style={{
                    width: "40px",
                    height: "40px",
                    borderRadius: "50%",
                    backgroundColor: "rgba(0, 102, 204, 0.08)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: APPLE_COLORS.primary,
                    flexShrink: 0,
                  }}
                >
                  <GraduationCap size={20} />
                </div>
                <div>
                  <div style={{ fontSize: "14px", fontWeight: 600, color: APPLE_COLORS.ink }}>
                    Faculty Coordinator: Prof. Moshin Mulla
                  </div>
                  <div style={{ fontSize: "12px", color: APPLE_COLORS.inkMuted48, marginTop: "2px" }}>
                    Training and Placement Coordinator, Rajarambapu Institute of Technology
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── TILE 3: Pure White Canvas Tile — "Core Pillars" ── */}
      <section
        style={{
          padding: "96px 24px",
          backgroundColor: APPLE_COLORS.canvas,
          width: "100%",
        }}
      >
        <div style={{ maxWidth: "1080px", margin: "0 auto" }}>
          <div style={{ textAlign: "center", maxWidth: "680px", margin: "0 auto 56px" }}>
            <span
              style={{
                fontSize: "12px",
                fontWeight: 600,
                textTransform: "uppercase",
                letterSpacing: "0.08em",
                color: APPLE_COLORS.primary,
                display: "block",
                marginBottom: "8px",
              }}
            >
              Foundational Values
            </span>
            <h2
              className="apple-display-md"
              style={{
                fontSize: "clamp(28px, 4vw, 36px)",
                fontWeight: 600,
                color: APPLE_COLORS.ink,
                lineHeight: 1.2,
                marginBottom: "14px",
                letterSpacing: "-0.02em",
              }}
            >
              Our Core Pillars
            </h2>
            <p style={{ fontSize: "16px", color: APPLE_COLORS.inkMuted48, margin: 0, lineHeight: 1.5 }}>
              The principles and disciplines that shape every project, mentorship session, and event we organize.
            </p>
          </div>

          {/* 4 Pillars Grid */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
              gap: "24px",
            }}
          >
            {PILLARS.map((pillar, idx) => {
              const IconComp = pillar.icon;
              return (
                <motion.div
                  key={pillar.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: idx * 0.08, ease: [0.25, 1, 0.5, 1] }}
                >
                  <div
                    style={{
                      height: "100%",
                      display: "flex",
                      flexDirection: "column",
                      padding: "32px 26px",
                      backgroundColor: APPLE_COLORS.canvasParchment,
                      borderRadius: APPLE_RADII.lg,
                      border: `1px solid ${APPLE_COLORS.hairline}`,
                      boxSizing: "border-box",
                      transition: "transform 0.25s ease, box-shadow 0.25s ease",
                    }}
                  >
                    <div
                      style={{
                        width: "44px",
                        height: "44px",
                        borderRadius: APPLE_RADII.sm,
                        backgroundColor: "rgba(0, 102, 204, 0.08)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        marginBottom: "20px",
                        color: APPLE_COLORS.primary,
                      }}
                    >
                      <IconComp size={22} />
                    </div>
                    <h3
                      style={{
                        fontSize: "18px",
                        fontWeight: 600,
                        color: APPLE_COLORS.ink,
                        marginBottom: "10px",
                        letterSpacing: "-0.2px",
                      }}
                    >
                      {pillar.title}
                    </h3>
                    <p
                      style={{
                        fontSize: "14px",
                        color: APPLE_COLORS.inkMuted48,
                        lineHeight: 1.5,
                        margin: 0,
                      }}
                    >
                      {pillar.description}
                    </p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── TILE 4: Dark Callout Tile ── */}
      <section
        style={{
          padding: "80px 24px",
          backgroundColor: APPLE_COLORS.canvasParchment,
          textAlign: "center",
          width: "100%",
        }}
      >
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4, ease: [0.25, 1, 0.5, 1] }}
          style={{
            maxWidth: "840px",
            margin: "0 auto",
            backgroundColor: "#141416",
            borderRadius: APPLE_RADII.lg,
            padding: "56px 36px",
            color: "#ffffff",
          }}
        >
          <span
            style={{
              fontSize: "11px",
              fontWeight: 600,
              textTransform: "uppercase",
              letterSpacing: "0.08em",
              color: "rgba(255, 255, 255, 0.6)",
              display: "block",
              marginBottom: "12px",
            }}
          >
            DISCOVER ENGINEERING TALENT
          </span>
          <h2
            style={{
              fontSize: "clamp(26px, 3.5vw, 36px)",
              fontWeight: 600,
              marginBottom: "16px",
              lineHeight: 1.2,
              letterSpacing: "-0.02em",
            }}
          >
            Ready to explore verified student engineers?
          </h2>
          <p
            style={{
              fontSize: "16px",
              color: "rgba(255, 255, 255, 0.75)",
              maxWidth: "560px",
              margin: "0 auto 32px",
              lineHeight: 1.5,
            }}
          >
            Browse verified member profiles, inspect production code repositories, evaluate live demos, and connect directly with candidates.
          </p>
          <div style={{ display: "flex", gap: "14px", justifyContent: "center", flexWrap: "wrap" }}>
            <Button
              as={Link}
              href="/directory"
              variant="primary"
              size="default"
              rightGlyph={<ChevronRight size={15} />}
            >
              Browse Member Directory
            </Button>
            <Button
              as={Link}
              href="/auth"
              variant="secondary-pill"
              size="default"
              style={{ color: "#ffffff", borderColor: "rgba(255, 255, 255, 0.35)" }}
            >
              Join Oyster Kode Club
            </Button>
          </div>
        </motion.div>
      </section>

      {/* ── TILE 5: Clean Apple Footer (No Pitches Link) ── */}
      <footer
        style={{
          backgroundColor: APPLE_COLORS.canvasParchment,
          padding: "56px 24px 40px",
          borderTop: `1px solid ${APPLE_COLORS.hairline}`,
          width: "100%",
        }}
      >
        <div style={{ maxWidth: "1024px", margin: "0 auto" }}>
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
                  fontSize: "13px",
                  fontWeight: 600,
                  color: APPLE_COLORS.ink,
                  textTransform: "uppercase",
                  letterSpacing: "0.05em",
                  display: "block",
                  marginBottom: "8px",
                }}
              >
                OYSTER KODE CLUB
              </span>
              <p style={{ fontSize: "13px", color: APPLE_COLORS.inkMuted48, maxWidth: "340px", lineHeight: 1.5, margin: 0 }}>
                Official talent &amp; portfolio ecosystem of Oyster Kode Club, Rajarambapu Institute of Technology.
              </p>
            </div>

            <div style={{ display: "flex", gap: "48px", flexWrap: "wrap" }}>
              <div>
                <span style={{ fontSize: "12px", fontWeight: 600, color: APPLE_COLORS.ink, display: "block", marginBottom: "12px" }}>
                  Navigation
                </span>
                <div style={{ display: "flex", flexDirection: "column", gap: "8px", fontSize: "13px", color: APPLE_COLORS.inkMuted80 }}>
                  <Link href="/" style={{ textDecoration: "none", color: "inherit" }}>Home</Link>
                  <Link href="/about" style={{ textDecoration: "none", color: "inherit" }}>About Us</Link>
                  <Link href="/directory" style={{ textDecoration: "none", color: "inherit" }}>Member Directory</Link>
                </div>
              </div>

              <div>
                <span style={{ fontSize: "12px", fontWeight: 600, color: APPLE_COLORS.ink, display: "block", marginBottom: "12px" }}>
                  Portal
                </span>
                <div style={{ display: "flex", flexDirection: "column", gap: "8px", fontSize: "13px", color: APPLE_COLORS.inkMuted80 }}>
                  <Link href="/auth" style={{ textDecoration: "none", color: "inherit" }}>Member Sign In</Link>
                  <Link href="/portfolio" style={{ textDecoration: "none", color: "inherit" }}>Workspace Dashboard</Link>
                  <Link href="/admin" style={{ textDecoration: "none", color: "inherit" }}>Administration</Link>
                </div>
              </div>
            </div>
          </div>

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
            <div>
              &copy; {new Date().getFullYear()} Oyster Kode Club. All rights reserved.
            </div>
            <div>
              Rajarambapu Institute of Technology, Sangli
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
