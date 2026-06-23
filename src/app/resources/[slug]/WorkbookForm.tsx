"use client";

import { useState } from "react";

declare global {
  interface Window {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    gtag?: (...args: any[]) => void;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    fbq?: (...args: any[]) => void;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    lintrk?: (...args: any[]) => void;
  }
}

export default function WorkbookForm() {
  const [email, setEmail] = useState("");
  const [hp, setHp] = useState("");
  const [state, setState] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
      setErrorMsg("Please enter a valid email address.");
      return;
    }

    setState("loading");
    setErrorMsg("");

    try {
      const res = await fetch("/api/resources/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, _hp: hp }),
      });
      const data = await res.json();

      if (!res.ok) {
        setState("error");
        setErrorMsg(data.error || "Something went wrong. Please try again.");
        return;
      }

      setState("success");

      // Fire tracking events
      window.gtag?.("event", "generate_lead", { event_category: "workbook", value: email });
      window.fbq?.("track", "Lead");
      window.lintrk?.("track", { conversion_id: process.env.NEXT_PUBLIC_LINKEDIN_PARTNER_ID });

      // Trigger download
      if (data.workbookUrl) {
        const a = document.createElement("a");
        a.href = data.workbookUrl;
        a.download = "Clarivue-Companion-Workbook.pdf";
        document.body.appendChild(a);
        a.click();
        a.remove();
      }
    } catch {
      setState("error");
      setErrorMsg("Something went wrong. Please try again.");
    }
  }

  if (state === "success") {
    return (
      <p style={{ fontSize: 14, color: "#1F2D5C", marginTop: 0 }}>
        Thanks — your workbook is downloading now.{" "}
        <a
          href="/reports/clarivue-workbook.pdf"
          download
          style={{ color: "#e85558", fontWeight: 600 }}
        >
          Tap here if it doesn&apos;t start.
        </a>
      </p>
    );
  }

  return (
    <form onSubmit={handleSubmit} noValidate>
      {/* Honeypot — hidden from real users */}
      <input
        type="text"
        name="_hp"
        value={hp}
        onChange={(e) => setHp(e.target.value)}
        tabIndex={-1}
        autoComplete="off"
        style={{ display: "none" }}
        aria-hidden="true"
      />

      <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
        <input
          type="email"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
            if (errorMsg) setErrorMsg("");
          }}
          placeholder="you@institution.edu"
          aria-label="Email address"
          required
          style={{
            flex: "1 1 260px",
            minWidth: 0,
            fontFamily: "inherit",
            fontSize: "1rem",
            color: "#1F2D5C",
            background: "rgba(255,255,255,0.7)",
            border: `1px solid ${errorMsg ? "#e85558" : "rgba(31,45,92,0.22)"}`,
            borderRadius: 999,
            padding: "15px 22px",
            minHeight: 44,
            outline: "none",
          }}
        />
        <button
          type="submit"
          disabled={state === "loading"}
          style={{
            flex: "0 0 auto",
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            fontFamily: "inherit",
            fontSize: "1rem",
            fontWeight: 600,
            lineHeight: 1,
            padding: "16px 30px",
            borderRadius: 999,
            border: "none",
            background: state === "loading" ? "#e85558" : "#ff686c",
            color: "#fff",
            cursor: state === "loading" ? "not-allowed" : "pointer",
            minHeight: 44,
            transition: "background 0.2s ease",
          }}
        >
          {state === "loading" ? "Sending…" : "Send me the workbook"}
        </button>
      </div>

      {errorMsg && (
        <p style={{ fontSize: 14, color: "#e85558", marginTop: 10, marginBottom: 0 }}>
          {errorMsg}
        </p>
      )}
    </form>
  );
}
