"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { calculateRoi } from "@/lib/institution-roi/calculator";

type FundingModel = "Gov-funded" | "Tuition-based" | "Employer-sponsored" | "Mixed";
type AdvisorInvolvement = "Low" | "Medium" | "High";

type SliderOption = {
  label: string;
  value: number;
};

function clamp(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, n));
}

function formatInt(n: number) {
  return new Intl.NumberFormat(undefined, { maximumFractionDigits: 0 }).format(n);
}

function classNames(...xs: Array<string | boolean | undefined | null>) {
  return xs.filter(Boolean).join(" ");
}

/**
 * Clarivue "Cost of the Gap" Calculator (UI-only)
 * Flow:
 *  Step 1: slider — learners/year
 *  Step 2: select — funding model
 *  Step 3: select — advisor involvement
 *  Step 4: slider — current placement rate
 *  CTA: "See cost of the gap" -> shows a BEFORE/AFTER toggle with 2 preview numbers
 *
 * NOTE: All math is conservative placeholders. Replace with backend model later.
 */
type Step = 1 | 2 | 3 | 4 | 5;

type RoiResult = {
  summary: {
    totalValueImpact: number;
    revenueImpact: number;
    costSavings: number;
    advisorHoursSaved: number;
    addedReadyLearners: number;
    addedOffers: number;
    newTimeToOfferWeeks: number | null;
  };
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
    low: RoiResult["summary"];
    expected: RoiResult["summary"];
    high: RoiResult["summary"];
  };
  assumptions: any;
};

