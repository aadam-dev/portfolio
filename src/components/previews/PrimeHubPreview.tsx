"use client";

interface Props { screen: string }

const products = [
  { name: "Portland Cement 42.5N", brand: "Diamond Cement", unit: "50kg bag", price: 85, stock: 240, img: "🏗️" },
  { name: "Iron Rods 12mm Y12", brand: "Tema Steel", unit: "bundle/12m", price: 680, stock: 85, img: "🔩" },
  { name: "Hollow Blocks 6-inch", brand: "BlockMasters", unit: "per unit", price: 4.5, stock: 1500, img: "🧱" },
  { name: "Roofing Sheets (Aluminium)", brand: "Roofco", unit: "per sheet", price: 120, stock: 200, img: "🏠" },
  { name: "PVC Pipes 4-inch (6m)", brand: "Interplast", unit: "per length", price: 48, stock: 340, img: "🔧" },
  { name: "Paint (Exterior, 20L)", brand: "Dulux", unit: "per tin", price: 290, stock: 60, img: "🎨" },
];

export default function PrimeHubPreview({ screen }: Props) {
  if (screen === "products") return <Products />;
  if (screen === "quote") return <Quote />;
  return <Landing />;
}

function Landing() {
  const suggestions = [
    "50 bags of Ghacem Cement",
    "Y16 Steel Rebar",
    "Aluzinc Roofing Sheets",
    "PVC Pipes 4 inch",
    "Hollow Blocks 6 inch",
  ];

  const materialCards = [
    { name: "Ghacem Cement", qty: "500 bags", bg: "linear-gradient(135deg, #334155, #1e293b)", progress: 60 },
    { name: "Y16 Rebar", qty: "200 pcs", bg: "linear-gradient(135deg, #475569, #334155)", progress: 75 },
    { name: "Aluzinc Sheets", qty: "150m", bg: "linear-gradient(135deg, #92400e, #78350f)", progress: 90 },
  ];

  return (
    <div style={{ background: "#020617", minHeight: "100%", fontFamily: "system-ui, sans-serif", position: "relative", overflow: "hidden" }}>
      {/* Ambient amber glow */}
      <div style={{ position: "absolute", top: 0, left: "20%", width: 320, height: 320, background: "rgba(245,158,11,0.08)", borderRadius: "50%", filter: "blur(100px)", pointerEvents: "none" }} />
      <div style={{ position: "absolute", bottom: 0, right: "20%", width: 260, height: 260, background: "rgba(245,158,11,0.05)", borderRadius: "50%", filter: "blur(80px)", pointerEvents: "none" }} />

      {/* Nav — real PrimeHub logo when available (same as live site) */}
      <nav style={{ padding: "14px 28px", display: "flex", alignItems: "center", justifyContent: "space-between", borderBottom: "1px solid rgba(255,255,255,0.05)", position: "relative", zIndex: 10 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          {/* Real PrimeHub logo: use /previews/primehub/logo.png (copy from PrimeHub/public/logo.png) or fallback P mark */}
          <div style={{ width: 32, height: 32, borderRadius: 10, overflow: "hidden", flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center", background: "rgba(255,255,255,0.05)" }}>
            <img src="/previews/primehub/logo.png" alt="" role="presentation" width={32} height={32} style={{ objectFit: "contain", width: 32, height: 32 }} />
          </div>
          <div style={{ display: "flex", flexDirection: "column", lineHeight: 1.1 }}>
            <span style={{ color: "#fff", fontWeight: 700, fontSize: 14, letterSpacing: "-0.02em" }}>PrimeHub</span>
            <span style={{ color: "rgba(255,255,255,0.4)", fontSize: 10, fontWeight: 600, letterSpacing: "0.1em", marginTop: 2 }}>MATERIALS</span>
          </div>
        </div>
        <div style={{ display: "flex", gap: 20, alignItems: "center" }}>
          {["Products", "Categories", "How It Works"].map(l => (
            <span key={l} style={{ color: "rgba(255,255,255,0.5)", fontSize: 13, cursor: "pointer" }}>{l}</span>
          ))}
          <button style={{ background: "#F59E0B", color: "#000", padding: "7px 16px", borderRadius: 8, fontSize: 13, fontWeight: 600, border: "none", cursor: "pointer" }}>
            Get a Quote
          </button>
        </div>
      </nav>

      {/* Hero — two column */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 40, padding: "52px 28px 36px", alignItems: "center", position: "relative", zIndex: 1, maxWidth: 960, margin: "0 auto" }}>
        {/* Left: copy + search */}
        <div>
          {/* Badge */}
          <div style={{ display: "inline-flex", alignItems: "center", gap: 6, background: "rgba(245,158,11,0.1)", border: "1px solid rgba(245,158,11,0.2)", borderRadius: 100, padding: "4px 12px", marginBottom: 20 }}>
            <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#F59E0B", display: "inline-block", animation: "pulse 2s infinite" }} />
            <span style={{ color: "#F59E0B", fontSize: 11, fontWeight: 600 }}>Trusted by 500+ contractors in Ghana</span>
          </div>

          {/* H1 */}
          <h1 style={{ color: "#fff", fontSize: 38, fontWeight: 700, letterSpacing: "-0.03em", lineHeight: 1.15, margin: "0 0 14px" }}>
            Build with <span style={{ color: "#F59E0B" }}>Precision.</span><br />
            Source with{" "}
            <span style={{ position: "relative", display: "inline-block" }}>
              Prime
              <span style={{ position: "absolute", bottom: -3, left: 0, right: 0, height: 2, background: "#F59E0B", borderRadius: 2 }} />
            </span>.
          </h1>

          {/* Subtitle */}
          <p style={{ color: "#94a3b8", fontSize: 14, lineHeight: 1.7, margin: "0 0 24px", maxWidth: 420 }}>
            The procurement command center for contractors. Generate formal proformas, get stakeholder approval in one click, and track deliveries to your site.
          </p>

          {/* Command-line search bar */}
          <div style={{ background: "#0f172a", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 12, padding: "10px 14px", display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}>
            <span style={{ color: "#64748b", fontSize: 14 }}>🔍</span>
            <span style={{ color: "#F59E0B", fontFamily: "monospace", fontSize: 13, flexShrink: 0 }}>$</span>
            <input
              readOnly
              placeholder="50 bags of Ghacem Cement..."
              style={{ flex: 1, background: "transparent", border: "none", color: "#94a3b8", fontSize: 13, outline: "none", fontFamily: "monospace" }}
            />
            <button style={{ background: "#F59E0B", color: "#000", padding: "6px 16px", borderRadius: 8, fontSize: 12, fontWeight: 700, border: "none", cursor: "pointer", flexShrink: 0 }}>
              Search
            </button>
          </div>

          {/* Suggestion pills */}
          <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 24 }}>
            {suggestions.slice(0, 4).map(s => (
              <span key={s} style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 100, padding: "3px 10px", fontSize: 10, color: "#64748b", cursor: "pointer" }}>{s}</span>
            ))}
          </div>

          {/* Quick stats */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16 }}>
            {[["2,500+", "Materials"], ["500+", "Contractors"], ["24h", "Delivery"]].map(([val, label]) => (
              <div key={label}>
                <p style={{ color: "#fff", fontSize: 20, fontWeight: 700, margin: "0 0 2px" }}>{val}</p>
                <p style={{ color: "#64748b", fontSize: 11, margin: 0 }}>{label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Right: stacked material cards */}
        <div style={{ position: "relative", height: 280 }}>
          {materialCards.map((card, i) => (
            <div key={card.name} style={{
              position: "absolute",
              insetInline: 0,
              margin: "0 auto",
              width: `${100 - i * 8}%`,
              top: `${10 + i * 28}%`,
              transform: `rotate(${(i - 1) * 4}deg)`,
              background: card.bg,
              borderRadius: 16,
              padding: "16px 20px",
              border: "1px solid rgba(255,255,255,0.1)",
              boxShadow: "0 8px 24px rgba(0,0,0,0.4)",
            }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
                <div>
                  <p style={{ color: "#fff", fontSize: 13, fontWeight: 600, margin: "0 0 3px" }}>{card.name}</p>
                  <p style={{ color: "rgba(255,255,255,0.5)", fontSize: 12, margin: 0 }}>{card.qty}</p>
                </div>
                <div style={{ width: 40, height: 40, borderRadius: 10, background: "rgba(255,255,255,0.1)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <span style={{ fontSize: 18 }}>📦</span>
                </div>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <div style={{ flex: 1, height: 4, background: "rgba(255,255,255,0.15)", borderRadius: 2 }}>
                  <div style={{ height: 4, width: `${card.progress}%`, background: "#F59E0B", borderRadius: 2 }} />
                </div>
                <span style={{ color: "rgba(255,255,255,0.4)", fontSize: 10, flexShrink: 0 }}>In Stock</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function Products() {
  return (
    <div style={{ background: "#0A0A0F", minHeight: "100%", fontFamily: "system-ui, sans-serif", display: "flex" }}>
      {/* Filters sidebar */}
      <div style={{ width: 200, borderRight: "1px solid rgba(255,255,255,0.06)", padding: 20, flexShrink: 0 }}>
        <p style={{ color: "rgba(255,255,255,0.4)", fontSize: 11, fontWeight: 600, margin: "0 0 12px", letterSpacing: "0.05em" }}>CATEGORY</p>
        {["All Materials", "Cement & Concrete", "Steel & Iron", "Blocks & Bricks", "Roofing", "Plumbing"].map((f, i) => (
          <div key={f} style={{ padding: "8px 10px", borderRadius: 8, background: i === 0 ? "rgba(249,115,22,0.1)" : "transparent", color: i === 0 ? "#F97316" : "rgba(255,255,255,0.5)", fontSize: 12, cursor: "pointer", marginBottom: 2 }}>{f}</div>
        ))}
        <div style={{ height: 1, background: "rgba(255,255,255,0.06)", margin: "16px 0" }} />
        <p style={{ color: "rgba(255,255,255,0.4)", fontSize: 11, fontWeight: 600, margin: "0 0 12px", letterSpacing: "0.05em" }}>SUPPLIER</p>
        {["All", "Diamond Cement", "Tema Steel", "BlockMasters"].map((f, i) => (
          <div key={f} style={{ display: "flex", alignItems: "center", gap: 8, padding: "6px 10px", cursor: "pointer", marginBottom: 2 }}>
            <div style={{ width: 14, height: 14, borderRadius: 4, border: `2px solid ${i === 0 ? "#F97316" : "rgba(255,255,255,0.2)"}`, background: i === 0 ? "#F97316" : "transparent" }} />
            <span style={{ color: "rgba(255,255,255,0.5)", fontSize: 12 }}>{f}</span>
          </div>
        ))}
      </div>

      {/* Grid */}
      <div style={{ flex: 1, padding: 20 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
          <span style={{ color: "rgba(255,255,255,0.5)", fontSize: 13 }}>Showing 6 of 2,400+ products</span>
          <select style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", color: "rgba(255,255,255,0.6)", padding: "6px 10px", borderRadius: 8, fontSize: 12 }}>
            <option>Sort: Relevance</option>
          </select>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 12 }}>
          {products.map(p => (
            <div key={p.name} style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 12, padding: 14, display: "flex", gap: 12, cursor: "pointer" }}>
              <div style={{ width: 52, height: 52, borderRadius: 10, background: "rgba(249,115,22,0.08)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, fontSize: 24 }}>{p.img}</div>
              <div style={{ flex: 1 }}>
                <p style={{ color: "#fff", fontSize: 12, fontWeight: 600, margin: "0 0 3px", lineHeight: 1.4 }}>{p.name}</p>
                <p style={{ color: "rgba(255,255,255,0.35)", fontSize: 11, margin: "0 0 6px" }}>{p.brand} · {p.unit}</p>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                  <span style={{ color: "#F97316", fontWeight: 700, fontSize: 14 }}>GH₵ {p.price}</span>
                  <span style={{ color: "#10B981", fontSize: 10 }}>✓ {p.stock} in stock</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function Quote() {
  return (
    <div style={{ background: "#0A0A0F", minHeight: "100%", fontFamily: "system-ui, sans-serif", padding: 24 }}>
      <h2 style={{ color: "#fff", fontSize: 20, fontWeight: 700, margin: "0 0 4px" }}>Proforma Quote Builder</h2>
      <p style={{ color: "rgba(255,255,255,0.4)", fontSize: 13, margin: "0 0 24px" }}>Add items, set quantities, and generate a formal proforma for stakeholder approval.</p>

      <div style={{ display: "grid", gridTemplateColumns: "1.2fr 1fr", gap: 20 }}>
        {/* Items */}
        <div>
          <p style={{ color: "rgba(255,255,255,0.5)", fontSize: 12, fontWeight: 600, margin: "0 0 12px", letterSpacing: "0.04em" }}>QUOTE ITEMS</p>
          {products.slice(0, 3).map((p, i) => (
            <div key={p.name} style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 10, padding: 12, marginBottom: 10, display: "flex", alignItems: "center", gap: 12 }}>
              <span style={{ fontSize: 20 }}>{p.img}</span>
              <div style={{ flex: 1 }}>
                <p style={{ color: "#fff", fontSize: 12, fontWeight: 600, margin: "0 0 2px" }}>{p.name}</p>
                <p style={{ color: "rgba(255,255,255,0.35)", fontSize: 11, margin: 0 }}>{p.brand}</p>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 4, background: "rgba(255,255,255,0.05)", borderRadius: 6, padding: "4px 8px" }}>
                  <button style={{ color: "rgba(255,255,255,0.4)", background: "none", border: "none", cursor: "pointer", fontSize: 14 }}>−</button>
                  <span style={{ color: "#fff", fontSize: 12, minWidth: 20, textAlign: "center" }}>{[10, 5, 20][i]}</span>
                  <button style={{ color: "rgba(255,255,255,0.4)", background: "none", border: "none", cursor: "pointer", fontSize: 14 }}>+</button>
                </div>
                <span style={{ color: "#F97316", fontWeight: 600, fontSize: 13, minWidth: 64, textAlign: "right" }}>GH₵ {(p.price * [10, 5, 20][i]).toLocaleString()}</span>
              </div>
            </div>
          ))}
          <button style={{ display: "flex", alignItems: "center", gap: 6, padding: "10px 14px", borderRadius: 10, background: "rgba(255,255,255,0.03)", border: "1px dashed rgba(255,255,255,0.12)", color: "rgba(255,255,255,0.4)", fontSize: 12, cursor: "pointer", width: "100%" }}>
            + Add another item
          </button>
        </div>

        {/* Summary */}
        <div>
          <p style={{ color: "rgba(255,255,255,0.5)", fontSize: 12, fontWeight: 600, margin: "0 0 12px", letterSpacing: "0.04em" }}>SUMMARY</p>
          <div style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 12, padding: 16 }}>
            {[["Subtotal", "GH₵ 4,390"], ["VAT (15%)", "GH₵ 658.50"], ["Delivery estimate", "GH₵ 200"]].map(([l, v]) => (
              <div key={l} style={{ display: "flex", justifyContent: "space-between", padding: "8px 0", borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
                <span style={{ color: "rgba(255,255,255,0.4)", fontSize: 13 }}>{l}</span>
                <span style={{ color: "#fff", fontSize: 13 }}>{v}</span>
              </div>
            ))}
            <div style={{ display: "flex", justifyContent: "space-between", padding: "12px 0 4px" }}>
              <span style={{ color: "#fff", fontWeight: 700, fontSize: 14 }}>Total</span>
              <span style={{ color: "#F97316", fontWeight: 800, fontSize: 18 }}>GH₵ 5,248.50</span>
            </div>
          </div>
          <div style={{ marginTop: 14 }}>
            <p style={{ color: "rgba(255,255,255,0.4)", fontSize: 11, margin: "0 0 8px" }}>APPROVAL WORKFLOW</p>
            <div style={{ display: "flex", gap: 6 }}>
              {["Requester ✓", "Manager →", "Finance →"].map((s, i) => (
                <div key={s} style={{ flex: 1, padding: "8px 6px", borderRadius: 8, textAlign: "center", background: i === 0 ? "rgba(16,185,129,0.1)" : i === 1 ? "rgba(249,115,22,0.1)" : "rgba(255,255,255,0.03)", border: `1px solid ${i === 0 ? "rgba(16,185,129,0.2)" : i === 1 ? "rgba(249,115,22,0.2)" : "rgba(255,255,255,0.06)"}`, color: i === 0 ? "#10B981" : i === 1 ? "#F97316" : "rgba(255,255,255,0.3)", fontSize: 10, fontWeight: 500 }}>
                  {s}
                </div>
              ))}
            </div>
          </div>
          <button style={{ width: "100%", background: "#F97316", color: "#fff", padding: "13px", borderRadius: 10, fontSize: 14, fontWeight: 700, border: "none", cursor: "pointer", marginTop: 14 }}>
            Generate Proforma PDF
          </button>
        </div>
      </div>
    </div>
  );
}
