"use client";

import { useEffect, useState } from "react";

export default function WorkbookModalButton({ workbookUrl }: { workbookUrl: string }) {
  const [open, setOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [honeypot, setHoneypot] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  // Lock body scroll, hide footer, ESC key when modal is open
  useEffect(() => {
    if (!open) return;
    document.body.style.overflow = "hidden";
    const footer = document.querySelector("footer") as HTMLElement | null;
    if (footer) footer.style.display = "none";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") handleClose();
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      if (footer) footer.style.display = "";
      window.removeEventListener("keydown", onKey);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  const handleClose = () => {
    setOpen(false);
    setTimeout(() => {
      setSuccess(false);
      setError("");
      setEmail("");
      setHoneypot("");
    }, 300);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      const res = await fetch("/api/resources/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, _hp: honeypot }),
      });
      const data = await res.json();
      if (res.ok && data.ok) {
        setSuccess(true);
        setTimeout(() => window.open(workbookUrl, "_blank"), 800);
      } else {
        setError(data.error || "Something went wrong. Please try again.");
      }
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      {/* Trigger button */}
      <button
        type="button"
        onClick={() => setOpen(true)}
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
          cursor: "pointer",
          minHeight: 44,
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
        Get the workbook
      </button>

      {/* Modal */}
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Workbook sign-up"
        aria-hidden={!open}
        onClick={(e) => { if (e.target === e.currentTarget) handleClose(); }}
        style={{
          display: open ? "flex" : "none",
          position: "fixed",
          inset: 0,
          background: "rgba(0,0,0,0.6)",
          zIndex: 9999,
          alignItems: "center",
          justifyContent: "center",
          padding: 16,
        }}
      >
        <div
          style={{
            position: "relative",
            maxWidth: 440,
            width: "100%",
            borderRadius: 16,
            overflow: "hidden",
            boxShadow: "0 24px 60px rgba(0,0,0,0.3)",
            background: "#cbc0f3",
          }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Close button */}
          <button
            type="button"
            onClick={handleClose}
            aria-label="Close"
            style={{
              position: "absolute",
              top: 10,
              right: 10,
              zIndex: 10,
              background: "rgba(255,255,255,0.88)",
              border: "none",
              borderRadius: "50%",
              width: 30,
              height: 30,
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#1F2D5C",
              fontSize: 18,
              fontWeight: 700,
              lineHeight: 1,
            }}
          >
            &times;
          </button>

          {/* Header image */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="https://storage.mlcdn.com/account_image/2466380/kdEfUiaICQZtQwg3Ub2AfOtcOflI6Y9ZtQZNbc5M.jpg"
            alt=""
            style={{ display: "block", width: "100%", height: "auto" }}
          />

          {/* Body */}
          <div style={{ padding: "20px 20px 24px" }}>
            {success ? (
              <div style={{ textAlign: "center", padding: "16px 0" }}>
                <p style={{ fontFamily: "'Lucida Sans Unicode','Lucida Grande',sans-serif", fontSize: 28, fontWeight: 400, color: "#003366", margin: "0 0 10px" }}>
                  Thank you!
                </p>
                <p style={{ fontFamily: "'Open Sans',Arial,sans-serif", fontSize: 14, color: "#003366", lineHeight: 1.5, margin: 0 }}>
                  Your workbook is opening now — check your inbox too.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit}>
                <h4 style={{ fontFamily: "'Lucida Sans Unicode','Lucida Grande',sans-serif", fontSize: 30, fontWeight: 400, color: "#003366", margin: "0 0 10px" }}>
                  Send me the workbook
                </h4>
                <p style={{ fontFamily: "'Open Sans',Arial,sans-serif", fontSize: 14, color: "#003366", lineHeight: 1.43, margin: "0 0 20px" }}>
                  The question bank, scorecard, and full quote dataset, straight to your inbox.
                </p>
                {/* Honeypot — hidden from humans, filled by bots */}
                <input
                  type="text"
                  name="website"
                  value={honeypot}
                  onChange={(e) => setHoneypot(e.target.value)}
                  tabIndex={-1}
                  autoComplete="off"
                  aria-hidden="true"
                  style={{ position: "absolute", left: "-9999px", width: 1, height: 1, overflow: "hidden" }}
                />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="Your work email"
                  autoComplete="email"
                  style={{
                    width: "100%",
                    boxSizing: "border-box",
                    background: "#fff",
                    color: "#333",
                    border: error ? "1px solid #f00" : "1px solid #ccc",
                    borderRadius: 2,
                    fontSize: 12,
                    lineHeight: "21px",
                    padding: 10,
                    marginBottom: 10,
                    fontFamily: "'Lucida Sans Unicode','Lucida Grande',sans-serif",
                    outline: "none",
                  }}
                />
                {error && (
                  <p style={{ color: "#f00", fontSize: 12, margin: "0 0 10px", fontFamily: "'Open Sans',Arial,sans-serif" }}>
                    {error}
                  </p>
                )}
                <button
                  type="submit"
                  disabled={submitting}
                  style={{
                    width: "100%",
                    background: "#003366",
                    color: "#fff",
                    border: "none",
                    borderRadius: 4,
                    fontSize: 14,
                    fontWeight: 700,
                    fontFamily: "'Open Sans',Arial,sans-serif",
                    lineHeight: "21px",
                    padding: 10,
                    cursor: submitting ? "not-allowed" : "pointer",
                    opacity: submitting ? 0.7 : 1,
                    marginBottom: 4,
                    transition: "background 0.2s, opacity 0.2s",
                  }}
                >
                  {submitting ? "Sending…" : "Send me the workbook"}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
