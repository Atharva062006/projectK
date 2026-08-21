"use client";
import { useState } from "react";
import Link from "next/link";
import Image from "next/image";

import Card from "@leafygreen-ui/card";
import Button from "@leafygreen-ui/button";
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
import { BRAND, STATUS, SURFACE, availabilityStyle } from "@/lib/theme";

interface Testimonial {
  name: string;
  role: string;
  company: string;
  quote: string;
  gradYear: number;
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
      "Being part of Oyster Kode Club was a turning point. The technical autonomy and building real projects prepared me directly for industry standards.",
    gradYear: 2024,
  },
  {
    name: "Meera Sen",
    role: "Hardware Engineer",
    company: "Intel Corporation",
    quote:
      "The club's focus on low-level design, systems integration, and peer learning is rare. It helped me land my hardware role directly after graduation.",
    gradYear: 2023,
  },
  {
    name: "Kabir Mehta",
    role: "Founding Engineer",
    company: "DevFlow Labs",
    quote:
      "The portfolio showcase portal is a game changer. Hiring managers need direct access to repos and resume downloads without navigating standard HR spam.",
    gradYear: 2022,
  },
];

const FAQS: FAQItem[] = [
  {
    question: "What is Project K?",
    answer:
      "Project K is the official member portfolio showcase of Oyster Kode Club. It serves as a structured, searchable, and verified directory of our active members and alumni.",
  },
  {
    question: "Who can create a profile on this platform?",
    answer:
      "Only verified members and alumni of the Oyster Kode Club can create and customize their bento portfolios. External visitors can sign up as recruiters or guests to search and view profiles.",
  },
  {
    question: "How are member accounts approved?",
    answer:
      "When a new member or alumni registers, their account is flagged as 'Pending Approval'. The club administration verifies their membership records before activating the account.",
  },
  {
    question: "Can recruiters download member resumes directly?",
    answer:
      "Yes. Registered recruiters and authenticated guests can download resumes directly from detailed member profiles. The platform logs each download and click for internal analytics.",
  },
];

const STATS = [
  { glyph: "MultiDirectionArrow", value: "150+", label: "Registered Talent Profiles" },
  { glyph: "University", value: "50+", label: "Active Alumni Network" },
  { glyph: "Code", value: "12+", label: "Core Domains & Tech Tracks" },
  { glyph: "Shell", value: "180+", label: "Open Source Repositories" },
];

const DOMAINS = [
  { title: "Web Development", tech: "React, Next.js, Node.js, TypeScript", href: "/directory?search=Next.js" },
  { title: "AI & ML Pipelines", tech: "Python, PyTorch, Data Analysis", href: "/directory?search=Python" },
  { title: "Systems & Hardware", tech: "Verilog, C/C++, Embedded Systems", href: "/directory?search=VLSI" },
  { title: "Cloud & DevOps", tech: "Docker, AWS, Kubernetes, CI/CD", href: "/directory?search=Docker" },
];

