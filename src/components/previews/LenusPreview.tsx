"use client";

interface Props { screen: string }

const products = [
  { name: "Paracetamol 500mg (24 tabs)", brand: "Panadol", price: 12, cat: "Pain Relief", rx: false, stock: true },
  { name: "Amoxicillin 250mg (21 caps)", brand: "Generic", price: 28, cat: "Antibiotics", rx: true, stock: true },
  { name: "Vitamin C 1000mg (30 tabs)", brand: "Berocca", price: 45, cat: "Supplements", rx: false, stock: true },
  { name: "Ibuprofen 400mg (24 tabs)", brand: "Brufen", price: 18, cat: "Pain Relief", rx: false, stock: true },
  { name: "ORS Sachet (10 pack)", brand: "Dioralyte", price: 8, cat: "Hydration", rx: false, stock: false },
  { name: "Cetirizine 10mg (20 tabs)", brand: "Zyrtec", price: 22, cat: "Allergy", rx: false, stock: true },
];

const branches = [
  { name: "Botwe 3rd Gate", hours: "Mon–Sat 7am–9pm, Sun 8am–6pm", phone: "+233 54 832 5792" },
  { name: "Lakeside Estates", hours: "Mon–Sat 7am–8pm, Sun 9am–5pm", phone: "+233 54 832 5792" },
  { name: "Madina", hours: "Mon–Sat 8am–8pm, Sun 9am–4pm", phone: "+233 54 832 5792" },
];

export default function LenusPreview({ screen }: Props) {
  if (screen === "shop") return <Shop />;
  if (screen === "checkout") return <Checkout />;
  return <Landing />;
}

