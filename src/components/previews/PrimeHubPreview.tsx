"use client";

interface Props { screen: string }

const products = [
  { name: "Portland Cement 42.5N", brand: "Diamond Cement", unit: "50kg bag", price: 85, stock: 240, img: "🏗️" },
  { name: "Iron Rods 12mm Y12", brand: "Tema Steel", unit: "bundle/12m", price: 680, stock: 85, img: "🔩" },
  { name: "Hollow Blocks 6-inch", brand: "BlockMasters", unit: "per unit", price: 4.5, stock: 1500, img: "🧱" },
  { name: "Roofing Sheets (Aluminium)", brand: "Roofco", unit: "per sheet", price: 120, stock: 200, img: "🏠" },
  { name: "PVC Pipes 4-inch (6m)", brand: "Interplast", unit: "per length", price: 48, stock: 340, img: "🔧" },
  { name: "Paint (Exterior, 20L)", brand: "Dulux", unit: "per tin", price: 290, stock: 60, img: "🎨" },
];

export default function PrimeHubPreview({ screen }: Props) {
  if (screen === "products") return <Products />;
  if (screen === "quote") return <Quote />;
  return <Landing />;
}

function Landing() {
  const suggestions = [
    "LEO Water Pump 1.5hp",
    "50 bags of Ghacem Cement",
    "Y16 Steel Rebar",
    "Aluzinc Roofing Sheets"
  ];

  const materialCards = [
    { name: "Ghacem Cement", qty: "500 bags", bg: "linear-gradient(135deg, #1e293b, #020617)", progress: 60 },
    { name: "LEO Pump", qty: "20 units", bg: "linear-gradient(135deg, #334155, #0f172a)", progress: 75 },
    { name: "Aluzinc Sheets", qty: "150m", bg: "linear-gradient(135deg, #78350f, #451a03)", progress: 90 },
  ];

  return (
    <div style={{ background: "#020617", minHeight: "100%", fontFamily: "system-ui, sans-serif", position: "relative", overflow: "hidden" }}>
      {/* Ambient glow */}
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-amber-300/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute inset-0 bg-[url('/noise.png')] opacity-[0.03] pointer-events-none mix-blend-overlay" />

      {/* Nav */}
      <nav className="px-6 py-4 md:px-12 md:py-6 border-b border-white/5 flex items-center justify-between relative z-10 bg-[#020617]/80 backdrop-blur-xl">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-amber-300 flex items-center justify-center shadow-[0_0_20px_rgba(252,211,77,0.3)] text-black font-black text-xl">
            P
          </div>
          <div className="flex flex-col leading-none">
            <span className="text-white font-bold tracking-tight">PrimeHub</span>
            <span className="text-white/40 text-[9px] font-bold tracking-[0.2em] mt-1">PROCUREMENT</span>
          </div>
        </div>
        <div className="hidden md:flex gap-8 items-center text-white/50 text-[13px] font-medium">
          <span className="hover:text-white transition-colors">Products</span>
          <span className="hover:text-white transition-colors">Categories</span>
          <button className="bg-white/5 text-white border border-white/10 px-5 py-2 rounded-xl font-bold hover:bg-white/10 transition-colors">Sign in</button>
          <button className="bg-amber-300 text-slate-950 px-5 py-2 rounded-xl font-bold hover:bg-amber-200 transition-colors">Build quote</button>
        </div>
      </nav>

      <div className="px-6 py-12 md:px-12 md:py-20 flex flex-col lg:flex-row items-center gap-16 lg:gap-12 max-w-7xl mx-auto">
        <div className="flex-1 text-center lg:text-left z-10">
          <div className="inline-flex items-center gap-2 rounded-full border border-amber-300/25 bg-amber-300/10 px-4 py-2 mb-8 shadow-inner shadow-amber-300/5">
            <span className="h-1.5 w-1.5 rounded-full bg-amber-300 shadow-[0_0_12px_rgba(252,211,77,0.8)] animate-pulse" />
            <span className="text-amber-200 text-[10px] font-bold uppercase tracking-[0.2em]">Building materials procurement for Ghana</span>
          </div>
          
          <h1 className="text-4xl md:text-[5.5rem] font-bold text-white mb-6 tracking-tighter leading-[0.9] uppercase text-balance">
            The new supply desk for <br className="hidden md:block"/> serious builders.
          </h1>
          
          <p className="text-slate-300 text-sm md:text-xl leading-relaxed mb-10 max-w-2xl mx-auto lg:mx-0">
            PrimeHub turns material sourcing into a verified procurement flow: competitive stock, formal proformas, stakeholder approvals, and delivery coordination from one sharp command point.
          </p>

          <div className="bg-slate-950/80 border border-white/10 p-2 rounded-3xl flex items-center gap-3 mb-6 max-w-xl mx-auto lg:mx-0 shadow-2xl backdrop-blur-xl">
            <div className="flex-1 flex items-center gap-3 bg-white/[0.04] rounded-2xl px-4 py-3 min-h-14">
              <span className="text-amber-300 text-lg">🔍</span>
              <span className="text-amber-300 font-mono text-sm hidden sm:inline">procure:</span>
              <input 
                readOnly 
                placeholder="Search LEO pumps, cement, rebar..." 
                className="flex-1 bg-transparent border-none text-white text-base outline-none font-sans placeholder:text-slate-500"
              />
            </div>
            <button className="bg-amber-300 text-slate-950 px-6 py-4 rounded-2xl font-black text-sm h-14 flex items-center gap-2">
              Build quote <span className="text-lg">→</span>
            </button>
          </div>

          <div className="flex flex-wrap gap-2 justify-center lg:justify-start mb-12 max-w-xl mx-auto lg:mx-0">
            {suggestions.map((item) => (
              <span key={item} className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1.5 text-[11px] font-medium text-slate-300">
                {item}
              </span>
            ))}
          </div>

          <div className="grid grid-cols-3 gap-6 text-left max-w-lg mx-auto lg:mx-0 pt-8 border-t border-white/5">
            {[["1,000+", "Materials Indexed"], ["7 days", "Quote Validity"], ["24h", "Accra Fulfillment Target"]].map(([v, l]) => (
              <div key={l} className="border-l border-white/10 pl-4">
                <div className="text-white text-2xl md:text-3xl font-medium mb-1 font-sans">{v}</div>
                <div className="text-slate-500 text-[9px] uppercase font-bold tracking-[0.15em] leading-tight">{l}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="flex-1 w-full max-w-md relative h-[380px] lg:h-[480px]">
          {/* Glassmorphic ETA Card */}
          <div className="absolute -left-12 top-20 z-20 w-48 rounded-3xl border border-amber-300/30 bg-amber-300 p-5 text-slate-950 shadow-2xl hidden md:block">
            <div className="flex items-center gap-2 mb-3">
              <span className="text-sm">⏱</span>
              <span className="text-[10px] font-black uppercase tracking-[0.2em]">ETA locked</span>
            </div>
            <p className="text-4xl font-black leading-none mb-1">24h</p>
            <p className="text-xs font-semibold leading-tight">coordinated fulfillment window</p>
          </div>

          {materialCards.map((card, i) => (
            <div key={card.name} className="absolute inset-x-0 mx-auto rounded-3xl p-6 border border-white/10 shadow-2xl transition-all duration-500 backdrop-blur-md"
              style={{
                width: `${100 - i * 5}%`,
                top: `${i * 45 + 40}px`,
                background: card.bg,
                transform: `rotate(${(i - 1) * 2}deg)`,
                zIndex: 10 - i
              }}>
              <div className="flex items-center justify-between mb-5">
                <div>
                  <p className="text-white font-bold text-base mb-1">{card.name}</p>
                  <p className="text-slate-400 text-xs font-medium">{card.qty}</p>
                </div>
                <div className="w-12 h-12 bg-white/5 border border-white/10 rounded-2xl flex items-center justify-center text-xl shadow-inner shadow-white/5">📦</div>
              </div>
              <div className="flex items-center gap-4">
                <div className="flex-1 h-2 bg-slate-950/50 rounded-full overflow-hidden border border-white/5">
                  <div className="h-full bg-amber-300 shadow-[0_0_10px_rgba(252,211,77,0.5)]" style={{ width: `${card.progress}%` }} />
                </div>
                <span className="text-[10px] text-amber-300/80 font-bold uppercase tracking-[0.15em]">Ready</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function Products() {
  return (
    <div className="bg-[#0A0A0F] min-h-full font-sans flex flex-col md:flex-row">
      <div className="w-full md:w-56 border-b md:border-r border-white/5 p-6 md:p-8 shrink-0">
        <p className="text-[10px] font-bold text-white/30 mb-6 uppercase tracking-widest">Categories</p>
        <div className="space-y-1.5">
          {["All Materials", "Cement", "Steel", "Roofing", "Plumbing"].map((f, i) => (
            <div key={f} className={`p-3 rounded-xl text-xs font-medium cursor-pointer ${i === 0 ? "bg-amber-500/10 text-amber-500 font-bold" : "text-white/40"}`}>{f}</div>
          ))}
        </div>
      </div>
      <div className="flex-1 p-6 md:p-8">
        <div className="flex items-center justify-between mb-8">
          <p className="text-[11px] text-white/30 font-bold uppercase tracking-widest">2,400+ Products Found</p>
          <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-white/40">▦</div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {products.map(p => (
            <div key={p.name} className="bg-white/5 border border-white/10 rounded-2xl p-4 flex gap-4">
              <div className="w-12 h-12 rounded-xl bg-amber-500/10 flex items-center justify-center text-2xl shrink-0">{p.img}</div>
              <div className="flex-1 min-w-0">
                <p className="text-white font-bold text-sm mb-0.5 truncate">{p.name}</p>
                <p className="text-white/30 text-[10px] mb-3">{p.brand}</p>
                <div className="flex items-center justify-between">
                  <span className="text-amber-500 font-black text-sm">GH₵ {p.price}</span>
                  <span className="text-emerald-500 text-[10px] font-bold">✓ {p.stock}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function Quote() {
  return (
    <div className="bg-[#0A0A0F] min-h-full font-sans p-6 md:p-12">
      <div className="mb-10">
        <h2 className="text-2xl font-black text-white mb-2 tracking-tight">Proforma Builder</h2>
        <p className="text-white/40 text-sm">Create and approve material lists in one click.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-4">
          <p className="text-[10px] font-bold text-white/30 uppercase tracking-widest mb-4">Current Selection</p>
          {products.slice(0, 3).map((p, i) => (
            <div key={p.name} className="bg-white/5 border border-white/10 rounded-2xl p-5 flex items-center gap-5">
              <span className="text-3xl">{p.img}</span>
              <div className="flex-1">
                <p className="text-white font-bold text-sm mb-0.5">{p.name}</p>
                <p className="text-white/30 text-xs">{p.brand}</p>
              </div>
              <div className="text-right">
                <p className="text-amber-500 font-black mb-1">GH₵ {(p.price * 10).toLocaleString()}</p>
                <p className="text-white/20 text-[10px] font-bold">10 {p.unit}</p>
              </div>
            </div>
          ))}
        </div>
        <div className="bg-white/5 border border-white/10 rounded-3xl p-8 h-fit shadow-2xl">
          <p className="text-[10px] font-bold text-white/30 uppercase tracking-widest mb-6">Quote Summary</p>
          <div className="space-y-4 mb-8">
            {[["Subtotal", "GH₵ 4,390"], ["VAT (15%)", "GH₵ 658"], ["Delivery", "GH₵ 200"]].map(([l, v]) => (
              <div key={l} className="flex justify-between items-center text-sm">
                <span className="text-white/40">{l}</span>
                <span className="text-white font-medium">{v}</span>
              </div>
            ))}
            <div className="pt-4 border-t border-white/10 flex justify-between items-center">
              <span className="text-white font-bold">Total</span>
              <span className="text-amber-500 text-2xl font-black tracking-tighter">GH₵ 5,248</span>
            </div>
          </div>
          <button className="w-full bg-amber-500 text-black py-4 rounded-2xl font-black text-sm shadow-lg shadow-amber-500/20">
            Generate Proforma PDF
          </button>
        </div>
      </div>
    </div>
  );
}
