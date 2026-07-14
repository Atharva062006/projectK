"use client";
import { useState } from "react";
import Link from "next/link";
import { ArrowUpRight, Award, Users, Terminal, Code, Cpu, Sparkles, CheckCircle2, HelpCircle, ChevronDown, ChevronUp } from "lucide-react";

interface FeaturedMember {
  id: string;
  name: string;
  tagline: string;
  department: string;
  skills: string[];
  role: string;
}

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

const FEATURED_MEMBERS: FeaturedMember[] = [
  {
    id: "demo-1",
    name: "Atharva Kulkarni",
    tagline: "Full Stack Engineer & AI Enthusiast",
    department: "Core Team",
    skills: ["TypeScript", "Next.js", "PostgreSQL"],
    role: "Core Leader"
  },
  {
    id: "demo-2",
    name: "Sneha Sharma",
    tagline: "UI/UX Designer & Frontend Developer",
    department: "Technical Team",
    skills: ["Figma", "React.js", "Tailwind CSS"],
    role: "Tech Expert"
  },
  {
    id: "demo-5",
    name: "Ananya Iyer",
    tagline: "Systems Engineer & VLSI Designer",
    department: "Alumni",
    skills: ["Verilog", "C", "VLSI Design"],
    role: "Alumni / Intel"
  }
];

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
    <div className="min-h-screen bg-[#090a0f] text-gray-200 space-y-12">
      
      {/* 1. HERO SECTION */}
      <div className="border border-gray-800 rounded-xl overflow-hidden bg-[#0d0e15] shadow-2xl relative">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600/5 to-transparent opacity-40 pointer-events-none" />
        
        <div className="max-w-4xl mx-auto px-6 py-16 sm:py-24 text-center space-y-6 relative z-10">
          <div className="inline-flex items-center gap-2 bg-blue-950/50 border border-blue-800/60 px-3 py-1 rounded-full text-blue-400 text-xs font-mono">
            <Sparkles size={12} />
            <span>Official Oyster Kode Club Talent Showcase</span>
          </div>
          
          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-white font-mono uppercase">
            PROJECT K
          </h1>
          <p className="text-sm sm:text-base text-gray-400 font-mono max-w-2xl mx-auto leading-relaxed">
            A structured portfolio database of members and alumni. Seamlessly discover skill-based talents, download verified resumes, and contact developers.
          </p>

          <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link 
              href="/directory"
              className="w-full sm:w-auto flex items-center justify-center gap-2 text-xs font-mono bg-blue-600 hover:bg-blue-500 text-white px-6 py-3 rounded-lg shadow-lg hover:shadow-blue-900/30 transition-all font-semibold"
            >
              <span>Browse Directory</span>
              <ArrowUpRight size={14} />
            </Link>
            
            <Link 
              href="/auth"
              className="w-full sm:w-auto flex items-center justify-center gap-2 text-xs font-mono bg-[#141622] hover:bg-[#1b1d2c] border border-gray-800 hover:border-gray-700 text-gray-300 px-6 py-3 rounded-lg transition-all"
            >
              <span>Join Portal</span>
            </Link>
          </div>
        </div>
      </div>

      {/* 2. CLUB METRICS GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-[#0d0e15] border border-gray-800 rounded-xl p-6 space-y-2">
          <div className="w-8 h-8 rounded-lg bg-blue-950/40 border border-blue-800 flex items-center justify-center text-blue-400">
            <Users size={16} />
          </div>
          <div className="text-2xl font-bold text-white font-mono">150+</div>
          <div className="text-xs text-gray-500 font-mono">Registered Talent Profiles</div>
        </div>

        <div className="bg-[#0d0e15] border border-gray-800 rounded-xl p-6 space-y-2">
          <div className="w-8 h-8 rounded-lg bg-purple-950/40 border border-purple-800 flex items-center justify-center text-purple-400">
            <Award size={16} />
          </div>
          <div className="text-2xl font-bold text-white font-mono">50+</div>
          <div className="text-xs text-gray-500 font-mono">Active Alumni Network</div>
        </div>

        <div className="bg-[#0d0e15] border border-gray-800 rounded-xl p-6 space-y-2">
          <div className="w-8 h-8 rounded-lg bg-green-950/40 border border-green-800 flex items-center justify-center text-green-400">
            <Code size={16} />
          </div>
          <div className="text-2xl font-bold text-white font-mono">12+</div>
          <div className="text-xs text-gray-500 font-mono">Core Domains & Tech Tracks</div>
        </div>

        <div className="bg-[#0d0e15] border border-gray-800 rounded-xl p-6 space-y-2">
          <div className="w-8 h-8 rounded-lg bg-orange-950/40 border border-orange-800 flex items-center justify-center text-orange-400">
            <Terminal size={16} />
          </div>
          <div className="text-2xl font-bold text-white font-mono">180+</div>
          <div className="text-xs text-gray-500 font-mono">Open Source Repositories</div>
        </div>
      </div>

      {/* 3. CORE DOMAINS (SKILL DISTRIBUTION) */}
      <div className="bg-[#0d0e15] border border-gray-800 rounded-xl p-6 space-y-6">
        <div className="border-b border-gray-800 pb-3 flex items-center justify-between">
          <div>
            <h2 className="text-sm font-mono font-bold text-white tracking-wide uppercase">Core Engineering Domains</h2>
            <p className="text-[11px] text-gray-500 font-mono mt-1">Discover members by filtering specific technical subdivisions</p>
          </div>
          <Link href="/directory" className="text-xs font-mono text-blue-400 hover:underline flex items-center gap-1">
            <span>All filters</span>
            <ArrowUpRight size={12} />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Link 
            href="/directory?search=Next.js"
            className="group block bg-[#0e1017] border border-gray-800 hover:border-blue-600 rounded-xl p-4 transition-all duration-300 hover:shadow-lg"
          >
            <div className="flex justify-between items-start">
              <span className="text-xs font-semibold text-white font-mono group-hover:text-blue-400 transition-colors">Web Development</span>
              <Cpu size={14} className="text-gray-600 group-hover:text-blue-400" />
            </div>
            <p className="text-[10px] text-gray-500 font-mono mt-1">React, Next.js, Node.js, TypeScript</p>
          </Link>

          <Link 
            href="/directory?search=Python"
            className="group block bg-[#0e1017] border border-gray-800 hover:border-blue-600 rounded-xl p-4 transition-all duration-300 hover:shadow-lg"
          >
            <div className="flex justify-between items-start">
              <span className="text-xs font-semibold text-white font-mono group-hover:text-blue-400 transition-colors">AI & ML Pipelines</span>
              <Cpu size={14} className="text-gray-600 group-hover:text-blue-400" />
            </div>
            <p className="text-[10px] text-gray-500 font-mono mt-1">Python, PyTorch, Data Analysis</p>
          </Link>

          <Link 
            href="/directory?search=VLSI"
            className="group block bg-[#0e1017] border border-gray-800 hover:border-blue-600 rounded-xl p-4 transition-all duration-300 hover:shadow-lg"
          >
            <div className="flex justify-between items-start">
              <span className="text-xs font-semibold text-white font-mono group-hover:text-blue-400 transition-colors">Systems & Hardware</span>
              <Cpu size={14} className="text-gray-600 group-hover:text-blue-400" />
            </div>
            <p className="text-[10px] text-gray-500 font-mono mt-1">Verilog, C/C++, Embedded Systems</p>
          </Link>

          <Link 
            href="/directory?search=Docker"
            className="group block bg-[#0e1017] border border-gray-800 hover:border-blue-600 rounded-xl p-4 transition-all duration-300 hover:shadow-lg"
          >
            <div className="flex justify-between items-start">
              <span className="text-xs font-semibold text-white font-mono group-hover:text-blue-400 transition-colors">Cloud & DevOps</span>
              <Cpu size={14} className="text-gray-600 group-hover:text-blue-400" />
            </div>
            <p className="text-[10px] text-gray-500 font-mono mt-1">Docker, AWS, Kubernetes, CI/CD</p>
          </Link>
        </div>
      </div>

      {/* NEW: HOW IT WORKS SECTION */}
      <div className="bg-[#0d0e15] border border-gray-800 rounded-xl p-6 space-y-6">
        <div className="border-b border-gray-800 pb-3">
          <h2 className="text-sm font-mono font-bold text-white tracking-wide uppercase">How It Works</h2>
          <p className="text-[11px] text-gray-500 font-mono mt-1">Seamless interaction model for members, alumni, and recruiters</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 font-mono text-xs text-gray-400">
          <div className="space-y-3 relative p-4 bg-[#0e1017] border border-gray-850 rounded-xl">
            <div className="w-6 h-6 rounded-full bg-blue-950 border border-blue-800 flex items-center justify-center text-xs font-bold text-blue-400">1</div>
            <h3 className="font-semibold text-white text-xs">Build Your Bento Profile</h3>
            <p className="text-[10px] leading-relaxed text-gray-500">
              Members register and create a beautiful, structured bento dashboard summarizing their skills, experience, project repositories, and resume.
            </p>
          </div>

          <div className="space-y-3 relative p-4 bg-[#0e1017] border border-gray-850 rounded-xl">
            <div className="w-6 h-6 rounded-full bg-blue-950 border border-blue-800 flex items-center justify-center text-xs font-bold text-blue-400">2</div>
            <h3 className="font-semibold text-white text-xs">Admin Review & Approval</h3>
            <p className="text-[10px] leading-relaxed text-gray-500">
              Club administrators review profiles to verify credentials and technical tracks, activating member access to protect catalog validity.
            </p>
          </div>

          <div className="space-y-3 relative p-4 bg-[#0e1017] border border-gray-850 rounded-xl">
            <div className="w-6 h-6 rounded-full bg-blue-950 border border-blue-800 flex items-center justify-center text-xs font-bold text-blue-400">3</div>
            <h3 className="font-semibold text-white text-xs">Recruiter Connection</h3>
            <p className="text-[10px] leading-relaxed text-gray-500">
              Hiring managers perform skill-based queries, view code credentials, download PDF resumes, and initiate contact directly.
            </p>
          </div>
        </div>
      </div>

      {/* NEW: WHY OYSTER KODE CLUB VALUE ADVANTAGES */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 bg-[#0d0e15] border border-gray-800 rounded-xl p-6 space-y-4">
          <h2 className="text-sm font-mono font-bold text-white tracking-wide uppercase border-b border-gray-800 pb-3">The Quality Advantage</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex gap-3">
              <CheckCircle2 size={16} className="text-blue-500 shrink-0 mt-0.5" />
              <div className="space-y-1">
                <h4 className="text-xs font-mono font-bold text-white">Pre-Vetted Core Expertise</h4>
                <p className="text-[10px] font-mono text-gray-500 leading-relaxed">Every member has demonstrated active contribution across real-world internal projects and repositories.</p>
              </div>
            </div>

            <div className="flex gap-3">
              <CheckCircle2 size={16} className="text-blue-500 shrink-0 mt-0.5" />
              <div className="space-y-1">
                <h4 className="text-xs font-mono font-bold text-white">Verified Resume Vault</h4>
                <p className="text-[10px] font-mono text-gray-500 leading-relaxed">PDF resumes are structured and checked directly before showcase listings to guarantee format sanity.</p>
              </div>
            </div>

            <div className="flex gap-3">
              <CheckCircle2 size={16} className="text-blue-500 shrink-0 mt-0.5" />
              <div className="space-y-1">
                <h4 className="text-xs font-mono font-bold text-white">Direct Open Source Links</h4>
                <p className="text-[10px] font-mono text-gray-500 leading-relaxed">No generic lists. Profile viewers can navigate directly to member GitHub repositories and active URLs in one click.</p>
              </div>
            </div>

            <div className="flex gap-3">
              <CheckCircle2 size={16} className="text-blue-500 shrink-0 mt-0.5" />
              <div className="space-y-1">
                <h4 className="text-xs font-mono font-bold text-white">Zero Third-Party Middlemen</h4>
                <p className="text-[10px] font-mono text-gray-500 leading-relaxed">Recruiters and team leads contact members directly, avoiding recruitment platforms and listing overheads.</p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-[#0d0e15] border border-gray-800 rounded-xl p-6 flex flex-col justify-between">
          <div className="space-y-2">
            <h2 className="text-sm font-mono font-bold text-white tracking-wide uppercase border-b border-gray-800 pb-3">Shareable Pitches</h2>
            <p className="text-[10px] font-mono text-gray-500 leading-relaxed pt-1">
              Are you looking to pitch a specific team of developers to an external stakeholder or client?
            </p>
            <p className="text-[10px] font-mono text-gray-500 leading-relaxed">
              Our **Admin Pitch Builder** empowers leads to select a group of talent profiles, group them under a single custom shareable URL, and send them directly to hiring managers.
            </p>
          </div>
          <Link
            href="/pitches"
            className="text-[10px] font-mono bg-[#141622] hover:bg-[#1b1d2c] border border-gray-850 hover:border-gray-700 text-center py-2.5 rounded-lg text-gray-300 transition-all font-semibold"
          >
            Launch Pitch Lookup
          </Link>
        </div>
      </div>

      {/* 5. FEATURED PROFILES PREVIEW */}
      <div className="bg-[#0d0e15] border border-gray-800 rounded-xl p-6 space-y-6">
        <div className="border-b border-gray-800 pb-3">
          <h2 className="text-sm font-mono font-bold text-white tracking-wide uppercase">Featured Members</h2>
          <p className="text-[11px] text-gray-500 font-mono mt-1">A brief preview of outstanding engineers and alumni</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {FEATURED_MEMBERS.map((m) => {
            const initials = m.name.split(" ").map(n => n[0]).join("").toUpperCase();
            return (
              <div 
                key={m.id}
                className="bg-[#0e1017] border border-gray-850 rounded-xl p-4 flex flex-col justify-between h-[190px]"
              >
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-600/30 to-indigo-950/70 border border-blue-500/20 flex items-center justify-center text-xs font-mono font-bold text-blue-300">
                      {initials}
                    </div>
                    <div>
                      <h3 className="font-semibold text-xs text-white font-mono">{m.name}</h3>
                      <p className="text-[9px] text-gray-500 font-mono mt-0.5">{m.role}</p>
                    </div>
                  </div>
                  <p className="text-[10px] text-gray-400 font-mono leading-relaxed line-clamp-2">{m.tagline}</p>
                </div>

                <div className="pt-3 border-t border-gray-800/80 flex items-center justify-between">
                  <div className="flex gap-1">
                    {m.skills.slice(0, 2).map((s) => (
                      <span key={s} className="text-[8px] font-mono bg-[#141620] text-gray-400 px-1.5 py-0.5 rounded border border-gray-850">
                        {s}
                      </span>
                    ))}
                  </div>

                  <Link 
                    href={`/profiles/${m.id}`}
                    className="text-[9px] font-mono text-blue-400 hover:text-blue-300 hover:underline flex items-center gap-0.5"
                  >
                    <span>Showcase</span>
                    <ArrowUpRight size={10} />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* NEW: ALUMNI TESTIMONIALS */}
      <div className="bg-[#0d0e15] border border-gray-800 rounded-xl p-6 space-y-6">
        <div className="border-b border-gray-800 pb-3">
          <h2 className="text-sm font-mono font-bold text-white tracking-wide uppercase">Alumni Success</h2>
          <p className="text-[11px] text-gray-500 font-mono mt-1">What our members say about their journey in Oyster Kode Club</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {TESTIMONIALS.map((t, index) => (
            <div 
              key={index}
              className="bg-[#0e1017] border border-gray-855 rounded-xl p-5 flex flex-col justify-between space-y-4"
            >
              <p className="text-[11px] font-mono text-gray-400 italic leading-relaxed">
                &ldquo;{t.quote}&rdquo;
              </p>

              <div className="border-t border-gray-800/80 pt-3 flex items-center justify-between">
                <div>
                  <h4 className="text-[11px] font-mono font-bold text-white">{t.name}</h4>
                  <p className="text-[9px] font-mono text-gray-500">{t.role} @ <span className="text-gray-400 font-semibold">{t.company}</span></p>
                </div>
                <span className="text-[9px] font-mono bg-blue-950 text-blue-300 px-2 py-0.5 rounded border border-blue-900">
                  Class of {t.gradYear}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* NEW: FAQ ACCORDION SECTION */}
      <div className="bg-[#0d0e15] border border-gray-800 rounded-xl p-6 space-y-6">
        <div className="border-b border-gray-800 pb-3">
          <h2 className="text-sm font-mono font-bold text-white tracking-wide uppercase">Frequently Asked Questions</h2>
          <p className="text-[11px] text-gray-500 font-mono mt-1">Everything you need to know about the portfolio ecosystem</p>
        </div>

        <div className="space-y-3">
          {FAQS.map((faq, index) => {
            const isOpen = openFaq === index;
            return (
              <div 
                key={index}
                className="bg-[#0e1017] border border-gray-850 rounded-xl overflow-hidden transition-all duration-350"
              >
                <button
                  onClick={() => toggleFaq(index)}
                  className="w-full flex items-center justify-between p-4 text-left font-mono text-xs text-gray-300 hover:text-white cursor-pointer"
                >
                  <div className="flex items-center gap-2">
                    <HelpCircle size={14} className="text-blue-500 shrink-0" />
                    <span>{faq.question}</span>
                  </div>
                  {isOpen ? <ChevronUp size={14} className="text-gray-500" /> : <ChevronDown size={14} className="text-gray-500" />}
                </button>

                {isOpen && (
                  <div className="px-4 pb-4 pt-1 font-mono text-[11px] text-gray-500 leading-relaxed border-t border-gray-850/40 bg-[#0d0f17]">
                    {faq.answer}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* NEW: COMPLETE footer */}
      <footer className="border border-gray-800 rounded-xl bg-[#0d0e15] p-6 space-y-6 font-mono">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 text-xs text-gray-400">
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-5 h-5 rounded bg-blue-600 flex items-center justify-center font-bold text-[10px] text-white">K</div>
              <span className="font-semibold text-white text-xs tracking-wider">OYSTER KODE CLUB</span>
            </div>
            <p className="text-[10px] text-gray-500 leading-relaxed">
              Official portfolio ecosystem showcasing talent, tech, and engineering solutions engineered by our active student club.
            </p>
          </div>

          <div className="space-y-2">
            <h4 className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">Browse Sectors</h4>
            <ul className="space-y-1 text-[10px]">
              <li><Link href="/directory?search=Next.js" className="hover:text-white transition-colors">Web Systems</Link></li>
              <li><Link href="/directory?search=Python" className="hover:text-white transition-colors">Data Systems</Link></li>
              <li><Link href="/directory?search=VLSI" className="hover:text-white transition-colors">VLSI & Hardware</Link></li>
              <li><Link href="/directory?search=Docker" className="hover:text-white transition-colors">DevOps & Cloud</Link></li>
            </ul>
          </div>

          <div className="space-y-2">
            <h4 className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">Portal Access</h4>
            <ul className="space-y-1 text-[10px]">
              <li><Link href="/directory" className="hover:text-white transition-colors">Member Directory</Link></li>
              <li><Link href="/pitches" className="hover:text-white transition-colors">Pitch Showcase</Link></li>
              <li><Link href="/auth" className="hover:text-white transition-colors">Join as Recruiter</Link></li>
              <li><Link href="/admin" className="hover:text-white transition-colors">Admin Dashboard</Link></li>
            </ul>
          </div>

          <div className="space-y-2">
            <h4 className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">Contact & Socials</h4>
            <p className="text-[10px] text-gray-500">Have questions or looking to sponsor a dev hackathon?</p>
            <p className="text-[10px] text-white">contact@oysterkode.club</p>
          </div>
        </div>

        <div className="border-t border-gray-800/80 pt-4 flex flex-col sm:flex-row items-center justify-between text-[9px] text-gray-600">
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
