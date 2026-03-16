"use client";

interface Props { screen: string }

export default function EthikaPreview({ screen }: Props) {
  if (screen === "comparison") return <Comparison />;
  if (screen === "vault") return <Vault />;
  return <Landing />;
}

function Landing() {
  const trustPills = [
    "BoG Framework Aligned",
    "AAOIFI Methodology",
    "Scholar Reviewed",
    "Free & Independent",
    "EN & FR",
  ];

  return (
    <div style={{ background: "#FAFAF9", minHeight: "100%", fontFamily: "'Georgia', 'Times New Roman', serif" }}>
      {/* Nav */}
      <nav style={{
        padding: "14px 28px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        borderBottom: "1px solid #E7E5E4",
        background: "#FAFAF9",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{
            width: 32,
            height: 32,
            borderRadius: 8,
            background: "#EA580C",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}>
            <span style={{ color: "#fff", fontWeight: 800, fontSize: 14, fontFamily: "system-ui, sans-serif" }}>E</span>
          </div>
          <span style={{ color: "#0F172A", fontWeight: 700, fontSize: 14, fontFamily: "system-ui, sans-serif" }}>
            Ethika Finance
          </span>
        </div>
        <div style={{ display: "flex", gap: 22, alignItems: "center" }}>
          {["About NIB", "Knowledge Vault", "Regulations", "Directory"].map(l => (
            <span key={l} style={{ color: "#475569", fontSize: 12, cursor: "pointer", fontFamily: "system-ui, sans-serif" }}>{l}</span>
          ))}
          <div style={{ display: "flex", gap: 3 }}>
            {["EN", "FR"].map((lang, i) => (
              <button key={lang} style={{
                padding: "4px 10px",
                borderRadius: 6,
                fontSize: 11,
                fontWeight: 600,
                fontFamily: "system-ui, sans-serif",
                border: i === 0 ? "none" : "1px solid #D6D3D1",
                background: i === 0 ? "#EA580C" : "transparent",
                color: i === 0 ? "#fff" : "#78716C",
                cursor: "pointer",
              }}>{lang}</button>
            ))}
          </div>
        </div>
      </nav>

      {/* Hero */}
      <div style={{ padding: "52px 28px 44px", display: "flex", gap: 32, alignItems: "flex-start" }}>
        {/* Left column */}
        <div style={{ flex: "1 1 0", minWidth: 0 }}>
          {/* Badge */}
          <div style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 6,
            background: "#FFF7ED",
            border: "1px solid #FED7AA",
            borderRadius: 100,
            padding: "5px 14px",
            marginBottom: 22,
          }}>
            <span style={{ color: "#EA580C", fontSize: 11, fontWeight: 600, fontFamily: "system-ui, sans-serif", letterSpacing: "0.01em" }}>
              Ghana&apos;s #1 Non-Interest Banking Platform
            </span>
          </div>

          {/* Title */}
          <h1 style={{ margin: "0 0 8px", lineHeight: 1.1, letterSpacing: "-0.03em" }}>
            <span style={{ display: "block", color: "#0F172A", fontSize: 46, fontWeight: 800 }}>
              Finance Without Interest.
            </span>
            <span style={{ display: "block", color: "#EA580C", fontSize: 46, fontWeight: 800 }}>
              Built for Ghana.
            </span>
          </h1>

          {/* Subtitle */}
          <p style={{
            color: "#475569",
            fontSize: 13,
            lineHeight: 1.75,
            margin: "18px 0 30px",
            fontFamily: "system-ui, sans-serif",
            maxWidth: 460,
          }}>
            Your trusted guide to Non-Interest Banking, Shariah-compliant finance, and ethical
            investment — anchored in the Bank of Ghana&apos;s regulatory framework.
          </p>

          {/* CTA Buttons */}
          <div style={{ display: "flex", gap: 12, flexWrap: "wrap", marginBottom: 36 }}>
            <button style={{
              background: "#0F172A",
              color: "#fff",
              padding: "11px 22px",
              borderRadius: 100,
              fontSize: 13,
              fontWeight: 600,
              fontFamily: "system-ui, sans-serif",
              border: "none",
              cursor: "pointer",
              letterSpacing: "-0.01em",
            }}>
              Explore the Knowledge Vault
            </button>
            <button style={{
              background: "transparent",
              color: "#0F172A",
              padding: "11px 22px",
              borderRadius: 100,
              fontSize: 13,
              fontWeight: 600,
              fontFamily: "system-ui, sans-serif",
              border: "1.5px solid #CBD5E1",
              cursor: "pointer",
              letterSpacing: "-0.01em",
            }}>
              View BoG Regulations
            </button>
          </div>

          {/* Trust Pills */}
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
            {trustPills.map(pill => (
              <span key={pill} style={{
                background: "#F5F5F4",
                border: "1px solid #E7E5E4",
                borderRadius: 100,
                padding: "5px 13px",
                fontSize: 11,
                fontWeight: 500,
                color: "#44403C",
                fontFamily: "system-ui, sans-serif",
              }}>{pill}</span>
            ))}
          </div>
        </div>

        {/* Right column — floating stat cards */}
        <div style={{ flexShrink: 0, display: "flex", flexDirection: "column", gap: 14, paddingTop: 16, width: 180 }}>
          <div style={{
            background: "#fff",
            border: "1px solid #E7E5E4",
            borderRadius: 16,
            padding: "20px 18px",
            boxShadow: "0 4px 24px rgba(15,23,42,0.07)",
          }}>
            <div style={{ color: "#EA580C", fontSize: 36, fontWeight: 800, lineHeight: 1 }}>14+</div>
            <div style={{ color: "#0F172A", fontSize: 12, fontWeight: 600, fontFamily: "system-ui, sans-serif", marginTop: 6 }}>NIB Product Types</div>
            <div style={{ color: "#94A3B8", fontSize: 11, fontFamily: "system-ui, sans-serif", marginTop: 3 }}>Murabaha · Sukuk · Takaful</div>
          </div>
          <div style={{
            background: "#fff",
            border: "1px solid #E7E5E4",
            borderRadius: 16,
            padding: "20px 18px",
            boxShadow: "0 4px 24px rgba(15,23,42,0.07)",
          }}>
            <div style={{ color: "#0F172A", fontSize: 36, fontWeight: 800, lineHeight: 1 }}>12</div>
            <div style={{ color: "#0F172A", fontSize: 12, fontWeight: 600, fontFamily: "system-ui, sans-serif", marginTop: 6 }}>Free Knowledge</div>
            <div style={{ color: "#94A3B8", fontSize: 11, fontFamily: "system-ui, sans-serif", marginTop: 3 }}>Vault lessons</div>
          </div>
        </div>
      </div>
    </div>
  );
}

