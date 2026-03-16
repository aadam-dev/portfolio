"use client";

interface Props { screen: string }

const menuItems = [
  { name: "Reg. Fried Rice + Grilled Chicken (Lg)", price: 60, cat: "Rice Dishes" },
  { name: "Anis Special (Assorted Fried Rice)", price: 100, cat: "Rice Dishes" },
  { name: "Loaded Fries", price: 70, cat: "Sides" },
  { name: "Indomie Stir-Fry (Large)", price: 45, cat: "Noodles" },
  { name: "Grilled Tilapia + Rice", price: 85, cat: "Local" },
  { name: "Fresh Juice (Large)", price: 20, cat: "Drinks" },
];

const orders = [
  { id: "ORD-001", table: "T3", items: 3, total: 220, status: "In Progress" },
  { id: "ORD-002", table: "T7", items: 2, total: 160, status: "Ready" },
  { id: "ORD-003", table: "T1", items: 4, total: 340, status: "In Progress" },
  { id: "ORD-004", table: "Takeaway", items: 1, total: 100, status: "Paid" },
];

const VAT = 0.125;

export default function AnisFoodsPreview({ screen }: Props) {
  if (screen === "pos") return <POSScreen />;
  if (screen === "dashboard") return <DashboardScreen />;
  if (screen === "reports") return <ReportsScreen />;
  return <LandingScreen />;
}

