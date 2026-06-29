"use client";

interface Props { screen: string }

const catalogue = [
  { name: "Portland Cement 42.5N", cat: "Cement & Concrete", price: 85, off: 17, stock: false },
  { name: "Stone Cladding Panel", cat: "Cement & Concrete", price: 64, off: 17, stock: false },
  { name: "Claw Hammer 16oz", cat: "Hardware & Fasteners", price: 48, off: 17, stock: false },
  { name: "Iron Rods 12mm Y12", cat: "Steel & Rebar", price: 680, off: 0, stock: true },
  { name: "PVC Pipes 4-inch (6m)", cat: "Plumbing & Pipes", price: 48, off: 0, stock: true },
  { name: "Safety Helmet (Hi-Vis)", cat: "Safety Equipment", price: 35, off: 0, stock: true },
];

const categories = [
  { name: "Cement & Concrete", desc: "Portland cement, ready-mix and concrete admixtures from top brands." },
  { name: "Plumbing & Pipes", desc: "PVC pipes, fittings, taps, water tanks and drainage systems." },
  { name: "Hardware & Fasteners", desc: "Nails, screws, bolts, hinges, locks and general hardware." },
  { name: "Safety Equipment", desc: "Hard hats, safety boots, hi-vis vests, gloves and site safety gear." },
  { name: "Tools & Machinery", desc: "Power tools, hand tools and machinery for every trade." },
];

export default function PrimeHubPreview({ screen }: Props) {
  if (screen === "products") return <Products />;
  if (screen === "categories") return <Categories />;
  return <Landing />;
}

function Logo() {
  return (
    <div className="flex items-center gap-2.5">
      <div className="w-8 h-8 rounded-lg bg-amber-400 flex items-center justify-center text-slate-950 font-black text-lg shadow-[0_0_18px_rgba(251,191,36,0.35)]">P</div>
      <div className="flex flex-col leading-none">
        <span className="text-white font-black tracking-tight text-[13px]">PRIME<span className="text-amber-400">TIJARA</span></span>
        <span className="text-white/35 text-[8px] font-bold tracking-[0.22em] mt-0.5">BUILD WITH PRECISION</span>
      </div>
    </div>
  );
}

function TopNav({ active }: { active?: string }) {
  return (
    <nav className="px-6 py-4 md:px-10 md:py-5 border-b border-white/5 flex items-center justify-between relative z-10 bg-[#0a1020]/80 backdrop-blur-xl">
      <Logo />
      <div className="hidden md:flex gap-7 items-center text-white/50 text-[13px] font-medium">
        <span className={active === "products" ? "text-amber-400 font-semibold" : "hover:text-white"}>Products</span>
        <span className={active === "categories" ? "text-amber-400 font-semibold" : "hover:text-white"}>Categories</span>
        <span className="text-white/40">🛒</span>
        <span className="hover:text-white">Sign in</span>
        <button className="bg-amber-400 text-slate-950 px-5 py-2 rounded-full font-bold hover:bg-amber-300 transition-colors">Get Started</button>
      </div>
    </nav>
  );
}

