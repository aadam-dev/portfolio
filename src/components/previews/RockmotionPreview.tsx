"use client";

interface Props { screen: string }

export default function RockmotionPreview({ screen }: Props) {
  if (screen === "inventory") return <Inventory />;
  if (screen === "process") return <Process />;
  return <Landing />;
}

function Landing() {
  const stats = [
    { val: "500+", label: "Vehicles" },
    { val: "40+",  label: "Countries" },
    { val: "98%",  label: "On-Time" },
    { val: "$0",   label: "Hidden Fees" },
  ];

  return (
    <div className="bg-[#0A0A0B] min-h-full font-sans text-white overflow-x-hidden">
      <nav className="px-6 py-4 md:px-10 md:py-5 flex items-center justify-between border-b border-white/5 bg-[#0A0A0B]/90 sticky top-0 z-50 backdrop-blur-md">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-blue-600 rounded flex items-center justify-center font-black text-white text-xs">RM</div>
          <div className="hidden sm:block">
            <span className="text-white font-black text-[10px] block leading-tight tracking-widest uppercase">Rockmotion</span>
            <span className="text-white/30 text-[8px] uppercase tracking-[0.2em] font-bold font-mono">Auto Group</span>
          </div>
        </div>
        <div className="hidden md:flex gap-8 items-center text-white/40 text-[10px] font-bold uppercase tracking-widest font-mono">
          <span>Inventory</span>
          <span>Process</span>
          <button className="bg-blue-600 text-white px-4 py-1.5 rounded font-bold">Browse</button>
        </div>
        <div className="md:hidden text-white/40">☰</div>
      </nav>

      <div className="relative min-h-[400px] md:min-h-[500px] flex items-center">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1544636331-e26879cd4d9b?w=1200&q=70')] bg-cover bg-center" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/40 to-[#0A0A0B]" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 to-transparent hidden md:block" />
        
        <div className="relative z-10 px-6 py-12 md:px-12 md:py-20 text-center md:text-left">
          <div className="flex items-center justify-center md:justify-start gap-4 mb-8">
            <div className="w-8 h-px bg-blue-600" />
            <span className="text-blue-500 text-[9px] font-black uppercase tracking-[0.2em] font-mono">Licensed US Dealer · Atlanta, GA</span>
          </div>
          <h1 className="text-4xl md:text-8xl font-black text-white mb-6 tracking-tighter leading-[0.9] uppercase max-w-4xl">
            The shortest<br />
            <span className="bg-gradient-to-r from-blue-500 to-blue-300 bg-clip-text text-transparent italic">Distance</span><br />
            to the american road.
          </h1>
          <p className="text-white/50 text-sm md:text-lg leading-relaxed max-w-xl mb-12 font-medium">
            Own any vehicle from the US market — without ever setting foot on American soil. We source, verify, and ship globally.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
            <button className="bg-blue-600 text-white px-8 py-4 rounded font-bold text-sm tracking-widest uppercase">Browse Inventory</button>
            <button className="bg-white/5 border border-white/10 text-white px-8 py-4 rounded font-bold text-sm tracking-widest uppercase">Process</button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 border border-white/5 bg-[#111113] mx-6 md:mx-12 rounded-2xl overflow-hidden mb-12">
        {stats.map((s, i) => (
          <div key={s.label} className={`p-8 text-center ${i < 3 ? "border-r border-white/5" : ""} ${i === 1 ? "border-b md:border-b-0" : ""} ${i === 0 ? "border-b md:border-b-0" : ""}`}>
            <p className="text-white text-3xl font-black font-mono mb-1">{s.val}</p>
            <p className="text-white/20 text-[9px] font-bold uppercase tracking-widest font-mono">{s.label}</p>
          </div>
        ))}
      </div>

      <div className="px-6 pb-20 md:px-12">
        <div className="text-center mb-16">
          <p className="text-blue-500 text-[10px] font-bold uppercase tracking-[0.3em] mb-4 font-mono">The Workflow</p>
          <h2 className="text-3xl md:text-5xl font-black text-white uppercase tracking-tighter">Simple. Transparent. Global.</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { n: "01", t: "Source", d: "Access to all 50 states via dealers and private auctions.", i: "🔍" },
            { n: "02", t: "Verify", d: "Professional VIN check and structural crash analysis.", i: "🛡" },
            { n: "03", t: "Ship", d: "Marine insurance, live tracking, and export docs.", i: "🚢" }
          ].map(s => (
            <div key={s.n} className="bg-[#111113] border border-white/5 p-8 rounded-3xl group hover:border-blue-500/50 transition-all">
              <div className="flex justify-between items-start mb-8">
                <span className="text-white/5 text-5xl font-black font-mono leading-none group-hover:text-blue-500/10 transition-colors">{s.n}</span>
                <span className="text-3xl">{s.i}</span>
              </div>
              <p className="text-white font-black text-xl mb-3">{s.t}</p>
              <p className="text-white/40 text-sm leading-relaxed font-medium">{s.d}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function Inventory() {
  const vehicles = [
    { name: "Lamborghini Urus", year: 2023, price: "289K", type: "Exotic", col: "Yellow" },
    { name: "Rolls-Royce Ghost", year: 2024, price: "345K", type: "Luxury", col: "White" },
    { name: "Chevrolet Corvette", year: 2024, price: "74K", type: "Performance", col: "Blue" },
    { name: "Mercedes G-63 AMG", year: 2024, price: "238K", type: "Exotic", col: "Black" },
  ];

  return (
    <div className="bg-[#0A0A0B] min-h-full font-sans p-6 md:p-12 text-white">
      <div className="mb-10">
        <p className="text-blue-500 text-[10px] font-bold uppercase tracking-widest mb-4 font-mono">Digital Showroom</p>
        <h2 className="text-3xl md:text-5xl font-black uppercase tracking-tighter">The Collection</h2>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {vehicles.map(v => (
          <div key={v.name} className="bg-[#111113] border border-white/5 rounded-2xl overflow-hidden hover:border-blue-500/30 transition-all cursor-pointer">
            <div className="h-40 bg-gradient-to-br from-slate-900 to-slate-800 flex items-center justify-center text-4xl">🏎</div>
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <p className="text-white/30 text-[10px] font-bold font-mono mb-1 uppercase tracking-widest">{v.year} • {v.col}</p>
                  <p className="font-black text-lg truncate leading-none">{v.name}</p>
                </div>
                <span className="bg-blue-600 text-white px-2 py-0.5 rounded text-[8px] font-bold uppercase tracking-widest">{v.type}</span>
              </div>
              <div className="pt-4 border-t border-white/5 flex justify-between items-center">
                <span className="text-white/50 text-xs font-mono">$ {v.price}</span>
                <span className="text-emerald-500 text-[10px] font-bold font-mono uppercase">✓ Export Ready</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function Process() {
  return (
    <div className="bg-[#0A0A0B] min-h-full font-sans p-6 md:p-12 text-white">
      <div className="text-center mb-16">
        <p className="text-blue-500 text-[10px] font-bold uppercase tracking-widest mb-4 font-mono">End-to-End</p>
        <h2 className="text-3xl md:text-5xl font-black uppercase tracking-tighter">The Process</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-16">
        {[
          { t: "Sourcing", d: "We access the full US market across all 50 states.", i: "🔍" },
          { t: "Inspection", d: "Professional VIN history and structural report.", i: "🛡" },
          { t: "Port Loading", d: "Secure loading at major US ports with full insurance.", i: "🚢" },
          { t: "Delivery", d: "Live tracking from port to port till you clear.", i: "🌍" }
        ].map(s => (
          <div key={s.t} className="bg-[#111113] border border-white/5 p-8 rounded-3xl flex items-center gap-8">
            <div className="w-14 h-14 bg-blue-600/10 rounded-2xl flex items-center justify-center text-2xl shrink-0">{s.i}</div>
            <div className="min-w-0">
              <p className="font-black text-white text-lg mb-1 leading-none">{s.t}</p>
              <p className="text-white/40 text-xs leading-relaxed font-medium">{s.d}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-gradient-to-br from-blue-600/20 to-transparent border border-blue-600/30 rounded-[40px] p-10 md:p-16 text-center">
        <h3 className="text-3xl md:text-5xl font-black text-white mb-6 uppercase tracking-tighter">Ready to export?</h3>
        <p className="text-white/50 text-sm md:text-lg mb-10 max-w-xl mx-auto font-medium">Get a professional shipping quote or browse our Georgia-licensed inventory today.</p>
        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <button className="bg-blue-600 text-white px-10 py-4 rounded-xl font-bold uppercase text-xs tracking-widest">Browse Inventory</button>
          <button className="bg-emerald-500 text-white px-10 py-4 rounded-xl font-bold uppercase text-xs tracking-widest">WhatsApp Concierge</button>
        </div>
      </div>
    </div>
  );
}
