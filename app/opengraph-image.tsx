import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "Abramovich Media — Authority Infrastructure Studio";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          background: "linear-gradient(135deg, #0a0e1a 0%, #111827 50%, #0a0e1a 100%)",
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          padding: "60px",
        }}
      >
        <div
          style={{
            fontSize: 28,
            fontWeight: 800,
            color: "#60a5fa",
            letterSpacing: "0.15em",
            textTransform: "uppercase",
            marginBottom: "24px",
          }}
        >
          Abramovich Media
        </div>
        <div
          style={{
            fontSize: 52,
            fontWeight: 700,
            color: "#ffffff",
            textAlign: "center",
            lineHeight: 1.2,
            maxWidth: "900px",
            marginBottom: "32px",
          }}
        >
          We Turn Obsessive Talent Into Undeniable Authority.
        </div>
        <div
          style={{
            fontSize: 22,
            color: "#9ca3af",
            textAlign: "center",
            maxWidth: "700px",
          }}
        >
          Cinematic Media · Digital Infrastructure · Scalable Authority Systems
        </div>
      </div>
    ),
    { ...size }
  );
}
