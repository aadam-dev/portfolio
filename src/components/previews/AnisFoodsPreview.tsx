"use client";

interface Props { screen: string }

const menuItems = [
  { name: "Reg. Fried Rice + Grilled Chicken (Lg)", price: 60, cat: "Rice Dishes" },
  { name: "Anis Special (Assorted Fried Rice)", price: 100, cat: "Rice Dishes" },
  { name: "Loaded Fries", price: 70, cat: "Sides" },
  { name: "Indomie Stir-Fry (Large)", price: 45, cat: "Noodles" },
  { name: "Grilled Tilapia + Rice", price: 85, cat: "Local" },
  { name: "Fresh Juice (Large)", price: 20, cat: "Drinks" },
];

const orders = [
  { id: "ORD-001", table: "T3", items: 3, total: 220, status: "In Progress" },
  { id: "ORD-002", table: "T7", items: 2, total: 160, status: "Ready" },
];

export default function AnisFoodsPreview({ screen }: Props) {
  if (screen === "pos") return <POSScreen />;
  if (screen === "dashboard") return <DashboardScreen />;
  if (screen === "reports") return <ReportsScreen />;
  return <LandingScreen />;
}

function LandingScreen() {
  return (
    <div className="bg-white min-h-full font-sans">
      <nav className="px-6 py-4 md:px-10 md:py-5 flex items-center justify-between bg-black/60 sticky top-0 z-50 backdrop-blur-md">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center font-black text-white text-xl">A</div>
          <span className="text-white/50 text-[10px] font-bold tracking-[0.2em] uppercase hidden sm:block">Food & Drink</span>
        </div>
        <div className="hidden md:flex gap-8 items-center text-white/60 text-sm font-medium">
          <span>Menu</span>
          <span>Reservations</span>
          <button className="bg-[#D21F3C] text-white px-5 py-2 rounded-lg font-bold">Book Table</button>
        </div>
        <div className="md:hidden text-white/60 text-2xl">☰</div>
      </nav>

      <div className="bg-[#1A1A1A] relative px-6 py-16 md:px-12 md:py-24 text-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/50 to-transparent pointer-events-none" />
        <div className="relative z-10">
          <div className="inline-block bg-[#D21F3C]/20 border border-[#D21F3C]/40 px-4 py-1.5 rounded-full mb-8">
            <span className="text-[#D21F3C] text-[10px] font-bold tracking-widest">AUTHENTIC GHANAIAN CUISINE</span>
          </div>
          <h1 className="text-5xl md:text-7xl font-black text-white mb-8 tracking-tighter leading-[1] max-w-2xl mx-auto">
            Taste the <span className="bg-gradient-to-r from-[#D21F3C] to-[#FF8C42] bg-clip-text text-transparent italic">Soul</span> of Ghana.
          </h1>
          <p className="text-white/60 text-sm md:text-lg leading-relaxed max-w-xl mx-auto mb-12">
            Experience rich, spicy, and savory flavors of West Africa. From legendary Jollof to crispy fried yam.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4 mb-12">
            <button className="bg-[#D21F3C] text-white px-8 py-4 rounded-xl font-bold">Order Now</button>
            <button className="bg-white/10 border border-white/20 text-white px-8 py-4 rounded-xl font-bold">View Menu</button>
          </div>
          <div className="flex items-center justify-center gap-6 text-white/40 text-xs font-bold uppercase tracking-widest">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 bg-emerald-500 rounded-full" /> Open Now
            </div>
            <span>⭐ 4.8/5 Rating</span>
          </div>
        </div>
      </div>

      <div className="p-8 md:p-12 bg-white">
        <div className="flex items-center justify-between mb-10">
          <h2 className="text-2xl font-black text-slate-900">Popular Dishes</h2>
          <span className="text-[#D21F3C] text-sm font-bold">Full menu →</span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {menuItems.slice(0, 3).map(item => (
            <div key={item.name} className="bg-white border rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow">
              <div className="h-40 bg-slate-50 flex items-center justify-center text-5xl italic">🍲</div>
              <div className="p-6">
                <span className="bg-[#D21F3C]/10 text-[#D21F3C] px-3 py-1 rounded-full text-[10px] font-bold mb-3 inline-block uppercase tracking-wider">{item.cat}</span>
                <p className="font-bold text-slate-900 text-lg mb-2 leading-tight">{item.name}</p>
                <p className="text-[#D21F3C] font-black text-xl">GH₵ {item.price}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function POSScreen() {
  return (
    <div className="bg-white min-h-full font-sans flex flex-col lg:flex-row h-full">
      <div className="flex-1 p-6 border-b lg:border-r border-slate-100">
        <div className="flex gap-2 mb-8 overflow-x-auto pb-2 scrollbar-hide">
          {["All", "Rice Dishes", "Sides", "Local", "Drinks"].map((c, i) => (
            <button key={c} className={`whitespace-nowrap px-5 py-2 rounded-xl text-xs font-bold transition-all ${i === 0 ? "bg-[#D21F3C] text-white" : "bg-slate-50 text-slate-400 hover:bg-slate-100"}`}>{c}</button>
          ))}
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {menuItems.map(item => (
            <div key={item.name} className="bg-white border border-slate-100 p-4 rounded-xl flex items-center gap-4 hover:shadow-sm cursor-pointer">
              <div className="w-10 h-10 bg-[#D21F3C]/5 rounded-lg flex items-center justify-center text-xl shrink-0">🍱</div>
              <div className="min-w-0">
                <p className="text-slate-900 font-bold text-[11px] leading-tight truncate">{item.name}</p>
                <p className="text-[#D21F3C] font-black text-xs mt-1">GH₵ {item.price}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="w-full lg:w-80 bg-slate-50 p-6 flex flex-col">
        <div className="flex items-center justify-between mb-6">
          <span className="font-black text-slate-900">Active Order</span>
          <span className="bg-white px-3 py-1 rounded-lg text-[10px] font-bold text-slate-400 border border-slate-200">TABLE 03</span>
        </div>
        <div className="flex-1 space-y-3 mb-6">
          {menuItems.slice(0, 3).map((item, i) => (
            <div key={i} className="flex justify-between items-center text-xs">
              <div className="min-w-0">
                <p className="text-slate-900 font-bold truncate">{item.name}</p>
                <p className="text-slate-400">Qty: 1</p>
              </div>
              <span className="text-slate-900 font-bold">GH₵ {item.price}</span>
            </div>
          ))}
        </div>
        <div className="pt-6 border-t border-slate-200 space-y-3">
          <div className="flex justify-between text-xs text-slate-400">
            <span>Subtotal</span>
            <span>GH₵ 230</span>
          </div>
          <div className="flex justify-between font-black text-lg text-slate-900">
            <span>Total</span>
            <span className="text-[#D21F3C]">GH₵ 258</span>
          </div>
          <button className="w-full bg-[#D21F3C] text-white py-4 rounded-2xl font-black text-sm mt-4">Charge Customer</button>
        </div>
      </div>
    </div>
  );
}

function DashboardScreen() {
  return (
    <div className="bg-slate-50 min-h-full p-6 md:p-12">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-10">
        <div>
          <h2 className="text-2xl font-black text-slate-900 mb-1">Kitchen Dashboard</h2>
          <p className="text-slate-400 text-xs">Real-time order tracking • Accra Branch</p>
        </div>
        <button className="bg-[#D21F3C] text-white px-6 py-2.5 rounded-xl font-bold text-xs">+ New Order</button>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {[["GH₵ 4.8K", "Revenue"], ["38", "Orders"], ["8", "Active"], ["GH₵ 127", "Avg Val"]].map(([v, l]) => (
          <div key={l} className="bg-white p-6 rounded-2xl border border-slate-100">
            <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest mb-2">{l}</p>
            <p className="text-slate-900 font-black text-xl">{v}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-6">Live Orders</p>
          <div className="space-y-4">
            {orders.map(o => (
              <div key={o.id} className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl">
                <div>
                  <p className="text-slate-900 font-bold text-sm mb-1">{o.id} • {o.table}</p>
                  <p className="text-slate-400 text-xs">{o.items} items • GH₵ {o.total}</p>
                </div>
                <span className={`px-4 py-1.5 rounded-full text-[9px] font-bold uppercase tracking-wider ${o.status === "Ready" ? "bg-emerald-100 text-emerald-600" : "bg-amber-100 text-amber-600"}`}>{o.status}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-6">Sales by Category</p>
          <div className="space-y-6">
            {[["Rice Dishes", 55, "#D21F3C"], ["Local", 22, "#FF8C42"], ["Drinks", 13, "#3B82F6"]].map(([c, p, col]) => (
              <div key={c as string}>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-slate-900 font-bold text-xs">{c}</span>
                  <span className="text-slate-400 text-xs font-bold">{p}%</span>
                </div>
                <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div className="h-full" style={{ width: `${p}%`, background: col as string }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function ReportsScreen() {
  return (
    <div className="bg-slate-50 min-h-full p-6 md:p-12">
      <div className="flex justify-between items-center mb-10">
        <h2 className="text-2xl font-black text-slate-900">Profit & Loss</h2>
        <div className="bg-white border border-slate-100 p-1.5 rounded-xl flex gap-1">
          {["Weekly", "Monthly"].map((t, i) => (
            <button key={t} className={`px-4 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wider ${i === 1 ? "bg-[#D21F3C] text-white" : "text-slate-400"}`}>{t}</button>
          ))}
        </div>
      </div>

      <div className="bg-white p-8 md:p-10 rounded-[40px] border border-slate-100 shadow-sm">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-20">
          <div className="space-y-6">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest border-b border-slate-50 pb-4">Revenue Breakdown</p>
            {[["Food Sales", "84.2K", "emerald"], ["Drinks", "18.4K", "emerald"], ["Events", "6.8K", "emerald"]].map(([l, v, c]) => (
              <div key={l} className="flex justify-between items-center">
                <span className="text-slate-900 font-bold text-sm">{l}</span>
                <span className="text-emerald-600 font-black">GH₵ {v}</span>
              </div>
            ))}
          </div>
          <div className="space-y-6">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest border-b border-slate-50 pb-4">Expense Categories</p>
            {[["Cost of Goods", "43.7K", "red"], ["Payroll", "18.2K", "red"], ["Utilities", "8.4K", "red"]].map(([l, v, c]) => (
              <div key={l} className="flex justify-between items-center">
                <span className="text-slate-900 font-bold text-sm">{l}</span>
                <span className="text-[#D21F3C] font-black">GH₵ {v}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="mt-12 p-8 bg-emerald-50 rounded-3xl flex flex-col sm:flex-row justify-between items-center gap-4">
          <div>
            <p className="text-emerald-600 font-bold text-[10px] uppercase tracking-widest mb-1">Net Monthly Profit</p>
            <p className="text-emerald-900 font-black text-4xl tracking-tighter">GH₵ 39,040</p>
          </div>
          <div className="px-6 py-2 bg-emerald-500 text-white rounded-full text-[10px] font-bold uppercase tracking-widest">Growth +12%</div>
        </div>
      </div>
    </div>
  );
}
