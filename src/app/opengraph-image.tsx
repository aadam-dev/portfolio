import { ImageResponse } from "next/og";

export const runtime = "edge";

export const alt = "Aadam · Product, data and engineering studio";
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
          backgroundColor: "#0B0A08",
          backgroundImage: "radial-gradient(ellipse 120% 80% at 50% -10%, rgba(255,91,31,0.32) 0%, rgba(11,10,8,1) 60%)",
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
          <div style={{ display: "flex" }}>I help businesses</div>
          <div style={{ display: "flex" }}>
            <span
              style={{
                color: "transparent",
                backgroundImage:
                  "linear-gradient(135deg, #FF8A5C 0%, #FF5B1F 100%)",
                backgroundClip: "text",
              }}
            >
              sell, count, decide.
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
          <span>Product, data and engineering studio</span>
          <span>Accra GMT+0 · Remote</span>
        </div>
      </div>
    ),
    size,
  );
}
