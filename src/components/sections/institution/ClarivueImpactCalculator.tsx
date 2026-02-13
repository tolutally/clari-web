"use client";

import { useState, useMemo, useCallback } from "react";
import { calculateRoi } from "@/lib/institution-roi/calculator";
import {
  suggestLeakDefaults,
  suggestChangeDefaults,
  suggestInvestment,
  suggestEconomics,
  suggestBaseline,
} from "@/lib/institution-roi/defaults";
import type {
  ProgramType,
  RoiRequest,
  RoiResult,
} from "@/lib/institution-roi/types";

/* ────────────────────────────────────────────────────
   Formatting helpers
   ──────────────────────────────────────────────────── */

const fmt$ = (v: number) =>
  v >= 1_000_000
    ? `$${(v / 1_000_000).toFixed(1)}M`
    : `$${Math.round(v).toLocaleString("en-US")}`;

const fmtPct = (v: number | null) =>
  v == null ? "—" : `${Math.round(v)}%`;

const fmtMonths = (v: number | null) =>
  v == null ? "—" : v < 1 ? "< 1 month" : `${Math.round(v)} months`;

/* ────────────────────────────────────────────────────
   Sub-components
   ──────────────────────────────────────────────────── */

function NumberField({
  label,
  value,
  onChange,
  prefix,
  suffix,
  tip,
  placeholder = "0",
}: {
  label: string;
  value: number;
  onChange: (v: number) => void;
  prefix?: string;
  suffix?: string;
  tip?: string;
  placeholder?: string;
}) {
  return (
    <div className="space-y-1">
      <label className="block text-xs font-semibold text-[#003366]/80">
        {label}
      </label>
      <div className="flex items-center gap-1">
        {prefix && (
          <span className="text-xs font-medium text-[#003366]/50 shrink-0">
            {prefix}
          </span>
        )}
        <input
          type="number"
          inputMode="numeric"
          min={0}
          value={value || ""}
          placeholder={placeholder}
          onChange={(e) => onChange(Math.max(0, Number(e.target.value) || 0))}
          className="w-full rounded border border-gray-300 bg-white px-2.5 py-1.5 text-sm text-[#003366] placeholder:text-gray-400 focus:border-[#003366] focus:outline-none focus:ring-1 focus:ring-[#003366]/20 transition-shadow"
        />
        {suffix && (
          <span className="text-xs font-medium text-[#003366]/50 shrink-0">
            {suffix}
          </span>
        )}
      </div>
      {tip && (
        <p className="text-[10px] leading-tight text-[#003366]/40 italic">{tip}</p>
      )}
    </div>
  );
}

function ProgramSelect({
  value,
  onChange,
}: {
  value: ProgramType;
  onChange: (v: ProgramType) => void;
}) {
  return (
    <div className="space-y-1">
      <label className="block text-xs font-semibold text-[#003366]/80">
        What type of program do you run?
      </label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value as ProgramType)}
        className="w-full rounded border border-gray-300 bg-white px-2.5 py-1.5 text-sm text-[#003366] focus:border-[#003366] focus:outline-none focus:ring-1 focus:ring-[#003366]/20 transition-shadow appearance-none cursor-pointer"
      >
        <option value="bootcamp">Bootcamp</option>
        <option value="university">University</option>
        <option value="workforce">Workforce</option>
        <option value="other">Other</option>
      </select>
      <p className="text-[10px] leading-tight text-[#003366]/40 italic">Helps us tailor industry benchmarks</p>
    </div>
  );
}

function ResultCard({
  label,
  value,
  accent,
}: {
  label: string;
  value: string;
  accent: string;
}) {
  return (
    <div className="rounded overflow-hidden shadow-sm border border-gray-100">
      <div className={`${accent} px-3 py-1.5`}>
        <span className="text-xs font-semibold text-white">{label}</span>
      </div>
      <div className="bg-white px-3 py-2.5">
        <span className="text-xl font-bold text-[#003366]">
          {value}
        </span>
      </div>
    </div>
  );
}

/* ────────────────────────────────────────────────────
   Main component
   ──────────────────────────────────────────────────── */