export default function LandingPage() {
  const { darkMode } = useTheme();
  const textColor = darkMode ? palette.white : palette.black;
  const mutedColor = darkMode ? palette.gray.light1 : palette.gray.dark1;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "32px", paddingBottom: "48px" }}>

      {/* ── HERO ── */}
      <Card darkMode={darkMode} style={{ textAlign: "center", padding: "48px 32px", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "relative", zIndex: 1, maxWidth: "640px", margin: "0 auto" }}>
          <div style={{ display: "flex", justifyContent: "center", marginBottom: "16px" }}>
            <Badge darkMode={darkMode} variant="lightgray">
              Official Oyster Kode Club Talent Showcase
            </Badge>
          </div>

          <div style={{ display: "flex", justifyContent: "center", marginBottom: "20px" }}>
            <div style={{ position: "relative" }}>
              <Image
                src="/okc_main_logo.png"
                alt="OKC Logo"
                width={80}
                height={80}
                style={{ objectFit: "contain", position: "relative", zIndex: 1 }}
              />
            </div>
          </div>

          <H1
            darkMode={darkMode}
            style={{
              color: textColor,
              marginBottom: "16px",
              letterSpacing: "-0.02em",
            }}
          >
            PROJECT K
          </H1>

          <Body darkMode={darkMode} style={{ color: mutedColor, marginBottom: "24px", lineHeight: "1.7" }}>
            A structured portfolio database of members and alumni. Discover skill-based talent,
            download verified resumes, and connect with developers.
          </Body>

          <div style={{ display: "flex", gap: "12px", justifyContent: "center", flexWrap: "wrap" }}>
            <Button
              as={Link}
              href="/directory"
              darkMode={darkMode}
              variant="primary"
              rightGlyph={<Icon glyph="ArrowRight" />}
            >
              Browse Directory
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
        </div>
      </Card>

      {/* ── STATS ── */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "16px" }}>
        {STATS.map((s, i) => (
          <Card
            key={i}
            darkMode={darkMode}
            className={`anim-fadeInUp anim-delay-${i + 1}`}
            style={{ padding: "24px", display: "flex", flexDirection: "column", gap: "12px" }}
          >
            <Icon glyph={s.glyph as never} fill={BRAND.primary} size={24} />
            <H2 darkMode={darkMode} style={{ color: textColor, margin: 0 }}>{s.value}</H2>
            <Label htmlFor="metric-label" darkMode={darkMode} style={{ color: mutedColor }}>{s.label}</Label>
          </Card>
        ))}
      </div>

      {/* ── DOMAINS ── */}
      <Card darkMode={darkMode} style={{ padding: "28px" }}>
        <div
          style={{
            display: "flex", alignItems: "center", justifyContent: "space-between",
            marginBottom: "20px", flexWrap: "wrap", gap: "8px",
          }}
        >
          <div>
            <Overline darkMode={darkMode}>Core Engineering Domains</Overline>
            <Body darkMode={darkMode} style={{ color: mutedColor, marginTop: "4px" }}>
              Discover members by filtering technical subdivisions
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
            All filters
          </Button>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "12px" }}>
          {DOMAINS.map((d, i) => (
            <Link
              key={i}
              href={d.href}
              style={{ textDecoration: "none" }}
              className={`anim-fadeInUp anim-delay-${i + 2}`}
            >
              <Card
                darkMode={darkMode}
                style={{
                  padding: "16px",
                  cursor: "pointer",
                  transition: "border-color 0.2s ease, box-shadow 0.2s ease",
                  height: "100%",
                }}
              >
                <H3 darkMode={darkMode} style={{ fontSize: "14px", marginBottom: "8px", color: textColor }}>
                  {d.title}
                </H3>
                <Body darkMode={darkMode} style={{ fontSize: "12px", color: mutedColor }}>
                  {d.tech}
                </Body>
              </Card>
            </Link>
          ))}
        </div>
      </Card>

      {/* ── TESTIMONIALS ── */}
      <Card darkMode={darkMode} style={{ padding: "28px" }}>
        <div style={{ marginBottom: "20px" }}>
          <Overline darkMode={darkMode}>Alumni Success</Overline>
          <Body darkMode={darkMode} style={{ color: mutedColor, marginTop: "4px" }}>
            What our members say about their journey
          </Body>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: "16px" }}>
          {TESTIMONIALS.map((t, i) => (
            <Card
              key={i}
              darkMode={darkMode}
              className={`anim-fadeInUp anim-delay-${i + 2}`}
              style={{ padding: "20px", display: "flex", flexDirection: "column", gap: "16px" }}
            >
              <Body
                darkMode={darkMode}
                style={{ fontStyle: "italic", color: mutedColor, lineHeight: "1.7", flex: 1 }}
              >
                &ldquo;{t.quote}&rdquo;
              </Body>

              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", paddingTop: "12px", borderTop: `1px solid ${SURFACE.border}` }}>
                <div>
                  <Subtitle darkMode={darkMode} style={{ fontSize: "13px", color: textColor, margin: 0 }}>
                    {t.name}
                  </Subtitle>
                  <Body darkMode={darkMode} style={{ fontSize: "11px", color: mutedColor, marginTop: "2px" }}>
                    {t.role} @ {t.company}
                  </Body>
                </div>
                <Badge darkMode={darkMode} variant="lightgray">{t.gradYear}</Badge>
              </div>
            </Card>
          ))}
        </div>
      </Card>

      {/* ── FAQ ── */}
      <Card darkMode={darkMode} style={{ padding: "28px" }}>
        <div style={{ marginBottom: "20px" }}>
          <Overline darkMode={darkMode}>Frequently Asked Questions</Overline>
          <Body darkMode={darkMode} style={{ color: mutedColor, marginTop: "4px" }}>
            Everything you need to know about the portfolio ecosystem
          </Body>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
          {FAQS.map((faq, i) => (
            <ExpandableCard
              key={i}
              darkMode={darkMode}
              title={faq.question}
              flagText="FAQ"
            >
              <Body darkMode={darkMode} style={{ color: mutedColor }}>{faq.answer}</Body>
            </ExpandableCard>
          ))}
        </div>
      </Card>

      {/* ── FOOTER ── */}
      <footer>
        <Card darkMode={darkMode} style={{ padding: "28px" }}>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))",
              gap: "24px",
              marginBottom: "24px",
            }}
          >
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "10px" }}>
                <Image src="/okc_main_logo.png" alt="OKC" width={20} height={20} style={{ objectFit: "contain" }} />
                <Subtitle darkMode={darkMode} style={{ fontSize: "12px", letterSpacing: "0.05em" }}>
                  OYSTER KODE CLUB
                </Subtitle>
              </div>
              <Body darkMode={darkMode} style={{ fontSize: "12px", color: mutedColor, lineHeight: "1.6" }}>
                Official portfolio ecosystem showcasing engineering talent built by our active student club.
              </Body>
            </div>

            <div>
              <Overline darkMode={darkMode} style={{ marginBottom: "10px" }}>Browse</Overline>
              <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                {[["Web Systems", "/directory?search=Next.js"], ["Data Systems", "/directory?search=Python"], ["VLSI & Hardware", "/directory?search=VLSI"], ["DevOps & Cloud", "/directory?search=Docker"]].map(([label, href]) => (
                  <Link key={href} href={href} style={{ fontSize: "13px", color: mutedColor, textDecoration: "none" }}>
                    {label}
                  </Link>
                ))}
              </div>
            </div>

            <div>
              <Overline darkMode={darkMode} style={{ marginBottom: "10px" }}>Portal</Overline>
              <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                {[["Member Directory", "/directory"], ["Pitch Showcase", "/pitches"], ["Join Portal", "/auth"], ["Admin Panel", "/admin"]].map(([label, href]) => (
                  <Link key={href} href={href} style={{ fontSize: "13px", color: mutedColor, textDecoration: "none" }}>
                    {label}
                  </Link>
                ))}
              </div>
            </div>

            <div>
              <Overline darkMode={darkMode} style={{ marginBottom: "10px" }}>Contact</Overline>
              <Body darkMode={darkMode} style={{ fontSize: "12px", color: mutedColor }}>
                Questions or sponsorships?
              </Body>
              <Body darkMode={darkMode} style={{ fontSize: "13px", color: BRAND.primary, marginTop: "4px" }}>
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
              gap: "8px",
              paddingTop: "16px",
              borderTop: `1px solid ${SURFACE.border}`,
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
        </Card>
      </footer>
    </div>
  );
}
