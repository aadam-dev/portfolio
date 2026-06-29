"use client";

interface Props { screen: string }

const products = [
  { name: "Milo Chocolate Malt", aisle: "PANTRY", price: "45.00", emoji: "🍫" },
  { name: "Geisha Mackerel in Tomato", aisle: "PANTRY", price: "18.50", emoji: "🐟" },
  { name: "Perfumed Rice 5kg", aisle: "PANTRY", price: "95.00", emoji: "🍚" },
  { name: "Fresh Milk 1L", aisle: "DAIRY", price: "14.00", emoji: "🥛" },
  { name: "Sugar 1kg", aisle: "PANTRY", price: "16.00", emoji: "🧂" },
  { name: "Cooking Oil 2L", aisle: "PANTRY", price: "52.00", emoji: "🛢️" },
];

export default function MakossaPreview({ screen }: Props) {
  if (screen === "catalog") return <Catalog />;
  return <Landing />;
}

function Nav() {
  return (
    <div className="px-4 md:px-6 pt-4">
      <div className="flex items-center gap-3 rounded-2xl border border-white/8 bg-white/[0.03] px-4 py-2.5">
        <span className="text-white font-black tracking-tight text-sm">Makossa</span>
        <div className="hidden md:flex gap-4 text-[12px] text-white/45">
          <span>Shop</span><span>Locations</span><span>Help</span>
        </div>
        <div className="flex-1 hidden sm:flex items-center gap-2 bg-white/[0.04] border border-white/8 rounded-lg px-3 py-1.5 text-[12px] text-white/35">
          🔍 Search products
        </div>
        <span className="text-[12px] text-white/50 border border-white/8 rounded-lg px-3 py-1.5">Aisles ▾</span>
        <span className="text-[12px] text-white/60 border border-white/8 rounded-lg px-3 py-1.5">🛍 Cart</span>
        <span className="text-[11px] text-amber-400/90 font-medium">Demo mode</span>
      </div>
    </div>
  );
}

function Landing() {
  return (
    <div className="min-h-full font-sans relative overflow-hidden" style={{ background: "#0b0b14" }}>
      <div className="absolute -top-20 right-1/4 w-[460px] h-[460px] rounded-full pointer-events-none" style={{ background: "radial-gradient(circle, rgba(99,102,241,0.22), transparent 70%)" }} />
      <Nav />

      <div className="px-6 md:px-12 py-12 md:py-16 max-w-6xl mx-auto flex flex-col lg:flex-row items-center gap-10 relative z-10">
        <div className="flex-1">
          <span className="inline-flex items-center gap-2 rounded-full border border-indigo-400/25 bg-indigo-400/10 px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.18em] text-indigo-300 mb-6">
            ◆ Accra mini mart · enterprise inventory
          </span>
          <h1 className="text-4xl md:text-6xl font-black text-white tracking-tighter mb-5 leading-[0.95]">The Makossa Shop</h1>
          <p className="text-white/55 text-sm md:text-base leading-relaxed mb-8 max-w-md">
            Glass clear pricing, industrial ops, and one stock count whether you buy online or at the counter. Built for Ghanaian FMCG and daily essentials.
          </p>
          <div className="flex flex-wrap gap-3">
            <button className="px-6 py-3 rounded-xl font-bold text-sm text-white" style={{ background: "#6366f1" }}>Shop the aisle</button>
            <button className="px-6 py-3 rounded-xl font-bold text-sm text-white/80 bg-white/[0.06] border border-white/10">Sign in</button>
            <button className="px-6 py-3 rounded-xl font-bold text-sm text-white/80 bg-white/[0.06] border border-white/10">Create account</button>
          </div>
        </div>

        <div className="flex-1 w-full max-w-sm">
          <div className="rounded-3xl overflow-hidden border border-white/10 shadow-2xl">
            <div className="h-56 flex items-center justify-center text-7xl" style={{ background: "linear-gradient(135deg, #3a2a1a, #1a120c)" }}>🍫</div>
            <div className="bg-white/[0.03] px-4 py-3 text-[11px] text-white/45">Gold tone shelf styling; real stock signals in catalog and POS.</div>
          </div>
        </div>
      </div>

      <div className="px-6 md:px-12 pb-10 max-w-6xl mx-auto flex flex-wrap justify-center gap-3 relative z-10">
        {["📦 Live stock on every SKU", "🚚 Pickup windows that fit Accra traffic", "💳 Pay at collection or demo card"].map((t) => (
          <span key={t} className="rounded-full border border-white/8 bg-white/[0.03] px-4 py-2 text-[12px] text-white/55">{t}</span>
        ))}
      </div>
    </div>
  );
}

function Catalog() {
  return (
    <div className="min-h-full font-sans" style={{ background: "#0b0b14" }}>
      <Nav />
      <div className="px-6 md:px-12 py-8 max-w-6xl mx-auto">
        <h1 className="text-3xl md:text-4xl font-black text-white tracking-tight mb-2">Catalog</h1>
        <p className="text-white/45 text-[13px] mb-6">Filter by aisle. Stock counts match the till in real time when Supabase is connected.</p>

        <div className="flex flex-wrap items-center gap-2 mb-6">
          <span className="text-[12px] text-white/55 border border-white/10 rounded-lg px-3 py-2 bg-white/[0.03]">All ▾</span>
          <span className="flex-1 min-w-[140px] text-[12px] text-white/35 border border-white/10 rounded-lg px-3 py-2 bg-white/[0.03]">Search in catalog</span>
          <button className="text-[12px] font-bold text-white rounded-lg px-4 py-2" style={{ background: "#6366f1" }}>Apply</button>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {products.map((p) => (
            <div key={p.name} className="rounded-2xl overflow-hidden border border-white/8 bg-white/[0.02]">
              <div className="relative h-28 flex items-center justify-center text-4xl" style={{ background: "linear-gradient(135deg, #241c14, #14100a)" }}>
                {p.emoji}
                <span className="absolute top-2 left-2 bg-white/10 text-white/70 text-[9px] font-bold px-2 py-0.5 rounded">{p.aisle}</span>
                <span className="absolute top-2 right-2 text-emerald-300 text-[9px] font-bold px-2 py-0.5 rounded bg-emerald-400/10">In stock</span>
              </div>
              <div className="p-3">
                <p className="text-[13px] font-semibold text-white/90 mb-1.5 truncate">{p.name}</p>
                <p className="font-black text-sm mb-2" style={{ color: "#818cf8" }}>GH₵ {p.price}</p>
                <button className="w-full text-[11px] font-bold text-white/80 bg-white/[0.05] border border-white/10 rounded-lg py-1.5">+ Add to cart</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
