"use client";

interface Props { screen: string }

export default function SIIFPreview({ screen }: Props) {
  if (screen === "academy") return <Academy />;
  if (screen === "intelligence") return <Intelligence />;
  return <Landing />;
}

function Landing() {
  return (
    <div className="bg-[#0A0A0B] min-h-full font-serif text-white overflow-x-hidden">
      <nav className="px-6 py-4 md:px-12 md:py-8 flex items-center justify-between border-b border-[#C59E47]/10 bg-black/40 backdrop-blur-md sticky top-0 z-50">
        <div className="text-2xl font-black tracking-widest text-white">SIIF</div>
        <div className="hidden md:flex gap-8 items-center text-[#C59E47] text-[10px] font-bold tracking-[0.2em]">
          <span>VISION</span>
          <span>ACADEMY</span>
          <span>INTELLIGENCE</span>
          <button className="border border-[#C59E47] px-5 py-2 hover:bg-[#C59E47] hover:text-black transition-colors">ENROLL</button>
        </div>
        <div className="md:hidden text-[#C59E47]">☰</div>
      </nav>

      <div className="relative px-6 py-20 md:px-20 md:py-32 overflow-hidden border-b border-[#C59E47]/10">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1200&q=80')] bg-cover bg-center opacity-20" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#0A0A0B] via-[#0A0A0B]/80 to-transparent" />
        
        <div className="relative z-10 max-w-4xl">
          <p className="text-[#C59E47] text-[10px] md:text-xs font-bold tracking-[0.3em] mb-10 uppercase">Savannah Institute for Innovative Finance</p>
          <h1 className="text-4xl md:text-8xl font-normal tracking-tight leading-[1] mb-12">
            Institutionalizing<br />
            <span className="italic">the future of finance.</span>
          </h1>
          <p className="text-white/50 text-base md:text-xl leading-relaxed max-w-2xl mb-16 font-light">
            SIIF is the <span className="text-white font-medium">architect of emerging market capital</span>, bridging institutional rigor with high-growth innovation in sub-Saharan Africa.
          </p>
          <div className="flex flex-col sm:flex-row gap-6">
            <button className="bg-[#C59E47] text-black px-10 py-4 font-bold text-xs tracking-widest uppercase">Research Hub</button>
            <button className="border border-white/20 text-white px-10 py-4 font-bold text-xs tracking-widest uppercase">Our Mandate</button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-[#C59E47]/10">
        {[
          { t: "Institutional Rigor", d: "Setting the standard for capital allocation in sub-Saharan Africa." },
          { t: "Innovative Systems", d: "Deploying next-generation financial instruments for real-world impact." },
          { t: "Market Growth", d: "Scaling sustainable economic ecosystems through intelligence." }
        ].map(item => (
          <div key={item.t} className="p-12 md:p-16 hover:bg-[#C59E47]/5 transition-colors group">
            <p className="text-[#C59E47] text-sm font-bold tracking-widest mb-6 group-hover:translate-x-2 transition-transform uppercase">{item.t}</p>
            <p className="text-white/40 text-sm leading-relaxed font-light">{item.d}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

function Academy() {
  return (
    <div className="bg-[#FDFCF9] min-h-full font-serif p-8 md:p-16">
      <div className="border-b border-[#C59E47]/20 pb-12 mb-16">
        <p className="text-[#C59E47] text-[10px] font-bold tracking-[0.3em] mb-4 uppercase">Education Portal</p>
        <h2 className="text-4xl md:text-6xl font-normal text-black tracking-tight">SIIF Academy</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {[
          { title: "Venture Capital Foundations", modules: 12, level: "Institutional" },
          { title: "Emerging Market Risk Analysis", modules: 8, level: "Advanced" },
          { title: "Institutional Asset Management", modules: 15, level: "Executive" }
        ].map(course => (
          <div key={course.title} className="border border-black/5 p-10 hover:border-[#C59E47] transition-all group">
            <span className="text-[#C59E47] text-[9px] font-bold tracking-[0.2em] uppercase block mb-8">{course.level}</span>
            <h3 className="text-2xl font-normal text-black mb-8 leading-snug group-hover:text-[#C59E47] transition-colors">{course.title}</h3>
            <div className="flex justify-between items-center pt-8 border-t border-black/5">
              <span className="text-black/40 text-[10px] font-bold uppercase tracking-widest">{course.modules} Modules</span>
              <span className="text-[#C59E47] font-black">→</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function Intelligence() {
  return (
    <div className="bg-[#0A0A0B] min-h-full font-serif p-8 md:p-20 text-white">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-12 mb-16">
        <div className="max-w-2xl">
          <p className="text-[#C59E47] text-[10px] font-bold tracking-[0.3em] mb-6 uppercase">Intelligence Hub</p>
          <h2 className="text-4xl md:text-6xl font-normal tracking-tight">Market Visualization Terminal</h2>
        </div>
        <div className="flex flex-wrap gap-4">
          {["SSA EQUITY", "FIXED INCOME", "MACRO"].map(t => (
            <span key={t} className="border border-white/10 px-4 py-1.5 text-[9px] font-bold tracking-widest uppercase text-white/40">{t}</span>
          ))}
        </div>
      </div>
      
      <div className="aspect-video bg-gradient-to-br from-[#C59E47]/10 to-transparent border border-[#C59E47]/20 flex flex-col items-center justify-center gap-6 p-12 text-center group">
        <div className="w-16 h-16 border border-[#C59E47] flex items-center justify-center group-hover:scale-110 transition-transform">
          <div className="w-2 h-2 bg-[#C59E47] animate-ping" />
        </div>
        <p className="text-white/30 text-[10px] font-bold tracking-[0.3em] uppercase">Intelligence Terminal Initializing...</p>
      </div>
    </div>
  );
}
