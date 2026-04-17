"use client";

interface Props { screen: string }

export default function SIIFPreview({ screen }: Props) {
  if (screen === "academy") return <Academy />;
  if (screen === "intelligence") return <Intelligence />;
  return <Landing />;
}

function Landing() {
  return (
    <div style={{ background: "#0A0A0B", minHeight: "100%", fontFamily: "'Playfair Display', serif" }}>
      {/* Header */}
      <nav style={{ padding: "24px 48px", display: "flex", alignItems: "center", justifyContent: "space-between", background: "rgba(0,0,0,0.4)", borderBottom: "1px solid rgba(197, 158, 71, 0.1)" }}>
        <div style={{ color: "#fff", fontWeight: 700, fontSize: 24, letterSpacing: "0.1em" }}>SIIF</div>
        <div style={{ display: "flex", gap: 32, alignItems: "center" }}>
          {["VISION", "ACADEMY", "INTELLIGENCE", "ECOSYSTEM", "ARCHIVES"].map(l => (
            <span key={l} style={{ color: "#C59E47", fontSize: 11, fontWeight: 600, letterSpacing: "0.15em", cursor: "pointer" }}>{l}</span>
          ))}
          <button style={{ background: "transparent", color: "#C59E47", border: "1px solid #C59E47", padding: "8px 20px", borderRadius: 4, fontSize: 10, fontWeight: 700, letterSpacing: "0.1em", cursor: "pointer" }}>
            ENROLL / MEMBER PORTAL
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <div style={{ padding: "120px 48px", textAlign: "left", position: "relative", overflow: "hidden" }}>
        {/* Background Overlay Hint */}
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(rgba(10,10,11,0.7), rgba(10,10,11,0.9)), url('/images/projects/siif.png') center/cover", zIndex: 0 }} />
        
        <div style={{ position: "relative", zIndex: 1, maxWidth: 800 }}>
          <p style={{ color: "#C59E47", fontSize: 11, fontWeight: 700, letterSpacing: "0.2em", marginBottom: 20 }}>SAVANNAH INSTITUTE FOR INNOVATIVE FINANCE</p>
          <h1 style={{ color: "#fff", fontSize: 56, fontWeight: 400, letterSpacing: "0.02em", lineHeight: 1.1, margin: "0 0 32px" }}>
            INSTITUTIONALIZING<br />THE FUTURE OF FINANCE.
          </h1>
          <p style={{ color: "rgba(255,255,255,0.7)", fontSize: 18, lineHeight: 1.6, maxWidth: 600, marginBottom: 40 }}>
            SIIF is the <strong style={{ color: "#fff" }}>architect of emerging market capital</strong> — bridging institutional rigor with high-growth innovation.
          </p>
          <p style={{ color: "rgba(255,255,255,0.5)", fontSize: 14, fontStyle: "italic" }}>
            Innovative finance is the engine of emerging markets. We are the architects.
          </p>
        </div>
      </div>

      {/* Vision Blocks */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 1, background: "rgba(197, 158, 71, 0.1)", borderTop: "1px solid rgba(197, 158, 71, 0.1)" }}>
        {[
          { title: "Institutional Rigor", desc: "Setting the standard for capital allocation in sub-Saharan Africa." },
          { title: "Innovative Systems", desc: "Deploying next-generation financial instruments for real-world impact." },
          { title: "Market Growth", desc: "Scaling sustainable economic ecosystems through intelligence." }
        ].map((item, i) => (
          <div key={i} style={{ padding: "48px", background: "#0A0A0B" }}>
            <h3 style={{ color: "#C59E47", fontSize: 16, fontWeight: 500, letterSpacing: "0.05em", marginBottom: 16 }}>{item.title}</h3>
            <p style={{ color: "rgba(255,255,255,0.5)", fontSize: 13, lineHeight: 1.6 }}>{item.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

function Academy() {
  return (
    <div style={{ background: "#FDFCF9", minHeight: "100%", padding: 48, fontFamily: "serif" }}>
      <h1 style={{ color: "#1A1A1A", fontSize: 32, marginBottom: 40, borderBottom: "2px solid #C59E47", paddingBottom: 16 }}>Academy Portal</h1>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 32 }}>
        {[
          { title: "Venture Capital Foundations", modules: 12, Level: "Institutional" },
          { title: "Emerging Market Risk Analysis", modules: 8, Level: "Advanced" },
          { title: "Institutional Asset Management", modules: 15, Level: "Executive" }
        ].map((course, i) => (
          <div key={i} style={{ border: "1px solid #E5E5E5", padding: 24, borderRadius: 2 }}>
            <span style={{ color: "#C59E47", fontSize: 12, fontWeight: 700, letterSpacing: "0.1em" }}>{course.Level}</span>
            <h3 style={{ fontSize: 20, margin: "8px 0 16px" }}>{course.title}</h3>
            <p style={{ color: "#666", fontSize: 14 }}>{course.modules} modules • Self-paced • Certificate awarded</p>
          </div>
        ))}
      </div>
    </div>
  );
}

function Intelligence() {
  return (
    <div style={{ background: "#0A0A0B", minHeight: "100%", padding: 48, color: "#fff" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: 48 }}>
        <div>
          <p style={{ color: "#C59E47", fontSize: 12, fontWeight: 700, letterSpacing: "0.1em" }}>REAL-TIME DATA</p>
          <h2 style={{ fontSize: 24, margin: "8px 0 0" }}>Market Intelligence Hub</h2>
        </div>
        <div style={{ display: "flex", gap: 16 }}>
          {["SSA EQUITY", "FIXED INCOME", "COMMODITIES"].map(t => (
            <span key={t} style={{ border: "1px solid rgba(255,255,255,0.1)", padding: "4px 12px", borderRadius: 4, fontSize: 10 }}>{t}</span>
          ))}
        </div>
      </div>
      <div style={{ height: 200, background: "rgba(197, 158, 71, 0.05)", border: "1px solid rgba(197, 158, 71, 0.1)", borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center" }}>
        <p style={{ color: "#666", fontSize: 14 }}>Intelligence visualization terminal loading...</p>
      </div>
    </div>
  );
}
