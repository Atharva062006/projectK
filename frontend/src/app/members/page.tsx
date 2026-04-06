"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";

// Define Mock Data for Directories
const coreTeam = [
  { id: "c1", name: "Alex Volkov", title: "Lead Architect", role: "Executive", img: "https://lh3.googleusercontent.com/aida-public/AB6AXuCD0uWEWu8zH7N7fky1e2NGPpy_o_Ijn8-gAxVQt3BYM4Kx8WfeT8RLJVfBg-xGWe_xZtRpkruYaiMsA_oX73DVG4dbEl2X550JcfhXoDAnmiK-t5bujKd6MHKRfXL-YoqzjxTevFxVU6jLT-NgaFrCGXAcc2MOIkMyVp2grmf6Go0GZYMuyq79h04DatHMLPvo5JG3tAExSi8WDhQ2T4DOwX3jBExqZOFpeZf_tEc164558CYonTBrbOGprSwaR5yycTSY-3hs1O4x", skills: ["Strategy", "Infrastructure", "Scale"], quote: "\"Designing systems that transcend traditional digital boundaries.\"" },
  { id: "c2", name: "Elena Sato", title: "Creative Vision", role: "Director", img: "https://lh3.googleusercontent.com/aida-public/AB6AXuCIl-iU29wVPSP7SMFeQKBgn0vfw6yP7UY2VdnXRrRWfp2O33fdoFGj3HxcY3LlIGByO_1YNnK5xc9eAuk8MKF06qhgTQdXKonsUSewdOcTPePzaPAKJFS4w8ZXiZgp7tdeTxdL6yQ9bM8WTVU_TdJDgd7U7sa5JDXywvpO3pOryLdOgUcgws3t0cCU9LMxkMyTCjitMAxJv_Z0EfUaikPY13-s_jYBDETIrmxVHr_EuQx_OWLddYGqoy1JFYKNHFHps8uY8ZDfqgZ8", skills: ["Visuals", "Branding", "UI/UX"], quote: "\"Precision meets brutality in every pixel we deploy.\"" },
  { id: "c3", name: "Marcus Thorne", title: "Protocol Officer", role: "Security", img: "https://lh3.googleusercontent.com/aida-public/AB6AXuDqBAfQkmwj3qfgrXP0623RMSntD4nUanF9fs4ln8U2j3t7oktIXpRmYT33ijFOQ_yHnRdQ4FRUSaADZaFwu-iE3K1H9If6NIS6QO2Fl71t7sOG9PQ02vy4vz818Tm_aWlmXGlHtDtdx4M22wu966d1py31d0B9DKmNfYPJeLu5pT7w4qh81mkzPfcxYzuW1qm3kRf0GBAPUyitn8TFar8NThTnKmp8lhs8AtAIIf3In-STm4JYuGyqSYGcmVi5blRjxT3JIzDa_i2_", skills: ["Cybersec", "Audit", "Nodes"], quote: "\"Hardened security for a high-voltage digital world.\"" },
  { id: "c4", name: "Sarah Chen", title: "Project Lead", role: "Operations", img: "https://lh3.googleusercontent.com/aida-public/AB6AXuBoSJt3KQKWABuA2W8xJRf434QEPN1o3xWRUsUTuCdX0QlFfZus0yMofO3y4s1wfLTw65jUkzuiaJ1Wf3JL7fiHbhOnIyH3z1Mcomo8CodVNsmHdTgG71WUw9U7mHPdVy0MI-6HCF30m1tXXCxeMeOCC-X0JiGKcRKwWE27Gh4PgdMvtkMSI_7-_y8CXTLAKN_pTkwATN0tEqEPPeW6kB2rV-s6sr8_7oCK1zbzSBIBLdFWSpNtVYZZPffYLnWKsr2O4HGA--ytuwGs", skills: ["Agile", "Delivery", "Gov"], quote: "\"Synchronizing chaos into streamlined execution.\"" },
];

