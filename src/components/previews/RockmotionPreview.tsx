"use client";

interface Props { screen: string }

export default function RockmotionPreview({ screen }: Props) {
  if (screen === "inventory") return <Inventory />;
  if (screen === "process") return <Process />;
  return <Landing />;
}

/* ─── SHARED STYLES ─────────────────────────────────────────────────── */
const mono = "'JetBrains Mono', 'Fira Mono', 'Courier New', monospace";
const outfit = "'Outfit', 'Inter', system-ui, sans-serif";
const blue = "#2563EB";
const darkBg = "#0A0A0B";
const cardBg = "#111113";
const border = "rgba(255,255,255,0.08)";

/* ─── LANDING ────────────────────────────────────────────────────────── */
function Landing() {
  const stats = [
    { val: "500+", label: "Vehicles Exported" },
    { val: "40+",  label: "Countries Served" },
    { val: "98%",  label: "On-Time Delivery" },
    { val: "$0",   label: "Hidden Fees" },
  ];

  return (
    <div style={{ background: darkBg, minHeight: "100%", fontFamily: outfit, position: "relative", overflow: "hidden" }}>

      {/* Navbar */}
      <nav style={{
        display: "flex", alignItems: "center", justifyContent: "space-between",
        padding: "14px 28px", borderBottom: `1px solid ${border}`,
        background: "rgba(10,10,11,0.9)", position: "relative", zIndex: 10,
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          {/* RM logo mark */}
          <div style={{
            width: 30, height: 30, background: blue, borderRadius: 6,
            display: "flex", alignItems: "center", justifyContent: "center",
            flexShrink: 0,
          }}>
            <span style={{ color: "#fff", fontWeight: 900, fontSize: 13, fontFamily: mono, letterSpacing: "-0.04em" }}>RM</span>
          </div>
          <div style={{ display: "flex", flexDirection: "column", lineHeight: 1 }}>
            <span style={{ color: "#fff", fontWeight: 800, fontSize: 12, letterSpacing: "0.12em", fontFamily: outfit }}>ROCKMOTION</span>
            <span style={{ color: "#475569", fontSize: 8, letterSpacing: "0.18em", fontFamily: mono, marginTop: 2 }}>AUTO GROUP</span>
          </div>
        </div>
        <div style={{ display: "flex", gap: 20, alignItems: "center" }}>
          {["Inventory", "Process", "Shipping", "Contact"].map(l => (
            <span key={l} style={{ color: "#64748B", fontSize: 11, fontFamily: outfit, cursor: "pointer", letterSpacing: "0.05em" }}>{l}</span>
          ))}
          <button style={{
            background: blue, color: "#fff", fontSize: 10, fontWeight: 700,
            padding: "6px 14px", borderRadius: 4, border: "none", cursor: "pointer",
            fontFamily: outfit, letterSpacing: "0.08em", textTransform: "uppercase",
          }}>Browse Inventory</button>
        </div>
      </nav>

      {/* Hero */}
      <div style={{ position: "relative", minHeight: 360, display: "flex", alignItems: "center" }}>
        {/* BG image */}
        <div style={{
          position: "absolute", inset: 0,
          backgroundImage: "url('https://images.unsplash.com/photo-1544636331-e26879cd4d9b?w=1200&q=70')",
          backgroundSize: "cover", backgroundPosition: "center",
        }} />
        {/* Gradient overlays */}
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to bottom, rgba(10,10,11,0.75) 0%, rgba(10,10,11,0.55) 50%, rgba(10,10,11,1) 100%)" }} />
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to right, rgba(10,10,11,0.7) 0%, transparent 60%)" }} />
        {/* Blue glow */}
        <div style={{
          position: "absolute", top: "30%", left: "30%",
          width: 400, height: 280, background: "rgba(37,99,235,0.08)",
          borderRadius: "50%", filter: "blur(80px)", pointerEvents: "none",
        }} />

        {/* Content */}
        <div style={{ position: "relative", zIndex: 2, padding: "60px 28px 32px" }}>
          {/* Badge */}
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 20 }}>
            <div style={{ width: 24, height: 1, background: blue }} />
            <span style={{ color: blue, fontSize: 9, fontWeight: 700, fontFamily: mono, letterSpacing: "0.2em", textTransform: "uppercase" }}>
              Licensed Dealer & Broker · Atlanta, Georgia
            </span>
          </div>

          {/* Headline */}
          <h1 style={{ margin: 0, lineHeight: 0.9, letterSpacing: "-0.03em" }}>
            <span style={{ display: "block", color: "#fff", fontSize: 48, fontWeight: 900, fontFamily: outfit }}>THE SHORTEST</span>
            <span style={{
              display: "block", fontSize: 48, fontWeight: 900, fontFamily: outfit,
              background: `linear-gradient(135deg, ${blue} 0%, #60A5FA 100%)`,
              WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
            }}>DISTANCE</span>
            <span style={{ display: "block", color: "#fff", fontSize: 48, fontWeight: 900, fontFamily: outfit }}>TO THE AMERICAN</span>
            <span style={{ display: "block", color: "#CBD5E1", fontSize: 48, fontWeight: 900, fontFamily: outfit }}>ROAD.</span>
          </h1>

          {/* Subtext */}
          <p style={{ color: "#94A3B8", fontSize: 13, lineHeight: 1.7, margin: "20px 0 24px", maxWidth: 420, fontFamily: outfit }}>
            You can own any vehicle from the US market — without ever setting foot on American soil.
            Rockmotion sources, verifies, and ships globally.
          </p>

          {/* CTAs */}
          <div style={{ display: "flex", gap: 12 }}>
            <button style={{
              background: blue, color: "#fff", padding: "11px 22px", borderRadius: 4,
              fontSize: 11, fontWeight: 700, fontFamily: outfit, border: "none",
              cursor: "pointer", letterSpacing: "0.08em", textTransform: "uppercase",
            }}>Browse Inventory →</button>
            <button style={{
              background: "transparent", color: "#CBD5E1", padding: "11px 22px", borderRadius: 4,
              fontSize: 11, fontWeight: 600, fontFamily: outfit,
              border: "1px solid rgba(255,255,255,0.15)", cursor: "pointer",
              letterSpacing: "0.08em", textTransform: "uppercase",
            }}>Shipping Calculator</button>
          </div>
        </div>
      </div>

      {/* Stats bar */}
      <div style={{
        display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr",
        borderTop: `1px solid ${border}`, borderBottom: `1px solid ${border}`,
        margin: "0 28px 32px",
        border: `1px solid ${border}`, borderRadius: 10, overflow: "hidden",
      }}>
        {stats.map((s, i) => (
          <div key={s.label} style={{
            padding: "18px 16px", textAlign: "center",
            borderRight: i < 3 ? `1px solid ${border}` : "none",
            background: cardBg,
          }}>
            <div style={{ color: "#fff", fontSize: 28, fontWeight: 900, fontFamily: mono, lineHeight: 1 }}>{s.val}</div>
            <div style={{ color: "#475569", fontSize: 9, fontFamily: mono, letterSpacing: "0.12em", textTransform: "uppercase", marginTop: 6 }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* How it works — 3 steps */}
      <div style={{ padding: "0 28px 36px" }}>
        <div style={{ textAlign: "center", marginBottom: 22 }}>
          <span style={{ color: blue, fontSize: 9, fontFamily: mono, letterSpacing: "0.18em", textTransform: "uppercase" }}>How It Works</span>
          <div style={{ color: "#fff", fontSize: 22, fontWeight: 900, fontFamily: outfit, marginTop: 6 }}>Simple. Transparent. Global.</div>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12 }}>
          {[
            { num: "01", icon: "🔍", title: "We Source the Vehicle", desc: "Full US market access — dealers, auctions, private sellers." },
            { num: "02", icon: "🛡", title: "VIN Check & Crash Analysis", desc: "Full history report and professional crash analysis before export." },
            { num: "03", icon: "🚢", title: "Shipped to Your Port", desc: "Marine insurance, live tracking, and full export documentation." },
          ].map(s => (
            <div key={s.num} style={{
              background: cardBg, border: `1px solid ${border}`, borderRadius: 10, padding: 16,
            }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 12 }}>
                <span style={{ color: "rgba(255,255,255,0.04)", fontSize: 32, fontWeight: 900, fontFamily: mono, lineHeight: 1 }}>{s.num}</span>
                <div style={{
                  width: 32, height: 32, background: "rgba(37,99,235,0.1)",
                  border: `1px solid rgba(37,99,235,0.2)`, borderRadius: 8,
                  display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14,
                }}>{s.icon}</div>
              </div>
              <div style={{ color: "#fff", fontSize: 12, fontWeight: 700, fontFamily: outfit, marginBottom: 6 }}>{s.title}</div>
              <div style={{ color: "#64748B", fontSize: 11, lineHeight: 1.55, fontFamily: outfit }}>{s.desc}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ─── INVENTORY ──────────────────────────────────────────────────────── */
function Inventory() {
  const vehicles = [
    { year: 2023, make: "Lamborghini", model: "Urus", price: 289900, mileage: 1200, badge: "Exotic", body: "SUV", color: "Giallo Belenus Yellow", vin: "ZPBUA1ZL1PLA...12" },
    { year: 2024, make: "Rolls-Royce", model: "Ghost", price: 345000, mileage: 800, badge: "Exotic", body: "Sedan", color: "Arctic White", vin: "SCA664S54PUX...09" },
    { year: 2023, make: "Porsche", model: "Cayenne Turbo", price: 142000, mileage: 4100, badge: "Performance", body: "SUV", color: "Jet Black Metallic", vin: "WP1AC2AY7PDA...31" },
    { year: 2024, make: "Chevrolet", model: "Corvette Stingray", price: 74900, mileage: 2300, badge: "Performance", body: "Coupe", color: "Rapid Blue", vin: "1G1YB3D42R510...55" },
    { year: 2023, make: "BMW", model: "X7 M60i", price: 118500, mileage: 6200, badge: "Premium", body: "SUV", color: "Black Sapphire", vin: "5UXCW2C07P9B...17" },
    { year: 2024, make: "Mercedes-Benz", model: "G 63 AMG", price: 238000, mileage: 1800, badge: "Exotic", body: "SUV", color: "Obsidian Black", vin: "W1NYC7HJ2RX0...44" },
  ];

  const badgeColor: Record<string, string> = {
    Exotic: "#F59E0B",
    Performance: "#F97316",
    Premium: "#8B5CF6",
    Electric: "#10B981",
    "Like New": "#0EA5E9",
    "New Arrival": blue,
  };

  return (
    <div style={{ background: darkBg, minHeight: "100%", fontFamily: outfit }}>
      {/* Header */}
      <div style={{ padding: "24px 24px 16px", borderBottom: `1px solid ${border}` }}>
        <span style={{ color: blue, fontSize: 9, fontFamily: mono, letterSpacing: "0.18em", textTransform: "uppercase" }}>Digital Showroom</span>
        <h2 style={{ color: "#fff", fontSize: 26, fontWeight: 900, margin: "6px 0 4px", fontFamily: outfit, letterSpacing: "-0.02em" }}>The Collection</h2>
        <p style={{ color: "#64748B", fontSize: 12, margin: 0 }}>Premium US-spec vehicles, inspected and ready for global export.</p>
      </div>

      {/* Filter bar */}
      <div style={{ padding: "10px 24px", borderBottom: `1px solid ${border}`, display: "flex", gap: 8, alignItems: "center", background: "rgba(10,10,11,0.95)" }}>
        <div style={{
          flex: 1, background: "#1A1A1D", border: `1px solid ${border}`, borderRadius: 8,
          padding: "7px 12px", display: "flex", alignItems: "center", gap: 8,
        }}>
          <span style={{ color: "#475569", fontSize: 11 }}>🔍</span>
          <span style={{ color: "#475569", fontSize: 11, fontFamily: mono }}>Search make, model, year...</span>
        </div>
        {["Make", "Body", "Price", "Year"].map(f => (
          <div key={f} style={{
            background: "#1A1A1D", border: `1px solid ${border}`, borderRadius: 8,
            padding: "7px 10px", fontSize: 10, color: "#64748B", fontFamily: mono, cursor: "pointer",
          }}>{f} ▾</div>
        ))}
        <div style={{ fontSize: 10, color: "#64748B", fontFamily: mono }}>Showing {vehicles.length} vehicles</div>
      </div>

      {/* Grid */}
      <div style={{ padding: 20, display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 14 }}>
        {vehicles.map(v => (
          <div key={v.vin} style={{
            background: cardBg, border: `1px solid ${border}`, borderRadius: 12, overflow: "hidden", cursor: "pointer",
          }}>
            {/* Image placeholder with gradient */}
            <div style={{
              height: 120, position: "relative", overflow: "hidden",
              background: `linear-gradient(135deg, #1A1A1D 0%, #0F172A 100%)`,
              display: "flex", alignItems: "center", justifyContent: "center",
            }}>
              <span style={{ fontSize: 36 }}>
                {v.make === "Lamborghini" ? "🏎" :
                 v.make === "Rolls-Royce" ? "🚗" :
                 v.model.includes("Corvette") ? "🏁" :
                 v.make === "Mercedes-Benz" ? "⭐" : "🚙"}
              </span>
              <div style={{ position: "absolute", top: 8, left: 8 }}>
                <span style={{
                  background: badgeColor[v.badge] ?? blue, color: v.badge === "Exotic" ? "#000" : "#fff",
                  fontSize: 8, fontWeight: 700, fontFamily: mono, padding: "3px 8px", borderRadius: 4,
                  letterSpacing: "0.08em", textTransform: "uppercase",
                }}>{v.badge}</span>
              </div>
              <div style={{ position: "absolute", top: 8, right: 8 }}>
                <span style={{
                  background: "rgba(10,10,11,0.8)", color: "#64748B",
                  fontSize: 8, fontFamily: mono, padding: "3px 8px", borderRadius: 4,
                }}>{v.body}</span>
              </div>
            </div>
            <div style={{ padding: 12 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 4 }}>
                <div>
                  <p style={{ color: "#64748B", fontSize: 9, fontFamily: mono, margin: "0 0 2px" }}>{v.year} · {v.color}</p>
                  <p style={{ color: "#fff", fontSize: 13, fontWeight: 700, margin: 0, fontFamily: outfit }}>{v.make} {v.model}</p>
                </div>
                <p style={{ color: "#fff", fontSize: 16, fontWeight: 900, fontFamily: mono, margin: 0 }}>
                  ${v.price.toLocaleString()}
                </p>
              </div>
              <p style={{ color: "rgba(100,116,139,0.5)", fontSize: 8, fontFamily: mono, margin: "4px 0 8px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>VIN: {v.vin}</p>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderTop: `1px solid ${border}`, paddingTop: 8 }}>
                <span style={{ color: "#64748B", fontSize: 9, fontFamily: mono }}>📈 {v.mileage.toLocaleString()} mi</span>
                <span style={{ color: "#10B981", fontSize: 9, fontFamily: mono }}>✓ Export Ready</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ─── PROCESS ────────────────────────────────────────────────────────── */
function Process() {
  const steps = [
    {
      num: "01",
      icon: "🔍",
      title: "Vehicle Sourcing",
      desc: "We access the full US market — dealers, auctions, and private sellers across all 50 states. Tell us your make, model, trim, and budget. We locate it.",
    },
    {
      num: "02",
      icon: "🛡",
      title: "VIN Check & Crash Analysis",
      desc: "A clean title does not guarantee an accident-free vehicle. Our professional crash analysis and full VIN history report give you the complete picture before you commit.",
    },
    {
      num: "03",
      icon: "🚢",
      title: "US Port Loading",
      desc: "Your vehicle is securely prepared and loaded at a major US port under comprehensive marine cargo insurance. All export documentation is handled by our team.",
    },
    {
      num: "04",
      icon: "🌍",
      title: "Delivered to Your Destination",
      desc: "Live tracking from port to port. You handle customs clearance at your end — we provide all required documentation to make that process straightforward.",
    },
  ];

  const trust = [
    { icon: "🛡", title: "Professional Crash Analysis", desc: "Full VIN history and structural damage report on every vehicle." },
    { icon: "📄", title: "Verified & Documented", desc: "Carfax, service history, and HD inspection gallery before payment." },
    { icon: "⚡", title: "Licensed Dealer & Broker", desc: "Georgia-licensed. Every transaction is professionally documented." },
  ];

  return (
    <div style={{ background: darkBg, minHeight: "100%", fontFamily: outfit }}>
      {/* Header */}
      <div style={{ padding: "24px 24px 20px", borderBottom: `1px solid ${border}`, textAlign: "center" }}>
        <span style={{ color: blue, fontSize: 9, fontFamily: mono, letterSpacing: "0.18em", textTransform: "uppercase" }}>End-to-End</span>
        <h2 style={{ color: "#fff", fontSize: 24, fontWeight: 900, margin: "6px 0 4px", fontFamily: outfit, letterSpacing: "-0.02em" }}>Rockmotion Reliable Process</h2>
        <p style={{ color: "#64748B", fontSize: 12, margin: 0 }}>Four proven steps, zero guesswork. Your vehicle's journey, fully managed.</p>
      </div>

      {/* Steps */}
      <div style={{ padding: "20px 24px", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
        {steps.map(s => (
          <div key={s.num} style={{
            background: cardBg, border: `1px solid ${border}`, borderRadius: 12, padding: 16,
            display: "flex", gap: 14,
          }}>
            <div style={{ flexShrink: 0 }}>
              <div style={{
                width: 40, height: 40,
                background: "rgba(37,99,235,0.1)", border: "1px solid rgba(37,99,235,0.2)",
                borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 18,
              }}>{s.icon}</div>
            </div>
            <div>
              <div style={{ color: blue, fontSize: 8, fontFamily: mono, letterSpacing: "0.18em", textTransform: "uppercase", marginBottom: 4 }}>Step {s.num}</div>
              <div style={{ color: "#fff", fontSize: 13, fontWeight: 700, marginBottom: 6, fontFamily: outfit }}>{s.title}</div>
              <div style={{ color: "#64748B", fontSize: 11, lineHeight: 1.6, fontFamily: outfit }}>{s.desc}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Trust section */}
      <div style={{ padding: "0 24px 28px" }}>
        <div style={{ textAlign: "center", marginBottom: 16 }}>
          <span style={{ color: blue, fontSize: 9, fontFamily: mono, letterSpacing: "0.18em", textTransform: "uppercase" }}>Why Rockmotion</span>
          <div style={{ color: "#fff", fontSize: 20, fontWeight: 900, fontFamily: outfit, marginTop: 6 }}>Driven by Precision</div>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12 }}>
          {trust.map(t => (
            <div key={t.title} style={{
              background: cardBg, border: `1px solid ${border}`, borderRadius: 12,
              padding: 16, textAlign: "center",
            }}>
              <div style={{
                width: 44, height: 44, background: "rgba(37,99,235,0.1)", border: "1px solid rgba(37,99,235,0.2)",
                borderRadius: 12, display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 20, margin: "0 auto 12px",
              }}>{t.icon}</div>
              <div style={{ color: "#fff", fontSize: 12, fontWeight: 700, fontFamily: outfit, marginBottom: 6 }}>{t.title}</div>
              <div style={{ color: "#64748B", fontSize: 11, lineHeight: 1.55, fontFamily: outfit }}>{t.desc}</div>
            </div>
          ))}
        </div>

        {/* CTA card */}
        <div style={{
          marginTop: 16, background: "linear-gradient(135deg, rgba(37,99,235,0.12) 0%, rgba(10,10,11,0) 100%)",
          border: `1px solid rgba(37,99,235,0.2)`, borderRadius: 14, padding: "24px 28px",
          textAlign: "center",
        }}>
          <span style={{ color: blue, fontSize: 9, fontFamily: mono, letterSpacing: "0.18em", textTransform: "uppercase" }}>Ready to Start?</span>
          <div style={{ color: "#fff", fontSize: 22, fontWeight: 900, fontFamily: outfit, marginTop: 8, marginBottom: 6 }}>
            Move Smart. <span style={{
              background: `linear-gradient(135deg, ${blue} 0%, #60A5FA 100%)`,
              WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
            }}>Start Here.</span>
          </div>
          <p style={{ color: "#64748B", fontSize: 12, margin: "0 0 16px", fontFamily: outfit }}>
            Tell us what you're looking for — make, model, year, budget. We'll source it, verify it, and deliver it.
          </p>
          <div style={{ display: "flex", gap: 10, justifyContent: "center" }}>
            <button style={{
              background: blue, color: "#fff", padding: "10px 20px", borderRadius: 4,
              fontSize: 10, fontWeight: 700, fontFamily: outfit, border: "none",
              cursor: "pointer", letterSpacing: "0.08em", textTransform: "uppercase",
            }}>Browse Inventory →</button>
            <button style={{
              background: "transparent", color: "#10B981", padding: "10px 20px", borderRadius: 4,
              fontSize: 10, fontWeight: 600, fontFamily: outfit,
              border: "1px solid rgba(16,185,129,0.3)", cursor: "pointer",
              letterSpacing: "0.05em", textTransform: "uppercase",
            }}>💬 WhatsApp Concierge</button>
          </div>
        </div>
      </div>
    </div>
  );
}
