"use client";

interface Props { screen: string }

export default function ChaleSocksPreview({ screen }: Props) {
  if (screen === "story") return <Story />;
  return <Landing />;
}

function Landing() {
  return (
    <div className="bg-[#050505] min-h-full font-serif text-white overflow-x-hidden">
      <nav className="px-6 py-6 md:px-12 md:py-8 flex items-center justify-between border-b border-white/5 bg-[#050505]/80 backdrop-blur-xl sticky top-0 z-50">
        <div className="text-sm md:text-lg font-black tracking-[0.3em] uppercase">Chalé Socks</div>
        <div className="hidden lg:flex gap-12 items-center text-[10px] font-bold tracking-[0.2em] uppercase text-white/40">
          <span>Styles</span>
          <span>Gifts</span>
          <span>Gye Nyame</span>
          <button className="text-white/80 border-l border-white/10 pl-12 flex items-center gap-4">
            <span>🇬🇭 GHS</span>
            <div className="relative">
              <span>Cart</span>
              <span className="absolute -top-3 -right-4 bg-red-600 text-white text-[8px] px-1.5 py-0.5 rounded-full">0</span>
            </div>
          </button>
        </div>
        <div className="lg:hidden text-white/40">☰</div>
      </nav>

      <div className="px-6 py-16 md:px-20 md:py-32 flex flex-col lg:flex-row items-center gap-16 md:gap-24 max-w-7xl mx-auto">
        <div className="flex-1 text-center lg:text-left">
          <p className="text-[#C59E47] text-[10px] font-black tracking-[0.4em] mb-10 uppercase">Afro-Luxury Essentials</p>
          <h1 className="text-5xl md:text-9xl font-normal leading-[0.9] tracking-tighter mb-12">
            Elevate<br />
            <span className="italic">your sole.</span>
          </h1>
          <p className="text-white/40 text-sm md:text-lg leading-relaxed max-w-md mb-16 mx-auto lg:mx-0 font-light">
            Meticulously crafted footwear inspired by West African heritage and contemporary global style.
          </p>
          <button className="bg-white text-black px-12 py-5 font-bold text-[10px] tracking-[0.2em] uppercase hover:bg-[#C59E47] hover:text-white transition-colors">Shop the Collection</button>
        </div>
        <div className="flex-1 w-full max-w-xl aspect-square bg-[#111] rounded-[40px] overflow-hidden relative group shadow-2xl">
           <div className="absolute inset-0 bg-[url('https://chalesocks.vercel.app/images/hero.jpg')] bg-cover bg-center group-hover:scale-105 transition-transform duration-700" />
           <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
           <div className="absolute bottom-10 left-10">
              <p className="text-white font-black text-xs tracking-widest uppercase mb-1">Kente Series</p>
              <p className="text-white/40 text-[9px] font-bold uppercase tracking-widest">Limited Edition · 2024</p>
           </div>
        </div>
      </div>

      <div className="bg-[#C59E47] py-4 overflow-hidden relative whitespace-nowrap">
        <div className="flex animate-marquee gap-10 items-center">
          {[1,2,3,4,5].map(i => (
            <span key={i} className="text-black font-black text-xs md:text-sm tracking-[0.3em] uppercase shrink-0">Authentic · Vibrant · African ·</span>
          ))}
        </div>
      </div>
    </div>
  );
}

function Story() {
  return (
    <div className="bg-[#050505] min-h-full font-serif text-white p-8 md:p-24">
      <div className="max-w-4xl mx-auto">
        <p className="text-[#C59E47] text-[10px] font-black tracking-[0.4em] mb-6 uppercase text-center">Our Heritage</p>
        <h2 className="text-4xl md:text-7xl font-normal tracking-tight text-center mb-20 leading-tight">The Chale Story</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {[
            { t: "Chalé means buddy or friend.", i: "https://chalesocks.vercel.app/images/story-1.jpg" },
            { t: "Inspired by creative exploits.", i: "https://chalesocks.vercel.app/images/story-2.jpg" }
          ].map((s, i) => (
            <div key={i} className="group relative aspect-[3/4] rounded-[40px] overflow-hidden">
              <div className="absolute inset-0 bg-white/5 group-hover:bg-white/10 transition-colors" />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent z-10" />
              <div className="absolute bottom-12 left-8 right-8 z-20">
                <p className="text-2xl md:text-3xl font-normal leading-tight group-hover:translate-y-[-10px] transition-transform">{s.t}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