function Landing() {
  return (
    <div style={{ background: "#fff", minHeight: "100%", fontFamily: "system-ui, sans-serif" }}>
      {/* Nav */}
      <nav style={{ padding: "14px 24px", display: "flex", alignItems: "center", justifyContent: "space-between", borderBottom: "1px solid #e5e7eb", background: "#fff" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <img src="/previews/lenus/logo.png" alt="Lenus Pharmacy" style={{ height: 36, width: "auto", objectFit: "contain" }} />
          <span style={{ color: "#111827", fontWeight: 800, fontSize: 17 }}>Lenus<span style={{ color: "#0d9488" }}>.</span></span>
        </div>
        <div style={{ display: "flex", gap: 20, alignItems: "center" }}>
          {["Shop", "Prescriptions", "Branches", "Delivery"].map(l => (
            <span key={l} style={{ color: "#6b7280", fontSize: 12, cursor: "pointer" }}>{l}</span>
          ))}
          <button style={{ background: "#0d9488", border: "none", color: "#fff", padding: "6px 14px", borderRadius: 8, fontSize: 12, fontWeight: 600, cursor: "pointer" }}>
            Order Now
          </button>
        </div>
      </nav>

      {/* Hero - DARK background */}
      <div style={{ background: "linear-gradient(135deg, #0a1628 0%, #0d2137 100%)", padding: "52px 28px 48px" }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 48, alignItems: "center", maxWidth: 900, margin: "0 auto" }}>
          {/* Left: text */}
          <div>
            <div style={{ display: "inline-flex", alignItems: "center", gap: 6, background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.12)", borderRadius: 100, padding: "4px 14px", marginBottom: 20 }}>
              <span style={{ width: 7, height: 7, borderRadius: "50%", background: "#22c55e", display: "inline-block", flexShrink: 0 }} />
              <span style={{ color: "rgba(255,255,255,0.9)", fontSize: 11, fontWeight: 500 }}>Trusted by thousands in Accra</span>
            </div>
            <h1 style={{ color: "#fff", fontSize: 36, fontWeight: 800, letterSpacing: "-0.03em", lineHeight: 1.15, margin: "0 0 16px" }}>
              Modern Pharmacy,<br />
              <span style={{ color: "#0d9488" }}>Old-fashioned Care.</span>
            </h1>
            <p style={{ color: "rgba(255,255,255,0.85)", fontSize: 13, lineHeight: 1.7, margin: "0 0 24px" }}>
              Genuine medicines, expert advice, and doorstep delivery. 2000+ products across 3 branches in Botwe, Lakeside Estates, and Madina. Prescriptions via WhatsApp.
            </p>
            <div style={{ display: "flex", gap: 12 }}>
              <button style={{ background: "#0d9488", color: "#fff", padding: "11px 22px", borderRadius: 10, fontSize: 13, fontWeight: 700, border: "none", cursor: "pointer" }}>
                Order Medicines
              </button>
              <button style={{ background: "transparent", color: "#fff", padding: "11px 22px", borderRadius: 10, fontSize: 13, fontWeight: 500, border: "1px solid rgba(255,255,255,0.35)", cursor: "pointer" }}>
                Upload Prescription
              </button>
            </div>
          </div>

          {/* Right: 2x2 feature boxes */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            {[
              ["2000+ Products", "Genuine medicines"],
              ["Expert Pharmacists", "Licensed & certified"],
              ["Fast Delivery", "GhanaPostGPS"],
              ["3 Locations", "Botwe · Lakeside · Madina"],
            ].map(([title, desc]) => (
              <div key={title} style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.12)", borderRadius: 12, padding: 14 }}>
                <p style={{ color: "#fff", fontSize: 13, fontWeight: 600, margin: "0 0 4px" }}>{title}</p>
                <p style={{ color: "rgba(255,255,255,0.55)", fontSize: 11, margin: 0 }}>{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Features strip */}
      <div style={{ background: "#f9fafb", padding: "28px 28px" }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(6, 1fr)", gap: 16, maxWidth: 900, margin: "0 auto" }}>
          {[
            ["🏥", "NEPP Registered", "Regulatory compliant"],
            ["🛵", "Fast Delivery", "GhanaPostGPS"],
            ["👨‍⚕️", "Expert Care", "Licensed pharmacists"],
            ["🔬", "Rapid Diagnostics", "On-site testing"],
            ["🌿", "Organic Products", "Natural remedies"],
            ["🛒", "Pharmacy Mart", "One-stop shop"],
          ].map(([emoji, title, desc]) => (
            <div key={title} style={{ display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center", gap: 6 }}>
              <span style={{ fontSize: 22 }}>{emoji}</span>
              <span style={{ color: "#111827", fontSize: 12, fontWeight: 700, lineHeight: 1.2 }}>{title}</span>
              <span style={{ color: "#9ca3af", fontSize: 11, lineHeight: 1.3 }}>{desc}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Category cards section */}
      <div style={{ background: "#fff", padding: "28px 28px" }}>
        <div style={{ maxWidth: 900, margin: "0 auto" }}>
          <p style={{ color: "#0d9488", fontSize: 11, fontWeight: 700, letterSpacing: "0.08em", margin: "0 0 6px", textTransform: "uppercase" }}>Shop by Category</p>
          <h2 style={{ color: "#111827", fontSize: 22, fontWeight: 800, margin: "0 0 20px" }}>Find What You Need</h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: 12 }}>
            {[
              ["🩹", "Pain Relief", "Analgesics & anti-inflammatories"],
              ["💊", "Vitamins & Supplements", "Daily health support"],
              ["🩺", "First Aid", "Bandages, antiseptics & more"],
              ["🧴", "Personal Care", "Skincare & hygiene"],
              ["📋", "Prescriptions", "via WhatsApp"],
            ].map(([emoji, title, desc]) => (
              <div key={title} style={{ background: "#fff", border: "1px solid #e5e7eb", borderRadius: 14, padding: "16px 12px", display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center", gap: 8, cursor: "pointer" }}>
                <span style={{ fontSize: 24 }}>{emoji}</span>
                <span style={{ color: "#111827", fontSize: 12, fontWeight: 700, lineHeight: 1.3 }}>{title}</span>
                <span style={{ color: "#9ca3af", fontSize: 10, lineHeight: 1.4 }}>{desc}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Dark CTA section */}
      <div style={{ padding: "0 28px 32px" }}>
        <div style={{ background: "linear-gradient(135deg, #0a1628 0%, #0d2137 100%)", borderRadius: 16, padding: "32px 32px", maxWidth: 900, margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 24 }}>
          <div>
            <h3 style={{ color: "#fff", fontSize: 20, fontWeight: 800, margin: "0 0 8px" }}>Ready to prioritize your health?</h3>
            <p style={{ color: "rgba(255,255,255,0.6)", fontSize: 13, margin: 0 }}>Order online or visit any of our 3 branches in Accra.</p>
          </div>
          <div style={{ display: "flex", gap: 12, flexShrink: 0 }}>
            <button style={{ background: "#0d9488", color: "#fff", padding: "11px 22px", borderRadius: 10, fontSize: 13, fontWeight: 700, border: "none", cursor: "pointer", whiteSpace: "nowrap" }}>
              Order Now
            </button>
            <button style={{ background: "transparent", color: "#fff", padding: "11px 22px", borderRadius: 10, fontSize: 13, fontWeight: 500, border: "1px solid rgba(255,255,255,0.35)", cursor: "pointer", whiteSpace: "nowrap" }}>
              Find a Branch
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function Shop() {
  return (
    <div style={{ background: "#fff", minHeight: "100%", fontFamily: "system-ui, sans-serif", padding: 20 }}>
      <div style={{ display: "flex", gap: 16 }}>
        {/* Sidebar */}
        <div style={{ width: 160, flexShrink: 0 }}>
          <p style={{ color: "#9ca3af", fontSize: 11, fontWeight: 600, margin: "0 0 10px", letterSpacing: "0.04em" }}>CATEGORIES</p>
          {["All", "Pain Relief", "Antibiotics", "Supplements", "Allergy", "Hydration", "Skincare"].map((c, i) => (
            <div key={c} style={{ padding: "7px 10px", borderRadius: 8, background: i === 0 ? "#f0fdfa" : "transparent", color: i === 0 ? "#0d9488" : "#6b7280", fontSize: 12, cursor: "pointer", marginBottom: 2, fontWeight: i === 0 ? 600 : 400 }}>{c}</div>
          ))}
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
            <span style={{ color: "#6b7280", fontSize: 13 }}>6 products shown</span>
            <input readOnly placeholder="Search medicines..." style={{ background: "#f9fafb", border: "1px solid #e5e7eb", color: "#6b7280", padding: "6px 12px", borderRadius: 8, fontSize: 12, outline: "none" }} />
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 12 }}>
            {products.map(p => (
              <div key={p.name} style={{ background: "#fff", border: "1px solid #e5e7eb", borderRadius: 12, padding: 14 }}>
                <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 8 }}>
                  <div style={{ display: "flex", gap: 6 }}>
                    {p.rx && <span style={{ background: "#fef3c7", color: "#d97706", padding: "2px 6px", borderRadius: 4, fontSize: 9, fontWeight: 700 }}>Rx</span>}
                    <span style={{ background: "#f0fdfa", color: "#0d9488", padding: "2px 6px", borderRadius: 4, fontSize: 9 }}>{p.cat}</span>
                  </div>
                  {!p.stock && <span style={{ color: "#ef4444", fontSize: 10 }}>Out of stock</span>}
                </div>
                <p style={{ color: "#111827", fontSize: 12, fontWeight: 600, margin: "0 0 3px", lineHeight: 1.4 }}>{p.name}</p>
                <p style={{ color: "#9ca3af", fontSize: 11, margin: "0 0 10px" }}>{p.brand}</p>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                  <span style={{ color: "#0d9488", fontWeight: 700, fontSize: 15 }}>GH₵ {p.price}</span>
                  <button disabled={!p.stock} style={{ background: p.stock ? "#0d9488" : "#f3f4f6", color: p.stock ? "#fff" : "#9ca3af", padding: "5px 10px", borderRadius: 7, fontSize: 11, fontWeight: 600, border: "none", cursor: p.stock ? "pointer" : "not-allowed" }}>
                    + Cart
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function Checkout() {
  return (
    <div style={{ background: "#fff", minHeight: "100%", fontFamily: "system-ui, sans-serif", padding: 24 }}>
      <h2 style={{ color: "#111827", fontSize: 20, fontWeight: 700, margin: "0 0 24px" }}>Checkout</h2>
      <div style={{ display: "grid", gridTemplateColumns: "1.2fr 1fr", gap: 24 }}>
        <div>
          <div style={{ background: "#f9fafb", border: "1px solid #e5e7eb", borderRadius: 12, padding: 16, marginBottom: 16 }}>
            <p style={{ color: "#9ca3af", fontSize: 12, fontWeight: 600, margin: "0 0 14px", letterSpacing: "0.04em" }}>DELIVERY INFO</p>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 10 }}>
              {[["First Name", ""], ["Last Name", ""], ["Phone", "+233 20 123 4567"], ["GhanaPostGPS", "GA-123-4567"]].map(([label, val]) => (
                <div key={label as string}>
                  <label style={{ color: "#9ca3af", fontSize: 11, display: "block", marginBottom: 4, fontWeight: 500 }}>{label}</label>
                  <input readOnly defaultValue={val as string} placeholder={val ? undefined : "Enter..."} style={{ width: "100%", background: "#fff", border: "1px solid #e5e7eb", borderRadius: 8, padding: "8px 10px", color: "#111827", fontSize: 12, outline: "none" }} />
                </div>
              ))}
            </div>
            <div style={{ padding: 10, background: "#f0fdfa", borderRadius: 8, border: "1px solid #0d948825" }}>
              <p style={{ color: "#0d9488", fontSize: 11, margin: 0 }}>📍 GPS code detected. Delivery available (Accra, Greater Accra Region)</p>
            </div>
          </div>
          <div style={{ padding: 12, background: "#f9fafb", borderRadius: 10, border: "1px solid #e5e7eb" }}>
            <p style={{ color: "#6b7280", fontSize: 12, margin: 0 }}>✓ No account needed. Guest checkout enabled. Order updates via SMS.</p>
          </div>
        </div>

        <div style={{ background: "#f9fafb", border: "1px solid #e5e7eb", borderRadius: 12, padding: 16, alignSelf: "start" }}>
          <p style={{ color: "#9ca3af", fontSize: 12, fontWeight: 600, margin: "0 0 14px", letterSpacing: "0.04em" }}>ORDER SUMMARY</p>
          {products.slice(0, 3).map(p => (
            <div key={p.name} style={{ display: "flex", justifyContent: "space-between", padding: "6px 0", borderBottom: "1px solid #e5e7eb" }}>
              <span style={{ color: "#6b7280", fontSize: 12 }}>{p.name.split(" ").slice(0, 3).join(" ")}...</span>
              <span style={{ color: "#111827", fontSize: 12 }}>GH₵ {p.price}</span>
            </div>
          ))}
          <div style={{ display: "flex", justifyContent: "space-between", padding: "8px 0", borderBottom: "1px solid #e5e7eb" }}>
            <span style={{ color: "#9ca3af", fontSize: 12 }}>Delivery</span>
            <span style={{ color: "#0d9488", fontSize: 12 }}>GH₵ 20</span>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", padding: "12px 0 4px" }}>
            <span style={{ color: "#111827", fontWeight: 700 }}>Total</span>
            <span style={{ color: "#0d9488", fontWeight: 800, fontSize: 18 }}>GH₵ 103</span>
          </div>
          <button style={{ width: "100%", background: "#0d9488", color: "#fff", padding: "13px", borderRadius: 10, fontSize: 14, fontWeight: 700, border: "none", cursor: "pointer", marginTop: 14 }}>
            Pay with Mobile Money
          </button>
          <p style={{ color: "#9ca3af", fontSize: 11, textAlign: "center", marginTop: 8 }}>Powered by Paystack · Secured</p>
        </div>
      </div>
    </div>
  );
}
