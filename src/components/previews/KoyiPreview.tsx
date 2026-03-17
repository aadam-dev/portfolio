"use client";

interface Props { screen: string }

const courses = [
  { title: "WASSCE Core Mathematics", cat: "WASSCE", students: 3840, duration: "48h", level: "SHS", color: "#0d9488" },
  { title: "BECE Integrated Science", cat: "BECE", students: 2910, duration: "32h", level: "JHS", color: "#059669" },
  { title: "SHS Elective Chemistry", cat: "WASSCE", students: 1650, duration: "40h", level: "SHS", color: "#0d9488" },
  { title: "University Bridging — Maths", cat: "University", students: 1120, duration: "24h", level: "Tertiary", color: "#2563EB" },
  { title: "BECE English Language", cat: "BECE", students: 2240, duration: "28h", level: "JHS", color: "#059669" },
  { title: "Career Skills: MS Excel", cat: "Career", students: 890, duration: "16h", level: "Professional", color: "#D97706" },
];

const pathways = [
  { label: "WASSCE", desc: "Senior Secondary Certificate", icon: "🏫", color: "#0d9488", bg: "#f0fdfa", count: "120+ courses" },
  { label: "BECE", desc: "Basic Education Certificate", icon: "📚", color: "#059669", bg: "#f0fdf4", count: "80+ courses" },
  { label: "University", desc: "Bridging & degree-level", icon: "🎓", color: "#2563EB", bg: "#eff6ff", count: "60+ courses" },
  { label: "Career", desc: "Professional certifications", icon: "💼", color: "#D97706", bg: "#fffbeb", count: "90+ courses" },
];

export default function KoyiPreview({ screen }: Props) {
  if (screen === "courses") return <Courses />;
  if (screen === "lesson") return <Lesson />;
  if (screen === "dashboard") return <Dashboard />;
  return <Landing />;
}

