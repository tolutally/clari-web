import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "The Hidden Cost · What's your placement workflow costing you?";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: 1200,
          height: 630,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "flex-start",
          background: "linear-gradient(135deg, #f8fafe 0%, #fff0f0 60%, #fff7ed 100%)",
          padding: "72px 80px",
          fontFamily: "system-ui, -apple-system, sans-serif",
          position: "relative",
        }}
      >
        {/* Grid background */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            backgroundImage:
              "linear-gradient(rgba(0,51,102,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(0,51,102,0.05) 1px, transparent 1px)",
            backgroundSize: "32px 32px",
          }}
        />

        {/* Badge */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 10,
            background: "white",
            border: "1px solid rgba(0,51,102,0.12)",
            borderRadius: 999,
            padding: "8px 20px",
            marginBottom: 36,
          }}
        >
          <div
            style={{
              width: 8,
              height: 8,
              borderRadius: "50%",
              background: "#ff5a5f",
            }}
          />
          <span
            style={{
              fontSize: 14,
              fontWeight: 600,
              letterSpacing: "0.12em",
              textTransform: "uppercase",
              color: "#042b53",
            }}
          >
            The Hidden Cost · Clarivue
          </span>
        </div>

        {/* Headline */}
        <div
          style={{
            fontSize: 58,
            fontWeight: 700,
            color: "#042b53",
            lineHeight: 1.08,
            letterSpacing: "-0.03em",
            maxWidth: 760,
            marginBottom: 28,
          }}
        >
          What&apos;s your placement workflow silently costing you?
        </div>

        {/* Subtext */}
        <div
          style={{
            fontSize: 22,
            color: "#64748b",
            maxWidth: 680,
            lineHeight: 1.5,
            marginBottom: 48,
          }}
        >
          Most programs have never seen the number. Answer 4 questions — get yours in 2 minutes.
        </div>

        {/* Metric cards row */}
        <div style={{ display: "flex", gap: 16 }}>
          {[
            { label: "Time Lost", value: "2,750 hrs", color: "#f1f5f9", border: "#cbd5e1" },
            { label: "Money Lost", value: "$123,750", color: "#fffbeb", border: "#fde68a" },
            { label: "People Lost", value: "52 learners", color: "#fff1f2", border: "#fecdd3" },
            { label: "Recoverable", value: "+34 placements", color: "#f0fdf4", border: "#bbf7d0" },
          ].map((card) => (
            <div
              key={card.label}
              style={{
                background: card.color,
                border: `1.5px solid ${card.border}`,
                borderRadius: 16,
                padding: "16px 22px",
                display: "flex",
                flexDirection: "column",
                gap: 6,
              }}
            >
              <span style={{ fontSize: 11, fontWeight: 600, letterSpacing: "0.12em", textTransform: "uppercase", color: "#64748b" }}>
                {card.label}
              </span>
              <span style={{ fontSize: 22, fontWeight: 700, color: "#042b53" }}>
                {card.value}
              </span>
            </div>
          ))}
        </div>

        {/* clarivue.io watermark */}
        <div
          style={{
            position: "absolute",
            bottom: 36,
            right: 56,
            fontSize: 15,
            fontWeight: 500,
            color: "rgba(4,43,83,0.35)",
            letterSpacing: "0.04em",
          }}
        >
          clarivue.io/hidden-cost
        </div>
      </div>
    ),
    { ...size }
  );
}
