"use client";

interface Props { screen: string }

const portfolio = [
  { name: "AuroraPay", sector: "FinTech", region: "East Africa", stage: "Series A", raise: "$2.1M", status: "Active" },
  { name: "Verdant Lace", sector: "Sustainable Fashion", region: "West Africa", stage: "Seed", raise: "$480K", status: "Active" },
  { name: "Helia Health", sector: "HealthTech", region: "Pan-Africa", stage: "Pre-Seed", raise: "$220K", status: "Active" },
  { name: "CivicGrid", sector: "GovTech", region: "Southern Africa", stage: "Seed", raise: "$750K", status: "Exited" },
];

export default function LadyAngelPreview({ screen }: Props) {
  if (screen === "membership") return <Membership />;
  if (screen === "portfolio") return <Portfolio />;
  return <Landing />;
}

function Landing() {
  return (
    <div className="bg-[#fafaf9] min-h-full font-sans overflow-x-hidden">
      <nav className="px-6 py-4 md:px-12 md:py-5 flex items-center justify-between border-b border-stone-200 bg-[#fafaf9]/80 backdrop-blur-md sticky top-0 z-50">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-[#FB7C06] rounded flex items-center justify-center shrink-0">
            <span className="text-white font-black text-[10px] serif">LA</span>
          </div>
          <span className="text-stone-900 font-bold text-sm tracking-tight serif">Lady Angel Network</span>
        </div>
        <div className="hidden md:flex gap-8 items-center text-stone-400 text-xs font-medium uppercase tracking-widest">
          <span>Membership</span>
          <span>Portfolio</span>
          <button className="bg-[#FB7C06] text-white px-5 py-2 rounded font-bold">Apply</button>
        </div>
        <div className="md:hidden text-stone-400">☰</div>
      </nav>

      <div className="px-6 py-16 md:px-12 md:py-24 max-w-4xl mx-auto text-center">
        <p className="text-[#FB7C06] text-[10px] font-bold tracking-[0.2em] uppercase mb-8">
          INVITATION-ONLY · WOMEN-LED CAPITAL
        </p>

        <blockquote className="border-l-2 border-[#FB7C06]/40 pl-6 py-2 mb-10 text-left max-w-lg mx-auto italic text-stone-400 text-sm leading-relaxed">
          "You never change things by fighting the existing reality. To change something, build a new model that makes the existing model obsolete."
          <br />
          <span className="not-italic font-bold text-[10px] uppercase tracking-wider text-stone-300 mt-2 block">— Buckminster Fuller</span>
        </blockquote>

        <h1 className="text-4xl md:text-7xl font-normal text-stone-900 mb-8 tracking-tight leading-[1] serif">
          Making the<br />
          <span className="font-bold text-[#FB7C06]">Existing Model</span><br />
          Obsolete.
        </h1>

        <div className="w-12 h-0.5 bg-[#FB7C06] mx-auto mb-10" />

        <p className="text-stone-500 text-base md:text-lg leading-relaxed max-w-2xl mx-auto mb-12">
          A private investment network where women deploy capital into women-led ventures across Africa.
        </p>

        <div className="bg-[#FB7C06]/5 border border-[#FB7C06]/10 rounded-2xl p-6 md:p-8 max-w-lg mx-auto mb-16 grid grid-cols-2 gap-x-8 gap-y-4 text-left">
          <div className="text-stone-300 text-[10px] font-bold uppercase tracking-widest border-b border-[#FB7C06]/10 pb-2">Legacy VC</div>
          <div className="text-[#FB7C06] text-[10px] font-bold uppercase tracking-widest border-b border-[#FB7C06]/10 pb-2">LAN</div>
          
          <div className="text-stone-300 text-xs line-through">Male-dominated</div>
          <div className="text-stone-700 text-xs font-bold">Women-led capital</div>
          
          <div className="text-stone-300 text-xs line-through">Opaque deal flow</div>
          <div className="text-stone-700 text-xs font-bold">Structured pipeline</div>
        </div>

        <div className="flex flex-col sm:flex-row justify-center gap-4 mb-12">
          <button className="bg-[#FB7C06] text-white px-8 py-4 rounded font-bold text-sm shadow-xl shadow-[#FB7C06]/20">Request Invitation</button>
          <button className="bg-white border border-stone-200 text-stone-600 px-8 py-4 rounded font-bold text-sm">View Portfolio</button>
        </div>

        <div className="flex items-center justify-center gap-3">
          <div className="flex -space-x-2">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="w-8 h-8 rounded-full border-2 border-[#fafaf9] bg-stone-200" />
            ))}
          </div>
          <span className="text-stone-400 text-xs font-medium">Join 120+ aligned investors</span>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 border-y border-stone-200 bg-stone-50/50">
        {[["120+", "Members"], ["5", "Models"], ["Pan-African", "Portfolio"], ["$12M+", "Deployed"]].map(([v, l], i) => (
          <div key={l} className={`p-8 text-center ${i < 3 ? "md:border-r border-stone-200" : ""} ${i === 1 ? "border-r border-stone-200 md:border-r-0" : ""}`}>
            <p className="text-[#FB7C06] text-3xl font-bold serif mb-1">{v}</p>
            <p className="text-stone-400 text-[10px] font-bold uppercase tracking-widest">{l}</p>
          </div>
        ))}
      </div>

      <div className="px-8 py-16 md:px-12 md:py-24 max-w-6xl mx-auto">
        <p className="text-[#FB7C06] text-[10px] font-bold tracking-widest mb-4 uppercase">The Framework</p>
        <h2 className="text-3xl md:text-5xl font-normal text-stone-900 mb-16 serif">Nurture. Connect. Invest.</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {[
            ["Nurture", "Mentorship bootcamps and investment education for new members.", "🌱"],
            ["Connect", "Introductions to co-investors and deal partners across West Africa.", "🤝"],
            ["Invest", "Structured capital deployment via five investment models.", "💎"],
          ].map(([t, d, i]) => (
            <div key={t as string} className="border-t-2 border-[#FB7C06] pt-8">
              <div className="text-4xl mb-6">{i}</div>
              <p className="text-stone-900 font-bold text-lg mb-4">{t}</p>
              <p className="text-stone-500 text-sm leading-relaxed">{d}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function Membership() {
  return (
    <div className="bg-[#fafaf9] min-h-full font-sans p-8 md:p-12">
      <p className="text-[#FB7C06] text-[10px] font-bold tracking-widest mb-4 uppercase">Membership</p>
      <h2 className="text-3xl md:text-5xl font-normal text-stone-900 mb-12 serif">Invitation Only.</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {[
          { title: "Who we invite", items: ["Women with investable capital (min. $5K)", "Professionals in finance, law, and tech", "Entrepreneurs with current ventures"] },
          { title: "Member benefits", items: ["Vetted, women-led deal flow", "Structured investment models", "Mentorship and peer community"] }
        ].map(section => (
          <div key={section.title} className="bg-orange-50/50 border border-orange-100 rounded-3xl p-8">
            <p className="text-orange-900 font-bold text-sm mb-6 uppercase tracking-wider">{section.title}</p>
            <div className="space-y-4">
              {section.items.map(item => (
                <div key={item} className="flex gap-4">
                  <span className="text-[#FB7C06] font-bold">✓</span>
                  <span className="text-stone-600 text-sm leading-relaxed">{item}</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="bg-orange-50 border border-orange-100 rounded-2xl p-6 text-center">
        <p className="text-orange-900 font-bold text-xs mb-1">New cohort opens Q3 2026</p>
        <p className="text-orange-400 text-[10px] uppercase tracking-widest">Currently supporting 120+ active investors</p>
      </div>
    </div>
  );
}

function Portfolio() {
  return (
    <div className="bg-[#fafaf9] min-h-full font-sans p-8 md:p-12">
      <p className="text-[#FB7C06] text-[10px] font-bold tracking-widest mb-4 uppercase">Portfolio</p>
      <h2 className="text-3xl md:text-5xl font-normal text-stone-900 mb-4 serif">Women-Led Ventures</h2>
      <p className="text-stone-400 text-sm mb-12">5 active investments across FinTech, HealthTech, and Fashion.</p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-12">
        {portfolio.map(p => (
          <div key={p.name} className="bg-white border border-stone-100 rounded-2xl p-5 flex items-center gap-5 shadow-sm">
            <div className="w-12 h-12 bg-[#FB7C06] rounded-xl flex items-center justify-center font-black text-white text-xl shrink-0 serif">{p.name[0]}</div>
            <div className="min-w-0">
              <div className="flex items-center gap-3 mb-1">
                <span className="text-stone-900 font-bold text-sm truncate">{p.name}</span>
                <span className={`px-2 py-0.5 rounded-full text-[8px] font-bold uppercase tracking-wider ${p.status === "Exited" ? "bg-emerald-100 text-emerald-600" : "bg-orange-100 text-orange-600"}`}>{p.status}</span>
              </div>
              <p className="text-stone-400 text-[10px] font-bold uppercase tracking-widest truncate">{p.sector} • {p.region}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[["$12M+", "Deployed"], ["4.2x", "Avg ROI"], ["Global", "Reach"]].map(([v, l]) => (
          <div key={l} className="bg-orange-50/50 border border-orange-100 rounded-2xl p-6 text-center">
            <p className="text-[#FB7C06] text-2xl font-bold serif mb-1">{v}</p>
            <p className="text-stone-400 text-[10px] font-bold uppercase tracking-widest">{l}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
