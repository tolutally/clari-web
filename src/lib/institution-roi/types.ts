export type ProgramType = "bootcamp" | "university" | "workforce" | "other";

export type ProgramContext = {
  institutionName?: string;
  programType: ProgramType;
  cohortSize: number;
  advisorCount?: number;
  avgAdvisorHourlyCost?: number;
  avgSessionDurationHours?: number;
  sessionsPerLearnerWeekly?: number;
  location?: string;
};

export type BaselinePerformance = {
  readinessRatePct: number; // 0-100
  offerRatePct: number; // 0-100
  avgTimeToReadyWeeks?: number;
  avgTimeToOfferWeeks?: number;
  mockInterviewsPerLearner?: number;
  sessionsPerLearner?: number;
};

export type UpliftAssumptions = {
  mockInterviewUpliftPct?: number; // percent increase
  readinessUpliftPctPoints?: number; // percentage points
  offerRateUpliftPctPoints?: number; // percentage points
  advisorTimeSavingsPct?: number; // percent reduction
  retentionImprovementPct?: number;
  timeToOfferImprovementWeeks?: number;
};

export type Economics = {
  revenuePerPlacement: number;
  costPerSession?: number;
  fundingPerOutcome?: number;
  tuitionPerLearner?: number;
  enrollmentCredibilityUpliftPct?: number; // 0-1 range for enrollment lift from credibility
};

export type RoiRequest = {
  context: ProgramContext;
  baseline: BaselinePerformance;
  uplift: UpliftAssumptions;
  economics: Economics;
};

export type ScenarioBreakdown = {
  totalValueImpact: number;
  revenueImpact: number;
  costSavings: number;
  advisorHoursSaved: number;
  addedSessionsCost: number;
  addedReadyLearners: number;
  addedOffers: number;
  newTimeToOfferWeeks: number | null;
};

export type RoiResult = {
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
  assumptions: RoiRequest;
};

export type RoiRunRow = {
  id: string;
  request: RoiRequest;
  result: RoiResult;
  narrative?: string;
  gate_passed: boolean;
  created_at?: string;
  updated_at?: string;
};
