import type {
  ProgramContext,
  PrepCostInputs,
  ChangeAssumptions,
  Investment,
  BaselinePerformance,
  ProgramType,
  ActivityHoursBreakdown,
} from "./types";

// ═══════════════════════════════════════════════════════════════════════════
// V4: Placement Gap Calculator Defaults
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Hours per learner by activity and program type.
 * These represent the time advisors spend on each last-mile activity.
 */
export const ACTIVITY_HOURS: Record<ProgramType, ActivityHoursBreakdown> = {
  bootcamp: {
    resumePrep: 1.5,
    checkIns: 2.0,
    sessionNotes: 1.0,
    interviewPrep: 3.0,
    employerFollowUp: 1.5,
    total: 9.0,
  },
  workforce: {
    resumePrep: 2.0,
    checkIns: 3.0,
    sessionNotes: 1.5,
    interviewPrep: 2.5,
    employerFollowUp: 2.0,
    total: 11.0,
  },
  university: {
    resumePrep: 1.0,
    checkIns: 1.5,
    sessionNotes: 0.5,
    interviewPrep: 2.0,
    employerFollowUp: 1.0,
    total: 6.0,
  },
  other: {
    resumePrep: 1.5,
    checkIns: 2.0,
    sessionNotes: 1.0,
    interviewPrep: 2.5,
    employerFollowUp: 1.5,
    total: 8.5,
  },
};

/**
 * Advisor hourly cost by program type (fully loaded: salary + benefits).
 */
export const ADVISOR_HOURLY_COST: Record<ProgramType, number> = {
  bootcamp: 55,
  workforce: 45,
  university: 50,
  other: 50,
};

/**
 * Base drop-off rate by program type.
 * This is the percentage of learners who don't place due to the gap
 * (not due to skills — due to process failures).
 */
export const BASE_DROP_OFF_RATE: Record<ProgramType, number> = {
  bootcamp: 0.12, // 12%
  workforce: 0.18, // 18%
  university: 0.08, // 8%
  other: 0.14, // 14%
};

/**
 * Caseload strain multiplier.
 * When advisors are overloaded, drop-off rates increase.
 */
export function getCaseloadStrainMultiplier(caseload: number): number {
  if (caseload < 30) return 1.0;
  if (caseload < 50) return 1.15;
  if (caseload < 75) return 1.35;
  return 1.6;
}

/**
 * Value per placement by program type.
 * Represents the economic value of a successful placement
 * (funding received, revenue, or outcome value).
 */
export const PLACEMENT_VALUE: Record<ProgramType, number> = {
  bootcamp: 8000,
  workforce: 5000,
  university: 6000,
  other: 6000,
};

/**
 * Clarivue recovery rate.
 * Percentage of preventable drop-offs that Clarivue recovers.
 */
export const CLARIVUE_RECOVERY_RATES = {
  conservative: 0.55, // 55%
  expected: 0.65,     // 65%
  optimistic: 0.75,   // 75%
};

/**
 * Get all V4 defaults for a program type.
 */
export function getGapCalculatorDefaults(programType: ProgramType) {
  return {
    hoursPerLearner: ACTIVITY_HOURS[programType],
    advisorHourlyCost: ADVISOR_HOURLY_COST[programType],
    baseDropOffRate: BASE_DROP_OFF_RATE[programType],
    placementValue: PLACEMENT_VALUE[programType],
    recoveryRates: CLARIVUE_RECOVERY_RATES,
  };
}

// ═══════════════════════════════════════════════════════════════════════════
// Legacy V3 Defaults (kept for backward compatibility)
// ═══════════════════════════════════════════════════════════════════════════

//  Prep-cost defaults by program type 
export function suggestPrepCostDefaults(
  programType: ProgramContext["programType"],
): PrepCostInputs {
  switch (programType) {
    case "bootcamp":
      return {
        mocksPerLearner: 3,
        costPerSession: 55,
        adminOverheadMinutesPerSession: 15,
        remediationRatePct: 30,
        extraCoachingHoursPerRemediationLearner: 3,
      };
    case "university":
      return {
        mocksPerLearner: 2,
        costPerSession: 50,
        adminOverheadMinutesPerSession: 20,
        remediationRatePct: 25,
        extraCoachingHoursPerRemediationLearner: 4,
      };
    case "workforce":
      return {
        mocksPerLearner: 2,
        costPerSession: 45,
        adminOverheadMinutesPerSession: 20,
        remediationRatePct: 35,
        extraCoachingHoursPerRemediationLearner: 3.5,
      };
    default:
      return {
        mocksPerLearner: 2,
        costPerSession: 50,
        adminOverheadMinutesPerSession: 18,
        remediationRatePct: 28,
        extraCoachingHoursPerRemediationLearner: 3,
      };
  }
}

//  Change assumption defaults 
export function suggestChangeDefaults(
  programType: ProgramContext["programType"],
): ChangeAssumptions {
  switch (programType) {
    case "bootcamp":
      return {
        automationRatePct: 65,
        reductionInRemediationRatePct: 25,
        placementLiftConversionFactor: 0.45,
      };
    case "university":
      return {
        automationRatePct: 60,
        reductionInRemediationRatePct: 22,
        placementLiftConversionFactor: 0.40,
      };
    case "workforce":
      return {
        automationRatePct: 70,
        reductionInRemediationRatePct: 30,
        placementLiftConversionFactor: 0.50,
      };
    default:
      return {
        automationRatePct: 65,
        reductionInRemediationRatePct: 25,
        placementLiftConversionFactor: 0.45,
      };
  }
}

//  Investment suggestion 
export function suggestInvestment(cohortSize: number): Investment {
  // Rough heuristic: $120-180 per learner depending on cohort size
  const perLearner = cohortSize < 100 ? 180 : cohortSize < 300 ? 150 : 120;
  return {
    annualChangeInvestment:
      Math.round((cohortSize * perLearner) / 100) * 100, // round to nearest 100
  };
}

//  Optional baseline reference (kept for backward compat) 
export function suggestBaseline(
  programType: ProgramContext["programType"],
): BaselinePerformance {
  switch (programType) {
    case "bootcamp":
      return {
        readinessRatePct: 45,
        offerRatePct: 28,
        avgTimeToReadyWeeks: 6,
        avgTimeToOfferWeeks: 10,
        mockInterviewsPerLearner: 3,
      };
    case "university":
      return {
        readinessRatePct: 35,
        offerRatePct: 18,
        avgTimeToReadyWeeks: 8,
        avgTimeToOfferWeeks: 14,
        mockInterviewsPerLearner: 2,
      };
    case "workforce":
      return {
        readinessRatePct: 30,
        offerRatePct: 15,
        avgTimeToReadyWeeks: 10,
        avgTimeToOfferWeeks: 16,
        mockInterviewsPerLearner: 2,
      };
    default:
      return {
        readinessRatePct: 40,
        offerRatePct: 20,
        avgTimeToReadyWeeks: 8,
        avgTimeToOfferWeeks: 12,
        mockInterviewsPerLearner: 2,
      };
  }
}
