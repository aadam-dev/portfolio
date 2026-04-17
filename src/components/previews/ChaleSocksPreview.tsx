"use client";

interface Props { screen: string }

export default function ChaleSocksPreview({ screen }: Props) {
  if (screen === "story") return <Story />;
  return <Landing />;
}

function Landing() {
  return (
    <div style={{ background: "#050505", minHeight: "100%", color: "#fff", fontFamily: "'Playfair Display', serif" }}>
      {/* Top Navigation */}
      <nav style={{ padding: "16px 40px", display: "flex", alignItems: "center", justifyContent: "space-between", background: "rgba(10,10,10,0.8)", backdropFilter: "blur(10px)", borderBottom: "1px solid rgba(255,255,255,0.05)", position: "sticky", top: 0, zIndex: 100 }}>
        <div style={{ fontSize: 18, fontWeight: 700, letterSpacing: "0.15em" }}>CHALÉ SOCKS</div>
        
        <div style={{ display: "flex", gap: 32, alignItems: "center", fontSize: 10, fontWeight: 600, letterSpacing: "0.1em" }}>
          <span style={{ cursor: "pointer", display: "flex", alignItems: "center", gap: 4 }}>STYLES ⌵</span>
          <span style={{ cursor: "pointer", display: "flex", alignItems: "center", gap: 4 }}>GIFTS ⌵</span>
          <span style={{ cursor: "pointer" }}>GYE NYAME</span>
          <span style={{ cursor: "pointer" }}>BLOG</span>
        </div>

        <div style={{ display: "flex", gap: 24, alignItems: "center", fontSize: 10, fontWeight: 600 }}>
          <span style={{ cursor: "pointer" }}>🔍</span>
          <div style={{ display: "flex", alignItems: "center", gap: 6, background: "rgba(255,255,255,0.05)", padding: "4px 10px", borderRadius: 4 }}>
            <span>🇬🇭 GHS ⌵</span>
          </div>
          <div style={{ position: "relative", cursor: "pointer" }}>
            <span>CART</span>
            <span style={{ position: "absolute", top: -4, right: -12, background: "#D91F3C", color: "#fff", fontSize: 9, padding: "1px 5px", borderRadius: 10 }}>0</span>
          </div>
        </div>
      </nav>

      <div style={{ padding: "80px 48px", minHeight: "calc(100vh - 60px)" }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 64, alignItems: "center" }}>
          <div>
            <h1 style={{ fontSize: 72, fontWeight: 400, lineHeight: 1, marginBottom: 32, letterSpacing: "-0.01em" }}>
              Elevate<br />Your Sole.
            </h1>
            <button style={{ 
              background: "#121212", 
              color: "#fff", 
              border: "1px solid rgba(255,255,255,0.1)", 
              padding: "14px 40px", 
              fontSize: 12, 
              fontWeight: 600, 
              letterSpacing: "0.05em",
              boxShadow: "0 4px 24px rgba(0,0,0,0.5), 0 0 20px rgba(255,255,255,0.02)",
              cursor: "pointer",
              transition: "all 0.3s ease"
            }}>
              Shop Now
            </button>
          </div>
          <div style={{ 
            borderRadius: 32, 
            overflow: "hidden", 
            aspectRatio: "1/1", 
            background: "url('/images/projects/chalesocks.png') center/cover",
            boxShadow: "0 20px 40px rgba(0,0,0,0.6)"
          }} />
        </div>
      </div>

      {/* Ticker Section */}
      <div style={{ background: "#C59E47", color: "#000", padding: "12px 0", overflow: "hidden", whiteSpace: "nowrap" }}>
        <div style={{ display: "inline-block", fontSize: 13, fontWeight: 700, letterSpacing: "0.2em", padding: "0 20px" }}>
          AUTHENTIC. VIBRANT. AFRICAN. • AUTHENTIC. VIBRANT. AFRICAN. • AUTHENTIC. VIBRANT. AFRICAN. • AUTHENTIC. VIBRANT. AFRICAN. • AUTHENTIC. VIBRANT. AFRICAN.
        </div>
      </div>
    </div>
  );
}

function Story() {
  return (
    <div style={{ background: "#050505", minHeight: "100%", padding: "80px 40px", color: "#fff", fontFamily: "'Playfair Display', serif" }}>
      <div style={{ maxWidth: 1000, margin: "0 auto" }}>
        <h2 style={{ fontSize: 48, fontWeight: 400, textAlign: "center", marginBottom: 64 }}>The Chale Story</h2>
        
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24 }}>
          <div style={{ 
            borderRadius: 24, 
            height: 480, 
            background: "linear-gradient(rgba(0,0,0,0.2), rgba(0,0,0,0.5)), url('/images/projects/chalesocks-2.png') center/cover",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: 32,
            textAlign: "center"
          }}>
            <h3 style={{ fontSize: 32, fontWeight: 400 }}>Chalé means buddy or friend.</h3>
          </div>
          <div style={{ 
            borderRadius: 24, 
            height: 480, 
            background: "linear-gradient(rgba(0,0,0,0.2), rgba(0,0,0,0.5)), url('/images/projects/chalesocks.png') center/cover",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: 32,
            textAlign: "center"
          }}>
            <h3 style={{ fontSize: 32, fontWeight: 400 }}>Inspired by creative exploits.</h3>
          </div>
        </div>
      </div>
    </div>
  );
}
