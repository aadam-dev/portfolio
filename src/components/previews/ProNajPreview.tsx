"use client";

interface Props { screen: string }

const OBSIDIAN = "#050505";
const CONCRETE = "#F1F5F9";
const ORANGE = "#F97316";
const STEEL = "#64748B";
const STEEL_LIGHT = "#94A3B8";
const BORDER = "rgba(100,116,139,0.2)";
const GRID_BG = `
  linear-gradient(rgba(249,115,22,0.3) 1px, transparent 1px),
  linear-gradient(90deg, rgba(249,115,22,0.3) 1px, transparent 1px)
`;

const sectors = [
  {
    name: "Digital",
    tag: "IT & Tech Services",
    desc: "Web development, cybersecurity, and software engineering solutions for the modern enterprise.",
    stats: ["500+ Projects Delivered", "99.9% Uptime SLA"],
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="3" width="20" height="14" rx="2" />
        <path d="M8 21h8M12 17v4" />
      </svg>
    ),
  },
  {
    name: "Living",
    tag: "Modular Solutions",
    desc: "IKEA-inspired furniture and prefabricated container housing for sustainable, modern living.",
    stats: ["200+ Homes Built", "A+ Sustainability"],
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 11V20h18V11" />
        <path d="M2 11h20" />
        <path d="M7 11V7a2 2 0 0 1 2-2h6a2 2 0 0 1 2 2v4" />
        <path d="M7 15h10" />
      </svg>
    ),
  },
  {
    name: "Global",
    tag: "Agri-Trade & Export",
    desc: "Cocopeat export and precision greenhouse farming, bridging Ghana to global markets via Delaware.",
    stats: ["10K MT Export Volume", "25+ Markets"],
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" />
        <path d="M2 12h20" />
        <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
      </svg>
    ),
  },
];

export default function ProNajPreview({ screen }: Props) {
  if (screen === "sectors") return <Sectors />;
  if (screen === "contact") return <Contact />;
  return <Landing />;
}

function NavBar() {
  return (
    <nav style={{
      padding: "14px 32px",
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      borderBottom: `1px solid ${BORDER}`,
      background: "rgba(5,5,5,0.95)",
      position: "relative",
      zIndex: 10,
    }}>
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <div style={{
          width: 40, height: 40,
          border: `2px solid ${OBSIDIAN}`,
          background: OBSIDIAN,
          display: "flex", alignItems: "center", justifyContent: "center",
        }}>
          <span style={{ color: CONCRETE, fontWeight: 700, fontSize: 14, fontFamily: "system-ui, sans-serif" }}>PN</span>
        </div>
        <div>
          <span style={{ color: CONCRETE, fontWeight: 700, fontSize: 16, letterSpacing: "-0.02em", fontFamily: "system-ui, sans-serif", display: "block", lineHeight: 1.2 }}>ProNaj</span>
          <span style={{ color: STEEL, fontSize: 10, fontWeight: 500, letterSpacing: "0.12em", textTransform: "uppercase", fontFamily: "monospace" }}>International</span>
        </div>
      </div>
      <div style={{ display: "flex", gap: 24, alignItems: "center" }}>
        {["Digital", "Living", "Global", "About", "Contact"].map(l => (
          <span key={l} style={{ color: STEEL, fontSize: 12, cursor: "pointer", letterSpacing: "0.05em", fontFamily: "monospace" }}>{l}</span>
        ))}
        <button style={{
          background: "transparent",
          color: ORANGE,
          padding: "7px 16px",
          border: `1px solid ${ORANGE}`,
          fontSize: 11,
          fontWeight: 600,
          cursor: "pointer",
          fontFamily: "monospace",
          letterSpacing: "0.1em",
        }}>
          GET IN TOUCH
        </button>
      </div>
    </nav>
  );
}