export default function ClarivueImpactCalculator() {
  // ---------- Step state ----------
  const [step, setStep] = useState<Step>(1);

  // ---------- Inputs ----------
  const [learnersPerYear, setLearnersPerYear] = useState<number>(100);
  const [fundingModel, setFundingModel] = useState<FundingModel>("Mixed");
  const [advisorInvolvement, setAdvisorInvolvement] = useState<AdvisorInvolvement>("Medium");
  const [placementRate, setPlacementRate] = useState<number>(60);
  const [tuitionPerLearner, setTuitionPerLearner] = useState<number>(12000);
  const [revenuePerPlacement, setRevenuePerPlacement] = useState<number>(9500);
  const [advisorHourlyCost, setAdvisorHourlyCost] = useState<number>(60);
  const [advisorTimeSavingsPct, setAdvisorTimeSavingsPct] = useState<number>(35);
  const [readinessUpliftPctPoints, setReadinessUpliftPctPoints] = useState<number>(10);
  const [offerUpliftPctPoints, setOfferUpliftPctPoints] = useState<number>(6);
  const [timeToOfferImprovementWeeks, setTimeToOfferImprovementWeeks] = useState<number>(2);
  const [enrollmentCredibilityUpliftPct, setEnrollmentCredibilityUpliftPct] = useState<number>(12);

  // ---------- Results UI ----------
  const [showResults, setShowResults] = useState(false);
  const [view, setView] = useState<"before" | "after">("before");
  const [isCalculating, setIsCalculating] = useState(false);

  // ---------- Lead capture states ----------
  const [email, setEmail] = useState("");
  const [sending, setSending] = useState(false);
  const [sendError, setSendError] = useState<string | null>(null);
  const [sendSuccess, setSendSuccess] = useState<string | null>(null);
  const [roiResult, setRoiResult] = useState<RoiResult | null>(null);
  const [roiNarrative, setRoiNarrative] = useState<string | null>(null);
  const [calcError, setCalcError] = useState<string | null>(null);

  // ---------- Slider definitions ----------
  const learnersOptions = useMemo<SliderOption[]>(
    () => [
      { label: "25", value: 25 },
      { label: "50", value: 50 },
      { label: "100", value: 100 },
      { label: "250", value: 250 },
      { label: "500", value: 500 },
      { label: "1000+", value: 1000 },
    ],
    [],
  );

  const placementOptions = useMemo<SliderOption[]>(
    () => [
      { label: "30%", value: 30 },
      { label: "45%", value: 45 },
      { label: "60%", value: 60 },
      { label: "75%", value: 75 },
      { label: "90%", value: 90 },
      { label: "95%", value: 95 },
    ],
    [],
  );

  // ---------- Stepper ----------
  const steps: Step[] = [1, 2, 3, 4, 5];

  function goNext() {
    setStep((s) => (s < 5 ? ((s + 1) as Step) : s));
    setShowResults(false);
  }

  function goBack() {
    setStep((s) => (s > 1 ? ((s - 1) as Step) : s));
    setShowResults(false);
  }

  // ---------- Step titles (match voice) ----------
  const stepMeta = useMemo(() => {
    if (step === 1)
      return {
        title: "How many learners do you support each year?",
        sub: "Set your program scale.",
      };
    if (step === 2)
      return {
        title: "How is your program funded?",
        sub: "This helps frame what “outcomes” mean for you.",
      };
    if (step === 3)
      return {
        title: "How hands-on is interview coaching today?",
        sub: "This helps estimate the support load on your team.",
      };
    if (step === 4)
      return {
        title: "What’s your current placement reality?",
        sub: "We’ll use this as your baseline.",
      };
    return {
      title: "Tuition per learner (lifetime of course)",
      sub: "We’ll estimate revenue at risk and potential upside from stronger placement credibility.",
    };
  }, [step]);

  // ---------- Actions ----------
  function handleSeeGap() {
    setIsCalculating(true);
    setCalcError(null);
    setRoiResult(null);
    setRoiNarrative(null);
    setView("before");
    setShowResults(false);

    (async () => {
      try {
        const programType =
          fundingModel === "Gov-funded"
            ? "university"
            : fundingModel === "Tuition-based"
              ? "bootcamp"
              : fundingModel === "Employer-sponsored"
                ? "workforce"
                : "other";

        // Suggest defaults for uplift/economics
        const assistRes = await fetch("/api/institutions/roi/assist", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ mode: "suggest", request: { context: { programType } } }),
        }).then((r) => r.json());
        if (assistRes.error) throw new Error(assistRes.error);

        const uplift = {
          readinessUpliftPctPoints: readinessUpliftPctPoints || assistRes.uplift?.readinessUpliftPctPoints,
          offerRateUpliftPctPoints: offerUpliftPctPoints || assistRes.uplift?.offerRateUpliftPctPoints,
          advisorTimeSavingsPct: advisorTimeSavingsPct || assistRes.uplift?.advisorTimeSavingsPct,
          timeToOfferImprovementWeeks:
            timeToOfferImprovementWeeks || assistRes.uplift?.timeToOfferImprovementWeeks,
          mockInterviewUpliftPct: assistRes.uplift?.mockInterviewUpliftPct,
          retentionImprovementPct: assistRes.uplift?.retentionImprovementPct,
        };

        const economics = {
          revenuePerPlacement,
          tuitionPerLearner,
          enrollmentCredibilityUpliftPct,
          costPerSession: assistRes.economics?.costPerSession,
          fundingPerOutcome: assistRes.economics?.fundingPerOutcome,
        };

        const roiRequest = {
          context: {
            programType,
            cohortSize: learnersPerYear,
            avgAdvisorHourlyCost: advisorHourlyCost,
          },
          baseline: {
            readinessRatePct: Math.min(95, placementRate + 10),
            offerRatePct: placementRate,
            avgTimeToOfferWeeks: assistRes.baseline?.avgTimeToOfferWeeks,
            mockInterviewsPerLearner: assistRes.baseline?.mockInterviewsPerLearner,
          },
          uplift,
          economics,
        };

        // Use backend API to keep server/source of truth (still SSR-safe)
        const calcRes = await fetch("/api/institutions/roi/calculate", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(roiRequest),
        }).then((r) => r.json());
        if (calcRes.error) throw new Error(calcRes.error);

        setRoiResult(calcRes as RoiResult);

        const narrativeRes = await fetch("/api/institutions/roi/assist", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ mode: "narrative", request: roiRequest, result: calcRes }),
        }).then((r) => r.json());
        if (!narrativeRes.error && narrativeRes.narrative) {
          setRoiNarrative(narrativeRes.narrative);
        }

        setShowResults(true);
      } catch (err: any) {
        setCalcError(err?.message || "Could not calculate ROI. Please retry.");
      } finally {
        setIsCalculating(false);
      }
    })();
  }

  // ---------- UI ----------
  return (
    <section className="relative z-10 max-w-7xl mx-auto px-6 pb-8" data-component="clarivue-cost-of-gap">
      <div className="mx-auto max-w-3xl text-center">
        <h3 className="text-2xl md:text-3xl tracking-tight font-semibold text-[#003366]">
          See the cost of the placement gap
        </h3>
        <p className="mt-2 text-sm text-[#003366]/70">
          A quick, conservative estimate of what’s leaking today — and what gets recovered with Clarivue.
        </p>

        {/* Steps */}
        <div className="mt-6 flex items-center justify-center gap-3">
          {steps.map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => {
                setStep(s);
                setShowResults(false);
              }}
              className={classNames(
                "size-9 rounded-full flex items-center justify-center text-sm font-semibold transition-all duration-500 hover:scale-110",
                s === step
                  ? "bg-violet-400 text-white shadow-lg"
                  : s < step
                    ? "bg-black/5 text-black/70"
                    : "bg-black/10 text-black/60",
              )}
              aria-current={s === step ? "step" : undefined}
              aria-label={`Go to step ${s}`}
            >
              {String(s).padStart(2, "0")}
            </button>
          ))}
        </div>

        <div className="mt-8">
          <p className="text-base tracking-tight font-semibold text-[#003366]">{stepMeta.title}</p>
          <p className="text-xs mt-1 text-[#003366]/60">{stepMeta.sub}</p>

          {/* STEP PANELS */}
          <div className="mt-6 text-left">
            {step === 1 && (
              <div className="space-y-6">
                <StepSlider
                  id="learnersPerYear"
                  value={learnersPerYear}
                  options={learnersOptions}
                  badgeFormatter={(v) => (v >= 1000 ? "1000+" : String(v))}
                  icon="users"
                  onChange={setLearnersPerYear}
                />
              </div>
            )}

            {step === 2 && (
              <div className="space-y-6">
                <SelectCard
                  label="Funding model"
                  description="Pick the closest match."
                  value={fundingModel}
                  options={["Gov-funded", "Tuition-based", "Employer-sponsored", "Mixed"]}
                  onChange={(v) => setFundingModel(v as FundingModel)}
                />
              </div>
            )}

            {step === 3 && (
              <div className="space-y-6">
                <SelectCard
                  label="Advisor involvement"
                  description="How much 1:1 interview support happens today?"
                  value={advisorInvolvement}
                  options={["Low", "Medium", "High"]}
                  onChange={(v) => setAdvisorInvolvement(v as AdvisorInvolvement)}
                />
              </div>
            )}

            {step === 4 && (
              <div className="space-y-5">
                <StepSlider
                  id="placementRate"
                  value={placementRate}
                  options={placementOptions}
                  badgeFormatter={(v) => `${v}%`}
                  icon="target"
                  onChange={setPlacementRate}
                />
              </div>
            )}

            {step === 5 && (
              <div className="space-y-5">
                <Field
                  label="Tuition per learner (lifetime)"
                  suffix="USD"
                  value={tuitionPerLearner}
                  onChange={(v) => setTuitionPerLearner(v)}
                />
                <p className="text-xs text-[#003366]/60">
                  We’ll keep other assumptions conservative (uplifts, advisor costs, time savings) and focus enrollment impact on
                  the tuition you enter here.
                </p>

                <button
                  type="button"
                  onClick={handleSeeGap}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-full bg-[#ff686c] text-white px-5 py-3 text-sm font-semibold tracking-tight transition-all duration-300 hover:bg-[#ff5c61] disabled:opacity-60 disabled:cursor-not-allowed"
                  disabled={isCalculating}
                >
                  {isCalculating ? (
                    <>
                      <span className="h-3 w-3 rounded-full border-2 border-white/70 border-t-transparent animate-spin" />
                      Calculating...
                    </>
                  ) : (
                    <>
                      See cost of the gap
                      <ChevronRightIcon />
                    </>
                  )}
                </button>

                {/* Results */}
                {isCalculating && (
                  <div className="mt-4 rounded-2xl border border-black/10 p-4 bg-black/[0.02] text-sm text-[#003366]/70 flex items-center gap-2">
                    <span className="h-3 w-3 rounded-full border-2 border-[#003366]/40 border-t-transparent animate-spin" />
                    Calculating ROI with your inputs…
                  </div>
                )}

                {calcError && !isCalculating && (
                  <div className="mt-4 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
                    {calcError}
                  </div>
                )}

                {showResults && !isCalculating && roiResult && (
                  <div className="mt-4 border rounded-2xl border-black/10 p-5 bg-black/[0.02]">
                    <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3">
                      <div>
                        <p className="text-sm font-semibold text-[#003366]">Preview (conservative)</p>
                        <p className="text-xs text-[#003366]/60 mt-1">
                          Outcomes, support load, enrollment revenue, and ROI signals from your inputs.
                        </p>
                      </div>

                      {/* BEFORE / AFTER TOGGLE */}
                      <div className="inline-flex rounded-full border border-black/10 bg-white p-1">
                        {(["before", "after"] as const).map((k) => {
                          const active = view === k;
                          return (
                            <button
                              key={k}
                              type="button"
                              onClick={() => setView(k)}
                              className={classNames(
                                "px-3 py-1.5 text-xs font-semibold rounded-full transition-all",
                                active ? "bg-[#003366] text-white" : "text-[#003366]/70 hover:text-[#003366]",
                              )}
                            >
                              {k === "before" ? "Before Clarivue" : "With Clarivue"}
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* SAME 2 CARDS — VALUES SWAP */}
                    <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {view === "before" ? (
                        <>
                          <BigResultCard
                            label="Ready learners"
                            value={formatInt(roiResult.baseline.readyLearners)}
                            sub="Current state"
                            accent="violet"
                          />
                          <BigResultCard
                            label="Offers"
                            value={formatInt(roiResult.baseline.offers)}
                            sub="Current state"
                            accent="blue"
                          />
                        </>
                      ) : (
                        <>
                          <BigResultCard
                            label="Total value impact"
                            value={`$${formatInt(roiResult.summary.totalValueImpact)}`}
                            sub="Revenue + cost savings"
                            accent="emerald"
                          />
                          <BigResultCard
                            label="Advisor capacity unlocked"
                            value={formatInt(roiResult.summary.advisorHoursSaved)}
                            sub="Time back to coaching"
                            accent="violet"
                          />
                        </>
                      )}
                    </div>

                    {view === "after" && (
                      <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <BigResultCard
                          label="Enrollment revenue at risk"
                          value={`$${formatInt(
                            roiResult.enrollment?.atRisk ??
                              Math.max(0, (1 - placementRate / 100) * learnersPerYear * tuitionPerLearner),
                          )}`}
                          sub="Credibility gaps deter new enrollments."
                          accent="amber"
                        />
                        <BigResultCard
                          label="Enrollment revenue uplift"
                          value={`$${formatInt(
                            roiResult.enrollment?.uplift ??
                              learnersPerYear * (enrollmentCredibilityUpliftPct / 100) * tuitionPerLearner,
                          )}`}
                          sub="Stronger placement signals pull more learners in."
                          accent="emerald"
                        />
                      </div>
                    )}

                    <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <MiniStat label="Learners/year" value={formatInt(learnersPerYear)} />
                      <MiniStat label="Funding model" value={fundingModel} />
                      <MiniStat
                        label="Placement (est.)"
                        value={`${placementRate}% (baseline)`}
                      />
                    </div>

                    {/* Lead capture tease (UI-only) */}
                    <div className="mt-5 rounded-2xl border border-black/10 bg-white p-4">
                      <p className="text-sm font-semibold text-[#003366]">Get the full breakdown</p>
                      <p className="text-xs text-[#003366]/60 mt-1">
                        We’ll send a stakeholder-ready summary you can forward internally.
                      </p>

                      <div className="mt-3 flex flex-col sm:flex-row gap-2">
                        <input
                          type="email"
                          placeholder="Work email"
                          value={email}
                          onChange={e => setEmail(e.target.value)}
                          className="w-full rounded-xl border border-black/10 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-violet-300"
                          disabled={sending}
                        />
                        <button
                          type="button"
                          onClick={async () => {
                            setSendError(null);
                            setSendSuccess(null);
                            if (!email || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
                              setSendError("Enter a valid work email.");
                              return;
                            }
                            setSending(true);
                            try {
                              // 1. Map UI state to backend payload
                              const programType =
                                fundingModel === "Gov-funded"
                                  ? "university"
                                  : fundingModel === "Tuition-based"
                                  ? "bootcamp"
                                  : fundingModel === "Employer-sponsored"
                                  ? "workforce"
                                  : "other";
                              // Suggest baseline, uplift, economics
                              const assistRes = await fetch("/api/institutions/roi/assist", {
                                method: "POST",
                                headers: { "Content-Type": "application/json" },
                                body: JSON.stringify({ mode: "suggest", request: { context: { programType } } }),
                              }).then(r => r.json());
                              if (assistRes.error) throw new Error(assistRes.error);
                              const uplift = {
                                readinessUpliftPctPoints: readinessUpliftPctPoints || assistRes.uplift?.readinessUpliftPctPoints,
                                offerRateUpliftPctPoints: offerUpliftPctPoints || assistRes.uplift?.offerRateUpliftPctPoints,
                                advisorTimeSavingsPct: advisorTimeSavingsPct || assistRes.uplift?.advisorTimeSavingsPct,
                                timeToOfferImprovementWeeks:
                                  timeToOfferImprovementWeeks || assistRes.uplift?.timeToOfferImprovementWeeks,
                                mockInterviewUpliftPct: assistRes.uplift?.mockInterviewUpliftPct,
                                retentionImprovementPct: assistRes.uplift?.retentionImprovementPct,
                              };
                              const economics = {
                                revenuePerPlacement,
                                tuitionPerLearner,
                                enrollmentCredibilityUpliftPct,
                                costPerSession: assistRes.economics?.costPerSession,
                                fundingPerOutcome: assistRes.economics?.fundingPerOutcome,
                              };
                              // Compose request
                              const roiRequest = {
                                context: {
                                  programType,
                                  cohortSize: learnersPerYear,
                                  avgAdvisorHourlyCost: advisorHourlyCost,
                                },
                                baseline: {
                                  readinessRatePct: Math.min(95, placementRate + 10),
                                  offerRatePct: placementRate,
                                  avgTimeToOfferWeeks: assistRes.baseline?.avgTimeToOfferWeeks,
                                  mockInterviewsPerLearner: assistRes.baseline?.mockInterviewsPerLearner,
                                },
                                uplift,
                                economics,
                              };
                              // 2. Calculate ROI
                              const calcRes = await fetch("/api/institutions/roi/calculate", {
                                method: "POST",
                                headers: { "Content-Type": "application/json" },
                                body: JSON.stringify(roiRequest),
                              }).then(r => r.json());
                              if (calcRes.error) throw new Error(calcRes.error);
                              // 3. Get narrative
                              const narrativeRes = await fetch("/api/institutions/roi/assist", {
                                method: "POST",
                                headers: { "Content-Type": "application/json" },
                                body: JSON.stringify({ mode: "narrative", request: roiRequest, result: calcRes }),
                              }).then(r => r.json());
                              if (narrativeRes.error) throw new Error(narrativeRes.error);
                              // 4. Save run
                              const runRes = await fetch("/api/institutions/roi/run", {
                                method: "POST",
                                headers: { "Content-Type": "application/json" },
                                body: JSON.stringify({ request: roiRequest, result: calcRes, narrative: narrativeRes.narrative }),
                              }).then(r => r.json());
                              if (runRes.error || !runRes.runId) throw new Error(runRes.error || "Failed to save run");
                              // 5. Gate with email (optional, but not used for opening report)
                              await fetch("/api/institutions/roi/gate", {
                                method: "POST",
                                headers: { "Content-Type": "application/json" },
                                body: JSON.stringify({ runId: runRes.runId, email }),
                              });
                              // 6. Open report in new tab
                              setSendSuccess("Opening full report in new tab...");
                              window.open(`/institutions/roi/report/${runRes.runId}`, "_blank");
                            } catch (err: any) {
                              setSendError(err?.message || "Something went wrong. Try again.");
                            } finally {
                              setSending(false);
                            }
                          }}
                          className="rounded-xl bg-[#003366] text-white px-4 py-2 text-sm font-semibold hover:opacity-95 disabled:opacity-60"
                          disabled={sending}
                        >
                          {sending ? "Loading..." : "See full report"}
                        </button>
                      </div>

                      {sendError && <p className="mt-2 text-xs text-red-500">{sendError}</p>}
                      {sendSuccess && <p className="mt-2 text-xs text-green-600">{sendSuccess}</p>}
                      <p className="mt-2 text-[11px] text-black/50">See the full breakdown in a new tab. No spam.</p>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Footer controls */}
          <div className="mt-6 flex items-center justify-center gap-3">
            <button
              type="button"
              onClick={goBack}
              className={classNames(
                "inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold tracking-tight transition-all duration-300",
                step === 1 ? "bg-black/5 text-black/30 cursor-not-allowed" : "bg-black/5 hover:bg-black/10 text-[#003366]",
              )}
              disabled={step === 1}
            >
              Back
            </button>

            <button
              type="button"
              onClick={goNext}
              className={classNames(
                "inline-flex items-center gap-2 rounded-full bg-[#ff686c] text-white px-4 py-2 text-sm font-semibold tracking-tight transition-all duration-300 hover:bg-[#ff5c61] group",
                step === 5 && "opacity-60 cursor-not-allowed",
              )}
              disabled={step === 5}
            >
              <span>{step === 5 ? "Complete" : "Next step"}</span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="lucide lucide-chevron-right size-4 transition-transform duration-300 group-hover:translate-x-1"
              >
                <path d="m9 18 6-6-6-6" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

/* --------------------------------- */
/* Slider component (your style)      */
/* --------------------------------- */

function StepSlider(props: {
  id: string;
  value: number;
  options: SliderOption[];
  badgeFormatter?: (v: number) => string;
  icon?: "users" | "target";
  onChange: (v: number) => void;
}) {
  const { value, options, onChange, badgeFormatter, icon } = props;
  const trackRef = useRef<HTMLDivElement | null>(null);

  const index = useMemo(() => {
    const i = options.findIndex((o) => o.value === value);
    return i >= 0 ? i : 0;
  }, [options, value]);

  const pos = useMemo(() => {
    const n = options.length - 1;
    const t = n <= 0 ? 0 : index / n;
    return t;
  }, [index, options.length]);

  const [dragging, setDragging] = useState(false);

  const setFromClientX = useCallback(
    (clientX: number) => {
      const el = trackRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();

      const leftPad = 16;
      const rightPad = 16;
      const usable = rect.width - leftPad - rightPad;

      const x = clamp(clientX - rect.left - leftPad, 0, usable);
      const t = usable <= 0 ? 0 : x / usable;

      const n = options.length - 1;
      const nearestIndex = Math.round(t * n);
      const next = options[clamp(nearestIndex, 0, n)]?.value ?? options[0].value;
      onChange(next);
    },
    [onChange, options],
  );

  useEffect(() => {
    if (!dragging) return;

    const onMove = (e: PointerEvent) => setFromClientX(e.clientX);
    const onUp = () => setDragging(false);

    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerup", onUp);
    return () => {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup", onUp);
    };
  }, [dragging, setFromClientX]);

  const badgeText = badgeFormatter ? badgeFormatter(value) : String(value);

  return (
    <div className="pb-10">
      <div
        ref={trackRef}
        className="relative noselect border rounded-2xl h-14 transition-all duration-300 border-black/10 hover:border-black/20 bg-white"
        onPointerDown={(e) => setFromClientX(e.clientX)}
        role="group"
        aria-label="Slider"
      >
        <div className="absolute left-4 right-4 top-1/2 -translate-y-1/2 h-1.5 rounded-full bg-black/10" />

        {/* Ticks */}
        <div className="absolute left-4 right-4 top-1/2 -translate-y-1/2 flex justify-between">
          {Array.from({ length: Math.max(2, options.length - 1) }).map((_, i) => (
            <div key={i} className="h-3 w-px bg-black/20" />
          ))}
        </div>

        {/* Active fill */}
        <div
          className="absolute left-4 top-1/2 -translate-y-1/2 h-1.5 rounded-full bg-violet-400/70"
          style={{
            width: `calc(${pos} * (100% - 32px))`,
          }}
        />

        {/* Handle */}
        <button
          type="button"
          onPointerDown={(e) => {
            e.stopPropagation();
            setDragging(true);
          }}
          className="slider-handle absolute top-1/2 -translate-y-1/2 size-6 soft-glow bg-gradient-to-tr from-indigo-400 to-blue-500 border rounded-full transition-all duration-300 hover:scale-125 hover:animate-glow border-black/10 cursor-grab active:cursor-grabbing"
          style={{
            left: `calc(16px + ${pos} * (100% - 32px))`,
            transform: `translate(-50%, -50%) scale(${dragging ? 1.05 : 1})`,
          }}
          aria-label="Drag handle"
        />

        {/* Value Badge */}
        <div
          className="absolute -bottom-8 left-0 translate-x-0 transition-all duration-300"
          style={{
            left: `calc(16px + ${pos} * (100% - 32px))`,
            transform: "translateX(-50%)",
          }}
        >
          <div className="inline-flex items-center gap-1 rounded-lg px-2.5 py-1 soft-glow bg-indigo-400">
            <BadgeIcon kind={icon} />
            <span className="text-xs font-semibold tracking-tight">{badgeText}</span>
          </div>
        </div>
      </div>

      <div className="mt-3 flex justify-between text-xs text-black/50">
        {options.slice(0, 5).map((o) => (
          <button
            key={o.label}
            type="button"
            onClick={() => onChange(o.value)}
            className="transition-colors duration-300 hover:text-black/80"
          >
            {o.label}
          </button>
        ))}
        {options.length > 5 && (
          <button
            type="button"
            onClick={() => onChange(options[options.length - 1].value)}
            className="transition-colors duration-300 hover:text-black/80"
          >
            {options[options.length - 1].label}
          </button>
        )}
      </div>
    </div>
  );
}

function BadgeIcon({ kind }: { kind?: "users" | "target" }) {
  const base = "size-3.5";
  if (kind === "users") {
    return (
      <svg className={base} viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path
          d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
        />
        <circle cx="9" cy="7" r="4" stroke="currentColor" strokeWidth="2" />
        <path
          d="M22 21v-2a4 4 0 0 0-3-3.87"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
        />
      </svg>
    );
  }
  if (kind === "target") {
    return (
      <svg className={base} viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <circle cx="12" cy="12" r="8" stroke="currentColor" strokeWidth="2" />
        <circle cx="12" cy="12" r="4" stroke="currentColor" strokeWidth="2" />
        <path d="M12 2v4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      </svg>
    );
  }
  return (
    <svg className={base} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle cx="8" cy="8" r="6" stroke="currentColor" strokeWidth="2" />
      <path d="M18.09 10.37A6 6 0 1 1 10.34 18" stroke="currentColor" strokeWidth="2" />
    </svg>
  );
}

/* --------------------------------- */
/* Small UI atoms                     */
/* --------------------------------- */

function SelectCard(props: {
  label: string;
  description?: string;
  value: string;
  options: string[];
  onChange: (v: string) => void;
}) {
  const { label, description, value, options, onChange } = props;
  return (
    <div className="border rounded-2xl border-black/10 p-4 sm:p-5 bg-white">
      <p className="text-sm sm:text-base font-semibold text-[#003366]">{label}</p>
      {description && <p className="text-xs sm:text-sm text-black/60 mt-1">{description}</p>}
      <div className="mt-3 flex flex-wrap gap-2">
        {options.map((o) => {
          const active = o === value;
          return (
            <button
              key={o}
              type="button"
              onClick={() => onChange(o)}
              className={classNames(
                "px-4 py-2.5 rounded-xl text-sm sm:text-base transition-all duration-200 border",
                active
                  ? "bg-violet-400/25 border-violet-400/40 text-[#003366] font-medium"
                  : "bg-white border-black/10 hover:bg-black/[0.02] text-[#003366]",
              )}
            >
              {o}
            </button>
          );
        })}
      </div>
    </div>
  );
}

function BigResultCard(props: { label: string; value: string; sub: string; accent?: "violet" | "blue" | "emerald" | "amber" }) {
  const { label, value, sub, accent } = props;
  const accentClass =
    accent === "blue"
      ? "bg-blue-500/10 border-blue-500/20"
      : accent === "emerald"
        ? "bg-emerald-500/10 border-emerald-500/25"
        : accent === "amber"
          ? "bg-amber-400/15 border-amber-400/25"
          : "bg-violet-400/15 border-violet-400/25";

  return (
    <div className={classNames("border rounded-2xl p-4", accentClass)}>
      <p className="text-xs text-black/60">{label}</p>
      <p className="mt-1 text-2xl sm:text-3xl font-semibold tracking-tight text-[#003366]">{value}</p>
      <p className="mt-1 text-xs text-black/60">{sub}</p>
    </div>
  );
}

function MiniStat(props: { label: string; value: string }) {
  const { label, value } = props;
  return (
    <div className="border rounded-xl border-black/10 p-3 bg-white">
      <p className="text-[11px] text-black/60">{label}</p>
      <p className="text-sm font-semibold mt-1 text-[#003366]">{value}</p>
    </div>
  );
}

function Field({
  label,
  suffix,
  value,
  onChange,
}: {
  label: string;
  suffix?: string;
  value: number;
  onChange: (v: number) => void;
}) {
  return (
    <label className="flex flex-col gap-1 text-sm font-semibold text-[#003366]">
      <span className="flex items-center justify-between">
        {label}
        {suffix && <span className="text-xs text-[#003366]/60">{suffix}</span>}
      </span>
      <input
        type="number"
        min={0}
        value={Number.isFinite(value) ? value : 0}
        onChange={(e) => onChange(Number(e.target.value) || 0)}
        className="w-full rounded-xl border border-black/10 bg-white px-3 py-2 text-sm text-[#003366] focus:outline-none focus:ring-2 focus:ring-[#003366]/30"
      />
    </label>
  );
}

function ChevronRightIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="m9 18 6-6-6-6" />
    </svg>
  );
}
