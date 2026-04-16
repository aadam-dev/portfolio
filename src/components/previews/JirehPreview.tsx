"use client";

interface Props { screen: string }

const featured = [
  { name: "Jollof Rice", subtitle: "With grilled or fried chicken", price: "GH₵ 40 - 65", tag: "Bestseller" },
  { name: "Asian Fried Rice", subtitle: "With grilled or fried chicken", price: "GH₵ 40 - 65", tag: "Popular" },
  { name: "Fufu", subtitle: "Meat / goat light soup", price: "GH₵ 50 - 60", tag: "Classic" },
];

const foodMenu = [
  { name: "Jollof Rice", desc: "With grilled or fried chicken.", prices: ["Small GH₵ 40", "Medium GH₵ 55", "Large GH₵ 65"] },
  { name: "Asian Fried Rice", desc: "With grilled or fried chicken.", prices: ["Small GH₵ 40", "Medium GH₵ 55", "Large GH₵ 65"] },
  { name: "Fries with Chicken", desc: "Crispy potato fries with fried chicken.", prices: ["Regular GH₵ 60"] },
  { name: "Fufu", desc: "With meat / goat light soup.", prices: ["Medium GH₵ 50", "Large GH₵ 60"] },
  { name: "Banku", desc: "With okro stew or groundnut soup.", prices: ["Medium GH₵ 40", "Large GH₵ 50"] },
];

export default function JirehPreview({ screen }: Props) {
  if (screen === "menu") return <MenuScreen />;
  if (screen === "contact") return <ContactScreen />;
  return <LandingScreen />;
}