function Landing() {
  return (
    <div style={{ background: OBSIDIAN, minHeight: "100%", fontFamily: "'Space Grotesk', system-ui, sans-serif", color: CONCRETE }}>
      <NavBar />

      {/* Hero */}
      <div style={{
        position: "relative",
        padding: "64px 32px 0",
        textAlign: "center",
        backgroundImage: GRID_BG,
        backgroundSize: "60px 60px",
        overflow: "hidden",
      }}>
        {/* Dark overlay so grid is subtle */}
        <div style={{
          position: "absolute", inset: 0,
          background: "linear-gradient(to bottom, rgba(5,5,5,0.7) 0%, rgba(5,5,5,0.4) 60%, rgba(5,5,5,1) 100%)",
          pointerEvents: "none",
        }} />

        <div style={{ position: "relative", zIndex: 1 }}>
          <p style={{
            color: ORANGE,
            fontSize: 10,
            fontFamily: "monospace",
            letterSpacing: "0.3em",
            textTransform: "uppercase",
            margin: "0 0 24px",
          }}>
            ProNaj International
          </p>
          <h1 style={{
            color: CONCRETE,
            fontSize: 48,
            fontWeight: 800,
            letterSpacing: "-0.03em",
            lineHeight: 1.1,
            margin: "0 0 16px",
          }}>
            Building the Infrastructure<br />
            <span style={{ color: ORANGE }}>of the Future</span>
          </h1>
          <p style={{
            color: STEEL_LIGHT,
            fontSize: 14,
            lineHeight: 1.7,
            margin: "0 auto 40px",
            maxWidth: 480,
          }}>
            A multi-sector conglomerate spanning Digital, Living, and Global divisions.
            Delaware-incorporated with operations across 2 continents and 25+ markets.
          </p>
        </div>

        {/* 3-column sector panel */}
        <div style={{
          position: "relative", zIndex: 1,
          display: "flex",
          gap: 0,
          border: `1px solid ${BORDER}`,
          borderBottom: "none",
          maxWidth: 900,
          margin: "0 auto",
        }}>
          {sectors.map((s, i) => (
            <SectorColumn key={s.name} sector={s} active={i === 0} last={i === sectors.length - 1} />
          ))}
        </div>
      </div>

      {/* Stats bar */}
      <div style={{
        borderTop: `1px solid ${BORDER}`,
        borderBottom: `1px solid ${BORDER}`,
        display: "flex",
        maxWidth: 900,
        margin: "0 auto",
      }}>
        {[["3", "Business Sectors"], ["2", "Continents"], ["25+", "Markets"], ["500+", "Projects"]].map(([val, label], i) => (
          <div key={label} style={{
            flex: 1,
            textAlign: "center",
            padding: "20px 0",
            borderRight: i < 3 ? `1px solid ${BORDER}` : "none",
          }}>
            <div style={{ color: ORANGE, fontSize: 22, fontWeight: 800, letterSpacing: "-0.02em" }}>{val}</div>
            <div style={{ color: STEEL, fontSize: 10, marginTop: 4, fontFamily: "monospace", letterSpacing: "0.1em", textTransform: "uppercase" }}>{label}</div>
          </div>
        ))}
      </div>

      {/* Footer strip */}
      <div style={{ padding: "20px 32px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <span style={{ color: STEEL, fontSize: 10, fontFamily: "monospace", letterSpacing: "0.08em" }}>
          © 2025 PRONAJ INTERNATIONAL LLC · DELAWARE, USA
        </span>
        <span style={{ color: STEEL, fontSize: 10, fontFamily: "monospace", letterSpacing: "0.08em" }}>
          GHANA · DELAWARE · GLOBAL
        </span>
      </div>
    </div>
  );
}

function SectorColumn({ sector, active, last }: { sector: typeof sectors[0]; active: boolean; last: boolean }) {
  return (
    <div style={{
      flex: 1,
      padding: "28px 24px",
      borderRight: last ? "none" : `1px solid ${BORDER}`,
      background: active ? "rgba(249,115,22,0.04)" : "rgba(5,5,5,0.8)",
      cursor: "pointer",
      display: "flex",
      flexDirection: "column",
      gap: 12,
      backdropFilter: "blur(8px)",
    }}>
      {/* Icon box */}
      <div style={{
        width: 44, height: 44,
        border: `1px solid ${active ? ORANGE : BORDER}`,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        color: active ? ORANGE : STEEL,
        transition: "all 0.2s",
      }}>
        {sector.icon}
      </div>

      {/* Sector name */}
      <div>
        <p style={{ color: CONCRETE, fontSize: 15, fontWeight: 700, margin: "0 0 2px", letterSpacing: "-0.01em" }}>
          {sector.name}
        </p>
        <p style={{ color: active ? ORANGE : STEEL, fontSize: 9, fontFamily: "monospace", letterSpacing: "0.2em", textTransform: "uppercase", margin: 0 }}>
          {sector.tag}
        </p>
      </div>

      {/* Description */}
      <p style={{ color: STEEL_LIGHT, fontSize: 12, lineHeight: 1.6, margin: 0 }}>
        {sector.desc}
      </p>

      {/* Stats */}
      <div style={{ display: "flex", flexDirection: "column", gap: 4, marginTop: "auto" }}>
        {sector.stats.map(stat => (
          <div key={stat} style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <div style={{ width: 4, height: 4, background: active ? ORANGE : STEEL, flexShrink: 0 }} />
            <span style={{ color: STEEL_LIGHT, fontSize: 10, fontFamily: "monospace", letterSpacing: "0.05em" }}>{stat}</span>
          </div>
        ))}
      </div>

      {/* CTA */}
      <p style={{ color: active ? ORANGE : STEEL, fontSize: 11, fontFamily: "monospace", letterSpacing: "0.1em", margin: "4px 0 0", cursor: "pointer" }}>
        Explore {sector.name} →
      </p>
    </div>
  );
}

function Sectors() {
  return (
    <div style={{ background: OBSIDIAN, minHeight: "100%", fontFamily: "'Space Grotesk', system-ui, sans-serif", color: CONCRETE }}>
      <NavBar />

      <div style={{
        padding: "48px 40px",
        backgroundImage: GRID_BG,
        backgroundSize: "60px 60px",
        position: "relative",
      }}>
        <div style={{
          position: "absolute", inset: 0,
          background: "linear-gradient(to bottom, rgba(5,5,5,0.85), rgba(5,5,5,0.92))",
          pointerEvents: "none",
        }} />

        <div style={{ position: "relative", zIndex: 1 }}>
          <p style={{ color: ORANGE, fontSize: 9, fontFamily: "monospace", letterSpacing: "0.3em", textTransform: "uppercase", margin: "0 0 12px" }}>
            Our Sectors
          </p>
          <h2 style={{ color: CONCRETE, fontSize: 34, fontWeight: 800, letterSpacing: "-0.03em", margin: "0 0 4px", lineHeight: 1.1 }}>
            Three Pillars.<br />
            <span style={{ color: ORANGE }}>One Vision.</span>
          </h2>
          <div style={{ width: 40, height: 2, background: ORANGE, margin: "16px 0 40px" }} />

          {sectors.map((s, i) => (
            <div key={s.name} style={{
              display: "flex", gap: 28, alignItems: "flex-start",
              padding: "28px 0",
              borderBottom: i < sectors.length - 1 ? `1px solid ${BORDER}` : "none",
            }}>
              <div style={{
                width: 60, height: 60,
                border: `1px solid ${ORANGE}`,
                display: "flex", alignItems: "center", justifyContent: "center",
                color: ORANGE, flexShrink: 0,
              }}>
                {s.icon}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 6 }}>
                  <h3 style={{ color: CONCRETE, fontSize: 20, fontWeight: 700, margin: 0, letterSpacing: "-0.02em" }}>
                    ProNaj {s.name}
                  </h3>
                  <span style={{ border: `1px solid ${BORDER}`, color: ORANGE, padding: "2px 10px", fontSize: 9, fontFamily: "monospace", letterSpacing: "0.15em", textTransform: "uppercase" }}>
                    {s.tag}
                  </span>
                </div>
                <p style={{ color: STEEL_LIGHT, fontSize: 13, lineHeight: 1.7, margin: "0 0 12px", maxWidth: 520 }}>{s.desc}</p>
                <div style={{ display: "flex", gap: 16, marginBottom: 12 }}>
                  {s.stats.map(stat => (
                    <div key={stat} style={{ display: "flex", alignItems: "center", gap: 6 }}>
                      <div style={{ width: 4, height: 4, background: ORANGE, flexShrink: 0 }} />
                      <span style={{ color: STEEL_LIGHT, fontSize: 10, fontFamily: "monospace", letterSpacing: "0.05em" }}>{stat}</span>
                    </div>
                  ))}
                </div>
                <span style={{ color: ORANGE, fontSize: 11, fontFamily: "monospace", letterSpacing: "0.1em", cursor: "pointer" }}>
                  Explore {s.name} →
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function Contact() {
  return (
    <div style={{ background: OBSIDIAN, minHeight: "100%", fontFamily: "'Space Grotesk', system-ui, sans-serif", color: CONCRETE }}>
      <NavBar />

      <div style={{
        padding: "48px 40px",
        backgroundImage: GRID_BG,
        backgroundSize: "60px 60px",
        position: "relative",
      }}>
        <div style={{
          position: "absolute", inset: 0,
          background: "linear-gradient(to bottom, rgba(5,5,5,0.85), rgba(5,5,5,0.92))",
          pointerEvents: "none",
        }} />

        <div style={{ position: "relative", zIndex: 1 }}>
          <p style={{ color: ORANGE, fontSize: 9, fontFamily: "monospace", letterSpacing: "0.3em", textTransform: "uppercase", margin: "0 0 12px" }}>
            Contact
          </p>
          <h2 style={{ color: CONCRETE, fontSize: 34, fontWeight: 800, letterSpacing: "-0.03em", margin: "0 0 4px" }}>
            Let's Build Together.
          </h2>
          <div style={{ width: 40, height: 2, background: ORANGE, margin: "16px 0 36px" }} />

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 48 }}>
            <div>
              {[["Full Name", false], ["Company", false], ["Email Address", false], ["How can we help?", true]].map(([label, isTextarea]) => (
                <div key={label as string} style={{ marginBottom: 18 }}>
                  <label style={{
                    color: STEEL,
                    fontSize: 9,
                    fontFamily: "monospace",
                    letterSpacing: "0.2em",
                    textTransform: "uppercase",
                    display: "block",
                    marginBottom: 6,
                  }}>
                    {label as string}
                  </label>
                  {isTextarea
                    ? <textarea readOnly rows={4} style={{
                        width: "100%",
                        background: "rgba(100,116,139,0.05)",
                        border: `1px solid ${BORDER}`,
                        padding: "10px 12px",
                        color: CONCRETE,
                        fontSize: 13,
                        outline: "none",
                        resize: "none",
                        fontFamily: "'Space Grotesk', system-ui, sans-serif",
                        boxSizing: "border-box",
                      }} />
                    : <input readOnly style={{
                        width: "100%",
                        background: "rgba(100,116,139,0.05)",
                        border: `1px solid ${BORDER}`,
                        padding: "10px 12px",
                        color: CONCRETE,
                        fontSize: 13,
                        outline: "none",
                        fontFamily: "'Space Grotesk', system-ui, sans-serif",
                        boxSizing: "border-box",
                      }} />
                  }
                </div>
              ))}
              <button style={{
                background: ORANGE,
                color: "#fff",
                padding: "12px 28px",
                border: "none",
                fontSize: 11,
                fontWeight: 700,
                cursor: "pointer",
                fontFamily: "monospace",
                letterSpacing: "0.15em",
                textTransform: "uppercase",
              }}>
                Send Message
              </button>
            </div>

            <div>
              {[
                ["Headquarters", "Accra, Greater Accra", "Ghana, West Africa"],
                ["Incorporated", "State of Delaware, USA", "& Republic of Ghana"],
                ["General Enquiries", "hello@pronaj.com", ""],
                ["Response Time", "Within 1–2 business days", ""],
              ].map(([heading, line1, line2]) => (
                <div key={heading} style={{ marginBottom: 24 }}>
                  <p style={{ color: STEEL, fontSize: 9, fontFamily: "monospace", letterSpacing: "0.2em", textTransform: "uppercase", margin: "0 0 6px" }}>
                    {heading}
                  </p>
                  <p style={{ color: heading === "General Enquiries" ? ORANGE : CONCRETE, fontSize: 13, margin: 0, lineHeight: 1.6 }}>
                    {line1}
                    {line2 && <><br /><span style={{ color: STEEL_LIGHT }}>{line2}</span></>}
                  </p>
                </div>
              ))}

              <div style={{ marginTop: 32, border: `1px solid ${BORDER}`, padding: "20px" }}>
                <p style={{ color: STEEL, fontSize: 9, fontFamily: "monospace", letterSpacing: "0.2em", textTransform: "uppercase", margin: "0 0 10px" }}>
                  Sectors
                </p>
                {sectors.map(s => (
                  <div key={s.name} style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
                    <div style={{ width: 4, height: 4, background: ORANGE, flexShrink: 0 }} />
                    <span style={{ color: STEEL_LIGHT, fontSize: 12 }}>ProNaj {s.name} — {s.tag}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
