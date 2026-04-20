import type {
  RoiRequest,
  RoiResult,
  RoiScenarioBreakdown,
  GapCalculatorRequest,
  GapCalculatorResult,
  GapScenarioBreakdown,
  GapLosses,
} from "./types";

import {
  ACTIVITY_HOURS,
  ADVISOR_HOURLY_COST,
  BASE_DROP_OFF_RATE,
  PLACEMENT_VALUE,
  CLARIVUE_RECOVERY_RATES,
  getCaseloadStrainMultiplier,
} from "./defaults";

// ═══════════════════════════════════════════════════════════════════════════
// V4: Placement Gap Calculator
// ═══════════════════════════════════════════════════════════════════════════

const safe = (v: number | undefined, floor = 0) =>
  Math.max(floor, Number.isFinite(v ?? NaN) ? (v as number) : 0);

/**
 * Compute one V4 scenario.
 * @param input - The 4 user inputs
 * @param recoveryMultiplier - 0.55 (conservative), 0.65 (expected), 0.75 (optimistic)
 */
function computeGapScenario(
  input: GapCalculatorRequest,
  recoveryRate: number,
): GapScenarioBreakdown {
  const { learnersPerYear, programType, currentCaseload } = input;
  
  // Get defaults for this program type
  const hoursPerLearner = ACTIVITY_HOURS[programType];
  const hourlyRate = ADVISOR_HOURLY_COST[programType];
  const baseDropOff = BASE_DROP_OFF_RATE[programType];
  const placementValue = PLACEMENT_VALUE[programType];
  
  // Calculate caseload strain
  const strainMultiplier = getCaseloadStrainMultiplier(safe(currentCaseload, 30));
  
  // ─────────────────────────────────────────────────────────────────────────
  // TIME LOST: Total advisor hours spent on last-mile activities
  // ─────────────────────────────────────────────────────────────────────────
  const L = safe(learnersPerYear, 1);
  const hoursBreakdown = {
    resumePrep: L * hoursPerLearner.resumePrep,
    checkIns: L * hoursPerLearner.checkIns,
    sessionNotes: L * hoursPerLearner.sessionNotes,
    interviewPrep: L * hoursPerLearner.interviewPrep,
    employerFollowUp: L * hoursPerLearner.employerFollowUp,
    total: L * hoursPerLearner.total,
  };
  const timeLostHours = hoursBreakdown.total;
  
  // ─────────────────────────────────────────────────────────────────────────
  // MONEY LOST: Dollar cost of that time
  // ─────────────────────────────────────────────────────────────────────────
  const moneyLost = timeLostHours * hourlyRate;
  
  // ─────────────────────────────────────────────────────────────────────────
  // PEOPLE LOST: Learners who don't place due to the gap
  // ─────────────────────────────────────────────────────────────────────────
  const effectiveDropOff = baseDropOff * strainMultiplier;
  const peopleLost = Math.round(L * effectiveDropOff);
  
  // ─────────────────────────────────────────────────────────────────────────
  // AGGREGATE GAP COST: Money lost + value of lost placements
  // ─────────────────────────────────────────────────────────────────────────
  const aggregateGapCost = moneyLost + (peopleLost * placementValue);
  
  // ─────────────────────────────────────────────────────────────────────────
  // ADDITIONAL PLACEMENTS: What Clarivue recovers
  // ─────────────────────────────────────────────────────────────────────────
  const additionalPlacements = Math.round(peopleLost * recoveryRate);
  
  // Build losses object
  const losses: GapLosses = {
    timeLost: {
      hours: timeLostHours,
      breakdown: hoursBreakdown,
    },
    moneyLost: {
      amount: moneyLost,
      hourlyRate,
    },
    peopleLost: {
      count: peopleLost,
      baseDropOffRate: baseDropOff,
      strainMultiplier,
      effectiveDropOffRate: effectiveDropOff,
    },
  };
  
  return {
    aggregateGapCost,
    losses,
    additionalPlacements,
    recoveryRate,
    placementValue,
  };
}

/**
 * Calculate V4 Gap Cost with sensitivity analysis.
 */
export function calculateGapCost(input: GapCalculatorRequest): GapCalculatorResult {
  const { programType } = input;
  
  // Compute three scenarios
  const conservative = computeGapScenario(input, CLARIVUE_RECOVERY_RATES.conservative);
  const expected = computeGapScenario(input, CLARIVUE_RECOVERY_RATES.expected);
  const optimistic = computeGapScenario(input, CLARIVUE_RECOVERY_RATES.optimistic);
  
  return {
    resultVersion: 4,
    summary: expected,
    sensitivity: {
      conservative,
      expected,
      optimistic,
    },
    programDefaults: {
      hoursPerLearner: ACTIVITY_HOURS[programType],
      advisorHourlyCost: ADVISOR_HOURLY_COST[programType],
      baseDropOffRate: BASE_DROP_OFF_RATE[programType],
      placementValue: PLACEMENT_VALUE[programType],
    },
    request: input,
  };
}