const techTeam = [
  { id: "t1", name: "Viktor Drago", title: "Backend Engineer", img: "https://lh3.googleusercontent.com/aida-public/AB6AXuDd-tNdPgB2hYBu3I_L3NAUm8ovz3vEUkZBHCrM_UbgkQuzxqUt8yhbQSFnK9BsuwK_htmMMRXmJg1RLUL8RxMt3c5DYS1E5KvaR0wrBfIemoIBn2_TSgMxyT4fzXD15BIZ14vA9eVBX1JHBwFMzzcznjduyeKFm8Esc63EQ5irjFtbOPIWAcxsQdXYGSlC45h4O3gq4yfG8SBm4ba8vE1lcr9aZ5ltul0mmfZ1NaMSsex4PitxHo6pkeUgT-L7nag6ThOybblZMVSh", skills: ["Rust", "Go", "Redis"], quote: "\"Low latency, high impact.\"" },
  { id: "t2", name: "Mia Wong", title: "Frontend Dev", img: "https://lh3.googleusercontent.com/aida-public/AB6AXuBwjvd-WTgO6CjA-xhk_h7oJA9DmbviHLjvt4jc74d4TIeB2Z7ecefY4oxrTlT7PZRiJiC-54OF9zGxal_N7lXTufMneQ6h7TFSgF7NNOg90p6JaTU9Q0Uk6C4R7LXaRSVBykjf9XLpOylH3KmoujsMueL3hCFn6Bl1KFze9nLKKKLO-PsN8EHLormcucjcOPmG7zXHg83DJo1iTYbsFhPcTR66UbZ1FuoxoBBK5BC20qWuK3HJKt52Sj4PQATtW8suePdXPkehEe6h", skills: ["React", "TS", "ThreeJS"], quote: "\"Pushing boundaries of the DOM.\"" },
  { id: "t3", name: "James Flint", title: "DevOps Expert", img: "https://lh3.googleusercontent.com/aida-public/AB6AXuB0HMJFnBytwhVJmnMySjlKk3kdtFM4ZIXmMgvxiRNaiUs9slccdxdOu5s7Wdc77YDcdoNiaR6CqDO6FDZlZeApc-xjbli3JEaaSOpGD_GTe6Y89_R7ls_NKizL5MSLCBwEAoJqaKUKS-NBFP6UxATgEoDCwc-CjSe1zlBpAPEzWtQRLcYRpODyk_CUOuT6mAIY-bfNpqbYKoiZrC7sM0JH-rxa1RXoYlIpfHnC2p3v_KL2TTkdmi7sd9HEb0VFv0OvZuIsK_qGuFMl", skills: ["K8s", "Terraform", "AWS"], quote: "\"Automation is non-negotiable.\"" },
];

const alumniTeam = [
  { id: "a1", name: "Ria Patel", title: "Senior Visionary (2020-2023)", skills: ["Concept", "Direction"] },
  { id: "a2", name: "Klaus Weber", title: "System Dev (2021-2022)", skills: ["C++", "OpenGL"] },
  { id: "a3", name: "Sofia Rossi", title: "Lead Researcher (2019-2023)", skills: ["Ethnography", "Futurism"] },
];

