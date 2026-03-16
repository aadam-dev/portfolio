"use client";

interface Props { screen: string }

const rooms = [
  { name: "Deluxe King Room", size: "32 sqm", view: "City View", price: 420, beds: "1 King", available: true },
  { name: "Superior Twin Room", size: "28 sqm", view: "Garden View", price: 380, beds: "2 Singles", available: true },
  { name: "Executive Suite", size: "56 sqm", view: "Pool View", price: 680, beds: "1 King", available: false },
  { name: "Family Apartment", size: "72 sqm", view: "City View", price: 820, beds: "King + 2 Twins", available: true },
];

const amenities = [
  { name: "Infinity Pool", icon: "🏊" },
  { name: "Spa & Wellness", icon: "💆" },
  { name: "Rooftop Restaurant", icon: "🍽️" },
  { name: "24h Concierge", icon: "🛎️" },
  { name: "Business Centre", icon: "💼" },
  { name: "Airport Transfer", icon: "🚐" },
  { name: "Gym & Fitness", icon: "🏋️" },
  { name: "High-Speed WiFi", icon: "📶" },
];

export default function ThePalmsPreview({ screen }: Props) {
  if (screen === "rooms") return <Rooms />;
  if (screen === "amenities") return <Amenities />;
  return <Landing />;
}