export default function ClarivueImpactCalculator() {
  /* ── User inputs ─────────────────────────────────── */
  const [learnersPerYear, setLearnersPerYear] = useState(0);
  const [programType, setProgramType] = useState<ProgramType>("bootcamp");
  const [interviewsPerLearner, setInterviewsPerLearner] = useState(0);
  const [learnersNeedingCoaching, setLearnersNeedingCoaching] = useState(0);
  const [annualPrepSpend, setAnnualPrepSpend] = useState(0);

  /* ── Lead capture ────────────────────────────────── */
  const [email, setEmail] = useState("");
  const [sending, setSending] = useState(false);
  const [sendError, setSendError] = useState("");

  /* ── Build the full RoiRequest (defaults fill the gaps) ── */
  const roiRequest = useMemo<RoiRequest | null>(() => {
    if (learnersPerYear <= 0 || interviewsPerLearner <= 0) return null;

    const leak = suggestLeakDefaults(programType);
    const change = suggestChangeDefaults(programType);
    const economics = suggestEconomics(programType);
    const baseline = suggestBaseline(programType);

    // Derive unready % from the coaching count the director entered
    const unreadyPct =
      learnersPerYear > 0
        ? Math.min(100, (learnersNeedingCoaching / learnersPerYear) * 100)
        : 0;

    return {
      context: {
        programType,
        cohortSize: learnersPerYear,
      },
      baseline,
      economics, // revenuePerPlacement auto-filled from program-type defaults
      leak: {
        ...leak,
        employerInterviewsPerLearner: interviewsPerLearner,
        unreadyAtInterviewRatePct: unreadyPct,
      },
      change,
      investment: {
        annualChangeInvestment: annualPrepSpend > 0
          ? annualPrepSpend
          : suggestInvestment(learnersPerYear, economics.revenuePerPlacement).annualChangeInvestment,
      },
    };
  }, [learnersPerYear, programType, interviewsPerLearner, learnersNeedingCoaching, annualPrepSpend]);

  /* ── Live calculation ────────────────────────────── */
  const result: RoiResult | null = useMemo(() => {
    if (!roiRequest) return null;
    try {
      return calculateRoi(roiRequest);
    } catch {
      return null;
    }
  }, [roiRequest]);

  const hasResult = result !== null;
  const s = result?.summary;

  /* ── "Get detailed report" handler ───────────────── */
  const handleGetReport = useCallback(async () => {
    if (!roiRequest || !result) return;
    const trimmed = email.trim().toLowerCase();
    if (!trimmed || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed)) {
      setSendError("Please enter a valid work email.");
      return;
    }

    setSending(true);
    setSendError("");

    try {
      // 1. Run the server-side calculation (generates narrative + stores)
      const calcRes = await fetch("/api/institutions/roi/calculate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(roiRequest),
      });
      if (!calcRes.ok) throw new Error("Calculation failed");
      const { runId } = await calcRes.json();

      // 2. Gate pass (captures email)
      await fetch("/api/institutions/roi/gate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ runId, email: trimmed }),
      });

      // 3. Open report
      window.open(`/institutions/roi/report/${runId}`, "_blank");
    } catch {
      setSendError("Something went wrong. Please try again.");
    } finally {
      setSending(false);
    }
  }, [roiRequest, result, email]);

  /* ── Render ──────────────────────────────────────── */
  return (
    <div className="space-y-6">
      {/* ── Inputs ────────────────────────────────────── */}
      <section className="space-y-3">
        <h2 className="text-sm font-semibold text-[#003366] uppercase tracking-wide">
          Your current setup
        </h2>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-x-4 gap-y-3">
          <NumberField
            label="Learners completing your program each year?"
            value={learnersPerYear}
            onChange={setLearnersPerYear}
            tip="Total across all cohorts"
          />
          <ProgramSelect value={programType} onChange={setProgramType} />
          <NumberField
            label="Mock interviews per learner on average?"
            value={interviewsPerLearner}
            onChange={setInterviewsPerLearner}
            tip="On average, before they land an offer"
          />
        </div>
        <div className="grid grid-cols-2 md:grid-cols-2 gap-x-4 gap-y-3 max-w-md mx-auto">
          <NumberField
            label="How many learners need extra coaching before interviews?"
            value={learnersNeedingCoaching}
            onChange={setLearnersNeedingCoaching}
            tip="Your best estimate — even a rough number works"
          />
          <NumberField
            label="Annual spend on interview prep?"
            value={annualPrepSpend}
            onChange={setAnnualPrepSpend}
            prefix="$"
            tip="Staff time, tools, mock interview costs"
          />
        </div>
      </section>

      {/* ── Results ──────────────────────────────────── */}
      <section className="space-y-2">
        <h2 className="text-sm font-semibold text-[#003366] uppercase tracking-wide">
          Calculate savings
        </h2>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <ResultCard
            label="Annual cost of doing nothing"
            value={hasResult ? fmt$(s!.costOfDoingNothing) : "$0"}
            accent="bg-[#ff686c]"
          />
          <ResultCard
            label="Value recovered annually"
            value={hasResult ? fmt$(s!.valueRecovered) : "$0"}
            accent="bg-emerald-500"
          />
          <ResultCard
            label="Payback period"
            value={hasResult ? fmtMonths(s!.paybackMonths) : "—"}
            accent="bg-blue-500"
          />
          <ResultCard
            label="Return on investment"
            value={hasResult ? fmtPct(s!.roiPct) : "—"}
            accent="bg-violet-500"
          />
        </div>
      </section>

      {/* ── Report CTA ──────────────────────────────── */}
      <section className="rounded-lg border border-gray-200 bg-white px-4 py-3 space-y-2">
        <p className="text-xs font-semibold text-[#003366]">
          Want the full breakdown? Get a detailed report — free.
        </p>

        <div className="flex gap-2">
          <input
            type="email"
            placeholder="Work email"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              setSendError("");
            }}
            className="flex-1 rounded border border-gray-300 bg-white px-2.5 py-1.5 text-sm text-[#003366] placeholder:text-gray-400 focus:border-[#003366] focus:outline-none focus:ring-1 focus:ring-[#003366]/20 transition-shadow"
          />
          <button
            onClick={handleGetReport}
            disabled={!hasResult || sending}
            className="rounded bg-[#003366] px-4 py-1.5 text-xs font-semibold text-white hover:bg-[#002244] disabled:opacity-40 disabled:cursor-not-allowed transition-colors whitespace-nowrap"
          >
            {sending ? "Generating…" : "Get detailed report"}
          </button>
        </div>

        {sendError && (
          <p className="text-xs text-red-600">{sendError}</p>
        )}
      </section>
    </div>
  );
}
