import { ImageResponse } from "next/og";

export const runtime = "nodejs";
export const alt = "Enamul Bokshi — Senior Full Stack Engineer & System Architect";
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = "image/png";

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
          justifyContent: "space-between",
          backgroundColor: "#020617",
          backgroundImage:
            "radial-gradient(circle at 25px 25px, #1e1b4b 2%, transparent 0%), radial-gradient(circle at 75px 75px, #0f172a 2%, transparent 0%)",
          backgroundSize: "100px 100px",
          padding: "64px 80px",
          fontFamily: "sans-serif",
          color: "#f8fafc",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Ambient Glows */}
        <div
          style={{
            position: "absolute",
            top: "-150px",
            right: "-100px",
            width: "500px",
            height: "500px",
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(124, 58, 237, 0.35) 0%, rgba(0, 0, 0, 0) 70%)",
            filter: "blur(40px)",
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: "-150px",
            left: "100px",
            width: "500px",
            height: "500px",
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(34, 211, 238, 0.25) 0%, rgba(0, 0, 0, 0) 70%)",
            filter: "blur(40px)",
          }}
        />

        {/* Top Header Badge */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "12px",
            padding: "10px 22px",
            backgroundColor: "rgba(124, 58, 237, 0.15)",
            border: "1px solid rgba(167, 139, 250, 0.3)",
            borderRadius: "9999px",
            color: "#c084fc",
            fontSize: "20px",
            fontWeight: 600,
            letterSpacing: "0.05em",
          }}
        >
          <span>⚡ FULL STACK ARCHITECTURE & SCALABLE SYSTEMS</span>
        </div>

        {/* Main Center Content */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "16px",
            maxWidth: "960px",
            zIndex: 10,
          }}
        >
          <div
            style={{
              fontSize: "64px",
              fontWeight: 800,
              lineHeight: 1.1,
              letterSpacing: "-0.03em",
              color: "#ffffff",
              display: "flex",
              flexWrap: "wrap",
            }}
          >
            Enamul Bokshi
          </div>

          <div
            style={{
              fontSize: "30px",
              fontWeight: 500,
              color: "#94a3b8",
              lineHeight: 1.35,
            }}
          >
            Crafting high-performance web systems, Next.js architectures, distributed backends, and sleek interfaces.
          </div>
        </div>

        {/* Bottom Tags / Footer */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            width: "100%",
            borderTop: "1px solid rgba(255, 255, 255, 0.1)",
            paddingTop: "28px",
            zIndex: 10,
          }}
        >
          <div style={{ display: "flex", gap: "16px" }}>
            {["Next.js 16", "React 19", "TypeScript", "PostgreSQL", "Docker"].map((tag) => (
              <div
                key={tag}
                style={{
                  padding: "8px 16px",
                  borderRadius: "8px",
                  backgroundColor: "rgba(255, 255, 255, 0.05)",
                  border: "1px solid rgba(255, 255, 255, 0.1)",
                  fontSize: "18px",
                  color: "#cbd5e1",
                  fontWeight: 500,
                }}
              >
                {tag}
              </div>
            ))}
          </div>

          <div
            style={{
              fontSize: "20px",
              color: "#38bdf8",
              fontWeight: 600,
              letterSpacing: "0.02em",
            }}
          >
            enamulbokshi.com
          </div>
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
