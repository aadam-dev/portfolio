"use client";

interface Props { screen: string }

const featured = [
  { name: "Jollof Rice", subtitle: "With grilled or fried chicken", price: "GH₵ 40 - 65", tag: "Bestseller" },
  { name: "Asian Fried Rice", subtitle: "With grilled or fried chicken", price: "GH₵ 40 - 65", tag: "Popular" },
  { name: "Fufu", subtitle: "Meat / goat light soup", price: "GH₵ 50 - 60", tag: "Classic" },
];

const foodMenu = [
  { name: "Jollof Rice", desc: "With grilled or fried chicken.", prices: ["Small GH₵ 40", "Medium GH₵ 55", "Large GH₵ 65"] },
  { name: "Asian Fried Rice", desc: "With grilled or fried chicken.", prices: ["Small GH₵ 40", "Medium GH₵ 55", "Large GH₵ 65"] },
  { name: "Fries with Chicken", desc: "Crispy potato fries with fried chicken.", prices: ["Regular GH₵ 60"] },
  { name: "Banku", desc: "With okro stew or groundnut soup.", prices: ["Medium GH₵ 40", "Large GH₵ 50"] },
];

export default function JirehPreview({ screen }: Props) {
  if (screen === "menu") return <MenuScreen />;
  if (screen === "contact") return <ContactScreen />;
  return <LandingScreen />;
}

