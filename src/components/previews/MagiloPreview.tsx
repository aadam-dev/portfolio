"use client";

interface Props { screen: string }

const services = [
  { title: "Corporate & School", desc: "Exam paper printing, typing & scanning, business stationery, and academic materials.", icon: "🖨️" },
  { title: "Branding & Apparel", desc: "Custom T-shirts, screen printing, logo design, and branded merchandise.", icon: "👕" },
  { title: "Large Format", desc: "Billboards, event banners, posters, and large-scale display printing.", icon: "🖼️" },
  { title: "Business Consulting", desc: "Business plans, pitch decks, web design, and brand strategy.", icon: "📋" },
];

const portfolio = [
  { type: "Brand Identity", client: "Accra Tech Hub", year: 2024 },
  { type: "Event Print", client: "KNUST Graduation 2024", year: 2024 },
  { type: "Visual Arts", client: "Adenta SHS Programme", year: 2025 },
  { type: "Signage", client: "Madina Market Association", year: 2025 },
  { type: "Brochure Design", client: "Greater Accra Health Drive", year: 2023 },
  { type: "T-Shirt Print", client: "Legon Athletics Club", year: 2024 },
];

export default function MagiloPreview({ screen }: Props) {
  if (screen === "services") return <Services />;
  if (screen === "college") return <College />;
  return <Landing />;
}