function Landing() {
  const materialCards = [
    { name: "Ghacem Cement", qty: "500 bags", bg: "linear-gradient(135deg, #1e293b, #020617)", progress: 60 },
    { name: "LEO Pump", qty: "20 units", bg: "linear-gradient(135deg, #334155, #0f172a)", progress: 75 },
    { name: "Aluzinc Sheets", qty: "150m", bg: "linear-gradient(135deg, #78350f, #451a03)", progress: 90 },
  ];

  return (
    <div style={{ background: "#0a1020", minHeight: "100%", fontFamily: "system-ui, sans-serif", position: "relative", overflow: "hidden" }}>
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-amber-300/5 rounded-full blur-[120px] pointer-events-none" />
      <TopNav />

      <div className="px-6 py-12 md:px-12 md:py-16 flex flex-col lg:flex-row items-center gap-16 lg:gap-12 max-w-7xl mx-auto">
        <div className="flex-1 text-center lg:text-left z-10">
          <div className="inline-flex items-center gap-2 rounded-full border border-amber-300/25 bg-amber-300/10 px-4 py-2 mb-7">
            <span className="h-1.5 w-1.5 rounded-full bg-amber-300 shadow-[0_0_12px_rgba(252,211,77,0.8)] animate-pulse" />
            <span className="text-amber-200 text-[10px] font-bold uppercase tracking-[0.2em]">Building materials procurement for Ghana</span>
          </div>

          <h1 className="text-4xl md:text-[5rem] font-black text-white mb-6 tracking-tighter leading-[0.9] uppercase text-balance">
            The new supply desk for businesses and builders.
          </h1>

          <p className="text-slate-300 text-sm md:text-lg leading-relaxed mb-9 max-w-xl mx-auto lg:mx-0">
            PrimeTijara helps businesses and individuals source materials through one verified flow: competitive stock, formal proformas, stakeholder approvals, and delivery coordination.
          </p>

          <div className="flex flex-wrap gap-3 justify-center lg:justify-start mb-11">
            <button className="bg-amber-400 text-slate-950 px-7 py-3.5 rounded-full font-black text-sm flex items-center gap-2">
              Get Started <span className="text-lg">→</span>
            </button>
            <button className="bg-white/5 text-white border border-white/10 px-7 py-3.5 rounded-full font-bold text-sm">Browse catalogue</button>
          </div>

          <div className="grid grid-cols-3 gap-6 text-left max-w-lg mx-auto lg:mx-0 pt-7 border-t border-white/5">
            {[["1,000+", "Materials Indexed"], ["7 days", "Quote Validity"], ["24h", "Accra Fulfillment"]].map(([v, l]) => (
              <div key={l} className="border-l border-white/10 pl-4">
                <div className="text-white text-2xl md:text-3xl font-medium mb-1">{v}</div>
                <div className="text-slate-500 text-[9px] uppercase font-bold tracking-[0.15em] leading-tight">{l}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="flex-1 w-full max-w-md relative h-[380px] lg:h-[440px]">
          <div className="absolute -left-8 top-24 z-20 w-44 rounded-3xl bg-amber-400 p-5 text-slate-950 shadow-2xl hidden md:block">
            <div className="flex items-center gap-2 mb-3">
              <span className="text-sm">⏱</span>
              <span className="text-[10px] font-black uppercase tracking-[0.2em]">ETA locked</span>
            </div>
            <p className="text-4xl font-black leading-none mb-1">24h</p>
            <p className="text-xs font-semibold leading-tight">coordinated fulfillment window</p>
          </div>

          {materialCards.map((card, i) => (
            <div key={card.name} className="absolute inset-x-0 mx-auto rounded-3xl p-6 border border-white/10 shadow-2xl backdrop-blur-md"
              style={{ width: `${100 - i * 5}%`, top: `${i * 45 + 40}px`, background: card.bg, transform: `rotate(${(i - 1) * 2}deg)`, zIndex: 10 - i }}>
              <div className="flex items-center justify-between mb-5">
                <div>
                  <p className="text-white font-bold text-base mb-1">{card.name}</p>
                  <p className="text-slate-400 text-xs font-medium">{card.qty}</p>
                </div>
                <div className="w-12 h-12 bg-white/5 border border-white/10 rounded-2xl flex items-center justify-center text-xl">📦</div>
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

function HeroBand({ eyebrow, title, sub, active }: { eyebrow: string; title: string; sub: string; active: string }) {
  return (
    <div style={{ background: "#0a1020" }} className="relative overflow-hidden">
      <div className="absolute top-0 left-1/4 w-[400px] h-[400px] bg-amber-300/5 rounded-full blur-[120px] pointer-events-none" />
      <TopNav active={active} />
      <div className="px-6 md:px-12 pt-8 pb-12 max-w-7xl mx-auto relative z-10">
        <p className="text-white/30 text-[11px] mb-3">Home <span className="mx-1">›</span> {title}</p>
        <p className="text-amber-400 text-[10px] font-bold uppercase tracking-[0.25em] mb-3">{eyebrow}</p>
        <h1 className="text-4xl md:text-6xl font-black text-white tracking-tighter uppercase mb-4">{title}</h1>
        <p className="text-slate-400 text-sm md:text-base max-w-2xl leading-relaxed">{sub}</p>
      </div>
    </div>
  );
}

function Products() {
  return (
    <div className="min-h-full font-sans" style={{ background: "#efece3" }}>
      <HeroBand eyebrow="Catalogue" title="All Products" active="products"
        sub="Browse the complete PrimeTijara material catalogue. Search, filter, compare pricing, and turn the right items into a formal quote." />

      <div className="px-6 md:px-12 py-8 max-w-7xl mx-auto flex flex-col md:flex-row gap-6">
        <aside className="w-full md:w-56 shrink-0">
          <div className="bg-white rounded-2xl border border-black/5 p-5 shadow-sm">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Filters</p>
            <p className="text-[12px] font-bold text-slate-800 mb-2">Categories</p>
            <div className="space-y-2 mb-5">
              {categories.map((c) => (
                <label key={c.name} className="flex items-center gap-2 text-[12px] text-slate-500">
                  <span className="w-3.5 h-3.5 rounded border border-slate-300 inline-block" />{c.name}
                </label>
              ))}
            </div>
            <p className="text-[12px] font-bold text-slate-800 mb-2">Price Range (GHS)</p>
            <div className="flex gap-2">
              <span className="flex-1 border border-slate-200 rounded-lg px-2 py-1.5 text-[11px] text-slate-400">Min 0</span>
              <span className="flex-1 border border-slate-200 rounded-lg px-2 py-1.5 text-[11px] text-slate-400">Max 5K</span>
            </div>
          </div>
        </aside>

        <div className="flex-1">
          <div className="flex items-center justify-between gap-3 bg-white rounded-2xl border border-black/5 px-4 py-3 mb-5 shadow-sm">
            <span className="text-[13px] font-bold text-slate-700">81 products</span>
            <div className="flex items-center gap-2">
              <span className="hidden sm:inline text-[12px] text-slate-400 border border-slate-200 rounded-lg px-3 py-1.5">🔍 Search products…</span>
              <span className="text-[12px] text-slate-600 border border-slate-200 rounded-lg px-3 py-1.5">Name (A–Z) ▾</span>
            </div>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
            {catalogue.map((p) => (
              <div key={p.name} className="bg-white rounded-2xl border border-black/5 overflow-hidden shadow-sm">
                <div className="relative h-28 bg-gradient-to-br from-stone-300 to-stone-500 flex items-center justify-center text-3xl">
                  🧱
                  {p.off > 0 && <span className="absolute top-2 left-2 bg-amber-400 text-slate-950 text-[10px] font-black px-2 py-0.5 rounded">-{p.off}%</span>}
                  {!p.stock && <span className="absolute top-2 right-2 bg-red-500 text-white text-[10px] font-bold px-2 py-0.5 rounded">Out of Stock</span>}
                </div>
                <div className="p-3">
                  <p className="text-[10px] text-amber-600 font-bold uppercase tracking-wide mb-1 truncate">{p.cat}</p>
                  <p className="text-[13px] font-bold text-slate-800 mb-2 truncate">{p.name}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-900 font-black text-sm">GH₵ {p.price}</span>
                    <button className="text-[11px] font-bold text-amber-600">+ Quote</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function Categories() {
  return (
    <div className="min-h-full font-sans" style={{ background: "#efece3" }}>
      <HeroBand eyebrow="Material Atlas" title="Building Materials" active="categories"
        sub="Browse the procurement layers behind every project. Prices stay quote-ready and are locked for 7 days when you generate a proforma." />

      <div className="px-6 md:px-12 py-8 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {categories.map((c) => (
            <div key={c.name} className="bg-white rounded-2xl border border-black/5 p-5 shadow-sm">
              <div className="w-11 h-11 rounded-xl bg-slate-950 flex items-center justify-center text-amber-400 text-xl mb-4">⬡</div>
              <p className="text-[14px] font-black text-slate-800 mb-1.5">{c.name}</p>
              <p className="text-[12px] text-slate-500 leading-relaxed">{c.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
