"use client";

import { useEffect } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";

export default function DownloadRedirect() {
  const searchParams = useSearchParams();
  const raw = searchParams.get("file");

  // Only allow files served from /report-files/ — prevents open redirect
  const safePath =
    raw && /^\/report-files\/[^/]+\.pdf$/.test(raw)
      ? raw
      : "/report-files/Clarivue-Research-Report.pdf";

  useEffect(() => {
    window.location.href = safePath;
  }, [safePath]);

  return (
    <div
      style={{
        minHeight: "60vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        textAlign: "center",
        padding: "4rem 1.5rem",
        fontFamily: "var(--font-jakarta, system-ui, sans-serif)",
        color: "#1F2D5C",
      }}
    >
      <h1 style={{ fontSize: "1.75rem", fontWeight: 700, marginBottom: "1rem" }}>
        Your download is starting…
      </h1>
      <p style={{ fontSize: "1rem", color: "#5B7393" }}>
        If it doesn&apos;t begin automatically,{" "}
        <Link href={safePath} style={{ color: "#ff686c", textDecoration: "underline" }}>
          click here
        </Link>
        .
      </p>
    </div>
  );
}
