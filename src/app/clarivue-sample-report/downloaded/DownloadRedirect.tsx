"use client";

import { useEffect } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";

const DEFAULT_FILE = "/report-files/Clarivue-Report-Pack.zip";

export default function DownloadRedirect() {
  const searchParams = useSearchParams();
  const raw = searchParams.get("file");

  // Only allow files served from /report-files/ — prevents open redirect
  const safePath =
    raw && /^\/report-files\/[^/]+\.(pdf|zip)$/.test(raw) ? raw : DEFAULT_FILE;

  useEffect(() => {
    // Fire a conversion event for the report-pack download (MailerLite → here).
    const w = window as unknown as {
      gtag?: (command: string, event: string, params?: Record<string, unknown>) => void;
    };
    w.gtag?.("event", "sample_report_pack_download", {
      event_category: "engagement",
      event_label: safePath,
    });

    // Kick off the download.
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
        color: "#102C64",
      }}
    >
      <div
        style={{
          fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace",
          fontSize: "0.7rem",
          letterSpacing: "0.16em",
          textTransform: "uppercase",
          color: "#E24E53",
          marginBottom: "0.75rem",
        }}
      >
        The report pack
      </div>
      <h1 style={{ fontSize: "1.75rem", fontWeight: 700, marginBottom: "1rem" }}>
        Your report pack is on the way…
      </h1>
      <p style={{ fontSize: "1rem", color: "#5B7393", maxWidth: "42ch" }}>
        The download should start automatically. If it doesn&apos;t,{" "}
        <Link href={safePath} style={{ color: "#ff686c", textDecoration: "underline" }}>
          click here
        </Link>
        .
      </p>
      <Link
        href="/clarivue-sample-report"
        style={{
          marginTop: "2rem",
          fontSize: "0.85rem",
          color: "#5B7393",
          textDecoration: "underline",
        }}
      >
        Back to the sample report
      </Link>
    </div>
  );
}
