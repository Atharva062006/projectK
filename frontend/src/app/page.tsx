"use client";
import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowUpRight, Award, Users, Terminal, Code, Cpu, Sparkles, HelpCircle, ChevronDown, ChevronUp } from "lucide-react";

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
    quote: "Being part of Oyster Kode Club was a turning point. The technical autonomy and building real projects prepared me directly for industry standards.",
    gradYear: 2024
  },
  {
    name: "Meera Sen",
    role: "Hardware Engineer",
    company: "Intel Corporation",
    quote: "The club's focus on low-level design, systems integration, and peer learning is rare. It helped me land my hardware role directly after graduation.",
    gradYear: 2023
  },
  {
    name: "Kabir Mehta",
    role: "Founding Engineer",
    company: "DevFlow Labs",
    quote: "The portfolio showcase portal is a game changer. We hiring managers need direct access to repos and resume downloads without navigating standard HR spam.",
    gradYear: 2022
  }
];

const FAQS: FAQItem[] = [
  {
    question: "What is Project K?",
    answer: "Project K is the official member portfolio showcase of Oyster Kode Club. It serves as a structured, searchable, and verified directory of our active members and alumni, making it easy for external stakeholders and recruiters to discover club talent."
  },
  {
    question: "Who can create a profile on this platform?",
    answer: "Only verified members and alumni of the Oyster Kode Club can create and customize their bento portfolios. External visitors can sign up as recruiters or guests to search, view full profiles, and download resumes."
  },
  {
    question: "How are member accounts approved?",
    answer: "When a new member or alumni registers, their account is flagged as 'Pending Approval'. The club administration verifies their membership records before activating the account, preventing unauthorized access."
  },
  {
    question: "Can recruiters download member resumes directly?",
    answer: "Yes. Registered recruiters and authenticated guests can download resumes directly from detailed member profiles. The platform logs each download and click for internal analytics, providing members with profile views insights."
  }
];

