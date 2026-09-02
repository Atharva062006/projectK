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
  Sparkles,
  ArrowRight,
  GraduationCap,
  Laptop,
  Building2,
  UserCheck,
  ChevronRight,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { APPLE_COLORS, APPLE_RADII, APPLE_SHADOW } from "@/lib/theme";
import { fadeInUp, fadeInScale, staggerContainer } from "@/lib/animations";

export default function AboutPage() {
  const VISION_CARDS = [
    {
      icon: Code,
      title: "Coding Excellence",
      description: "Developing strong programming skills, algorithmic thinking, and modern software architecture expertise.",
      accent: "#ff6b35",
      bg: "rgba(255, 107, 53, 0.08)",
    },
    {
      icon: Users,
      title: "Community Building",
      description: "Creating a supportive, collaborative environment for continuous peer learning, mentorship, and growth.",
      accent: "#f72585",
      bg: "rgba(247, 37, 133, 0.08)",
    },
    {
      icon: Target,
      title: "Placement Preparation",
      description: "Preparing students for technical interviews, coding challenges, system design, and placement readiness.",
      accent: "#0066cc",
      bg: "rgba(0, 102, 204, 0.08)",
    },
    {
      icon: Award,
      title: "Skill Development",
      description: "Enhancing both core engineering abilities and non-technical soft skills essential for successful tech careers.",
      accent: "#7209b7",
      bg: "rgba(114, 9, 183, 0.08)",
    },
  ];

  return (
    <div style={{ display: "flex", flexDirection: "column", width: "100%", margin: 0, padding: 0 }}>
      {/* ── 1. Hero Section ── */}
      <section
        style={{
          position: "relative",
          overflow: "hidden",
          minHeight: "60vh",
          padding: "100px 24px 80px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          textAlign: "center",
          width: "100%",
          backgroundColor: "#141416",
          color: "#ffffff",
        }}
      >
        {/* Animated Gradient Background Orbs */}
        <div
          style={{
            position: "absolute",
            top: "-20%",
            right: "-10%",
            width: "600px",
            height: "600px",
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(255,107,53,0.15) 0%, rgba(247,37,133,0.05) 50%, transparent 70%)",
            filter: "blur(60px)",
            pointerEvents: "none",
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: "-20%",
            left: "-10%",
            width: "600px",
            height: "600px",
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(0,102,204,0.15) 0%, rgba(114,9,183,0.05) 50%, transparent 70%)",
            filter: "blur(60px)",
            pointerEvents: "none",
          }}
        />

        <motion.div
          variants={staggerContainer(0.12, 0.05)}
          initial="initial"
          animate="animate"
          style={{ maxWidth: "840px", margin: "0 auto", position: "relative", zIndex: 10 }}
        >
          {/* Badge */}
          <motion.div
            variants={fadeInUp}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "8px",
              padding: "6px 14px",
              borderRadius: APPLE_RADII.pill,
              backgroundColor: "rgba(255, 255, 255, 0.08)",
              border: "1px solid rgba(255, 255, 255, 0.12)",
              backdropFilter: "blur(12px)",
              fontSize: "12px",
              fontWeight: 500,
              color: "rgba(255, 255, 255, 0.9)",
              marginBottom: "24px",
            }}
          >
            <Sparkles size={14} color="#ff6b35" />
            <span>Rajarambapu Institute of Technology</span>
          </motion.div>

          {/* Heading */}
          <motion.h1
            variants={fadeInUp}
            style={{
              fontSize: "clamp(36px, 5vw, 56px)",
              fontWeight: 700,
              lineHeight: 1.1,
              letterSpacing: "-0.03em",
              marginBottom: "20px",
            }}
          >
            About{" "}
            <span
              style={{
                background: "linear-gradient(135deg, #ff6b35 0%, #f72585 60%, #0066cc 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              Oyster Kode Club
            </span>
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            variants={fadeInUp}
            style={{
              fontSize: "clamp(17px, 2.5vw, 21px)",
              color: "rgba(255, 255, 255, 0.72)",
              fontWeight: 400,
              lineHeight: 1.45,
              maxWidth: "680px",
              margin: "0 auto 32px",
            }}
          >
            Empowering students through code, collaboration, and innovation
          </motion.p>

          <motion.div variants={fadeInUp} style={{ display: "flex", gap: "14px", justifyContent: "center", flexWrap: "wrap" }}>
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
              href="/pitches"
              variant="secondary"
              size="default"
              style={{ color: "#ffffff", borderColor: "rgba(255, 255, 255, 0.3)" }}
            >
              View Member Pitches
            </Button>
          </motion.div>
        </motion.div>
      </section>

      {/* ── 2. Our Story Section ── */}
      <section
        style={{
          padding: "90px 24px",
          backgroundColor: APPLE_COLORS.canvas,
          position: "relative",
          overflow: "hidden",
        }}
      >
        <div style={{ maxWidth: "1080px", margin: "0 auto" }}>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
              gap: "48px",
              alignItems: "center",
            }}
          >
            {/* Left Column: Image with Hover Effect (using /OysterTeam5.jpg from landing page) */}
            <motion.div
              initial={{ opacity: 0, x: -24 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, ease: [0.25, 1, 0.5, 1] }}
              style={{ position: "relative" }}
            >
              <div
                style={{
                  position: "relative",
                  height: "420px",
                  borderRadius: APPLE_RADII.lg,
                  overflow: "hidden",
                  boxShadow: APPLE_SHADOW.productLight,
                  border: `1px solid ${APPLE_COLORS.hairline}`,
                  backgroundColor: "#1a1a1a",
                }}
                className="group"
              >
                <Image
                  src="/OysterTeam5.jpg"
                  alt="Oyster Kode Club Story"
                  fill
                  sizes="(max-width: 768px) 100vw, 50vw"
                  style={{
                    objectFit: "cover",
                    objectPosition: "center 30%",
                    transition: "transform 0.6s cubic-bezier(0.25, 1, 0.5, 1)",
                  }}
                  className="group-hover:scale-105"
                />
                {/* Gradient Scrim Overlay */}
                <div
                  style={{
                    position: "absolute",
                    inset: 0,
                    background: "linear-gradient(180deg, transparent 40%, rgba(0, 0, 0, 0.75) 100%)",
                    transition: "opacity 0.3s ease",
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
                    Oyster Kode Club Team
                  </span>
                  <p style={{ fontSize: "14px", color: "rgba(255, 255, 255, 0.95)", margin: 0, fontWeight: 500 }}>
                    Building real-world engineering projects and empowering technical talent at RIT.
                  </p>
                </div>
              </div>
            </motion.div>

            {/* Right Column: Story Text & Statistics */}
            <motion.div
              initial={{ opacity: 0, x: 24 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, ease: [0.25, 1, 0.5, 1] }}
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
                About Our Journey
              </span>
              <h2
                style={{
                  fontSize: "clamp(28px, 4vw, 36px)",
                  fontWeight: 700,
                  color: APPLE_COLORS.ink,
                  lineHeight: 1.2,
                  marginBottom: "20px",
                  letterSpacing: "-0.02em",
                }}
              >
                Our Story
              </h2>
              <p
                style={{
                  fontSize: "16px",
                  color: APPLE_COLORS.inkMuted48,
                  lineHeight: 1.6,
                  marginBottom: "16px",
                }}
              >
                The Oyster Kode Club at RIT is dedicated to fostering a culture of coding excellence and technical innovation. Our club provides a platform for students to enhance their programming skills, participate in coding competitions, and develop real-world projects.
              </p>
              <p
                style={{
                  fontSize: "16px",
                  color: APPLE_COLORS.inkMuted48,
                  lineHeight: 1.6,
                  marginBottom: "28px",
                }}
              >
                Under the guidance of our faculty coordinator, Prof. Moshin Mulla (Training and placement coordinator) RIT, we organize various activities including coding competitions, workshops, and technical sessions to help students build a strong foundation in programming.
              </p>

              {/* Metrics Grid */}
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
                    backgroundColor: APPLE_COLORS.canvasParchment,
                    padding: "18px 20px",
                    borderRadius: APPLE_RADII.md,
                    border: `1px solid ${APPLE_COLORS.hairline}`,
                  }}
                >
                  <div
                    style={{
                      fontSize: "32px",
                      fontWeight: 700,
                      background: "linear-gradient(135deg, #ff6b35 0%, #f72585 100%)",
                      WebkitBackgroundClip: "text",
                      WebkitTextFillColor: "transparent",
                      lineHeight: 1,
                      marginBottom: "6px",
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
                    backgroundColor: APPLE_COLORS.canvasParchment,
                    padding: "18px 20px",
                    borderRadius: APPLE_RADII.md,
                    border: `1px solid ${APPLE_COLORS.hairline}`,
                  }}
                >
                  <div
                    style={{
                      fontSize: "32px",
                      fontWeight: 700,
                      background: "linear-gradient(135deg, #0066cc 0%, #7209b7 100%)",
                      WebkitBackgroundClip: "text",
                      WebkitTextFillColor: "transparent",
                      lineHeight: 1,
                      marginBottom: "6px",
                    }}
                  >
                    10+
                  </div>
                  <div style={{ fontSize: "13px", fontWeight: 500, color: APPLE_COLORS.inkMuted48 }}>
                    Events Conducted
                  </div>
                </div>
              </div>

              {/* Faculty Coordinator Card */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "14px",
                  padding: "14px 18px",
                  backgroundColor: "rgba(0, 102, 204, 0.05)",
                  borderRadius: APPLE_RADII.md,
                  border: `1px solid rgba(0, 102, 204, 0.15)`,
                }}
              >
                <div
                  style={{
                    width: "38px",
                    height: "38px",
                    borderRadius: "50%",
                    backgroundColor: APPLE_COLORS.primary,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "#ffffff",
                    flexShrink: 0,
                  }}
                >
                  <GraduationCap size={20} />
                </div>
                <div>
                  <div style={{ fontSize: "14px", fontWeight: 600, color: APPLE_COLORS.ink }}>
                    Faculty Coordinator: Prof. Moshin Mulla
                  </div>
                  <div style={{ fontSize: "12px", color: APPLE_COLORS.inkMuted48 }}>
                    Training and Placement Coordinator, RIT
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── 3. Our Vision Section ── */}
      <section
        style={{
          padding: "90px 24px",
          backgroundColor: APPLE_COLORS.canvasParchment,
          borderTop: `1px solid ${APPLE_COLORS.hairline}`,
          borderBottom: `1px solid ${APPLE_COLORS.hairline}`,
        }}
      >
        <div style={{ maxWidth: "1080px", margin: "0 auto" }}>
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, ease: [0.25, 1, 0.5, 1] }}
            style={{ textAlign: "center", maxWidth: "680px", margin: "0 auto 56px" }}
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
              Driven by Purpose
            </span>
            <h2
              style={{
                fontSize: "clamp(28px, 4vw, 36px)",
                fontWeight: 700,
                color: APPLE_COLORS.ink,
                lineHeight: 1.2,
                marginBottom: "16px",
                letterSpacing: "-0.02em",
              }}
            >
              Our Vision
            </h2>
            <p
              style={{
                fontSize: "16px",
                color: APPLE_COLORS.inkMuted48,
                lineHeight: 1.5,
                margin: 0,
              }}
            >
              To develop students&apos; interest in coding, enhance their technical and non-technical skills, and prepare them for successful careers in technology.
            </p>
          </motion.div>

          {/* 4 Cards Grid */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
              gap: "24px",
            }}
          >
            {VISION_CARDS.map((card, idx) => {
              const IconComp = card.icon;
              return (
                <motion.div
                  key={card.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: idx * 0.08, ease: [0.25, 1, 0.5, 1] }}
                >
                  <Card
                    style={{
                      height: "100%",
                      display: "flex",
                      flexDirection: "column",
                      padding: "28px 24px",
                      backgroundColor: APPLE_COLORS.canvas,
                      borderRadius: APPLE_RADII.lg,
                      border: `1px solid ${APPLE_COLORS.hairline}`,
                      transition: "transform 0.25s ease, box-shadow 0.25s ease",
                    }}
                  >
                    <div
                      style={{
                        width: "48px",
                        height: "48px",
                        borderRadius: APPLE_RADII.md,
                        backgroundColor: card.bg,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        marginBottom: "20px",
                      }}
                    >
                      <IconComp size={24} color={card.accent} />
                    </div>
                    <h3
                      style={{
                        fontSize: "18px",
                        fontWeight: 600,
                        color: APPLE_COLORS.ink,
                        marginBottom: "10px",
                      }}
                    >
                      {card.title}
                    </h3>
                    <p
                      style={{
                        fontSize: "14px",
                        color: APPLE_COLORS.inkMuted48,
                        lineHeight: 1.5,
                        margin: 0,
                      }}
                    >
                      {card.description}
                    </p>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── 4. Call to Action Banner ── */}
      <section
        style={{
          padding: "80px 24px",
          backgroundColor: APPLE_COLORS.canvas,
          textAlign: "center",
        }}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4, ease: [0.25, 1, 0.5, 1] }}
          style={{
            maxWidth: "840px",
            margin: "0 auto",
            backgroundColor: "#141416",
            borderRadius: APPLE_RADII.lg,
            padding: "48px 32px",
            color: "#ffffff",
            position: "relative",
            overflow: "hidden",
          }}
        >
          <h2
            style={{
              fontSize: "clamp(24px, 3.5vw, 32px)",
              fontWeight: 700,
              marginBottom: "14px",
              lineHeight: 1.25,
            }}
          >
            Ready to explore verified engineering talent?
          </h2>
          <p
            style={{
              fontSize: "15px",
              color: "rgba(255, 255, 255, 0.72)",
              maxWidth: "540px",
              margin: "0 auto 28px",
              lineHeight: 1.5,
            }}
          >
            Discover member profiles, inspect verified tech stacks, view live projects, and connect directly with talent.
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
              variant="default"
              size="default"
            >
              Join Oyster Kode Club
            </Button>
          </div>
        </motion.div>
      </section>

      {/* ── 5. Footer ── */}
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
                  <Link href="/pitches" style={{ textDecoration: "none", color: "inherit" }}>Project Pitches</Link>
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
              © {new Date().getFullYear()} Oyster Kode Club. All rights reserved.
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
