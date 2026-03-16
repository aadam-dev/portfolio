"use client";

interface Props { screen: string }

const portfolio = [
  { name: "AuroraPay", sector: "FinTech", region: "East Africa", stage: "Series A", raise: "$2.1M", status: "Active" },
  { name: "Verdant Lace", sector: "Sustainable Fashion", region: "West Africa", stage: "Seed", raise: "$480K", status: "Active" },
  { name: "Helia Health", sector: "HealthTech", region: "Pan-Africa", stage: "Pre-Seed", raise: "$220K", status: "Active" },
  { name: "CivicGrid", sector: "GovTech", region: "Southern Africa", stage: "Seed", raise: "$750K", status: "Exited" },
  { name: "Mesa Markets", sector: "AgriSupply", region: "East Africa", stage: "Series A", raise: "$1.8M", status: "Active" },
];

export default function LadyAngelPreview({ screen }: Props) {
  if (screen === "membership") return <Membership />;
  if (screen === "portfolio") return <Portfolio />;
  return <Landing />;
}

function Landing() {
  return (
    <div style={{ background: "#fafaf9", minHeight: "100%", fontFamily: "system-ui, sans-serif" }}>
      {/* Nav */}
      <nav style={{ padding: "16px 32px", display: "flex", alignItems: "center", justifyContent: "space-between", borderBottom: "1px solid #e5e7eb", background: "#fafaf9" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ width: 32, height: 32, borderRadius: "50%", background: "#f97316", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <span style={{ color: "#fff", fontSize: 15, lineHeight: 1 }}>✦</span>
          </div>
          <span style={{ color: "#111827", fontWeight: 600, fontSize: 15 }}>Lady Angel Network</span>
        </div>
        <div style={{ display: "flex", gap: 24, alignItems: "center" }}>
          {["About", "Membership", "Portfolio", "Deal Flow"].map(l => (
            <span key={l} style={{ color: "#6b7280", fontSize: 12, cursor: "pointer" }}>{l}</span>
          ))}
          <button style={{ background: "#f97316", color: "#fff", padding: "7px 16px", borderRadius: 6, fontSize: 12, fontWeight: 600, border: "none", cursor: "pointer" }}>
            Apply
          </button>
        </div>
      </nav>

      {/* Hero */}
      <div style={{ padding: "72px 64px 56px", maxWidth: 760, margin: "0 auto", textAlign: "center" }}>
        {/* Invitation-only label */}
        <p style={{ color: "#f97316", fontSize: 11, fontWeight: 600, letterSpacing: "0.14em", margin: "0 0 28px", textTransform: "uppercase" }}>
          INVITATION-ONLY · WOMEN-LED CAPITAL
        </p>

        {/* Buckminster Fuller blockquote */}
        <blockquote style={{
          borderLeft: "3px solid rgba(249,115,22,0.6)",
          paddingLeft: 20,
          margin: "0 auto 28px",
          maxWidth: 500,
          textAlign: "left",
          color: "#6b7280",
          fontStyle: "italic",
          fontSize: 13,
          lineHeight: 1.7,
        }}>
          "You never change things by fighting the existing reality. To change something, build a new model that makes the existing model obsolete."
          <br />
          <span style={{ fontStyle: "normal", fontWeight: 600, fontSize: 12, color: "#9ca3af" }}>— Buckminster Fuller</span>
        </blockquote>

        {/* H1 */}
        <h1 style={{ color: "#111827", fontSize: 44, fontWeight: 400, lineHeight: 1.1, margin: "0 0 24px", letterSpacing: "-0.02em", fontFamily: "Georgia, serif" }}>
          Making the<br />
          <span style={{ fontWeight: 700, color: "#f97316" }}>Existing Model</span>
          <br />
          Obsolete.
        </h1>

        {/* Thin orange divider */}
        <div style={{ width: 48, height: 2, background: "#f97316", margin: "0 auto 24px" }} />

        {/* Subtitle */}
        <p style={{ color: "#6b7280", fontSize: 15, lineHeight: 1.8, margin: "0 0 28px" }}>
          A private investment network where women deploy capital into women-led ventures. Structured deal flow, five investment models, and Pan-African portfolio management.
        </p>

        {/* Legacy / LAN comparison card */}
        <div style={{
          background: "rgba(249,115,22,0.04)",
          border: "1px solid rgba(249,115,22,0.15)",
          borderRadius: 12,
          padding: "16px 20px",
          maxWidth: 480,
          margin: "0 auto 32px",
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: 12,
          textAlign: "left",
        }}>
          {/* Column headers */}
          <div style={{ color: "#9ca3af", fontSize: 11, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.08em", paddingBottom: 8, borderBottom: "1px solid rgba(249,115,22,0.12)" }}>
            Legacy VC
          </div>
          <div style={{ color: "#f97316", fontSize: 11, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.08em", paddingBottom: 8, borderBottom: "1px solid rgba(249,115,22,0.12)" }}>
            LAN
          </div>
          {/* Row 1 */}
          <div style={{ color: "#9ca3af", fontSize: 12, paddingTop: 8, textDecoration: "line-through" }}>Male-dominated</div>
          <div style={{ color: "#374151", fontSize: 12, paddingTop: 8 }}>Women-led capital</div>
          {/* Row 2 */}
          <div style={{ color: "#9ca3af", fontSize: 12, textDecoration: "line-through" }}>Opaque deal flow</div>
          <div style={{ color: "#374151", fontSize: 12 }}>Structured pipeline</div>
          {/* Row 3 */}
          <div style={{ color: "#9ca3af", fontSize: 12, textDecoration: "line-through" }}>Exclusionary</div>
          <div style={{ color: "#374151", fontSize: 12 }}>Invitation + aligned</div>
        </div>

        {/* CTA buttons */}
        <div style={{ display: "flex", gap: 12, justifyContent: "center", marginBottom: 20 }}>
          <button style={{ background: "#f97316", color: "#fff", padding: "12px 24px", borderRadius: 6, fontSize: 13, fontWeight: 700, border: "none", cursor: "pointer" }}>
            Request an Invitation
          </button>
          <button style={{ background: "transparent", color: "#374151", padding: "12px 24px", borderRadius: 6, fontSize: 13, border: "1px solid #d1d5db", cursor: "pointer" }}>
            View Portfolio
          </button>
        </div>

        {/* Social proof row */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 10 }}>
          <div style={{ display: "flex", gap: -4 }}>
            {[["#f97316", "A"], ["#0ea5e9", "B"], ["#8b5cf6", "C"], ["#10b981", "D"]].map(([bg, initial], i) => (
              <div key={i} style={{ width: 28, height: 28, borderRadius: "50%", background: bg as string, border: "2px solid #fafaf9", display: "flex", alignItems: "center", justifyContent: "center", marginLeft: i === 0 ? 0 : -8, fontSize: 10, color: "#fff", fontWeight: 700 }}>
                {initial}
              </div>
            ))}
          </div>
          <span style={{ color: "#9ca3af", fontSize: 12 }}>Join 120+ aligned investors</span>
        </div>
      </div>

      {/* Stats bar */}
      <div style={{ display: "flex", borderTop: "1px solid #e5e7eb", borderBottom: "1px solid #e5e7eb", background: "#fafafa" }}>
        {[["120+", "Members"], ["5", "Investment Models"], ["Pan-African", "Portfolio"], ["$12M+", "Deployed"]].map(([val, label], i) => (
          <div key={label} style={{ flex: 1, textAlign: "center", padding: "24px 0", borderRight: i < 3 ? "1px solid #e5e7eb" : "none" }}>
            <div style={{ color: "#f97316", fontSize: 22, fontWeight: 700, fontFamily: "Georgia, serif" }}>{val}</div>
            <div style={{ color: "#9ca3af", fontSize: 11, marginTop: 4 }}>{label}</div>
          </div>
        ))}
      </div>

      {/* Pillars */}
      <div style={{ padding: "56px 64px" }}>
        <p style={{ color: "#f97316", fontSize: 11, fontWeight: 600, letterSpacing: "0.14em", margin: "0 0 12px", textTransform: "uppercase" }}>THE FRAMEWORK</p>
        <h2 style={{ color: "#111827", fontSize: 28, fontWeight: 400, margin: "0 0 40px", letterSpacing: "-0.01em", fontFamily: "Georgia, serif" }}>Nurture. Connect. Invest.</h2>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 24 }}>
          {[
            ["Nurture", "Mentorship bootcamps, deal-room coaching, and investment education for new members.", "🌱"],
            ["Connect", "Introductions to co-investors, founders, and deal partners across West Africa.", "🤝"],
            ["Invest", "Structured capital deployment via 5 investment models with portfolio tracking.", "💎"],
          ].map(([title, desc, icon]) => (
            <div key={title as string} style={{ borderTop: "2px solid #f97316", paddingTop: 20 }}>
              <div style={{ fontSize: 28, marginBottom: 14 }}>{icon}</div>
              <p style={{ color: "#111827", fontSize: 15, fontWeight: 700, margin: "0 0 10px" }}>{title}</p>
              <p style={{ color: "#6b7280", fontSize: 13, lineHeight: 1.7, margin: 0 }}>{desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function Membership() {
  return (
    <div style={{ background: "#fafaf9", minHeight: "100%", fontFamily: "system-ui, sans-serif", padding: "32px 40px" }}>
      <p style={{ color: "#f97316", fontSize: 11, fontWeight: 600, letterSpacing: "0.12em", margin: "0 0 8px", textTransform: "uppercase" }}>MEMBERSHIP</p>
      <h2 style={{ color: "#111827", fontSize: 26, fontWeight: 400, letterSpacing: "-0.02em", margin: "0 0 32px", fontFamily: "Georgia, serif" }}>
        Invitation Only.
      </h2>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20, marginBottom: 28 }}>
        {/* Who we invite */}
        <div style={{ background: "#fff7ed", border: "1px solid #fed7aa", borderRadius: 12, padding: "20px 24px" }}>
          <p style={{ color: "#92400e", fontSize: 13, fontWeight: 700, margin: "0 0 16px" }}>Who we invite</p>
          {[
            "Women with investable capital (min. $5K)",
            "Professionals in finance, law, tech, health",
            "Women entrepreneurs with exits or current ventures",
            "Advocates aligned with women-led economic growth",
          ].map(item => (
            <div key={item} style={{ display: "flex", gap: 10, marginBottom: 12, alignItems: "flex-start" }}>
              <span style={{ color: "#f97316", fontSize: 13, fontWeight: 700, flexShrink: 0, marginTop: 1 }}>✓</span>
              <span style={{ color: "#374151", fontSize: 13, lineHeight: 1.5 }}>{item}</span>
            </div>
          ))}
        </div>

        {/* Member benefits */}
        <div style={{ background: "#fff7ed", border: "1px solid #fed7aa", borderRadius: 12, padding: "20px 24px" }}>
          <p style={{ color: "#92400e", fontSize: 13, fontWeight: 700, margin: "0 0 16px" }}>Member benefits</p>
          {[
            "Access to vetted, women-led deal flow",
            "5 structured investment models (monthly to annual)",
            "Mentorship bootcamps and investment education",
            "Co-investment via syndicated partner networks",
            "Portfolio tracking and governance tools",
            "Peer community of 120+ aligned investors",
          ].map(item => (
            <div key={item} style={{ display: "flex", gap: 10, marginBottom: 12, alignItems: "flex-start" }}>
              <span style={{ color: "#f97316", fontSize: 13, fontWeight: 700, flexShrink: 0, marginTop: 1 }}>✓</span>
              <span style={{ color: "#374151", fontSize: 13, lineHeight: 1.5 }}>{item}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Invitation notice */}
      <div style={{ background: "#fff7ed", border: "1px solid #fed7aa", borderRadius: 12, padding: "18px 24px", textAlign: "center" }}>
        <p style={{ color: "#92400e", fontSize: 13, fontWeight: 600, margin: "0 0 6px" }}>Membership is by invitation</p>
        <p style={{ color: "#b45309", fontSize: 12, margin: 0 }}>Current members: 120+ across West Africa. New cohort opens Q3 2026.</p>
      </div>
    </div>
  );
}

function Portfolio() {
  return (
    <div style={{ background: "#fafaf9", minHeight: "100%", fontFamily: "system-ui, sans-serif", padding: "32px 40px" }}>
      <p style={{ color: "#f97316", fontSize: 11, fontWeight: 600, letterSpacing: "0.12em", margin: "0 0 8px", textTransform: "uppercase" }}>PORTFOLIO</p>
      <h2 style={{ color: "#111827", fontSize: 26, fontWeight: 400, letterSpacing: "-0.02em", margin: "0 0 8px", fontFamily: "Georgia, serif" }}>
        Women-Led Ventures
      </h2>
      <p style={{ color: "#9ca3af", fontSize: 13, margin: "0 0 28px" }}>5 active investments across FinTech, HealthTech, AgriTech, and Fashion</p>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 14, marginBottom: 28 }}>
        {portfolio.map(p => (
          <div key={p.name} style={{ background: "#fff", border: "1px solid #e5e7eb", borderRadius: 12, padding: 18, display: "flex", alignItems: "center", gap: 14 }}>
            <div style={{ width: 44, height: 44, borderRadius: 10, background: "#f97316", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
              <span style={{ color: "#fff", fontWeight: 800, fontSize: 16 }}>{p.name[0]}</span>
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
                <span style={{ color: "#111827", fontSize: 14, fontWeight: 700 }}>{p.name}</span>
                <span style={{
                  padding: "2px 7px",
                  borderRadius: 100,
                  fontSize: 10,
                  fontWeight: 600,
                  background: p.status === "Exited" ? "#f0fdf4" : "#fff7ed",
                  color: p.status === "Exited" ? "#16a34a" : "#d97706",
                }}>
                  {p.status}
                </span>
              </div>
              <p style={{ color: "#9ca3af", fontSize: 12, margin: 0 }}>{p.sector} · {p.region} · {p.stage} · {p.raise}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Bottom stats */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12 }}>
        {[["$12M+", "Total Deployed"], ["4.2x", "Avg Return (Exited)"], ["Pan-African", "Geographic Reach"]].map(([val, label]) => (
          <div key={label} style={{ background: "#fff7ed", border: "1px solid #fed7aa", borderRadius: 10, padding: 16, textAlign: "center" }}>
            <div style={{ color: "#f97316", fontSize: 22, fontWeight: 700, fontFamily: "Georgia, serif" }}>{val}</div>
            <div style={{ color: "#9ca3af", fontSize: 11, marginTop: 4 }}>{label}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
