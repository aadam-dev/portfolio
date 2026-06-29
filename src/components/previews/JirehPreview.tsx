"use client";

interface Props { screen: string }

export default function JirehPreview({ screen }: Props) {
  if (screen === "dashboard") return <Dashboard />;
  if (screen === "reports") return <Reports />;
  return <LandingScreen />;
}

/* ── Public website ─────────────────────────────────────────── */
function LandingScreen() {
  return (
    <div className="bg-[#070b12] min-h-full font-sans text-white overflow-x-hidden">
      <nav className="px-6 py-4 md:px-10 md:py-5 flex items-center justify-between border-b border-white/5 bg-[#070b12]/90 sticky top-0 z-50 backdrop-blur-md">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-lime-500 rounded-full flex items-center justify-center font-black text-slate-900 text-xs shadow-lg shadow-lime-500/20">JN</div>
          <span className="text-white font-black text-sm leading-tight tracking-tight hidden sm:block">Jireh Natural Foods</span>
        </div>
        <div className="hidden md:flex gap-7 items-center text-white/45 text-[12px] font-medium">
          <span>About</span><span>Menu</span><span>Visit</span><span>Contact</span>
          <button className="bg-white/5 border border-white/10 text-white px-4 py-1.5 rounded-full font-bold">Bolt Food</button>
          <button className="bg-lime-500 text-slate-900 px-4 py-1.5 rounded-full font-black">Order WhatsApp</button>
        </div>
        <div className="md:hidden text-white/40">☰</div>
      </nav>

      <div className="relative px-6 py-14 md:px-12 md:py-20 text-center border-b border-white/5"
        style={{ backgroundImage: "linear-gradient(rgba(7,11,18,0.62), rgba(7,11,18,0.82)), linear-gradient(135deg, #1c2a16, #0b1208)" }}>
        <span className="inline-block text-lime-400 text-[10px] font-black tracking-[0.2em] mb-5 uppercase border border-lime-400/30 rounded-full px-3 py-1">Adenta's Natural Food Spot</span>
        <div className="w-14 h-14 rounded-full bg-white/90 mx-auto mb-5 flex items-center justify-center text-2xl">🥗</div>
        <h1 className="text-4xl md:text-6xl font-black text-white mb-5 tracking-tight leading-[1.02]">Jireh Natural Foods</h1>
        <p className="text-white/70 text-sm md:text-lg max-w-xl mx-auto mb-9 font-medium">
          Modern Ghanaian dining with grilled specials, wholesome juices and authentic flavor. No monosodium foods, just home-style cooking in Adenta.
        </p>
        <div className="flex flex-wrap gap-3 justify-center">
          <button className="bg-lime-500 text-slate-900 px-6 py-3 rounded-full font-black text-sm">Order via WhatsApp</button>
          <button className="bg-white/8 border border-white/15 text-white px-6 py-3 rounded-full font-bold text-sm">Order on Bolt Food</button>
          <button className="bg-white/8 border border-white/15 text-white px-6 py-3 rounded-full font-bold text-sm">Get directions</button>
        </div>
      </div>

      <div className="p-6 md:p-10 grid grid-cols-3 gap-4 max-w-3xl mx-auto">
        {[["11am – 8pm", "Mon – Sat · Closed Sunday"], ["100%", "No monosodium foods"], ["Fast", "Pickup and delivery"]].map(([v, l]) => (
          <div key={v} className="bg-white/5 border border-white/10 p-5 rounded-2xl text-center">
            <p className="text-white font-black text-lg md:text-xl mb-1">{v}</p>
            <p className="text-white/35 text-[10px] font-medium leading-tight">{l}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ── Back office shell ──────────────────────────────────────── */
const nav = {
  Operations: ["Dashboard", "Orders", "Menu"],
  "Stock & Supply": ["Inventory", "Recipes / BOMs", "Suppliers", "Purchasing"],
  Finance: ["Expenses", "Staff", "Payroll", "Reports"],
};

function Shell({ active, children }: { active: string; children: React.ReactNode }) {
  return (
    <div className="bg-[#0c0d0c] min-h-full font-sans text-white flex">
      <aside className="w-52 shrink-0 border-r border-white/8 p-4 hidden md:flex flex-col">
        <div className="flex items-center gap-2.5 mb-5">
          <div className="w-8 h-8 rounded-full bg-white/90 flex items-center justify-center text-sm">🥗</div>
          <div className="leading-none">
            <p className="text-[12px] font-black">Jireh Natural Foods</p>
            <p className="text-white/35 text-[8px] font-bold tracking-[0.18em] mt-1">BACK OFFICE</p>
          </div>
        </div>
        <button className="w-full bg-lime-500/10 border border-lime-500/30 text-lime-400 rounded-xl py-2 text-[12px] font-bold mb-5">⌗ Open POS Register</button>
        <div className="space-y-4 overflow-hidden">
          {Object.entries(nav).map(([group, items]) => (
            <div key={group}>
              <p className="text-white/30 text-[9px] font-black tracking-[0.16em] mb-1.5">{group.toUpperCase()}</p>
              <div className="space-y-0.5">
                {items.map((it) => (
                  <p key={it} className={`text-[12px] py-1 ${it === active ? "text-lime-400 font-bold" : "text-white/55"}`}>{it}</p>
                ))}
              </div>
            </div>
          ))}
        </div>
        <div className="mt-auto pt-4 flex items-center gap-2">
          <div className="w-7 h-7 rounded-full border border-lime-400/40 text-lime-400 text-[10px] font-bold flex items-center justify-center">CP</div>
          <div className="leading-none"><p className="text-[11px] font-bold">Chef Prince</p><p className="text-white/35 text-[9px]">Owner</p></div>
        </div>
      </aside>
      <main className="flex-1 p-5 md:p-7 overflow-hidden">{children}</main>
    </div>
  );
}

function Kpi({ label, value, sub, color }: { label: string; value: string; sub: string; color: string }) {
  return (
    <div className="bg-white/[0.03] border border-white/8 rounded-2xl p-4">
      <p className="text-white/40 text-[10px] font-bold uppercase tracking-wide mb-2">{label}</p>
      <p className="font-black text-xl md:text-2xl mb-1" style={{ color }}>{value}</p>
      <p className="text-white/30 text-[10px]">{sub}</p>
    </div>
  );
}

function Dashboard() {
  return (
    <Shell active="Dashboard">
      <div className="flex items-center justify-between mb-5">
        <div>
          <p className="text-white/35 text-[10px] font-bold tracking-[0.16em] mb-1">BACK OFFICE</p>
          <h2 className="text-2xl font-black tracking-tight">Dashboard</h2>
          <p className="text-white/35 text-[12px]">Saturday, 29 June 2026</p>
        </div>
        <span className="text-[11px] text-lime-400 border border-lime-400/30 rounded-full px-3 py-1.5 font-bold">● Shift open · Chef Prince</span>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-5">
        <Kpi label="Today's Revenue" value="GH₵ 2,480" sub="↗ 12% vs yesterday" color="#5ecf4f" />
        <Kpi label="Today's Orders" value="34" sub="8 preparing" color="#fff" />
        <Kpi label="Month Revenue" value="GH₵ 58,910" sub="June 2026" color="#5ecf4f" />
        <Kpi label="Stock Value" value="GH₵ 9,240" sub="3 low stock" color="#fff" />
      </div>

      <div className="bg-white/[0.03] border border-white/8 rounded-2xl p-4 mb-5">
        <p className="text-white/40 text-[10px] font-bold tracking-[0.14em] mb-4">30-DAY REVENUE TREND</p>
        <svg viewBox="0 0 600 120" className="w-full h-24">
          <polyline fill="none" stroke="#5ecf4f" strokeWidth="2.5"
            points="0,95 50,82 100,88 150,60 200,68 250,45 300,52 350,38 400,48 450,28 500,36 550,20 600,26" />
          <polyline fill="rgba(94,207,79,0.10)" stroke="none"
            points="0,95 50,82 100,88 150,60 200,68 250,45 300,52 350,38 400,48 450,28 500,36 550,20 600,26 600,120 0,120" />
        </svg>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
        <div className="bg-white/[0.03] border border-white/8 rounded-2xl p-4">
          <p className="text-white/40 text-[10px] font-bold tracking-[0.14em] mb-3">RECENT ORDERS</p>
          {[["#1042", "Jollof + Chicken", "GH₵ 65", "Ready"], ["#1041", "Banku & Okro", "GH₵ 50", "Preparing"], ["#1040", "Fried Rice", "GH₵ 55", "Completed"]].map(([id, item, amt, st]) => (
            <div key={id} className="flex items-center justify-between py-2 border-b border-white/5 last:border-0">
              <span className="text-white/50 text-[11px] w-12">{id}</span>
              <span className="text-white/80 text-[12px] flex-1">{item}</span>
              <span className="text-white font-bold text-[12px] mr-3">{amt}</span>
              <span className="text-lime-400 text-[10px] font-bold">{st}</span>
            </div>
          ))}
        </div>
        <div className="bg-white/[0.03] border border-white/8 rounded-2xl p-4">
          <p className="text-white/40 text-[10px] font-bold tracking-[0.14em] mb-3">LOW STOCK</p>
          {[["Chicken (whole)", "4 left"], ["Plantain", "6 left"], ["Cooking oil 5L", "2 left"]].map(([n, q]) => (
            <div key={n} className="flex items-center justify-between py-2 border-b border-white/5 last:border-0">
              <span className="text-white/70 text-[12px]">{n}</span>
              <span className="text-amber-400 text-[11px] font-bold">{q}</span>
            </div>
          ))}
        </div>
      </div>
    </Shell>
  );
}

function Reports() {
  const pl: [string, string, boolean][] = [
    ["Revenue", "GH₵ 58,910", false],
    ["Cost of Goods Sold (COGS)", "GH₵ 21,300", true],
    ["Gross Profit", "GH₵ 37,610", false],
    ["Operating Expenses", "GH₵ 9,840", true],
    ["Payroll", "GH₵ 12,400", true],
    ["Net Profit / (Loss)", "GH₵ 15,370", false],
  ];
  return (
    <Shell active="Reports">
      <div className="flex items-center justify-between mb-5">
        <h2 className="text-2xl font-black tracking-tight">Reports <span className="text-white/35 text-sm font-medium">· June 2026</span></h2>
        <div className="flex gap-1.5">
          {["P&L", "Sales Analysis", "Shift Sessions"].map((t, i) => (
            <span key={t} className={`text-[11px] px-3 py-1.5 rounded-full font-bold ${i === 0 ? "bg-lime-500/15 text-lime-400" : "text-white/45 border border-white/10"}`}>{t}</span>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-5">
        <Kpi label="Total Revenue" value="GH₵ 58,910" sub="412 orders" color="#fff" />
        <Kpi label="Gross Profit" value="GH₵ 37,610" sub="63.8% margin" color="#5ecf4f" />
        <Kpi label="Total Expenses" value="GH₵ 22,240" sub="incl. payroll" color="#f87171" />
        <Kpi label="Net Profit" value="GH₵ 15,370" sub="June 2026" color="#5ecf4f" />
      </div>

      <div className="bg-white/[0.03] border border-white/8 rounded-2xl p-5">
        <p className="text-white/40 text-[10px] font-bold tracking-[0.14em] mb-4">PROFIT &amp; LOSS STATEMENT — JUNE 2026</p>
        {pl.map(([label, value, neg], i) => {
          const strong = !neg;
          return (
            <div key={label} className={`flex items-center justify-between py-2.5 ${i < pl.length - 1 ? "border-b border-white/5" : ""}`}>
              <span className={`text-[13px] ${strong ? "text-white font-bold" : "text-white/55 pl-3"}`}>{label}</span>
              <span className={`text-[13px] font-bold ${neg ? "text-red-400" : "text-lime-400"}`}>{neg ? "(" + value + ")" : value}</span>
            </div>
          );
        })}
      </div>
    </Shell>
  );
}
