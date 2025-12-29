import { ReportFullJson } from "@/lib/interview-research/types";

type StatusResponse = {
  report: {
    id: string;
    status: string;
    error_text: string | null;
    company_name: string;
    role_title: string;
    interview_stage: string;
    created_at: string;
    ready_at: string | null;
    gate_passed: boolean;
  };
  preview: any;
  full: ReportFullJson | null;
};

function SectionCard({ title, bullets }: { title: string; bullets: string[] }) {
  const glows = [
    "from-[#b8ccf4]/40 via-white/30 to-[#ff686c]/30",
    "from-[#ffd5a1]/40 via-white/30 to-[#003366]/20",
    "from-[#c0f5e4]/40 via-white/30 to-[#4fb0c6]/25",
    "from-[#e9d5ff]/40 via-white/30 to-[#003366]/20",
  ];
  const glow = glows[Math.floor(Math.random() * glows.length)];
  return (
    <div className="relative rounded-2xl border border-white/40 ring-1 ring-[#003366]/10 bg-white/65 p-5 shadow-[0_20px_60px_-35px_rgba(0,0,0,0.45)] backdrop-blur-xl overflow-hidden">
      <div className={`absolute inset-0 bg-gradient-to-br ${glow} opacity-70`} />
      <div className="absolute -inset-px rounded-2xl bg-white/40" />
      <div className="relative">
        <h3 className="text-lg font-semibold text-[#003366] mb-3">{title}</h3>
        <ul className="list-disc list-inside space-y-2 text-sm text-[#003366]/80">
        {bullets.length ? bullets.map((b, i) => <li key={i}>{b}</li>) : <li className="text-[#003366]/50">Coming soon</li>}
      </ul>
      </div>
    </div>
  );
}

export default async function ReportPage({ params }: { params: Promise<{ reportId: string }> }) {
  const { reportId } = await params;
  const baseUrl = process.env.APP_BASE_URL || "http://localhost:3000";
  const res = await fetch(`${baseUrl}/api/interview-research/status/${reportId}`, { cache: "no-store" });

  if (!res.ok) {
    return (
      <main className="max-w-5xl mx-auto px-6 py-12 space-y-4">
        <h1 className="text-2xl font-semibold text-[#003366]">Report not found</h1>
        <p className="text-sm text-[#003366]/70">We couldn&apos;t load this report. It may not be ready or may not exist.</p>
      </main>
    );
  }

  const data = (await res.json()) as StatusResponse;
  const { report, full, preview } = data;
  const ready = report.status === "READY" && !!full;

  return (
    <main className="max-w-5xl mx-auto px-6 py-12 space-y-10">
      <header className="space-y-2">
        <p className="inline-flex items-center gap-2 rounded-full border border-[#003366]/10 bg-white/80 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-[#003366]/70">
          <span className={`h-1.5 w-1.5 rounded-full ${ready ? "bg-emerald-500" : "bg-amber-400"}`} />
          Report #{reportId}
        </p>
        <h1 className="text-3xl font-semibold tracking-tight text-[#003366]">Interview research report</h1>
        <p className="text-sm text-[#003366]/70">
          {report.company_name} · {report.role_title} · Stage: {report.interview_stage}
        </p>
        <div className="flex flex-wrap gap-3 text-xs text-[#003366]/70">
          <span className="inline-flex items-center gap-2 rounded-full border border-[#003366]/10 bg-white/70 px-3 py-1">
            Status: <span className="font-semibold text-[#003366]">{report.status}</span>
          </span>
          {report.ready_at && (
            <span className="inline-flex items-center gap-2 rounded-full border border-[#003366]/10 bg-white/70 px-3 py-1">
              Ready at: <span className="font-mono text-[#003366]">{new Date(report.ready_at).toLocaleString()}</span>
            </span>
          )}
        </div>
      </header>

      {!ready && (
        <div className="rounded-2xl border border-[#003366]/10 bg-white/80 p-5 shadow-[0_10px_40px_-28px_rgba(0,0,0,0.3)] backdrop-blur space-y-2">
          <p className="text-sm font-semibold text-[#003366]">Report not unlocked</p>
          <p className="text-sm text-[#003366]/70">
            This report is not yet ready or not unlocked. Complete the email step in the research flow to view the full report.
          </p>
          {preview && (
            <div className="mt-2">
              <p className="text-xs font-semibold text-[#003366]">Preview teaser</p>
              <ul className="list-disc list-inside text-xs text-[#003366]/70 space-y-1">
                {(preview.tldr ?? []).map((item: string, i: number) => (
                  <li key={i}>{item}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}

      {ready && full && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <SectionCard title="Company research" bullets={full.companyResearch?.bullets ?? []} />
          <SectionCard title="What matters now" bullets={full.whatMattersNow?.bullets ?? []} />
          <SectionCard title="Interviewer" bullets={full.interviewer?.bullets ?? []} />
          <SectionCard title="Questions you might face" bullets={full.questionsYouMightFace?.bullets ?? []} />
          <SectionCard title="Questions to ask interviewer" bullets={full.questionsToAskInterviewer?.bullets ?? []} />
          <SectionCard title="Sources & timestamps" bullets={(full.sourcesAndTimestamps?.bullets ?? []).concat(full.sourcesAndTimestamps?.generatedAt ? [`Generated at: ${full.sourcesAndTimestamps.generatedAt}`] : [])} />
        </div>
      )}
    </main>
  );
}