function LandingScreen() {
  return (
    <div className="bg-[#070b12] min-h-full font-sans text-white overflow-x-hidden">
      <nav className="px-6 py-4 md:px-10 md:py-5 flex items-center justify-between border-b border-white/5 bg-[#070b12]/90 sticky top-0 z-50 backdrop-blur-md">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-lime-500 rounded flex items-center justify-center font-black text-slate-900 text-xs shadow-lg shadow-lime-500/20">JN</div>
          <span className="text-white font-black text-sm block leading-tight tracking-tight hidden sm:block">Jireh Natural Foods</span>
        </div>
        <div className="hidden md:flex gap-8 items-center text-white/40 text-[11px] font-bold uppercase tracking-widest">
          <span>Menu</span>
          <span>Visit</span>
          <button className="bg-lime-500/10 border border-lime-500/20 text-lime-400 px-4 py-1.5 rounded-full font-black">WhatsApp Order</button>
        </div>
        <div className="md:hidden text-white/40">☰</div>
      </nav>

      <div className="bg-gradient-to-b from-[#0b1220] to-[#070b12] px-6 py-12 md:px-12 md:py-20 text-center md:text-left border-b border-white/5">
        <div className="max-w-4xl mx-auto md:mx-0">
          <p className="text-lime-400 text-[10px] font-black tracking-[0.2em] mb-4 uppercase">Pure. Honest. Delicious.</p>
          <h1 className="text-4xl md:text-7xl font-black text-white mb-6 tracking-tighter leading-[1] uppercase">
            Authentic Ghanaian meals,<br />
            <span className="text-lime-500 italic">naturally prepared.</span>
          </h1>
          <p className="text-white/50 text-base md:text-lg leading-relaxed max-w-xl mb-10 mx-auto md:mx-0 font-medium">
            Home-style dishes built around natural ingredients, fast pickup, and simple ordering.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 mb-10 justify-center md:justify-start">
            <button className="bg-lime-500 text-slate-900 px-8 py-4 rounded-full font-black text-sm shadow-xl shadow-lime-500/20">Order via WhatsApp</button>
            <button className="bg-white/5 border border-white/10 text-white px-8 py-4 rounded-full font-black text-sm">Bolt Food</button>
          </div>
          <div className="inline-flex items-center gap-3 bg-white/5 border border-white/10 px-4 py-2 rounded-full">
            <span className="text-yellow-400 font-black text-xs">★ 4.3</span>
            <span className="text-white/60 text-[10px] font-bold uppercase tracking-widest">Bolt Food Favourite</span>
          </div>
        </div>
      </div>

      <div className="p-6 md:p-12">
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
          {[["11am - 8pm", "Mon - Sat"], ["100%", "No MSG"], ["Fast", "Delivery"]].map(([v, l]) => (
            <div key={v} className="bg-white/5 border border-white/10 p-6 rounded-3xl text-center">
              <p className="text-white font-black text-xl mb-1">{v}</p>
              <p className="text-white/30 text-[9px] font-bold uppercase tracking-widest">{l}</p>
            </div>
          ))}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            ["Natural Ingredients", "Fresh produce and quality proteins."],
            ["Cooked with Care", "Home-style prep for rich taste."],
            ["Friendly Service", "Direct ordering and local support."]
          ].map(([t, b]) => (
            <div key={t} className="bg-white/5 border border-white/10 p-6 rounded-3xl">
              <p className="text-lime-500 font-black text-sm mb-3 uppercase tracking-tighter">{t}</p>
              <p className="text-white/40 text-xs leading-relaxed font-medium">{b}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function MenuScreen() {
  return (
    <div className="bg-[#070b12] min-h-full font-sans text-white p-6 md:p-12">
      <div className="mb-10">
        <p className="text-lime-400 text-[10px] font-black tracking-widest mb-4 uppercase">Full Menu</p>
        <h2 className="text-3xl md:text-5xl font-black uppercase tracking-tighter">Wholesome Meals</h2>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-10">
        {featured.map(item => (
          <div key={item.name} className="bg-white/5 border border-white/10 p-6 rounded-3xl">
            <div className="flex justify-between items-start mb-6">
              <span className="bg-lime-500/20 text-lime-400 text-[9px] font-black uppercase px-3 py-1 rounded-full">{item.tag}</span>
              <span className="text-lime-500 font-black text-sm">{item.price.split("-")[0]}</span>
            </div>
            <p className="text-white font-black text-lg mb-1 leading-none">{item.name}</p>
            <p className="text-white/30 text-xs font-medium">{item.subtitle}</p>
          </div>
        ))}
      </div>

      <div className="bg-black/20 border border-white/10 rounded-3xl p-6 md:p-10 space-y-2">
        {foodMenu.map((item, i) => (
          <div key={item.name} className={`py-6 ${i < foodMenu.length - 1 ? "border-b border-white/5" : ""}`}>
            <p className="text-white font-black text-lg mb-2">{item.name}</p>
            <p className="text-white/40 text-xs mb-6 font-medium">{item.desc}</p>
            <div className="flex flex-wrap gap-2">
              {item.prices.map(p => (
                <span key={p} className="bg-lime-500/10 text-lime-400 text-[10px] font-black uppercase px-4 py-1.5 rounded-full border border-lime-500/20">{p}</span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function ContactScreen() {
  return (
    <div className="bg-[#070b12] min-h-full font-sans text-white p-6 md:p-12">
      <h2 className="text-3xl md:text-5xl font-black uppercase tracking-tighter mb-12">Contact & Visit</h2>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white/5 border border-white/10 p-8 rounded-[40px] space-y-8">
          <p className="text-lime-400 text-[10px] font-black uppercase tracking-[0.2em]">Quick Actions</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[["Call Now", "+233 55 113 3481"], ["WhatsApp", "Direct Order"], ["Bolt Food", "Delivery"], ["Visit Us", "Adenta Housing"]].map(([t, s]) => (
              <div key={t} className="bg-black/40 border border-white/5 p-5 rounded-2xl hover:border-lime-500/50 transition-colors cursor-pointer">
                <p className="text-white font-black text-sm mb-1 uppercase tracking-tighter">{t}</p>
                <p className="text-white/30 text-[10px] font-bold uppercase tracking-widest">{s}</p>
              </div>
            ))}
          </div>
        </div>
        <div className="bg-lime-500 p-8 md:p-12 rounded-[40px] text-slate-900">
          <p className="text-slate-900/40 text-[10px] font-black uppercase tracking-[0.2em] mb-6">Social Handles</p>
          <div className="space-y-4">
            {["TikTok: @jirehnaturalfoods", "Instagram: @jirehnaturalfoods", "Facebook: @jirehnaturalfoods"].map(s => (
              <p key={s} className="text-2xl font-black uppercase tracking-tighter">{s}</p>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
