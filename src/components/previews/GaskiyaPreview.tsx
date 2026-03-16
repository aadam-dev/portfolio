"use client";

interface Props { screen: string }

const collections = [
  { name: "Eid Collection", pieces: 24, season: "Spring 2026", tag: "New" },
  { name: "The Wedding Edit", pieces: 18, season: "All Season", tag: "Bestseller" },
  { name: "Corporate Grace", pieces: 31, season: "All Season", tag: null },
  { name: "Holiday Luxe", pieces: 15, season: "Winter 2025", tag: null },
];

const products = [
  { name: "Embroidered Kaftan — Ivory", collection: "Eid Collection", price: 380, colors: ["#F5F0E8", "#C8B99A", "#2C3E50"] },
  { name: "Ankara Wrap Dress — Ochre", collection: "The Wedding Edit", price: 520, colors: ["#D4A84B", "#8B4513", "#1A1A2E"] },
  { name: "Fitted Agbada Set — Navy", collection: "Corporate Grace", price: 650, colors: ["#1C2D5A", "#fff", "#D4AF37"] },
];

export default function GaskiyaPreview({ screen }: Props) {
  if (screen === "collections") return <Collections />;
  if (screen === "product") return <Product />;
  return <Landing />;
}

function Landing() {
  return (
    <div style={{ background: "#0A0906", minHeight: "100%", fontFamily: "Georgia, serif" }}>
      <nav style={{ padding: "16px 32px", display: "flex", alignItems: "center", justifyContent: "space-between", borderBottom: "1px solid rgba(212,175,55,0.1)" }}>
        <div>
          <span style={{ color: "#D4AF37", fontWeight: 400, fontSize: 22, letterSpacing: "0.15em" }}>GASKIYA</span>
          <div style={{ width: "100%", height: 1, background: "#D4AF37", opacity: 0.4 }} />
        </div>
        <div style={{ display: "flex", gap: 28, alignItems: "center" }}>
          {["Collections", "New Arrivals", "About", "Contact"].map(l => (
            <span key={l} style={{ color: "rgba(255,255,255,0.5)", fontSize: 12, cursor: "pointer", letterSpacing: "0.08em", fontFamily: "system-ui, sans-serif" }}>{l}</span>
          ))}
          <div style={{ display: "flex", gap: 8 }}>
            {["🔍", "♡", "🛍 (2)"].map(icon => (
              <button key={icon} style={{ background: "transparent", border: "none", color: "rgba(255,255,255,0.6)", cursor: "pointer", fontSize: 14 }}>{icon}</button>
            ))}
          </div>
        </div>
      </nav>

      {/* Hero — editorial */}
      <div style={{ padding: "0 32px", display: "grid", gridTemplateColumns: "1fr 1fr", minHeight: 320 }}>
        <div style={{ display: "flex", flexDirection: "column", justifyContent: "center", padding: "56px 0" }}>
          <p style={{ color: "#D4AF37", fontSize: 11, letterSpacing: "0.2em", margin: "0 0 20px", fontFamily: "system-ui, sans-serif" }}>EID COLLECTION — SPRING 2026</p>
          <h1 style={{ color: "#fff", fontSize: 48, fontWeight: 400, lineHeight: 1.1, margin: "0 0 24px", letterSpacing: "-0.01em" }}>
            Wear your<br />truth.
          </h1>
          <div style={{ width: 50, height: 1, background: "#D4AF37", marginBottom: 24 }} />
          <p style={{ color: "rgba(255,255,255,0.45)", fontSize: 14, lineHeight: 1.8, margin: "0 0 32px", maxWidth: 380, fontFamily: "system-ui, sans-serif" }}>
            Gaskiya — truth in Hausa — shapes every silhouette. Premium African fashion delivered to your door, globally.
          </p>
          <div style={{ display: "flex", gap: 12 }}>
            <button style={{ background: "#D4AF37", color: "#000", padding: "13px 28px", borderRadius: 0, fontSize: 12, fontWeight: 600, border: "none", cursor: "pointer", letterSpacing: "0.08em", fontFamily: "system-ui, sans-serif" }}>
              SHOP COLLECTION
            </button>
            <button style={{ background: "transparent", color: "rgba(255,255,255,0.6)", padding: "13px 28px", borderRadius: 0, fontSize: 12, border: "1px solid rgba(212,175,55,0.3)", cursor: "pointer", letterSpacing: "0.08em", fontFamily: "system-ui, sans-serif" }}>
              OUR STORY
            </button>
          </div>
        </div>

        {/* Right — fashion visual placeholder */}
        <div style={{ background: "linear-gradient(135deg, rgba(212,175,55,0.08) 0%, rgba(212,175,55,0.03) 100%)", display: "flex", alignItems: "center", justifyContent: "center", borderLeft: "1px solid rgba(212,175,55,0.08)", flexDirection: "column", gap: 12 }}>
          <span style={{ fontSize: 64 }}>👘</span>
          <p style={{ color: "rgba(212,175,55,0.4)", fontSize: 11, letterSpacing: "0.12em", fontFamily: "system-ui" }}>EID COLLECTION</p>
        </div>
      </div>

      {/* Collections strip */}
      <div style={{ padding: "32px 32px 40px", borderTop: "1px solid rgba(255,255,255,0.04)" }}>
        <p style={{ color: "rgba(255,255,255,0.3)", fontSize: 11, letterSpacing: "0.14em", margin: "0 0 20px", fontFamily: "system-ui" }}>SHOP BY OCCASION</p>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 14 }}>
          {collections.map(col => (
            <div key={col.name} style={{ background: "rgba(212,175,55,0.03)", border: "1px solid rgba(212,175,55,0.1)", padding: "20px 16px", cursor: "pointer", position: "relative" }}>
              {col.tag && (
                <div style={{ position: "absolute", top: 10, right: 10, background: "#D4AF37", color: "#000", padding: "2px 8px", fontSize: 9, fontWeight: 700, letterSpacing: "0.06em", fontFamily: "system-ui" }}>
                  {col.tag.toUpperCase()}
                </div>
              )}
              <p style={{ color: "#fff", fontSize: 13, fontWeight: 400, margin: "0 0 6px", letterSpacing: "0.02em" }}>{col.name}</p>
              <p style={{ color: "rgba(255,255,255,0.35)", fontSize: 11, margin: "0 0 10px", fontFamily: "system-ui" }}>{col.pieces} pieces · {col.season}</p>
              <span style={{ color: "#D4AF37", fontSize: 11, fontFamily: "system-ui" }}>Explore →</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function Collections() {
  return (
    <div style={{ background: "#0A0906", minHeight: "100%", fontFamily: "system-ui, sans-serif", padding: 28 }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 24 }}>
        <div>
          <p style={{ color: "rgba(255,255,255,0.3)", fontSize: 10, letterSpacing: "0.14em", margin: "0 0 4px" }}>EID COLLECTION</p>
          <h2 style={{ color: "#fff", fontSize: 24, fontWeight: 400, letterSpacing: "-0.01em", margin: 0, fontFamily: "Georgia" }}>24 Pieces</h2>
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          {["All", "Kaftans", "Abayas", "Co-ords", "Accessories"].map((f, i) => (
            <button key={f} style={{ padding: "6px 12px", fontSize: 11, letterSpacing: "0.04em", border: i === 0 ? "none" : "1px solid rgba(255,255,255,0.08)", background: i === 0 ? "#D4AF37" : "transparent", color: i === 0 ? "#000" : "rgba(255,255,255,0.4)", cursor: "pointer" }}>{f}</button>
          ))}
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16 }}>
        {products.map(p => (
          <div key={p.name} style={{ cursor: "pointer" }}>
            <div style={{ height: 180, background: "rgba(212,175,55,0.05)", border: "1px solid rgba(212,175,55,0.08)", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 12, position: "relative" }}>
              <span style={{ fontSize: 48 }}>👘</span>
              <button style={{ position: "absolute", bottom: 10, left: "50%", transform: "translateX(-50%)", background: "rgba(0,0,0,0.7)", color: "#fff", padding: "6px 14px", border: "1px solid rgba(255,255,255,0.1)", fontSize: 11, cursor: "pointer", letterSpacing: "0.04em", whiteSpace: "nowrap" }}>
                QUICK ADD
              </button>
            </div>
            <div>
              <div style={{ display: "flex", gap: 4, marginBottom: 6 }}>
                {p.colors.map(c => (
                  <div key={c} style={{ width: 12, height: 12, borderRadius: "50%", background: c, border: "1px solid rgba(255,255,255,0.1)" }} />
                ))}
              </div>
              <p style={{ color: "rgba(255,255,255,0.5)", fontSize: 10, letterSpacing: "0.06em", margin: "0 0 3px" }}>{p.collection.toUpperCase()}</p>
              <p style={{ color: "#fff", fontSize: 13, margin: "0 0 4px", fontFamily: "Georgia" }}>{p.name}</p>
              <p style={{ color: "#D4AF37", fontWeight: 600, fontSize: 14, margin: 0 }}>$ {p.price}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function Product() {
  return (
    <div style={{ background: "#0A0906", minHeight: "100%", fontFamily: "system-ui, sans-serif", padding: 24, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 28 }}>
      {/* Images */}
      <div>
        <div style={{ height: 280, background: "rgba(212,175,55,0.05)", border: "1px solid rgba(212,175,55,0.1)", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 10, fontSize: 64 }}>
          👘
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 8 }}>
          {[0, 1, 2].map(i => (
            <div key={i} style={{ height: 60, background: i === 0 ? "rgba(212,175,55,0.1)" : "rgba(255,255,255,0.03)", border: i === 0 ? "1px solid #D4AF37" : "1px solid rgba(255,255,255,0.06)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22, cursor: "pointer" }}>👘</div>
          ))}
        </div>
      </div>

      {/* Details */}
      <div>
        <p style={{ color: "rgba(255,255,255,0.3)", fontSize: 10, letterSpacing: "0.1em", margin: "0 0 6px" }}>EID COLLECTION · SPRING 2026</p>
        <h2 style={{ color: "#fff", fontSize: 22, fontWeight: 400, letterSpacing: "-0.01em", margin: "0 0 8px", fontFamily: "Georgia" }}>Embroidered Kaftan — Ivory</h2>
        <p style={{ color: "#D4AF37", fontWeight: 600, fontSize: 22, margin: "0 0 20px" }}>$ 380</p>

        <div style={{ marginBottom: 18 }}>
          <p style={{ color: "rgba(255,255,255,0.4)", fontSize: 11, letterSpacing: "0.06em", margin: "0 0 8px" }}>COLOR</p>
          <div style={{ display: "flex", gap: 8 }}>
            {["#F5F0E8", "#C8B99A", "#2C3E50"].map(c => (
              <div key={c} style={{ width: 28, height: 28, borderRadius: "50%", background: c, border: c === "#F5F0E8" ? "2px solid #D4AF37" : "2px solid rgba(255,255,255,0.1)", cursor: "pointer" }} />
            ))}
          </div>
        </div>

        <div style={{ marginBottom: 20 }}>
          <p style={{ color: "rgba(255,255,255,0.4)", fontSize: 11, letterSpacing: "0.06em", margin: "0 0 8px" }}>SIZE</p>
          <div style={{ display: "flex", gap: 6 }}>
            {["XS", "S", "M", "L", "XL", "XXL"].map((s, i) => (
              <div key={s} style={{ width: 36, height: 36, display: "flex", alignItems: "center", justifyContent: "center", border: i === 2 ? "1px solid #D4AF37" : "1px solid rgba(255,255,255,0.08)", color: i === 2 ? "#D4AF37" : "rgba(255,255,255,0.5)", fontSize: 12, cursor: "pointer" }}>{s}</div>
            ))}
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 20 }}>
          <button style={{ background: "#D4AF37", color: "#000", padding: "14px", fontSize: 12, fontWeight: 700, border: "none", cursor: "pointer", letterSpacing: "0.08em" }}>
            ADD TO CART
          </button>
          <button style={{ background: "transparent", color: "rgba(255,255,255,0.6)", padding: "13px", fontSize: 12, border: "1px solid rgba(255,255,255,0.1)", cursor: "pointer", letterSpacing: "0.06em" }}>
            ♡ SAVE TO WISHLIST
          </button>
        </div>

        <div style={{ padding: 14, background: "rgba(212,175,55,0.04)", border: "1px solid rgba(212,175,55,0.1)" }}>
          <p style={{ color: "#D4AF37", fontSize: 11, margin: "0 0 6px", fontWeight: 600 }}>🌍 Global Shipping</p>
          <p style={{ color: "rgba(255,255,255,0.4)", fontSize: 11, margin: 0, lineHeight: 1.6 }}>Free shipping on orders over $200. GDPR-compliant checkout. Returns accepted within 30 days.</p>
        </div>
      </div>
    </div>
  );
}