function LandingScreen() {
  return (
    <div style={{ background: "#070b12", minHeight: "100%", fontFamily: "system-ui, sans-serif", color: "#fff" }}>
      <nav style={{ padding: "14px 24px", borderBottom: "1px solid rgba(255,255,255,0.08)", display: "flex", alignItems: "center", justifyContent: "space-between", background: "rgba(6,10,16,0.9)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ width: 30, height: 30, borderRadius: 8, background: "#84cc16", display: "flex", alignItems: "center", justifyContent: "center", color: "#111827", fontWeight: 900, fontSize: 14 }}>
            JN
          </div>
          <span style={{ color: "#f8fafc", fontSize: 14, fontWeight: 800, letterSpacing: "0.02em" }}>Jireh Natural Foods</span>
        </div>
        <div style={{ display: "flex", gap: 18, alignItems: "center" }}>
          {["About", "Menu", "Visit", "Contact"].map((item) => (
            <span key={item} style={{ color: "rgba(255,255,255,0.7)", fontSize: 12 }}>{item}</span>
          ))}
          <button style={{ background: "rgba(132,204,22,0.16)", color: "#d9f99d", border: "1px solid rgba(132,204,22,0.5)", borderRadius: 999, padding: "7px 12px", fontSize: 12, fontWeight: 700 }}>
            Order WhatsApp
          </button>
        </div>
      </nav>

      <div style={{ background: "linear-gradient(180deg, #0b1220 0%, #0d1628 100%)", padding: "46px 28px 34px", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
        <div style={{ maxWidth: 760 }}>
          <span style={{ display: "inline-block", fontSize: 11, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: "#bef264", marginBottom: 14 }}>
            Pure, Honest, Delicious
          </span>
          <h1 style={{ margin: "0 0 12px", fontSize: 36, lineHeight: 1.06, letterSpacing: "-0.03em", fontWeight: 900 }}>
            Authentic Ghanaian meals,
            <br />
            naturally prepared.
          </h1>
          <p style={{ margin: "0 0 20px", color: "rgba(255,255,255,0.78)", fontSize: 14, lineHeight: 1.7, maxWidth: 560 }}>
            Jireh Natural Foods serves home-style dishes built around natural ingredients, fast pickup, and simple ordering through WhatsApp and Bolt Food.
          </p>
          <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
            <button style={{ background: "#84cc16", color: "#111827", border: "none", borderRadius: 999, padding: "10px 16px", fontSize: 13, fontWeight: 800 }}>
              Order via WhatsApp
            </button>
            <button style={{ background: "rgba(255,255,255,0.06)", color: "#fff", border: "1px solid rgba(255,255,255,0.2)", borderRadius: 999, padding: "10px 16px", fontSize: 13, fontWeight: 600 }}>
              Order on Bolt Food
            </button>
            <button style={{ background: "transparent", color: "#fff", border: "1px solid rgba(255,255,255,0.3)", borderRadius: 999, padding: "10px 16px", fontSize: 13, fontWeight: 600 }}>
              Call now
            </button>
          </div>
          <div style={{ marginTop: 12, display: "inline-flex", border: "1px solid rgba(255,255,255,0.15)", background: "rgba(0,0,0,0.3)", borderRadius: 999, padding: "6px 12px", fontSize: 12, color: "rgba(255,255,255,0.92)" }}>
            <span style={{ color: "#facc15", fontWeight: 700, marginRight: 8 }}>★ 4.3</span>
            Bolt Food favourite in Adenta
          </div>
        </div>
      </div>

      <div style={{ padding: "20px 28px 28px" }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12, marginBottom: 14 }}>
          {[
            ["11am - 8pm", "Mon - Sat · Closed Sunday"],
            ["100%", "No monosodium foods"],
            ["Fast", "Pickup and delivery"],
          ].map(([value, label]) => (
            <div key={value} style={{ border: "1px solid rgba(255,255,255,0.12)", borderRadius: 14, padding: 12, background: "rgba(0,0,0,0.28)" }}>
              <p style={{ margin: "0 0 3px", fontSize: 20, fontWeight: 800 }}>{value}</p>
              <p style={{ margin: 0, color: "rgba(255,255,255,0.72)", fontSize: 11 }}>{label}</p>
            </div>
          ))}
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12 }}>
          {[
            ["Natural Ingredients", "Fresh produce, quality proteins, and no monosodium additives."],
            ["Cooked with Care", "Home-style prep for rich taste and clean eating."],
            ["Fast, Friendly Service", "Direct ordering and responsive local support."],
          ].map(([title, body]) => (
            <div key={title} style={{ border: "1px solid rgba(255,255,255,0.08)", borderRadius: 14, padding: 14, background: "rgba(255,255,255,0.03)" }}>
              <p style={{ margin: "0 0 6px", color: "#f8fafc", fontSize: 13, fontWeight: 700 }}>{title}</p>
              <p style={{ margin: 0, color: "rgba(255,255,255,0.68)", fontSize: 12, lineHeight: 1.55 }}>{body}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function MenuScreen() {
  return (
    <div style={{ background: "#090f18", minHeight: "100%", fontFamily: "system-ui, sans-serif", padding: 20, color: "#fff" }}>
      <div style={{ marginBottom: 16 }}>
        <h2 style={{ margin: "0 0 4px", color: "#f8fafc", fontSize: 22, fontWeight: 800 }}>Our Full Menu</h2>
        <p style={{ margin: 0, color: "rgba(255,255,255,0.7)", fontSize: 12 }}>
          Wholesome Ghanaian meals and fresh juices made daily.
        </p>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12, marginBottom: 14 }}>
        {featured.map((item) => (
          <div key={item.name} style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.12)", borderRadius: 14, padding: 14 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 8 }}>
              <span style={{ background: "rgba(132,204,22,0.18)", color: "#d9f99d", fontSize: 10, fontWeight: 700, padding: "2px 8px", borderRadius: 999 }}>
                {item.tag}
              </span>
              <span style={{ color: "#bef264", fontSize: 12, fontWeight: 700 }}>{item.price}</span>
            </div>
            <p style={{ margin: "0 0 4px", color: "#f8fafc", fontSize: 14, fontWeight: 700 }}>{item.name}</p>
            <p style={{ margin: 0, color: "rgba(255,255,255,0.72)", fontSize: 12 }}>{item.subtitle}</p>
          </div>
        ))}
      </div>
      <div style={{ border: "1px solid rgba(255,255,255,0.12)", borderRadius: 16, background: "rgba(0,0,0,0.28)", padding: 14 }}>
        {foodMenu.map((item, idx) => (
          <div key={item.name} style={{ padding: "10px 0", borderBottom: idx < foodMenu.length - 1 ? "1px solid rgba(255,255,255,0.08)" : "none" }}>
            <p style={{ margin: "0 0 4px", color: "#f8fafc", fontSize: 13, fontWeight: 700 }}>{item.name}</p>
            <p style={{ margin: "0 0 7px", color: "rgba(255,255,255,0.62)", fontSize: 11 }}>{item.desc}</p>
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
              {item.prices.map((row) => (
                <span key={row} style={{ fontSize: 11, background: "rgba(132,204,22,0.12)", color: "#d9f99d", padding: "4px 8px", borderRadius: 999, border: "1px solid rgba(132,204,22,0.28)" }}>
                  {row}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function ContactScreen() {
  return (
    <div style={{ background: "#0a111c", minHeight: "100%", fontFamily: "system-ui, sans-serif", padding: 24, color: "#fff" }}>
      <h2 style={{ margin: "0 0 8px", color: "#f8fafc", fontSize: 22, fontWeight: 800 }}>Contact & Ordering Channels</h2>
      <p style={{ margin: "0 0 18px", color: "rgba(255,255,255,0.72)", fontSize: 12 }}>
        Mirrors the live contact section with direct links for phone, WhatsApp, Bolt Food, and socials.
      </p>

      <div style={{ display: "grid", gridTemplateColumns: "1.2fr 1fr", gap: 14 }}>
        <div style={{ border: "1px solid rgba(255,255,255,0.12)", borderRadius: 12, padding: 14, background: "rgba(255,255,255,0.03)" }}>
          <p style={{ margin: "0 0 10px", color: "#f8fafc", fontSize: 13, fontWeight: 700 }}>Quick actions</p>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
            {[
              ["Call now", "+233 55 113 3481"],
              ["WhatsApp Inquiry", "Direct order and inquiries"],
              ["Bolt Food", "Open delivery listing"],
              ["Get directions", "Adenta Housing Down, Accra"],
            ].map(([title, sub]) => (
              <div key={title} style={{ background: "rgba(0,0,0,0.25)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 10, padding: 10 }}>
                <p style={{ margin: "0 0 3px", color: "#f8fafc", fontSize: 12, fontWeight: 700 }}>{title}</p>
                <p style={{ margin: 0, color: "rgba(255,255,255,0.66)", fontSize: 11 }}>{sub}</p>
              </div>
            ))}
          </div>
        </div>

        <div style={{ border: "1px solid rgba(255,255,255,0.12)", borderRadius: 12, padding: 14, background: "rgba(0,0,0,0.25)" }}>
          <p style={{ margin: "0 0 10px", color: "#f8fafc", fontSize: 13, fontWeight: 700 }}>Social handles</p>
          <ul style={{ margin: 0, paddingLeft: 16, color: "rgba(255,255,255,0.75)", fontSize: 12, lineHeight: 1.7 }}>
            <li>TikTok: @jirehnaturalfoods</li>
            <li>Facebook: @jirehnaturalfoods</li>
            <li>Instagram: @jirehnaturalfoods</li>
            <li>WhatsApp direct ordering enabled</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
