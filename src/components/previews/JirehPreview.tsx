"use client";

interface Props { screen: string }

const menuHighlights = [
  { name: "Jollof Rice", note: "With grilled or fried chicken", price: "GH₵ 40 - 65", tag: "Bestseller" },
  { name: "Asian Fried Rice", note: "With grilled or fried chicken", price: "GH₵ 40 - 65", tag: "Popular" },
  { name: "Fufu", note: "Meat / goat light soup", price: "GH₵ 50 - 60", tag: "Classic" },
  { name: "Banku", note: "Okro stew or groundnut soup", price: "GH₵ 40 - 50", tag: "Traditional" },
  { name: "Fries with Chicken", note: "Crispy potato fries with fried chicken", price: "GH₵ 60", tag: "Quick Bite" },
  { name: "Fresh Juices", note: "Sobolo, millet drink, pineapple", price: "GH₵ 10", tag: "Drinks" },
];

export default function JirehPreview({ screen }: Props) {
  if (screen === "menu") return <MenuScreen />;
  if (screen === "contact") return <ContactScreen />;
  return <LandingScreen />;
}

function LandingScreen() {
  return (
    <div style={{ background: "#fff", minHeight: "100%", fontFamily: "system-ui, sans-serif" }}>
      <nav style={{ padding: "14px 24px", borderBottom: "1px solid #e5e7eb", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ width: 30, height: 30, borderRadius: 8, background: "#5ecf4f", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontWeight: 800, fontSize: 14 }}>
            JN
          </div>
          <span style={{ color: "#111827", fontSize: 15, fontWeight: 800 }}>Jireh Natural Foods</span>
        </div>
        <div style={{ display: "flex", gap: 18, alignItems: "center" }}>
          {["Home", "Menu", "Order", "Contact"].map((item) => (
            <span key={item} style={{ color: "#6b7280", fontSize: 12 }}>{item}</span>
          ))}
          <button style={{ background: "#5ecf4f", color: "#fff", border: "none", borderRadius: 8, padding: "7px 12px", fontSize: 12, fontWeight: 700 }}>
            Order Now
          </button>
        </div>
      </nav>

      <div style={{ background: "linear-gradient(135deg, #0f172a 0%, #1f2937 100%)", padding: "48px 28px", color: "#fff" }}>
        <div style={{ maxWidth: 760 }}>
          <span style={{ display: "inline-block", fontSize: 11, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: "#86efac", marginBottom: 14 }}>
            Freshly Prepared Daily
          </span>
          <h1 style={{ margin: "0 0 14px", fontSize: 38, lineHeight: 1.08, letterSpacing: "-0.03em", fontWeight: 900 }}>
            Local favorites with
            <br />
            modern service speed.
          </h1>
          <p style={{ margin: "0 0 20px", color: "rgba(255,255,255,0.78)", fontSize: 14, lineHeight: 1.7, maxWidth: 560 }}>
            Jireh Natural Foods combines rich Ghanaian flavors with easy online ordering, direct WhatsApp support, and delivery-friendly menu flows for customers across Accra.
          </p>
          <div style={{ display: "flex", gap: 10 }}>
            <button style={{ background: "#5ecf4f", color: "#fff", border: "none", borderRadius: 10, padding: "10px 16px", fontSize: 13, fontWeight: 700 }}>
              View menu
            </button>
            <button style={{ background: "transparent", color: "#fff", border: "1px solid rgba(255,255,255,0.35)", borderRadius: 10, padding: "10px 16px", fontSize: 13, fontWeight: 600 }}>
              WhatsApp order
            </button>
          </div>
        </div>
      </div>

      <div style={{ padding: "24px 28px 32px" }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12 }}>
          {[
            ["Natural ingredients", "Fresh produce and quality proteins in every meal."],
            ["Fast fulfillment", "Clear order channels via call, WhatsApp, and Bolt Food."],
            ["Local trust", "Built for daily repeat customers and neighborhood visibility."],
          ].map(([title, body]) => (
            <div key={title} style={{ border: "1px solid #e5e7eb", borderRadius: 12, padding: 14 }}>
              <p style={{ margin: "0 0 6px", color: "#111827", fontSize: 13, fontWeight: 700 }}>{title}</p>
              <p style={{ margin: 0, color: "#6b7280", fontSize: 12, lineHeight: 1.55 }}>{body}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function MenuScreen() {
  return (
    <div style={{ background: "#f8fafc", minHeight: "100%", fontFamily: "system-ui, sans-serif", padding: 20 }}>
      <div style={{ marginBottom: 16 }}>
        <h2 style={{ margin: "0 0 4px", color: "#111827", fontSize: 20, fontWeight: 800 }}>Menu Highlights</h2>
        <p style={{ margin: 0, color: "#6b7280", fontSize: 12 }}>Best-performing dishes featured for fast selection.</p>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 12 }}>
        {menuHighlights.map((item) => (
          <div key={item.name} style={{ background: "#fff", border: "1px solid #e5e7eb", borderRadius: 12, padding: 14 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 8 }}>
              <span style={{ background: "#dcfce7", color: "#166534", fontSize: 10, fontWeight: 700, padding: "2px 8px", borderRadius: 999 }}>
                {item.tag}
              </span>
              <span style={{ color: "#5ecf4f", fontSize: 12, fontWeight: 700 }}>{item.price}</span>
            </div>
            <p style={{ margin: "0 0 4px", color: "#111827", fontSize: 14, fontWeight: 700 }}>{item.name}</p>
            <p style={{ margin: 0, color: "#6b7280", fontSize: 12 }}>{item.note}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

function ContactScreen() {
  return (
    <div style={{ background: "#fff", minHeight: "100%", fontFamily: "system-ui, sans-serif", padding: 24 }}>
      <h2 style={{ margin: "0 0 8px", color: "#111827", fontSize: 20, fontWeight: 800 }}>Order & Contact</h2>
      <p style={{ margin: "0 0 18px", color: "#6b7280", fontSize: 12 }}>
        Conversion-focused contact section connecting users to direct order channels.
      </p>

      <div style={{ display: "grid", gridTemplateColumns: "1.2fr 1fr", gap: 14 }}>
        <div style={{ border: "1px solid #e5e7eb", borderRadius: 12, padding: 14, background: "#f8fafc" }}>
          <p style={{ margin: "0 0 10px", color: "#111827", fontSize: 13, fontWeight: 700 }}>Quick actions</p>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
            {[
              ["Call now", "+233 55 113 3481"],
              ["WhatsApp", "Direct order chat"],
              ["Bolt Food", "Open delivery listing"],
              ["Maps", "Find kiosk location"],
            ].map(([title, sub]) => (
              <div key={title} style={{ background: "#fff", border: "1px solid #e5e7eb", borderRadius: 10, padding: 10 }}>
                <p style={{ margin: "0 0 3px", color: "#111827", fontSize: 12, fontWeight: 700 }}>{title}</p>
                <p style={{ margin: 0, color: "#6b7280", fontSize: 11 }}>{sub}</p>
              </div>
            ))}
          </div>
        </div>

        <div style={{ border: "1px solid #e5e7eb", borderRadius: 12, padding: 14 }}>
          <p style={{ margin: "0 0 10px", color: "#111827", fontSize: 13, fontWeight: 700 }}>Social proof</p>
          <ul style={{ margin: 0, paddingLeft: 16, color: "#4b5563", fontSize: 12, lineHeight: 1.7 }}>
            <li>Unified social handle presence</li>
            <li>Direct ordering from homepage CTA</li>
            <li>Menu cards optimized for fast decisions</li>
            <li>Mobile-first call to action flow</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
