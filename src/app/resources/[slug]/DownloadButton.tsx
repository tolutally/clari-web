"use client";

import { track } from "@vercel/analytics";

declare global {
  interface Window {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    gtag?: (...args: any[]) => void;
  }
}

interface DownloadButtonProps {
  href: string;
  filename: string;
  label?: string;
}

export default function DownloadButton({ href, filename, label = "Download the report" }: DownloadButtonProps) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      onClick={() => {
        track("report_download", { file_name: filename });
        window.gtag?.("event", "file_download", {
          file_name: filename,
          file_extension: "pdf",
        });
      }}
      style={{
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        gap: 9,
        fontFamily: "inherit",
        fontSize: "1rem",
        fontWeight: 600,
        lineHeight: 1,
        padding: "16px 30px",
        borderRadius: 999,
        border: "none",
        background: "#ff686c",
        color: "#fff",
        textDecoration: "none",
        minHeight: 44,
        cursor: "pointer",
        transition: "background 0.2s ease",
      }}
    >
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
        style={{ width: 18, height: 18 }}
      >
        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
        <polyline points="7 10 12 15 17 10" />
        <line x1="12" y1="15" x2="12" y2="3" />
      </svg>
      {label}
    </a>
  );
}
