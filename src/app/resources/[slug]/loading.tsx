export default function ResourceLoading() {
  return (
    <div
      style={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #f0f9ff 0%, #f5f3ff 50%, #fff7ed 100%)",
        display: "flex",
        flexDirection: "column",
        paddingTop: 100,
      }}
    >
      <div style={{ maxWidth: 880, margin: "0 auto", padding: "0 24px", width: "100%" }}>
        {/* breadcrumb skeleton */}
        <div
          style={{
            height: 14,
            width: 280,
            borderRadius: 7,
            background: "rgba(31,45,92,0.08)",
            marginBottom: 36,
          }}
        />

        {/* hero grid skeleton */}
        <div style={{ display: "grid", gridTemplateColumns: "65fr 35fr", gap: 52, marginBottom: 80 }}>
          <div
            style={{
              aspectRatio: "620 / 563",
              borderRadius: 10,
              background: "rgba(31,45,92,0.08)",
              animation: "pulse 1.5s ease-in-out infinite",
            }}
          />
          <div style={{ display: "flex", flexDirection: "column", gap: 16, paddingTop: 24 }}>
            <div style={{ height: 28, width: "80%", borderRadius: 6, background: "rgba(31,45,92,0.08)" }} />
            <div style={{ height: 52, width: "70%", borderRadius: 999, background: "rgba(31,45,92,0.08)" }} />
            <div style={{ height: 14, width: "90%", borderRadius: 6, background: "rgba(31,45,92,0.06)" }} />
          </div>
        </div>
      </div>

      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
      `}</style>
    </div>
  );
}
