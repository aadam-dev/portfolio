"use client";

interface Props { screen: string }

const items = [
  { name: "Coca-Cola 50cl", sku: "BEV-001", price: 5.5, stock: 48, cat: "Beverages" },
  { name: "Indomie Chicken (70g)", sku: "FD-012", price: 2.5, stock: 200, cat: "Food" },
  { name: "Milo 500g Tin", sku: "FD-034", price: 38, stock: 12, cat: "Food" },
  { name: "Toilet Roll (6pk)", sku: "HH-007", price: 12, stock: 35, cat: "Household" },
  { name: "Fair & White Lotion", sku: "BT-021", price: 22, stock: 8, cat: "Beauty" },
  { name: "Airtel Recharge (GH₵10)", sku: "TLM-001", price: 10, stock: 999, cat: "Airtime" },
];

const cart = [
  { name: "Coca-Cola 50cl", qty: 3, price: 5.5 },
  { name: "Indomie Chicken (70g)", qty: 5, price: 2.5 },
  { name: "Milo 500g Tin", qty: 1, price: 38 },
];

export default function MakossaPreview({ screen }: Props) {
  if (screen === "inventory") return <Inventory />;
  if (screen === "reports") return <Reports />;
  return <POS />;
}

function POS() {
  return (
    <div style={{ background: "#0D0D16", minHeight: "100%", fontFamily: "system-ui, sans-serif", display: "flex", flexDirection: "column", height: "100%" }}>
      {/* Title bar — desktop app style */}
      <div style={{ padding: "8px 16px", background: "#0A0A12", borderBottom: "1px solid rgba(255,255,255,0.06)", display: "flex", alignItems: "center", gap: 12 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <div style={{ width: 24, height: 24, borderRadius: 6, background: "#A78BFA", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <span style={{ fontSize: 12 }}>🛒</span>
          </div>
          <span style={{ color: "#fff", fontWeight: 700, fontSize: 13 }}>Makossa Shop</span>
        </div>
        <div style={{ flex: 1 }} />
        <div style={{ display: "flex", gap: 4 }}>
          {["POS", "Inventory", "Reports", "Settings"].map((t, i) => (
            <button key={t} style={{ padding: "5px 12px", borderRadius: 6, fontSize: 11, fontWeight: 500, background: i === 0 ? "rgba(167,139,250,0.15)" : "transparent", border: i === 0 ? "1px solid rgba(167,139,250,0.2)" : "1px solid transparent", color: i === 0 ? "#A78BFA" : "rgba(255,255,255,0.4)", cursor: "pointer" }}>{t}</button>
          ))}
        </div>
        <div style={{ display: "flex", gap: 6, alignItems: "center", marginLeft: 12 }}>
          <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#10B981" }} />
          <span style={{ color: "rgba(255,255,255,0.4)", fontSize: 11 }}>Offline · SQLite</span>
        </div>
      </div>

      {/* Main POS */}
      <div style={{ flex: 1, display: "flex" }}>
        {/* Product grid */}
        <div style={{ flex: 1, padding: 16 }}>
          <div style={{ display: "flex", gap: 6, marginBottom: 14 }}>
            <input readOnly placeholder="🔍 Search products or scan barcode..." style={{ flex: 1, background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 8, padding: "8px 12px", color: "rgba(255,255,255,0.5)", fontSize: 12, outline: "none" }} />
            {["All", "Food", "Beverages", "Household", "Beauty"].map((c, i) => (
              <button key={c} style={{ padding: "7px 12px", borderRadius: 8, fontSize: 11, fontWeight: 500, background: i === 0 ? "#A78BFA" : "rgba(255,255,255,0.04)", border: "none", color: i === 0 ? "#fff" : "rgba(255,255,255,0.4)", cursor: "pointer" }}>{c}</button>
            ))}
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 10 }}>
            {items.map(item => (
              <div key={item.name} style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 10, padding: 12, cursor: "pointer", transition: "border-color 0.2s" }}>
                <div style={{ marginBottom: 6 }}>
                  <span style={{ background: "rgba(167,139,250,0.1)", color: "#A78BFA", padding: "2px 6px", borderRadius: 4, fontSize: 9, fontWeight: 600 }}>{item.cat}</span>
                </div>
                <p style={{ color: "#fff", fontSize: 12, fontWeight: 600, margin: "0 0 3px", lineHeight: 1.4 }}>{item.name}</p>
                <p style={{ color: "rgba(255,255,255,0.3)", fontSize: 10, margin: "0 0 8px" }}>{item.sku}</p>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                  <span style={{ color: "#A78BFA", fontWeight: 700, fontSize: 15 }}>GH₵{item.price}</span>
                  <span style={{ color: item.stock < 15 ? "#EF4444" : "rgba(255,255,255,0.3)", fontSize: 10 }}>
                    {item.stock < 15 ? "⚠ " : ""}{item.stock} left
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Cart */}
        <div style={{ width: 240, borderLeft: "1px solid rgba(255,255,255,0.06)", padding: 16, display: "flex", flexDirection: "column" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>
            <span style={{ color: "#fff", fontWeight: 700, fontSize: 14 }}>Current Sale</span>
            <span style={{ background: "rgba(167,139,250,0.1)", color: "#A78BFA", padding: "2px 8px", borderRadius: 100, fontSize: 11, fontWeight: 600 }}>Receipt #0047</span>
          </div>
          <div style={{ flex: 1 }}>
            {cart.map(c => (
              <div key={c.name} style={{ padding: "8px 0", borderBottom: "1px solid rgba(255,255,255,0.04)", display: "flex", gap: 8 }}>
                <div style={{ flex: 1 }}>
                  <p style={{ color: "rgba(255,255,255,0.8)", fontSize: 11, margin: "0 0 2px" }}>{c.name}</p>
                  <p style={{ color: "rgba(255,255,255,0.3)", fontSize: 10, margin: 0 }}>x{c.qty} × GH₵{c.price}</p>
                </div>
                <span style={{ color: "#fff", fontSize: 11, fontWeight: 600 }}>GH₵{(c.qty * c.price).toFixed(2)}</span>
              </div>
            ))}
          </div>
          <div style={{ borderTop: "1px solid rgba(255,255,255,0.06)", paddingTop: 12 }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
              <span style={{ color: "rgba(255,255,255,0.4)", fontSize: 12 }}>Subtotal</span>
              <span style={{ color: "#fff", fontSize: 12 }}>GH₵64.00</span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 14 }}>
              <span style={{ color: "#fff", fontWeight: 700, fontSize: 14 }}>Total</span>
              <span style={{ color: "#A78BFA", fontWeight: 800, fontSize: 18 }}>GH₵64.00</span>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginBottom: 8 }}>
              <button style={{ background: "rgba(255,255,255,0.05)", color: "rgba(255,255,255,0.6)", padding: "9px", borderRadius: 8, fontSize: 12, border: "1px solid rgba(255,255,255,0.08)", cursor: "pointer" }}>
                📱 MoMo
              </button>
              <button style={{ background: "#A78BFA", color: "#fff", padding: "9px", borderRadius: 8, fontSize: 12, fontWeight: 600, border: "none", cursor: "pointer" }}>
                💵 Cash
              </button>
            </div>
            <button style={{ width: "100%", background: "rgba(255,255,255,0.03)", color: "rgba(255,255,255,0.3)", padding: "7px", borderRadius: 8, fontSize: 11, border: "1px solid rgba(255,255,255,0.06)", cursor: "pointer" }}>
              Clear Cart
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function Inventory() {
  return (
    <div style={{ background: "#0D0D16", minHeight: "100%", fontFamily: "system-ui, sans-serif", padding: 20 }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
        <h2 style={{ color: "#fff", fontSize: 18, fontWeight: 800, margin: 0 }}>Inventory</h2>
        <div style={{ display: "flex", gap: 8 }}>
          <button style={{ padding: "7px 14px", borderRadius: 8, background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.2)", color: "#EF4444", fontSize: 12, cursor: "pointer" }}>⚠ Low Stock (2)</button>
          <button style={{ padding: "7px 14px", borderRadius: 8, background: "#A78BFA", color: "#fff", fontSize: 12, fontWeight: 600, border: "none", cursor: "pointer" }}>+ Add Product</button>
        </div>
      </div>

      {/* Stats */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 12, marginBottom: 20 }}>
        {[["6", "Products"], ["310", "Total Units"], ["GH₵ 1,890", "Stock Value"], ["2", "Low Stock"]].map(([val, label]) => (
          <div key={label} style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 10, padding: 14 }}>
            <p style={{ color: "rgba(255,255,255,0.4)", fontSize: 11, margin: "0 0 4px" }}>{label}</p>
            <p style={{ color: "#fff", fontWeight: 800, fontSize: 18, margin: 0 }}>{val}</p>
          </div>
        ))}
      </div>

      {/* Table */}
      <div style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 12, overflow: "hidden" }}>
        {items.map((item, i) => (
          <div key={item.name} style={{ display: "grid", gridTemplateColumns: "1fr 100px 80px 100px 80px", gap: 0, padding: "12px 16px", borderBottom: i < items.length - 1 ? "1px solid rgba(255,255,255,0.04)" : "none", alignItems: "center" }}>
            <div>
              <p style={{ color: "#fff", fontSize: 13, fontWeight: 600, margin: "0 0 2px" }}>{item.name}</p>
              <p style={{ color: "rgba(255,255,255,0.3)", fontSize: 11, margin: 0 }}>{item.sku}</p>
            </div>
            <span style={{ background: "rgba(167,139,250,0.08)", color: "#A78BFA", padding: "3px 8px", borderRadius: 6, fontSize: 10, fontWeight: 500 }}>{item.cat}</span>
            <span style={{ color: "#A78BFA", fontWeight: 700, fontSize: 13 }}>GH₵{item.price}</span>
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
                <div style={{ height: 4, width: 60, background: "rgba(255,255,255,0.08)", borderRadius: 2 }}>
                  <div style={{ height: 4, width: `${Math.min(100, (item.stock / 50) * 100)}%`, background: item.stock < 15 ? "#EF4444" : "#10B981", borderRadius: 2 }} />
                </div>
                <span style={{ color: item.stock < 15 ? "#EF4444" : "rgba(255,255,255,0.5)", fontSize: 11 }}>{item.stock}</span>
              </div>
            </div>
            <button style={{ padding: "5px 10px", borderRadius: 6, background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.06)", color: "rgba(255,255,255,0.4)", fontSize: 11, cursor: "pointer" }}>Edit</button>
          </div>
        ))}
      </div>
    </div>
  );
}

function Reports() {
  return (
    <div style={{ background: "#0D0D16", minHeight: "100%", fontFamily: "system-ui, sans-serif", padding: 20 }}>
      <h2 style={{ color: "#fff", fontSize: 18, fontWeight: 800, margin: "0 0 20px" }}>Sales Reports</h2>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12, marginBottom: 20 }}>
        {[["GH₵ 4,220", "Today's Sales", "#A78BFA"], ["GH₵ 28,410", "This Week", "#10B981"], ["GH₵ 94,800", "This Month", "#F59E0B"]].map(([val, label, color]) => (
          <div key={label as string} style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 12, padding: 16 }}>
            <p style={{ color: "rgba(255,255,255,0.4)", fontSize: 12, margin: "0 0 6px" }}>{label}</p>
            <p style={{ color, fontWeight: 800, fontSize: 22, margin: 0 }}>{val}</p>
          </div>
        ))}
      </div>

      <div style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 12, padding: 16 }}>
        <p style={{ color: "rgba(255,255,255,0.4)", fontSize: 11, fontWeight: 600, margin: "0 0 14px", letterSpacing: "0.04em" }}>TODAY'S TRANSACTIONS</p>
        {[["09:15", "Receipt #0044", "Milo, Indomie (x3)", "GH₵ 45.50"], ["10:02", "Receipt #0045", "Airtel Recharge (x2)", "GH₵ 20.00"], ["11:48", "Receipt #0046", "Coca-Cola (x6), Toilet Roll", "GH₵ 45.00"], ["13:22", "Receipt #0047", "Current Sale (open)", "GH₵ 64.00"]].map(([time, ref, desc, amt]) => (
          <div key={ref} style={{ display: "flex", gap: 16, alignItems: "center", padding: "10px 0", borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
            <span style={{ color: "rgba(255,255,255,0.3)", fontSize: 11, minWidth: 36 }}>{time}</span>
            <span style={{ color: "#A78BFA", fontSize: 11, fontWeight: 600, minWidth: 80 }}>{ref}</span>
            <span style={{ color: "rgba(255,255,255,0.5)", fontSize: 12, flex: 1 }}>{desc}</span>
            <span style={{ color: "#fff", fontWeight: 700, fontSize: 13 }}>{amt}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
