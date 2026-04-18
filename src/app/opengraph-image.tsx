import { ImageResponse } from "next/og";

export const runtime = "edge";

export const alt = "Aadam — Studio for product, data & engineering";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OG() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "72px",
          background:
            "radial-gradient(ellipse 120% 80% at 50% -10%, rgba(124,106,250,0.45) 0%, rgba(8,8,12,1) 60%), #08080C",
          color: "#F2F2F5",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 16,
            fontFamily: "system-ui",
            fontSize: 22,
            letterSpacing: "0.18em",
            textTransform: "uppercase",
            color: "rgba(242,242,245,0.5)",
          }}
        >
          <span
            style={{
              width: 10,
              height: 10,
              borderRadius: 999,
              background: "#4ade80",
              boxShadow: "0 0 14px #4ade80",
            }}
          />
          AADAM · STUDIO
        </div>

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 24,
            fontFamily: "Georgia, serif",
            fontWeight: 400,
            fontSize: 96,
            lineHeight: 1,
            letterSpacing: "-0.035em",
          }}
        >
          <div>An independent studio</div>
          <div style={{ fontStyle: "italic", color: "rgba(242,242,245,0.7)" }}>
            building the tools
          </div>
          <div>
            businesses{" "}
            <span
              style={{
                color: "transparent",
                backgroundImage:
                  "linear-gradient(135deg, #FFFFFF 0%, #C7BFFF 55%, #7C6AFA 100%)",
                backgroundClip: "text",
              }}
            >
              actually use.
            </span>
          </div>
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            fontFamily: "system-ui",
            fontSize: 20,
            letterSpacing: "0.16em",
            textTransform: "uppercase",
            color: "rgba(242,242,245,0.55)",
          }}
        >
          <span>20+ products · 50+ SMEs</span>
          <span>Accra · Global</span>
        </div>
      </div>
    ),
    size,
  );
}
