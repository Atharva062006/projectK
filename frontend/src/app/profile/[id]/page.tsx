"use client";

import { useAuth } from "@/context/AuthContext";
import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";

// Mock Database 
const mockDatabase = [
  { id: "c1", name: "Alex Volkov", title: "Lead Architect", role: "Executive", img: "https://lh3.googleusercontent.com/aida-public/AB6AXuCD0uWEWu8zH7N7fky1e2NGPpy_o_Ijn8-gAxVQt3BYM4Kx8WfeT8RLJVfBg-xGWe_xZtRpkruYaiMsA_oX73DVG4dbEl2X550JcfhXoDAnmiK-t5bujKd6MHKRfXL-YoqzjxTevFxVU6jLT-NgaFrCGXAcc2MOIkMyVp2grmf6Go0GZYMuyq79h04DatHMLPvo5JG3tAExSi8WDhQ2T4DOwX3jBExqZOFpeZf_tEc164558CYonTBrbOGprSwaR5yycTSY-3hs1O4x", skills: ["Strategy", "Infrastructure", "Scale"], quote: "\"Designing systems that transcend traditional digital boundaries.\"" },
  { id: "c2", name: "Elena Sato", title: "Creative Vision", role: "Director", img: "https://lh3.googleusercontent.com/aida-public/AB6AXuCIl-iU29wVPSP7SMFeQKBgn0vfw6yP7UY2VdnXRrRWfp2O33fdoFGj3HxcY3LlIGByO_1YNnK5xc9eAuk8MKF06qhgTQdXKonsUSewdOcTPePzaPAKJFS4w8ZXiZgp7tdeTxdL6yQ9bM8WTVU_TdJDgd7U7sa5JDXywvpO3pOryLdOgUcgws3t0cCU9LMxkMyTCjitMAxJv_Z0EfUaikPY13-s_jYBDETIrmxVHr_EuQx_OWLddYGqoy1JFYKNHFHps8uY8ZDfqgZ8", skills: ["Visuals", "Branding", "UI/UX"], quote: "\"Precision meets brutality in every pixel we deploy.\"" },
  { id: "c3", name: "Marcus Thorne", title: "Protocol Officer", role: "Security", img: "https://lh3.googleusercontent.com/aida-public/AB6AXuDqBAfQkmwj3qfgrXP0623RMSntD4nUanF9fs4ln8U2j3t7oktIXpRmYT33ijFOQ_yHnRdQ4FRUSaADZaFwu-iE3K1H9If6NIS6QO2Fl71t7sOG9PQ02vy4vz818Tm_aWlmXGlHtDtdx4M22wu966d1py31d0B9DKmNfYPJeLu5pT7w4qh81mkzPfcxYzuW1qm3kRf0GBAPUyitn8TFar8NThTnKmp8lhs8AtAIIf3In-STm4JYuGyqSYGcmVi5blRjxT3JIzDa_i2_", skills: ["Cybersec", "Audit", "Nodes"], quote: "\"Hardened security for a high-voltage digital world.\"" },
  { id: "c4", name: "Sarah Chen", title: "Project Lead", role: "Operations", img: "https://lh3.googleusercontent.com/aida-public/AB6AXuBoSJt3KQKWABuA2W8xJRf434QEPN1o3xWRUsUTuCdX0QlFfZus0yMofO3y4s1wfLTw65jUkzuiaJ1Wf3JL7fiHbhOnIyH3z1Mcomo8CodVNsmHdTgG71WUw9U7mHPdVy0MI-6HCF30m1tXXCxeMeOCC-X0JiGKcRKwWE27Gh4PgdMvtkMSI_7-_y8CXTLAKN_pTkwATN0tEqEPPeW6kB2rV-s6sr8_7oCK1zbzSBIBLdFWSpNtVYZZPffYLnWKsr2O4HGA--ytuwGs", skills: ["Agile", "Delivery", "Gov"], quote: "\"Synchronizing chaos into streamlined execution.\"" },
  { id: "t1", name: "Viktor Drago", title: "Backend Engineer", role: "Tech", img: "https://lh3.googleusercontent.com/aida-public/AB6AXuDd-tNdPgB2hYBu3I_L3NAUm8ovz3vEUkZBHCrM_UbgkQuzxqUt8yhbQSFnK9BsuwK_htmMMRXmJg1RLUL8RxMt3c5DYS1E5KvaR0wrBfIemoIBn2_TSgMxyT4fzXD15BIZ14vA9eVBX1JHBwFMzzcznjduyeKFm8Esc63EQ5irjFtbOPIWAcxsQdXYGSlC45h4O3gq4yfG8SBm4ba8vE1lcr9aZ5ltul0mmfZ1NaMSsex4PitxHo6pkeUgT-L7nag6ThOybblZMVSh", skills: ["Rust", "Go", "Redis"], quote: "\"Low latency, high impact.\"" },
  { id: "t2", name: "Mia Wong", title: "Frontend Dev", role: "Tech", img: "https://lh3.googleusercontent.com/aida-public/AB6AXuBwjvd-WTgO6CjA-xhk_h7oJA9DmbviHLjvt4jc74d4TIeB2Z7ecefY4oxrTlT7PZRiJiC-54OF9zGxal_N7lXTufMneQ6h7TFSgF7NNOg90p6JaTU9Q0Uk6C4R7LXaRSVBykjf9XLpOylH3KmoujsMueL3hCFn6Bl1KFze9nLKKKLO-PsN8EHLormcucjcOPmG7zXHg83DJo1iTYbsFhPcTR66UbZ1FuoxoBBK5BC20qWuK3HJKt52Sj4PQATtW8suePdXPkehEe6h", skills: ["React", "TS", "ThreeJS"], quote: "\"Pushing boundaries of the DOM.\"" },
  { id: "t3", name: "James Flint", title: "DevOps Expert", role: "Tech", img: "https://lh3.googleusercontent.com/aida-public/AB6AXuB0HMJFnBytwhVJmnMySjlKk3kdtFM4ZIXmMgvxiRNaiUs9slccdxdOu5s7Wdc77YDcdoNiaR6CqDO6FDZlZeApc-xjbli3JEaaSOpGD_GTe6Y89_R7ls_NKizL5MSLCBwEAoJqaKUKS-NBFP6UxATgEoDCwc-CjSe1zlBpAPEzWtQRLcYRpODyk_CUOuT6mAIY-bfNpqbYKoiZrC7sM0JH-rxa1RXoYlIpfHnC2p3v_KL2TTkdmi7sd9HEb0VFv0OvZuIsK_qGuFMl", skills: ["K8s", "Terraform", "AWS"], quote: "\"Automation is non-negotiable.\"" },
  { id: "a1", name: "Ria Patel", title: "Senior Visionary", role: "Alumni", img: "https://lh3.googleusercontent.com/aida-public/AB6AXuAGdMXC86tMDQwyEWEUoL4Fk5UVlS__rbdHwAcT7biGJyrAINgslboj_mY-59f6dLenK8VpiNIUS_-g9X1RnfKfzFZtXfJoeN1V1o0A4h6dhcPa06WLT0b-gN6u2yAiUxvp_vAHx2SKGnB-Ah9UTiieFtpeI26H71Dk1SRlHwJoLdJAfvQJmnWUEnFyTrqLn1y56oP1QrKUehHOZ2eFudtCE-kL_lefTPFSVmKxE6KG9XWxpEivACE-1_msj6e-OZMp6w7cbML7I78L", skills: ["Concept", "Direction"], quote: "\"Pioneering new standards.\"" },
  { id: "u123", name: "Alex Jordan", title: "Full-Stack Architect & Digital Brutalist", role: "User", img: "https://lh3.googleusercontent.com/aida-public/AB6AXuAGdMXC86tMDQwyEWEUoL4Fk5UVlS__rbdHwAcT7biGJyrAINgslboj_mY-59f6dLenK8VpiNIUS_-g9X1RnfKfzFZtXfJoeN1V1o0A4h6dhcPa06WLT0b-gN6u2yAiUxvp_vAHx2SKGnB-Ah9UTiieFtpeI26H71Dk1SRlHwJoLdJAfvQJmnWUEnFyTrqLn1y56oP1QrKUehHOZ2eFudtCE-kL_lefTPFSVmKxE6KG9XWxpEivACE-1_msj6e-OZMp6w7cbML7I78L", skills: ["TypeScript", "Rust", "Go"], quote: "\"BUILDING THE SKELETON OF THE FUTURE WEB WITH UNCOMPROMISING PRECISION.\"" },
];

