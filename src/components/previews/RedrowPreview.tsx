"use client";

interface Props { screen: string }

export default function RedrowPreview({ screen }: Props) {
  if (screen === "shop") return <Shop />;
  return <Landing />;
}

function Landing() {
  return (
    <div style={{ background: "#F8F9FA", minHeight: "100%", color: "#1A1A1A", fontFamily: "'Inter', sans-serif", position: "relative", overflow: "hidden" }}>
      {/* Header */}
      <nav style={{ padding: "20px 48px", display: "flex", alignItems: "center", justifyContent: "space-between", background: "rgba(255,255,255,0.8)", backdropFilter: "blur(10px)", borderBottom: "1px solid rgba(0,0,0,0.03)", position: "sticky", top: 0, zIndex: 100 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ width: 32, height: 32, borderRadius: 8, background: "#059669", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <span style={{ color: "#fff", fontSize: 18 }}>🥦</span>
          </div>
          <span style={{ fontWeight: 800, fontSize: 18, letterSpacing: "-0.02em" }}>Redrow Minimart</span>
        </div>
        
        <div style={{ display: "flex", gap: 32, alignItems: "center", fontSize: 13, fontWeight: 500 }}>
          <span style={{ color: "#059669", fontWeight: 700 }}>Home</span>
          <span style={{ color: "#6B7280" }}>Shop</span>
          <span style={{ color: "#6B7280" }}>About</span>
          <span style={{ color: "#6B7280" }}>Contact</span>
        </div>

        <div style={{ display: "flex", gap: 20, alignItems: "center" }}>
          <span>🔍</span>
          <span>▦</span>
          <div style={{ width: 36, height: 36, borderRadius: "50%", background: "#F3F4F6", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <span>🛒</span>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div style={{ padding: "80px 48px 40px", display: "flex", alignItems: "center" }}>
        <div style={{ flex: 1, maxWidth: 500 }}>
          <div style={{ display: "inline-block", background: "#fff", border: "1px solid #E5E7EB", padding: "6px 16px", borderRadius: 100, fontSize: 10, fontWeight: 700, letterSpacing: "0.1em", marginBottom: 32 }}>
            PREMIUM MINIMART EXPERIENCE
          </div>
          <h1 style={{ fontSize: 72, fontWeight: 900, lineHeight: 0.9, letterSpacing: "-0.04em", marginBottom: 32 }}>
            Your daily<br />
            <span style={{ 
              background: "linear-gradient(90deg, #10B981 0%, #059669 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent"
            }}>essentials</span><br />
            elevated.
          </h1>
          <p style={{ color: "#6B7280", fontSize: 16, lineHeight: 1.6, marginBottom: 40 }}>
            Experience convenience like never before. From organic produce to daily household needs, we bring the best of Redrow Estate to your doorstep.
          </p>
          <div style={{ display: "flex", gap: 16 }}>
            <button style={{ background: "#F3F4F6", color: "#6B7280", border: "none", padding: "14px 28px", borderRadius: 100, fontSize: 13, fontWeight: 600, display: "flex", alignItems: "center", gap: 8 }}>
              Shop Groceries <span>→</span>
            </button>
            <button style={{ background: "#fff", color: "#1A1A1A", border: "1px solid #E5E7EB", padding: "14px 28px", borderRadius: 100, fontSize: 13, fontWeight: 600, boxShadow: "0 4px 12px rgba(0,0,0,0.05)" }}>
              Get Directions
            </button>
          </div>
        </div>

        {/* Floating Cards UI Mockup */}
        <div style={{ flex: 1.2, position: "relative", height: 500 }}>
          {/* Main Background Card */}
          <div style={{ position: "absolute", right: 0, top: 40, width: "90%", height: "85%", background: "#fff", borderRadius: 48, border: "1px solid #E5E7EB", transform: "rotate(2deg)" }} />
          
          <div style={{ position: "relative", zIndex: 1, height: "100%" }}>
            {/* Delivery Card */}
            <div style={{ position: "absolute", top: 60, left: 20, background: "#fff", padding: "20px 24px", borderRadius: 24, boxShadow: "0 20px 40px rgba(0,0,0,0.08)", border: "1px solid #F3F4F6", display: "flex", alignItems: "center", gap: 16 }}>
              <div style={{ width: 44, height: 44, borderRadius: 12, background: "#F0FDF4", display: "flex", alignItems: "center", justifyContent: "center", color: "#059669" }}>
                ⚡️
              </div>
              <div>
                <p style={{ color: "#9CA3AF", fontSize: 10, fontWeight: 700, letterSpacing: "0.05em", marginBottom: 2 }}>EST. DELIVERY</p>
                <p style={{ fontSize: 18, fontWeight: 700 }}>15 - 25 Mins</p>
              </div>
            </div>

            {/* Quality Badge */}
            <div style={{ position: "absolute", bottom: 100, right: 0, background: "#fff", padding: "20px 24px", borderRadius: 24, boxShadow: "0 20px 40px rgba(0,0,0,0.08)", border: "1px solid #F3F4F6", display: "flex", alignItems: "center", gap: 16 }}>
              <div style={{ width: 44, height: 44, borderRadius: 12, background: "#FFFBEB", display: "flex", alignItems: "center", justifyContent: "center", color: "#D97706" }}>
                🛡️
              </div>
              <div>
                <p style={{ color: "#9CA3AF", fontSize: 10, fontWeight: 700, letterSpacing: "0.05em", marginBottom: 2 }}>VERIFIED</p>
                <p style={{ fontSize: 18, fontWeight: 700 }}>Top Quality</p>
              </div>
            </div>

            {/* Social Proof */}
            <div style={{ position: "absolute", bottom: 20, left: 100, background: "#fff", padding: "16px 24px", borderRadius: 20, boxShadow: "0 20px 40px rgba(0,0,0,0.08)", border: "1px solid #F3F4F6", display: "flex", alignItems: "center", gap: 12 }}>
              <div style={{ display: "flex", marginLeft: 4 }}>
                {[1, 2, 3].map(i => (
                  <div key={i} style={{ width: 32, height: 32, borderRadius: "50%", background: "#E5E7EB", border: "2px solid #fff", marginLeft: -8 }} />
                ))}
              </div>
              <div>
                <p style={{ color: "#9CA3AF", fontSize: 9, fontWeight: 700, letterSpacing: "0.05em" }}>TRUSTED BY</p>
                <p style={{ fontSize: 13, fontWeight: 700 }}>500+ Local Families</p>
              </div>
            </div>

            {/* Logo Silhouette */}
            <div style={{ position: "absolute", top: "40%", left: "45%", opacity: 0.1, transform: "scale(2)" }}>
              🛒
            </div>
          </div>
        </div>
      </div>

      {/* Footer Features */}
      <div style={{ padding: "0 48px 60px", display: "flex", gap: 64 }}>
        {[
          { icon: "🍃", title: "ALWAYS FRESH" },
          { icon: "⚡️", title: "FAST DELIVERY" },
          { icon: "🛡️", title: "QUALITY GUARANTEED" }
        ].map(f => (
          <div key={f.title} style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <span style={{ fontSize: 14 }}>{f.icon}</span>
            <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.1em", color: "#1A1A1A" }}>{f.title}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function Shop() {
  return (
    <div style={{ background: "#fff", minHeight: "100%", padding: 48 }}>
       <h2 style={{ fontSize: 24, fontWeight: 800, marginBottom: 32 }}>Fresh Selection</h2>
       <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 24 }}>
         {[
           { name: "Organic Avocados", price: "GHS 12.00", icon: "🥑" },
           { name: "Fresh Milk", price: "GHS 18.00", icon: "🥛" },
           { name: "Whole Wheat Bread", price: "GHS 15.00", icon: "🍞" },
           { name: "Golden Apples", price: "GHS 25.00", icon: "🍎" }
         ].map(item => (
           <div key={item.name} style={{ background: "#F9FAFB", padding: 20, borderRadius: 20 }}>
             <div style={{ width: "100%", aspectRatio: "1/1", background: "#fff", borderRadius: 16, marginBottom: 16, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 32 }}>
               {item.icon}
             </div>
             <p style={{ fontSize: 14, fontWeight: 600, marginBottom: 4 }}>{item.name}</p>
             <p style={{ fontSize: 13, color: "#059669", fontWeight: 700 }}>{item.price}</p>
           </div>
         ))}
       </div>
    </div>
  );
}
