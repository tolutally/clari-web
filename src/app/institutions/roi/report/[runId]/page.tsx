import React from "react";

export const dynamic = "force-dynamic";

// Types matching backend response
interface ScenarioBreakdown {
  totalValueImpact: number;
  revenueImpact: number;
  costSavings: number;
  advisorHoursSaved: number;
  addedSessionsCost: number;
  addedReadyLearners: number;
  addedOffers: number;
  newTimeToOfferWeeks: number | null;
}

interface RoiResult {
  summary: ScenarioBreakdown;
  enrollment?: {
    atRisk: number;
    uplift: number;
  };
  baseline: {
    readyLearners: number;
    offers: number;
    sessions: number;
  };
  timeline: {
    baselineTimeToOfferWeeks: number | null;
    newTimeToOfferWeeks: number | null;
  };
  sensitivity: {
    low: ScenarioBreakdown;
    expected: ScenarioBreakdown;
    high: ScenarioBreakdown;
  };
  assumptions: any;
}

interface RoiRunRow {
  id: string;
  request: any;
  result: RoiResult;
  narrative?: string;
  gate_passed: boolean;
  created_at?: string;
  updated_at?: string;
}

const fmtCurrency = (v: number) => `$${Number(v ?? 0).toLocaleString()}`;
const fmtNumber = (v: number) => Number(v ?? 0).toLocaleString();
const fmtPct = (v: number) => `${Number(v ?? 0).toFixed(0)}%`;
const fmtDateTime = (iso?: string) => (iso ? new Date(iso).toLocaleString() : "—");

async function fetchReport(runId: string) {
  const baseUrl = process.env.APP_BASE_URL 
    || (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "http://localhost:3000");
  const res = await fetch(`${baseUrl}/api/institutions/roi/report/${runId}`, { cache: "no-store" });
  if (!res.ok) return null;
  return res.json();
}

