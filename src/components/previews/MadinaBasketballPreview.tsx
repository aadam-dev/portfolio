"use client";

interface Props { screen: string }

const events = [
  { title: "Zurak vs Accra Aces", date: "Mar 22, 2026", time: "4:00 PM", type: "League Game", spots: 200 },
  { title: "Community Skills Clinic", date: "Mar 29, 2026", time: "9:00 AM", type: "Training", spots: 30 },
  { title: "Madina Old Gees Reunion", date: "Apr 5, 2026", time: "3:00 PM", type: "Alumni Game", spots: 150 },
];

export default function MadinaBasketballPreview({ screen }: Props) {
  if (screen === "court") return <Court />;
  if (screen === "events") return <Events />;
  return <Landing />;
}

function Landing() {
  return (
    <div className="bg-[#004e89] min-h-full font-sans overflow-x-hidden">
      <nav className="px-6 py-4 md:px-10 md:py-5 flex items-center justify-between border-b border-white/5 sticky top-0 z-50 bg-[#004e89]/80 backdrop-blur-md">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-[#ff6b35] rounded-full flex items-center justify-center font-black text-white text-xl shadow-lg">M</div>
          <div className="hidden sm:block">
            <span className="text-white font-black text-xs block leading-tight tracking-[0.04em] uppercase">Madina Basketball</span>
            <span className="text-white/40 text-[9px] uppercase tracking-widest font-bold">Libya Quarters, Accra</span>
          </div>
        </div>
        <div className="hidden md:flex gap-8 items-center text-white/50 text-[11px] font-bold uppercase tracking-widest">
          <span>The Court</span>
          <span>Events</span>
          <button className="bg-[#ff6b35] text-white px-4 py-1.5 rounded-lg font-black">Register</button>
        </div>
        <div className="md:hidden text-white/60">☰</div>
      </nav>

      <div className="px-6 py-12 md:px-12 md:py-20 flex flex-col lg:flex-row items-center gap-12 lg:gap-16 max-w-6xl mx-auto">
        <div className="flex-1 text-center lg:text-left">
          <div className="inline-flex items-center gap-2 bg-[#ffd23f]/10 border border-[#ffd23f]/20 px-4 py-1.5 rounded-full mb-8">
            <span className="w-1.5 h-1.5 bg-[#ffd23f] rounded-full animate-pulse" />
            <span className="text-[#ffd23f] text-[10px] font-black tracking-widest uppercase">Solar-Powered Community Hub</span>
          </div>
          <h1 className="text-5xl md:text-7xl font-black text-white mb-6 tracking-tighter leading-[0.95] uppercase">
            Madina<br />
            <span className="text-[#ff6b35]">Basketball</span>
          </h1>
          <p className="text-white/50 text-base md:text-lg leading-relaxed mb-10 max-w-lg mx-auto lg:mx-0">
            A community-built solar-powered basketball hub in Libya Quarters, Accra. Open to all, run transparently.
          </p>
          <div className="flex flex-col sm:flex-row justify-center lg:justify-start gap-4 mb-12">
            <button className="bg-[#ff6b35] text-white px-8 py-4 rounded-2xl font-black text-sm shadow-xl shadow-[#ff6b35]/20">Register to Play</button>
            <button className="bg-white/5 border border-white/10 text-white px-8 py-4 rounded-2xl font-black text-sm">View Events</button>
          </div>
        </div>

        <div className="flex-1 w-full max-w-md bg-white/5 border border-white/10 rounded-[40px] p-8 md:p-10 shadow-2xl relative">
          <p className="text-white/30 text-[10px] font-black uppercase tracking-[0.2em] mb-8">Community Metrics</p>
          <div className="grid grid-cols-2 gap-x-8 gap-y-10 mb-10">
            {[["GHS 44K+", "Raised", "#ff6b35"], ["150+", "Players", "#fff"], ["12+", "Events", "#fff"], ["100%", "Solar", "#ffd23f"]].map(([v, l, c]) => (
              <div key={l} className="text-center lg:text-left">
                <p className="text-2xl font-black mb-1" style={{ color: c }}>{v}</p>
                <p className="text-white/30 text-[9px] font-bold uppercase tracking-widest">{l}</p>
              </div>
            ))}
          </div>
          <div className="space-y-3">
            <p className="text-white/20 text-[9px] font-bold uppercase tracking-widest">Home Teams</p>
            <div className="flex gap-2">
              {["Zurak Bball", "Old Gees"].map(t => (
                <div key={t} className="flex-1 bg-[#ff6b35]/10 border border-[#ff6b35]/20 py-2 rounded-xl text-center">
                  <span className="text-[#ff6b35] text-[10px] font-black uppercase tracking-widest">{t}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="mx-6 mb-12 md:mx-12 p-6 md:p-8 bg-[#ff6b35]/10 border border-[#ff6b35]/20 rounded-3xl flex flex-col md:flex-row items-center justify-between gap-6 max-w-6xl md:mx-auto">
        <div className="flex items-center gap-6">
          <span className="text-4xl">🏀</span>
          <div>
            <p className="text-white font-black text-lg mb-1">Zurak vs Accra Aces</p>
            <p className="text-white/40 text-xs font-medium">Saturday, March 22 • 4:00 PM • Libya Quarters Court</p>
          </div>
        </div>
        <button className="w-full md:w-auto bg-[#ff6b35] text-white px-8 py-3 rounded-2xl font-black text-sm">Book Spot</button>
      </div>
    </div>
  );
}

function Court() {
  return (
    <div className="bg-[#003366] min-h-full font-sans p-6 md:p-12">
      <p className="text-[#ff6b35] text-[10px] font-black tracking-widest mb-4 uppercase">The Infrastructure</p>
      <h2 className="text-3xl md:text-5xl font-black text-white mb-2 uppercase tracking-tighter">Libya Quarters Court</h2>
      <p className="text-white/40 text-sm mb-10">Solar-powered · Community-funded · Publicly accessible</p>

      <div className="bg-gradient-to-br from-[#ff6b35]/20 to-[#ff6b35]/5 border border-[#ff6b35]/20 rounded-[40px] h-48 md:h-64 flex flex-col items-center justify-center gap-6 mb-12">
        <div className="w-20 h-20 bg-[#ff6b35] rounded-3xl flex items-center justify-center text-4xl shadow-2xl">🏀</div>
        <p className="text-[#ff6b35]/60 text-[10px] font-black tracking-[0.2em] uppercase">Outdoor Full Court • 28m × 15m</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-white/5 border border-white/10 rounded-3xl p-8">
          <p className="text-white/30 text-[10px] font-black uppercase tracking-widest mb-8">Specifications</p>
          <div className="grid grid-cols-1 gap-4">
            {["Solar floodlights", "Regulation backboards", "Painted markings", "Public water access"].map(f => (
              <div key={f} className="flex items-center gap-4">
                <span className="text-[#ff6b35] font-black">✓</span>
                <span className="text-white/70 text-sm font-medium">{f}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="space-y-6">
          <div className="bg-white/5 border border-white/10 rounded-3xl p-8">
            <div className="flex justify-between items-center mb-6">
              <span className="text-white/30 text-[10px] font-black uppercase tracking-widest">Fundraising</span>
              <span className="text-[#ff6b35] font-black text-lg">89%</span>
            </div>
            <div className="h-3 bg-white/5 rounded-full overflow-hidden mb-4">
              <div className="h-full bg-[#ff6b35]" style={{ width: "89%" }} />
            </div>
            <p className="text-white/30 text-[10px] font-bold uppercase tracking-widest">GHS 44.7K of GHS 50K Raised</p>
          </div>
          <div className="bg-[#ffd23f]/5 border border-[#ffd23f]/10 rounded-3xl p-8">
            <p className="text-[#ffd23f] font-black text-sm mb-2 italic">Solar Impact</p>
            <p className="text-white/50 text-xs leading-relaxed">Court operational until 10PM daily at zero energy cost thanks to Q4 2025 solar installation.</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function Events() {
  return (
    <div className="bg-[#003366] min-h-full font-sans p-6 md:p-12">
      <p className="text-[#ff6b35] text-[10px] font-black tracking-widest mb-4 uppercase">Timeline</p>
      <h2 className="text-3xl md:text-5xl font-black text-white mb-2 uppercase tracking-tighter">Events & Games</h2>
      <p className="text-white/40 text-sm mb-12">Community events open to all registration.</p>

      <div className="space-y-4">
        {events.map((ev, i) => (
          <div key={ev.title} className={`bg-white/5 border rounded-3xl p-6 flex flex-col sm:flex-row items-center gap-8 ${i === 0 ? "border-[#ff6b35]/40" : "border-white/10"}`}>
            <div className={`w-16 h-16 rounded-2xl flex flex-col items-center justify-center shrink-0 ${i === 0 ? "bg-[#ff6b35] text-white" : "bg-white/5 text-white/40"}`}>
              <span className="text-2xl font-black leading-none">{ev.date.split(" ")[1].replace(",", "")}</span>
              <span className="text-[9px] font-black uppercase tracking-widest mt-1">{ev.date.split(" ")[0]}</span>
            </div>
            <div className="flex-1 text-center sm:text-left min-w-0">
              <div className="flex flex-col sm:flex-row items-center gap-3 mb-2">
                <p className="text-white font-black text-lg truncate">{ev.title}</p>
                <span className="bg-[#ff6b35]/10 text-[#ff6b35] px-3 py-0.5 rounded-full text-[9px] font-black uppercase tracking-widest">{ev.type}</span>
              </div>
              <p className="text-white/40 text-xs font-medium">🕐 {ev.time} • 📍 Libya Quarters Court</p>
            </div>
            <button className={`w-full sm:w-auto px-8 py-3 rounded-2xl font-black text-xs ${i === 0 ? "bg-[#ff6b35] text-white" : "bg-white/10 text-[#ff6b35]"}`}>Register</button>
          </div>
        ))}
      </div>

      <div className="mt-12 bg-[#ff6b35] p-8 rounded-[40px] text-center text-white">
        <p className="text-[10px] font-black uppercase tracking-[0.2em] mb-4">Player Registration</p>
        <p className="text-lg font-bold mb-8 max-w-sm mx-auto leading-tight">150+ players already registered for the 2026 season.</p>
        <button className="bg-white text-[#ff6b35] px-10 py-4 rounded-2xl font-black text-sm shadow-xl">Register as Player</button>
      </div>
    </div>
  );
}
