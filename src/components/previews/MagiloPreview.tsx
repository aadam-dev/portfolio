"use client";

interface Props { screen: string }

const services = [
  { title: "Print & School", desc: "Exam papers, stationery, and academic materials.", icon: "🖨️" },
  { title: "Branding", desc: "Custom T-shirts, logos, and branded merchandise.", icon: "👕" },
  { title: "Large Format", desc: "Billboards, banners, and event displays.", icon: "🖼️" },
  { title: "Consulting", desc: "Business plans, pitch decks, and strategy.", icon: "📋" },
];

export default function MagiloPreview({ screen }: Props) {
  if (screen === "services") return <Services />;
  if (screen === "college") return <College />;
  return <Landing />;
}

function Landing() {
  return (
    <div className="bg-white min-h-full font-sans overflow-x-hidden">
      <nav className="px-6 py-4 md:px-10 md:py-5 flex items-center justify-between border-b border-slate-100 bg-white/90 sticky top-0 z-50 backdrop-blur-md">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-b from-sky-400 to-sky-700 rounded-lg flex items-center justify-center font-black text-white text-xl shadow-lg">M</div>
          <div className="hidden sm:block">
            <span className="text-sky-900 font-black text-sm block leading-tight tracking-tight uppercase">Magilo</span>
            <span className="text-slate-400 text-[9px] uppercase tracking-widest font-bold">Art College · Accra</span>
          </div>
        </div>
        <div className="hidden md:flex gap-8 items-center text-slate-400 text-[11px] font-bold uppercase tracking-widest">
          <span>Services</span>
          <span>College</span>
          <button className="bg-orange-500 text-white px-5 py-2 rounded-lg font-black">Enrol</button>
        </div>
        <div className="md:hidden text-slate-400">☰</div>
      </nav>

      <div className="bg-gradient-to-br from-slate-900 to-slate-800 relative px-6 py-16 md:px-12 md:py-24 text-center overflow-hidden">
        <div className="relative z-10">
          <div className="inline-block bg-orange-500/10 border border-orange-500/20 px-4 py-1.5 rounded-full mb-8">
            <span className="text-orange-400 text-[10px] font-black tracking-widest uppercase">25+ Years of Excellence</span>
          </div>
          <h1 className="text-5xl md:text-8xl font-black text-white mb-8 tracking-tighter leading-[0.95] uppercase max-w-3xl mx-auto">
            Teach. Design.<br />
            <span className="text-orange-500 italic">Print. Consult.</span>
          </h1>
          <p className="text-white/60 text-sm md:text-lg leading-relaxed max-w-xl mx-auto mb-12">
            Adenta's creative hub since 1999. We started as an art school; today we design and print for hundreds of businesses across Accra.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4 mb-12">
            <button className="bg-orange-500 text-white px-8 py-4 rounded-2xl font-black text-sm">Order Printing</button>
            <button className="bg-white/5 border border-white/10 text-white px-8 py-4 rounded-2xl font-black text-sm">View Courses</button>
          </div>
        </div>
      </div>

      <div className="bg-slate-900 grid grid-cols-2 md:grid-cols-4 border-y border-white/5">
        {[["25+", "Years"], ["1K+", "Projects"], ["500+", "Clients"], ["100%", "Reliable"]].map(([v, l], i) => (
          <div key={l} className={`p-8 text-center ${i < 3 ? "md:border-r border-white/5" : ""} ${i === 1 ? "border-r border-white/5 md:border-r-0" : ""}`}>
            <p className="text-orange-400 text-3xl font-black mb-1">{v}</p>
            <p className="text-white/30 text-[9px] font-bold uppercase tracking-widest">{l}</p>
          </div>
        ))}
      </div>

      <div className="p-8 md:p-16 bg-slate-50">
        <div className="mb-12">
          <p className="text-orange-500 text-[10px] font-black tracking-widest mb-4 uppercase">Capabilities</p>
          <h2 className="text-3xl md:text-5xl font-black text-slate-900 uppercase tracking-tighter">Our Services</h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {services.map(s => (
            <div key={s.title} className="bg-white border border-slate-100 p-8 rounded-[32px] hover:shadow-xl transition-shadow">
              <div className="text-4xl mb-6">{s.icon}</div>
              <p className="text-slate-900 font-black text-lg mb-3 uppercase leading-tight">{s.title}</p>
              <p className="text-slate-400 text-xs leading-relaxed font-medium mb-6">{s.desc}</p>
              <span className="text-orange-500 text-[10px] font-bold uppercase tracking-widest">Learn More →</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function Services() {
  return (
    <div className="bg-white min-h-full font-sans p-8 md:p-12">
      <p className="text-orange-500 text-[10px] font-black tracking-widest mb-4 uppercase">What we do</p>
      <h2 className="text-3xl md:text-5xl font-black text-slate-900 mb-12 uppercase tracking-tighter">Our Services</h2>
      
      <div className="space-y-4">
        {services.map(s => (
          <div key={s.title} className="bg-slate-50 border border-slate-100 p-8 rounded-3xl flex flex-col md:flex-row items-center gap-8 group">
            <div className="w-16 h-16 bg-orange-500/10 border border-orange-500/20 rounded-2xl flex items-center justify-center text-3xl shrink-0 group-hover:bg-orange-500 group-hover:text-white transition-all">{s.icon}</div>
            <div className="flex-1 text-center md:text-left">
              <p className="text-slate-900 font-black text-xl mb-2 leading-tight">{s.title}</p>
              <p className="text-slate-400 text-sm leading-relaxed">{s.desc}</p>
            </div>
            <button className="text-orange-500 font-black text-xs uppercase tracking-widest shrink-0">Enquire →</button>
          </div>
        ))}
      </div>
    </div>
  );
}

function College() {
  return (
    <div className="bg-white min-h-full font-sans">
      <div className="bg-slate-900 px-6 py-12 md:px-12 md:py-20 text-center">
        <p className="text-orange-500 text-[10px] font-black tracking-widest mb-4 uppercase">Creative Education</p>
        <h2 className="text-3xl md:text-6xl font-black text-white mb-6 uppercase tracking-tighter leading-none">Learn where the<br />industry happens</h2>
        <p className="text-white/40 text-sm md:text-lg max-w-xl mx-auto">Adenta's creative education hub since 1999. Real clients. Real machines.</p>
      </div>

      <div className="p-8 md:p-12 max-w-6xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <div className="space-y-8">
            <p className="text-slate-900 font-black text-xl uppercase tracking-tighter">Why Choose Magilo?</p>
            {["SHS Visual Arts support", "Hands-on Graphic Design", "Industrial printing experience", "Entrepreneurship coaching"].map(a => (
              <div key={a} className="flex gap-4 items-center">
                <div className="w-6 h-6 bg-orange-500 rounded-full flex items-center justify-center text-white text-[10px] font-bold">✓</div>
                <span className="text-slate-600 text-sm font-medium">{a}</span>
              </div>
            ))}
            <div className="bg-orange-50 p-6 rounded-2xl flex items-center gap-6 border border-orange-100">
              <div className="w-12 h-12 bg-orange-500 rounded-xl flex items-center justify-center text-white font-black text-xl">4</div>
              <p className="text-orange-900 font-black text-sm uppercase leading-tight">Specialized Courses Available</p>
            </div>
          </div>
          <div className="space-y-4">
            <p className="text-slate-900 font-black text-xl uppercase tracking-tighter">Programmes</p>
            {[
              { n: "SHS Visual Arts Support", d: "Academic Year" },
              { n: "Graphic Design (Pro)", d: "6 Months" },
              { n: "Desktop Publishing", d: "3 Months" },
              { n: "Branding Masterclass", d: "4 Weeks" }
            ].map(p => (
              <div key={p.n} className="bg-slate-50 border border-slate-100 p-6 rounded-2xl">
                <p className="text-slate-900 font-black text-sm mb-1 uppercase leading-tight">{p.n}</p>
                <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest">{p.d}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-16 bg-slate-900 p-8 md:p-12 rounded-[40px] flex flex-col md:flex-row items-center justify-between gap-8 text-center md:text-left">
          <div>
            <h3 className="text-2xl font-black text-white uppercase mb-2">Ready to create?</h3>
            <p className="text-white/40 text-xs font-medium uppercase tracking-widest">Adenta, Accra • Open Mon–Sat</p>
          </div>
          <div className="flex gap-4">
            <button className="bg-orange-500 text-white px-8 py-3 rounded-xl font-black text-xs uppercase tracking-widest">Enrol Today</button>
          </div>
        </div>
      </div>
    </div>
  );
}