export default function ProfilePage() {
  const { user, login } = useAuth();
  const params = useParams();
  const router = useRouter();
  
  // Safe extraction of params.id in Next.js App Router (it can be string or array)
  const rawId = params?.id;
  const profileId = Array.isArray(rawId) ? rawId[0] : rawId;
  
  // We use the logged in user to determine if we are editing our OWN profile (FR-2.2)
  const isOwnProfile = user?.id === profileId;
  const [isEditMode, setIsEditMode] = useState(false);

  // Find the user data in our mock database based on the URL ID
  const [formData, setFormData] = useState({
    name: "Member Not Found",
    title: "Unknown",
    bio: "Data missing or unavailable.",
    email: "unknown@example.com",
    linkedin: "unknown",
    img: "https://via.placeholder.com/400x400.png?text=NO+DATA",
    quote: "",
    skills: ["Unknown"]
  });

  const [errorMsg, setErrorMsg] = useState("");
  
  useEffect(() => {
    if (profileId) {
      const foundUser = mockDatabase.find(u => u.id === profileId);
      if (foundUser) {
        setFormData({
          name: foundUser.name,
          title: foundUser.title,
          bio: "Specialized in high-performance web applications and structural UI engineering. Over 8 years of experience breaking and remaking the digital landscape. " + foundUser.quote,
          email: `${foundUser.name.split(' ')[0].toLowerCase()}@projectk.com`,
          linkedin: `linkedin.com/in/${foundUser.id}`,
          img: foundUser.img,
          quote: foundUser.quote,
          skills: foundUser.skills
        });
      }
    }
  }, [profileId]);

  if (!user) {
    return (
      <div className="max-w-7xl mx-auto px-6 py-24 text-center">
        <h1 className="text-4xl font-black uppercase text-error mb-4">Access Denied</h1>
          <p className="font-bold border-l-[4px] border-error pl-4 inline-block">You must be authenticated to view this profile. (FR-3.3)</p>
        <div className="mt-8 flex justify-center gap-4">
          <button 
            onClick={() => login()}
            className="bg-black text-white p-3 font-black uppercase tracking-widest hover:bg-primary neo-shadow active:translate-x-[2px] active:translate-y-[2px] active:shadow-none transition-all"
          >
            Acknowledge & Login
          </button>
          <Link href="/members">
            <button className="bg-surface-variant text-black p-3 font-black uppercase tracking-widest border-[3px] border-black hover:bg-surface-dim neo-shadow active:translate-x-[2px] active:translate-y-[2px] active:shadow-none transition-all">
              Return to Directory
            </button>
          </Link>
        </div>
      </div>
    );
  }

  // Calculate completion percentage based on dummy criteria (FR-2.4)
  const calcCompletion = () => {
    let fields = 0;
    if (formData.name) fields++;
    if (formData.title) fields++;
    if (formData.bio) fields++;
    if (formData.email) fields++;
    if (formData.linkedin) fields++;
    return (fields / 5) * 100;
  };

  const handeSave = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");
    // mandatory validation FR-2.5
    if (!formData.name || !formData.title || !formData.email) {
      setErrorMsg("Name, Title, and Email are mandatory fields.");
      return;
    }
    // API mock save
    setIsEditMode(false);
  };

  return (
    <main className="max-w-7xl mx-auto px-6 py-12 flex flex-col gap-12">
      {/* SYSTEM STATUS BAR AND CONTROLS */}
      <div className="bg-secondary-container border-[3px] border-black p-2 flex justify-between items-center flex-wrap gap-4">
        <span className="font-black text-xs uppercase tracking-[0.2em] text-black">PORTAL_REF: PROFILE_VIEW // {calcCompletion()}% COMPLETE</span>
        <div className="flex items-center gap-4">
          <span className="font-black text-xs uppercase tracking-[0.2em] text-black flex items-center gap-2">
            <span className="w-2 h-2 bg-green-600"></span> ACCESS_GRANTED // UTC-0
          </span>
          {isOwnProfile && !isEditMode && (
            <button 
              onClick={() => setIsEditMode(true)}
              className="bg-black text-white px-4 py-1 text-xs font-black uppercase tracking-widest hover:bg-primary transition-colors border-[2px] border-transparent memphis-btn"
            >
              EDIT PROFILE (FR-2.2)
            </button>
          )}
        </div>
      </div>

      {isEditMode ? (
        // EDIT MODE FORM (FR-2.1, FR-2.2, FR-2.3, FR-2.4, FR-2.5)
        <form onSubmit={handeSave} className="bg-white border-[3px] border-black p-8 neo-shadow-lg flex flex-col gap-6">
          <div className="flex justify-between items-end border-b-[3px] border-black pb-4">
            <h2 className="text-3xl font-black uppercase tracking-tighter">Edit_Profile_Core</h2>
            <div className="text-sm font-bold bg-primary text-white border-[2px] border-black px-3 py-1 neo-shadow">
              Completion: {calcCompletion()}%
            </div>
          </div>
          
          {errorMsg && <div className="bg-error/10 border-l-[4px] border-error text-error p-3 font-bold text-sm neo-shadow">{errorMsg}</div>}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex flex-col gap-2">
              <label className="text-xs font-black uppercase tracking-widest">Display Name *</label>
              <input 
                className="memphis-input border-[3px] border-black p-3 font-bold uppercase" 
                value={formData.name} 
                onChange={(e) => setFormData({...formData, name: e.target.value})} 
              />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-xs font-black uppercase tracking-widest">Tagline / Title *</label>
              <input 
                className="memphis-input border-[3px] border-black p-3 font-bold uppercase" 
                value={formData.title} 
                onChange={(e) => setFormData({...formData, title: e.target.value})} 
              />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-xs font-black uppercase tracking-widest">Contact Email * (Private per FR-3.4)</label>
              <input 
                className="memphis-input border-[3px] border-black p-3 font-bold uppercase" 
                type="email"
                value={formData.email} 
                onChange={(e) => setFormData({...formData, email: e.target.value})} 
              />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-xs font-black uppercase tracking-widest">LinkedIn URL</label>
              <input 
                className="memphis-input border-[3px] border-black p-3 font-bold uppercase" 
                value={formData.linkedin} 
                onChange={(e) => setFormData({...formData, linkedin: e.target.value})} 
              />
            </div>
            <div className="md:col-span-2 flex flex-col gap-2">
              <label className="text-xs font-black uppercase tracking-widest">Upload Resume (TBD MB limit FR-2.3)</label>
              <input 
                type="file" 
                className="border-[3px] border-black p-3 font-bold bg-surface-container-high file:bg-black file:text-white file:border-none file:px-4 file:py-2 file:font-black file:uppercase file:cursor-pointer" 
                accept=".pdf,.doc,.docx"
              />
            </div>
            <div className="md:col-span-2 flex flex-col gap-2">
              <label className="text-xs font-black uppercase tracking-widest">Bio details</label>
              <textarea 
                className="memphis-input border-[3px] border-black p-3 font-medium h-32" 
                value={formData.bio} 
                onChange={(e) => setFormData({...formData, bio: e.target.value})} 
              />
            </div>
          </div>

          <div className="flex gap-4 justify-end mt-4">
            <button 
              type="button" 
              onClick={() => setIsEditMode(false)}
              className="bg-surface-variant text-black border-[3px] border-black p-3 font-black uppercase tracking-widest memphis-btn hover:bg-surface-dim transition-colors"
            >
              Cancel
            </button>
            <button 
              type="submit"
              className="bg-primary text-white border-[3px] border-black p-3 font-black uppercase tracking-widest neo-shadow-hover memphis-btn hover:bg-primary-dim transition-colors"
            >
              Save Parameters
            </button>
          </div>
        </form>
      ) : (
        // VIEW MODE (Read Only)
        <>
          {/* PROFILE HEADER BLOCK */}
          <section className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
            <div className="md:col-span-4 lg:col-span-3 border-[3px] border-black shadow-[8px_8px_0px_0px_#2f2f2f] bg-white overflow-hidden aspect-square relative">
              <img className="w-full h-full object-cover grayscale contrast-125" src={formData.img} alt="Profile avatar" />
              <div className="absolute bottom-4 left-4 flex gap-2">
                <span className="bg-secondary-container border-[2px] border-black px-3 py-1 font-bold text-[10px] uppercase tracking-widest text-black">Available</span>
              </div>
            </div>
            
            <div className="md:col-span-8 lg:col-span-9 flex flex-col gap-6">
              <div className="space-y-2">
                <span className="bg-black text-white px-3 py-1 font-bold text-[12px] uppercase tracking-widest">Member Since 2024</span>
                <h1 className="text-6xl md:text-8xl font-black uppercase tracking-tighter leading-none text-on-surface">
                  {formData.name.replace(' ', '_')}
                </h1>
                <p className="text-xl font-bold text-primary uppercase tracking-tight">{formData.title}</p>
              </div>
              
              <div className="flex flex-wrap gap-4">
                <button className="bg-primary text-white border-[3px] border-black px-6 py-3 font-black uppercase tracking-widest shadow-[4px_4px_0px_0px_#2f2f2f] hover:bg-secondary-container hover:text-black hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all flex items-center gap-2">
                  <span className="material-symbols-outlined">mail</span> EMAIL_DIRECT
                </button>
                <button className="bg-white text-black border-[3px] border-black px-6 py-3 font-black uppercase tracking-widest shadow-[4px_4px_0px_0px_#2f2f2f] hover:bg-primary-container hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all flex items-center gap-2">
                  <span className="material-symbols-outlined">link</span> LINKEDIN
                </button>
                <button className="bg-secondary-container text-black border-[3px] border-black px-6 py-3 font-black uppercase tracking-widest shadow-[4px_4px_0px_0px_#2f2f2f] hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all flex items-center gap-2 ml-auto">
                  <span className="material-symbols-outlined">download</span> DOWNLOAD CV
                </button>
              </div>
            </div>
          </section>

          {/* BENTO CONTENT GRID */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
            {/* LEFT COLUMN: ABOUT & SKILLS */}
            <div className="md:col-span-7 flex flex-col gap-8">
              {/* BIO */}
              <div className="border-[3px] border-black p-8 bg-white shadow-[8px_8px_0px_0px_#2f2f2f]">
                <h2 className="text-2xl font-black uppercase mb-6 flex items-center gap-2">
                  <span className="w-6 h-6 bg-primary"></span> ABOUT_THE_USER
                </h2>
                <p className="text-4xl font-black uppercase tracking-tighter italic mb-6 leading-tight">{formData.quote}</p>
                <p className="text-lg leading-relaxed text-tertiary">{formData.bio}</p>
              </div>
              
              {/* SKILLS */}
              <div className="border-[3px] border-black p-8 bg-white shadow-[8px_8px_0px_0px_#2f2f2f]">
                <h2 className="text-2xl font-black uppercase mb-8 flex items-center gap-2">
                  <span className="w-6 h-6 bg-secondary-container"></span> TECHNICAL_STACK
                </h2>
                <div className="space-y-8">
                  <div>
                    <p className="font-black uppercase text-xs tracking-[0.2em] mb-3">Languages_Core</p>
                    <div className="flex flex-wrap gap-2">
                      {formData.skills.map(s => (
                        <span key={s} className="px-4 py-2 border-[2px] border-black font-black uppercase text-sm bg-secondary-container">{s}</span>
                      ))}
                    </div>
                  </div>
                  <div>
                    <p className="font-black uppercase text-xs tracking-[0.2em] mb-3">Frameworks_Library</p>
                    <div className="space-y-4">
                      <div className="w-full">
                        <div className="flex justify-between text-[10px] font-black uppercase mb-1"><span>React / Next.js</span><span>95%</span></div>
                        <div className="h-4 border-[2px] border-black bg-surface-container"><div className="h-full bg-primary w-[95%]"></div></div>
                      </div>
                      <div className="w-full">
                        <div className="flex justify-between text-[10px] font-black uppercase mb-1"><span>Tailwind CSS</span><span>100%</span></div>
                        <div className="h-4 border-[2px] border-black bg-surface-container"><div className="h-full bg-primary w-[100%]"></div></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* RIGHT COLUMN: EXPERIENCE & PROJECTS */}
            <div className="md:col-span-5 flex flex-col gap-8">
              {/* EXPERIENCE TIMELINE */}
              <div className="border-[3px] border-black p-8 bg-black text-white shadow-[8px_8px_0px_0px_#0546ed]">
                <h2 className="text-2xl font-black uppercase mb-8 flex items-center gap-2">
                  <span className="w-6 h-6 bg-white"></span> WORK_HISTORY
                </h2>
                <div className="space-y-10 border-l-[3px] border-white/20 ml-2 pl-6 relative">
                  <div className="relative">
                    <span className="absolute -left-[33px] top-1 w-4 h-4 bg-primary border-[2px] border-white"></span>
                    <p className="text-[10px] font-black uppercase tracking-widest text-primary mb-1">2022 - PRESENT</p>
                    <h3 className="font-black uppercase text-lg">Lead Systems Architect</h3>
                    <p className="text-sm font-bold text-white/60 mb-2">NEO_TECH INDUSTRIES</p>
                  </div>
                  <div className="relative">
                    <span className="absolute -left-[33px] top-1 w-4 h-4 bg-white/20 border-[2px] border-white"></span>
                    <p className="text-[10px] font-black uppercase tracking-widest text-white/40 mb-1">2019 - 2022</p>
                    <h3 className="font-black uppercase text-lg">Senior UI Engineer</h3>
                    <p className="text-sm font-bold text-white/60 mb-2">CRYPTO_GRID GLOBAL</p>
                  </div>
                </div>
              </div>

              {/* QUICK CONTACT */}
              <div className="border-[3px] border-black p-8 bg-[#e4ec00] text-black shadow-[8px_8px_0px_0px_#2f2f2f]">
                <h2 className="text-2xl font-black uppercase mb-4">HIRE_THIS_USER</h2>
                <p className="text-sm font-bold uppercase mb-6 tracking-tight">Currently open to contract roles and experimental collaborations.</p>
                <button className="w-full bg-black text-white p-4 font-black uppercase tracking-widest hover:invert transition-all">INITIATE_SESSION</button>
              </div>
            </div>
          </div>

          {/* FEATURED PROJECTS GRID */}
          <section className="mt-8">
            <h2 className="text-5xl font-black uppercase tracking-tighter mb-10 text-on-surface">SELECTED_PROJECTS</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Project 1 */}
              <div className="border-[3px] border-black bg-white group hover:translate-x-1 hover:translate-y-1 transition-transform">
                <div className="h-48 bg-surface-container-highest border-b-[3px] border-black overflow-hidden relative">
                  <img className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500" alt="Omega" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDdQP0Saj3Q5sZDG_rjl4j3XcXrlZ7DdkVJTazbORYrladb8TGIAoECrhnPi-An-rl3Ouygnmq8LOLPw2SLfR1Ads2VZf-gTqgB1wNvECrcRg6bTPFHzJnH-ZJmmeSxIp1bQiBklMYCt78v6BVHrYD2zlBlolJC-66iEuMsvxVUvo0987c16XvzBgR3uJhLMnd9iINB0hlU55isFwDXMlJOf2JfGsMoeRrTRTU5P4cfIqsazkLdq0zDwF4LeWWMqkWrLvYFmJfJeyCj" />
                </div>
                <div className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="text-xl font-black uppercase tracking-tight">PROJECT_OMEGA</h3>
                    <Link href="#" className="text-black hover:text-primary"><span className="material-symbols-outlined">open_in_new</span></Link>
                  </div>
                  <p className="text-sm text-tertiary mb-6">A real-time analytics dashboard for decentralized finance nodes built with Rust and WebSockets.</p>
                  <div className="flex flex-wrap gap-2 mb-6">
                    <span className="text-[10px] font-black px-2 py-1 bg-surface-container uppercase">Rust</span>
                    <span className="text-[10px] font-black px-2 py-1 bg-surface-container uppercase">React</span>
                    <span className="text-[10px] font-black px-2 py-1 bg-surface-container uppercase">Chart.js</span>
                  </div>
                  <Link href="#" className="flex items-center gap-2 font-black uppercase text-xs border-b-[2px] border-black w-fit hover:border-primary hover:text-primary transition-all">
                    <span className="material-symbols-outlined">code</span> VIEW_GITHUB
                  </Link>
                </div>
              </div>

              {/* Project 2 */}
              <div className="border-[3px] border-black bg-white group hover:translate-x-1 hover:translate-y-1 transition-transform">
                <div className="h-48 bg-surface-container-highest border-b-[3px] border-black overflow-hidden relative">
                  <img className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500" alt="Brut CMS" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBRaROsRKrO2XWgg4tM912y-cu0FxWJPw181RKYglimFdPjEKKun-hE7RZQkqEnnnygijYrMULrE4ZbxWpczPnMgbuQVqlU1MRwID5bxveV52pJ0Z_3bk-x1_fIFNGZ2wHa7_Z85XfV5J_qbJx4PNai9T0cf06n_qNuy-TpSmcGkOG1gmXgHTTl1EzqRyKOvi0Fz-jKMNkLI4dnFHAYsa-nTfvZ2Ft8pobAV9vP1iwN2IzE_Ko3x633OyDN1a3VMtzRI35BrwKNgjaX" />
                </div>
                <div className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="text-xl font-black uppercase tracking-tight">BRUT_CMS</h3>
                    <Link href="#" className="text-black hover:text-primary"><span className="material-symbols-outlined">open_in_new</span></Link>
                  </div>
                  <p className="text-sm text-tertiary mb-6">Headless CMS system optimized for brutalist UI frameworks and ultra-low latency response times.</p>
                  <div className="flex flex-wrap gap-2 mb-6">
                    <span className="text-[10px] font-black px-2 py-1 bg-surface-container uppercase">Go</span>
                    <span className="text-[10px] font-black px-2 py-1 bg-surface-container uppercase">SQLite</span>
                    <span className="text-[10px] font-black px-2 py-1 bg-surface-container uppercase">Tailwind</span>
                  </div>
                  <Link href="#" className="flex items-center gap-2 font-black uppercase text-xs border-b-[2px] border-black w-fit hover:border-primary hover:text-primary transition-all">
                    <span className="material-symbols-outlined">code</span> VIEW_GITHUB
                  </Link>
                </div>
              </div>

              {/* Project 3 */}
              <div className="border-[3px] border-black bg-white group hover:translate-x-1 hover:translate-y-1 transition-transform">
                <div className="h-48 bg-surface-container-highest border-b-[3px] border-black overflow-hidden relative">
                  <img className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500" alt="K Terminal" src="https://lh3.googleusercontent.com/aida-public/AB6AXuC2-Ff-bXYFDJ64hKs4gmoMhYRYjL-nbIDt43sPkZiaLtgFRonni26Dfg9ic5Hl_txji53BCqB8ejcNOsuaDYJDzQWGHrJl5yaIOPyJJARHI2b2rj9agsJLWhdRJkdNnER901c2WMrb--qXu2n2PybvKSDp-BBMLICtMtC-xFB-gzwyPwT41xI5Mv5iAbhY0FxGWc3c5yt_EkfGDmDngYSP3OU3j2g1R2SZb4ZPoDCRd7v7a2aWqPMX5o545dpnBW9LDJ9fLCr4Xxwb" />
                </div>
                <div className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="text-xl font-black uppercase tracking-tight">K_TERMINAL</h3>
                    <Link href="#" className="text-black hover:text-primary"><span className="material-symbols-outlined">open_in_new</span></Link>
                  </div>
                  <p className="text-sm text-tertiary mb-6">A custom shell emulator that operates entirely in the browser with full filesystem simulation.</p>
                  <div className="flex flex-wrap gap-2 mb-6">
                    <span className="text-[10px] font-black px-2 py-1 bg-surface-container uppercase">WebAssembly</span>
                    <span className="text-[10px] font-black px-2 py-1 bg-surface-container uppercase">TypeScript</span>
                  </div>
                  <Link href="#" className="flex items-center gap-2 font-black uppercase text-xs border-b-[2px] border-black w-fit hover:border-primary hover:text-primary transition-all">
                    <span className="material-symbols-outlined">code</span> VIEW_GITHUB
                  </Link>
                </div>
              </div>
            </div>
          </section>
        </>
      )}
    </main>
  );
}
