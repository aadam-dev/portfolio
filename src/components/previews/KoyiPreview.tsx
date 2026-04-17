"use client";

interface Props { screen: string }

const coursesLabel = [
  { title: "WASSCE Core Mathematics", cat: "WASSCE", students: 3840, duration: "48h", level: "SHS", color: "#0d9488" },
  { title: "BECE Integrated Science", cat: "BECE", students: 2910, duration: "32h", level: "JHS", color: "#059669" },
  { title: "SHS Elective Chemistry", cat: "WASSCE", students: 1650, duration: "40h", level: "SHS", color: "#0d9488" },
];

const pathways = [
  { label: "WASSCE", desc: "Secondary Certificate", icon: "🏫", color: "#0d9488", bg: "#f0fdfa", count: "120+ courses" },
  { label: "BECE", desc: "Basic Education", icon: "📚", color: "#059669", bg: "#f0fdf4", count: "80+ courses" },
  { label: "University", desc: "Degree-level", icon: "🎓", color: "#2563EB", bg: "#eff6ff", count: "60+ courses" },
];

export default function KoyiPreview({ screen }: Props) {
  if (screen === "courses") return <Courses />;
  if (screen === "lesson") return <Lesson />;
  if (screen === "dashboard") return <Dashboard />;
  return <Landing />;
}

