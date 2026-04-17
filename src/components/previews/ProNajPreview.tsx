"use client";

interface Props { screen: string }

const sectors = [
  {
    name: "Digital",
    tag: "IT & Tech Services",
    desc: "Web development, cybersecurity, and software engineering solutions.",
    stats: ["500+ Projects", "99.9% Uptime"],
    icon: "💻",
  },
  {
    name: "Living",
    tag: "Modular Solutions",
    desc: "Sustainable furniture and prefabricated container housing.",
    stats: ["200+ Homes", "A+ Sustainability"],
    icon: "🏠",
  },
  {
    name: "Global",
    tag: "Agri-Trade & Export",
    desc: "Cocopeat export and precision greenhouse farming.",
    stats: ["10K MT Export", "25+ Markets"],
    icon: "🌐",
  },
];

export default function ProNajPreview({ screen }: Props) {
  if (screen === "sectors") return <Sectors />;
  if (screen === "contact") return <Contact />;
  return <Landing />;
}

function NavBar() {
  return (
    <nav className="px-6 py-4 md:px-12 md:py-5 flex items-center justify-between border-b border-white/5 bg-[#050505]/95 sticky top-0 z-50">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-white flex items-center justify-center font-bold text-[#050505] text-sm">PN</div>
        <div>
          <span className="text-white font-black text-sm block leading-tight">ProNaj</span>
          <span className="text-white/30 text-[9px] uppercase tracking-widest font-bold font-mono">International</span>
        </div>
      </div>
      <div className="hidden md:flex gap-8 items-center text-white/40 text-[10px] font-bold uppercase tracking-widest font-mono">
        <span>Digital</span>
        <span>Living</span>
        <button className="border border-orange-500 text-orange-500 px-4 py-1.5 hover:bg-orange-500 hover:text-white transition-colors">Get In Touch</button>
      </div>
      <div className="md:hidden text-white/40">☰</div>
    </nav>
  );
}

function Landing() {
  return (
    <div className="bg-[#050505] min-h-full font-sans text-white overflow-x-hidden">
      <NavBar />
      
      <div className="relative px-6 py-16 md:px-12 md:py-24 text-center overflow-hidden border-b border-white/5">
        <div className="absolute inset-0 opacity-10 pointer-events-none" 
          style={{ backgroundImage: "linear-gradient(#f97316 1px, transparent 1px), linear-gradient(90deg, #f97316 1px, transparent 1px)", backgroundSize: "60px 60px" }} />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#050505]/80 to-[#050505]" />
        
        <div className="relative z-10">
          <p className="text-orange-500 text-[10px] font-bold uppercase tracking-[0.3em] mb-6 font-mono">ProNaj International</p>
          <h1 className="text-5xl md:text-8xl font-black text-white mb-8 tracking-tighter leading-[0.9] uppercase max-w-4xl mx-auto">
            Infrastructure<br />
            <span className="text-orange-500">of the future</span>
          </h1>
          <p className="text-white/40 text-sm md:text-lg leading-relaxed max-w-xl mx-auto mb-16 font-mono">
            A Delaware-incorporated conglomerate spanning Digital, Living, and Global markets.
          </p>

          <div className="flex flex-col lg:flex-row border border-white/10 max-w-5xl mx-auto bg-black/40 backdrop-blur-md">
            {sectors.map((s, i) => (
              <div key={s.name} className={`flex-1 p-10 text-left transition-all hover:bg-orange-500/5 ${i < sectors.length - 1 ? "border-b lg:border-b-0 lg:border-r border-white/10" : ""}`}>
                <div className="text-3xl mb-6">{s.icon}</div>
                <p className="font-black text-xl mb-1">{s.name}</p>
                <p className="text-orange-500 text-[9px] uppercase tracking-widest font-bold font-mono mb-4">{s.tag}</p>
                <p className="text-white/40 text-xs leading-relaxed mb-8">{s.desc}</p>
                <div className="space-y-2 mb-8">
                  {s.stats.map(stat => (
                    <div key={stat} className="flex items-center gap-2">
                      <span className="w-1 h-1 bg-orange-500" />
                      <span className="text-white/30 text-[10px] uppercase font-bold tracking-widest font-mono">{stat}</span>
                    </div>
                  ))}
                </div>
                <span className="text-white/50 text-[10px] font-bold uppercase tracking-widest hover:text-orange-500 cursor-pointer">Explore →</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 max-w-5xl mx-auto border-x border-white/5">
        {[["3", "Sectors"], ["2", "Continents"], ["25+", "Markets"], ["500+", "Projects"]].map(([v, l], i) => (
          <div key={l} className={`p-8 text-center ${i < 3 ? "border-r border-white/5" : ""}`}>
            <p className="text-orange-500 text-3xl font-black mb-1">{v}</p>
            <p className="text-white/20 text-[9px] font-bold uppercase tracking-widest font-mono">{l}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

function Sectors() {
  return (
    <div className="bg-[#050505] min-h-full font-sans text-white">
      <NavBar />
      <div className="px-8 py-16 md:px-16 md:py-24 max-w-4xl mx-auto">
        <p className="text-orange-500 text-[10px] font-bold uppercase tracking-[0.3em] mb-4 font-mono">Our Sectors</p>
        <h2 className="text-4xl md:text-6xl font-black mb-16 tracking-tighter uppercase leading-none">Three Pillars.<br /><span className="text-orange-500">One Vision.</span></h2>
        
        <div className="space-y-16">
          {sectors.map((s, i) => (
            <div key={s.name} className="flex flex-col md:flex-row gap-12 items-start group">
              <div className="w-20 h-20 border border-orange-500 flex items-center justify-center text-4xl shrink-0 group-hover:bg-orange-500 group-hover:text-black transition-all">
                {s.icon}
              </div>
              <div className="flex-1">
                <div className="flex flex-wrap items-center gap-4 mb-4">
                  <h3 className="text-2xl font-black uppercase">ProNaj {s.name}</h3>
                  <span className="border border-white/10 px-3 py-1 text-orange-500 text-[9px] font-bold tracking-widest font-mono">{s.tag}</span>
                </div>
                <p className="text-white/40 text-sm leading-relaxed mb-8 max-w-xl">{s.desc}</p>
                <div className="flex flex-wrap gap-8 mb-8">
                  {s.stats.map(stat => (
                    <div key={stat} className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 bg-orange-500 rounded-full" />
                      <span className="text-white/30 text-[10px] font-bold uppercase font-mono">{stat}</span>
                    </div>
                  ))}
                </div>
                <span className="text-orange-500 text-[10px] font-bold uppercase tracking-widest hover:underline cursor-pointer">Explore {s.name} →</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function Contact() {
  return (
    <div className="bg-[#050505] min-h-full font-sans text-white">
      <NavBar />
      <div className="px-8 py-16 md:px-16 md:py-24 max-w-6xl mx-auto">
        <p className="text-orange-500 text-[10px] font-bold uppercase tracking-[0.3em] mb-4 font-mono">Contact</p>
        <h2 className="text-4xl md:text-6xl font-black mb-16 tracking-tighter uppercase">Let's build together.</h2>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20">
          <div className="space-y-8">
            {[["Full Name", "text"], ["Email", "email"], ["Company", "text"]].map(([l, t]) => (
              <div key={l}>
                <label className="text-white/30 text-[9px] font-bold uppercase tracking-widest font-mono mb-3 block">{l}</label>
                <input readOnly type={t} className="w-full bg-white/5 border border-white/10 p-4 text-sm outline-none focus:border-orange-500 transition-colors" />
              </div>
            ))}
            <div>
              <label className="text-white/30 text-[9px] font-bold uppercase tracking-widest font-mono mb-3 block">Message</label>
              <textarea readOnly rows={4} className="w-full bg-white/5 border border-white/10 p-4 text-sm outline-none focus:border-orange-500 transition-colors resize-none" />
            </div>
            <button className="bg-orange-500 text-white px-10 py-4 font-black text-xs uppercase tracking-widest">Send Message</button>
          </div>

          <div className="space-y-12">
            {[
              ["Headquarters", "Accra, Ghana", "West Africa"],
              ["Corporate", "Delaware, USA", "HQ"],
              ["General", "hello@pronaj.com", "24/7 Support"]
            ].map(([h, l1, l2]) => (
              <div key={h}>
                <p className="text-white/30 text-[9px] font-bold uppercase tracking-widest font-mono mb-4">{h}</p>
                <p className="text-xl font-black mb-1">{l1}</p>
                <p className="text-white/40 text-xs font-mono uppercase tracking-widest">{l2}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
