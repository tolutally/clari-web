import type { Economics, ProgramContext, UpliftAssumptions, BaselinePerformance } from "./types";

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

export function suggestUplift(programType: ProgramContext["programType"]): UpliftAssumptions {
  return {
    mockInterviewUpliftPct: 120, // 2.2x sessions
    readinessUpliftPctPoints: programType === "bootcamp" ? 12 : 10,
    offerRateUpliftPctPoints: programType === "bootcamp" ? 8 : 6,
    advisorTimeSavingsPct: 35,
    retentionImprovementPct: 10,
    timeToOfferImprovementWeeks: 2,
  };
}

export function suggestEconomics(programType: ProgramContext["programType"]): Economics {
  return {
    revenuePerPlacement: programType === "university" ? 8500 : 9500,
    costPerSession: 45,
    fundingPerOutcome: 0,
    tuitionPerLearner: 12000,
    enrollmentCredibilityUpliftPct: 12,
  };
}