function Comparison() {
  const rows = [
    ["Basis", "Asset-backed / profit-sharing", "Interest (riba) on loans"],
    ["Savings Returns", "Profit-sharing ratio (PLS)", "Fixed interest rate"],
    ["Loan Structure", "Murabaha / cost-plus sale", "Interest-bearing loan"],
    ["Risk Sharing", "Shared between bank & client", "Risk on borrower only"],
    ["Ethical Screen", "No alcohol, gambling, tobacco", "No ethical restrictions"],
    ["Ghana Regulator", "Bank of Ghana (Tier 1–4)", "Bank of Ghana (Tier 1–4)"],
    ["Deposit Insurance", "GH₵ 20,000 (GDC)", "GH₵ 20,000 (GDC)"],
  ];

  return (
    <div style={{ background: "#fff", minHeight: "100%", fontFamily: "system-ui, sans-serif", padding: 24 }}>
      <div style={{ marginBottom: 22 }}>
        <p style={{ color: "#EA580C", fontSize: 11, fontWeight: 700, letterSpacing: "0.08em", margin: "0 0 6px" }}>SIDE-BY-SIDE</p>
        <h2 style={{ color: "#0F172A", fontSize: 20, fontWeight: 800, margin: "0 0 4px", letterSpacing: "-0.02em", fontFamily: "'Georgia', serif" }}>
          NIB vs Conventional Banking
        </h2>
        <p style={{ color: "#64748B", fontSize: 13, margin: 0 }}>Understand the key differences before you choose</p>
      </div>

      <div style={{
        display: "grid",
        gridTemplateColumns: "1fr 1fr 1fr",
        borderRadius: 12,
        overflow: "hidden",
        border: "1px solid #E2E8F0",
      }}>
        {/* Header row */}
        <div style={{ padding: "12px 16px", background: "#F8FAFC", borderBottom: "1px solid #E2E8F0" }}>
          <span style={{ color: "#94A3B8", fontSize: 11, fontWeight: 700, letterSpacing: "0.06em" }}>FEATURE</span>
        </div>
        <div style={{ padding: "12px 16px", background: "#FFF7ED", borderBottom: "1px solid #E2E8F0", borderLeft: "1px solid #FED7AA" }}>
          <span style={{ color: "#EA580C", fontSize: 11, fontWeight: 700, letterSpacing: "0.06em" }}>NON-INTEREST BANKING</span>
        </div>
        <div style={{ padding: "12px 16px", background: "#F8FAFC", borderBottom: "1px solid #E2E8F0", borderLeft: "1px solid #E2E8F0" }}>
          <span style={{ color: "#94A3B8", fontSize: 11, fontWeight: 700, letterSpacing: "0.06em" }}>CONVENTIONAL BANKING</span>
        </div>

        {rows.map(([feat, nib, conv], i) => (
          <>
            <div key={`f${i}`} style={{ padding: "11px 16px", borderBottom: i < rows.length - 1 ? "1px solid #F1F5F9" : "none", background: "#fff" }}>
              <span style={{ color: "#1E293B", fontSize: 12, fontWeight: 600 }}>{feat}</span>
            </div>
            <div key={`n${i}`} style={{ padding: "11px 16px", borderBottom: i < rows.length - 1 ? "1px solid #F1F5F9" : "none", borderLeft: "1px solid #FED7AA", background: "#FFFBF7" }}>
              <span style={{ color: "#1E293B", fontSize: 12 }}>{nib}</span>
            </div>
            <div key={`c${i}`} style={{ padding: "11px 16px", borderBottom: i < rows.length - 1 ? "1px solid #F1F5F9" : "none", borderLeft: "1px solid #E2E8F0", background: "#fff" }}>
              <span style={{ color: "#64748B", fontSize: 12 }}>{conv}</span>
            </div>
          </>
        ))}
      </div>

      <div style={{
        marginTop: 16,
        padding: "13px 16px",
        background: "#FFF7ED",
        border: "1px solid #FED7AA",
        borderRadius: 10,
      }}>
        <p style={{ color: "#EA580C", fontSize: 12, fontWeight: 600, margin: "0 0 4px" }}>Note from BoG</p>
        <p style={{ color: "#78716C", fontSize: 12, margin: 0, lineHeight: 1.65 }}>
          The Bank of Ghana&apos;s NIB framework (2022) permits both full NIB institutions and NIB windows within conventional banks. Both are deposit-insured under the Ghana Deposit Protection Scheme.
        </p>
      </div>
    </div>
  );
}

