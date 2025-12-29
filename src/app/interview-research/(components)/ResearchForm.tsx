"use client";

import { useEffect, useMemo, useState } from "react";

type CreatePayload = {
  companyName: string;
  roleTitle: string;
  interviewStage: string;
  jdText: string;
  interviewers: { name: string; linkedinUrl?: string }[];
};

type StatusPayload = {
  report: {
    id: string;
    status: string;
    gate_passed: boolean;
  };
  preview: any;
  full: any;
};

const STATUS_STEPS: { key: string; label: string; helper: string }[] = [
  { key: "QUEUED", label: "Queued", helper: "Waiting for a worker to pick this job." },
  { key: "COLLECTING", label: "Gathering signals", helper: "Pulling JD, interviewers, and background sources." },
  { key: "EXTRACTING", label: "Extracting facts", helper: "Pulling structured takeaways from the sources." },
  { key: "WRITING", label: "Summarizing", helper: "Drafting the report sections you’ll see below." },
  { key: "READY", label: "Ready", helper: "Preview is ready; unlock to see everything." },
];

export default function ResearchForm() {
  const [company, setCompany] = useState("");
  const [role, setRole] = useState("");
  const [stage, setStage] = useState("");
  const [jd, setJd] = useState("");
  const [interviewerName, setInterviewerName] = useState("");
  const [interviewerLinkedin, setInterviewerLinkedin] = useState("");
  const [submitState, setSubmitState] = useState<"idle" | "submitting" | "error">("idle");
  const [error, setError] = useState<string | null>(null);
  const [reportId, setReportId] = useState<string | null>(null);
  const [reportStatus, setReportStatus] = useState<string | null>(null);
  const [preview, setPreview] = useState<any>(null);
  const [full, setFull] = useState<any>(null);
  const [gateEmail, setGateEmail] = useState("");
  const [gateLink, setGateLink] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);

  const currentStepIndex = useMemo(() => {
    if (!reportStatus) return -1;
    const idx = STATUS_STEPS.findIndex((s) => s.key === reportStatus);
    return idx === -1 ? STATUS_STEPS.length - 1 : idx;
  }, [reportStatus]);

  const currentHelper = useMemo(() => {
    const match = STATUS_STEPS.find((s) => s.key === reportStatus);
    return match?.helper ?? "Starting up the research pipeline.";
  }, [reportStatus]);

  useEffect(() => {
    let timer: NodeJS.Timeout | null = null;
    async function poll() {
      if (!reportId) return;
      try {
        const res = await fetch(`/api/interview-research/status/${reportId}`);
        if (!res.ok) return;
        const data: StatusPayload = await res.json();
        setReportStatus(data.report.status);
        setPreview(data.preview ?? null);
        setFull(data.full ?? null);
        if (data.report.status !== "READY") {
          timer = setTimeout(poll, 2000);
        }
      } catch {
        // swallow for now
      }
    }
    if (reportId) {
      poll();
    }
    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [reportId]);

  return (
    <section className="rounded-2xl border border-[#003366]/10 bg-white/80 p-6 shadow-[0_12px_50px_-30px_rgba(0,0,0,0.35)] backdrop-blur space-y-4">
      <div className="space-y-1">
        <h2 className="text-lg font-semibold text-[#003366]">Run a new report</h2>
        <p className="text-sm text-[#003366]/70">Paste a company and role to start pre-interview research.</p>
      </div>

      <form
        className="grid grid-cols-1 md:grid-cols-2 gap-3"
        onSubmit={async (e) => {
          e.preventDefault();
          setSubmitState("submitting");
          setError(null);
          setReportId(null);
          setReportStatus(null);
          setPreview(null);
          setFull(null);
          setGateLink(null);
          setShowModal(true);

          const payload: CreatePayload = {
            companyName: company,
            roleTitle: role,
            interviewStage: stage || "Screen",
            jdText: jd,
            interviewers: interviewerName
              ? [{ name: interviewerName, linkedinUrl: interviewerLinkedin || undefined }]
              : [],
          };

          if (!payload.companyName || !payload.roleTitle || !payload.jdText) {
            setError("Company, role, and JD are required.");
            setSubmitState("error");
            return;
          }

          try {
            const res = await fetch("/api/interview-research/create", {
              method: "POST",
              headers: { "content-type": "application/json" },
              body: JSON.stringify(payload),
            });
            if (!res.ok) {
              const j = await res.json().catch(() => ({}));
              throw new Error(j.error || "Failed to create report");
            }
            const data = await res.json();
            setReportId(data.reportId);
            setReportStatus(data.status);
            setSubmitState("idle");
          } catch (err: any) {
            setError(err?.message || "Request failed");
            setSubmitState("error");
          }
        }}
      >
        <input
          className="rounded-xl border border-[#003366]/15 bg-white px-3 py-2 text-sm text-[#003366] focus:outline-none focus:ring-2 focus:ring-[#003366]/30"
          placeholder="Company"
          value={company}
          onChange={(e) => setCompany(e.target.value)}
        />
        <input
          className="rounded-xl border border-[#003366]/15 bg-white px-3 py-2 text-sm text-[#003366] focus:outline-none focus:ring-2 focus:ring-[#003366]/30"
          placeholder="Role / Title"
          value={role}
          onChange={(e) => setRole(e.target.value)}
        />
        <input
          className="rounded-xl border border-[#003366]/15 bg-white px-3 py-2 text-sm text-[#003366] focus:outline-none focus:ring-2 focus:ring-[#003366]/30"
          placeholder="Interview stage (e.g., Phone Screen, Final)"
          value={stage}
          onChange={(e) => setStage(e.target.value)}
        />
        <textarea
          className="rounded-xl border border-[#003366]/15 bg-white px-3 py-2 text-sm text-[#003366] focus:outline-none focus:ring-2 focus:ring-[#003366]/30 md:col-span-2 min-h-[120px]"
          placeholder="Paste the JD here"
          value={jd}
          onChange={(e) => setJd(e.target.value)}
        />
        <input
          className="rounded-xl border border-[#003366]/15 bg-white px-3 py-2 text-sm text-[#003366] focus:outline-none focus:ring-2 focus:ring-[#003366]/30"
          placeholder="Interviewer name (optional)"
          value={interviewerName}
          onChange={(e) => setInterviewerName(e.target.value)}
        />
        <input
          className="rounded-xl border border-[#003366]/15 bg-white px-3 py-2 text-sm text-[#003366] focus:outline-none focus:ring-2 focus:ring-[#003366]/30"
          placeholder="Interviewer LinkedIn (optional)"
          value={interviewerLinkedin}
          onChange={(e) => setInterviewerLinkedin(e.target.value)}
        />
        <button
          type="submit"
          className="md:col-span-2 inline-flex items-center justify-center rounded-xl bg-[#003366] px-4 py-3 text-sm font-semibold text-white shadow-[0_15px_40px_-22px_rgba(0,51,102,0.45)] transition hover:bg-[#00264f]"
          disabled={submitState === "submitting"}
        >
          {submitState === "submitting" ? "Starting..." : "Start research"}
        </button>
      </form>

      {error && <p className="text-sm text-red-600">{error}</p>}

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm p-4">
          <div className="w-full max-w-2xl rounded-2xl bg-white p-5 shadow-2xl border border-[#003366]/15 space-y-4 relative">
            <button
              onClick={() => setShowModal(false)}
              className="absolute top-3 right-3 text-sm text-[#003366]/60 hover:text-[#003366]"
            >
              Close
            </button>

            <div className="space-y-2">
              <p className="text-sm font-semibold text-[#003366]">Research progress</p>
              <div className="space-y-1 text-sm">
                {STATUS_STEPS.map((s, idx) => {
                  const active = reportStatus === s.key;
                  const done = idx < currentStepIndex;
                  return (
                    <div key={s.key} className="flex items-center gap-2">
                      <span
                        className={`h-2 w-2 rounded-full ${
                          active ? "bg-[#003366]" : done ? "bg-[#003366]/70" : "bg-[#003366]/20"
                        }`}
                      />
                      <span className={done || active ? "text-[#003366]" : "text-[#003366]/50"}>
                        {s.label}
                        {active && reportStatus !== "READY" && " (in progress...)"}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="rounded-xl border border-[#003366]/10 bg-white/75 p-4 space-y-2">
              <div className="flex items-center gap-2">
                {reportStatus !== "READY" && <span className="h-3 w-3 animate-pulse rounded-full bg-[#003366]" />}
                <p className="text-sm font-semibold text-[#003366]">
                  {reportStatus === "READY" ? "Research finished" : "Working on it..."}
                </p>
              </div>
              <p className="text-xs text-[#003366]/70">{currentHelper}</p>
            </div>

            {reportStatus === "READY" && preview && (
              <div className="rounded-xl border border-[#003366]/10 bg-white/75 p-4 space-y-2">
                <p className="text-sm font-semibold text-[#003366]">Preview teaser</p>
                <ul className="list-disc list-inside text-sm text-[#003366]/80 space-y-1">
                  {(preview.tldr ?? []).map((item: string, i: number) => (
                    <li key={i}>{item}</li>
                  ))}
                </ul>
              </div>
            )}

            {reportId && reportStatus === "READY" && !full && (
              <div className="space-y-2 rounded-xl border border-[#003366]/10 bg-white/75 p-4">
                <p className="text-sm font-semibold text-[#003366]">Unlock the full report</p>
                <form
                  className="flex flex-col sm:flex-row gap-2"
                  onSubmit={async (e) => {
                    e.preventDefault();
                    setError(null);
                    try {
                      const res = await fetch("/api/interview-research/gate", {
                        method: "POST",
                        headers: { "content-type": "application/json" },
                        body: JSON.stringify({ reportId, email: gateEmail }),
                      });
                      if (!res.ok) {
                        const j = await res.json().catch(() => ({}));
                        throw new Error(j.error || "Failed to gate");
                      }
                      const data = await res.json();
                      setGateLink(data.link);

                      // Hit the magic link to set gate_passed, then poll status a few times.
                      await fetch(data.link, { method: "GET", redirect: "follow" }).catch(() => {});

                      let unlocked = false;
                      for (let i = 0; i < 10; i++) {
                        const statusRes = await fetch(`/api/interview-research/status/${reportId}`, { cache: "no-store" });
                        if (statusRes.ok) {
                          const sData: StatusPayload = await statusRes.json();
                          setFull(sData.full ?? null);
                          if (sData.full) {
                            unlocked = true;
                            break;
                          }
                        }
                        await new Promise((r) => setTimeout(r, 800));
                      }

                      // Always open the full report page; if gate has propagated it will show full content.
                      window.open(`/interview-research/report/${reportId}`, "_blank", "noopener,noreferrer");
                      if (!unlocked) {
                        setError("Magic link sent — check the new tab. If you still see preview only, refresh once.");
                      }
                    } catch (err: any) {
                      setError(err?.message || "Failed to unlock report");
                    }
                  }}
                >
                  <input
                    className="flex-1 rounded-xl border border-[#003366]/15 bg-white px-3 py-2 text-sm text-[#003366] focus:outline-none focus:ring-2 focus:ring-[#003366]/30"
                    placeholder="Your email to access full report"
                    value={gateEmail}
                    onChange={(e) => setGateEmail(e.target.value)}
                    required
                  />
                  <button
                    type="submit"
                    className="inline-flex items-center justify-center rounded-xl bg-[#003366] px-4 py-2 text-sm font-semibold text-white shadow-[0_12px_30px_-18px_rgba(0,51,102,0.45)] transition hover:bg-[#00264f]"
                  >
                    Unlock
                  </button>
                </form>
                {gateLink && (
                  <p className="text-xs text-[#003366]/60 break-all">Magic link issued: {gateLink}</p>
                )}
              </div>
            )}

            {full && (
              <div className="rounded-xl border border-[#003366]/10 bg-white/80 p-4">
                <p className="text-sm font-semibold text-[#003366] mb-2">Full report ready</p>
                <p className="text-xs text-[#003366]/70">We opened the full report in a new tab.</p>
              </div>
            )}
          </div>
        </div>
      )}
    </section>
  );
}