function LandingScreen() {
  return (
    <div style={{ background: "#fff", minHeight: "100%", fontFamily: "system-ui, sans-serif" }}>
      {/* Dark nav */}
      <nav style={{ padding: "16px 28px", display: "flex", alignItems: "center", justifyContent: "space-between", background: "rgba(0,0,0,0.6)", position: "relative", zIndex: 10 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <span style={{ color: "#fff", fontWeight: 900, fontSize: 22, letterSpacing: "-0.03em" }}>Anis<span style={{ color: "#D21F3C" }}>.</span></span>
          <span style={{ color: "rgba(255,255,255,0.4)", fontSize: 12, fontWeight: 400 }}>Food & Drink</span>
        </div>
        <div style={{ display: "flex", gap: 24, alignItems: "center" }}>
          {["Menu", "Reservations", "About", "Contact"].map(l => (
            <span key={l} style={{ color: "rgba(255,255,255,0.6)", fontSize: 13, cursor: "pointer" }}>{l}</span>
          ))}
          <button style={{ background: "#D21F3C", color: "#fff", padding: "8px 18px", borderRadius: 8, fontSize: 13, fontWeight: 600, border: "none", cursor: "pointer" }}>
            Book a Table
          </button>
        </div>
      </nav>

      {/* Dark Hero */}
      <div style={{ background: "#1A1A1A", position: "relative", padding: "60px 28px 52px", textAlign: "center", overflow: "hidden" }}>
        {/* Gradient overlay */}
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(180deg, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0.5) 50%, transparent 100%)", pointerEvents: "none" }} />
        <div style={{ position: "relative", zIndex: 1 }}>
          {/* Badge */}
          <div style={{ display: "inline-flex", alignItems: "center", background: "rgba(210,31,60,0.2)", border: "1px solid rgba(210,31,60,0.4)", borderRadius: 100, padding: "5px 14px", marginBottom: 20 }}>
            <span style={{ color: "#D21F3C", fontSize: 11, fontWeight: 700, letterSpacing: "0.1em" }}>AUTHENTIC GHANAIAN CUISINE</span>
          </div>
          <h1 style={{ fontSize: 50, fontWeight: 900, letterSpacing: "-0.04em", lineHeight: 1.05, margin: "0 0 20px" }}>
            <span style={{ color: "#fff" }}>Taste the </span>
            <span style={{ background: "linear-gradient(90deg, #D21F3C, #FF8C42)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>Soul</span>
            <span style={{ color: "#fff" }}> of Ghana.</span>
          </h1>
          <p style={{ color: "rgba(255,255,255,0.65)", fontSize: 15, lineHeight: 1.7, maxWidth: 500, margin: "0 auto 32px" }}>
            Experience the rich, spicy, and savory flavors of West Africa. From our legendary Jollof to crispy fried yam, every bite is a celebration.
          </p>
          <div style={{ display: "flex", gap: 12, justifyContent: "center", marginBottom: 28 }}>
            <button style={{ background: "#D21F3C", color: "#fff", padding: "13px 28px", borderRadius: 10, fontSize: 14, fontWeight: 700, border: "none", cursor: "pointer" }}>Order Now</button>
            <button style={{ background: "transparent", color: "#fff", padding: "13px 28px", borderRadius: 10, fontSize: 14, fontWeight: 500, border: "1px solid rgba(255,255,255,0.3)", cursor: "pointer" }}>Book a Table</button>
            <button style={{ background: "transparent", color: "#fff", padding: "13px 28px", borderRadius: 10, fontSize: 14, fontWeight: 500, border: "1px solid rgba(255,255,255,0.3)", cursor: "pointer" }}>View Menu</button>
          </div>
          {/* Bottom row */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 20 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#22c55e" }} />
              <span style={{ color: "rgba(255,255,255,0.5)", fontSize: 12 }}>Open Now</span>
            </div>
            <span style={{ color: "rgba(255,255,255,0.2)", fontSize: 12 }}>·</span>
            <span style={{ color: "rgba(255,255,255,0.5)", fontSize: 12 }}>⭐ 4.8/5 Customer Rating</span>
          </div>
        </div>
      </div>

      {/* Popular Dishes — light section */}
      <div style={{ padding: "40px 28px", background: "#fff" }}>
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 20 }}>
          <h2 style={{ color: "#111827", fontSize: 18, fontWeight: 700, margin: 0 }}>Popular Dishes</h2>
          <span style={{ color: "#D21F3C", fontSize: 13, cursor: "pointer" }}>Full menu →</span>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16 }}>
          {menuItems.slice(0, 3).map(item => (
            <div key={item.name} style={{ background: "#fff", border: "1px solid #e5e7eb", borderRadius: 14, overflow: "hidden", boxShadow: "0 1px 3px rgba(0,0,0,0.06)" }}>
              <div style={{ height: 100, background: "#fef2f4", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 40 }}>🍽️</div>
              <div style={{ padding: 14 }}>
                <span style={{ background: "#fef2f4", color: "#D21F3C", padding: "2px 7px", borderRadius: 100, fontSize: 9, fontWeight: 600 }}>{item.cat}</span>
                <p style={{ color: "#111827", fontSize: 13, fontWeight: 600, margin: "8px 0 4px", lineHeight: 1.4 }}>{item.name}</p>
                <p style={{ color: "#D21F3C", fontWeight: 700, fontSize: 15, margin: 0 }}>GH₵ {item.price}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function POSScreen() {
  const subtotal = 60 + 100 + 70;
  const vat = subtotal * VAT;
  const total = subtotal + vat;
  return (
    <div style={{ background: "#fff", minHeight: "100%", fontFamily: "system-ui, sans-serif", display: "flex", height: "100%" }}>
      {/* Menu panel */}
      <div style={{ flex: 1, padding: 16, borderRight: "1px solid #e5e7eb" }}>
        <div style={{ display: "flex", gap: 6, marginBottom: 14, flexWrap: "wrap" }}>
          {["All", "Rice Dishes", "Noodles", "Sandwiches", "Sides", "Local", "Drinks"].map((c, i) => (
            <button key={c} style={{ padding: "6px 12px", borderRadius: 8, fontSize: 11, fontWeight: 500, border: i === 0 ? "none" : "1px solid #e5e7eb", background: i === 0 ? "#D21F3C" : "#fff", color: i === 0 ? "#fff" : "#6b7280", cursor: "pointer" }}>{c}</button>
          ))}
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 10 }}>
          {menuItems.map(item => (
            <div key={item.name} style={{ background: "#fff", border: "1px solid #e5e7eb", borderRadius: 10, padding: 12, cursor: "pointer", display: "flex", alignItems: "center", gap: 10, boxShadow: "0 1px 2px rgba(0,0,0,0.04)" }}>
              <div style={{ width: 40, height: 40, borderRadius: 8, background: "#fef2f4", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, fontSize: 20 }}>
                🍽️
              </div>
              <div>
                <p style={{ color: "#111827", fontSize: 11, fontWeight: 600, margin: "0 0 3px", lineHeight: 1.3 }}>{item.name}</p>
                <p style={{ color: "#D21F3C", fontWeight: 700, fontSize: 13, margin: 0 }}>GH₵ {item.price}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Order panel */}
      <div style={{ width: 256, padding: 16, display: "flex", flexDirection: "column", background: "#fafafa" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
          <span style={{ color: "#111827", fontWeight: 700, fontSize: 14 }}>Current Order</span>
          <span style={{ background: "#fef2f4", color: "#D21F3C", padding: "2px 8px", borderRadius: 6, fontSize: 11, fontWeight: 600 }}>Table 3</span>
        </div>
        <div style={{ flex: 1 }}>
          {menuItems.slice(0, 3).map((item, i) => (
            <div key={item.name} style={{ display: "flex", alignItems: "center", gap: 8, padding: "9px 0", borderBottom: "1px solid #e5e7eb" }}>
              <div style={{ flex: 1 }}>
                <p style={{ color: "#374151", fontSize: 11, margin: "0 0 2px", lineHeight: 1.3 }}>{item.name.split(" ").slice(0, 3).join(" ")}</p>
                <p style={{ color: "#9ca3af", fontSize: 10, margin: 0 }}>x{[1, 1, 1][i]}</p>
              </div>
              <span style={{ color: "#111827", fontSize: 12, fontWeight: 600 }}>GH₵ {item.price}</span>
            </div>
          ))}
        </div>
        <div style={{ borderTop: "1px solid #e5e7eb", paddingTop: 12, marginTop: 8 }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
            <span style={{ color: "#9ca3af", fontSize: 12 }}>Subtotal</span>
            <span style={{ color: "#374151", fontSize: 12 }}>GH₵ {subtotal}</span>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 12 }}>
            <span style={{ color: "#9ca3af", fontSize: 12 }}>VAT (12.5%)</span>
            <span style={{ color: "#374151", fontSize: 12 }}>GH₵ {vat.toFixed(2)}</span>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 14 }}>
            <span style={{ color: "#111827", fontWeight: 700, fontSize: 14 }}>Total</span>
            <span style={{ color: "#D21F3C", fontWeight: 800, fontSize: 16 }}>GH₵ {total.toFixed(2)}</span>
          </div>
          <button style={{ width: "100%", background: "#D21F3C", color: "#fff", padding: "11px", borderRadius: 10, fontSize: 13, fontWeight: 700, border: "none", cursor: "pointer" }}>
            Charge Customer
          </button>
        </div>
      </div>
    </div>
  );
}

function DashboardScreen() {
  return (
    <div style={{ background: "#f9fafb", minHeight: "100%", fontFamily: "system-ui, sans-serif", padding: 20 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
        <div>
          <h2 style={{ color: "#111827", fontSize: 18, fontWeight: 800, margin: "0 0 2px" }}>Dashboard</h2>
          <p style={{ color: "#9ca3af", fontSize: 12, margin: 0 }}>Today — Accra</p>
        </div>
        <button style={{ padding: "7px 14px", borderRadius: 8, background: "#fef2f4", border: "1px solid #fca5a5", color: "#D21F3C", fontSize: 12, cursor: "pointer", fontWeight: 600 }}>
          + New Order
        </button>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 12, marginBottom: 20 }}>
        {[["GH₵ 4,820", "Today's Revenue", "#16a34a"], ["38", "Orders Today", "#2563EB"], ["8", "Active Tables", "#D97706"], ["GH₵ 127", "Avg Order Value", "#7c3aed"]].map(([val, label, color]) => (
          <div key={label as string} style={{ background: "#fff", border: "1px solid #e5e7eb", borderRadius: 12, padding: 14 }}>
            <p style={{ color: "#9ca3af", fontSize: 11, margin: "0 0 6px" }}>{label}</p>
            <p style={{ color: color as string, fontWeight: 800, fontSize: 20, margin: 0 }}>{val}</p>
          </div>
        ))}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
        <div style={{ background: "#fff", border: "1px solid #e5e7eb", borderRadius: 12, padding: 16 }}>
          <p style={{ color: "#9ca3af", fontSize: 11, fontWeight: 600, margin: "0 0 12px", letterSpacing: "0.04em" }}>LIVE ORDERS</p>
          {orders.map(o => (
            <div key={o.id} style={{ display: "flex", alignItems: "center", gap: 12, padding: "10px 0", borderBottom: "1px solid #f3f4f6" }}>
              <div style={{ flex: 1 }}>
                <p style={{ color: "#111827", fontSize: 12, fontWeight: 600, margin: "0 0 2px" }}>{o.id} · {o.table}</p>
                <p style={{ color: "#9ca3af", fontSize: 11, margin: 0 }}>{o.items} items · GH₵ {o.total}</p>
              </div>
              <span style={{ padding: "3px 8px", borderRadius: 100, fontSize: 10, fontWeight: 600, background: o.status === "Ready" ? "#f0fdf4" : o.status === "Paid" ? "#eff6ff" : "#fef3c7", color: o.status === "Ready" ? "#16a34a" : o.status === "Paid" ? "#2563EB" : "#d97706" }}>
                {o.status}
              </span>
            </div>
          ))}
        </div>
        <div style={{ background: "#fff", border: "1px solid #e5e7eb", borderRadius: 12, padding: 16 }}>
          <p style={{ color: "#9ca3af", fontSize: 11, fontWeight: 600, margin: "0 0 12px", letterSpacing: "0.04em" }}>SALES BY CATEGORY</p>
          {[["Rice Dishes", 55, "#D21F3C"], ["Local", 22, "#D97706"], ["Drinks", 13, "#2563EB"], ["Sides", 10, "#16a34a"]].map(([cat, pct, color]) => (
            <div key={cat as string} style={{ marginBottom: 12 }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                <span style={{ color: "#6b7280", fontSize: 12 }}>{cat}</span>
                <span style={{ color: "#111827", fontSize: 12, fontWeight: 600 }}>{pct}%</span>
              </div>
              <div style={{ height: 6, background: "#f3f4f6", borderRadius: 3 }}>
                <div style={{ height: 6, width: `${pct}%`, background: color as string, borderRadius: 3 }} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function ReportsScreen() {
  return (
    <div style={{ background: "#f9fafb", minHeight: "100%", fontFamily: "system-ui, sans-serif", padding: 20 }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
        <h2 style={{ color: "#111827", fontSize: 18, fontWeight: 800, margin: 0 }}>Financial Reports</h2>
        <div style={{ display: "flex", gap: 8 }}>
          {["Daily", "Weekly", "Monthly"].map((t, i) => (
            <button key={t} style={{ padding: "6px 12px", borderRadius: 8, fontSize: 11, background: i === 2 ? "#fef2f4" : "#fff", border: i === 2 ? "1px solid #fca5a5" : "1px solid #e5e7eb", color: i === 2 ? "#D21F3C" : "#6b7280", cursor: "pointer", fontWeight: i === 2 ? 600 : 400 }}>{t}</button>
          ))}
        </div>
      </div>

      <div style={{ background: "#fff", border: "1px solid #e5e7eb", borderRadius: 14, padding: 18, marginBottom: 16 }}>
        <p style={{ color: "#9ca3af", fontSize: 11, fontWeight: 600, margin: "0 0 14px", letterSpacing: "0.04em" }}>PROFIT & LOSS — MARCH 2026</p>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 0 }}>
          <div style={{ borderRight: "1px solid #e5e7eb", paddingRight: 16 }}>
            <p style={{ color: "#9ca3af", fontSize: 11, margin: "0 0 8px" }}>Revenue</p>
            {[["Food Sales", "GH₵ 84,200"], ["Beverage Sales", "GH₵ 18,400"], ["Events", "GH₵ 6,800"]].map(([l, v]) => (
              <div key={l as string} style={{ display: "flex", justifyContent: "space-between", padding: "6px 0", borderBottom: "1px solid #f3f4f6" }}>
                <span style={{ color: "#6b7280", fontSize: 12 }}>{l}</span>
                <span style={{ color: "#16a34a", fontSize: 12, fontWeight: 600 }}>{v}</span>
              </div>
            ))}
            <div style={{ display: "flex", justifyContent: "space-between", padding: "8px 0" }}>
              <span style={{ color: "#111827", fontWeight: 700, fontSize: 13 }}>Total Revenue</span>
              <span style={{ color: "#16a34a", fontWeight: 800, fontSize: 14 }}>GH₵ 109,400</span>
            </div>
          </div>
          <div style={{ paddingLeft: 16 }}>
            <p style={{ color: "#9ca3af", fontSize: 11, margin: "0 0 8px" }}>Expenses</p>
            {[["Cost of Goods", "GH₵ 43,760"], ["Staff Payroll", "GH₵ 18,200"], ["Utilities & Rent", "GH₵ 8,400"]].map(([l, v]) => (
              <div key={l as string} style={{ display: "flex", justifyContent: "space-between", padding: "6px 0", borderBottom: "1px solid #f3f4f6" }}>
                <span style={{ color: "#6b7280", fontSize: 12 }}>{l}</span>
                <span style={{ color: "#D21F3C", fontSize: 12, fontWeight: 600 }}>{v}</span>
              </div>
            ))}
            <div style={{ display: "flex", justifyContent: "space-between", padding: "8px 0" }}>
              <span style={{ color: "#111827", fontWeight: 700, fontSize: 13 }}>Total Expenses</span>
              <span style={{ color: "#D21F3C", fontWeight: 800, fontSize: 14 }}>GH₵ 70,360</span>
            </div>
          </div>
        </div>
        <div style={{ marginTop: 14, padding: 14, background: "#f0fdf4", border: "1px solid #bbf7d0", borderRadius: 10, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <span style={{ color: "#111827", fontWeight: 700, fontSize: 14 }}>Net Profit</span>
          <span style={{ color: "#16a34a", fontWeight: 900, fontSize: 22 }}>GH₵ 39,040</span>
        </div>
      </div>
    </div>
  );
}
