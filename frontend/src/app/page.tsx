"use client";
import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowUpRight, Award, Users, Terminal, Code, Cpu, Sparkles, HelpCircle, ChevronDown, ChevronUp } from "lucide-react";

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
  { icon: Users, value: "150+", label: "Registered Talent Profiles", color: "#f0a500" },
  { icon: Award, value: "50+", label: "Active Alumni Network", color: "#f05000" },
  { icon: Code, value: "12+", label: "Core Domains & Tech Tracks", color: "#f01870" },
  { icon: Terminal, value: "180+", label: "Open Source Repositories", color: "#e09000" },
];

const DOMAINS = [
  { title: "Web Development", tech: "React, Next.js, Node.js, TypeScript", href: "/directory?search=Next.js" },
  { title: "AI & ML Pipelines", tech: "Python, PyTorch, Data Analysis", href: "/directory?search=Python" },
  { title: "Systems & Hardware", tech: "Verilog, C/C++, Embedded Systems", href: "/directory?search=VLSI" },
  { title: "Cloud & DevOps", tech: "Docker, AWS, Kubernetes, CI/CD", href: "/directory?search=Docker" },
];

export default function LandingPage() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  return (
    <div className="space-y-8 pb-8">
      
      {/* ── HERO ── */}
      <div className="glass-card rounded-2xl relative overflow-hidden py-8 sm:py-10 text-center">
        {/* Subtle radial glow */}
        <div className="absolute inset-0 pointer-events-none"
          style={{ background: "radial-gradient(ellipse at 50% 0%, rgba(240,165,0,0.07) 0%, rgba(240,24,112,0.05) 40%, transparent 70%)" }} />

        <div className="relative z-10 space-y-5 px-6 max-w-3xl mx-auto">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-sm anim-floatDown"
            style={{ background: "rgba(240,165,0,0.08)", border: "1px solid rgba(240,165,0,0.25)", color: "#f0a500" }}>
            <Sparkles size={13} />
            <span>Official Oyster Kode Club Talent Showcase</span>
          </div>

          {/* Continuous 3D Animated Logo */}
          <div className="flex justify-center py-2">
            <div className="relative logo-3d-animated">
              <Image src="/okc_main_logo.png" alt="OKC Logo" width={80} height={80} className="object-contain relative z-10" />
              <div className="absolute inset-0 rounded-full blur-2xl opacity-60 pointer-events-none"
                style={{ background: "radial-gradient(circle, rgba(240,165,0,0.5), rgba(240,24,112,0.3) 60%, transparent 75%)" }} />
            </div>
          </div>

          <h1
            className="text-5xl sm:text-6xl font-extrabold tracking-tight uppercase anim-floatDown anim-delay-2"
            style={{ background: "linear-gradient(135deg, #f0a500, #f01870)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}
          >
            PROJECT K
          </h1>

          <p className="text-base text-gray-400 max-w-xl mx-auto leading-relaxed anim-fadeInUp anim-delay-3">
            A structured portfolio database of members and alumni. Discover skill-based talent, download verified resumes, and connect with developers.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2 anim-fadeInUp anim-delay-4">
            <Link href="/directory"
              className="btn-brand w-full sm:w-auto flex items-center justify-center gap-2 text-sm text-white px-7 py-3 rounded-xl font-semibold">
              Browse Directory <ArrowUpRight size={15} />
            </Link>
            <Link href="/auth"
              className="btn-ghost w-full sm:w-auto flex items-center justify-center text-sm px-7 py-3 rounded-xl">
              Join Portal
            </Link>
          </div>
        </div>
      </div>

      {/* ── STATS CARDS (Static, No Hover Effect) ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {STATS.map((s, i) => (
          <div key={i} className={`glass-card rounded-2xl p-5 space-y-3 anim-fadeInUp anim-delay-${i + 1}`}>
            <s.icon size={20} style={{ color: s.color }} />
            <div className="text-3xl font-bold text-white">{s.value}</div>
            <div className="text-sm text-gray-400 font-medium">{s.label}</div>
          </div>
        ))}
      </div>

      {/* ── DOMAINS (Slide & Icon Spin Hover) ── */}
      <div className="glass-card rounded-2xl p-6 space-y-5">
        <div className="section-header flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-white uppercase tracking-wide">Core Engineering Domains</h2>
            <p className="text-sm text-gray-500 mt-0.5">Discover members by filtering technical subdivisions</p>
          </div>
          <Link href="/directory" className="flex items-center gap-1 text-sm font-semibold" style={{ color: "#f0a500" }}>
            All filters <ArrowUpRight size={13} />
          </Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {DOMAINS.map((d, i) => (
            <Link key={i} href={d.href}
              className={`glass-panel domain-card-hover block rounded-xl p-4 transition-all anim-fadeInUp anim-delay-${i + 2}`}>
              <div className="flex justify-between items-start">
                <span className="text-sm font-semibold text-white">{d.title}</span>
                <Cpu size={15} className="domain-icon text-gray-400 transition-all duration-300" />
              </div>
              <p className="text-xs text-gray-500 mt-2">{d.tech}</p>
            </Link>
          ))}
        </div>
      </div>

      {/* ── TESTIMONIALS (3D Tilt & Glow Hover) ── */}
      <div className="glass-card rounded-2xl p-6 space-y-5">
        <div className="section-header">
          <h2 className="text-base font-bold text-white uppercase tracking-wide">Alumni Success</h2>
          <p className="text-sm text-gray-500 mt-0.5">What our members say about their journey</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {TESTIMONIALS.map((t, i) => (
            <div key={i}
              className={`glass-panel testimonial-hover rounded-xl p-5 flex flex-col justify-between space-y-4 anim-fadeInUp anim-delay-${i + 2}`}>
              <div className="relative">
                <span className="quote-mark absolute -top-2 -left-1 text-4xl leading-none opacity-15 font-serif pointer-events-none"
                  style={{ color: "#f0a500" }}>&ldquo;</span>
                <p className="text-sm text-gray-400 italic leading-relaxed pt-3">&ldquo;{t.quote}&rdquo;</p>
              </div>
              <div className="section-header pt-3 flex items-center justify-between !mb-0">
                <div>
                  <h4 className="text-sm font-semibold text-white">{t.name}</h4>
                  <p className="text-xs text-gray-500 mt-0.5">{t.role} @ <span className="text-gray-400 font-medium">{t.company}</span></p>
                </div>
                <span className="text-xs px-2 py-0.5 rounded-full font-medium"
                  style={{ background: "rgba(240,165,0,0.09)", border: "1px solid rgba(240,165,0,0.2)", color: "#f0a500" }}>
                  {t.gradYear}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── FAQ ── */}
      <div className="glass-card rounded-2xl p-6 space-y-5">
        <div className="section-header">
          <h2 className="text-base font-bold text-white uppercase tracking-wide">Frequently Asked Questions</h2>
          <p className="text-sm text-gray-500 mt-0.5">Everything you need to know about the portfolio ecosystem</p>
        </div>
        <div className="space-y-2">
          {FAQS.map((faq, i) => {
            const isOpen = openFaq === i;
            return (
              <div key={i} className="glass-panel rounded-xl overflow-hidden transition-all duration-200">
                <button
                  onClick={() => setOpenFaq(isOpen ? null : i)}
                  className="w-full flex items-center justify-between p-4 text-left text-sm text-gray-300 hover:text-white cursor-pointer transition-colors">
                  <div className="flex items-center gap-3">
                    <HelpCircle size={14} style={{ color: "#f0a500", flexShrink: 0 }} />
                    <span>{faq.question}</span>
                  </div>
                  {isOpen ? <ChevronUp size={14} className="text-gray-500" /> : <ChevronDown size={14} className="text-gray-500" />}
                </button>
                {isOpen && (
                  <div className="px-5 pb-4 pt-0 text-sm text-gray-500 leading-relaxed section-header !mb-0">
                    <div className="pt-3">{faq.answer}</div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* ── FOOTER ── */}
      <footer className="glass-card rounded-2xl p-6 space-y-5">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 text-sm text-gray-400">
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Image src="/okc_main_logo.png" alt="OKC" width={18} height={18} className="object-contain" />
              <span className="font-semibold text-white text-sm tracking-wider">OYSTER KODE CLUB</span>
            </div>
            <p className="text-sm text-gray-500 leading-relaxed">Official portfolio ecosystem showcasing engineering talent built by our active student club.</p>
          </div>
          <div className="space-y-2">
            <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider">Browse</h4>
            <ul className="space-y-1.5">
              {[["Web Systems", "/directory?search=Next.js"], ["Data Systems", "/directory?search=Python"], ["VLSI & Hardware", "/directory?search=VLSI"], ["DevOps & Cloud", "/directory?search=Docker"]].map(([label, href]) => (
                <li key={href}><Link href={href} className="hover:text-gray-200 transition-colors">{label}</Link></li>
              ))}
            </ul>
          </div>
          <div className="space-y-2">
            <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider">Portal</h4>
            <ul className="space-y-1.5">
              {[["Member Directory", "/directory"], ["Pitch Showcase", "/pitches"], ["Join Portal", "/auth"], ["Admin Panel", "/admin"]].map(([label, href]) => (
                <li key={href}><Link href={href} className="hover:text-gray-200 transition-colors">{label}</Link></li>
              ))}
            </ul>
          </div>
          <div className="space-y-2">
            <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider">Contact</h4>
            <p className="text-sm text-gray-500">Questions or sponsorships?</p>
            <p className="text-sm font-medium text-gray-300">contact@oysterkode.club</p>
          </div>
        </div>
        <div className="section-header pt-4 flex flex-col sm:flex-row items-center justify-between text-xs text-gray-500 !mb-0">
          <div>&copy; {new Date().getFullYear()} Oyster Kode Club. All Rights Reserved.</div>
          <div className="flex gap-4 mt-2 sm:mt-0">
            <Link href="#" className="hover:text-gray-400 transition-colors">Privacy</Link>
            <Link href="#" className="hover:text-gray-400 transition-colors">Terms</Link>
          </div>
        </div>
      </footer>

    </div>
  );
}