function Landing() {
  return (
    <div className="bg-white min-h-full font-sans overflow-x-hidden">
      <nav className="px-6 py-4 md:px-8 border-b flex items-center justify-between sticky top-0 z-50 bg-white/90 backdrop-blur-md">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-teal-600 flex items-center justify-center font-black text-white text-sm">K</div>
          <span className="text-teal-900 font-extrabold text-xl tracking-tight">Kōyi</span>
        </div>
        <div className="hidden md:flex gap-6 items-center text-slate-500 text-[11px] font-bold uppercase tracking-widest">
          <span>Courses</span>
          <span>Academy</span>
          <button className="bg-teal-600 text-white px-5 py-2 rounded-lg font-black">Get Started</button>
        </div>
        <div className="md:hidden text-teal-600">☰</div>
      </nav>

      <div className="bg-teal-700 px-6 py-16 md:px-12 md:py-24 text-center text-white">
        <div className="inline-block bg-white/20 px-4 py-1.5 rounded-full text-[10px] font-black mb-8 uppercase tracking-widest">🎓 Built for Africa</div>
        <h1 className="text-5xl md:text-8xl font-black mb-8 tracking-tighter leading-[0.95] uppercase">
          Learn anything,<br />
          <span className="italic opacity-80">anywhere.</span>
        </h1>
        <p className="text-white/70 text-base md:text-lg leading-relaxed max-w-xl mx-auto mb-12 font-medium">
          Ghana&apos;s LMS for WASSCE, BECE, and career development. Video streaming, offline access, and certificates.
        </p>
        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <button className="bg-white text-teal-700 px-8 py-4 rounded-2xl font-black text-sm uppercase tracking-widest">Browse Courses</button>
          <button className="bg-teal-800 text-white border border-white/10 px-8 py-4 rounded-2xl font-black text-sm uppercase tracking-widest">Register</button>
        </div>
      </div>

      <div className="grid grid-cols-3 border-b bg-teal-50/50">
        {[["18K+", "Students"], ["420+", "Courses"], ["4", "Pathways"]].map(([v, l], i) => (
          <div key={l} className={`p-8 text-center ${i < 2 ? "border-r border-teal-100" : ""}`}>
            <p className="text-teal-700 text-3xl font-black mb-1">{v}</p>
            <p className="text-teal-600/40 text-[9px] font-bold uppercase tracking-widest">{l}</p>
          </div>
        ))}
      </div>

      <div className="p-8 md:p-16 max-w-7xl mx-auto">
        <div className="mb-12">
          <p className="text-teal-600 text-[10px] font-black tracking-widest mb-4 uppercase">Academic pathways</p>
          <h2 className="text-3xl md:text-5xl font-black text-slate-900 uppercase tracking-tighter">Your learning journey</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-20">
          {pathways.map(p => (
            <div key={p.label} className="p-10 rounded-[40px] border shadow-sm transition-all hover:shadow-xl" style={{ background: p.bg, borderColor: `${p.color}20` }}>
              <div className="text-4xl mb-8">{p.icon}</div>
              <p className="font-black text-2xl text-slate-900 mb-2">{p.label}</p>
              <p className="text-slate-500 text-sm mb-10 font-medium leading-relaxed">{p.desc}</p>
              <span className="text-xs font-black uppercase tracking-widest" style={{ color: p.color }}>{p.count} →</span>
            </div>
          ))}
        </div>
        
        <div className="mb-12">
          <p className="text-teal-600 text-[10px] font-black tracking-widest mb-4 uppercase">Trending</p>
          <h2 className="text-3xl md:text-5xl font-black text-slate-900 uppercase tracking-tighter">Popular Courses</h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {coursesLabel.map(c => (
            <div key={c.title} className="bg-white border border-slate-100 rounded-[32px] overflow-hidden group hover:shadow-xl transition-all">
              <div className="h-40 flex items-center justify-center text-4xl group-hover:scale-110 transition-transform" style={{ background: `${c.color}05` }}>📖</div>
              <div className="p-8">
                <span className="text-[9px] font-black px-3 py-1 rounded-full uppercase tracking-widest" style={{ background: `${c.color}10`, color: c.color }}>{c.cat}</span>
                <p className="font-black text-lg mt-4 mb-2 leading-tight uppercase">{c.title}</p>
                <div className="flex justify-between items-center pt-6 border-t border-slate-50">
                   <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{c.students.toLocaleString()} Students</p>
                   <span className="text-teal-600 font-black text-xs">→</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function Courses() {
  return (
    <div className="bg-white min-h-full font-sans p-8 md:p-12">
      <div className="mb-10">
        <p className="text-teal-600 text-[10px] font-black tracking-widest mb-4 uppercase">Catalog</p>
        <h2 className="text-3xl md:text-5xl font-black text-slate-900 uppercase tracking-tighter">All Courses</h2>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {coursesLabel.concat(coursesLabel).map((c, i) => (
          <div key={i} className="flex bg-slate-50 border border-slate-100 rounded-3xl overflow-hidden hover:bg-teal-50/30 transition-colors">
            <div className="w-24 bg-white border-r border-slate-100 flex items-center justify-center flex-shrink-0 text-3xl">📖</div>
            <div className="p-6">
              <p className="font-black text-slate-900 text-sm mb-1 uppercase tracking-tight">{c.title}</p>
              <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest">{c.level} • {c.duration}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function Lesson() {
  return (
    <div className="flex flex-col lg:flex-row min-h-full bg-slate-50 font-sans">
      <div className="w-full lg:w-80 bg-white border-b lg:border-r p-8 shrink-0">
        <p className="text-[10px] font-black text-slate-400 mb-8 uppercase tracking-widest">WASSCE Core Maths</p>
        <div className="space-y-3">
          {["Introduction", "Algebra", "Quadratic Functions"].map((l, i) => (
            <div key={i} className={`p-4 rounded-2xl text-sm transition-all cursor-pointer ${i === 2 ? "bg-teal-600 text-white font-black shadow-lg shadow-teal-600/20" : "text-slate-500 font-bold hover:bg-slate-50"}`}>{l}</div>
          ))}
        </div>
      </div>
      <div className="flex-1 p-6 md:p-12 max-w-5xl">
        <div className="bg-slate-900 aspect-video rounded-[40px] flex items-center justify-center mb-10 shadow-2xl relative overflow-hidden group">
          <div className="absolute inset-0 bg-teal-600/20 opacity-0 group-hover:opacity-100 transition-opacity" />
          <div className="w-20 h-20 bg-teal-600 rounded-full flex items-center justify-center text-white pl-2 text-3xl shadow-2xl transform group-hover:scale-110 transition-transform">▶</div>
        </div>
        <div className="mb-12">
          <h2 className="text-3xl md:text-5xl font-black text-slate-900 uppercase tracking-tighter mb-4 leading-none">Quadratic Functions</h2>
          <p className="text-slate-500 text-base md:text-lg leading-relaxed font-medium">Master factorisation and the quadratic formula with real WASSCE exam-style questions.</p>
        </div>
        <div className="bg-white border border-slate-100 p-8 rounded-[40px]">
          <p className="text-slate-900 font-black text-sm mb-8 uppercase tracking-widest">Lesson Resources</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {["PDF Notes", "Practice Quiz", "Formula Sheet"].map(r => (
              <div key={r} className="bg-slate-50 p-5 rounded-2xl flex items-center gap-4 hover:bg-teal-50 transition-colors cursor-pointer">
                <span className="text-xl">📎</span>
                <span className="text-slate-900 font-black text-xs uppercase tracking-widest">{r}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function Dashboard() {
  return (
    <div className="bg-slate-50 min-h-full font-sans p-6 md:p-12">
      <div className="flex items-center justify-between mb-12">
        <div>
          <h1 className="text-3xl font-black text-slate-900 uppercase tracking-tighter">My Academy</h1>
          <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest mt-1">Academic Year 2025/26</p>
        </div>
        <div className="w-12 h-12 bg-teal-600 rounded-2xl shadow-xl shadow-teal-600/20" />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-12">
        {[["3", "Enrolled", "📚"], ["1", "Certs", "🏆"], ["5", "Streak", "🔥"]].map(([v, l, i]) => (
          <div key={l} className="bg-white p-10 rounded-[40px] border border-slate-100 text-center shadow-sm">
            <div className="text-4xl mb-4">{i}</div>
            <div className="text-4xl font-black text-teal-600 mb-1">{v}</div>
            <div className="text-[10px] text-slate-400 uppercase font-black tracking-[0.2em]">{l}</div>
          </div>
        ))}
      </div>
      <div className="bg-teal-700 p-10 rounded-[40px] text-white flex flex-col md:flex-row items-center justify-between gap-8">
        <div>
          <p className="text-white/40 text-[10px] font-black uppercase tracking-widest mb-2">Continue Learning</p>
          <p className="text-2xl font-black uppercase tracking-tight">WASSCE Core Mathematics</p>
        </div>
        <button className="bg-white text-teal-700 px-10 py-4 rounded-2xl font-black text-sm uppercase tracking-widest">Resume</button>
      </div>
    </div>
  );
}
