import React from "react";

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

function StatCard({ label, value, sub, desc }: { label: string; value: string; sub?: string; desc?: string }) {
  return (
    <div className="relative overflow-hidden rounded-2xl border border-white/30 bg-white/70 p-4 shadow-[0_20px_60px_-35px_rgba(0,0,0,0.35)] backdrop-blur">
      <div className="absolute -right-10 -top-10 h-28 w-28 rounded-full bg-[#003366]/10 blur-3xl" />
      <div className="text-xs font-semibold text-[#003366]/70">{label}</div>
      <div className="mt-2 text-2xl font-bold text-[#003366]">{value}</div>
      {sub && <div className="mt-1 text-xs text-[#003366]/60">{sub}</div>}
      {desc && <div className="mt-2 text-[11px] text-[#003366]/55 leading-snug">{desc}</div>}
    </div>
  );
}

function CardShell({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="relative overflow-hidden rounded-2xl border border-white/30 bg-white/80 p-5 shadow-[0_24px_60px_-35px_rgba(0,0,0,0.35)] backdrop-blur">
      <div className="absolute -left-10 top-0 h-28 w-28 rounded-full bg-sky-200/50 blur-3xl" />
      <div className="absolute right-0 -bottom-10 h-32 w-32 rounded-full bg-amber-100/50 blur-3xl" />
      <div className="relative space-y-3">
        <h2 className="text-lg font-semibold text-[#003366]">{title}</h2>
        {children}
      </div>
    </section>
  );
}