function Pill({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center gap-2 rounded-full border border-white/30 bg-white/60 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-[#003366]/80 backdrop-blur shadow-sm">
      {children}
    </span>
  );
}

function SectionHeader({ number, title }: { number: string; title: string }) {
  return (
    <div className="flex items-baseline gap-3 mb-4">
      <span className="text-sm font-mono text-[#003366]/40">{number}</span>
      <h2 className="text-lg font-semibold text-[#003366]">{title}</h2>
    </div>
  );
}

function BulletList({ items }: { items: string[] }) {
  return (
    <ul className="space-y-2">
      {items.map((item, i) => (
        <li key={i} className="flex items-start gap-2 text-sm text-[#003366]/80">
          <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-[#003366]/30 shrink-0" />
          <span>{item}</span>
        </li>
      ))}
    </ul>
  );
}

function ValueRow({ label, value, muted }: { label: string; value: string; muted?: boolean }) {
  return (
    <div className={`flex items-center justify-between py-2 border-b border-[#003366]/5 last:border-0 ${muted ? "text-[#003366]/50" : "text-[#003366]/80"}`}>
      <span className="text-sm">{label}</span>
      <span className={`text-sm font-semibold ${muted ? "text-[#003366]/50" : "text-[#003366]"}`}>{value}</span>
    </div>
  );
}

function DeltaRow({ label, before, after }: { label: string; before: string; after: string }) {
  return (
    <div className="flex items-center justify-between py-2 border-b border-[#003366]/5 last:border-0 text-sm text-[#003366]/80">
      <span>{label}</span>
      <span className="font-mono">
        <span className="text-[#003366]/50">{before}</span>
        <span className="mx-2 text-[#003366]/30">→</span>
        <span className="font-semibold text-[#003366]">{after}</span>
      </span>
    </div>
  );
}

function CollapsibleSection({ title, children, defaultOpen = false }: { title: string; children: React.ReactNode; defaultOpen?: boolean }) {
  return (
    <details className="group" open={defaultOpen}>
      <summary className="flex items-center justify-between cursor-pointer py-3 border-b border-[#003366]/10 text-sm font-semibold text-[#003366]/70 hover:text-[#003366]">
        <span>{title}</span>
        <svg className="h-4 w-4 transition-transform group-open:rotate-180" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </summary>
      <div className="pt-3 pb-1">
        {children}
      </div>
    </details>
  );
}

export default async function RoiReportPage({
  params,
}: {
  params: Promise<{ runId: string }>;
}) {
  const { runId } = await params;
  const data = await fetchReport(runId);

  if (!data || data.error) {
    return (
      <main className="min-h-screen bg-gradient-to-b from-[#f5f8ff] via-white to-[#f5f8ff]">
        <div className="max-w-3xl mx-auto px-6 py-16 space-y-4">
          <h1 className="text-2xl font-semibold text-[#003366]">Report not found</h1>
          <p className="text-sm text-[#003366]/70">This report may not exist or may not be ready.</p>
        </div>
      </main>
    );
  }

  if (!data.gatePassed) {
    return (
      <main className="min-h-screen bg-gradient-to-b from-[#f5f8ff] via-white to-[#f5f8ff]">
        <div className="max-w-3xl mx-auto px-6 py-16 space-y-6">
          <Pill>Preview</Pill>
          <h1 className="text-2xl font-semibold text-[#003366]">Unlock the full report</h1>
          <p className="text-sm text-[#003366]/70">Submit your email in the calculator to view the complete analysis.</p>
        </div>
      </main>
    );
  }

  // Extract data
  const run: RoiRunRow = data.run;
  const { result, request } = run;
  const { summary, baseline, sensitivity, timeline } = result;
  const assumptions = result.assumptions ?? {};
  const context = request?.context ?? {};

  // Computed values
  const cohortSize = Number(context.cohortSize ?? 0);
  const baselineMockInterviews = Number(assumptions.baseline?.mockInterviewsPerLearner ?? 0);
  const mockUpliftPct = Number(assumptions.uplift?.mockInterviewUpliftPct ?? 0);
  const baseSessions = cohortSize * baselineMockInterviews;
  const afterSessions = Math.round(baseSessions * (1 + mockUpliftPct / 100));

  const readyDelta = summary.addedReadyLearners;
  const offersDelta = summary.addedOffers;
  const enrollmentAtRisk = Number(result.enrollment?.atRisk ?? 0);
  const enrollmentUplift = Number(result.enrollment?.uplift ?? 0);

  const readyGap = Math.max(0, cohortSize - Number(baseline.readyLearners ?? 0));
  const offerGap = Math.max(0, cohortSize - Number(baseline.offers ?? 0));
  const baselineAdvisorHours = Number(baseline.offers ?? 0) * 0.75;
  const readinessRate = Number(assumptions.baseline?.readinessRatePct ?? 0);
  const offerRate = Number(assumptions.baseline?.offerRatePct ?? 0);
  const advisorTimeSavingsPct = Number(assumptions.uplift?.advisorTimeSavingsPct ?? 0);

  // Cap advisor hours saved conservatively
  const advisorHoursSavedCapped = Math.min(summary.advisorHoursSaved, baselineAdvisorHours * 0.35);

  // Section 1: Current State Risk Snapshot
  const currentStateRisks = [
    `${fmtNumber(offerGap)} of ${fmtNumber(cohortSize)} learners do not convert to offers.`,
    `${fmtNumber(readyGap)} learners are not interview-ready before employer contact.`,
    `Advisor capacity supports ~${fmtNumber(baselineAdvisorHours)} hours of coaching per cohort.`,
    `Time to offer averages ${timeline.baselineTimeToOfferWeeks ?? "—"} weeks.`,
    enrollmentAtRisk > 0 ? `${fmtCurrency(enrollmentAtRisk)} in enrollment credibility is at risk from weak placement signals.` : null,
  ].filter(Boolean) as string[];

  // Section 2: The Gap Clarivue Is Designed to Close
  const gapBullets = [
    `Readiness gap: ${fmtNumber(readyGap)} learners not prepared (${fmtPct(100 - readinessRate)} of cohort).`,
    `Offer gap: ${fmtNumber(offerGap)} learners not placed (${fmtPct(100 - offerRate)} of cohort).`,
    `Practice throughput: ${fmtNumber(baseSessions)} mock interviews per cohort.`,
    `Time to offer: ${timeline.baselineTimeToOfferWeeks ?? "—"} weeks average.`,
    advisorTimeSavingsPct > 0 ? `Advisor time: ${fmtPct(advisorTimeSavingsPct)} of load is repetitive coaching.` : null,
    enrollmentAtRisk > 0 ? `Credibility risk: ${fmtCurrency(enrollmentAtRisk)} linked to weak placement evidence.` : null,
  ].filter(Boolean) as string[];

  // Section 3: Projected State With Clarivue
  const projectedDeltas = [
    { label: "Ready learners", before: fmtNumber(baseline.readyLearners), after: fmtNumber(baseline.readyLearners + readyDelta) },
    { label: "Offers", before: fmtNumber(baseline.offers), after: fmtNumber(baseline.offers + offersDelta) },
    { label: "Practice throughput", before: fmtNumber(baseSessions), after: fmtNumber(afterSessions) },
    { label: "Time to offer", before: `${timeline.baselineTimeToOfferWeeks ?? "—"} wks`, after: `${timeline.newTimeToOfferWeeks ?? "—"} wks` },
    { label: "Advisor hours returned", before: "0", after: fmtNumber(Math.round(advisorHoursSavedCapped)) },
  ];

  // Section 4: Value Impact
  const hardValueTotal = summary.revenueImpact + summary.costSavings - summary.addedSessionsCost;

  // Section 5: Sensitivity
  const sensitivityData = [
    { scenario: "Conservative", value: fmtCurrency(sensitivity.low.totalValueImpact), offers: fmtNumber(sensitivity.low.addedOffers), hours: fmtNumber(sensitivity.low.advisorHoursSaved) },
    { scenario: "Expected", value: fmtCurrency(sensitivity.expected.totalValueImpact), offers: fmtNumber(sensitivity.expected.addedOffers), hours: fmtNumber(sensitivity.expected.advisorHoursSaved) },
    { scenario: "Upside", value: fmtCurrency(sensitivity.high.totalValueImpact), offers: fmtNumber(sensitivity.high.addedOffers), hours: fmtNumber(sensitivity.high.advisorHoursSaved) },
  ];

  // Section 7: If Nothing Changes
  const ifNothingChanges = [
    `${fmtNumber(readyGap)} learners remain unprepared per cohort.`,
    `${fmtNumber(offerGap)} potential offers continue to be missed.`,
    "Advisor time remains consumed by repetitive coaching.",
    "Employer confidence in placement quality remains unverified.",
  ];

  return (
    <main className="min-h-screen bg-gradient-to-b from-[#f5f8ff] via-white to-[#f5f8ff]">
      <div className="max-w-3xl mx-auto px-6 py-12 space-y-10">
        
        {/* Header */}
        <header className="space-y-3 pb-6 border-b border-[#003366]/10">
          <div className="flex flex-wrap items-center gap-2">
            <Pill>ROI Analysis</Pill>
            <Pill>{context.programType ?? "Institution"}</Pill>
          </div>
          <h1 className="text-2xl font-semibold text-[#003366]">Placement Gap Analysis</h1>
          <p className="text-sm text-[#003366]/60">
            Cohort: {fmtNumber(cohortSize)} learners | Generated: {fmtDateTime(run.created_at)}
          </p>
        </header>

        {/* Section 1: Current State Risk Snapshot */}
        <section>
          <SectionHeader number="01" title="Current State Risk Snapshot" />
          <div className="rounded-xl border border-[#003366]/10 bg-white/60 p-5">
            <BulletList items={currentStateRisks} />
          </div>
        </section>

        {/* Section 2: The Gap Clarivue Is Designed to Close */}
        <section>
          <SectionHeader number="02" title="The Gap Clarivue Is Designed to Close" />
          <div className="rounded-xl border border-[#003366]/10 bg-white/60 p-5">
            <BulletList items={gapBullets} />
          </div>
        </section>

        {/* Section 3: Projected State With Clarivue */}
        <section>
          <SectionHeader number="03" title="Projected State With Clarivue" />
          <div className="rounded-xl border border-[#003366]/10 bg-white/60 p-5">
            {projectedDeltas.map((d, i) => (
              <DeltaRow key={i} label={d.label} before={d.before} after={d.after} />
            ))}
          </div>
        </section>

        {/* Section 4: Value Impact */}
        <section>
          <SectionHeader number="04" title="Value Impact" />
          <div className="space-y-4">
            {/* Hard Value */}
            <div className="rounded-xl border border-[#003366]/10 bg-white/60 p-5">
              <p className="text-xs font-semibold uppercase tracking-wider text-[#003366]/50 mb-3">Hard Value (included in ROI)</p>
              <ValueRow label="Placement-linked revenue" value={fmtCurrency(summary.revenueImpact)} />
              <ValueRow label="Net delivery impact" value={fmtCurrency(summary.costSavings - summary.addedSessionsCost)} />
              <ValueRow label="Advisor hours returned" value={`${fmtNumber(Math.round(advisorHoursSavedCapped))} hrs`} />
              <div className="mt-4 pt-3 border-t border-[#003366]/10">
                <ValueRow label="Total hard value" value={fmtCurrency(hardValueTotal)} />
              </div>
            </div>

            {/* Strategic Upside */}
            <div className="rounded-xl border border-dashed border-[#003366]/10 bg-white/30 p-5">
              <p className="text-xs font-semibold uppercase tracking-wider text-[#003366]/40 mb-3">Strategic Upside (not included in ROI)</p>
              <ValueRow label="Employer signal quality" value="Improved" muted />
              <ValueRow label="Cohort credibility" value={enrollmentUplift > 0 ? fmtCurrency(enrollmentUplift) : "Improved"} muted />
              <ValueRow label="Operational resilience" value="Increased" muted />
            </div>
          </div>
        </section>

        {/* Section 5: Sensitivity Snapshot */}
        <section>
          <SectionHeader number="05" title="Sensitivity Snapshot" />
          <div className="rounded-xl border border-[#003366]/10 bg-white/60 p-5">
            <div className="grid grid-cols-3 gap-4">
              {sensitivityData.map((s, i) => (
                <div key={i} className="text-center">
                  <p className="text-xs text-[#003366]/50 mb-1">{s.scenario}</p>
                  <p className="text-lg font-semibold text-[#003366]">{s.value}</p>
                  <p className="text-xs text-[#003366]/50 mt-1">{s.offers} offers | {s.hours} hrs</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Section 6: Assumptions */}
        <section>
          <SectionHeader number="06" title="Assumptions" />
          <div className="rounded-xl border border-[#003366]/10 bg-white/60 p-5">
            <CollapsibleSection title="Context">
              <div className="space-y-1 text-sm text-[#003366]/70">
                <p>Cohort size: {fmtNumber(cohortSize)}</p>
                <p>Program type: {context.programType ?? "—"}</p>
                <p>Advisor hourly cost: {fmtCurrency(context.avgAdvisorHourlyCost ?? 0)}</p>
              </div>
            </CollapsibleSection>
            <CollapsibleSection title="Baseline">
              <div className="space-y-1 text-sm text-[#003366]/70">
                <p>Readiness rate: {fmtPct(assumptions.baseline?.readinessRatePct ?? 0)}</p>
                <p>Offer rate: {fmtPct(assumptions.baseline?.offerRatePct ?? 0)}</p>
                <p>Time to offer: {assumptions.baseline?.avgTimeToOfferWeeks ?? "—"} weeks</p>
                <p>Mock interviews per learner: {assumptions.baseline?.mockInterviewsPerLearner ?? "—"}</p>
              </div>
            </CollapsibleSection>
            <CollapsibleSection title="Uplift">
              <div className="space-y-1 text-sm text-[#003366]/70">
                <p>Readiness lift: {assumptions.uplift?.readinessUpliftPctPoints ?? "—"} pp</p>
                <p>Offer lift: {assumptions.uplift?.offerRateUpliftPctPoints ?? "—"} pp</p>
                <p>Advisor time savings: {fmtPct(assumptions.uplift?.advisorTimeSavingsPct ?? 0)}</p>
                <p>Time to offer improvement: {assumptions.uplift?.timeToOfferImprovementWeeks ?? "—"} weeks</p>
              </div>
            </CollapsibleSection>
            <CollapsibleSection title="Economics">
              <div className="space-y-1 text-sm text-[#003366]/70">
                <p>Revenue per placement: {fmtCurrency(assumptions.economics?.revenuePerPlacement ?? 0)}</p>
                <p>Cost per session: {fmtCurrency(assumptions.economics?.costPerSession ?? 0)}</p>
                <p>Tuition per learner: {fmtCurrency(assumptions.economics?.tuitionPerLearner ?? 0)}</p>
              </div>
            </CollapsibleSection>
          </div>
        </section>

        {/* Section 7: If Nothing Changes */}
        <section>
          <SectionHeader number="07" title="If Nothing Changes" />
          <div className="rounded-xl border border-[#003366]/10 bg-white/60 p-5">
            <BulletList items={ifNothingChanges} />
            <p className="mt-6 text-sm text-[#003366]/60">
              Most programs validate these gaps in a short walkthrough.
            </p>
          </div>
        </section>

        {/* Footer */}
        <footer className="pt-6 border-t border-[#003366]/10 flex items-center justify-between">
          <a
            href="/roicalculator"
            className="inline-flex items-center gap-2 text-sm text-[#003366]/60 hover:text-[#003366]"
          >
            ← Back to calculator
          </a>
          <p className="text-xs text-[#003366]/40">Report ID: {runId}</p>
        </footer>
      </div>
    </main>
  );
}
