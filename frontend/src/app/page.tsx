"use client";
import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowUpRight, Award, Users, Terminal, Code, Cpu, HelpCircle, ChevronDown, ChevronUp, Layers, CheckCircle2, Briefcase } from "lucide-react";
import { useTheme } from "@/context/ThemeContext";

interface Testimonial { name: string; role: string; company: string; quote: string; gradYear: number; }
interface FAQItem { question: string; answer: string; }

const TESTIMONIALS: Testimonial[] = [
  { name: "Rohan Kulkarni", role: "Software Engineer", company: "Google", quote: "Being part of Oyster Kode Club was a turning point. The technical autonomy and building real projects prepared me directly for industry standards.", gradYear: 2024 },
  { name: "Meera Sen", role: "Hardware Engineer", company: "Intel Corporation", quote: "The club's focus on low-level design, systems integration, and peer learning is rare. It helped me land my hardware role directly after graduation.", gradYear: 2023 },
  { name: "Kabir Mehta", role: "Founding Engineer", company: "DevFlow Labs", quote: "The portfolio showcase portal is a game changer. We hiring managers need direct access to repos and resume downloads without navigating standard HR spam.", gradYear: 2022 },
];

const FAQS: FAQItem[] = [
  { question: "What is Project K?", answer: "Project K is the official member portfolio showcase of Oyster Kode Club. It serves as a structured, searchable, and verified directory of our active members and alumni." },
  { question: "Who can create a profile on this platform?", answer: "Only verified members and alumni of the Oyster Kode Club can create and customize their bento portfolios. External visitors can sign up as recruiters or guests to search and view profiles." },
  { question: "How are member accounts approved?", answer: "When a new member or alumni registers, their account is flagged as 'Pending Approval'. The club administration verifies their membership records before activating the account." },
  { question: "Can recruiters download member resumes directly?", answer: "Yes. Registered recruiters and authenticated guests can download resumes directly from detailed member profiles. The platform logs each download and click for internal analytics." },
];

const STATS = [
  { icon: Users, value: "150+", label: "Registered Talent Profiles", code: "TALENT_POOL" },
  { icon: Award, value: "50+", label: "Active Alumni Network", code: "ALUMNI_NET" },
  { icon: Code, value: "12+", label: "Core Engineering Tracks", code: "TECH_TRACKS" },
  { icon: Terminal, value: "180+", label: "Open Source Repositories", code: "REPOS_INDEXED" },
];

const DOMAINS = [
  { title: "Web Development", tech: "React, Next.js, Node.js, TypeScript", code: "DOMAIN_WEB", href: "/directory?search=Next.js" },
  { title: "AI & ML Pipelines", tech: "Python, PyTorch, Data Analysis", code: "DOMAIN_AI", href: "/directory?search=Python" },
  { title: "Systems & Hardware", tech: "Verilog, C/C++, Embedded Systems", code: "DOMAIN_HW", href: "/directory?search=VLSI" },
  { title: "Cloud & DevOps", tech: "Docker, AWS, Kubernetes, CI/CD", code: "DOMAIN_OPS", href: "/directory?search=Docker" },
];