function Vault() {
  const articles = [
    { title: "What is Non-Interest Banking? A Ghanaian Primer", tag: "Explainer", readTime: "6 min", fresh: true },
    { title: "BoG's NIB Policy Framework — What It Means for You", tag: "Regulation", readTime: "10 min", fresh: false },
    { title: "Murabaha vs Bank Loan — A Practical Comparison", tag: "Products", readTime: "8 min", fresh: false },
    { title: "Profit-Sharing Accounts: How Returns Are Calculated", tag: "Savings", readTime: "7 min", fresh: true },
    { title: "NIB in West Africa: Ghana, Senegal, and Nigeria", tag: "Regional", readTime: "12 min", fresh: false },
    { title: "Common Myths About Non-Interest Banking Debunked", tag: "Explainer", readTime: "5 min", fresh: false },
  ];

  return (
    <div style={{ background: "#F5F5F4", minHeight: "100%", fontFamily: "system-ui, sans-serif", padding: 24 }}>
      <div style={{ marginBottom: 22 }}>
        <p style={{ color: "#EA580C", fontSize: 11, fontWeight: 700, letterSpacing: "0.08em", margin: "0 0 6px" }}>EDUCATION</p>
        <h2 style={{ color: "#0F172A", fontSize: 20, fontWeight: 800, margin: "0 0 4px", letterSpacing: "-0.02em", fontFamily: "'Georgia', serif" }}>
          Knowledge Vault
        </h2>
        <p style={{ color: "#78716C", fontSize: 13, margin: 0 }}>Guides, explainers, and regulatory updates for NIB</p>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
        {articles.map(a => (
          <div key={a.title} style={{
            background: "#fff",
            border: "1px solid #E7E5E4",
            borderRadius: 12,
            padding: 16,
            cursor: "pointer",
          }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 10 }}>
              <div style={{ display: "flex", gap: 6 }}>
                <span style={{
                  background: "#FFF7ED",
                  color: "#EA580C",
                  padding: "3px 9px",
                  borderRadius: 100,
                  fontSize: 10,
                  fontWeight: 600,
                  border: "1px solid #FED7AA",
                }}>{a.tag}</span>
                {a.fresh && (
                  <span style={{
                    background: "#F0FDF4",
                    color: "#16A34A",
                    padding: "3px 9px",
                    borderRadius: 100,
                    fontSize: 10,
                    fontWeight: 600,
                    border: "1px solid #BBF7D0",
                  }}>New</span>
                )}
              </div>
              <span style={{ color: "#A8A29E", fontSize: 11 }}>{a.readTime} read</span>
            </div>
            <p style={{ color: "#1E293B", fontSize: 13, fontWeight: 600, margin: "0 0 10px", lineHeight: 1.45, fontFamily: "'Georgia', serif" }}>
              {a.title}
            </p>
            <span style={{ color: "#EA580C", fontSize: 12, fontWeight: 500 }}>Read article →</span>
          </div>
        ))}
      </div>
    </div>
  );
}
