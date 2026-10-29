import { ImageResponse } from "next/og";

export const alt = "Ivan Mustière — Data Engineer, MLOps & Admin Systèmes";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const TAGS = ["Airflow", "Snowflake", "Spark", "Docker", "Kubernetes", "Grafana", "Linux"];

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "72px 80px",
          background: "#09090b",
          backgroundImage:
            "radial-gradient(circle at 85% 15%, rgba(59,130,246,0.28), transparent 45%), linear-gradient(rgba(63,63,70,0.35) 1px, transparent 1px), linear-gradient(90deg, rgba(63,63,70,0.35) 1px, transparent 1px)",
          backgroundSize: "100% 100%, 48px 48px, 48px 48px",
          color: "#f4f4f5",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 14, fontSize: 26, color: "#60a5fa" }}>
            <div style={{ width: 14, height: 14, borderRadius: 999, background: "#34d399" }} />
            ivan-mustiere.com
          </div>
          <div style={{ display: "flex", fontSize: 24, color: "#71717a", fontFamily: "monospace" }}>
            $ docker compose up -d
          </div>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
          <div style={{ fontSize: 88, fontWeight: 700, letterSpacing: -2 }}>Ivan Mustière</div>
          <div style={{ fontSize: 40, color: "#a1a1aa" }}>Data Engineer · MLOps · Admin Systèmes</div>
        </div>
        <div style={{ display: "flex", gap: 12 }}>
            {TAGS.map((tag) => (
              <div
                key={tag}
                style={{
                  display: "flex",
                  padding: "8px 18px",
                  borderRadius: 999,
                  border: "1px solid rgba(96,165,250,0.4)",
                  background: "rgba(23,37,84,0.6)",
                  color: "#93c5fd",
                  fontSize: 24,
                }}
              >
                {tag}
              </div>
            ))}
        </div>
      </div>
    ),
    size
  );
}
