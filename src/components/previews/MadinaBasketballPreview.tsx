"use client";

interface Props { screen: string }

const events = [
  { title: "Zurak vs Accra Aces", date: "Mar 22, 2026", time: "4:00 PM", type: "League Game", spots: 200 },
  { title: "Community Skills Clinic", date: "Mar 29, 2026", time: "9:00 AM", type: "Training", spots: 30 },
  { title: "Madina Old Gees Reunion Game", date: "Apr 5, 2026", time: "3:00 PM", type: "Alumni Game", spots: 150 },
];

export default function MadinaBasketballPreview({ screen }: Props) {
  if (screen === "court") return <Court />;
  if (screen === "events") return <Events />;
  return <Landing />;
}

function Landing() {
  return (
    <div style={{ background: "#004e89", minHeight: "100%", fontFamily: "system-ui, sans-serif" }}>
      <nav style={{ padding: "14px 28px", display: "flex", alignItems: "center", justifyContent: "space-between", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ width: 36, height: 36, borderRadius: 10, background: "#ff6b35", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <span style={{ fontSize: 18 }}>🏀</span>
          </div>
          <div>
            <span style={{ color: "#fff", fontWeight: 900, fontSize: 14, display: "block", lineHeight: 1.2, letterSpacing: "0.04em" }}>MADINA BASKETBALL</span>
            <span style={{ color: "rgba(255,255,255,0.4)", fontSize: 10 }}>Libya Quarters, Accra</span>
          </div>
        </div>
        <div style={{ display: "flex", gap: 20, alignItems: "center" }}>
          {["The Court", "Events", "Register", "Transparency"].map(l => (
            <span key={l} style={{ color: "rgba(255,255,255,0.5)", fontSize: 12, cursor: "pointer" }}>{l}</span>
          ))}
        </div>
      </nav>

      {/* Hero */}
      <div style={{ background: "linear-gradient(135deg, #004e89, #00366b, rgba(255,107,53,0.3))", padding: "56px 28px 40px" }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 48, alignItems: "center" }}>
          <div>
            <div style={{ display: "inline-flex", alignItems: "center", gap: 6, background: "rgba(255,210,63,0.1)", border: "1px solid rgba(255,210,63,0.25)", borderRadius: 100, padding: "5px 14px", marginBottom: 20 }}>
              <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#ffd23f" }} />
              <span style={{ color: "#ffd23f", fontSize: 11, fontWeight: 500 }}>Solar-Powered · Community-Built</span>
            </div>
            <h1 style={{ color: "#fff", fontSize: 42, fontWeight: 900, letterSpacing: "0.02em", lineHeight: 1.05, margin: "0 0 16px", textTransform: "uppercase" }}>
              MADINA<br />
              <span style={{ color: "#ff6b35" }}>BASKETBALL</span>
            </h1>
            <p style={{ color: "rgba(255,255,255,0.5)", fontSize: 14, lineHeight: 1.7, margin: "0 0 28px" }}>
              A Community-Built Court, Now Active. Libya Quarters' solar-powered basketball hub — open to all, run transparently.
            </p>
            <div style={{ display: "flex", gap: 12 }}>
              <button style={{ background: "#ff6b35", color: "#fff", padding: "11px 22px", borderRadius: 10, fontSize: 13, fontWeight: 700, border: "none", cursor: "pointer" }}>
                Register to Play
              </button>
              <button style={{ background: "transparent", color: "#fff", padding: "11px 22px", borderRadius: 10, fontSize: 13, fontWeight: 500, border: "1px solid rgba(255,255,255,0.1)", cursor: "pointer" }}>
                View Events
              </button>
            </div>
          </div>

          {/* Stats */}
          <div style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 16, padding: 24 }}>
            <p style={{ color: "rgba(255,255,255,0.4)", fontSize: 11, fontWeight: 600, letterSpacing: "0.06em", margin: "0 0 20px" }}>COMMUNITY STATS</p>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 20 }}>
              {[["GHS 44,750", "Raised for Court", "#ff6b35"], ["150+", "Players Registered", "#fff"], ["12+", "Events Hosted", "#fff"], ["Solar", "Powered Court", "#ffd23f"]].map(([val, label, color]) => (
                <div key={label} style={{ textAlign: "center" }}>
                  <div style={{ color, fontSize: 20, fontWeight: 800 }}>{val}</div>
                  <div style={{ color: "rgba(255,255,255,0.4)", fontSize: 10, marginTop: 3 }}>{label}</div>
                </div>
              ))}
            </div>
            <div style={{ height: 1, background: "rgba(255,255,255,0.06)", marginBottom: 16 }} />
            <p style={{ color: "rgba(255,255,255,0.4)", fontSize: 11, margin: "0 0 10px" }}>Home Teams</p>
            <div style={{ display: "flex", gap: 8 }}>
              {["Zurak Basketball", "Madina Old Gees"].map(team => (
                <div key={team} style={{ flex: 1, background: "rgba(255,107,53,0.1)", borderRadius: 8, padding: "8px 12px", textAlign: "center" }}>
                  <span style={{ color: "#ff6b35", fontSize: 12, fontWeight: 600 }}>{team}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Next event banner */}
      <div style={{ margin: "0 28px 40px", padding: 16, background: "rgba(255,107,53,0.1)", border: "1px solid rgba(255,107,53,0.25)", borderRadius: 12, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div style={{ display: "flex", gap: 14, alignItems: "center" }}>
          <span style={{ fontSize: 24 }}>🏀</span>
          <div>
            <p style={{ color: "#fff", fontSize: 13, fontWeight: 700, margin: "0 0 2px" }}>Next Up: Zurak vs Accra Aces</p>
            <p style={{ color: "rgba(255,255,255,0.4)", fontSize: 12, margin: 0 }}>Saturday, March 22 · 4:00 PM · Libya Quarters Court</p>
          </div>
        </div>
        <button style={{ background: "#ff6b35", color: "#fff", padding: "8px 18px", borderRadius: 8, fontSize: 12, fontWeight: 700, border: "none", cursor: "pointer" }}>
          Book Spot
        </button>
      </div>
    </div>
  );
}

function Court() {
  return (
    <div style={{ background: "#003366", minHeight: "100%", fontFamily: "system-ui, sans-serif", padding: 24 }}>
      <p style={{ color: "#ff6b35", fontSize: 11, fontWeight: 700, letterSpacing: "0.08em", margin: "0 0 8px" }}>THE COURT</p>
      <h2 style={{ color: "#fff", fontSize: 22, fontWeight: 900, letterSpacing: "0.02em", margin: "0 0 4px", textTransform: "uppercase" }}>Libya Quarters Court</h2>
      <p style={{ color: "rgba(255,255,255,0.4)", fontSize: 13, margin: "0 0 24px" }}>Community-funded · Solar-powered · Publicly accessible</p>

      {/* Court visual */}
      <div style={{ background: "linear-gradient(135deg, rgba(255,107,53,0.12), rgba(255,107,53,0.04))", border: "1px solid rgba(255,107,53,0.2)", borderRadius: 16, height: 160, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 24, flexDirection: "column", gap: 8 }}>
        <span style={{ fontSize: 48 }}>🏀</span>
        <p style={{ color: "rgba(255,107,53,0.6)", fontSize: 11, letterSpacing: "0.1em", margin: 0 }}>OUTDOOR FULL COURT · 28m × 15m</p>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 24 }}>
        <div style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 12, padding: 18 }}>
          <p style={{ color: "rgba(255,255,255,0.4)", fontSize: 11, fontWeight: 600, letterSpacing: "0.06em", margin: "0 0 14px" }}>FEATURES</p>
          {["Solar-powered floodlights", "Regulation backboards", "Painted court markings", "Covered seating area", "Public water access"].map(f => (
            <div key={f} style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
              <span style={{ color: "#ff6b35", fontSize: 12 }}>✓</span>
              <span style={{ color: "rgba(255,255,255,0.6)", fontSize: 13 }}>{f}</span>
            </div>
          ))}
        </div>
        <div>
          <div style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 12, padding: 18, marginBottom: 14 }}>
            <p style={{ color: "rgba(255,255,255,0.4)", fontSize: 11, fontWeight: 600, letterSpacing: "0.06em", margin: "0 0 14px" }}>FUNDED BY COMMUNITY</p>
            <div style={{ marginBottom: 10 }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                <span style={{ color: "rgba(255,255,255,0.6)", fontSize: 12 }}>GHS 44,750 raised</span>
                <span style={{ color: "#ff6b35", fontSize: 12, fontWeight: 600 }}>89%</span>
              </div>
              <div style={{ height: 8, background: "rgba(255,255,255,0.08)", borderRadius: 4 }}>
                <div style={{ height: 8, width: "89%", background: "#ff6b35", borderRadius: 4 }} />
              </div>
            </div>
            <p style={{ color: "rgba(255,255,255,0.35)", fontSize: 11, margin: 0 }}>Goal: GHS 50,000 · 214 contributors</p>
          </div>
          <div style={{ background: "rgba(255,210,63,0.06)", border: "1px solid rgba(255,210,63,0.15)", borderRadius: 12, padding: 14 }}>
            <p style={{ color: "#ffd23f", fontSize: 12, fontWeight: 600, margin: "0 0 6px" }}>🌞 Solar Impact</p>
            <p style={{ color: "rgba(255,255,255,0.5)", fontSize: 12, margin: 0, lineHeight: 1.5 }}>Solar panels installed Q4 2025. Court operational until 10PM daily at zero energy cost.</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function Events() {
  return (
    <div style={{ background: "#003366", minHeight: "100%", fontFamily: "system-ui, sans-serif", padding: 24 }}>
      <p style={{ color: "#ff6b35", fontSize: 11, fontWeight: 700, letterSpacing: "0.08em", margin: "0 0 8px" }}>UPCOMING EVENTS</p>
      <h2 style={{ color: "#fff", fontSize: 22, fontWeight: 900, letterSpacing: "0.02em", margin: "0 0 4px", textTransform: "uppercase" }}>Events & Games</h2>
      <p style={{ color: "rgba(255,255,255,0.4)", fontSize: 13, margin: "0 0 24px" }}>Open to community · Book your spot</p>

      <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
        {events.map((ev, i) => (
          <div key={ev.title} style={{ background: "rgba(255,255,255,0.03)", border: `1px solid ${i === 0 ? "rgba(255,107,53,0.3)" : "rgba(255,255,255,0.07)"}`, borderRadius: 14, padding: 18, display: "flex", gap: 16, alignItems: "center" }}>
            <div style={{ width: 60, height: 60, borderRadius: 12, background: i === 0 ? "rgba(255,107,53,0.15)" : "rgba(255,255,255,0.04)", border: `1px solid ${i === 0 ? "rgba(255,107,53,0.3)" : "rgba(255,255,255,0.08)"}`, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
              <span style={{ color: i === 0 ? "#ff6b35" : "#fff", fontWeight: 800, fontSize: 16, lineHeight: 1 }}>{ev.date.split(" ")[1].replace(",", "")}</span>
              <span style={{ color: i === 0 ? "rgba(255,107,53,0.6)" : "rgba(255,255,255,0.3)", fontSize: 9, marginTop: 2 }}>{ev.date.split(" ")[0].toUpperCase()}</span>
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ display: "flex", gap: 8, alignItems: "center", marginBottom: 5 }}>
                <p style={{ color: "#fff", fontSize: 14, fontWeight: 700, margin: 0 }}>{ev.title}</p>
                <span style={{ background: "rgba(255,107,53,0.1)", color: "#ff6b35", padding: "2px 8px", borderRadius: 100, fontSize: 10, fontWeight: 600 }}>{ev.type}</span>
              </div>
              <p style={{ color: "rgba(255,255,255,0.4)", fontSize: 12, margin: "0 0 8px" }}>🕐 {ev.time} · 📍 Libya Quarters Court</p>
              <span style={{ background: "rgba(255,255,255,0.05)", color: "rgba(255,255,255,0.4)", padding: "3px 8px", borderRadius: 100, fontSize: 10 }}>
                {ev.spots} spots available
              </span>
            </div>
            <button style={{ padding: "10px 18px", borderRadius: 10, background: i === 0 ? "#ff6b35" : "rgba(255,107,53,0.1)", color: i === 0 ? "#fff" : "#ff6b35", fontSize: 12, fontWeight: 700, border: i === 0 ? "none" : "1px solid rgba(255,107,53,0.2)", cursor: "pointer", flexShrink: 0 }}>
              Register
            </button>
          </div>
        ))}
      </div>

      <div style={{ marginTop: 20, padding: 16, background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 12 }}>
        <p style={{ color: "rgba(255,255,255,0.5)", fontSize: 12, fontWeight: 600, margin: "0 0 10px" }}>PLAYER REGISTRATION</p>
        <p style={{ color: "rgba(255,255,255,0.35)", fontSize: 12, margin: "0 0 12px" }}>150+ players registered for the 2025–26 season. Teams: Zurak Basketball & Madina Old Gees.</p>
        <button style={{ background: "#ff6b35", color: "#fff", padding: "8px 18px", borderRadius: 8, fontSize: 12, fontWeight: 600, border: "none", cursor: "pointer" }}>
          Register as Player
        </button>
      </div>
    </div>
  );
}