export default function LandingPage() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const { brandStyle, toggleBrandStyle } = useTheme();

  return (
    <div className="space-y-10 pb-10">
      
      {/* ── HERO SECTION (MINIMAL NEOBRUTALIST ARCHITECTURE) ── */}
      <div className="neo-card rounded-xl relative overflow-hidden p-8 sm:p-12 text-center bg-tech-grid border-2 border-slate-800 shadow-neo">
        
        {/* Top Right Theme Toggle Button */}
        <div className="absolute top-4 right-4 z-20">
          <button
            onClick={toggleBrandStyle}
            title="Toggle between Official OKC Theme and LinkedIn Corporate Look"
            className="neo-btn-ghost text-xs font-mono font-bold px-3.5 py-1.5 rounded-lg flex items-center gap-2 cursor-pointer shadow-neo-sm hover:scale-105 transition-all"
          >
            <Briefcase size={14} style={{ color: brandStyle === "linkedin" ? "#0a66c2" : "#f0a500" }} />
            <span>{brandStyle === "linkedin" ? "[ SWITCH TO OKC THEME ]" : "[ SWITCH TO LINKEDIN LOOK ]"}</span>
          </button>
        </div>

        <div className="relative z-10 space-y-6 max-w-4xl mx-auto pt-4 sm:pt-0">
          {/* Top Code Badge */}
          <div className="inline-flex items-center gap-2 neo-badge neo-badge-amber anim-floatDown">
            <Terminal size={13} />
            <span>[ SYSTEM: OYSTER KODE CLUB TALENT REPOSITORY ]</span>
          </div>

          {/* 3D Animated Logo Frame */}
          <div className="flex justify-center py-2">
            <div className="relative logo-3d-animated p-3 rounded-lg border border-slate-700 bg-slate-900/60 shadow-neo-sm">
              <Image src="/okc_main_logo.png" alt="OKC Logo" width={84} height={84} className="object-contain relative z-10" />
            </div>
          </div>

          <h1 className="text-4xl sm:text-6xl font-mono font-black uppercase tracking-tight leading-none">
            ENGINEERING <span className="brand-text">TALENT PORTAL</span>
          </h1>

          <p className="text-base sm:text-lg text-slate-400 font-sans max-w-2xl mx-auto leading-relaxed anim-fadeInUp anim-delay-2">
            A structured, verified portfolio directory for Oyster Kode Club members & alumni. Discover skill-verified talent, download resumes, and recruit engineers.
          </p>

          {/* Hero CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4 anim-fadeInUp anim-delay-3">
            <Link href="/directory"
              className="neo-btn-brand w-full sm:w-auto flex items-center justify-center gap-2 text-sm px-8 py-3.5 rounded-md font-mono uppercase tracking-wider">
              Browse Directory <ArrowUpRight size={16} />
            </Link>
            <Link href="/auth"
              className="neo-btn-ghost w-full sm:w-auto flex items-center justify-center gap-2 text-sm px-8 py-3.5 rounded-md font-mono uppercase tracking-wider">
              <Layers size={15} /> Join Portal
            </Link>
          </div>

          {/* Feature Bullets */}
          <div className="pt-6 border-t border-slate-800 grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs font-mono text-slate-400 max-w-2xl mx-auto">
            <div className="flex items-center justify-center gap-2">
              <CheckCircle2 size={14} className="text-emerald-400" />
              <span>[ VERIFIED PROFILES ]</span>
            </div>
            <div className="flex items-center justify-center gap-2">
              <CheckCircle2 size={14} className={brandStyle === "linkedin" ? "text-[#0a66c2]" : "text-amber-400"} />
              <span>[ DIRECT RESUMES ]</span>
            </div>
            <div className="flex items-center justify-center gap-2">
              <CheckCircle2 size={14} className="text-pink-400" />
              <span>[ BENTO PORTFOLIOS ]</span>
            </div>
          </div>

        </div>
      </div>

      {/* ── STATS CARDS (MINIMAL NEOBRUTALIST GRID) ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {STATS.map((s, i) => (
          <div key={i} className={`neo-card rounded-xl p-6 space-y-3 border-2 border-slate-800 shadow-neo neo-card-hover anim-fadeInUp anim-delay-${i + 1}`}>
            <div className="flex items-center justify-between">
              <s.icon size={22} className="text-amber-400" />
              <span className="neo-badge neo-badge-amber">{s.code}</span>
            </div>
            <div className="text-4xl font-mono font-black tracking-tight brand-text">{s.value}</div>
            <div className="text-xs font-mono uppercase tracking-wider text-slate-400">{s.label}</div>
          </div>
        ))}
      </div>

      {/* ── CORE DOMAINS ── */}
      <div className="neo-card rounded-xl p-6 sm:p-8 space-y-6 border-2 border-slate-800 shadow-neo">
        <div className="section-header flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <div className="neo-badge neo-badge-amber mb-2 inline-block">[ TECHNICAL TRACKS ]</div>
            <h2 className="text-xl font-mono font-extrabold uppercase tracking-tight">Engineering Specialties</h2>
          </div>
          <Link href="/directory" className="neo-badge neo-badge-pink flex items-center gap-1 self-start sm:self-auto">
            <span>EXPLORE ALL FILTERS</span>
            <ArrowUpRight size={13} />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          {DOMAINS.map((d, i) => (
            <Link key={i} href={d.href}
              className={`neo-card rounded-lg p-5 border border-slate-800 neo-card-hover block space-y-3 anim-fadeInUp anim-delay-${i + 2}`}>
              <div className="flex justify-between items-start">
                <span className="neo-badge neo-badge-amber text-[10px]">{d.code}</span>
                <Cpu size={18} className="text-slate-400 group-hover:text-amber-400 transition-colors" />
              </div>
              <h3 className="text-base font-mono font-bold">{d.title}</h3>
              <p className="text-xs font-mono text-slate-400">{d.tech}</p>
            </Link>
          ))}
        </div>
      </div>

      {/* ── ALUMNI TESTIMONIALS ── */}
      <div className="neo-card rounded-xl p-6 sm:p-8 space-y-6 border-2 border-slate-800 shadow-neo">
        <div className="section-header">
          <div className="neo-badge neo-badge-pink mb-2 inline-block">[ VERIFIED TESTIMONIALS ]</div>
          <h2 className="text-xl font-mono font-extrabold uppercase tracking-tight">Alumni & Recruiter Feedback</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {TESTIMONIALS.map((t, i) => (
            <div key={i}
              className={`neo-card rounded-lg p-6 border border-slate-800 flex flex-col justify-between space-y-5 anim-fadeInUp anim-delay-${i + 2}`}>
              <p className="text-sm font-sans text-slate-300 italic leading-relaxed">&ldquo;{t.quote}&rdquo;</p>
              <div className="pt-4 border-t border-slate-800 flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-mono font-bold">{t.name}</h4>
                  <p className="text-xs font-mono text-slate-400">{t.role} @ <span className="text-amber-400 font-bold">{t.company}</span></p>
                </div>
                <span className="neo-badge neo-badge-amber">{t.gradYear}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── FREQUENTLY ASKED QUESTIONS ── */}
      <div className="neo-card rounded-xl p-6 sm:p-8 space-y-6 border-2 border-slate-800 shadow-neo">
        <div className="section-header">
          <div className="neo-badge neo-badge-amber mb-2 inline-block">[ KNOWLEDGE BASE ]</div>
          <h2 className="text-xl font-mono font-extrabold uppercase tracking-tight">Frequently Asked Questions</h2>
        </div>

        <div className="space-y-3">
          {FAQS.map((faq, i) => {
            const isOpen = openFaq === i;
            return (
              <div key={i} className="neo-card rounded-lg overflow-hidden border border-slate-800">
                <button
                  onClick={() => setOpenFaq(isOpen ? null : i)}
                  className="w-full flex items-center justify-between p-4 text-left font-mono text-sm font-bold text-slate-200 hover:text-white cursor-pointer transition-colors">
                  <div className="flex items-center gap-3">
                    <HelpCircle size={16} className="text-amber-400 flex-shrink-0" />
                    <span>{faq.question}</span>
                  </div>
                  {isOpen ? <ChevronUp size={16} className="text-slate-400" /> : <ChevronDown size={16} className="text-slate-400" />}
                </button>
                {isOpen && (
                  <div className="px-5 pb-4 pt-2 text-sm font-sans text-slate-400 leading-relaxed border-t border-slate-800/60 bg-slate-950/40">
                    {faq.answer}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* ── FOOTER ── */}
      <footer className="neo-card rounded-xl p-6 sm:p-8 space-y-6 border-2 border-slate-800 shadow-neo">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 text-sm">
          <div className="space-y-3">
            <div className="flex items-center gap-2.5">
              <Image src="/okc_main_logo.png" alt="OKC" width={20} height={20} className="object-contain" />
              <span className="font-mono font-black text-sm tracking-wider">OYSTER KODE CLUB</span>
            </div>
            <p className="text-xs font-mono text-slate-400 leading-relaxed">Official member & alumni talent repository platform built for recruitment and showcase.</p>
          </div>

          <div className="space-y-2">
            <h4 className="neo-badge neo-badge-amber text-[10px] inline-block">[ DOMAINS ]</h4>
            <ul className="space-y-1 font-mono text-xs text-slate-400">
              {[["Web Systems", "/directory?search=Next.js"], ["AI Pipelines", "/directory?search=Python"], ["VLSI & Systems", "/directory?search=VLSI"], ["DevOps & Cloud", "/directory?search=Docker"]].map(([label, href]) => (
                <li key={href}><Link href={href} className="hover:text-amber-400 transition-colors">{label}</Link></li>
              ))}
            </ul>
          </div>

          <div className="space-y-2">
            <h4 className="neo-badge neo-badge-pink text-[10px] inline-block">[ NAVIGATION ]</h4>
            <ul className="space-y-1 font-mono text-xs text-slate-400">
              {[["Talent Directory", "/directory"], ["Pitches Board", "/pitches"], ["Sign In / Register", "/auth"], ["Admin Control", "/admin"]].map(([label, href]) => (
                <li key={href}><Link href={href} className="hover:text-amber-400 transition-colors">{label}</Link></li>
              ))}
            </ul>
          </div>

          <div className="space-y-2">
            <h4 className="neo-badge neo-badge-amber text-[10px] inline-block">[ CONTACT ]</h4>
            <p className="text-xs font-mono text-slate-400">For sponsorships & hiring inquiries:</p>
            <p className="text-xs font-mono font-bold text-slate-200">contact@oysterkode.club</p>
          </div>
        </div>

        <div className="pt-4 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between text-xs font-mono text-slate-500">
          <div>&copy; {new Date().getFullYear()} Oyster Kode Club. All rights reserved.</div>
          <div className="flex gap-4 mt-2 sm:mt-0">
            <Link href="#" className="hover:text-slate-300 transition-colors">[ Privacy Policy ]</Link>
            <Link href="#" className="hover:text-slate-300 transition-colors">[ Terms of Service ]</Link>
          </div>
        </div>
      </footer>

    </div>
  );
}