function Landing() {
  return (
    <div style={{ background: "#fff", minHeight: "100%", fontFamily: "system-ui, sans-serif" }}>
      <nav style={{ padding: "14px 32px", display: "flex", alignItems: "center", justifyContent: "space-between", borderBottom: "1px solid #e5e7eb" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          {/* Exact Kōyi logo: teal gradient K mark + wordmark (matches real app) */}
          <div style={{ width: 32, height: 32, borderRadius: 8, background: "linear-gradient(135deg, #14b8a6 0%, #0d9488 50%, #0f766e 100%)", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <span style={{ color: "#fff", fontWeight: 800, fontSize: 14 }}>K</span>
          </div>
          <span style={{ color: "#0f766e", fontWeight: 800, fontSize: 20, letterSpacing: "-0.02em" }}>Kōyi</span>
        </div>
        <div style={{ display: "flex", gap: 24, alignItems: "center" }}>
          {["Courses", "Academy", "Dashboard"].map(l => (
            <span key={l} style={{ color: "#6b7280", fontSize: 13, cursor: "pointer" }}>{l}</span>
          ))}
          <button style={{ background: "#0d9488", color: "#fff", padding: "8px 18px", borderRadius: 8, fontSize: 13, fontWeight: 600, border: "none", cursor: "pointer" }}>
            Get Started
          </button>
        </div>
      </nav>

      <div style={{ background: "linear-gradient(135deg, #0f766e 0%, #0d9488 50%, #10b981 100%)", padding: "56px 32px 48px" }}>
        <div style={{ maxWidth: 680, margin: "0 auto", textAlign: "center" }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 6, background: "rgba(255,255,255,0.15)", borderRadius: 100, padding: "5px 14px", marginBottom: 22 }}>
            <span style={{ color: "#fff", fontSize: 11, fontWeight: 500 }}>🎓 Built for Ghana & Africa</span>
          </div>
          <h1 style={{ color: "#fff", fontSize: 44, fontWeight: 800, letterSpacing: "-0.03em", lineHeight: 1.1, margin: "0 0 16px" }}>
            Learn Anything,<br />Anywhere
          </h1>
          <p style={{ color: "rgba(255,255,255,0.85)", fontSize: 15, lineHeight: 1.7, margin: "0 0 28px" }}>
            Ghana's LMS for WASSCE, BECE, university bridging, and career development. Multilingual (EN/FR/AR), video streaming, and certificate-issuing.
          </p>
          <div style={{ display: "flex", gap: 12, justifyContent: "center" }}>
            <button style={{ background: "#fff", color: "#0d9488", padding: "12px 24px", borderRadius: 10, fontSize: 13, fontWeight: 700, border: "none", cursor: "pointer" }}>
              Browse Courses
            </button>
            <button style={{ background: "rgba(255,255,255,0.1)", color: "#fff", padding: "12px 24px", borderRadius: 10, fontSize: 13, fontWeight: 500, border: "1px solid rgba(255,255,255,0.3)", cursor: "pointer" }}>
              Register
            </button>
          </div>
        </div>
      </div>

      <div style={{ display: "flex", justifyContent: "center", gap: 0, background: "#f9fafb", borderBottom: "1px solid #e5e7eb" }}>
        {[["18,400+", "Students"], ["420+", "Courses"], ["EN · FR · AR", "Languages"], ["4", "Pathways"]].map(([val, label], i) => (
          <div key={label} style={{ textAlign: "center", flex: 1, padding: "20px 0", borderRight: i < 3 ? "1px solid #e5e7eb" : "none" }}>
            <div style={{ color: "#0d9488", fontSize: 22, fontWeight: 800 }}>{val}</div>
            <div style={{ color: "#9ca3af", fontSize: 11, marginTop: 3 }}>{label}</div>
          </div>
        ))}
      </div>

      <div style={{ padding: "32px 32px" }}>
        <h2 style={{ color: "#111827", fontSize: 18, fontWeight: 700, margin: "0 0 6px" }}>Academic Pathways</h2>
        <p style={{ color: "#9ca3af", fontSize: 13, margin: "0 0 20px" }}>Structured learning for every stage of education in Ghana</p>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 12, marginBottom: 32 }}>
          {pathways.map(p => (
            <div key={p.label} style={{ background: p.bg, border: `1px solid ${p.color}25`, borderRadius: 12, padding: "18px 16px", cursor: "pointer" }}>
              <div style={{ fontSize: 28, marginBottom: 10 }}>{p.icon}</div>
              <p style={{ color: "#111827", fontSize: 14, fontWeight: 700, margin: "0 0 4px" }}>{p.label}</p>
              <p style={{ color: "#6b7280", fontSize: 11, lineHeight: 1.5, margin: "0 0 10px" }}>{p.desc}</p>
              <span style={{ color: p.color, fontSize: 11, fontWeight: 600 }}>{p.count}</span>
            </div>
          ))}
        </div>

        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 16 }}>
          <h2 style={{ color: "#111827", fontSize: 16, fontWeight: 700, margin: 0 }}>Popular Courses</h2>
          <span style={{ color: "#0d9488", fontSize: 13, cursor: "pointer" }}>See all →</span>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 14 }}>
          {courses.slice(0, 3).map(c => (
            <div key={c.title} style={{ background: "#fff", border: "1px solid #e5e7eb", borderRadius: 12, overflow: "hidden", boxShadow: "0 1px 3px rgba(0,0,0,0.06)" }}>
              <div style={{ height: 72, background: `linear-gradient(135deg, ${c.color}18, ${c.color}06)`, display: "flex", alignItems: "center", justifyContent: "center" }}>
                <span style={{ fontSize: 28 }}>📖</span>
              </div>
              <div style={{ padding: 14 }}>
                <span style={{ background: `${c.color}15`, color: c.color, padding: "2px 8px", borderRadius: 100, fontSize: 10, fontWeight: 600 }}>{c.cat}</span>
                <p style={{ color: "#111827", fontSize: 13, fontWeight: 600, margin: "8px 0 4px", lineHeight: 1.4 }}>{c.title}</p>
                <p style={{ color: "#9ca3af", fontSize: 11, margin: 0 }}>{c.students.toLocaleString()} students · {c.duration}</p>
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
    <div style={{ background: "#fff", minHeight: "100%", fontFamily: "system-ui, sans-serif", padding: 24 }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
        <div>
          <h1 style={{ color: "#111827", fontSize: 20, fontWeight: 800, margin: "0 0 2px" }}>All Courses</h1>
          <p style={{ color: "#9ca3af", fontSize: 13, margin: 0 }}>420+ courses across 4 pathways</p>
        </div>
        <div style={{ display: "flex", gap: 6 }}>
          {["All", "WASSCE", "BECE", "University", "Career"].map((f, i) => (
            <button key={f} style={{ padding: "6px 14px", borderRadius: 100, fontSize: 12, fontWeight: 500, border: i === 0 ? "none" : "1px solid #e5e7eb", background: i === 0 ? "#0d9488" : "#fff", color: i === 0 ? "#fff" : "#6b7280", cursor: "pointer" }}>{f}</button>
          ))}
        </div>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 14 }}>
        {courses.map(c => (
          <div key={c.title} style={{ background: "#fff", border: "1px solid #e5e7eb", borderRadius: 12, overflow: "hidden", display: "flex", cursor: "pointer" }}>
            <div style={{ width: 80, background: `${c.color}10`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
              <span style={{ fontSize: 24 }}>📖</span>
            </div>
            <div style={{ padding: 14, flex: 1 }}>
              <div style={{ display: "flex", gap: 6, marginBottom: 6 }}>
                <span style={{ background: `${c.color}15`, color: c.color, padding: "2px 7px", borderRadius: 100, fontSize: 10, fontWeight: 600 }}>{c.cat}</span>
                <span style={{ background: "#f3f4f6", color: "#6b7280", padding: "2px 7px", borderRadius: 100, fontSize: 10 }}>{c.level}</span>
              </div>
              <p style={{ color: "#111827", fontSize: 12, fontWeight: 600, margin: "0 0 4px", lineHeight: 1.4 }}>{c.title}</p>
              <p style={{ color: "#9ca3af", fontSize: 11, margin: 0 }}>{c.students.toLocaleString()} students · {c.duration}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function Lesson() {
  const lessons = [
    "Introduction & Course Overview",
    "Algebraic Expressions",
    "Quadratic Functions",
    "Vectors & Transformation",
    "Statistics & Probability",
    "Past Questions 2019–2023",
  ];
  return (
    <div style={{ background: "#f9fafb", minHeight: "100%", fontFamily: "system-ui, sans-serif", display: "flex", height: "100%" }}>
      <div style={{ width: 240, borderRight: "1px solid #e5e7eb", padding: 16, flexShrink: 0, background: "#fff" }}>
        <div style={{ marginBottom: 16 }}>
          <p style={{ color: "#9ca3af", fontSize: 11, margin: "0 0 4px", fontWeight: 600, letterSpacing: "0.04em" }}>COURSE</p>
          <p style={{ color: "#111827", fontSize: 13, fontWeight: 600, margin: 0, lineHeight: 1.4 }}>WASSCE Core Mathematics</p>
        </div>
        <div style={{ height: 1, background: "#e5e7eb", margin: "0 0 14px" }} />
        {lessons.map((l, i) => (
          <div key={l} style={{ display: "flex", alignItems: "center", gap: 10, padding: "8px 10px", borderRadius: 8, background: i === 2 ? "#f0fdfa" : "transparent", marginBottom: 2, cursor: "pointer" }}>
            <div style={{ width: 20, height: 20, borderRadius: "50%", background: i < 2 ? "#0d9488" : i === 2 ? "#0d948830" : "#e5e7eb", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
              {i < 2 ? <span style={{ color: "#fff", fontSize: 10 }}>✓</span> : <span style={{ color: i === 2 ? "#0d9488" : "#9ca3af", fontSize: 10 }}>{i + 1}</span>}
            </div>
            <span style={{ color: i === 2 ? "#0d9488" : i < 2 ? "#6b7280" : "#9ca3af", fontSize: 12 }}>{l}</span>
          </div>
        ))}
        <div style={{ marginTop: 16 }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
            <span style={{ color: "#6b7280", fontSize: 11 }}>Progress</span>
            <span style={{ color: "#0d9488", fontSize: 11, fontWeight: 600 }}>33%</span>
          </div>
          <div style={{ height: 6, background: "#e5e7eb", borderRadius: 3 }}>
            <div style={{ height: 6, width: "33%", background: "#0d9488", borderRadius: 3 }} />
          </div>
        </div>
      </div>
      <div style={{ flex: 1, padding: 24 }}>
        <div style={{ background: "#111827", borderRadius: 12, height: 200, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 20, position: "relative" }}>
          <div style={{ width: 52, height: 52, borderRadius: "50%", background: "#0d9488", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}>
            <span style={{ fontSize: 20, marginLeft: 4, color: "#fff" }}>▶</span>
          </div>
          <div style={{ position: "absolute", bottom: 12, left: 12, right: 12, height: 3, background: "rgba(255,255,255,0.15)", borderRadius: 2 }}>
            <div style={{ height: 3, width: "35%", background: "#0d9488", borderRadius: 2 }} />
          </div>
        </div>
        <h2 style={{ color: "#111827", fontSize: 18, fontWeight: 700, margin: "0 0 8px" }}>Quadratic Functions</h2>
        <p style={{ color: "#6b7280", fontSize: 13, lineHeight: 1.7, margin: "0 0 20px" }}>
          Master quadratic equations, factorisation, completing the square, and the quadratic formula. Exam-focused examples and past WASSCE questions included.
        </p>
        <div style={{ background: "#f0fdfa", border: "1px solid #0d948825", borderRadius: 10, padding: 14 }}>
          <p style={{ color: "#0d9488", fontSize: 12, fontWeight: 600, margin: "0 0 10px" }}>Lesson Resources</p>
          {["Lesson Notes (PDF)", "Practice Questions", "Quiz — 15 questions"].map(r => (
            <div key={r} style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
              <span style={{ fontSize: 14 }}>📎</span>
              <span style={{ color: "#374151", fontSize: 12 }}>{r}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function Dashboard() {
  return (
    <div style={{ background: "#f9fafb", minHeight: "100%", fontFamily: "system-ui, sans-serif", padding: 24 }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 24 }}>
        <div>
          <h1 style={{ color: "#111827", fontSize: 20, fontWeight: 800, margin: "0 0 2px" }}>My Dashboard</h1>
          <p style={{ color: "#9ca3af", fontSize: 13, margin: 0 }}>5-day streak! Keep it up.</p>
        </div>
        <div style={{ width: 36, height: 36, borderRadius: "50%", background: "#0d9488", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <span style={{ fontWeight: 700, fontSize: 14, color: "#fff" }}>K</span>
        </div>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 14, marginBottom: 24 }}>
        {[["3", "Enrolled", "📚"], ["1", "Certificates", "🏆"], ["5", "Day Streak", "🔥"]].map(([val, label, icon]) => (
          <div key={label} style={{ background: "#fff", border: "1px solid #e5e7eb", borderRadius: 12, padding: 16, textAlign: "center" }}>
            <div style={{ fontSize: 22, marginBottom: 6 }}>{icon}</div>
            <div style={{ color: "#0d9488", fontSize: 22, fontWeight: 800 }}>{val}</div>
            <div style={{ color: "#9ca3af", fontSize: 11, marginTop: 2 }}>{label}</div>
          </div>
        ))}
      </div>
      <h2 style={{ color: "#111827", fontSize: 15, fontWeight: 700, margin: "0 0 14px" }}>Continue Learning</h2>
      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        {courses.slice(0, 2).map((c, i) => (
          <div key={c.title} style={{ background: "#fff", border: "1px solid #e5e7eb", borderRadius: 12, padding: 14, display: "flex", alignItems: "center", gap: 14 }}>
            <div style={{ width: 48, height: 48, borderRadius: 10, background: `${c.color}10`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
              <span style={{ fontSize: 22 }}>📖</span>
            </div>
            <div style={{ flex: 1 }}>
              <p style={{ color: "#111827", fontSize: 13, fontWeight: 600, margin: "0 0 4px" }}>{c.title}</p>
              <div style={{ height: 4, background: "#e5e7eb", borderRadius: 2 }}>
                <div style={{ height: 4, width: `${[68, 20][i]}%`, background: c.color, borderRadius: 2 }} />
              </div>
              <p style={{ color: "#9ca3af", fontSize: 11, margin: "4px 0 0" }}>{[68, 20][i]}% complete</p>
            </div>
            <button style={{ background: "#0d9488", color: "#fff", padding: "6px 14px", borderRadius: 8, fontSize: 12, fontWeight: 600, border: "none", cursor: "pointer" }}>Resume</button>
          </div>
        ))}
      </div>
    </div>
  );
}
