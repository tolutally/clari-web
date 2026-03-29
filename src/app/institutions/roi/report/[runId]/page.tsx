import React from "react";
import { ArrowRight, TrendingUp, Users, Clock, DollarSign, AlertTriangle, CheckCircle2, ChevronDown, Shield, RefreshCw, Target } from "lucide-react";
import { getRun } from "@/lib/institution-roi/storage";

export const dynamic = "force-dynamic";

/* ---------- Formatting helpers ---------- */
const fmtCurrency = (v: number) => `$${Number(v ?? 0).toLocaleString()}`;
const fmtNumber = (v: number) => Number(v ?? 0).toLocaleString();
const fmtPct = (v: number) => `${Number(v ?? 0).toFixed(0)}%`;
const fmtDateTime = (iso?: string) =>
  iso
    ? new Date(iso).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
    : "—";

/* =================================================================
 * Page component
 * ================================================================= */
export default async function RoiReportPage({
  params,
}: {
  params: Promise<{ runId: string }>;
}) {
  const { runId } = await params;

  // Fetch directly from database
  let run: any | null = null;
  try {
    run = await getRun(runId);
  } catch (err) {
    console.error("[ROI Report] Database error:", err);
  }

  /* ---------- Not found ---------- */
  if (!run) {
    return (
      <main className="min-h-screen bg-gradient-to-br from-[#003366] via-[#004080] to-[#003366]">
        <div className="max-w-3xl mx-auto px-6 py-20 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-white/10 mb-6">
            <AlertTriangle className="w-8 h-8 text-white/60" />
          </div>
          <h1 className="text-2xl font-semibold text-white mb-3">Report not found</h1>
          <p className="text-white/60 mb-8">This report may not exist or may not be ready.</p>
          <a
            href="/hidden-gap"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-white text-[#003366] font-semibold hover:bg-white/90 transition-all"
          >
            Back to Calculator
          </a>
        </div>
      </main>
    );
  }

  /* ---------- Gate not passed ---------- */
  if (!run.gate_passed) {
    return (
      <main className="min-h-screen bg-gradient-to-br from-[#003366] via-[#004080] to-[#003366]">
        <div className="max-w-3xl mx-auto px-6 py-20 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#ff686c]/20 text-[#ff686c] text-sm font-semibold mb-6">
            <span className="w-2 h-2 rounded-full bg-[#ff686c] animate-pulse" />
            Preview Mode
          </div>
          <h1 className="text-3xl font-semibold text-white mb-3">Unlock the full report</h1>
          <p className="text-white/60 mb-8">Submit your email in the calculator to view the complete analysis.</p>
          <a
            href="/hidden-gap"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#ff686c] text-white font-semibold hover:bg-[#ff686c]/90 transition-all"
          >
            Complete Calculator <ArrowRight className="w-4 h-4" />
          </a>
        </div>
      </main>
    );
  }

  /* ---------- Route to correct renderer ---------- */
  const resultVersion = run.result_version ?? 1;

  if (resultVersion >= 4) {
    return <V4Report run={run} />;
  }
  if (resultVersion >= 3) {
    return <V3Report run={run} />;
  }
  if (resultVersion >= 2) {
    return <V2Report run={run} />;
  }
  return <V1Report run={run} />;
}

/* =================================================================
 * V4 Gap Cost Report - Challenger Sales Style
 * ================================================================= */
function V4Report({ run }: { run: any }) {
  const { result, request } = run;
  const summary = result?.summary ?? {};
  const losses = summary?.losses ?? {};
  const sensitivity = result?.sensitivity ?? {};
  const narrative = run.narrative;

  const learnersPerYear = request?.learnersPerYear ?? 0;
  const programType = request?.programType ?? "workforce";
  const programTypeLabels: Record<string, string> = {
    workforce: "Workforce Development",
    bootcamp: "Bootcamp / Skills Training",
    university: "University / College",
    other: "Program",
  };

  return (
    <main className="min-h-screen">
      {/* ── Hero ── */}
      <section className="relative bg-gradient-to-br from-[#003366] via-[#004080] to-[#002244] pt-12 pb-20 overflow-hidden">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-96 h-96 rounded-full bg-[#ff686c]/10 blur-3xl" />
          <div className="absolute -bottom-40 -left-40 w-96 h-96 rounded-full bg-emerald-500/10 blur-3xl" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full bg-white/[0.02]" />
        </div>

        <div className="relative max-w-4xl mx-auto px-6">
          {/* Header badges */}
          <div className="flex flex-wrap items-center gap-3 mb-8">
            <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 backdrop-blur border border-white/10 text-white/80 text-xs font-semibold uppercase tracking-wider">
              <span className="w-1.5 h-1.5 rounded-full bg-[#ff686c]" />
              Placement Gap Analysis
            </span>
            <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 backdrop-blur border border-white/10 text-white/80 text-xs font-semibold">
              {programTypeLabels[programType]} &bull; {fmtNumber(learnersPerYear)} learners/year
            </span>
          </div>

          {/* Hero: Gap Cost */}
          <div className="text-center mb-12">
            <p className="text-[#ff686c] font-semibold text-sm uppercase tracking-wider mb-4">
              Your training-to-employment gap costs
            </p>
            <h1 className="text-5xl md:text-7xl font-bold text-white mb-4 tracking-tight">
              {fmtCurrency(summary.aggregateGapCost ?? 0)}
              <span className="text-2xl font-normal text-white/50">/year</span>
            </h1>
            <p className="text-white/60 text-lg">
              in lost advisor time, wasted budget, and learners who never place
            </p>
          </div>

          {/* Loss metrics row */}
          <div className="grid md:grid-cols-3 gap-4">
            <MetricCard
              icon={<Clock className="w-5 h-5 text-slate-300" />}
              iconBg="bg-slate-500/20"
              value={fmtNumber(Math.round(losses.timeLost?.hours ?? 0)) + "h"}
              label="Time Lost"
            />
            <MetricCard
              icon={<DollarSign className="w-5 h-5 text-amber-400" />}
              iconBg="bg-amber-500/20"
              value={fmtCurrency(losses.moneyLost?.amount ?? 0)}
              label="Money Lost"
            />
            <MetricCard
              icon={<Users className="w-5 h-5 text-[#ff686c]" />}
              iconBg="bg-[#ff686c]/20"
              value={fmtNumber(losses.peopleLost?.count ?? 0) + " learners"}
              label="People Lost"
            />
          </div>

          {/* Clarivue Impact */}
          <div className="mt-8 bg-emerald-500/20 backdrop-blur-sm rounded-2xl p-6 border border-emerald-400/20 text-center">
            <p className="text-emerald-300 text-sm font-semibold uppercase tracking-wider mb-2">With Clarivue</p>
            <p className="text-4xl font-bold text-white">
              +{fmtNumber(summary.additionalPlacements ?? 0)} placements
            </p>
            <p className="text-emerald-200/70 text-sm mt-2">
              Range: {sensitivity.conservative?.additionalPlacements ?? 0}–{sensitivity.optimistic?.additionalPlacements ?? 0} additional placements per year
            </p>
          </div>

          {/* Scroll indicator */}
          <div className="flex justify-center mt-12">
            <div className="flex flex-col items-center text-white/40 animate-bounce">
              <p className="text-xs mb-2">View Full Analysis</p>
              <ChevronDown className="w-5 h-5" />
            </div>
          </div>
        </div>
      </section>

      {/* ── Content ── */}
      <div className="bg-gradient-to-b from-[#f8fafc] to-white">
        <div className="max-w-4xl mx-auto px-6 py-16 space-y-12">
          {/* Section 1: The Three Losses */}
          <section>
            <SectionHeader number="1" title="Where Your Program Loses" accent="rose" />
            <div className="grid md:grid-cols-3 gap-4">
              <div className="bg-gradient-to-br from-slate-50 to-slate-100 rounded-2xl p-5 border border-slate-200">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center">
                    <Clock className="w-5 h-5 text-slate-600" />
                  </div>
                  <p className="font-semibold text-[#003366] text-sm">Time Lost</p>
                </div>
                <p className="text-3xl font-bold text-[#003366] mb-1">{fmtNumber(Math.round(losses.timeLost?.hours ?? 0))} hours</p>
                <p className="text-xs text-[#003366]/60">
                  Advisor hours spent on resume reviews, mock interviews, job matching, and follow-ups
                </p>
              </div>

              <div className="bg-gradient-to-br from-amber-50 to-amber-100/50 rounded-2xl p-5 border border-amber-200">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-10 h-10 rounded-xl bg-amber-100 flex items-center justify-center">
                    <DollarSign className="w-5 h-5 text-amber-600" />
                  </div>
                  <p className="font-semibold text-[#003366] text-sm">Money Lost</p>
                </div>
                <p className="text-3xl font-bold text-[#003366] mb-1">{fmtCurrency(losses.moneyLost?.amount ?? 0)}</p>
                <p className="text-xs text-[#003366]/60">
                  Staff cost at {fmtCurrency(losses.moneyLost?.hourlyRate ?? 0)}/hour for last-mile placement work
                </p>
              </div>

              <div className="bg-gradient-to-br from-red-50 to-red-100/50 rounded-2xl p-5 border border-red-200">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-10 h-10 rounded-xl bg-red-100 flex items-center justify-center">
                    <Users className="w-5 h-5 text-red-600" />
                  </div>
                  <p className="font-semibold text-[#003366] text-sm">People Lost</p>
                </div>
                <p className="text-3xl font-bold text-[#003366] mb-1">{fmtNumber(losses.peopleLost?.count ?? 0)} learners</p>
                <p className="text-xs text-[#003366]/60">
                  {fmtPct((losses.peopleLost?.effectiveDropOffRate ?? 0) * 100)} don&apos;t place due to the training-to-employment gap
                </p>
              </div>
            </div>
          </section>

          {/* Section 2: What Clarivue Recovers */}
          <section>
            <SectionHeader number="2" title="What Clarivue Recovers" accent="emerald" />
            <div className="bg-gradient-to-br from-emerald-50 to-sky-50 rounded-2xl p-6 border border-emerald-100">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-emerald-600/70 mb-4">
                    The Clarivue Effect
                  </p>
                  <div className="space-y-4">
                    {[
                      { 
                        label: "Additional placements", 
                        val: `+${fmtNumber(summary.additionalPlacements ?? 0)}`, 
                        icon: TrendingUp,
                        subtitle: "Learners who would have dropped off"
                      },
                      { 
                        label: "Placement value", 
                        val: fmtCurrency((summary.additionalPlacements ?? 0) * (losses.peopleLost?.placementValue ?? 6000)), 
                        icon: DollarSign,
                        subtitle: "Revenue from additional placements"
                      },
                    ].map((item, i) => (
                      <div key={i} className="py-3 border-b border-emerald-100 last:border-0">
                        <div className="flex items-center justify-between mb-1">
                          <div className="flex items-center gap-2">
                            <item.icon className="w-4 h-4 text-emerald-600" />
                            <span className="text-sm font-medium text-[#003366]">{item.label}</span>
                          </div>
                          <span className="font-semibold text-emerald-600">{item.val}</span>
                        </div>
                        <p className="text-xs text-[#003366]/50 ml-6">{item.subtitle}</p>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="flex flex-col justify-center items-center text-center bg-white/50 rounded-xl p-6">
                  <p className="text-xs text-emerald-600/70 uppercase tracking-wider mb-2">Recovery Rate</p>
                  <p className="text-5xl font-bold text-emerald-600">65%</p>
                  <p className="text-sm text-emerald-600/60 mt-2">
                    of learners lost to the gap can be recovered
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Section 3: Range of Outcomes */}
          <section>
            <SectionHeader number="3" title="Range of Outcomes" accent="navy" />
            <p className="text-xs text-[#003366]/50 mb-4">How results shift based on program adoption depth.</p>
            <div className="bg-white rounded-2xl p-6 border border-[#003366]/10 shadow-sm">
              <div className="grid grid-cols-3 gap-4">
                <div className="text-center p-4 rounded-xl bg-[#003366]/5">
                  <p className="text-xs text-[#003366]/50 mb-2">Conservative (55%)</p>
                  <p className="text-2xl font-bold text-[#003366]">
                    +{fmtNumber(sensitivity.conservative?.additionalPlacements ?? 0)}
                  </p>
                  <p className="text-xs text-[#003366]/50 mt-2">additional placements</p>
                </div>
                <div className="text-center p-4 rounded-xl bg-emerald-50 border-2 border-emerald-200">
                  <p className="text-xs text-emerald-600 mb-2 font-semibold">Expected (65%)</p>
                  <p className="text-2xl font-bold text-emerald-600">
                    +{fmtNumber(sensitivity.expected?.additionalPlacements ?? 0)}
                  </p>
                  <p className="text-xs text-emerald-600/70 mt-2">additional placements</p>
                </div>
                <div className="text-center p-4 rounded-xl bg-[#003366]/5">
                  <p className="text-xs text-[#003366]/50 mb-2">Optimistic (75%)</p>
                  <p className="text-2xl font-bold text-[#003366]">
                    +{fmtNumber(sensitivity.optimistic?.additionalPlacements ?? 0)}
                  </p>
                  <p className="text-xs text-[#003366]/50 mt-2">additional placements</p>
                </div>
              </div>
            </div>
          </section>

          {/* Section 4: Narrative */}
          {narrative && (
            <section>
              <SectionHeader number="4" title="Executive Summary" accent="violet" />
              <div className="bg-gradient-to-br from-violet-50 to-indigo-50 rounded-2xl p-6 border border-violet-100">
                <div className="text-sm text-[#003366]/80 whitespace-pre-line leading-relaxed">
                  {narrative}
                </div>
              </div>
            </section>
          )}

          {/* Section 5: If Nothing Changes */}
          <section>
            <SectionHeader number={narrative ? "5" : "4"} title="If Nothing Changes" accent="slate" />
            <div className="bg-gradient-to-br from-slate-50 to-slate-100 rounded-2xl p-6 border border-slate-200">
              <div className="grid md:grid-cols-2 gap-4">
                {[
                  `${fmtCurrency(summary.aggregateGapCost ?? 0)} lost annually — invisible in most program budgets`,
                  `${fmtNumber(losses.peopleLost?.count ?? 0)} learners fail to place every year despite being trained`,
                  `${fmtNumber(Math.round(losses.timeLost?.hours ?? 0))} advisor hours spent on tasks that don't scale`,
                  "Placement rates stay flat while funders expect improvement",
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-3 text-sm text-[#003366]/70">
                    <div className="w-1.5 h-1.5 rounded-full bg-slate-400 flex-shrink-0" />
                    {item}
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Assumptions - Collapsible */}
          <section>
            <details className="group">
              <summary className="flex items-center justify-between cursor-pointer py-4 border-b border-[#003366]/10">
                <div className="flex items-center gap-3">
                  <span className="flex items-center justify-center w-8 h-8 rounded-full bg-[#003366]/5 text-[#003366]/60 text-sm font-bold">
                    {narrative ? "6" : "5"}
                  </span>
                  <h2 className="text-xl font-semibold text-[#003366]">Calculation Details</h2>
                </div>
                <ChevronDown className="w-5 h-5 text-[#003366]/40 transition-transform group-open:rotate-180" />
              </summary>
              <div className="pt-6 grid md:grid-cols-2 gap-4">
                <AssumptionCard title="Program Inputs">
                  <p>Learners per year: {fmtNumber(learnersPerYear)}</p>
                  <p>Program type: {programTypeLabels[programType]}</p>
                  <p>Advisors/staff: {request?.advisorsCount ?? "—"}</p>
                  <p>Current caseload: {request?.currentCaseload ?? "—"} per advisor</p>
                </AssumptionCard>
                <AssumptionCard title="Time Lost Breakdown">
                  <p>Hours per learner: {((losses.timeLost?.hours ?? 0) / learnersPerYear).toFixed(1)}h</p>
                  <p>Activities: Resume, mock interviews, job matching, follow-ups</p>
                </AssumptionCard>
                <AssumptionCard title="Money Lost">
                  <p>Advisor hourly cost: {fmtCurrency(losses.moneyLost?.hourlyRate ?? 0)}</p>
                  <p>Total hours × hourly rate</p>
                </AssumptionCard>
                <AssumptionCard title="People Lost">
                  <p>Base drop-off rate: {fmtPct((losses.peopleLost?.baseDropOffRate ?? 0) * 100)}</p>
                  <p>Caseload strain multiplier: {(losses.peopleLost?.caseloadStrainMultiplier ?? 1).toFixed(2)}×</p>
                  <p>Effective rate: {fmtPct((losses.peopleLost?.effectiveDropOffRate ?? 0) * 100)}</p>
                  <p>Placement value: {fmtCurrency(losses.peopleLost?.placementValue ?? 0)}</p>
                </AssumptionCard>
              </div>
            </details>
          </section>

          {/* CTA */}
          <section className="bg-gradient-to-br from-[#003366] to-[#004080] rounded-3xl p-8 md:p-10 text-center relative overflow-hidden">
            <div className="absolute inset-0 overflow-hidden">
              <div className="absolute -top-20 -right-20 w-64 h-64 rounded-full bg-[#ff686c]/20 blur-3xl" />
              <div className="absolute -bottom-20 -left-20 w-64 h-64 rounded-full bg-emerald-500/20 blur-3xl" />
            </div>
            <div className="relative">
              <h3 className="text-2xl font-semibold text-white mb-3">Ready to close the gap?</h3>
              <p className="text-white/60 mb-6 max-w-md mx-auto">
                Schedule a walkthrough to see how Clarivue can deliver these placements for your program.
              </p>
              <a
                href="/book-demo"
                className="inline-flex items-center gap-2 px-8 py-4 rounded-full bg-[#ff686c] text-white font-semibold hover:bg-[#ff686c]/90 transition-all shadow-lg shadow-[#ff686c]/25"
              >
                Schedule Walkthrough <ArrowRight className="w-5 h-5" />
              </a>
            </div>
          </section>

          {/* Footer */}
          <footer className="pt-6 border-t border-[#003366]/10 flex items-center justify-between text-sm">
            <a href="/hidden-gap" className="text-[#003366]/60 hover:text-[#003366] transition-colors">
              &larr; Back to Calculator
            </a>
            <p className="text-[#003366]/40 text-xs">Report generated {fmtDateTime(run.created_at)}</p>
          </footer>
        </div>
      </div>
    </main>
  );
}

/* =================================================================
 * V3 Realistic ROI Report
 * ================================================================= */
function V3Report({ run }: { run: any }) {
  const { result, request } = run;
  const summary = result.summary ?? {};
  const sensitivity = result.sensitivity ?? {};
  const baselineSignals = result.baselineSignals ?? {};
  const assumptions = result.assumptions ?? {};
  const context = request?.context ?? {};
  const narrative = run.narrative;

  const cohortSize = Number(context.cohortSize ?? 0);
  const programType = context.programType ?? "Institution";

  return (
    <main className="min-h-screen">
      {/* ── Hero ── */}
      <section className="relative bg-gradient-to-br from-[#003366] via-[#004080] to-[#002244] pt-12 pb-20 overflow-hidden">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-96 h-96 rounded-full bg-[#ff686c]/10 blur-3xl" />
          <div className="absolute -bottom-40 -left-40 w-96 h-96 rounded-full bg-sky-500/10 blur-3xl" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full bg-white/[0.02]" />
        </div>

        <div className="relative max-w-4xl mx-auto px-6">
          {/* Header badges */}
          <div className="flex flex-wrap items-center gap-3 mb-8">
            <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 backdrop-blur border border-white/10 text-white/80 text-xs font-semibold uppercase tracking-wider">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
              Interview Prep Cost Analysis
            </span>
            <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 backdrop-blur border border-white/10 text-white/80 text-xs font-semibold">
              {programType} &bull; {fmtNumber(cohortSize)} learners
            </span>
          </div>

          {/* Current prep cost — hero number */}
          <div className="text-center mb-12">
            <p className="text-amber-400 font-semibold text-sm uppercase tracking-wider mb-4">
              Current annual interview-prep cost
            </p>
            <h1 className="text-5xl md:text-7xl font-bold text-white mb-4 tracking-tight">
              {fmtCurrency(summary.currentPrepCost ?? 0)}
            </h1>
            <p className="text-white/60 text-lg">spent each year on manual mock interviews, scheduling, and remediation coaching</p>
          </div>

          {/* Key metrics row */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <MetricCard
              icon={<DollarSign className="w-5 h-5 text-emerald-400" />}
              iconBg="bg-emerald-500/20"
              value={fmtCurrency(summary.advisorTimeRecovered ?? 0)}
              label="Advisor Time Recovered"
            />
            <MetricCard
              icon={<Users className="w-5 h-5 text-sky-400" />}
              iconBg="bg-sky-500/20"
              value={`+${fmtNumber(summary.additionalLearnersServed ?? 0)}`}
              label="Additional Learners Served"
            />
            <MetricCard
              icon={<TrendingUp className="w-5 h-5 text-violet-400" />}
              iconBg="bg-violet-500/20"
              value={summary.placementRateLiftPct != null ? `+${Number(summary.placementRateLiftPct).toFixed(1)}%` : "—"}
              label="Placement Rate Lift"
            />
            <MetricCard
              icon={<Clock className="w-5 h-5 text-amber-400" />}
              iconBg="bg-amber-500/20"
              value={summary.paybackMonths != null ? `${Number(summary.paybackMonths).toFixed(1)} mo` : "—"}
              label="Payback Period"
            />
          </div>

          {/* Scroll indicator */}
          <div className="flex justify-center mt-12">
            <div className="flex flex-col items-center text-white/40 animate-bounce">
              <p className="text-xs mb-2">View Full Analysis</p>
              <ChevronDown className="w-5 h-5" />
            </div>
          </div>
        </div>
      </section>

      {/* ── Content ── */}
      <div className="bg-gradient-to-b from-[#f8fafc] to-white">
        <div className="max-w-4xl mx-auto px-6 py-16 space-y-12">
          {/* Section 1: Where the budget goes */}
          <section>
            <SectionHeader number="1" title="Where Your Prep Budget Goes" accent="rose" />
            <div className="grid md:grid-cols-3 gap-4">
              <CostCard
                icon={<Target className="w-5 h-5 text-[#ff686c]" />}
                title="Mock Session Delivery"
                cost={summary.mockSessionCost ?? 0}
                saved={summary.mockTimeSaved ?? 0}
                description="Direct cost of running mock interviews — facilitator time and materials."
              />
              <CostCard
                icon={<Clock className="w-5 h-5 text-[#ff686c]" />}
                title="Admin & Scheduling"
                cost={summary.adminOverheadCost ?? 0}
                saved={summary.adminTimeSaved ?? 0}
                description="Scheduling, grading rubrics, feedback write-ups, and follow-up coordination."
              />
              <CostCard
                icon={<RefreshCw className="w-5 h-5 text-[#ff686c]" />}
                title="Remediation Coaching"
                cost={summary.remediationCost ?? 0}
                saved={summary.remediationSaved ?? 0}
                description="Extra one-on-one coaching for learners who aren't interview-ready after standard prep."
              />
            </div>
          </section>

          {/* Section 2: What automation recovers */}
          <section>
            <SectionHeader number="2" title="What Automation Recovers" accent="emerald" />
            <div className="bg-gradient-to-br from-emerald-50 to-sky-50 rounded-2xl p-6 border border-emerald-100">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-emerald-600/70 mb-4">
                    Operational Gains
                  </p>
                  <div className="space-y-4">
                    {[
                      { label: "Advisor time recovered", val: fmtCurrency(summary.advisorTimeRecovered ?? 0), icon: DollarSign },
                      { label: "Additional learners served", val: `+${fmtNumber(summary.additionalLearnersServed ?? 0)}`, icon: Users },
                      { label: "Net annual savings", val: fmtCurrency(summary.netAnnualSavings ?? 0), icon: TrendingUp },
                    ].map((item, i) => (
                      <div key={i} className="flex items-center justify-between py-2 border-b border-emerald-100 last:border-0">
                        <div className="flex items-center gap-2">
                          <item.icon className="w-4 h-4 text-emerald-600" />
                          <span className="text-sm font-medium text-[#003366]">{item.label}</span>
                        </div>
                        <span className="font-semibold text-emerald-600">{item.val}</span>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="flex flex-col justify-center items-center text-center">
                  <p className="text-xs text-violet-600/70 uppercase tracking-wider mb-2">Placement Rate Lift</p>
                  <p className="text-5xl font-bold text-violet-600">
                    {summary.placementRateLiftPct != null ? `+${Number(summary.placementRateLiftPct).toFixed(1)}%` : "N/A"}
                  </p>
                  <p className="text-sm text-emerald-600/60 mt-2">
                    {summary.paybackMonths != null
                      ? `Pays for itself in ${Number(summary.paybackMonths).toFixed(1)} months`
                      : ""}
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Section 3: Range of Outcomes */}
          <section>
            <SectionHeader number="3" title="Range of Outcomes" accent="navy" />
            <p className="text-xs text-[#003366]/50 mb-4">How results shift depending on how fully your team adopts Clarivue.</p>
            <div className="bg-white rounded-2xl p-6 border border-[#003366]/10 shadow-sm">
              <div className="grid grid-cols-3 gap-4">
                <div className="text-center p-4 rounded-xl bg-[#003366]/5">
                  <p className="text-xs text-[#003366]/50 mb-2">If improvements are modest</p>
                  <p className="text-2xl font-bold text-[#003366]">
                    {fmtCurrency(sensitivity.low?.advisorTimeRecovered ?? 0)}
                  </p>
                  <p className="text-xs text-[#003366]/50 mt-2">advisor cost savings / year</p>
                </div>
                <div className="text-center p-4 rounded-xl bg-emerald-50 border-2 border-emerald-200">
                  <p className="text-xs text-emerald-600 mb-2 font-semibold">Based on similar programs</p>
                  <p className="text-2xl font-bold text-emerald-600">
                    {fmtCurrency(sensitivity.expected?.advisorTimeRecovered ?? 0)}
                  </p>
                  <p className="text-xs text-emerald-600/70 mt-2">advisor cost savings / year</p>
                </div>
                <div className="text-center p-4 rounded-xl bg-[#003366]/5">
                  <p className="text-xs text-[#003366]/50 mb-2">If your team fully adopts</p>
                  <p className="text-2xl font-bold text-[#003366]">
                    {fmtCurrency(sensitivity.high?.advisorTimeRecovered ?? 0)}
                  </p>
                  <p className="text-xs text-[#003366]/50 mt-2">advisor cost savings / year</p>
                </div>
              </div>
            </div>
          </section>

          {/* Section 4: Narrative */}
          {narrative && (
            <section>
              <SectionHeader number="4" title="Executive Summary" accent="violet" />
              <div className="bg-gradient-to-br from-violet-50 to-indigo-50 rounded-2xl p-6 border border-violet-100">
                <div className="text-sm text-[#003366]/80 whitespace-pre-line leading-relaxed">
                  {narrative}
                </div>
              </div>
            </section>
          )}

          {/* Section 5: If nothing changes */}
          <section>
            <SectionHeader number={narrative ? "5" : "4"} title="If Nothing Changes" accent="slate" />
            <div className="bg-gradient-to-br from-slate-50 to-slate-100 rounded-2xl p-6 border border-slate-200">
              <div className="grid md:grid-cols-2 gap-4">
                {[
                  `${fmtCurrency(summary.currentPrepCost ?? 0)} spent annually on manual interview prep — most of it invisible in advisor workloads`,
                  `${fmtNumber(baselineSignals.totalMockSessions ?? 0)} mock sessions delivered manually by advisors who could be coaching on career strategy`,
                  `${fmtNumber(Math.round(baselineSignals.remediationLearners ?? 0))} learners needing repeat coaching after failed interviews — each consuming additional advisor hours`,
                  "Advisor capacity stays bottlenecked — no room to grow program enrollment without adding headcount",
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-3 text-sm text-[#003366]/70">
                    <div className="w-1.5 h-1.5 rounded-full bg-slate-400 flex-shrink-0" />
                    {item}
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Assumptions - Collapsible */}
          <section>
            <details className="group">
              <summary className="flex items-center justify-between cursor-pointer py-4 border-b border-[#003366]/10">
                <div className="flex items-center gap-3">
                  <span className="flex items-center justify-center w-8 h-8 rounded-full bg-[#003366]/5 text-[#003366]/60 text-sm font-bold">
                    {narrative ? "6" : "5"}
                  </span>
                  <h2 className="text-xl font-semibold text-[#003366]">Assumptions</h2>
                </div>
                <ChevronDown className="w-5 h-5 text-[#003366]/40 transition-transform group-open:rotate-180" />
              </summary>
              <div className="pt-6 grid md:grid-cols-2 gap-4">
                <AssumptionCard title="Context">
                  <p>Cohort size: {fmtNumber(cohortSize)}</p>
                  <p>Program type: {programType}</p>
                  <p>Advisor hourly cost: {fmtCurrency(context.avgAdvisorHourlyCost ?? 60)}</p>
                </AssumptionCard>
                <AssumptionCard title="Prep Cost Inputs">
                  <p>Mocks per learner: {assumptions.prepCost?.mocksPerLearner ?? "—"}</p>
                  <p>Cost per session: {fmtCurrency(assumptions.prepCost?.costPerSession ?? 0)}</p>
                  <p>Admin overhead: {assumptions.prepCost?.adminOverheadMinutesPerSession ?? "—"} min/session</p>
                  <p>Remediation rate: {fmtPct(assumptions.prepCost?.remediationRatePct ?? 0)}</p>
                  <p>Extra coaching hrs: {assumptions.prepCost?.extraCoachingHoursPerRemediationLearner ?? "—"}</p>
                </AssumptionCard>
                <AssumptionCard title="Change Assumptions">
                  <p>Automation rate: {fmtPct(assumptions.change?.automationRatePct ?? 0)}</p>
                  <p>Remediation reduction: {fmtPct(assumptions.change?.reductionInRemediationRatePct ?? 0)}</p>
                  <p>Placement lift factor: {assumptions.change?.placementLiftConversionFactor ?? "—"}</p>
                </AssumptionCard>
                <AssumptionCard title="Investment">
                  <p>Annual investment: {fmtCurrency(assumptions.investment?.annualChangeInvestment ?? 0)}</p>
                </AssumptionCard>
              </div>
            </details>
          </section>

          {/* CTA */}
          <section className="bg-gradient-to-br from-[#003366] to-[#004080] rounded-3xl p-8 md:p-10 text-center relative overflow-hidden">
            <div className="absolute inset-0 overflow-hidden">
              <div className="absolute -top-20 -right-20 w-64 h-64 rounded-full bg-[#ff686c]/20 blur-3xl" />
              <div className="absolute -bottom-20 -left-20 w-64 h-64 rounded-full bg-sky-500/20 blur-3xl" />
            </div>
            <div className="relative">
              <h3 className="text-2xl font-semibold text-white mb-3">Ready to free up your team?</h3>
              <p className="text-white/60 mb-6 max-w-md mx-auto">
                Schedule a walkthrough to validate these projections with your specific program data.
              </p>
              <a
                href="/book-demo"
                className="inline-flex items-center gap-2 px-8 py-4 rounded-full bg-[#ff686c] text-white font-semibold hover:bg-[#ff686c]/90 transition-all shadow-lg shadow-[#ff686c]/25"
              >
                Schedule Walkthrough <ArrowRight className="w-5 h-5" />
              </a>
            </div>
          </section>

          {/* Footer */}
          <footer className="pt-6 border-t border-[#003366]/10 flex items-center justify-between text-sm">
            <a href="/hidden-gap" className="text-[#003366]/60 hover:text-[#003366] transition-colors">
              &larr; Back to Calculator
            </a>
            <p className="text-[#003366]/40 text-xs">Report generated {fmtDateTime(run.created_at)}</p>
          </footer>
        </div>
      </div>
    </main>
  );
}

/* =================================================================
 * V2 Challenger Report (backward compat for stored v2 reports)
 * ================================================================= */
function V2Report({ run }: { run: any }) {
  const { result, request } = run;
  const summary = result.summary ?? {};
  const sensitivity = result.sensitivity ?? {};
  const baselineSignals = result.baselineSignals ?? {};
  const assumptions = result.assumptions ?? {};
  const context = request?.context ?? {};
  const narrative = run.narrative;

  const cohortSize = Number(context.cohortSize ?? 0);
  const programType = context.programType ?? "Institution";

  return (
    <main className="min-h-screen">
      {/* ── Hero ── */}
      <section className="relative bg-gradient-to-br from-[#003366] via-[#004080] to-[#002244] pt-12 pb-20 overflow-hidden">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-96 h-96 rounded-full bg-[#ff686c]/10 blur-3xl" />
          <div className="absolute -bottom-40 -left-40 w-96 h-96 rounded-full bg-sky-500/10 blur-3xl" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full bg-white/[0.02]" />
        </div>

        <div className="relative max-w-4xl mx-auto px-6">
          {/* Header badges */}
          <div className="flex flex-wrap items-center gap-3 mb-8">
            <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 backdrop-blur border border-white/10 text-white/80 text-xs font-semibold uppercase tracking-wider">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
              Readiness Debt Analysis
            </span>
            <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 backdrop-blur border border-white/10 text-white/80 text-xs font-semibold">
              {programType} &bull; {fmtNumber(cohortSize)} learners
            </span>
          </div>

          {/* Cost of doing nothing — hero number */}
          <div className="text-center mb-12">
            <p className="text-amber-400 font-semibold text-sm uppercase tracking-wider mb-4">
              Annual cost of doing nothing
            </p>
            <h1 className="text-5xl md:text-7xl font-bold text-white mb-4 tracking-tight">
              {fmtCurrency(summary.costOfDoingNothing ?? 0)}
            </h1>
            <p className="text-white/60 text-lg">leaking each year through rework, failed interviews, and employer pullback</p>
          </div>

          {/* Key metrics row */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <MetricCard
              icon={<DollarSign className="w-5 h-5 text-emerald-400" />}
              iconBg="bg-emerald-500/20"
              value={fmtCurrency(summary.valueRecovered ?? 0)}
              label="Value Recovered"
            />
            <MetricCard
              icon={<Clock className="w-5 h-5 text-sky-400" />}
              iconBg="bg-sky-500/20"
              value={summary.paybackMonths != null ? `${summary.paybackMonths.toFixed(1)} mo` : "—"}
              label="Payback Period"
            />
            <MetricCard
              icon={<TrendingUp className="w-5 h-5 text-amber-400" />}
              iconBg="bg-amber-500/20"
              value={summary.roiPct != null ? `${summary.roiPct.toFixed(0)}%` : "—"}
              label="Annual ROI"
            />
            <MetricCard
              icon={<Users className="w-5 h-5 text-[#ff686c]" />}
              iconBg="bg-[#ff686c]/20"
              value={fmtNumber(baselineSignals.unreadyInterviewsPerYear ?? 0)}
              label="Unready Interviews / yr"
            />
          </div>

          {/* Scroll indicator */}
          <div className="flex justify-center mt-12">
            <div className="flex flex-col items-center text-white/40 animate-bounce">
              <p className="text-xs mb-2">View Full Analysis</p>
              <ChevronDown className="w-5 h-5" />
            </div>
          </div>
        </div>
      </section>

      {/* ── Content ── */}
      <div className="bg-gradient-to-b from-[#f8fafc] to-white">
        <div className="max-w-4xl mx-auto px-6 py-16 space-y-12">
          {/* Section 1: Where the leak comes from */}
          <section>
            <SectionHeader number="1" title="Where the Readiness Debt Comes From" accent="rose" />
            <div className="grid md:grid-cols-3 gap-4">
              <TaxCard
                icon={<RefreshCw className="w-5 h-5 text-[#ff686c]" />}
                title="Rework Loop Tax"
                cost={summary.reworkCost ?? 0}
                recoverable={summary.reworkSaved ?? 0}
                description="Remediation coaching that repeats because learners weren't ready the first time."
              />
              <TaxCard
                icon={<Target className="w-5 h-5 text-[#ff686c]" />}
                title="Outcome Leakage"
                cost={summary.outcomeLeak ?? 0}
                recoverable={summary.outcomeRecovered ?? 0}
                description="Interviews that fail to convert because candidates lacked verified readiness."
              />
              <TaxCard
                icon={<Shield className="w-5 h-5 text-[#ff686c]" />}
                title="Employer Confidence Tax"
                cost={summary.confidenceLeak ?? 0}
                recoverable={summary.confidenceRecovered ?? 0}
                description="Employer opportunity rationing — fewer slots offered when past cohorts underperform."
              />
            </div>
          </section>

          {/* Section 2: Value recovered */}
          <section>
            <SectionHeader number="2" title="What Verified Readiness Recovers" accent="emerald" />
            <div className="bg-gradient-to-br from-emerald-50 to-sky-50 rounded-2xl p-6 border border-emerald-100">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-emerald-600/70 mb-4">
                    Status Quo vs Improved
                  </p>
                  <div className="space-y-4">
                    {[
                      { label: "Cost of doing nothing", val: fmtCurrency(summary.costOfDoingNothing ?? 0), icon: AlertTriangle },
                      { label: "Value recovered", val: fmtCurrency(summary.valueRecovered ?? 0), icon: CheckCircle2 },
                      { label: "Net annual impact", val: fmtCurrency(summary.netAnnual ?? 0), icon: TrendingUp },
                    ].map((item, i) => (
                      <div key={i} className="flex items-center justify-between py-2 border-b border-emerald-100 last:border-0">
                        <div className="flex items-center gap-2">
                          <item.icon className="w-4 h-4 text-emerald-600" />
                          <span className="text-sm font-medium text-[#003366]">{item.label}</span>
                        </div>
                        <span className="font-semibold text-emerald-600">{item.val}</span>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="flex flex-col justify-center items-center text-center">
                  <p className="text-xs text-emerald-600/70 uppercase tracking-wider mb-2">Return on Investment</p>
                  <p className="text-5xl font-bold text-emerald-600">
                    {summary.roiPct != null ? `${summary.roiPct.toFixed(0)}%` : "N/A"}
                  </p>
                  <p className="text-sm text-emerald-600/60 mt-2">
                    {summary.paybackMonths != null
                      ? `Pays for itself in ${summary.paybackMonths.toFixed(1)} months`
                      : ""}
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Section 3: Range of Outcomes */}
          <section>
            <SectionHeader number="3" title="Range of Outcomes" accent="navy" />
            <p className="text-xs text-[#003366]/50 mb-4">How results shift depending on how fully your team adopts Clarivue.</p>
            <div className="bg-white rounded-2xl p-6 border border-[#003366]/10 shadow-sm">
              <div className="grid grid-cols-3 gap-4">
                <div className="text-center p-4 rounded-xl bg-[#003366]/5">
                  <p className="text-xs text-[#003366]/50 mb-2">If improvements are modest</p>
                  <p className="text-2xl font-bold text-[#003366]">
                    {fmtCurrency(sensitivity.low?.valueRecovered ?? 0)}
                  </p>
                  <p className="text-xs text-[#003366]/50 mt-2">value recovered / year</p>
                </div>
                <div className="text-center p-4 rounded-xl bg-emerald-50 border-2 border-emerald-200">
                  <p className="text-xs text-emerald-600 mb-2 font-semibold">Based on similar programs</p>
                  <p className="text-2xl font-bold text-emerald-600">
                    {fmtCurrency(sensitivity.expected?.valueRecovered ?? 0)}
                  </p>
                  <p className="text-xs text-emerald-600/70 mt-2">value recovered / year</p>
                </div>
                <div className="text-center p-4 rounded-xl bg-[#003366]/5">
                  <p className="text-xs text-[#003366]/50 mb-2">If your team fully adopts</p>
                  <p className="text-2xl font-bold text-[#003366]">
                    {fmtCurrency(sensitivity.high?.valueRecovered ?? 0)}
                  </p>
                  <p className="text-xs text-[#003366]/50 mt-2">value recovered / year</p>
                </div>
              </div>
            </div>
          </section>

          {/* Section 4: Narrative */}
          {narrative && (
            <section>
              <SectionHeader number="4" title="Executive Summary" accent="violet" />
              <div className="bg-gradient-to-br from-violet-50 to-indigo-50 rounded-2xl p-6 border border-violet-100">
                <div className="text-sm text-[#003366]/80 whitespace-pre-line leading-relaxed">
                  {narrative}
                </div>
              </div>
            </section>
          )}

          {/* Section 5: If nothing changes */}
          <section>
            <SectionHeader number={narrative ? "5" : "4"} title="If Nothing Changes" accent="slate" />
            <div className="bg-gradient-to-br from-slate-50 to-slate-100 rounded-2xl p-6 border border-slate-200">
              <div className="grid md:grid-cols-2 gap-4 mb-6">
                {[
                  `${fmtCurrency(summary.costOfDoingNothing ?? 0)} leaks annually — with no visible line item`,
                  `${fmtNumber(baselineSignals.unreadyInterviewsPerYear ?? 0)} unready interviews burn employer goodwill`,
                  "Remediation cycles repeat without systemic change",
                  "Employer opportunity rationing compounds over time",
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-3 text-sm text-[#003366]/70">
                    <div className="w-1.5 h-1.5 rounded-full bg-slate-400 flex-shrink-0" />
                    {item}
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Assumptions - Collapsible */}
          <section>
            <details className="group">
              <summary className="flex items-center justify-between cursor-pointer py-4 border-b border-[#003366]/10">
                <div className="flex items-center gap-3">
                  <span className="flex items-center justify-center w-8 h-8 rounded-full bg-[#003366]/5 text-[#003366]/60 text-sm font-bold">
                    {narrative ? "6" : "5"}
                  </span>
                  <h2 className="text-xl font-semibold text-[#003366]">Assumptions</h2>
                </div>
                <ChevronDown className="w-5 h-5 text-[#003366]/40 transition-transform group-open:rotate-180" />
              </summary>
              <div className="pt-6 grid md:grid-cols-2 gap-4">
                <AssumptionCard title="Context">
                  <p>Cohort size: {fmtNumber(cohortSize)}</p>
                  <p>Program type: {programType}</p>
                  <p>Advisor hourly cost: {fmtCurrency(context.avgAdvisorHourlyCost ?? 0)}</p>
                </AssumptionCard>
                <AssumptionCard title="Leak Inputs">
                  <p>Interviews per learner: {assumptions.leak?.employerInterviewsPerLearner ?? "—"}</p>
                  <p>Unready at interview: {fmtPct(assumptions.leak?.unreadyAtInterviewRatePct ?? 0)}</p>
                  <p>Remediation rate: {fmtPct(assumptions.leak?.remediationRatePct ?? 0)}</p>
                  <p>Extra coaching hrs: {assumptions.leak?.extraCoachingHoursPerRemediationLearner ?? "—"}</p>
                  <p>Employer rationing: {fmtPct(assumptions.leak?.employerOpportunityRationingPct ?? 0)}</p>
                </AssumptionCard>
                <AssumptionCard title="Change Assumptions">
                  <p>Unready rate reduction: {fmtPct(assumptions.change?.reductionInUnreadyRatePct ?? 0)}</p>
                  <p>Remediation reduction: {fmtPct(assumptions.change?.reductionInRemediationRatePct ?? 0)}</p>
                  <p>Opportunity recovery: {fmtPct(assumptions.change?.recoveryOfRationedOpportunityPct ?? 0)}</p>
                </AssumptionCard>
                <AssumptionCard title="Investment">
                  <p>Annual investment: {fmtCurrency(assumptions.investment?.annualChangeInvestment ?? 0)}</p>
                  <p>Revenue per placement: {fmtCurrency(assumptions.economics?.revenuePerPlacement ?? 0)}</p>
                  <p>Placement proxy: {fmtPct((baselineSignals.placementProxyUsed ?? 0) * 100)}</p>
                </AssumptionCard>
              </div>
            </details>
          </section>

          {/* CTA */}
          <section className="bg-gradient-to-br from-[#003366] to-[#004080] rounded-3xl p-8 md:p-10 text-center relative overflow-hidden">
            <div className="absolute inset-0 overflow-hidden">
              <div className="absolute -top-20 -right-20 w-64 h-64 rounded-full bg-[#ff686c]/20 blur-3xl" />
              <div className="absolute -bottom-20 -left-20 w-64 h-64 rounded-full bg-sky-500/20 blur-3xl" />
            </div>
            <div className="relative">
              <h3 className="text-2xl font-semibold text-white mb-3">Ready to close the readiness gap?</h3>
              <p className="text-white/60 mb-6 max-w-md mx-auto">
                Schedule a walkthrough to validate these projections with your specific program data.
              </p>
              <a
                href="/book-demo"
                className="inline-flex items-center gap-2 px-8 py-4 rounded-full bg-[#ff686c] text-white font-semibold hover:bg-[#ff686c]/90 transition-all shadow-lg shadow-[#ff686c]/25"
              >
                Schedule Walkthrough <ArrowRight className="w-5 h-5" />
              </a>
            </div>
          </section>

          {/* Footer */}
          <footer className="pt-6 border-t border-[#003366]/10 flex items-center justify-between text-sm">
            <a href="/hidden-gap" className="text-[#003366]/60 hover:text-[#003366] transition-colors">
              &larr; Back to Calculator
            </a>
            <p className="text-[#003366]/40 text-xs">Report generated {fmtDateTime(run.created_at)}</p>
          </footer>
        </div>
      </div>
    </main>
  );
}

/* =================================================================
 * V1 Legacy Report (backward compat)
 * ================================================================= */
function V1Report({ run }: { run: any }) {
  const { result, request } = run;
  const summary = result.summary ?? {};
  const baseline = result.baseline ?? {};
  const sensitivity = result.sensitivity ?? {};
  const assumptions = result.assumptions ?? {};
  const context = request?.context ?? {};

  const cohortSize = Number(context.cohortSize ?? 0);
  const readyDelta = Number(summary.addedReadyLearners ?? 0);
  const offersDelta = Number(summary.addedOffers ?? 0);
  const hardValueTotal = Number(summary.revenueImpact ?? 0) + Number(summary.costSavings ?? 0) - Number(summary.addedSessionsCost ?? 0);

  return (
    <main className="min-h-screen">
      {/* Hero */}
      <section className="relative bg-gradient-to-br from-[#003366] via-[#004080] to-[#002244] pt-12 pb-20 overflow-hidden">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-96 h-96 rounded-full bg-[#ff686c]/10 blur-3xl" />
          <div className="absolute -bottom-40 -left-40 w-96 h-96 rounded-full bg-sky-500/10 blur-3xl" />
        </div>
        <div className="relative max-w-4xl mx-auto px-6">
          <div className="flex flex-wrap items-center gap-3 mb-8">
            <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 backdrop-blur border border-white/10 text-white/80 text-xs font-semibold uppercase tracking-wider">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
              ROI Analysis
            </span>
            <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 backdrop-blur border border-white/10 text-white/80 text-xs font-semibold">
              {context.programType ?? "Institution"} &bull; {fmtNumber(cohortSize)} learners
            </span>
          </div>
          <div className="text-center mb-12">
            <p className="text-[#ff686c] font-semibold text-sm uppercase tracking-wider mb-4">Projected Annual Value</p>
            <h1 className="text-5xl md:text-7xl font-bold text-white mb-4 tracking-tight">
              {fmtCurrency(hardValueTotal)}
            </h1>
            <p className="text-white/60 text-lg">in recoverable value from closing the placement gap</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <MetricCard icon={<Users className="w-5 h-5 text-emerald-400" />} iconBg="bg-emerald-500/20" value={`+${fmtNumber(offersDelta)}`} label="Additional Offers" />
            <MetricCard icon={<TrendingUp className="w-5 h-5 text-sky-400" />} iconBg="bg-sky-500/20" value={`+${fmtNumber(readyDelta)}`} label="Ready Learners" />
            <MetricCard icon={<Clock className="w-5 h-5 text-amber-400" />} iconBg="bg-amber-500/20" value={fmtNumber(Math.round(Number(summary.advisorHoursSaved ?? 0)))} label="Hours Returned" />
            <MetricCard icon={<DollarSign className="w-5 h-5 text-[#ff686c]" />} iconBg="bg-[#ff686c]/20" value={fmtCurrency(summary.revenueImpact ?? 0)} label="Revenue Impact" />
          </div>
        </div>
      </section>

      {/* Content */}
      <div className="bg-gradient-to-b from-[#f8fafc] to-white">
        <div className="max-w-4xl mx-auto px-6 py-16 space-y-12">
          {/* Range of Outcomes */}
          <section>
            <SectionHeader number="1" title="Range of Outcomes" accent="navy" />
            <p className="text-xs text-[#003366]/50 mb-4">How results shift depending on how fully your team adopts Clarivue.</p>
            <div className="bg-white rounded-2xl p-6 border border-[#003366]/10 shadow-sm">
              <div className="grid grid-cols-3 gap-4">
                <div className="text-center p-4 rounded-xl bg-[#003366]/5">
                  <p className="text-xs text-[#003366]/50 mb-2">If improvements are modest</p>
                  <p className="text-2xl font-bold text-[#003366]">{fmtCurrency(sensitivity.low?.totalValueImpact ?? 0)}</p>
                </div>
                <div className="text-center p-4 rounded-xl bg-emerald-50 border-2 border-emerald-200">
                  <p className="text-xs text-emerald-600 mb-2 font-semibold">Based on similar programs</p>
                  <p className="text-2xl font-bold text-emerald-600">{fmtCurrency(sensitivity.expected?.totalValueImpact ?? 0)}</p>
                </div>
                <div className="text-center p-4 rounded-xl bg-[#003366]/5">
                  <p className="text-xs text-[#003366]/50 mb-2">If your team fully adopts</p>
                  <p className="text-2xl font-bold text-[#003366]">{fmtCurrency(sensitivity.high?.totalValueImpact ?? 0)}</p>
                </div>
              </div>
            </div>
          </section>

          {/* Narrative */}
          {run.narrative && (
            <section>
              <SectionHeader number="2" title="Executive Summary" accent="violet" />
              <div className="bg-gradient-to-br from-violet-50 to-indigo-50 rounded-2xl p-6 border border-violet-100">
                <div className="text-sm text-[#003366]/80 whitespace-pre-line leading-relaxed">{run.narrative}</div>
              </div>
            </section>
          )}

          {/* CTA */}
          <section className="bg-gradient-to-br from-[#003366] to-[#004080] rounded-3xl p-8 md:p-10 text-center relative overflow-hidden">
            <div className="absolute inset-0 overflow-hidden">
              <div className="absolute -top-20 -right-20 w-64 h-64 rounded-full bg-[#ff686c]/20 blur-3xl" />
            </div>
            <div className="relative">
              <h3 className="text-2xl font-semibold text-white mb-3">Ready to close the gap?</h3>
              <p className="text-white/60 mb-6 max-w-md mx-auto">Schedule a walkthrough to validate these projections.</p>
              <a
                href="/book-demo"
                className="inline-flex items-center gap-2 px-8 py-4 rounded-full bg-[#ff686c] text-white font-semibold hover:bg-[#ff686c]/90 transition-all shadow-lg shadow-[#ff686c]/25"
              >
                Schedule Walkthrough <ArrowRight className="w-5 h-5" />
              </a>
            </div>
          </section>

          <footer className="pt-6 border-t border-[#003366]/10 flex items-center justify-between text-sm">
            <a href="/hidden-gap" className="text-[#003366]/60 hover:text-[#003366] transition-colors">&larr; Back to Calculator</a>
            <p className="text-[#003366]/40 text-xs">Report generated {fmtDateTime(run.created_at)}</p>
          </footer>
        </div>
      </div>
    </main>
  );
}

/* =================================================================
 * Shared sub-components
 * ================================================================= */

function MetricCard({ icon, iconBg, value, label }: { icon: React.ReactNode; iconBg: string; value: string; label: string }) {
  return (
    <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-5 border border-white/10 text-center">
      <div className={`inline-flex items-center justify-center w-10 h-10 rounded-full ${iconBg} mb-3`}>
        {icon}
      </div>
      <p className="text-2xl md:text-3xl font-bold text-white">{value}</p>
      <p className="text-white/50 text-sm mt-1">{label}</p>
    </div>
  );
}

function SectionHeader({ number, title, accent }: { number: string; title: string; accent: string }) {
  const bgMap: Record<string, string> = {
    rose: "bg-[#ff686c]/10 text-[#ff686c]",
    emerald: "bg-emerald-500/10 text-emerald-600",
    navy: "bg-[#003366]/10 text-[#003366]",
    violet: "bg-violet-500/10 text-violet-600",
    slate: "bg-slate-200 text-slate-600",
  };
  const cls = bgMap[accent] ?? bgMap.navy;
  return (
    <div className="flex items-center gap-3 mb-6">
      <span className={`flex items-center justify-center w-8 h-8 rounded-full text-sm font-bold ${cls}`}>{number}</span>
      <h2 className="text-xl font-semibold text-[#003366]">{title}</h2>
    </div>
  );
}

function TaxCard({ icon, title, cost, recoverable, description }: { icon: React.ReactNode; title: string; cost: number; recoverable: number; description: string }) {
  return (
    <div className="bg-gradient-to-br from-[#ff686c]/5 to-rose-50 rounded-2xl p-5 border border-[#ff686c]/10">
      <div className="flex items-center gap-2 mb-3">
        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-[#ff686c]/10 flex items-center justify-center">
          {icon}
        </div>
        <p className="font-semibold text-[#003366] text-sm">{title}</p>
      </div>
      <p className="text-2xl font-bold text-[#003366] mb-1">{fmtCurrency(cost)}</p>
      <p className="text-xs text-[#003366]/60 mb-3">{description}</p>
      <div className="flex items-center gap-2 pt-3 border-t border-[#ff686c]/10">
        <CheckCircle2 className="w-4 h-4 text-emerald-500" />
        <span className="text-sm font-semibold text-emerald-600">
          {fmtCurrency(recoverable)} recoverable
        </span>
      </div>
    </div>
  );
}

function CostCard({ icon, title, cost, saved, description }: { icon: React.ReactNode; title: string; cost: number; saved: number; description: string }) {
  return (
    <div className="bg-gradient-to-br from-[#ff686c]/5 to-rose-50 rounded-2xl p-5 border border-[#ff686c]/10">
      <div className="flex items-center gap-2 mb-3">
        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-[#ff686c]/10 flex items-center justify-center">
          {icon}
        </div>
        <p className="font-semibold text-[#003366] text-sm">{title}</p>
      </div>
      <p className="text-2xl font-bold text-[#003366] mb-1">{fmtCurrency(cost)}</p>
      <p className="text-xs text-[#003366]/60 mb-3">{description}</p>
      <div className="flex items-center gap-2 pt-3 border-t border-[#ff686c]/10">
        <CheckCircle2 className="w-4 h-4 text-emerald-500" />
        <span className="text-sm font-semibold text-emerald-600">
          {fmtCurrency(saved)} recoverable
        </span>
      </div>
    </div>
  );
}

function AssumptionCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="bg-white rounded-xl p-4 border border-[#003366]/10">
      <p className="text-xs font-semibold uppercase tracking-wider text-[#003366]/40 mb-3">{title}</p>
      <div className="space-y-2 text-sm text-[#003366]/70">{children}</div>
    </div>
  );
}
