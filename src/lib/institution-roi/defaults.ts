import type {
  Economics,
  ProgramContext,
  LeakInputs,
  ChangeAssumptions,
  Investment,
  BaselinePerformance,
} from "./types";

// ── Conversion-loss proxy per program type ──────────────────────────────
// Fraction of placement value destroyed per unready interview
export const FAIL_CONVERSION_VALUE_FACTOR: Record<string, number> = {
  bootcamp: 0.35,
  university: 0.30,
  workforce: 0.40,
  other: 0.32,
};

// ── Placement-rate proxy when user doesn't supply baseline.offerRatePct ──
export const PLACEMENT_RATE_PROXY: Record<string, number> = {
  bootcamp: 0.30,
  university: 0.18,
  workforce: 0.15,
  other: 0.20,
};

// ── Leak defaults by program type ───────────────────────────────────────
export function suggestLeakDefaults(programType: ProgramContext["programType"]): LeakInputs {
  switch (programType) {
    case "bootcamp":
      return {
        employerInterviewsPerLearner: 3,
        unreadyAtInterviewRatePct: 25,
        remediationRatePct: 30,
        extraCoachingHoursPerRemediationLearner: 3,
        employerOpportunityRationingPct: 8,
      };
    case "university":
      return {
        employerInterviewsPerLearner: 2,
        unreadyAtInterviewRatePct: 35,
        remediationRatePct: 25,
        extraCoachingHoursPerRemediationLearner: 4,
        employerOpportunityRationingPct: 12,
      };
    case "workforce":
      return {
        employerInterviewsPerLearner: 2,
        unreadyAtInterviewRatePct: 40,
        remediationRatePct: 35,
        extraCoachingHoursPerRemediationLearner: 3.5,
        employerOpportunityRationingPct: 15,
      };
    default:
      return {
        employerInterviewsPerLearner: 2,
        unreadyAtInterviewRatePct: 30,
        remediationRatePct: 28,
        extraCoachingHoursPerRemediationLearner: 3,
        employerOpportunityRationingPct: 10,
      };
  }
}

// ── Change assumption defaults ──────────────────────────────────────────
export function suggestChangeDefaults(programType: ProgramContext["programType"]): ChangeAssumptions {
  switch (programType) {
    case "bootcamp":
      return {
        reductionInUnreadyRatePct: 20,
        reductionInRemediationRatePct: 25,
        recoveryOfRationedOpportunityPct: 30,
      };
    case "university":
      return {
        reductionInUnreadyRatePct: 18,
        reductionInRemediationRatePct: 22,
        recoveryOfRationedOpportunityPct: 25,
      };
    case "workforce":
      return {
        reductionInUnreadyRatePct: 22,
        reductionInRemediationRatePct: 28,
        recoveryOfRationedOpportunityPct: 28,
      };
    default:
      return {
        reductionInUnreadyRatePct: 18,
        reductionInRemediationRatePct: 22,
        recoveryOfRationedOpportunityPct: 25,
      };
  }
}

// ── Investment suggestion ───────────────────────────────────────────────
export function suggestInvestment(
  cohortSize: number,
  revenuePerPlacement: number,
): Investment {
  // Rough heuristic: roughly $100-$200 per learner, scaled by placement value
  const perLearner = revenuePerPlacement < 5000 ? 100 : revenuePerPlacement < 10000 ? 150 : 200;
  return {
    annualChangeInvestment: Math.round(cohortSize * perLearner / 100) * 100, // round to nearest 100
  };
}

// ── Economics defaults (kept) ───────────────────────────────────────────
export function suggestEconomics(programType: ProgramContext["programType"]): Economics {
  return {
    revenuePerPlacement: programType === "university" ? 8500 : 9500,
    costPerSession: 45,
    fundingPerOutcome: 0,
    tuitionPerLearner: 12000,
    enrollmentCredibilityUpliftPct: 12,
  };
}

// ── Optional baseline reference (kept for backward compat) ──────────────
export function suggestBaseline(programType: ProgramContext["programType"]): BaselinePerformance {
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