export default async function RoiReportPage({
  params,
  searchParams,
}: {
  params: Promise<{ runId: string }>;
  searchParams?: Promise<{ view?: string }>;
}) {
  const { runId } = await params;
  const sp = (await searchParams) || {};
  const data = await fetchReport(runId);

  if (!data || data.error) {
    return (
      <main className="min-h-screen bg-gradient-to-b from-[#e8f0ff] via-white to-[#f5f8ff]">
        <div className="max-w-5xl mx-auto px-6 py-16 space-y-4">
          <h1 className="text-3xl font-semibold text-[#003366]">Report not found</h1>
          <p className="text-sm text-[#003366]/70">We couldn&apos;t load this report. It may not be ready or may not exist.</p>
        </div>
      </main>
    );
  }

  if (!data.gatePassed) {
    const t = data.teaser;
    return (
      <main className="min-h-screen bg-gradient-to-b from-[#e8f0ff] via-white to-[#f5f8ff]">
        <div className="max-w-4xl mx-auto px-6 py-16 space-y-6">
          <div className="space-y-2">
            <Pill>ROI report preview</Pill>
            <h1 className="text-3xl font-semibold text-[#003366]">Unlock the full report</h1>
            <p className="text-sm text-[#003366]/70">Submit your email in the calculator to view the complete analysis.</p>
          </div>
          <CardShell title="Teaser">
            <pre className="rounded-xl bg-white/80 p-4 text-xs text-[#003366]/90 overflow-x-auto border border-white/40">
              {JSON.stringify(t, null, 2)}
            </pre>
          </CardShell>
        </div>
    </main>
  );
}

function cn(...xs: Array<string | false | null | undefined>) {
  return xs.filter(Boolean).join(" ");
}

// Full report
const run: RoiRunRow = data.run;
  const { result, narrative, request } = run;
  const { summary, baseline, sensitivity, timeline } = result;

  const context = request?.context ?? {};
  const cohortSize = Number(context.cohortSize ?? 0);
  const baselineMockInterviews = Number(result?.assumptions?.baseline?.mockInterviewsPerLearner ?? 0);
  const mockUpliftPct = Number(result?.assumptions?.uplift?.mockInterviewUpliftPct ?? 0);
  const baseSessions = cohortSize * baselineMockInterviews;
  const afterSessions = baseSessions * (1 + mockUpliftPct / 100);
  const readyDelta = summary.addedReadyLearners;
  const offersDelta = summary.addedOffers;
  const econRevenuePerPlacement = Number(result?.assumptions?.economics?.revenuePerPlacement ?? 0);
  const view = sp.view === "before" ? "before" : "after";
  const enrollmentAtRisk = Number(result.enrollment?.atRisk ?? 0);
  const enrollmentUplift = Number(result.enrollment?.uplift ?? 0);

  const readyGap = Math.max(0, cohortSize - Number(baseline.readyLearners ?? 0));
  const offerGap = Math.max(0, cohortSize - Number(baseline.offers ?? 0));
  const baselineAdvisorHours = Number(baseline.offers ?? 0) * 0.75; // 75% of placed learners x 1 hour
  const baselineAdvisorCost = baselineAdvisorHours * 80;
  const advisorCostPerHour = baselineAdvisorHours > 0 ? baselineAdvisorCost / baselineAdvisorHours : 0;

  const viewedStats =
    view === "before"
      ? {
          totalValueImpact: baseline.offers * econRevenuePerPlacement,
          revenueImpact: baseline.offers * econRevenuePerPlacement,
          costSavings: baselineAdvisorCost,
          advisorHoursSaved: baselineAdvisorHours,
          ready: baseline.readyLearners,
          offers: baseline.offers,
          timeToOffer: timeline.baselineTimeToOfferWeeks,
        }
      : {
          // Cap savings to what is realistically spendable today
          revenueImpact: summary.revenueImpact,
          advisorHoursSaved: Math.min(summary.advisorHoursSaved, baselineAdvisorHours * 0.1), // keep efficiency impact small
          costSavings: Math.min(Math.min(summary.advisorHoursSaved, baselineAdvisorHours * 0.1) * advisorCostPerHour, baselineAdvisorCost),
          totalValueImpact:
            summary.revenueImpact +
            Math.min(Math.min(summary.advisorHoursSaved, baselineAdvisorHours * 0.1) * advisorCostPerHour, baselineAdvisorCost) -
            summary.addedSessionsCost,
          ready: baseline.readyLearners + readyDelta,
          offers: baseline.offers + offersDelta,
          timeToOffer: timeline.newTimeToOfferWeeks,
        };

  const summaryBullets =
    view === "before"
      ? [
          `Current outcomes deliver ${fmtNumber(baseline.offers)} offers (~${fmtCurrency(
            baseline.offers * econRevenuePerPlacement,
          )}) from ${fmtNumber(cohortSize)} learners — ${fmtNumber(offerGap)} are still unreached.`,
          `Readiness gap leaves ${fmtNumber(readyGap)} learners unprepared, weakening employer confidence and referrals.`,
          `Advisors spend ~${fmtNumber(baselineAdvisorHours)} hours (~${fmtCurrency(
            baselineAdvisorCost,
          )}) on current placements, with time-to-offer at ${timeline.baselineTimeToOfferWeeks ?? "—"} weeks and credibility risk around ${fmtCurrency(
            enrollmentAtRisk,
          )}.`,
        ]
      : [
          `We are adding ${fmtNumber(readyDelta)} ready learners and ${fmtNumber(offersDelta)} offers, lifting revenue by ${fmtCurrency(
            summary.revenueImpact,
          )}.`,
          `Practice volume rises to ~${fmtNumber(afterSessions)} sessions (was ${fmtNumber(baseSessions)}), feeding higher conversion.`,
          `Advisor efficiency is modest (~${fmtNumber(viewedStats.advisorHoursSaved)} hours) while time-to-offer improves to ${
            viewedStats.timeToOffer ?? "—"
          } weeks.`,
          `Stronger placement signals boost enrollment credibility by about ${fmtCurrency(enrollmentUplift)}, strengthening reputation and momentum.`,
        ];

  return (
    <main className="min-h-screen bg-gradient-to-b from-[#e8f0ff] via-white to-[#f5f8ff]">
      <div className="max-w-6xl mx-auto px-6 py-16 space-y-8">
        <header className="relative overflow-hidden rounded-3xl border border-white/40 bg-white/80 p-6 shadow-[0_30px_80px_-40px_rgba(0,0,0,0.4)] backdrop-blur">
          <div className="absolute -left-16 -top-12 h-48 w-48 rounded-full bg-sky-200/50 blur-3xl" />
          <div className="absolute right-4 bottom-4 h-44 w-44 rounded-full bg-amber-100/50 blur-3xl" />
          <div className="relative flex flex-col gap-3">
            <div className="flex flex-wrap items-center gap-2">
              <Pill>Report #{runId}</Pill>
              <Pill>{context.programType ?? "Institution"}</Pill>
              <span className="inline-flex items-center gap-2 rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
                Ready
              </span>
            </div>
            <div>
              <h1 className="text-3xl md:text-4xl font-semibold text-[#003366]">ROI Report</h1>
              <p className="mt-1 text-sm text-[#003366]/70">
                Cohort size: {context.cohortSize ?? "—"} • Created: {fmtDateTime(run.created_at)}
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <a
                href="/roicalculator"
                className="inline-flex items-center gap-2 rounded-full border border-[#003366]/15 bg-white/70 px-3 py-2 text-xs font-semibold text-[#003366] hover:bg-white"
              >
                ← Back to calculator
              </a>
              <a
                href={`/institutions/roi/report/${runId}`}
                className="inline-flex items-center gap-2 rounded-full border border-[#003366]/15 bg-white/70 px-3 py-2 text-xs font-semibold text-[#003366] hover:bg-white"
              >
                Refresh report
              </a>
              <div className="inline-flex rounded-full border border-[#ff8a80]/60 bg-white/80 p-1 text-xs font-semibold text-[#003366] shadow-sm">
                {(["before", "after"] as const).map((v) => {
                  const active = view === v;
                  const href = `/institutions/roi/report/${runId}?view=${v}`;
                  return (
                    <a
                      key={v}
                      href={href}
                      className={cn(
                        "px-3 py-1 rounded-full transition-colors",
                        active ? "bg-[#ff8a80] text-white shadow" : "text-[#003366] hover:bg-[#ff8a80]/10",
                      )}
                    >
                      {v === "before" ? "Before Clarivue" : "With Clarivue"}
                    </a>
                  );
                })}
              </div>
            </div>
            <div className="rounded-2xl border border-white/40 bg-white/70 p-4 shadow-sm">
              <h2 className="text-sm font-semibold text-[#003366] mb-2">
                Executive summary — {view === "before" ? "current reality" : "with Clarivue"}
              </h2>
              <ul className="list-disc list-inside space-y-1.5 text-sm text-[#003366]/80">
                {summaryBullets.map((b: string, i: number) => (
                  <li key={i}>{b}</li>
                ))}
              </ul>
              {narrative && view === "after" && (
                <div className="mt-3 text-xs text-[#003366]/60">
                  <p className="font-semibold text-[#003366]">AI narrative</p>
                  <div className="space-y-1">
                    {narrative
                      .split("\n")
                      .filter(Boolean)
                      .map((b: string, i: number) => (
                        <p key={i}>{b.trim()}</p>
                      ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <StatCard
            label="Total value impact"
            value={fmtCurrency(viewedStats.totalValueImpact)}
            desc="Net impact after adding funding/placements and subtracting delivery costs."
          />
          <StatCard
            label="Revenue impact"
            value={fmtCurrency(viewedStats.revenueImpact)}
            desc="Placement-linked revenue and outcome funding (if provided)."
          />
          <StatCard
            label={view === "before" ? "Advisor spend (est.)" : "Cost savings"}
            value={fmtCurrency(viewedStats.costSavings)}
            sub={view === "before" ? "Estimated current advisory cost" : undefined}
            desc={
              view === "before"
                ? "Modeled as 0.75 hr per placed learner at $80/hr."
                : "Modest efficiency impact, capped at ~10% of current load."
            }
          />
          <StatCard
            label={view === "before" ? "Advisor hours (est.)" : "Advisor hours saved"}
            value={fmtNumber(viewedStats.advisorHoursSaved)}
            sub={view === "before" ? "Current advisory load" : "hours back to coaching"}
            desc={
              view === "before"
                ? "Estimated hours supporting current placements."
                : "Time returned to coaching/quality, capped at ~10% of current load."
            }
          />
          <StatCard
            label="Ready learners"
            value={fmtNumber(viewedStats.ready)}
            desc={view === "before" ? "Prepared today." : "Prepared with Clarivue uplift."}
          />
          <StatCard
            label="Offers"
            value={fmtNumber(viewedStats.offers)}
            desc={view === "before" ? "Offers in current state." : "Offers with Clarivue uplift."}
          />
          <StatCard
            label="Practice throughput"
            value={fmtNumber(view === "before" ? baseSessions : afterSessions)}
            desc={
              view === "before"
                ? "Estimated mock interviews delivered today."
                : "After uplift — more reps feeding higher conversion."
            }
          />
        </div>

        <CardShell title="Before vs After">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
            <div className="rounded-2xl border border-white/40 bg-white/80 p-4 shadow-sm">
              <div className="text-xs font-semibold text-[#003366]/60 mb-2">Before Clarivue</div>
              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <span>Ready learners</span>
                  <span className="font-semibold text-[#003366]">{fmtNumber(baseline.readyLearners)}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Offers</span>
                  <span className="font-semibold text-[#003366]">{fmtNumber(baseline.offers)}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Advisor hours saved</span>
                  <span className="font-semibold text-[#003366]">0</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Time to offer</span>
                  <span className="font-semibold text-[#003366]">
                    {timeline.baselineTimeToOfferWeeks ? `${timeline.baselineTimeToOfferWeeks} wks` : "—"}
                  </span>
                </div>
                <div className="mt-2 text-xs text-[#003366]/60">
                  Employer signal: mixed; readiness varies by advisor/cohort.
                </div>
              </div>
            </div>

            <div className="rounded-2xl border border-white/40 bg-white/80 p-4 shadow-sm">
              <div className="text-xs font-semibold text-[#003366]/60 mb-2">With Clarivue</div>
              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <span>Ready learners</span>
                  <span className="font-semibold text-[#003366]">
                    {fmtNumber(baseline.readyLearners + summary.addedReadyLearners)}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Offers</span>
                  <span className="font-semibold text-[#003366]">
                    {fmtNumber(baseline.offers + summary.addedOffers)}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Advisor hours saved</span>
                  <span className="font-semibold text-[#003366]">{fmtNumber(summary.advisorHoursSaved)}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Time to offer</span>
                  <span className="font-semibold text-[#003366]">
                    {timeline.newTimeToOfferWeeks ? `${timeline.newTimeToOfferWeeks} wks` : "—"}
                  </span>
                </div>
                <div className="mt-2 text-xs text-[#003366]/60">
                  Employer signal: consistent readiness and rubric-aligned mocks.
                </div>
              </div>
            </div>
          </div>
        </CardShell>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <CardShell title="Sensitivity band">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-sm">
              {(["low", "expected", "high"] as const).map((key) => {
                const v = (sensitivity as any)[key] as ScenarioBreakdown;
                return (
                  <div key={key} className="rounded-xl border border-white/40 bg-white/80 p-3 shadow-sm">
                    <div className="text-xs font-semibold text-[#003366]/60 capitalize">{key}</div>
                    <div className="mt-1 text-lg font-semibold text-[#003366]">{fmtCurrency(v.totalValueImpact)}</div>
                    <div className="mt-1 text-xs text-[#003366]/60">
                      {fmtNumber(v.addedOffers)} offers • {fmtNumber(v.advisorHoursSaved)} hrs
                    </div>
                  </div>
                );
              })}
            </div>
          </CardShell>

          <CardShell title="Timeline">
            <div className="flex flex-col gap-2 text-sm text-[#003366]/80">
              <div className="flex items-center justify-between rounded-xl border border-white/40 bg-white/70 p-3">
                <span className="font-semibold text-[#003366]">Baseline time to offer</span>
                <span>{timeline.baselineTimeToOfferWeeks ? `${timeline.baselineTimeToOfferWeeks} weeks` : "—"}</span>
              </div>
              <div className="flex items-center justify-between rounded-xl border border-white/40 bg-white/70 p-3">
                <span className="font-semibold text-[#003366]">With Clarivue</span>
                <span>{timeline.newTimeToOfferWeeks ? `${timeline.newTimeToOfferWeeks} weeks` : "—"}</span>
              </div>
            </div>
          </CardShell>
        </div>

        <CardShell title="Assumptions">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm text-[#003366]/80">
            <div className="rounded-xl border border-white/40 bg-white/70 p-3">
              <div className="text-xs font-semibold text-[#003366]/60 mb-1">Context</div>
              <ul className="space-y-1">
                <li>Cohort size: {context.cohortSize ?? "—"}</li>
                <li>Program type: {context.programType ?? "—"}</li>
              </ul>
            </div>
            <div className="rounded-xl border border-white/40 bg-white/70 p-3">
              <div className="text-xs font-semibold text-[#003366]/60 mb-1">Baseline</div>
              <ul className="space-y-1">
                <li>Readiness rate: {result.assumptions?.baseline?.readinessRatePct ?? "—"}%</li>
                <li>Offer rate: {result.assumptions?.baseline?.offerRatePct ?? "—"}%</li>
              </ul>
            </div>
            <div className="rounded-xl border border-white/40 bg-white/70 p-3">
              <div className="text-xs font-semibold text-[#003366]/60 mb-1">Uplift</div>
              <ul className="space-y-1">
                <li>Readiness lift: {result.assumptions?.uplift?.readinessUpliftPctPoints ?? "—"} pp</li>
                <li>Offer lift: {result.assumptions?.uplift?.offerRateUpliftPctPoints ?? "—"} pp</li>
                <li>Advisor time savings: {result.assumptions?.uplift?.advisorTimeSavingsPct ?? "—"}%</li>
              </ul>
            </div>
            <div className="rounded-xl border border-white/40 bg-white/70 p-3">
              <div className="text-xs font-semibold text-[#003366]/60 mb-1">Economics</div>
              <ul className="space-y-1">
                <li>Revenue per placement: {fmtCurrency(result.assumptions?.economics?.revenuePerPlacement ?? 0)}</li>
                <li>Cost per session: {fmtCurrency(result.assumptions?.economics?.costPerSession ?? 0)}</li>
              </ul>
            </div>
          </div>
        </CardShell>
      </div>
    </main>
  );
}
