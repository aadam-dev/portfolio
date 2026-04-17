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
    "50 bags of Ghacem Cement",
    "Y16 Steel Rebar",
    "Aluzinc Roofing Sheets",
    "PVC Pipes 4 inch",
  ];

  const materialCards = [
    { name: "Ghacem Cement", qty: "500 bags", bg: "linear-gradient(135deg, #334155, #1e293b)", progress: 60 },
    { name: "Y16 Rebar", qty: "200 pcs", bg: "linear-gradient(135deg, #475569, #334155)", progress: 75 },
    { name: "Aluzinc Sheets", qty: "150m", bg: "linear-gradient(135deg, #92400e, #78350f)", progress: 90 },
  ];

  return (
    <div style={{ background: "#020617", minHeight: "100%", fontFamily: "system-ui, sans-serif", position: "relative", overflow: "hidden" }}>
      {/* Ambient amber glow */}
      <div className="absolute top-0 left-1/4 w-80 h-80 bg-amber-500/10 rounded-full blur-[100px] pointer-events-none" />

      {/* Nav */}
      <nav className="px-6 py-4 md:px-12 md:py-5 border-b border-white/5 flex items-center justify-between relative z-10">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center">
            <span className="text-xl">🏗️</span>
          </div>
          <div className="flex flex-col leading-none">
            <span className="text-white font-bold text-sm tracking-tight">PrimeHub</span>
            <span className="text-white/40 text-[9px] font-bold tracking-widest mt-1">MATERIALS</span>
          </div>
        </div>
        <div className="hidden md:flex gap-8 items-center text-white/50 text-[13px] font-medium">
          <span>Products</span>
          <span>Categories</span>
          <button className="bg-amber-500 text-black px-4 py-1.5 rounded-lg font-bold">Quote</button>
        </div>
        <div className="md:hidden w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-white/60">☰</div>
      </nav>

      <div className="px-6 py-12 md:px-12 md:py-20 flex flex-col lg:flex-row items-center gap-16 lg:gap-8 max-w-6xl mx-auto">
        <div className="flex-1 text-center lg:text-left">
          <div className="inline-flex items-center gap-2 bg-amber-500/10 border border-amber-500/20 px-4 py-1.5 rounded-full mb-8">
            <span className="w-1.5 h-1.5 bg-amber-500 rounded-full animate-pulse" />
            <span className="text-amber-500 text-[10px] font-bold tracking-wide">TRUSTED BY 500+ CONTRACTORS</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 tracking-tight leading-[1.1]">
            Build with <span className="text-amber-500">Precision.</span><br />
            Source with <span className="underline decoration-amber-500 decoration-4 underline-offset-8">Prime.</span>
          </h1>
          <p className="text-slate-400 text-sm md:text-base leading-relaxed mb-10 max-w-lg mx-auto lg:mx-0">
            The procurement command center for Ghanaian contractors. Generate formal proformas and track deliveries to your site.
          </p>

          <div className="bg-slate-900 border border-white/10 p-2.5 rounded-2xl flex items-center gap-3 mb-12 max-w-md mx-auto lg:mx-0 shadow-2xl">
            <span className="text-amber-500 font-mono pl-2">$</span>
            <input 
              readOnly 
              placeholder="50 bags of cement..." 
              className="flex-1 bg-transparent border-none text-slate-400 text-sm outline-none font-mono"
            />
            <button className="bg-amber-500 text-black px-6 py-2 rounded-xl font-bold text-xs">Search</button>
          </div>

          <div className="grid grid-cols-3 gap-8 text-left max-w-sm mx-auto lg:mx-0">
            {[["2.5K+", "Materials"], ["500+", "Contractors"], ["24h", "Delivery"]].map(([v, l]) => (
              <div key={l}>
                <div className="text-white text-xl font-bold mb-1">{v}</div>
                <div className="text-slate-500 text-[10px] uppercase font-bold tracking-widest">{l}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="flex-1 w-full max-w-md relative h-[320px] lg:h-[400px]">
          {materialCards.map((card, i) => (
            <div key={card.name} className="absolute inset-x-0 mx-auto rounded-3xl p-6 border border-white/10 shadow-2xl transition-all duration-500"
              style={{
                width: `${100 - i * 5}%`,
                top: `${i * 35}px`,
                background: card.bg,
                transform: `rotate(${(i - 1) * 3}deg)`,
                zIndex: 10 - i
              }}>
              <div className="flex items-center justify-between mb-4">
                <div>
                  <p className="text-white font-bold text-sm mb-1">{card.name}</p>
                  <p className="text-white/40 text-xs">{card.qty}</p>
                </div>
                <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center text-xl">📦</div>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex-1 h-1.5 bg-white/10 rounded-full overflow-hidden">
                  <div className="h-full bg-amber-500" style={{ width: `${card.progress}%` }} />
                </div>
                <span className="text-[10px] text-white/30 font-bold uppercase tracking-widest">In Stock</span>
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
