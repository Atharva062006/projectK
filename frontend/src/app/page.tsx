import Link from "next/link";

export default function Home() {
  return (
    <main>
      {/* System Status Bar */}
      <div className="bg-secondary-container border-b-[3px] border-black w-full px-6 py-1 flex justify-between items-center">
        <span className="font-label text-[0.75rem] font-bold uppercase tracking-[0.05em]">PORTAL_REF: 004-X</span>
        <span className="font-label text-[0.75rem] font-bold uppercase tracking-[0.05em]">SYSTEM_STATUS: ONLINE // UTC-0</span>
      </div>

      {/* Hero Section */}
      <section className="px-6 py-16 md:py-24 max-w-7xl mx-auto flex flex-col md:flex-row gap-12 items-center">
        <div className="flex-1 text-left">
          <h1 className="text-[3.5rem] md:text-[5rem] font-black leading-[0.9] tracking-tighter mb-6 uppercase">
            Project K<br /><span className="text-primary">Portal</span> System
          </h1>
          <p className="text-xl font-medium border-l-[6px] border-primary pl-6 mb-10 max-w-xl">
            The Digital Showcase of Our Talent. A high-performance collective of developers, designers, and engineers pushing the boundaries of Precision Brutalism.
          </p>
          <div className="flex flex-wrap gap-6">
            <Link href="/members">
              <button className="bg-primary text-on-primary border-[3px] border-black px-8 py-4 font-bold uppercase tracking-widest neo-shadow-lg active:translate-x-[4px] active:translate-y-[4px] active:shadow-none transition-all">
                Browse Members
              </button>
            </Link>
            <button className="bg-white text-black border-[3px] border-black px-8 py-4 font-bold uppercase tracking-widest neo-shadow-lg active:translate-x-[4px] active:translate-y-[4px] active:shadow-none transition-all">
              Join the Club
            </button>
          </div>
        </div>
        <div className="flex-1 w-full relative">
          <div className="bg-white border-[3px] border-black p-4 neo-shadow-lg rotate-2 select-none pointer-events-none">
            <img 
              className="w-full h-[400px] object-cover grayscale contrast-125 border-[2px] border-black" 
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuBi19uvgc0Cytkz5g09zYEGevL2p0heLuYJtqqmacLHs667yGzLqImHOzU35R3DaK5Ja3RgqP3mJ5K3bBiYCWB7J_k0__-ZB-dfoxStcbnmpq4Zgfhl54ZecG0j3ufiK0yB1AXAEi-ep2xqJCFSpE81coVINR04XIrV4YYnoSe6HwYjIQTClkMFgD-sr24_u5f7ZpbhrGY2PfZ16EgTUXoOS2U1Gpe-p5Hs5CDJz36HLz9h4vqxhpFe3vfpf_wIMzHRBk115P9O8K9Z" 
              alt="Futuristic cyber security matrix interface"
            />
            <div className="mt-4 flex justify-between items-center font-black uppercase italic">
              <span>LIVE_FEED_01</span>
              <span className="text-primary">AUTH_REQUIRED</span>
            </div>
          </div>
        </div>
      </section>

      {/* Club Metrics */}
      <section className="bg-white border-y-[3px] border-black">
        <div className="max-w-7xl mx-auto px-6 py-12 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-surface-container-lowest border-[3px] border-black p-8 neo-shadow flex flex-col items-start cursor-default hover:bg-secondary-container transition-colors duration-300">
            <span className="text-5xl font-black text-primary mb-2">100+</span>
            <span className="font-label text-sm font-bold uppercase tracking-widest">Active Members</span>
          </div>
          <div className="bg-surface-container-lowest border-[3px] border-black p-8 neo-shadow flex flex-col items-start cursor-default hover:bg-secondary-container transition-colors duration-300">
            <span className="text-5xl font-black text-primary mb-2">50+</span>
            <span className="font-label text-sm font-bold uppercase tracking-widest">Global Alumni</span>
          </div>
          <div className="bg-surface-container-lowest border-[3px] border-black p-8 neo-shadow flex flex-col items-start cursor-default hover:bg-secondary-container transition-colors duration-300">
            <span className="text-5xl font-black text-primary mb-2">200+</span>
            <span className="font-label text-sm font-bold uppercase tracking-widest">Live Projects</span>
          </div>
        </div>
      </section>

      {/* Featured Members */}
      <section className="max-w-7xl mx-auto px-6 py-20">
        <div className="flex items-end justify-between mb-12 border-b-[3px] border-black pb-4">
          <h2 className="text-4xl font-black uppercase tracking-tighter">Featured_Talent</h2>
          <Link href="/members" className="text-primary font-bold uppercase text-sm tracking-widest hover:underline">
            View All Registry →
          </Link>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {[
            {
              id: "c1",
              name: "Alex Volkov",
              title: "Lead Architect",
              img: "https://lh3.googleusercontent.com/aida-public/AB6AXuCSklKvnNOaOMD9C1HduZ4Gf0B_br3mffxkrulFdMTS2o2YY1MfInclopPkTFVBhIKw5GPF4D7Fv1bw5ioBuxuDKhIeLAZU-a5U1AjQwx62zTw5WDJ2AD0QjScZcG4Cj1D9kMP5ptD1pCc7581o9Zphf-kwV7tz9NBBXarJaZiUe1ONC2hgK418LAglTB4rG5f4Y07ajHpyRVaJoVZUkRzPnjTBm8KYPMOgkA_UwD63AQdrdfBnNIcyCaxlta1v0ZseuzIFP0JLbuiv",
              skills: ["React", "Python", "ML"]
            },
            {
              id: "c4",
              name: "Sarah Chen",
              title: "Project Lead",
              img: "https://lh3.googleusercontent.com/aida-public/AB6AXuAmfH8gFDmwTXyNHw-MGHIV_biZVYTMs1QCUeRgV7wLZYUYIO7a-SBhzWL28_N0Y42IA6WkkxeQodRvtKaeQiVI9vh1Ty7i9gvtR7j2twzgxq9pj0Gj1HjGlKj-o52kfAziVw9GAiZjOCi0pzdumhgS_JOxp6EZC4fTiE8Xeze-ZMEy7R7INkBV4pwFVaxTfg_L0zUPdjxsiJcD-4QaT3pW0zpfUc_YvYtaFUc5YAB_8wHIGCwUWdqSgcvevPpq0ZSBWd59GVFL-Iux",
              skills: ["Agile", "Delivery", "Gov"]
            },
            {
              id: "c3",
              name: "Marcus Thorne",
              title: "Protocol Officer",
              img: "https://lh3.googleusercontent.com/aida-public/AB6AXuD1zG6b-N00PiwkYx7lVOvJCPEwUOLg0UPOasIHyb00xSg2YrsntbGmMV6XXFs5mtLKXDKSCfUGt_s5OKSSXRna0rr9TkIdBVZMHOYju5LG0yYKlykclfpb2WG6d8pvDykUWCskZQHmh-Fo3OJI70BZSNWNr55A2GRkNG_6Zo9lTvJkHTrTmNMqtbfkJissIaRxrt8ZTsyt8cgvG9yQCgFvdoikSTBCFh2vW2aNxJFsP2I-fctOaoRXahbFg_gR6Np9oocU0l3SJacA",
              skills: ["Cybersec", "Audit", "Nodes"]
            }
          ].map((member, i) => (
            <Link href={`/profile/${member.id}`} key={i} className="group relative block cursor-pointer">
              <div className="bg-white border-[3px] border-black neo-shadow overflow-hidden group-hover:-translate-y-2 transition-transform">
                <img 
                  className="w-full h-64 object-cover grayscale group-hover:grayscale-0 transition-all border-b-[3px] border-black" 
                  src={member.img} 
                  alt={member.name}
                />
                <div className="p-6">
                  <h3 className="text-2xl font-black uppercase mb-1">{member.name}</h3>
                  <p className="text-primary font-bold text-xs uppercase tracking-widest mb-4">{member.title}</p>
                  <div className="flex flex-wrap gap-2">
                    {member.skills.map((skill, j) => (
                      <span key={j} className="bg-secondary-container border-[2px] border-black px-3 py-1 text-[0.65rem] font-black uppercase">{skill}</span>
                    ))}
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Domain Distribution (Asymmetric Bento Grid) */}
      <section className="bg-black text-white py-20 px-6 mt-12">
        <div className="max-w-7xl mx-auto">
          <div className="mb-16">
            <h2 className="text-4xl md:text-6xl font-black uppercase tracking-tighter text-secondary-container">Domains_of_Excellence</h2>
            <p className="text-zinc-400 font-bold uppercase tracking-widest mt-4">Critical Technical Focus Areas</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 md:grid-rows-2 gap-4 h-auto md:h-[600px]">
            {/* Web Dev */}
            <div className="md:col-span-2 md:row-span-2 bg-primary border-[3px] border-white p-8 flex flex-col justify-end neo-shadow group cursor-pointer hover:bg-white hover:text-black transition-colors">
              <span className="material-symbols-outlined text-6xl mb-6">desktop_windows</span>
              <h3 className="text-4xl font-black uppercase leading-tight">Web<br />Development</h3>
              <p className="mt-4 font-bold uppercase text-sm opacity-80">Full-stack solutions & performant architectures</p>
            </div>
            {/* Cybersecurity */}
            <div className="md:col-span-2 bg-secondary-container text-black border-[3px] border-white p-8 flex items-center justify-between neo-shadow group cursor-pointer hover:bg-black hover:text-white transition-colors">
              <div>
                <h3 className="text-3xl font-black uppercase">Cybersecurity</h3>
                <p className="font-bold uppercase text-xs mt-2">Zero-trust engineering</p>
              </div>
              <span className="material-symbols-outlined text-5xl">encrypted</span>
            </div>
            {/* AI */}
            <div className="md:col-span-1 bg-zinc-800 border-[3px] border-white p-6 flex flex-col justify-between neo-shadow group cursor-pointer hover:bg-primary transition-colors">
              <span className="material-symbols-outlined text-4xl">psychology</span>
              <h3 className="text-xl font-black uppercase">Artificial Intelligence</h3>
            </div>
            {/* Data */}
            <div className="md:col-span-1 bg-zinc-800 border-[3px] border-white p-6 flex flex-col justify-between neo-shadow group cursor-pointer hover:bg-secondary-container hover:text-black transition-colors">
              <span className="material-symbols-outlined text-4xl">database</span>
              <h3 className="text-xl font-black uppercase">Data Engineering</h3>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