// ═══════════════════════════════════════════════════════════════════════════
// Legacy V3 Calculator (kept for backward compatibility)
// ═══════════════════════════════════════════════════════════════════════════

const clampPct = (v: number | undefined, min = 0, max = 100) =>
  Math.min(max, Math.max(min, Number.isFinite(v ?? NaN) ? (v as number) : 0));

/**
 * Compute one scenario.
 * `multiplier` applies ONLY to change assumptions (not status-quo costs).
 *   low = 0.8, expected = 1.0, high = 1.2
 */
function computeScenario(
  input: RoiRequest,
  multiplier = 1,
): RoiScenarioBreakdown {
  //  Inputs (status-quo) 
  const L = safe(input.context.cohortSize);
  const W = safe(input.context.avgAdvisorHourlyCost) || 60;
  const sessionDuration = safe(input.context.avgSessionDurationHours) || 1;

  const mocks = safe(input.prepCost.mocksPerLearner);
  const costPerSession = safe(input.prepCost.costPerSession);
  const adminMin = safe(input.prepCost.adminOverheadMinutesPerSession);
  const remPct = clampPct(input.prepCost.remediationRatePct) / 100;
  const extraHrs = safe(input.prepCost.extraCoachingHoursPerRemediationLearner);

  //  Change assumptions (scaled by multiplier) 
  const autoRate = (clampPct(input.change.automationRatePct) / 100) * multiplier;
  const remReduction = (clampPct(input.change.reductionInRemediationRatePct) / 100) * multiplier;
  const liftFactor = Math.min(1, safe(input.change.placementLiftConversionFactor) * multiplier);

  //  Investment 
  const Inv = safe(input.investment.annualChangeInvestment);

  //  Block 1: Current Prep Cost (status-quo annual cost) 
  const totalMocks = L * mocks;
  const mockSessionCost = totalMocks * costPerSession;
  const adminOverheadCost = totalMocks * (adminMin / 60) * W;
  const remediationLearners = L * remPct;
  const remediationCost = remediationLearners * extraHrs * W;
  const currentPrepCost = mockSessionCost + adminOverheadCost + remediationCost;

  //  Block 2: Advisor Time Recovered (hours saved in dollar terms) 
  const mockTimeSaved = totalMocks * autoRate * sessionDuration * W;
  const adminTimeSaved = totalMocks * autoRate * (adminMin / 60) * W;
  const remediationSaved = remediationCost * remReduction;
  const advisorTimeRecovered = mockTimeSaved + adminTimeSaved + remediationSaved;

  //  Block 3: Additional Learners Served 
  const hoursSaved =
    totalMocks * autoRate * sessionDuration +
    totalMocks * autoRate * (adminMin / 60) +
    remediationLearners * extraHrs * remReduction;
  const hoursPerLearner = mocks * sessionDuration + mocks * (adminMin / 60);
  const additionalLearnersServed =
    hoursPerLearner > 0 ? Math.floor(hoursSaved / hoursPerLearner) : 0;

  //  Block 4: Placement Rate Lift 
  // unreadyRate  reduction  conversionFactor  100
  const unreadyRate = remPct; // proxy: remediation rate  unready rate
  const placementRateLiftPct = unreadyRate * remReduction * liftFactor * 100;

  //  Financial summary 
  const netAnnualSavings = advisorTimeRecovered - Inv;
  const paybackMonths =
    advisorTimeRecovered <= 0 ? null : (Inv / advisorTimeRecovered) * 12;

  return {
    currentPrepCost,
    advisorTimeRecovered,
    additionalLearnersServed,
    placementRateLiftPct,

    mockSessionCost,
    adminOverheadCost,
    remediationCost,
    mockTimeSaved,
    adminTimeSaved,
    remediationSaved,
    hoursPerLearner,

    netAnnualSavings,
    paybackMonths,
  };
}

export function calculateRoi(input: RoiRequest): RoiResult {
  const expected = computeScenario(input, 1);
  const low = computeScenario(input, 0.8);
  const high = computeScenario(input, 1.2);

  const L = safe(input.context.cohortSize);
  const mocks = safe(input.prepCost.mocksPerLearner);
  const remPct = clampPct(input.prepCost.remediationRatePct) / 100;
  const sessionDuration = safe(input.context.avgSessionDurationHours) || 1;
  const adminMin = safe(input.prepCost.adminOverheadMinutesPerSession);

  const totalMocks = L * mocks;
  const remediationLearners = L * remPct;
  const totalAdvisorHoursOnPrep =
    totalMocks * sessionDuration +
    totalMocks * (adminMin / 60) +
    remediationLearners * safe(input.prepCost.extraCoachingHoursPerRemediationLearner);

  return {
    resultVersion: 3,
    summary: expected,
    baselineSignals: {
      totalMockSessions: totalMocks,
      remediationLearners,
      totalAdvisorHoursOnPrep,
      unreadyRatePct: remPct * 100,
    },
    sensitivity: { low, expected, high },
    assumptions: input,
  };
}