export default function LandingPage() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const toggleFaq = (index: number) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  return (
    <div className="min-h-screen bg-[#090a0f] text-gray-200 space-y-8">

      {/* 1. HERO SECTION */}
      <div className="border border-gray-800 rounded-xl overflow-hidden bg-[#0d0e15] shadow-2xl relative">
        <div className="absolute inset-0 pointer-events-none" style={{ background: "radial-gradient(ellipse at 50% 0%, rgba(240,165,0,0.07) 0%, rgba(240,24,112,0.05) 50%, transparent 75%)" }} />

        <div className="max-w-4xl mx-auto px-6 py-14 sm:py-20 text-center space-y-6 relative z-10">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-sm border" style={{ background: "rgba(240,165,0,0.08)", borderColor: "rgba(240,165,0,0.25)", color: "#f0a500" }}>
            <Sparkles size={14} />
            <span>Official Oyster Kode Club Talent Showcase</span>
          </div>

          <div className="flex justify-center">
            <Image src="/okc_main_logo.png" alt="OKC Logo" width={80} height={80} className="object-contain" />
          </div>

          <h1 className="text-5xl sm:text-6xl font-extrabold tracking-tight uppercase" style={{ background: "linear-gradient(135deg, #f0a500, #f01870)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>
            PROJECT K
          </h1>
          <p className="text-base sm:text-lg text-gray-400 max-w-2xl mx-auto leading-relaxed">
            A structured portfolio database of members and alumni. Seamlessly discover skill-based talents, download verified resumes, and contact developers.
          </p>

          <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/directory"
              className="w-full sm:w-auto flex items-center justify-center gap-2 text-sm text-white px-7 py-3 rounded-lg shadow-lg transition-all font-semibold hover:opacity-90"
              style={{ background: "linear-gradient(135deg, #f0a500, #f01870)" }}
            >
              <span>Browse Directory</span>
              <ArrowUpRight size={16} />
            </Link>

            <Link
              href="/auth"
              className="w-full sm:w-auto flex items-center justify-center gap-2 text-sm bg-[#141622] hover:bg-[#1b1d2c] border border-gray-800 hover:border-gray-700 text-gray-300 px-7 py-3 rounded-lg transition-all"
            >
              <span>Join Portal</span>
            </Link>
          </div>
        </div>
      </div>

      {/* 2. CLUB METRICS GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-[#0d0e15] border border-gray-800 rounded-xl p-6 space-y-3">
          <div className="w-9 h-9 rounded-lg flex items-center justify-center" style={{ background: "rgba(240,165,0,0.12)", border: "1px solid rgba(240,165,0,0.25)", color: "#f0a500" }}>
            <Users size={18} />
          </div>
          <div className="text-3xl font-bold text-white">150+</div>
          <div className="text-sm text-gray-500">Registered Talent Profiles</div>
        </div>

        <div className="bg-[#0d0e15] border border-gray-800 rounded-xl p-6 space-y-3">
          <div className="w-9 h-9 rounded-lg flex items-center justify-center" style={{ background: "rgba(240,80,0,0.12)", border: "1px solid rgba(240,80,0,0.25)", color: "#f05000" }}>
            <Award size={18} />
          </div>
          <div className="text-3xl font-bold text-white">50+</div>
          <div className="text-sm text-gray-500">Active Alumni Network</div>
        </div>

        <div className="bg-[#0d0e15] border border-gray-800 rounded-xl p-6 space-y-3">
          <div className="w-9 h-9 rounded-lg flex items-center justify-center" style={{ background: "rgba(240,24,112,0.10)", border: "1px solid rgba(240,24,112,0.25)", color: "#f01870" }}>
            <Code size={18} />
          </div>
          <div className="text-3xl font-bold text-white">12+</div>
          <div className="text-sm text-gray-500">Core Domains & Tech Tracks</div>
        </div>

        <div className="bg-[#0d0e15] border border-gray-800 rounded-xl p-6 space-y-3">
          <div className="w-9 h-9 rounded-lg flex items-center justify-center" style={{ background: "rgba(240,165,0,0.08)", border: "1px solid rgba(240,165,0,0.2)", color: "#e09000" }}>
            <Terminal size={18} />
          </div>
          <div className="text-3xl font-bold text-white">180+</div>
          <div className="text-sm text-gray-500">Open Source Repositories</div>
        </div>
      </div>

      {/* 3. CORE DOMAINS */}
      <div className="bg-[#0d0e15] border border-gray-800 rounded-xl p-6 space-y-5">
        <div className="border-b border-gray-800 pb-4 flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-white tracking-wide uppercase">Core Engineering Domains</h2>
            <p className="text-sm text-gray-500 mt-1">Discover members by filtering specific technical subdivisions</p>
          </div>
          <Link href="/directory" className="text-sm hover:underline flex items-center gap-1" style={{ color: "#f0a500" }}>
            <span>All filters</span>
            <ArrowUpRight size={14} />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Link
            href="/directory?search=Next.js"
            className="group block bg-[#0e1017] border border-gray-800 rounded-xl p-4 transition-all duration-300 hover:shadow-lg"
            onMouseEnter={e => (e.currentTarget.style.borderColor = 'rgba(240,165,0,0.5)')}
            onMouseLeave={e => (e.currentTarget.style.borderColor = '')}
          >
            <div className="flex justify-between items-start">
              <span className="text-sm font-semibold text-white">Web Development</span>
              <Cpu size={16} className="text-gray-600" />
            </div>
            <p className="text-xs text-gray-500 mt-2">React, Next.js, Node.js, TypeScript</p>
          </Link>

          <Link
            href="/directory?search=Python"
            className="group block bg-[#0e1017] border border-gray-800 rounded-xl p-4 transition-all duration-300 hover:shadow-lg"
            onMouseEnter={e => (e.currentTarget.style.borderColor = 'rgba(240,80,0,0.5)')}
            onMouseLeave={e => (e.currentTarget.style.borderColor = '')}
          >
            <div className="flex justify-between items-start">
              <span className="text-sm font-semibold text-white">AI & ML Pipelines</span>
              <Cpu size={16} className="text-gray-600" />
            </div>
            <p className="text-xs text-gray-500 mt-2">Python, PyTorch, Data Analysis</p>
          </Link>

          <Link
            href="/directory?search=VLSI"
            className="group block bg-[#0e1017] border border-gray-800 rounded-xl p-4 transition-all duration-300 hover:shadow-lg"
            onMouseEnter={e => (e.currentTarget.style.borderColor = 'rgba(240,24,112,0.5)')}
            onMouseLeave={e => (e.currentTarget.style.borderColor = '')}
          >
            <div className="flex justify-between items-start">
              <span className="text-sm font-semibold text-white">Systems & Hardware</span>
              <Cpu size={16} className="text-gray-600" />
            </div>
            <p className="text-xs text-gray-500 mt-2">Verilog, C/C++, Embedded Systems</p>
          </Link>

          <Link
            href="/directory?search=Docker"
            className="group block bg-[#0e1017] border border-gray-800 rounded-xl p-4 transition-all duration-300 hover:shadow-lg"
            onMouseEnter={e => (e.currentTarget.style.borderColor = 'rgba(240,165,0,0.4)')}
            onMouseLeave={e => (e.currentTarget.style.borderColor = '')}
          >
            <div className="flex justify-between items-start">
              <span className="text-sm font-semibold text-white">Cloud & DevOps</span>
              <Cpu size={16} className="text-gray-600" />
            </div>
            <p className="text-xs text-gray-500 mt-2">Docker, AWS, Kubernetes, CI/CD</p>
          </Link>
        </div>
      </div>

      {/* ALUMNI TESTIMONIALS */}
      <div className="bg-[#0d0e15] border border-gray-800 rounded-xl p-6 space-y-5">
        <div className="border-b border-gray-800 pb-4">
          <h2 className="text-base font-bold text-white tracking-wide uppercase">Alumni Success</h2>
          <p className="text-sm text-gray-500 mt-1">What our members say about their journey in Oyster Kode Club</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {TESTIMONIALS.map((t, index) => (
            <div
              key={index}
              className="bg-[#0e1017] border border-gray-800 rounded-xl p-5 flex flex-col justify-between space-y-4"
            >
              <p className="text-sm text-gray-400 italic leading-relaxed">
                &ldquo;{t.quote}&rdquo;
              </p>

              <div className="border-t border-gray-800/80 pt-3 flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-bold text-white">{t.name}</h4>
                  <p className="text-xs text-gray-500 mt-0.5">{t.role} @ <span className="text-gray-400 font-semibold">{t.company}</span></p>
                </div>
                <span className="text-xs px-2 py-0.5 rounded" style={{ background: "rgba(240,165,0,0.1)", border: "1px solid rgba(240,165,0,0.25)", color: "#f0a500" }}>
                  Class of {t.gradYear}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* FAQ ACCORDION */}
      <div className="bg-[#0d0e15] border border-gray-800 rounded-xl p-6 space-y-5">
        <div className="border-b border-gray-800 pb-4">
          <h2 className="text-base font-bold text-white tracking-wide uppercase">Frequently Asked Questions</h2>
          <p className="text-sm text-gray-500 mt-1">Everything you need to know about the portfolio ecosystem</p>
        </div>

        <div className="space-y-3">
          {FAQS.map((faq, index) => {
            const isOpen = openFaq === index;
            return (
              <div
                key={index}
                className="bg-[#0e1017] border border-gray-800 rounded-xl overflow-hidden"
              >
                <button
                  onClick={() => toggleFaq(index)}
                  className="w-full flex items-center justify-between p-4 text-left text-sm text-gray-300 hover:text-white cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <HelpCircle size={16} className="shrink-0" style={{ color: "#f0a500" }} />
                    <span>{faq.question}</span>
                  </div>
                  {isOpen ? <ChevronUp size={16} className="text-gray-500" /> : <ChevronDown size={16} className="text-gray-500" />}
                </button>

                {isOpen && (
                  <div className="px-5 pb-4 pt-1 text-sm text-gray-500 leading-relaxed border-t border-gray-800/40 bg-[#0d0f17]">
                    {faq.answer}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* FOOTER */}
      <footer className="border border-gray-800 rounded-xl bg-[#0d0e15] p-6 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 text-sm text-gray-400">
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Image src="/okc_main_logo.png" alt="OKC Logo" width={22} height={22} className="object-contain" />
              <span className="font-semibold text-white tracking-wider">OYSTER KODE CLUB</span>
            </div>
            <p className="text-sm text-gray-500 leading-relaxed">
              Official portfolio ecosystem showcasing talent, tech, and engineering solutions engineered by our active student club.
            </p>
          </div>

          <div className="space-y-2">
            <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider">Browse Sectors</h4>
            <ul className="space-y-1.5 text-sm">
              <li><Link href="/directory?search=Next.js" className="hover:text-white transition-colors">Web Systems</Link></li>
              <li><Link href="/directory?search=Python" className="hover:text-white transition-colors">Data Systems</Link></li>
              <li><Link href="/directory?search=VLSI" className="hover:text-white transition-colors">VLSI & Hardware</Link></li>
              <li><Link href="/directory?search=Docker" className="hover:text-white transition-colors">DevOps & Cloud</Link></li>
            </ul>
          </div>

          <div className="space-y-2">
            <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider">Portal Access</h4>
            <ul className="space-y-1.5 text-sm">
              <li><Link href="/directory" className="hover:text-white transition-colors">Member Directory</Link></li>
              <li><Link href="/pitches" className="hover:text-white transition-colors">Pitch Showcase</Link></li>
              <li><Link href="/auth" className="hover:text-white transition-colors">Join as Recruiter</Link></li>
              <li><Link href="/admin" className="hover:text-white transition-colors">Admin Dashboard</Link></li>
            </ul>
          </div>

          <div className="space-y-2">
            <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider">Contact & Socials</h4>
            <p className="text-sm text-gray-500">Have questions or looking to sponsor a dev hackathon?</p>
            <p className="text-sm text-white">contact@oysterkode.club</p>
          </div>
        </div>

        <div className="border-t border-gray-800/80 pt-4 flex flex-col sm:flex-row items-center justify-between text-xs text-gray-600">
          <div>&copy; {new Date().getFullYear()} Oyster Kode Club. All Rights Reserved.</div>
          <div className="flex gap-4 mt-2 sm:mt-0">
            <Link href="#" className="hover:underline">Privacy Policy</Link>
            <Link href="#" className="hover:underline">Terms of Service</Link>
          </div>
        </div>
      </footer>

    </div>
  );
}