function Landing() {
  return (
    <div style={{ background: "#fefefe", minHeight: "100%", fontFamily: "system-ui, sans-serif" }}>
      {/* Nav */}
      <nav style={{ padding: "14px 28px", display: "flex", alignItems: "center", justifyContent: "space-between", borderBottom: "1px solid #e5e7eb", background: "#fff" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ width: 36, height: 36, borderRadius: 10, background: "#ed8936", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <span style={{ color: "#fff", fontWeight: 900, fontSize: 16 }}>M</span>
          </div>
          <div>
            <span style={{ color: "#111827", fontWeight: 800, fontSize: 15, display: "block", lineHeight: 1.2, letterSpacing: "-0.01em" }}>Magilo Art College</span>
            <span style={{ color: "#9ca3af", fontSize: 10 }}>Adenta, Accra</span>
          </div>
        </div>
        <div style={{ display: "flex", gap: 24, alignItems: "center" }}>
          {["Services", "The College", "Portfolio", "About Us"].map(l => (
            <span key={l} style={{ color: "#6b7280", fontSize: 13, cursor: "pointer" }}>{l}</span>
          ))}
          <button style={{ background: "#ed8936", color: "#fff", padding: "8px 18px", borderRadius: 8, fontSize: 13, fontWeight: 600, border: "none", cursor: "pointer" }}>
            Enrol Now
          </button>
        </div>
      </nav>

      {/* Hero */}
      <div style={{ background: "linear-gradient(135deg, #1a365d 0%, #1e3a5f 60%, #2d4a7a 100%)", padding: "64px 36px 56px" }}>
        <div style={{ maxWidth: 700, margin: "0 auto", textAlign: "center" }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 6, background: "rgba(237,137,54,0.2)", border: "1px solid rgba(237,137,54,0.3)", borderRadius: 100, padding: "5px 14px", marginBottom: 24 }}>
            <span style={{ color: "#f6ad55", fontSize: 11, fontWeight: 500 }}>25+ Years of Creative Excellence</span>
          </div>
          <h1 style={{ color: "#fff", fontSize: 44, fontWeight: 900, letterSpacing: "-0.03em", lineHeight: 1.1, margin: "0 0 12px" }}>
            Teach. Design.<br />
            <span style={{ color: "#ed8936" }}>Print. Consult.</span>
          </h1>
          <h2 style={{ color: "#ed8936", fontSize: 20, fontWeight: 700, margin: "0 0 18px", letterSpacing: "-0.01em" }}>
            25+ Years of Excellence.
          </h2>
          <p style={{ color: "rgba(255,255,255,0.7)", fontSize: 15, lineHeight: 1.7, margin: "0 0 32px" }}>
            We started as an art school. Today we still teach—but we also design, print, and consult for hundreds of businesses and individuals across Accra. One team. Every creative need.
          </p>
          <div style={{ display: "flex", gap: 12, justifyContent: "center", marginBottom: 28 }}>
            <button style={{ background: "#ed8936", color: "#fff", padding: "13px 28px", borderRadius: 10, fontSize: 13, fontWeight: 700, border: "none", cursor: "pointer" }}>
              Order Printing
            </button>
            <button style={{ background: "transparent", color: "#fff", padding: "13px 28px", borderRadius: 10, fontSize: 13, fontWeight: 500, border: "1px solid rgba(255,255,255,0.4)", cursor: "pointer" }}>
              View Courses
            </button>
          </div>
          {/* Trust row */}
          <div style={{ display: "flex", gap: 20, justifyContent: "center", flexWrap: "wrap" }}>
            {["25+ Years Experience", "Trusted by Businesses", "Full-Service Solutions"].map(item => (
              <span key={item} style={{ color: "rgba(255,255,255,0.75)", fontSize: 12, display: "flex", alignItems: "center", gap: 5 }}>
                <span style={{ color: "#ed8936", fontWeight: 700 }}>✓</span> {item}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Trust bar */}
      <div style={{ background: "#1a365d", padding: "24px 28px" }}>
        <div style={{ display: "flex", justifyContent: "center", marginBottom: 20 }}>
          {[["25+", "Years Experience"], ["1000+", "Projects Delivered"], ["500+", "Satisfied Clients"], ["100%", "Commitment"]].map(([val, label], i) => (
            <div key={label} style={{ flex: 1, textAlign: "center", paddingTop: 4, paddingBottom: 4, borderRight: i < 3 ? "1px solid rgba(255,255,255,0.12)" : "none" }}>
              <div style={{ color: "#f6ad55", fontSize: 26, fontWeight: 800, lineHeight: 1 }}>{val}</div>
              <div style={{ color: "rgba(255,255,255,0.55)", fontSize: 11, marginTop: 4 }}>{label}</div>
            </div>
          ))}
        </div>
        <div style={{ textAlign: "center" }}>
          <p style={{ color: "rgba(255,255,255,0.45)", fontSize: 11, margin: "0 0 10px", letterSpacing: "0.06em" }}>TRUSTED BY OUR CLIENTS</p>
          <div style={{ display: "flex", gap: 8, justifyContent: "center" }}>
            {["DIS", "LC", "SME", "ASM", "CC"].map(logo => (
              <div key={logo} style={{ background: "rgba(255,255,255,0.1)", border: "1px solid rgba(255,255,255,0.15)", borderRadius: 6, padding: "6px 12px" }}>
                <span style={{ color: "rgba(255,255,255,0.5)", fontSize: 10, fontWeight: 600 }}>{logo}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Services grid */}
      <div style={{ padding: "40px 28px", background: "#f9fafb" }}>
        <p style={{ color: "#ed8936", fontSize: 11, fontWeight: 700, letterSpacing: "0.1em", margin: "0 0 8px" }}>WHAT WE DO</p>
        <h2 style={{ color: "#111827", fontSize: 22, fontWeight: 800, margin: "0 0 6px", letterSpacing: "-0.02em" }}>Our Services</h2>
        <p style={{ color: "#9ca3af", fontSize: 13, margin: "0 0 24px" }}>Four areas of creative excellence since 1999</p>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 14 }}>
          {services.map(s => (
            <div key={s.title} style={{ background: "#fff", border: "1px solid #e5e7eb", borderRadius: 14, padding: 18, cursor: "pointer" }}>
              <div style={{ fontSize: 28, marginBottom: 12 }}>{s.icon}</div>
              <p style={{ color: "#111827", fontSize: 13, fontWeight: 700, margin: "0 0 6px" }}>{s.title}</p>
              <p style={{ color: "#9ca3af", fontSize: 11, lineHeight: 1.6, margin: 0 }}>{s.desc}</p>
              <span style={{ color: "#ed8936", fontSize: 11, fontWeight: 600, display: "block", marginTop: 10 }}>Learn more →</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function Services() {
  return (
    <div style={{ background: "#fff", minHeight: "100%", fontFamily: "system-ui, sans-serif", padding: 28 }}>
      <p style={{ color: "#ed8936", fontSize: 11, fontWeight: 700, letterSpacing: "0.1em", margin: "0 0 8px" }}>WHAT WE DO</p>
      <h2 style={{ color: "#111827", fontSize: 26, fontWeight: 800, letterSpacing: "-0.02em", margin: "0 0 4px" }}>Our Services</h2>
      <p style={{ color: "#9ca3af", fontSize: 13, margin: "0 0 28px" }}>Four areas of creative excellence since 1999</p>

      <div style={{ display: "flex", flexDirection: "column", gap: 20, marginBottom: 32 }}>
        {services.map(s => (
          <div key={s.title} style={{ display: "flex", gap: 20, padding: 20, background: "#f9fafb", border: "1px solid #e5e7eb", borderRadius: 14, alignItems: "flex-start" }}>
            <div style={{ width: 56, height: 56, borderRadius: 14, background: "rgba(237,137,54,0.1)", border: "1px solid rgba(237,137,54,0.2)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, fontSize: 26 }}>{s.icon}</div>
            <div style={{ flex: 1 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
                <h3 style={{ color: "#111827", fontSize: 16, fontWeight: 700, margin: 0 }}>{s.title}</h3>
                <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#ed8936" }} />
              </div>
              <p style={{ color: "#6b7280", fontSize: 13, lineHeight: 1.7, margin: 0 }}>{s.desc}</p>
            </div>
            <button style={{ color: "#ed8936", background: "none", border: "none", fontSize: 12, fontWeight: 600, cursor: "pointer", padding: 0, flexShrink: 0, marginTop: 4 }}>
              Enquire →
            </button>
          </div>
        ))}
      </div>

      {/* Portfolio preview */}
      <p style={{ color: "#9ca3af", fontSize: 11, fontWeight: 700, letterSpacing: "0.06em", margin: "0 0 14px" }}>RECENT WORK</p>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12 }}>
        {portfolio.slice(0, 6).map(p => (
          <div key={p.client} style={{ background: "#fff", border: "1px solid #e5e7eb", borderRadius: 10, padding: 14 }}>
            <div style={{ height: 60, background: "rgba(237,137,54,0.06)", borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 10, fontSize: 24 }}>🎨</div>
            <p style={{ color: "#111827", fontSize: 11, fontWeight: 700, margin: "0 0 3px" }}>{p.client}</p>
            <p style={{ color: "#9ca3af", fontSize: 10, margin: 0 }}>{p.type} · {p.year}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

function College() {
  const advantages = [
    "SHS Visual Arts support",
    "Hands-on Graphic Design",
    "Master Industrial Printing Machines",
    "Entrepreneurship Coaching",
    "Real Client Projects",
  ];
  return (
    <div style={{ background: "#fff", minHeight: "100%", fontFamily: "system-ui, sans-serif" }}>
      {/* Hero banner */}
      <div style={{ background: "linear-gradient(135deg, #1a365d 0%, #1e3a5f 60%, #2d4a7a 100%)", padding: "48px 28px", textAlign: "center" }}>
        <p style={{ color: "#ed8936", fontSize: 11, fontWeight: 700, letterSpacing: "0.12em", margin: "0 0 14px" }}>MAGILO ART COLLEGE</p>
        <h2 style={{ color: "#fff", fontSize: 30, fontWeight: 900, letterSpacing: "-0.02em", margin: "0 0 12px", lineHeight: 1.2 }}>Learn Where the Industry Happens</h2>
        <p style={{ color: "rgba(255,255,255,0.6)", fontSize: 14, margin: 0 }}>Adenta's creative education hub since 1999</p>
      </div>

      <div style={{ padding: "32px 28px" }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 32, marginBottom: 32, position: "relative" }}>
          {/* Left: Why Choose */}
          <div>
            <p style={{ color: "#374151", fontSize: 14, fontWeight: 700, margin: "0 0 18px" }}>Why Choose Magilo?</p>
            {advantages.map(a => (
              <div key={a} style={{ display: "flex", gap: 10, marginBottom: 14, alignItems: "flex-start" }}>
                <div style={{ width: 22, height: 22, borderRadius: "50%", background: "#ed8936", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, marginTop: 1 }}>
                  <span style={{ color: "#fff", fontSize: 10 }}>✓</span>
                </div>
                <span style={{ color: "#374151", fontSize: 13, lineHeight: 1.5 }}>{a}</span>
              </div>
            ))}

            {/* Highlight card */}
            <div style={{ marginTop: 24, background: "rgba(237,137,54,0.08)", border: "1px solid rgba(237,137,54,0.25)", borderRadius: 12, padding: "16px 18px", display: "flex", alignItems: "center", gap: 14 }}>
              <div style={{ width: 44, height: 44, borderRadius: 10, background: "#ed8936", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                <span style={{ color: "#fff", fontSize: 20, fontWeight: 900 }}>4</span>
              </div>
              <div>
                <p style={{ color: "#111827", fontSize: 13, fontWeight: 700, margin: "0 0 2px" }}>4 Specialized Courses</p>
                <p style={{ color: "#9ca3af", fontSize: 11, margin: 0 }}>From SHS support to professional branding</p>
              </div>
            </div>
          </div>

          {/* Right: Programmes */}
          <div>
            <p style={{ color: "#374151", fontSize: 14, fontWeight: 700, margin: "0 0 16px" }}>Programmes Offered</p>
            {[
              { name: "SHS Visual Arts Support", duration: "Academic year", format: "In-person" },
              { name: "Graphic Design (Professional)", duration: "6 months", format: "In-person" },
              { name: "Desktop Publishing", duration: "3 months", format: "In-person" },
              { name: "Business Branding Masterclass", duration: "4 weeks", format: "In-person" },
            ].map(p => (
              <div key={p.name} style={{ background: "#f9fafb", border: "1px solid #e5e7eb", borderRadius: 10, padding: 14, marginBottom: 10 }}>
                <p style={{ color: "#111827", fontSize: 13, fontWeight: 600, margin: "0 0 4px" }}>{p.name}</p>
                <p style={{ color: "#9ca3af", fontSize: 11, margin: 0 }}>{p.duration} · {p.format}</p>
              </div>
            ))}
          </div>
        </div>

        {/* CTA section */}
        <div style={{ background: "#1a365d", borderRadius: 14, padding: "24px 28px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div>
            <h3 style={{ color: "#fff", fontSize: 18, fontWeight: 700, margin: "0 0 6px" }}>Ready to create something great?</h3>
            <p style={{ color: "rgba(255,255,255,0.5)", fontSize: 13, margin: 0 }}>Find us in Adenta, Accra · Open Mon–Sat</p>
          </div>
          <div style={{ display: "flex", gap: 10 }}>
            <button style={{ background: "transparent", color: "#ed8936", padding: "11px 22px", border: "1px solid #ed8936", borderRadius: 8, fontSize: 12, fontWeight: 600, cursor: "pointer" }}>
              Get Directions
            </button>
            <button style={{ background: "#ed8936", color: "#fff", padding: "11px 22px", border: "none", borderRadius: 8, fontSize: 12, fontWeight: 700, cursor: "pointer" }}>
              Enrol Today
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
