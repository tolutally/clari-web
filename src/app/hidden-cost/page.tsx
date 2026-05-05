"use client";

import { useState } from "react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { calculateGapCost } from "@/lib/institution-roi/calculator";
import type { GapCalculatorRequest, GapCalculatorResult, ProgramType } from "@/lib/institution-roi/types";
import { Clock, DollarSign, Users, TrendingUp, AlertTriangle, ArrowRight, ChevronDown, Sparkles } from "lucide-react";

// ═══════════════════════════════════════════════════════════════════════════
// TYPES
// ═══════════════════════════════════════════════════════════════════════════

type FormData = {
  learnersPerYear: string;
  programType: ProgramType;
  advisorsCount: string;
  currentCaseload: string;
};

// ═══════════════════════════════════════════════════════════════════════════
// HELPERS
// ═══════════════════════════════════════════════════════════════════════════

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

function formatNumber(num: number): string {
  return new Intl.NumberFormat("en-US").format(num);
}

// ═══════════════════════════════════════════════════════════════════════════
// COMPONENTS
// ═══════════════════════════════════════════════════════════════════════════

function InputField({
  label,
  subLabel,
  value,
  onChange,
  type = "text",
  placeholder,
  prefix,
  suffix,
}: {
  label: string;
  subLabel?: string;
  value: string;
  onChange: (value: string) => void;
  type?: "text" | "number";
  placeholder?: string;
  prefix?: string;
  suffix?: string;
}) {
  return (
    <div className="space-y-2">
      <label className="block">
        <span className="text-sm font-semibold text-[#003366]">{label}</span>
        {subLabel && (
          <span className="block text-xs text-[#003366]/50 mt-0.5">{subLabel}</span>
        )}
      </label>
      <div className="relative">
        {prefix && (
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[#003366]/40 text-sm">
            {prefix}
          </span>
        )}
        <input
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className={`w-full rounded-xl border border-[#003366]/15 bg-white px-4 py-3 text-[#003366] placeholder:text-[#003366]/30 focus:outline-none focus:ring-2 focus:ring-[#ff686c]/30 focus:border-[#ff686c]/50 transition-all ${prefix ? "pl-8" : ""} ${suffix ? "pr-16" : ""}`}
        />
        {suffix && (
          <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[#003366]/40 text-sm">
            {suffix}
          </span>
        )}
      </div>
    </div>
  );
}

function SelectField({
  label,
  subLabel,
  value,
  onChange,
  options,
}: {
  label: string;
  subLabel?: string;
  value: string;
  onChange: (value: string) => void;
  options: { value: string; label: string }[];
}) {
  return (
    <div className="space-y-2">
      <label className="block">
        <span className="text-sm font-semibold text-[#003366]">{label}</span>
        {subLabel && (
          <span className="block text-xs text-[#003366]/50 mt-0.5">{subLabel}</span>
        )}
      </label>
      <div className="relative">
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          aria-label={label}
          className="w-full appearance-none rounded-xl border border-[#003366]/15 bg-white px-4 py-3 text-[#003366] focus:outline-none focus:ring-2 focus:ring-[#ff686c]/30 focus:border-[#ff686c]/50 transition-all pr-10"
        >
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
        <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#003366]/40 pointer-events-none" />
      </div>
    </div>
  );
}

function LossCard({
  icon,
  label,
  value,
  subValue,
  color,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  subValue?: string;
  color: "red" | "amber" | "slate";
}) {
  const colorClasses = {
    red: "from-red-50 to-red-100/50 border-red-200/60",
    amber: "from-amber-50 to-amber-100/50 border-amber-200/60",
    slate: "from-slate-50 to-slate-100/50 border-slate-200/60",
  };
  const iconClasses = {
    red: "bg-red-100 text-red-600",
    amber: "bg-amber-100 text-amber-600",
    slate: "bg-slate-100 text-slate-600",
  };

  return (
    <div className={`rounded-2xl border bg-gradient-to-br ${colorClasses[color]} p-5`}>
      <div className="flex items-start gap-3">
        <div className={`w-10 h-10 rounded-xl ${iconClasses[color]} flex items-center justify-center shrink-0`}>
          {icon}
        </div>
        <div>
          <p className="text-xs font-medium text-[#003366]/50 uppercase tracking-wider">{label}</p>
          <p className="text-2xl font-bold text-[#003366] mt-1">{value}</p>
          {subValue && (
            <p className="text-xs text-[#003366]/50 mt-1">{subValue}</p>
          )}
        </div>
      </div>
    </div>
  );
}

function PayoffCard({ placements, range }: { placements: number; range: { low: number; high: number } }) {
  return (
    <div className="rounded-2xl border border-emerald-200/60 bg-gradient-to-br from-emerald-50 to-emerald-100/50 p-6">
      <div className="flex items-center gap-2 mb-3">
        <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center">
          <TrendingUp className="w-5 h-5" />
        </div>
        <div>
          <p className="text-xs font-medium text-emerald-700/70 uppercase tracking-wider">With Clarivue</p>
        </div>
      </div>
      <p className="text-3xl font-bold text-emerald-700">
        +{placements} placements
      </p>
      <p className="text-sm text-emerald-600/70 mt-2">
        Range: {range.low}–{range.high} additional placements per year
      </p>
    </div>
  );
}

function ResultsPlaceholder() {
  const previewItems = [
    {
      icon: <DollarSign className="w-5 h-5" />,
      label: "Annual cost exposure",
      hint: "Dollars lost to workflow drag",
    },
    {
      icon: <Clock className="w-5 h-5" />,
      label: "Advisor time lost",
      hint: "Hours consumed by last-mile coordination",
    },
    {
      icon: <Users className="w-5 h-5" />,
      label: "Missed placements",
      hint: "Learners most likely to fall through the gap",
    },
  ];

  return (
    <div className="relative overflow-hidden rounded-[28px] border border-[#003366]/10 bg-[linear-gradient(135deg,rgba(0,51,102,0.03),rgba(255,104,108,0.09))] p-6 md:p-7 shadow-xl shadow-[#003366]/5">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,104,108,0.18),transparent_32%),radial-gradient(circle_at_bottom_left,rgba(0,51,102,0.08),transparent_42%)]" />
      <div className="relative">
        <div className="inline-flex items-center gap-2 rounded-full border border-white/70 bg-white/80 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-[#003366]/60 backdrop-blur-sm">
          <Sparkles className="w-3.5 h-3.5 text-[#ff686c]" />
          Live Results Panel
        </div>

        <h3 className="mt-4 text-2xl font-semibold leading-tight text-[#003366]">
          Your gap snapshot will appear here
        </h3>

        <p className="mt-2 max-w-md text-sm leading-relaxed text-[#003366]/55">
          Add your learner volume, staffing, and caseload. We will turn that into a
          clean estimate of lost hours, lost dollars, and recoverable placements.
        </p>

        <div className="mt-6 grid gap-3">
          {previewItems.map((item) => (
            <div
              key={item.label}
              className="rounded-2xl border border-white/80 bg-white/85 p-4 backdrop-blur-sm"
            >
              <div className="flex items-start gap-3">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#003366]/5 text-[#003366]">
                  {item.icon}
                </div>

                <div className="flex-1">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[#003366]/45">
                    {item.label}
                  </p>
                  <div className="mt-2 h-7 w-32 rounded-full bg-[#003366]/8 animate-pulse" />
                  <p className="mt-2 text-xs text-[#003366]/45">{item.hint}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-6 rounded-2xl border border-[#003366]/10 bg-[#003366] p-4 text-white">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-white/60">
                What You Unlock
              </p>
              <p className="mt-1 text-sm text-white/85">
                A cost summary, a loss breakdown, and projected placement lift.
              </p>
            </div>
            <ArrowRight className="h-5 w-5 shrink-0 text-[#ffb3b5]" />
          </div>
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// MAIN PAGE
// ═══════════════════════════════════════════════════════════════════════════

export default function PlacementGapCalculatorPage() {
  const [formData, setFormData] = useState<FormData>({
    learnersPerYear: "",
    programType: "workforce",
    advisorsCount: "",
    currentCaseload: "",
  });
  
  const [result, setResult] = useState<GapCalculatorResult | null>(null);
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Calculate on any change
  const handleCalculate = () => {
    const request: GapCalculatorRequest = {
      learnersPerYear: parseInt(formData.learnersPerYear) || 100,
      programType: formData.programType,
      advisorsCount: parseInt(formData.advisorsCount) || 5,
      currentCaseload: parseInt(formData.currentCaseload) || 40,
    };
    
    const calcResult = calculateGapCost(request);
    setResult(calcResult);
  };

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const canCalculate = 
    formData.learnersPerYear && 
    formData.advisorsCount && 
    formData.currentCaseload;

  const handleGetReport = async () => {
    if (!result || !email) return;
    setIsSubmitting(true);
    setError(null);
    
    try {
      const res = await fetch("/api/institutions/roi/calculate-gap", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ request: result.request, email }),
      });
      
      const data = await res.json();
      
      if (res.ok) {
        window.location.href = `/institutions/roi/report/${data.runId}`;
      } else {
        setError(data.error || "Failed to generate report. Please try again.");
      }
    } catch (err) {
      console.error("Failed to generate report:", err);
      setError("Network error. Please check your connection and try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <Header />
      
      <main className="min-h-screen bg-gradient-to-b from-[#f8fafe] via-white to-[#f5f8ff]">
        {/* ═══════════════════════════════════════════════
            HERO SECTION
           ═══════════════════════════════════════════════ */}
        <section className="max-w-4xl mx-auto px-6 pt-20 pb-12 text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-[#003366]/15 bg-white/80 backdrop-blur-sm px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.15em] text-[#003366]/70 mb-6">
            <span className="w-2 h-2 rounded-full bg-[#ff686c] animate-pulse" />
            The Hidden Cost
          </div>

          <h1 className="text-3xl md:text-4xl lg:text-5xl font-semibold text-[#003366] leading-tight mb-6">
            What is your {" "}
            <span className="text-[#ff686c]">placement workflow</span> silently costing you?
          </h1>

          <p className="text-base md:text-lg text-[#003366]/60 max-w-2xl mx-auto leading-relaxed">
            Most programs run their training-to-employment work on spreadsheets, memory, and good 
            intentions. Few have ever put a number on what that's costing. Answer 
            4 questions and see yours — in dollars, hours, and missed placements.
          </p>
        </section>

        {/* ═══════════════════════════════════════════════
            CALCULATOR SECTION
           ═══════════════════════════════════════════════ */}
        <section className="max-w-5xl mx-auto px-6 pb-20">
          <div className="grid lg:grid-cols-2 gap-8 items-start">
            {/* ─────────────────────────────────────────────
                LEFT: FORM
               ───────────────────────────────────────────── */}
            <div className="rounded-2xl border border-[#003366]/10 bg-white shadow-xl shadow-[#003366]/5 p-6 md:p-8">
              <div className="mb-6">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-[#003366]/5 flex items-center justify-center">
                    <Sparkles className="w-4 h-4 text-[#003366]" />
                  </div>
                  <h2 className="text-lg font-semibold text-[#003366]">Your program</h2>
                </div>
                <p className="mt-2 text-sm text-[#003366]/55">
                  Tell us four things. We&apos;ll do the math.
                </p>
              </div>

              <div className="space-y-5">
                <InputField
                  label="Learners per year"
                  subLabel="Total completing your program annually"
                  value={formData.learnersPerYear}
                  onChange={(v) => handleInputChange("learnersPerYear", v)}
                  type="number"
                  placeholder="e.g., 200"
                />

                <SelectField
                  label="Program type"
                  subLabel="Determines industry benchmarks"
                  value={formData.programType}
                  onChange={(v) => handleInputChange("programType", v as ProgramType)}
                  options={[
                    { value: "workforce", label: "Workforce Development" },
                    { value: "bootcamp", label: "Bootcamp / Skills Training" },
                    { value: "university", label: "University / College" },
                    { value: "other", label: "Other" },
                  ]}
                />

                <InputField
                  label="Advisors / staff"
                  subLabel="People who do placement-related work for your learners"
                  value={formData.advisorsCount}
                  onChange={(v) => handleInputChange("advisorsCount", v)}
                  type="number"
                  placeholder="e.g., 5"
                />

                <InputField
                  label="Current caseload"
                  subLabel="Learners per advisor"
                  value={formData.currentCaseload}
                  onChange={(v) => handleInputChange("currentCaseload", v)}
                  type="number"
                  placeholder="e.g., 40"
                  suffix="per advisor"
                />
              </div>

              <button
                onClick={handleCalculate}
                disabled={!canCalculate}
                className={`w-full mt-8 flex items-center justify-center gap-2 rounded-xl px-6 py-4 text-base font-semibold transition-all ${
                  canCalculate
                    ? "bg-[#ff686c] text-white hover:bg-[#e55d61] shadow-lg shadow-[#ff686c]/25 hover:shadow-xl hover:shadow-[#ff686c]/30"
                    : "bg-[#003366]/10 text-[#003366]/40 cursor-not-allowed"
                }`}
              >
                Calculate my gap cost
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

            {/* ─────────────────────────────────────────────
                RIGHT: RESULTS
               ───────────────────────────────────────────── */}
            <div className="space-y-6">
              {!result ? (
                <ResultsPlaceholder />
              ) : (
                <>
                  {/* Hero: Aggregate Gap Cost */}
                  <div className="rounded-2xl border border-[#ff686c]/30 bg-gradient-to-br from-[#ff686c]/5 to-[#ff686c]/10 p-6">
                    <p className="text-xs font-semibold text-[#ff686c] uppercase tracking-wider mb-2">
                      Your training-to-employment gap costs
                    </p>
                    <p className="text-4xl md:text-5xl font-bold text-[#003366]">
                      {formatCurrency(result.summary.aggregateGapCost)}
                      <span className="text-xl font-normal text-[#003366]/50">/year</span>
                    </p>
                    <p className="text-sm text-[#003366]/50 mt-2">
                      Based on {formatNumber(result.request.learnersPerYear)} learners with {result.request.advisorsCount} advisors
                    </p>
                  </div>

                  {/* 3 Loss Cards */}
                  <div className="grid gap-4">
                    <LossCard
                      icon={<Clock className="w-5 h-5" />}
                      label="Time Lost"
                      value={formatNumber(Math.round(result.summary.losses.timeLost.hours)) + " hours"}
                      subValue="Advisor hours spent on last-mile tasks"
                      color="slate"
                    />
                    <LossCard
                      icon={<DollarSign className="w-5 h-5" />}
                      label="Money Lost"
                      value={formatCurrency(result.summary.losses.moneyLost.amount)}
                      subValue={`At ${formatCurrency(result.summary.losses.moneyLost.hourlyRate)}/hour`}
                      color="amber"
                    />
                    <LossCard
                      icon={<Users className="w-5 h-5" />}
                      label="People Lost"
                      value={result.summary.losses.peopleLost.count + " learners"}
                      subValue={`${Math.round(result.summary.losses.peopleLost.effectiveDropOffRate * 100)}% don't place due to the gap`}
                      color="red"
                    />
                  </div>

                  {/* Payoff: Clarivue Impact */}
                  <PayoffCard
                    placements={result.summary.additionalPlacements}
                    range={{
                      low: result.sensitivity.conservative.additionalPlacements,
                      high: result.sensitivity.optimistic.additionalPlacements,
                    }}
                  />
                </>
              )}
            </div>
          </div>

          {/* Report CTA - Full Width */}
          {result && (
            <div className="mt-8 rounded-2xl border border-[#003366]/10 bg-white p-6 md:p-8">
              <div className="max-w-xl mx-auto text-center">
                <h3 className="text-lg font-semibold text-[#003366] mb-2">
                  Want the full breakdown?
                </h3>
                <p className="text-sm text-[#003366]/50 mb-5">
                  Get a detailed report with cost breakdowns by activity, sensitivity analysis, and recommendations.
                </p>
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      setError(null);
                    }}
                    placeholder="your@email.com"
                    className={`flex-1 max-w-sm rounded-xl border px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#ff686c]/30 ${
                      error ? "border-red-300" : "border-[#003366]/15"
                    }`}
                  />
                  <button
                    onClick={handleGetReport}
                    disabled={!email || isSubmitting}
                    className="rounded-xl bg-[#003366] text-white px-6 py-3 text-sm font-semibold hover:bg-[#00264d] transition-colors disabled:opacity-50"
                  >
                    {isSubmitting ? "..." : "Get report"}
                  </button>
                </div>
                {error && (
                  <p className="text-xs text-red-500 mt-3">{error}</p>
                )}
              </div>
            </div>
          )}

          {/* ═══════════════════════════════════════════════
              HOW IT WORKS — Challenger-style breakdown (always visible)
             ═══════════════════════════════════════════════ */}
          <div className="mt-12">
            <div className="text-center mb-8">
              <p className="text-xs font-semibold text-[#003366]/50 uppercase tracking-wider mb-2">
                The math behind the number
              </p>
              <h3 className="text-xl md:text-2xl font-semibold text-[#003366]">
                These four costs are running in every program right now. Most don&apos;t measure them.
              </h3>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Card 1: Time */}
              <div className="rounded-xl border border-[#003366]/10 bg-white p-5">
                <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center mb-3">
                  <Clock className="w-4 h-4 text-slate-600" />
                </div>
                <p className="text-sm font-semibold text-[#003366] mb-1">Time the engine handles</p>
                <p className="text-xs text-[#003366]/50 leading-relaxed">
                  Each learner needs <span className="font-medium text-[#003366]/70">6–11 hours</span> of 
                  resume reviews, mock interviews, and follow-ups. The engine runs all of it in the background, 
                  freeing advisors to spend time on the people who need them.
                </p>
              </div>

              {/* Card 2: Money */}
              <div className="rounded-xl border border-[#003366]/10 bg-white p-5">
                <div className="w-8 h-8 rounded-lg bg-amber-100 flex items-center justify-center mb-3">
                  <DollarSign className="w-4 h-4 text-amber-600" />
                </div>
                <p className="text-sm font-semibold text-[#003366] mb-1">Money the operations should generate</p>
                <p className="text-xs text-[#003366]/50 leading-relaxed">
                  Loaded advisor cost runs <span className="font-medium text-[#003366]/70">$45–$55/hour</span>. 
                  Hours spent on routine admin compound across cohorts. The engine recovers those hours so they go 
                  toward placements, not paperwork.
                </p>
              </div>

              {/* Card 3: People */}
              <div className="rounded-xl border border-[#003366]/10 bg-white p-5">
                <div className="w-8 h-8 rounded-lg bg-red-100 flex items-center justify-center mb-3">
                  <Users className="w-4 h-4 text-red-600" />
                </div>
                <p className="text-sm font-semibold text-[#003366] mb-1">Placements you should be making</p>
                <p className="text-xs text-[#003366]/50 leading-relaxed">
                  <span className="font-medium text-[#003366]/70">8–18%</span> of learners don&apos;t place because of the 
                  operations gap, not because of skills. Overloaded caseloads push that further 
                  (up to <span className="font-medium text-[#003366]/70">1.6×</span>). The engine catches the operational 
                  drop-offs before employers do.
                </p>
              </div>

              {/* Card 4: Recovery */}
              <div className="rounded-xl border border-emerald-200 bg-gradient-to-br from-emerald-50 to-white p-5">
                <div className="w-8 h-8 rounded-lg bg-emerald-100 flex items-center justify-center mb-3">
                  <TrendingUp className="w-4 h-4 text-emerald-600" />
                </div>
                <p className="text-sm font-semibold text-emerald-700 mb-1">What you can recover</p>
                <p className="text-xs text-emerald-600/70 leading-relaxed">
                  About <span className="font-medium text-emerald-700">65%</span> of lost placements come back when the 
                  operations gap closes. That&apos;s what the engine recovers, and what your funder will notice next quarter.
                </p>
              </div>
            </div>

            {/* Challenger insight pill */}
            <div className="mt-6 text-center">
              <div className="inline-flex items-center gap-2 rounded-full bg-[#003366]/5 px-4 py-2">
                <AlertTriangle className="w-3.5 h-3.5 text-[#ff686c]" />
                <p className="text-xs text-[#003366]/70">
                  The operational drag isn&apos;t a budget problem. It&apos;s a structure problem. Fix the structure, fix the outcome.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ═══════════════════════════════════════════════
            CHALLENGER INSIGHT SECTION
           ═══════════════════════════════════════════════ */}
        <section className="bg-[#003366] py-16">
          <div className="max-w-4xl mx-auto px-6 text-center">
            <h2 className="text-2xl md:text-3xl font-semibold text-white mb-4">
              Once you have your number, you have a decision.
            </h2>
            <p className="text-lg text-white/70 max-w-2xl mx-auto mb-8 leading-relaxed">
              Most programs sit on the number for a quarter before they act. The cohort you&apos;re running 
              right now will cost you what this calculator says it costs you unless the operations change.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <a
                href="/book-demo"
                className="inline-flex items-center gap-2 rounded-full bg-[#ff686c] text-white px-8 py-3.5 text-base font-semibold hover:bg-[#e55d61] transition-colors shadow-lg shadow-[#ff686c]/30"
              >
                Book a demo
                <ArrowRight className="w-4 h-4" />
              </a>
              <a
                href="/#institutions-features"
                className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/5 text-white px-8 py-3.5 text-base font-semibold hover:bg-white/10 transition-colors"
              >
                Or read how the engine works
                <ArrowRight className="w-4 h-4" />
              </a>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