export default function Members() {
  const { user, login } = useAuth();
  const router = useRouter();
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [pendingProfileId, setPendingProfileId] = useState<string | null>(null);

  const handleProfileClick = (id: string, e: React.MouseEvent) => {
    e.preventDefault();
    if (!user) {
      setPendingProfileId(id);
      setShowAuthModal(true);
    } else {
      router.push(`/profile/${id}`); // We route to the real user profile
    }
  };

  const handleLoginProceed = () => {
    // 1. Simulate authentication
    login();
    setShowAuthModal(false);
    
    // 2. Route directly to the profile they were trying to view
    if (pendingProfileId) {
      router.push(`/profile/${pendingProfileId}`);
    }
  };

  return (
    <main className="max-w-7xl mx-auto px-6 py-12">
      {/* Auth Restriction Modal */}
      {showAuthModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white border-[3px] border-black p-8 neo-shadow-lg max-w-md w-full relative">
            <button 
              className="absolute top-2 right-2 material-symbols-outlined hover:text-primary transition-colors"
              onClick={() => setShowAuthModal(false)}
            >
              close
            </button>
            <h2 className="text-2xl font-black uppercase tracking-tighter mb-4 text-error">Auth_Required</h2>
            <p className="font-bold mb-6 text-sm border-l-4 border-error pl-4">Detailed profile access is restricted to authenticated members only per protocol FR-3.3.</p>
            <button 
              onClick={handleLoginProceed}
              className="w-full bg-black text-white p-3 font-black uppercase tracking-widest hover:bg-primary neo-shadow active:translate-x-[2px] active:translate-y-[2px] active:shadow-none transition-all"
            >
              Acknowledge & Login
            </button>
          </div>
        </div>
      )}

      {/* Header Section */}
      <header className="mb-12">
        <h1 className="text-6xl md:text-8xl font-black uppercase tracking-tighter leading-none mb-4">
          Project K<br /><span className="text-primary">Registry</span>
        </h1>
        <p className="max-w-2xl font-bold text-lg leading-tight uppercase border-l-4 border-primary pl-4">
          Decentralized personnel manifest for Project K initiative. Unauthorized access is restricted.
        </p>
      </header>
      
      {/* Search & Filter Bar */}
      <section className="mb-16">
        <div className="bg-white border-[3px] border-black neo-shadow flex flex-col md:flex-row p-2 gap-2 relative">
          <div className="relative flex-grow">
            <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-black">search</span>
            <input 
              className="w-full pl-12 pr-4 py-4 bg-transparent border-none focus:outline-none focus:ring-0 font-bold uppercase tracking-wider text-sm placeholder:text-zinc-400" 
              placeholder="SKILLS, ROLES, NAMES..." 
              type="text" 
            />
          </div>
          <button className="bg-secondary-container text-black border-[3px] border-black px-8 py-4 font-black uppercase tracking-widest text-sm neo-shadow-hover transition-all flex items-center justify-center gap-2 select-none">
            <span className="material-symbols-outlined">filter_list</span>
            All Filters
          </button>
        </div>
      </section>

      {/* Section: Core Team */}
      <section className="mb-20">
        <div className="flex items-end gap-4 mb-8">
          <h2 className="text-4xl font-black uppercase tracking-tighter bg-black text-white px-4 py-1">Core Team</h2>
          <div className="flex-grow h-[3px] bg-black mb-2"></div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {coreTeam.map(member => (
            <div 
              key={member.id} 
              onClick={(e) => handleProfileClick(member.id, e)} 
              className="bg-white border-[3px] border-black neo-shadow neo-card-hover transition-all flex flex-col cursor-pointer group"
            >
              <div className="aspect-square bg-zinc-100 border-b-[3px] border-black overflow-hidden relative">
                <img className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all" src={member.img} alt={member.name} />
                <div className="absolute top-4 left-4 bg-primary text-white px-3 py-1 text-[0.65rem] font-black uppercase tracking-widest border-[2px] border-black">{member.role}</div>
              </div>
              <div className="p-6 flex-grow">
                <h3 className="text-2xl font-black uppercase tracking-tight mb-1">{member.name}</h3>
                <p className="text-sm font-bold text-primary mb-4 uppercase">{member.title}</p>
                <p className="text-xs font-medium mb-6 leading-relaxed italic">{member.quote}</p>
                <div className="flex flex-wrap gap-2">
                  {member.skills.map(s => <span key={s} className="bg-secondary-container border-[2px] border-black px-2 py-1 text-[0.6rem] font-black uppercase">{s}</span>)}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Section: Technical Team */}
      <section className="mb-20">
        <div className="flex items-end gap-4 mb-8">
          <h2 className="text-4xl font-black uppercase tracking-tighter bg-black text-white px-4 py-1">Technical Team</h2>
          <div className="flex-grow h-[3px] bg-black mb-2"></div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {techTeam.map(member => (
            <div 
              key={member.id}
              onClick={(e) => handleProfileClick(member.id, e)}
              className="bg-white border-[3px] border-black neo-shadow neo-card-hover transition-all p-6 flex items-start gap-4 cursor-pointer group"
            >
              <div className="w-24 h-24 bg-zinc-100 border-[3px] border-black flex-shrink-0 grayscale group-hover:grayscale-0 transition-all">
                <img className="w-full h-full object-cover" src={member.img} alt={member.name} />
              </div>
              <div>
                <h3 className="text-xl font-black uppercase tracking-tight">{member.name}</h3>
                <p className="text-xs font-bold text-primary uppercase mb-2">{member.title}</p>
                <div className="flex flex-wrap gap-1 mb-2">
                  {member.skills.map(s => <span key={s} className="bg-zinc-100 border-[1px] border-black px-1.5 py-0.5 text-[0.55rem] font-bold uppercase">{s}</span>)}
                </div>
                <p className="text-[0.65rem] italic">{member.quote}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Section: Alumni */}
      <section className="mb-20">
        <div className="flex items-end gap-4 mb-8">
          <h2 className="text-4xl font-black uppercase tracking-tighter bg-zinc-400 text-black px-4 py-1">Alumni</h2>
          <div className="flex-grow h-[3px] bg-zinc-400 mb-2"></div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {alumniTeam.map(member => (
            <div key={member.id} className="bg-white border-[3px] border-zinc-400 neo-shadow neo-card-hover transition-all flex flex-col opacity-80 grayscale hover:opacity-100 cursor-pointer" onClick={(e) => handleProfileClick(member.id, e)}>
              <div className="p-6">
                <div className="bg-zinc-400 text-white px-2 py-0.5 text-[0.5rem] font-black uppercase tracking-widest inline-block mb-3">Honored Alumni</div>
                <h3 className="text-xl font-black uppercase tracking-tight mb-1">{member.name}</h3>
                <p className="text-[0.6rem] font-bold text-zinc-500 mb-4 uppercase">{member.title}</p>
                <div className="flex flex-wrap gap-1 mb-4">
                  {member.skills.map(s => <span key={s} className="border-[1px] border-zinc-400 px-1.5 py-0.5 text-[0.5rem] font-bold uppercase text-zinc-400">{s}</span>)}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
