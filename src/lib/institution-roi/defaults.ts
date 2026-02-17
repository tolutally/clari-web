import type {
  ProgramContext,
  PrepCostInputs,
  ChangeAssumptions,
  Investment,
  BaselinePerformance,
} from "./types";

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