function Landing() {
  return (
    <div style={{ background: "#09090A", minHeight: "100%", fontFamily: "Georgia, serif" }}>
      {/* Sticky header */}
      <nav style={{ padding: "16px 28px", display: "flex", alignItems: "center", justifyContent: "space-between", borderBottom: "1px solid rgba(201,169,110,0.12)" }}>
        <div>
          <p style={{ color: "#C9A96E", fontSize: 11, letterSpacing: "0.2em", margin: "0 0 1px", fontFamily: "system-ui" }}>THE PALMS BY</p>
          <p style={{ color: "#fff", fontSize: 18, fontWeight: 400, margin: 0, letterSpacing: "0.06em" }}>EAGLES ACCRA</p>
        </div>
        <div style={{ display: "flex", gap: 24, alignItems: "center" }}>
          {["Rooms", "Amenities", "Dining", "Gallery", "Contact"].map(l => (
            <span key={l} style={{ color: "rgba(255,255,255,0.45)", fontSize: 12, cursor: "pointer", letterSpacing: "0.05em", fontFamily: "system-ui" }}>{l}</span>
          ))}
          <button style={{ background: "#C9A96E", color: "#000", padding: "9px 20px", fontSize: 11, fontWeight: 700, border: "none", cursor: "pointer", letterSpacing: "0.08em", fontFamily: "system-ui" }}>
            BOOK NOW
          </button>
        </div>
      </nav>

      {/* Hero */}
      <div style={{ background: "linear-gradient(180deg, rgba(201,169,110,0.06) 0%, transparent 60%)", padding: "64px 28px 48px", textAlign: "center" }}>
        <div style={{ display: "inline-flex", alignItems: "center", gap: 6, marginBottom: 20 }}>
          {"⭐⭐⭐⭐".split("").map((s, i) => <span key={i} style={{ color: "#C9A96E", fontSize: 16 }}>★</span>)}
          <span style={{ color: "rgba(255,255,255,0.3)", fontSize: 12, marginLeft: 4, fontFamily: "system-ui" }}>4.3 · 119 Reviews</span>
        </div>
        <h1 style={{ color: "#fff", fontSize: 52, fontWeight: 400, lineHeight: 1.1, margin: "0 0 20px", letterSpacing: "-0.01em" }}>
          Where Accra's Finest<br />Come to Rest
        </h1>
        <div style={{ display: "flex", justifyContent: "center", gap: 8, marginBottom: 40 }}>
          {[1, 2, 3, 4].map(i => <div key={i} style={{ width: i === 1 ? 20 : 8, height: 2, background: i === 1 ? "#C9A96E" : "rgba(255,255,255,0.15)" }} />)}
        </div>
        <p style={{ color: "rgba(255,255,255,0.45)", fontSize: 15, lineHeight: 1.8, maxWidth: 480, margin: "0 auto 40px", fontFamily: "system-ui" }}>
          A boutique luxury hotel in the heart of Airport Residential, Accra. 42 rooms, rooftop pool, and award-winning dining.
        </p>

        {/* Booking widget */}
        <div style={{ display: "inline-flex", gap: 0, background: "rgba(255,255,255,0.04)", border: "1px solid rgba(201,169,110,0.2)", padding: 8, maxWidth: 600 }}>
          {[["Check-in", "Mar 21, 2026"], ["Check-out", "Mar 24, 2026"], ["Guests", "2 Adults"]].map(([label, val], i) => (
            <div key={label} style={{ padding: "8px 20px", borderRight: i < 2 ? "1px solid rgba(255,255,255,0.06)" : "none" }}>
              <p style={{ color: "rgba(255,255,255,0.3)", fontSize: 9, letterSpacing: "0.1em", margin: "0 0 3px", fontFamily: "system-ui" }}>{label.toUpperCase()}</p>
              <p style={{ color: "#fff", fontSize: 13, margin: 0 }}>{val}</p>
            </div>
          ))}
          <button style={{ background: "#C9A96E", color: "#000", padding: "8px 24px", fontSize: 11, fontWeight: 700, border: "none", cursor: "pointer", letterSpacing: "0.08em", marginLeft: 4, fontFamily: "system-ui" }}>
            CHECK AVAILABILITY
          </button>
        </div>
      </div>

      {/* Trust signals */}
      <div style={{ display: "flex", borderTop: "1px solid rgba(255,255,255,0.04)", padding: "0 28px" }}>
        {[["42", "Luxury Rooms"], ["⭐ 4.3", "Guest Rating"], ["3", "Dining Venues"], ["2012", "Est. in Accra"]].map(([val, label], i) => (
          <div key={label} style={{ flex: 1, padding: "20px 0", textAlign: "center", borderRight: i < 3 ? "1px solid rgba(255,255,255,0.04)" : "none" }}>
            <p style={{ color: "#C9A96E", fontSize: 22, fontWeight: 400, margin: "0 0 4px" }}>{val}</p>
            <p style={{ color: "rgba(255,255,255,0.35)", fontSize: 11, margin: 0, letterSpacing: "0.04em", fontFamily: "system-ui" }}>{label}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

function Rooms() {
  return (
    <div style={{ background: "#09090A", minHeight: "100%", fontFamily: "system-ui, sans-serif", padding: 24 }}>
      <p style={{ color: "rgba(255,255,255,0.3)", fontSize: 10, letterSpacing: "0.14em", margin: "0 0 8px" }}>ACCOMMODATION</p>
      <h2 style={{ color: "#fff", fontSize: 26, fontWeight: 400, letterSpacing: "-0.01em", margin: "0 0 28px", fontFamily: "Georgia" }}>Our Rooms & Suites</h2>

      <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        {rooms.map(r => (
          <div key={r.name} style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(201,169,110,0.1)", display: "flex", overflow: "hidden" }}>
            <div style={{ width: 180, background: "rgba(201,169,110,0.06)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, flexDirection: "column", gap: 6 }}>
              <span style={{ fontSize: 36 }}>🛏️</span>
              <p style={{ color: "rgba(201,169,110,0.5)", fontSize: 10, letterSpacing: "0.08em", margin: 0 }}>ROOM VIEW</p>
            </div>
            <div style={{ flex: 1, padding: 20 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                <div>
                  <h3 style={{ color: "#fff", fontSize: 16, fontWeight: 400, margin: "0 0 6px", fontFamily: "Georgia" }}>{r.name}</h3>
                  <div style={{ display: "flex", gap: 12 }}>
                    {[r.size, r.view, r.beds].map(detail => (
                      <span key={detail} style={{ color: "rgba(255,255,255,0.35)", fontSize: 11 }}>{detail}</span>
                    ))}
                  </div>
                </div>
                <div style={{ textAlign: "right" }}>
                  <p style={{ color: "#C9A96E", fontSize: 22, fontWeight: 400, margin: "0 0 3px", fontFamily: "Georgia" }}>$ {r.price}</p>
                  <p style={{ color: "rgba(255,255,255,0.3)", fontSize: 10, margin: "0 0 10px", letterSpacing: "0.04em" }}>PER NIGHT</p>
                  {r.available
                    ? <button style={{ background: "#C9A96E", color: "#000", padding: "8px 18px", fontSize: 11, fontWeight: 700, border: "none", cursor: "pointer", letterSpacing: "0.06em" }}>BOOK ROOM</button>
                    : <span style={{ color: "rgba(255,255,255,0.3)", fontSize: 11, letterSpacing: "0.04em" }}>SOLD OUT</span>
                  }
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function Amenities() {
  return (
    <div style={{ background: "#09090A", minHeight: "100%", fontFamily: "system-ui, sans-serif", padding: 28 }}>
      <p style={{ color: "rgba(255,255,255,0.3)", fontSize: 10, letterSpacing: "0.14em", margin: "0 0 8px" }}>HOTEL FACILITIES</p>
      <h2 style={{ color: "#fff", fontSize: 26, fontWeight: 400, letterSpacing: "-0.01em", margin: "0 0 32px", fontFamily: "Georgia" }}>Everything you need, and more.</h2>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 14, marginBottom: 32 }}>
        {amenities.map(a => (
          <div key={a.name} style={{ background: "rgba(201,169,110,0.04)", border: "1px solid rgba(201,169,110,0.1)", padding: "24px 16px", textAlign: "center" }}>
            <span style={{ fontSize: 32, display: "block", marginBottom: 12 }}>{a.icon}</span>
            <p style={{ color: "#fff", fontSize: 13, fontWeight: 400, margin: 0, letterSpacing: "0.02em", fontFamily: "Georgia" }}>{a.name}</p>
          </div>
        ))}
      </div>

      {/* CTA */}
      <div style={{ background: "rgba(201,169,110,0.06)", border: "1px solid rgba(201,169,110,0.15)", padding: "28px 32px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div>
          <h3 style={{ color: "#fff", fontSize: 20, fontWeight: 400, margin: "0 0 8px", fontFamily: "Georgia" }}>Ready to experience it in person?</h3>
          <p style={{ color: "rgba(255,255,255,0.4)", fontSize: 13, margin: 0 }}>Call us at +233 30 123 4567 or enquire online</p>
        </div>
        <div style={{ display: "flex", gap: 12 }}>
          <button style={{ background: "transparent", color: "#C9A96E", padding: "11px 22px", border: "1px solid #C9A96E", fontSize: 12, fontWeight: 600, cursor: "pointer", letterSpacing: "0.06em" }}>
            GET DIRECTIONS
          </button>
          <button style={{ background: "#C9A96E", color: "#000", padding: "11px 22px", fontSize: 12, fontWeight: 700, border: "none", cursor: "pointer", letterSpacing: "0.06em" }}>
            BOOK A STAY
          </button>
        </div>
      </div>
    </div>
  );
}
