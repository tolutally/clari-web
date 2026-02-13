import type { RoiRequest, RoiResult, ChallengerScenarioBreakdown } from "./types";
import { FAIL_CONVERSION_VALUE_FACTOR, PLACEMENT_RATE_PROXY } from "./defaults";

const clampPct = (v: number | undefined, min = 0, max = 100) =>
  Math.min(max, Math.max(min, Number.isFinite(v ?? NaN) ? (v as number) : 0));

const safe = (v: number | undefined, floor = 0) =>
  Math.max(floor, Number.isFinite(v ?? NaN) ? (v as number) : 0);

/**
 * Compute one scenario.
 * `multiplier` is applied ONLY to the change assumptions (not the leak inputs).
 *   low  = 0.8
 *   expected = 1.0
 *   high = 1.2
 */
function computeScenario(
  input: RoiRequest,
  multiplier = 1,
): ChallengerScenarioBreakdown {
  // ── Inputs ─────────────────────────────────────────────────────────────
  const L = safe(input.context.cohortSize);
  const V = safe(input.economics.revenuePerPlacement);
  const W = safe(input.context.avgAdvisorHourlyCost) || 60;
  const I = safe(input.leak.employerInterviewsPerLearner);
  const U = clampPct(input.leak.unreadyAtInterviewRatePct) / 100;
  const Rm = clampPct(input.leak.remediationRatePct) / 100;
  const Hx = safe(input.leak.extraCoachingHoursPerRemediationLearner);
  const Or = clampPct(input.leak.employerOpportunityRationingPct) / 100;

  // ── Change assumptions (scaled by multiplier) ──────────────────────────
  const dU = (clampPct(input.change.reductionInUnreadyRatePct) / 100) * multiplier;
  const dRm = (clampPct(input.change.reductionInRemediationRatePct) / 100) * multiplier;
  const recOr = (clampPct(input.change.recoveryOfRationedOpportunityPct) / 100) * multiplier;

  // ── Investment ─────────────────────────────────────────────────────────
  const Inv = safe(input.investment.annualChangeInvestment);

  // ── Block 1: Rework loop tax ───────────────────────────────────────────
  const reworkCost = L * Rm * Hx * W;
  const reworkSaved = reworkCost * dRm;

  // ── Block 2: Outcome leakage from unready interviews ───────────────────
  const failFactor =
    FAIL_CONVERSION_VALUE_FACTOR[input.context.programType] ??
    FAIL_CONVERSION_VALUE_FACTOR.other;
  const outcomeLeak = L * I * U * failFactor * V;
  const outcomeRecovered = outcomeLeak * dU;

  // ── Block 3: Employer confidence tax ───────────────────────────────────
  const placementProxy =
    input.baseline?.offerRatePct != null && Number.isFinite(input.baseline.offerRatePct)
      ? clampPct(input.baseline.offerRatePct) / 100
      : PLACEMENT_RATE_PROXY[input.context.programType] ?? PLACEMENT_RATE_PROXY.other;

  const confidenceLeak = L * placementProxy * Or * V;
  const confidenceRecovered = confidenceLeak * recOr;

  // ── Totals ─────────────────────────────────────────────────────────────
  const costOfDoingNothing = reworkCost + outcomeLeak + confidenceLeak;
  const valueRecovered = reworkSaved + outcomeRecovered + confidenceRecovered;
  const netAnnual = valueRecovered - Inv;
  const roiPct = Inv <= 0 ? null : (netAnnual / Inv) * 100;
  const paybackMonths =
    valueRecovered <= 0 ? null : (Inv / valueRecovered) * 12;

  return {
    costOfDoingNothing,
    valueRecovered,
    netAnnual,
    roiPct,
    paybackMonths,
    reworkCost,
    reworkSaved,
    outcomeLeak,
    outcomeRecovered,
    confidenceLeak,
    confidenceRecovered,
  };
}

export function calculateRoi(input: RoiRequest): RoiResult {
  const expected = computeScenario(input, 1);
  const low = computeScenario(input, 0.8);
  const high = computeScenario(input, 1.2);

  const L = safe(input.context.cohortSize);
  const I = safe(input.leak.employerInterviewsPerLearner);
  const U = clampPct(input.leak.unreadyAtInterviewRatePct) / 100;

  const placementProxy =
    input.baseline?.offerRatePct != null && Number.isFinite(input.baseline.offerRatePct)
      ? clampPct(input.baseline.offerRatePct) / 100
      : PLACEMENT_RATE_PROXY[input.context.programType] ?? PLACEMENT_RATE_PROXY.other;

  return {
    resultVersion: 2,
    summary: expected,
    baselineSignals: {
      placementProxyUsed: placementProxy,
      interviewsPerYear: L * I,
      unreadyInterviewsPerYear: L * I * U,
    },
    sensitivity: {
      low,
      expected,
      high,
    },
    assumptions: input,
  };
}
