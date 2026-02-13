export type ProgramType = "bootcamp" | "university" | "workforce" | "other";

export type ProgramContext = {
  institutionName?: string;
  programType: ProgramType;
  cohortSize: number;
  advisorCount?: number;
  avgAdvisorHourlyCost?: number; // default 60
  avgSessionDurationHours?: number;
  sessionsPerLearnerWeekly?: number;
  location?: string;
};

/** Optional reference fields — kept for backward compat and guided defaults */
export type BaselinePerformance = {
  readinessRatePct?: number; // 0-100, optional reference
  offerRatePct?: number; // 0-100, optional — used as placementRateProxy if provided
  avgTimeToReadyWeeks?: number;
  avgTimeToOfferWeeks?: number;
  mockInterviewsPerLearner?: number;
  sessionsPerLearner?: number;
};

/** Status-quo leak inputs — the "readiness debt" observed today */
export type LeakInputs = {
  employerInterviewsPerLearner: number;
  unreadyAtInterviewRatePct: number; // 0-100
  remediationRatePct: number; // 0-100
  extraCoachingHoursPerRemediationLearner: number;
  employerOpportunityRationingPct: number; // 0-100
};

/** Assumptions about what changes under a verified-readiness operating model */
export type ChangeAssumptions = {
  reductionInUnreadyRatePct: number; // 0-100
  reductionInRemediationRatePct: number; // 0-100
  recoveryOfRationedOpportunityPct: number; // 0-100
};

/** One-number annual investment to adopt the approach */
export type Investment = {
  annualChangeInvestment: number;
};

export type Economics = {
  revenuePerPlacement: number;
  costPerSession?: number;
  fundingPerOutcome?: number;
  tuitionPerLearner?: number;
  enrollmentCredibilityUpliftPct?: number;
};

// ── Legacy types kept so old "v1" reports still parse ────────────────────
export type UpliftAssumptions = {
  mockInterviewUpliftPct?: number;
  readinessUpliftPctPoints?: number;
  offerRateUpliftPctPoints?: number;
  advisorTimeSavingsPct?: number;
  retentionImprovementPct?: number;
  timeToOfferImprovementWeeks?: number;
};

/** @deprecated v1 scenario shape — kept for backward compat */
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

// ── V2 Challenger types ──────────────────────────────────────────────────

export type RoiRequest = {
  context: ProgramContext;
  baseline?: BaselinePerformance; // optional reference
  economics: Economics;
  leak: LeakInputs;
  change: ChangeAssumptions;
  investment: Investment;
};

export type ChallengerScenarioBreakdown = {
  costOfDoingNothing: number;
  valueRecovered: number;
  netAnnual: number;
  roiPct: number | null;
  paybackMonths: number | null;
  reworkCost: number;
  reworkSaved: number;
  outcomeLeak: number;
  outcomeRecovered: number;
  confidenceLeak: number;
  confidenceRecovered: number;
};

export type RoiResult = {
  resultVersion: 2;
  summary: ChallengerScenarioBreakdown;
  baselineSignals: {
    placementProxyUsed: number;
    interviewsPerYear: number;
    unreadyInterviewsPerYear: number;
  };
  sensitivity: {
    low: ChallengerScenarioBreakdown;
    expected: ChallengerScenarioBreakdown;
    high: ChallengerScenarioBreakdown;
  };
  assumptions: RoiRequest;
};

export type RoiRunRow = {
  id: string;
  request: RoiRequest;
  result: RoiResult;
  result_version: number; // 1 = legacy feature ROI, 2 = challenger ROI
  narrative?: string;
  gate_passed: boolean;
  created_at?: string;
  updated_at?: string;
};
