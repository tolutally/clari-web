import React from "react";
import { ArrowRight, TrendingUp, Users, Clock, DollarSign, AlertTriangle, CheckCircle2, ChevronDown } from "lucide-react";

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
const fmtDateTime = (iso?: string) => (iso ? new Date(iso).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) : "—");

async function fetchReport(runId: string) {
  const baseUrl = process.env.APP_BASE_URL 
    || (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "http://localhost:3000");
  const res = await fetch(`${baseUrl}/api/institutions/roi/report/${runId}`, { cache: "no-store" });
  if (!res.ok) return null;
  return res.json();
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
      <main className="min-h-screen bg-gradient-to-br from-[#003366] via-[#004080] to-[#003366]">
        <div className="max-w-3xl mx-auto px-6 py-20 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-white/10 mb-6">
            <AlertTriangle className="w-8 h-8 text-white/60" />
          </div>
          <h1 className="text-2xl font-semibold text-white mb-3">Report not found</h1>
          <p className="text-white/60 mb-8">This report may not exist or may not be ready.</p>
          <a href="/roicalculator" className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-white text-[#003366] font-semibold hover:bg-white/90 transition-all">
            Back to Calculator
          </a>
        </div>
      </main>
    );
  }

  if (!data.gatePassed) {
    return (
      <main className="min-h-screen bg-gradient-to-br from-[#003366] via-[#004080] to-[#003366]">
        <div className="max-w-3xl mx-auto px-6 py-20 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#ff686c]/20 text-[#ff686c] text-sm font-semibold mb-6">
            <span className="w-2 h-2 rounded-full bg-[#ff686c] animate-pulse" />
            Preview Mode
          </div>
          <h1 className="text-3xl font-semibold text-white mb-3">Unlock the full report</h1>
          <p className="text-white/60 mb-8">Submit your email in the calculator to view the complete analysis.</p>
          <a href="/roicalculator" className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#ff686c] text-white font-semibold hover:bg-[#ff686c]/90 transition-all">
            Complete Calculator <ArrowRight className="w-4 h-4" />
          </a>
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
  const hardValueTotal = summary.revenueImpact + summary.costSavings - summary.addedSessionsCost;

  return (
    <main className="min-h-screen">
      {/* Hero Section - Most Valuable Point First */}
      <section className="relative bg-gradient-to-br from-[#003366] via-[#004080] to-[#002244] pt-12 pb-20 overflow-hidden">
        {/* Background decoration */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-96 h-96 rounded-full bg-[#ff686c]/10 blur-3xl" />
          <div className="absolute -bottom-40 -left-40 w-96 h-96 rounded-full bg-sky-500/10 blur-3xl" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full bg-white/[0.02]" />
        </div>

        <div className="relative max-w-4xl mx-auto px-6">
          {/* Header badges */}
          <div className="flex flex-wrap items-center gap-3 mb-8">
            <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 backdrop-blur border border-white/10 text-white/80 text-xs font-semibold uppercase tracking-wider">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
              ROI Analysis
            </span>
            <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 backdrop-blur border border-white/10 text-white/80 text-xs font-semibold">
              {context.programType ?? "Institution"} • {fmtNumber(cohortSize)} learners
            </span>
          </div>

          {/* Main value proposition */}
          <div className="text-center mb-12">
            <p className="text-[#ff686c] font-semibold text-sm uppercase tracking-wider mb-4">Projected Annual Value</p>
            <h1 className="text-5xl md:text-7xl font-bold text-white mb-4 tracking-tight">
              {fmtCurrency(hardValueTotal)}
            </h1>
            <p className="text-white/60 text-lg">
              in recoverable value from closing the placement gap
            </p>
          </div>

          {/* Key metrics row */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-5 border border-white/10 text-center">
              <div className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-emerald-500/20 mb-3">
                <Users className="w-5 h-5 text-emerald-400" />
              </div>
              <p className="text-2xl md:text-3xl font-bold text-white">+{fmtNumber(offersDelta)}</p>
              <p className="text-white/50 text-sm mt-1">Additional Offers</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-5 border border-white/10 text-center">
              <div className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-sky-500/20 mb-3">
                <TrendingUp className="w-5 h-5 text-sky-400" />
              </div>
              <p className="text-2xl md:text-3xl font-bold text-white">+{fmtNumber(readyDelta)}</p>
              <p className="text-white/50 text-sm mt-1">Ready Learners</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-5 border border-white/10 text-center">
              <div className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-amber-500/20 mb-3">
                <Clock className="w-5 h-5 text-amber-400" />
              </div>
              <p className="text-2xl md:text-3xl font-bold text-white">{fmtNumber(Math.round(advisorHoursSavedCapped))}</p>
              <p className="text-white/50 text-sm mt-1">Hours Returned</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-5 border border-white/10 text-center">
              <div className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-[#ff686c]/20 mb-3">
                <DollarSign className="w-5 h-5 text-[#ff686c]" />
              </div>
              <p className="text-2xl md:text-3xl font-bold text-white">{fmtCurrency(summary.revenueImpact)}</p>
              <p className="text-white/50 text-sm mt-1">Revenue Impact</p>
            </div>
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

      {/* Content sections */}
      <div className="bg-gradient-to-b from-[#f8fafc] to-white">
        <div className="max-w-4xl mx-auto px-6 py-16 space-y-12">

          {/* The Gap - Emotional Impact */}
          <section className="relative">
            <div className="flex items-center gap-3 mb-6">
              <span className="flex items-center justify-center w-8 h-8 rounded-full bg-[#ff686c]/10 text-[#ff686c] text-sm font-bold">1</span>
              <h2 className="text-xl font-semibold text-[#003366]">The Gap You&apos;re Facing Today</h2>
            </div>
            <div className="bg-gradient-to-br from-[#ff686c]/5 to-rose-50 rounded-2xl p-6 border border-[#ff686c]/10">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-[#ff686c]/10 flex items-center justify-center mt-0.5">
                      <AlertTriangle className="w-4 h-4 text-[#ff686c]" />
                    </div>
                    <div>
                      <p className="font-semibold text-[#003366]">{fmtNumber(offerGap)} learners not converting</p>
                      <p className="text-sm text-[#003366]/60">{fmtPct(100 - offerRate)} of your cohort misses out on offers</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-[#ff686c]/10 flex items-center justify-center mt-0.5">
                      <AlertTriangle className="w-4 h-4 text-[#ff686c]" />
                    </div>
                    <div>
                      <p className="font-semibold text-[#003366]">{fmtNumber(readyGap)} not interview-ready</p>
                      <p className="text-sm text-[#003366]/60">{fmtPct(100 - readinessRate)} unprepared before employer contact</p>
                    </div>
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-[#ff686c]/10 flex items-center justify-center mt-0.5">
                      <Clock className="w-4 h-4 text-[#ff686c]" />
                    </div>
                    <div>
                      <p className="font-semibold text-[#003366]">{timeline.baselineTimeToOfferWeeks ?? "—"} weeks to offer</p>
                      <p className="text-sm text-[#003366]/60">Extended hiring cycles drain momentum</p>
                    </div>
                  </div>
                  {enrollmentAtRisk > 0 && (
                    <div className="flex items-start gap-3">
                      <div className="flex-shrink-0 w-8 h-8 rounded-full bg-[#ff686c]/10 flex items-center justify-center mt-0.5">
                        <DollarSign className="w-4 h-4 text-[#ff686c]" />
                      </div>
                      <div>
                        <p className="font-semibold text-[#003366]">{fmtCurrency(enrollmentAtRisk)} at risk</p>
                        <p className="text-sm text-[#003366]/60">Enrollment credibility tied to weak signals</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </section>

          {/* With Clarivue - The Transformation */}
          <section>
            <div className="flex items-center gap-3 mb-6">
              <span className="flex items-center justify-center w-8 h-8 rounded-full bg-emerald-500/10 text-emerald-600 text-sm font-bold">2</span>
              <h2 className="text-xl font-semibold text-[#003366]">Your Projected State With Clarivue</h2>
            </div>
            <div className="bg-gradient-to-br from-emerald-50 to-sky-50 rounded-2xl p-6 border border-emerald-100">
              <div className="space-y-4">
                {[
                  { label: "Ready learners", before: fmtNumber(baseline.readyLearners), after: fmtNumber(baseline.readyLearners + readyDelta), icon: Users },
                  { label: "Offers", before: fmtNumber(baseline.offers), after: fmtNumber(baseline.offers + offersDelta), icon: CheckCircle2 },
                  { label: "Practice throughput", before: fmtNumber(baseSessions), after: fmtNumber(afterSessions), icon: TrendingUp },
                  { label: "Time to offer", before: `${timeline.baselineTimeToOfferWeeks ?? "—"} wks`, after: `${timeline.newTimeToOfferWeeks ?? "—"} wks`, icon: Clock },
                ].map((item, i) => (
                  <div key={i} className="flex items-center justify-between py-3 border-b border-emerald-100 last:border-0">
                    <div className="flex items-center gap-3">
                      <item.icon className="w-5 h-5 text-emerald-600" />
                      <span className="font-medium text-[#003366]">{item.label}</span>
                    </div>
                    <div className="flex items-center gap-3 font-mono text-sm">
                      <span className="text-[#003366]/40">{item.before}</span>
                      <ArrowRight className="w-4 h-4 text-emerald-500" />
                      <span className="font-semibold text-emerald-600 bg-emerald-100 px-2 py-0.5 rounded">{item.after}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Value Breakdown */}
          <section>
            <div className="flex items-center gap-3 mb-6">
              <span className="flex items-center justify-center w-8 h-8 rounded-full bg-[#003366]/10 text-[#003366] text-sm font-bold">3</span>
              <h2 className="text-xl font-semibold text-[#003366]">Value Breakdown</h2>
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              {/* Hard Value */}
              <div className="bg-white rounded-2xl p-6 border border-[#003366]/10 shadow-sm">
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-2 h-2 rounded-full bg-[#003366]" />
                  <p className="text-xs font-semibold uppercase tracking-wider text-[#003366]/60">Hard Value (Included in ROI)</p>
                </div>
                <div className="space-y-3">
                  <div className="flex justify-between py-2 border-b border-[#003366]/5">
                    <span className="text-sm text-[#003366]/70">Placement revenue</span>
                    <span className="font-semibold text-[#003366]">{fmtCurrency(summary.revenueImpact)}</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-[#003366]/5">
                    <span className="text-sm text-[#003366]/70">Net delivery impact</span>
                    <span className="font-semibold text-[#003366]">{fmtCurrency(summary.costSavings - summary.addedSessionsCost)}</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-[#003366]/5">
                    <span className="text-sm text-[#003366]/70">Advisor hours returned</span>
                    <span className="font-semibold text-[#003366]">{fmtNumber(Math.round(advisorHoursSavedCapped))} hrs</span>
                  </div>
                  <div className="flex justify-between pt-3 mt-2 border-t-2 border-[#003366]/10">
                    <span className="font-semibold text-[#003366]">Total</span>
                    <span className="font-bold text-lg text-[#003366]">{fmtCurrency(hardValueTotal)}</span>
                  </div>
                </div>
              </div>

              {/* Strategic Upside */}
              <div className="bg-gradient-to-br from-[#003366]/5 to-sky-50 rounded-2xl p-6 border border-dashed border-[#003366]/20">
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-2 h-2 rounded-full bg-[#003366]/30" />
                  <p className="text-xs font-semibold uppercase tracking-wider text-[#003366]/40">Strategic Upside (Not in ROI)</p>
                </div>
                <div className="space-y-3">
                  <div className="flex justify-between py-2 border-b border-[#003366]/5">
                    <span className="text-sm text-[#003366]/50">Employer signal quality</span>
                    <span className="text-sm font-medium text-[#003366]/50">Improved</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-[#003366]/5">
                    <span className="text-sm text-[#003366]/50">Cohort credibility</span>
                    <span className="text-sm font-medium text-[#003366]/50">{enrollmentUplift > 0 ? fmtCurrency(enrollmentUplift) : "Improved"}</span>
                  </div>
                  <div className="flex justify-between py-2">
                    <span className="text-sm text-[#003366]/50">Operational resilience</span>
                    <span className="text-sm font-medium text-[#003366]/50">Increased</span>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Sensitivity */}
          <section>
            <div className="flex items-center gap-3 mb-6">
              <span className="flex items-center justify-center w-8 h-8 rounded-full bg-[#003366]/10 text-[#003366] text-sm font-bold">4</span>
              <h2 className="text-xl font-semibold text-[#003366]">Sensitivity Range</h2>
            </div>
            <div className="bg-white rounded-2xl p-6 border border-[#003366]/10 shadow-sm">
              <div className="grid grid-cols-3 gap-4">
                <div className="text-center p-4 rounded-xl bg-[#003366]/5">
                  <p className="text-xs text-[#003366]/50 mb-2 uppercase tracking-wider">Conservative</p>
                  <p className="text-2xl font-bold text-[#003366]">{fmtCurrency(sensitivity.low.totalValueImpact)}</p>
                  <p className="text-xs text-[#003366]/50 mt-2">{fmtNumber(sensitivity.low.addedOffers)} offers</p>
                </div>
                <div className="text-center p-4 rounded-xl bg-emerald-50 border-2 border-emerald-200">
                  <p className="text-xs text-emerald-600 mb-2 uppercase tracking-wider font-semibold">Expected</p>
                  <p className="text-2xl font-bold text-emerald-600">{fmtCurrency(sensitivity.expected.totalValueImpact)}</p>
                  <p className="text-xs text-emerald-600/70 mt-2">{fmtNumber(sensitivity.expected.addedOffers)} offers</p>
                </div>
                <div className="text-center p-4 rounded-xl bg-[#003366]/5">
                  <p className="text-xs text-[#003366]/50 mb-2 uppercase tracking-wider">Upside</p>
                  <p className="text-2xl font-bold text-[#003366]">{fmtCurrency(sensitivity.high.totalValueImpact)}</p>
                  <p className="text-xs text-[#003366]/50 mt-2">{fmtNumber(sensitivity.high.addedOffers)} offers</p>
                </div>
              </div>
            </div>
          </section>

          {/* If Nothing Changes */}
          <section>
            <div className="flex items-center gap-3 mb-6">
              <span className="flex items-center justify-center w-8 h-8 rounded-full bg-[#ff686c]/10 text-[#ff686c] text-sm font-bold">5</span>
              <h2 className="text-xl font-semibold text-[#003366]">If Nothing Changes</h2>
            </div>
            <div className="bg-gradient-to-br from-slate-50 to-slate-100 rounded-2xl p-6 border border-slate-200">
              <div className="grid md:grid-cols-2 gap-4 mb-6">
                {[
                  `${fmtNumber(readyGap)} learners remain unprepared per cohort`,
                  `${fmtNumber(offerGap)} potential offers continue to be missed`,
                  "Advisor time consumed by repetitive coaching",
                  "Employer confidence remains unverified",
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-3 text-sm text-[#003366]/70">
                    <div className="w-1.5 h-1.5 rounded-full bg-slate-400" />
                    {item}
                  </div>
                ))}
              </div>
              <div className="pt-4 border-t border-slate-200">
                <p className="text-sm text-[#003366]/60 text-center">
                  Most programs validate these gaps in a short walkthrough.
                </p>
              </div>
            </div>
          </section>

          {/* Assumptions - Collapsible */}
          <section>
            <details className="group">
              <summary className="flex items-center justify-between cursor-pointer py-4 border-b border-[#003366]/10">
                <div className="flex items-center gap-3">
                  <span className="flex items-center justify-center w-8 h-8 rounded-full bg-[#003366]/5 text-[#003366]/60 text-sm font-bold">6</span>
                  <h2 className="text-xl font-semibold text-[#003366]">Assumptions</h2>
                </div>
                <ChevronDown className="w-5 h-5 text-[#003366]/40 transition-transform group-open:rotate-180" />
              </summary>
              <div className="pt-6 grid md:grid-cols-2 gap-4">
                <div className="bg-white rounded-xl p-4 border border-[#003366]/10">
                  <p className="text-xs font-semibold uppercase tracking-wider text-[#003366]/40 mb-3">Context</p>
                  <div className="space-y-2 text-sm text-[#003366]/70">
                    <p>Cohort size: {fmtNumber(cohortSize)}</p>
                    <p>Program type: {context.programType ?? "—"}</p>
                    <p>Advisor hourly cost: {fmtCurrency(context.avgAdvisorHourlyCost ?? 0)}</p>
                  </div>
                </div>
                <div className="bg-white rounded-xl p-4 border border-[#003366]/10">
                  <p className="text-xs font-semibold uppercase tracking-wider text-[#003366]/40 mb-3">Baseline</p>
                  <div className="space-y-2 text-sm text-[#003366]/70">
                    <p>Readiness rate: {fmtPct(assumptions.baseline?.readinessRatePct ?? 0)}</p>
                    <p>Offer rate: {fmtPct(assumptions.baseline?.offerRatePct ?? 0)}</p>
                    <p>Time to offer: {assumptions.baseline?.avgTimeToOfferWeeks ?? "—"} weeks</p>
                  </div>
                </div>
                <div className="bg-white rounded-xl p-4 border border-[#003366]/10">
                  <p className="text-xs font-semibold uppercase tracking-wider text-[#003366]/40 mb-3">Uplift</p>
                  <div className="space-y-2 text-sm text-[#003366]/70">
                    <p>Readiness lift: {assumptions.uplift?.readinessUpliftPctPoints ?? "—"} pp</p>
                    <p>Offer lift: {assumptions.uplift?.offerRateUpliftPctPoints ?? "—"} pp</p>
                    <p>Advisor savings: {fmtPct(assumptions.uplift?.advisorTimeSavingsPct ?? 0)}</p>
                  </div>
                </div>
                <div className="bg-white rounded-xl p-4 border border-[#003366]/10">
                  <p className="text-xs font-semibold uppercase tracking-wider text-[#003366]/40 mb-3">Economics</p>
                  <div className="space-y-2 text-sm text-[#003366]/70">
                    <p>Revenue per placement: {fmtCurrency(assumptions.economics?.revenuePerPlacement ?? 0)}</p>
                    <p>Cost per session: {fmtCurrency(assumptions.economics?.costPerSession ?? 0)}</p>
                    <p>Tuition per learner: {fmtCurrency(assumptions.economics?.tuitionPerLearner ?? 0)}</p>
                  </div>
                </div>
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
              <h3 className="text-2xl font-semibold text-white mb-3">Ready to close the gap?</h3>
              <p className="text-white/60 mb-6 max-w-md mx-auto">
                Schedule a walkthrough to validate these projections with your specific program data.
              </p>
              <a 
                href="/roicalculator#institutions-contact" 
                className="inline-flex items-center gap-2 px-8 py-4 rounded-full bg-[#ff686c] text-white font-semibold hover:bg-[#ff686c]/90 transition-all shadow-lg shadow-[#ff686c]/25"
              >
                Schedule Walkthrough <ArrowRight className="w-5 h-5" />
              </a>
            </div>
          </section>

          {/* Footer */}
          <footer className="pt-6 border-t border-[#003366]/10 flex items-center justify-between text-sm">
            <a href="/roicalculator" className="text-[#003366]/60 hover:text-[#003366] transition-colors">
              ← Back to Calculator
            </a>
            <p className="text-[#003366]/40 text-xs">
              Report generated {fmtDateTime(run.created_at)}
            </p>
          </footer>
        </div>
      </div>
    </main>
  );
}
