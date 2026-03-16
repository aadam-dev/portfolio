"use client";

interface Props { screen: string }

const listings = [
  { id: "AKR-001", title: "2-Bed Apartment", area: "Airport Residential", price: 2800, beds: 2, baths: 2, verified: true, utilities: true },
  { id: "ELG-007", title: "Studio + Den", area: "East Legon", price: 1800, beds: 1, baths: 1, verified: true, utilities: false },
  { id: "OSU-014", title: "3-Bed Townhouse", area: "Osu", price: 3500, beds: 3, baths: 2, verified: true, utilities: true },
  { id: "LAB-021", title: "1-Bed Serviced Apt", area: "Labone", price: 2100, beds: 1, baths: 1, verified: false, utilities: true },
];

export default function RentcheckPreview({ screen }: Props) {
  if (screen === "listings") return <Listings />;
  if (screen === "detail") return <Detail />;
  return <Landing />;
}

function Landing() {
  return (
    <div style={{ background: "#0F172A", minHeight: "100%", fontFamily: "system-ui, sans-serif", overflowY: "auto" }}>
      {/* Nav */}
      <nav style={{ padding: "14px 28px", display: "flex", alignItems: "center", justifyContent: "space-between", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <div style={{ width: 28, height: 28, borderRadius: 8, background: "#F59E0B", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <span style={{ fontSize: 14 }}>🔑</span>
          </div>
          <span style={{ color: "#fff", fontWeight: 700, fontSize: 16 }}>Rentcheck</span>
          <span style={{ background: "rgba(245,158,11,0.12)", color: "#F59E0B", fontSize: 10, padding: "2px 6px", borderRadius: 4, fontWeight: 500 }}>Ghana</span>
        </div>
        <div style={{ display: "flex", gap: 20, alignItems: "center" }}>
          {["Find a Home", "List Property", "How it Works"].map(l => (
            <span key={l} style={{ color: "rgba(255,255,255,0.5)", fontSize: 12, cursor: "pointer" }}>{l}</span>
          ))}
          <button style={{ background: "#F59E0B", color: "#000", padding: "7px 14px", borderRadius: 8, fontSize: 12, fontWeight: 700, border: "none", cursor: "pointer" }}>
            Verify Identity
          </button>
        </div>
      </nav>

      {/* Hero */}
      <div style={{ padding: "56px 28px 40px", textAlign: "center" }}>
        <div style={{ display: "inline-flex", alignItems: "center", gap: 6, background: "rgba(245,158,11,0.1)", border: "1px solid rgba(245,158,11,0.25)", borderRadius: 100, padding: "5px 14px", marginBottom: 24 }}>
          <span style={{ color: "#F59E0B", fontSize: 11, fontWeight: 500 }}>100% Free for Tenants</span>
        </div>
        <h1 style={{ color: "#fff", fontSize: 40, fontWeight: 800, letterSpacing: "-0.03em", lineHeight: 1.15, margin: "0 0 16px" }}>
          Find your perfect rental<br />
          <span style={{ color: "#F59E0B" }}>in Ghana</span>
        </h1>
        <p style={{ color: "rgba(255,255,255,0.5)", fontSize: 14, lineHeight: 1.7, margin: "0 0 32px", maxWidth: 460, marginInline: "auto" }}>
          Verified properties. Transparent pricing. Honest landlords.
        </p>

        {/* SmartSearchBar */}
        <div style={{ display: "flex", gap: 0, maxWidth: 560, margin: "0 auto", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 12, padding: 6 }}>
          <input
            readOnly
            placeholder="Search Accra neighbourhoods..."
            style={{ flex: 1, background: "transparent", border: "none", color: "#fff", fontSize: 13, padding: "8px 14px", outline: "none" }}
          />
          <button style={{ background: "#F59E0B", color: "#000", padding: "10px 20px", borderRadius: 8, fontSize: 13, fontWeight: 700, border: "none", cursor: "pointer", marginLeft: 4 }}>
            Search
          </button>
        </div>
      </div>

      {/* Trust features — 3 cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12, padding: "0 28px 32px" }}>
        {[
          ["🛡️", "Scout Verified", "Every property physically inspected"],
          ["💧", "Utility Transparency", "Full bills disclosed before you commit"],
          ["⭐", "Landlord Ratings", "Real tenant reviews and verified ratings"],
        ].map(([icon, title, desc]) => (
          <div key={title as string} style={{ padding: "16px 14px", background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 12, textAlign: "center" }}>
            <div style={{ fontSize: 22, marginBottom: 8 }}>{icon}</div>
            <p style={{ color: "#fff", fontSize: 12, fontWeight: 600, margin: "0 0 4px" }}>{title}</p>
            <p style={{ color: "rgba(255,255,255,0.4)", fontSize: 11, margin: 0 }}>{desc}</p>
          </div>
        ))}
      </div>

      {/* Property type tabs */}
      <div style={{ display: "flex", gap: 8, padding: "0 28px 20px" }}>
        {["All Properties", "Apartments", "Hostels", "Short Stays"].map((tab, i) => (
          <button
            key={tab}
            style={{
              background: i === 0 ? "#F59E0B" : "rgba(255,255,255,0.05)",
              color: i === 0 ? "#000" : "rgba(255,255,255,0.5)",
              border: i === 0 ? "none" : "1px solid rgba(255,255,255,0.08)",
              padding: "7px 14px",
              borderRadius: 8,
              fontSize: 12,
              fontWeight: i === 0 ? 700 : 400,
              cursor: "pointer",
            }}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Featured listings grid */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 14, padding: "0 28px 28px" }}>
        {listings.slice(0, 3).map(l => (
          <div key={l.id} style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 14, overflow: "hidden", cursor: "pointer" }}>
            <div style={{ height: 100, background: "linear-gradient(135deg, rgba(245,158,11,0.14), rgba(245,158,11,0.04))", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 32, position: "relative" }}>
              🏢
              {l.verified && (
                <div style={{ position: "absolute", top: 8, right: 8, background: "rgba(16,185,129,0.9)", padding: "2px 7px", borderRadius: 4 }}>
                  <span style={{ color: "#fff", fontSize: 9, fontWeight: 600 }}>✓ Verified</span>
                </div>
              )}
            </div>
            <div style={{ padding: 12 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 4 }}>
                <span style={{ color: "#fff", fontSize: 12, fontWeight: 600 }}>{l.title}</span>
                <span style={{ color: "#F59E0B", fontWeight: 700, fontSize: 12, whiteSpace: "nowrap", marginLeft: 6 }}>GH₵ {l.price}</span>
              </div>
              <p style={{ color: "rgba(255,255,255,0.4)", fontSize: 11, margin: "0 0 8px" }}>📍 {l.area}</p>
              <div style={{ display: "flex", gap: 5, flexWrap: "wrap" }}>
                <span style={{ background: "rgba(255,255,255,0.05)", color: "rgba(255,255,255,0.5)", padding: "2px 7px", borderRadius: 4, fontSize: 10 }}>🛏 {l.beds}</span>
                <span style={{ background: "rgba(255,255,255,0.05)", color: "rgba(255,255,255,0.5)", padding: "2px 7px", borderRadius: 4, fontSize: 10 }}>🚿 {l.baths}</span>
                {l.utilities && <span style={{ background: "rgba(245,158,11,0.1)", color: "#F59E0B", padding: "2px 7px", borderRadius: 4, fontSize: 10 }}>Bills visible</span>}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Are you a landlord? CTA */}
      <div style={{
        background: "rgba(245,158,11,0.05)",
        border: "1px solid rgba(245,158,11,0.2)",
        borderRadius: 16,
        padding: "32px 40px",
        margin: "0 28px 28px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: 20,
      }}>
        <div>
          <h3 style={{ color: "#fff", fontSize: 18, fontWeight: 700, margin: "0 0 6px" }}>
            🏠 Are you a landlord?
          </h3>
          <p style={{ color: "rgba(255,255,255,0.5)", fontSize: 13, margin: 0, maxWidth: 380 }}>
            List your property and reach thousands of verified renters in Accra.
          </p>
        </div>
        <div style={{ display: "flex", gap: 10, flexShrink: 0 }}>
          <button style={{ background: "#F59E0B", color: "#000", padding: "10px 18px", borderRadius: 9, fontSize: 13, fontWeight: 700, border: "none", cursor: "pointer", whiteSpace: "nowrap" }}>
            List Your Property
          </button>
          <button style={{ background: "transparent", color: "rgba(255,255,255,0.6)", padding: "10px 18px", borderRadius: 9, fontSize: 13, fontWeight: 500, border: "1px solid rgba(255,255,255,0.15)", cursor: "pointer", whiteSpace: "nowrap" }}>
            Learn More
          </button>
        </div>
      </div>
    </div>
  );
}

function Listings() {
  return (
    <div style={{ background: "#0F172A", minHeight: "100%", fontFamily: "system-ui, sans-serif", display: "flex" }}>
      {/* Map placeholder */}
      <div style={{ flex: 1, background: "rgba(245,158,11,0.03)", display: "flex", alignItems: "center", justifyContent: "center", borderRight: "1px solid rgba(255,255,255,0.06)", position: "relative", minHeight: 400 }}>
        <div style={{ textAlign: "center" }}>
          <span style={{ fontSize: 40 }}>🗺️</span>
          <p style={{ color: "rgba(255,255,255,0.3)", fontSize: 12, marginTop: 8 }}>Map View — Accra</p>
        </div>
        {[{ x: "40%", y: "35%" }, { x: "60%", y: "50%" }, { x: "30%", y: "60%" }].map((pos, i) => (
          <div key={i} style={{ position: "absolute", left: pos.x, top: pos.y, transform: "translate(-50%, -50%)" }}>
            <div style={{ background: "#F59E0B", color: "#000", padding: "4px 8px", borderRadius: 100, fontSize: 10, fontWeight: 700, whiteSpace: "nowrap", boxShadow: "0 4px 12px rgba(245,158,11,0.3)" }}>
              GH₵ {[2800, 1800, 3500][i]}/mo
            </div>
          </div>
        ))}
      </div>

      {/* List */}
      <div style={{ width: 280, padding: 16, overflowY: "auto" }}>
        <p style={{ color: "rgba(255,255,255,0.4)", fontSize: 12, margin: "0 0 12px" }}>4 verified listings in East Legon area</p>
        {listings.map(l => (
          <div key={l.id} style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 12, marginBottom: 12, overflow: "hidden", cursor: "pointer" }}>
            <div style={{ height: 80, background: "linear-gradient(135deg, rgba(245,158,11,0.12), rgba(245,158,11,0.04))", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 28, position: "relative" }}>
              🏢
              {l.verified && (
                <div style={{ position: "absolute", top: 8, right: 8, background: "rgba(16,185,129,0.9)", padding: "2px 6px", borderRadius: 4 }}>
                  <span style={{ color: "#fff", fontSize: 9, fontWeight: 600 }}>✓ Verified</span>
                </div>
              )}
            </div>
            <div style={{ padding: 12 }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                <span style={{ color: "#fff", fontSize: 12, fontWeight: 600 }}>{l.title}</span>
                <span style={{ color: "#F59E0B", fontWeight: 700, fontSize: 13 }}>GH₵ {l.price}</span>
              </div>
              <p style={{ color: "rgba(255,255,255,0.4)", fontSize: 11, margin: "0 0 8px" }}>📍 {l.area}</p>
              <div style={{ display: "flex", gap: 6 }}>
                <span style={{ background: "rgba(255,255,255,0.05)", color: "rgba(255,255,255,0.5)", padding: "2px 7px", borderRadius: 4, fontSize: 10 }}>🛏 {l.beds}</span>
                <span style={{ background: "rgba(255,255,255,0.05)", color: "rgba(255,255,255,0.5)", padding: "2px 7px", borderRadius: 4, fontSize: 10 }}>🚿 {l.baths}</span>
                {l.utilities && <span style={{ background: "rgba(245,158,11,0.1)", color: "#F59E0B", padding: "2px 7px", borderRadius: 4, fontSize: 10 }}>Bills visible</span>}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function Detail() {
  return (
    <div style={{ background: "#0F172A", minHeight: "100%", fontFamily: "system-ui, sans-serif", padding: 20 }}>
      <div style={{ display: "flex", gap: 20 }}>
        <div style={{ flex: 1 }}>
          <div style={{ height: 180, background: "linear-gradient(135deg, rgba(245,158,11,0.15), rgba(245,158,11,0.04))", borderRadius: 12, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 16, fontSize: 48, position: "relative" }}>
            🏢
            <div style={{ position: "absolute", top: 12, right: 12, background: "rgba(16,185,129,0.9)", padding: "4px 10px", borderRadius: 100 }}>
              <span style={{ color: "#fff", fontSize: 11, fontWeight: 600 }}>✓ Scout Verified</span>
            </div>
          </div>
          <h2 style={{ color: "#fff", fontSize: 18, fontWeight: 700, margin: "0 0 4px" }}>2-Bed Apartment</h2>
          <p style={{ color: "rgba(255,255,255,0.4)", fontSize: 13, margin: "0 0 16px" }}>📍 Airport Residential, Accra · AKR-001</p>
          <div style={{ display: "flex", gap: 10, marginBottom: 16, flexWrap: "wrap" }}>
            {["🛏 2 Bedrooms", "🚿 2 Bathrooms", "🚗 Parking", "🌊 Water"].map(feat => (
              <div key={feat} style={{ padding: "6px 10px", borderRadius: 8, background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)", color: "rgba(255,255,255,0.6)", fontSize: 11 }}>
                {feat}
              </div>
            ))}
          </div>
          <div style={{ background: "rgba(245,158,11,0.06)", border: "1px solid rgba(245,158,11,0.18)", borderRadius: 12, padding: 14, marginBottom: 16 }}>
            <p style={{ color: "#F59E0B", fontSize: 12, fontWeight: 600, margin: "0 0 10px" }}>📊 Utility Disclosure (Last 3 months)</p>
            {[["Electricity (ECG)", "GH₵ 280/mo avg"], ["Water (GWCL)", "GH₵ 60/mo avg"], ["Internet (Fibernet)", "GH₵ 200/mo"]].map(([u, c]) => (
              <div key={u as string} style={{ display: "flex", justifyContent: "space-between", padding: "5px 0", borderBottom: "1px solid rgba(245,158,11,0.1)" }}>
                <span style={{ color: "rgba(255,255,255,0.5)", fontSize: 12 }}>{u}</span>
                <span style={{ color: "#fff", fontSize: 12, fontWeight: 500 }}>{c}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Booking card */}
        <div style={{ width: 200, flexShrink: 0 }}>
          <div style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 14, padding: 16 }}>
            <div style={{ marginBottom: 14 }}>
              <span style={{ color: "#F59E0B", fontWeight: 900, fontSize: 24 }}>GH₵ 2,800</span>
              <span style={{ color: "rgba(255,255,255,0.4)", fontSize: 12 }}>/mo</span>
            </div>
            <div style={{ marginBottom: 14 }}>
              <p style={{ color: "rgba(255,255,255,0.4)", fontSize: 11, margin: "0 0 4px" }}>Advance</p>
              <p style={{ color: "#fff", fontSize: 13, fontWeight: 600, margin: 0 }}>6 months</p>
            </div>
            <div style={{ marginBottom: 16, padding: 10, background: "rgba(245,158,11,0.08)", borderRadius: 8, border: "1px solid rgba(245,158,11,0.2)" }}>
              <p style={{ color: "#F59E0B", fontSize: 11, margin: 0 }}>🔒 Viewing fee (GH₵ 150) held in escrow — refunded if you don't proceed</p>
            </div>
            <button style={{ width: "100%", background: "#F59E0B", color: "#000", padding: "11px", borderRadius: 10, fontSize: 13, fontWeight: 700, border: "none", cursor: "pointer", marginBottom: 8 }}>
              Book Viewing
            </button>
            <button style={{ width: "100%", background: "transparent", color: "rgba(255,255,255,0.5)", padding: "9px", borderRadius: 10, fontSize: 12, border: "1px solid rgba(255,255,255,0.08)", cursor: "pointer" }}>
              Contact Landlord
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
