"use client";

interface Props { screen: string }

export default function RedrowPreview({ screen }: Props) {
  if (screen === "shop") return <Shop />;
  return <Landing />;
}

function Landing() {
  return (
    <div className="bg-[#F8F9FA] min-h-full font-sans text-slate-900 overflow-x-hidden">
      <nav className="px-6 py-4 md:px-12 md:py-6 flex items-center justify-between border-b border-slate-100 bg-white/80 sticky top-0 z-50 backdrop-blur-md">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-emerald-600 rounded-xl flex items-center justify-center text-white text-xl shadow-lg shadow-emerald-600/20">🥦</div>
          <span className="font-black text-sm md:text-lg tracking-tighter uppercase leading-none">Redrow Minimart</span>
        </div>
        <div className="hidden lg:flex gap-10 items-center text-slate-400 text-[10px] font-bold uppercase tracking-widest">
          <span className="text-emerald-600">Home</span>
          <span>Shop</span>
          <span>About</span>
          <div className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center text-slate-900 cursor-pointer">🛒</div>
        </div>
        <div className="lg:hidden text-slate-400">☰</div>
      </nav>

      <div className="px-6 py-12 md:px-12 md:py-24 flex flex-col lg:flex-row items-center gap-16 lg:gap-24 max-w-7xl mx-auto">
        <div className="flex-1 text-center lg:text-left order-2 lg:order-1">
          <div className="inline-block bg-white border border-slate-200 px-4 py-1.5 rounded-full text-[9px] font-black tracking-[0.2em] mb-8 uppercase text-emerald-600">
            Premium Minimart Experience
          </div>
          <h1 className="text-5xl md:text-8xl font-black mb-8 tracking-tighter leading-[0.9] uppercase">
            Your daily<br />
            <span className="bg-gradient-to-r from-emerald-500 to-emerald-700 bg-clip-text text-transparent italic">essentials</span><br />
            elevated.
          </h1>
          <p className="text-slate-500 text-base md:text-lg leading-relaxed mb-12 max-w-md mx-auto lg:mx-0 font-medium">
            Convenience redefined. From organic produce to household needs, we bring Redrow Estate&apos;s best to your doorstep.
          </p>
          <div className="flex flex-col sm:flex-row justify-center lg:justify-start gap-4">
            <button className="bg-emerald-600 text-white px-10 py-5 rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-emerald-600/20">Shop Groceries</button>
            <button className="bg-white border border-slate-200 text-slate-900 px-10 py-5 rounded-2xl font-black text-xs uppercase tracking-widest">Directions</button>
          </div>
        </div>

        <div className="flex-1 w-full max-w-xl relative aspect-square order-1 lg:order-2">
          <div className="absolute inset-0 bg-white rounded-[60px] shadow-2xl border border-slate-50 transform rotate-3" />
          <div className="relative h-full w-full flex items-center justify-center">
             <div className="absolute top-[15%] left-0 bg-white p-6 rounded-3xl shadow-xl border border-slate-50 flex items-center gap-4 animate-bounce-slow">
               <div className="w-12 h-12 bg-emerald-50 rounded-2xl flex items-center justify-center text-2xl">⚡️</div>
               <div>
                 <p className="text-[9px] text-slate-400 font-black uppercase tracking-widest mb-1">Delivery</p>
                 <p className="font-black text-lg">15 - 25 Mins</p>
               </div>
             </div>
             <div className="absolute bottom-[20%] right-0 bg-white p-6 rounded-3xl shadow-xl border border-slate-50 flex items-center gap-4 transform -rotate-2">
               <div className="w-12 h-12 bg-amber-50 rounded-2xl flex items-center justify-center text-2xl">🛡️</div>
               <div>
                 <p className="text-[9px] text-slate-400 font-black uppercase tracking-widest mb-1">Quality</p>
                 <p className="font-black text-lg">100% Organic</p>
               </div>
             </div>
             <div className="text-[120px]">🍎</div>
          </div>
        </div>
      </div>

      <div className="px-6 py-12 bg-white border-t border-slate-100 overflow-hidden">
        <div className="flex flex-wrap justify-center gap-12 md:gap-24">
          {[{ i: "🍃", t: "Always Fresh" }, { i: "⚡️", t: "Fast Delivery" }, { i: "🛡️", t: "Quality Guaranteed" }].map(f => (
            <div key={f.t} className="flex items-center gap-4">
              <span className="text-2xl">{f.i}</span>
              <span className="text-[10px] font-black tracking-[0.2em] text-slate-900 uppercase">{f.t}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function Shop() {
  return (
    <div className="bg-white min-h-full font-sans p-8 md:p-16">
       <div className="mb-12">
         <p className="text-emerald-600 text-[10px] font-black tracking-widest mb-4 uppercase">Catalog</p>
         <h2 className="text-3xl md:text-5xl font-black uppercase tracking-tighter">Fresh Selection</h2>
       </div>
       <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
         {[
           { n: "Organic Avocados", p: "12.00", i: "🥑" },
           { n: "Fresh Milk", p: "18.00", i: "🥛" },
           { n: "Whole Wheat", p: "15.00", i: "🍞" },
           { n: "Golden Apples", p: "25.00", i: "🍎" }
         ].map(item => (
           <div key={item.n} className="bg-slate-50 p-8 rounded-[40px] hover:bg-emerald-50 transition-colors group">
             <div className="w-full aspect-square bg-white rounded-3xl mb-8 flex items-center justify-center text-5xl shadow-sm group-hover:scale-110 transition-transform">
               {item.i}
             </div>
             <p className="text-xs font-black uppercase mb-1 tracking-tight">{item.n}</p>
             <p className="text-sm font-black text-emerald-600">GHS {item.p}</p>
           </div>
         ))}
       </div>
    </div>
  );
}
