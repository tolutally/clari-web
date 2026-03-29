export type ProgramType = "bootcamp" | "university" | "workforce" | "other";

// ═══════════════════════════════════════════════════════════════════════════
// V4: Placement Gap Calculator (Challenger Sales)
// ═══════════════════════════════════════════════════════════════════════════

/** V4 Request: 4 simple inputs */
export type GapCalculatorRequest = {
  learnersPerYear: number;
  programType: ProgramType;
  advisorsCount: number;
  currentCaseload: number; // learners per advisor
};

/** Hours breakdown by last-mile activity */
export type ActivityHoursBreakdown = {
  resumePrep: number;
  checkIns: number;
  sessionNotes: number;
  interviewPrep: number;
  employerFollowUp: number;
  total: number;
};

/** 3 loss categories */
export type GapLosses = {
  timeLost: {
    hours: number;
    breakdown: ActivityHoursBreakdown;
  };
  moneyLost: {
    amount: number;
    hourlyRate: number;
  };
  peopleLost: {
    count: number;
    baseDropOffRate: number;
    strainMultiplier: number;
    effectiveDropOffRate: number;
  };
};

/** V4 Scenario breakdown */
export type GapScenarioBreakdown = {
  /** Hero number: total annual gap cost */
  aggregateGapCost: number;
  /** 3 loss categories */
  losses: GapLosses;
  /** Payoff: additional placements with Clarivue */
  additionalPlacements: number;
  /** Recovery rate used */
  recoveryRate: number;
  /** Value per placement used */
  placementValue: number;
};

/** V4 Result */
export type GapCalculatorResult = {
  resultVersion: 4;
  summary: GapScenarioBreakdown;
  sensitivity: {
    conservative: GapScenarioBreakdown; // 0.8x recovery
    expected: GapScenarioBreakdown;     // 1.0x recovery
    optimistic: GapScenarioBreakdown;   // 1.2x recovery
  };
  programDefaults: {
    hoursPerLearner: ActivityHoursBreakdown;
    advisorHourlyCost: number;
    baseDropOffRate: number;
    placementValue: number;
  };
  request: GapCalculatorRequest;
};

// ═══════════════════════════════════════════════════════════════════════════
// Legacy V3 Types (kept for backward compatibility)
// ═══════════════════════════════════════════════════════════════════════════

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

/** Optional reference fields  kept for backward compat and guided defaults */
export type BaselinePerformance = {
  readinessRatePct?: number; // 0-100, optional reference
  offerRatePct?: number; // 0-100, optional
  avgTimeToReadyWeeks?: number;
  avgTimeToOfferWeeks?: number;
  mockInterviewsPerLearner?: number;
  sessionsPerLearner?: number;
};

/** Status-quo cost inputs  what the career center spends today on interview prep */
export type PrepCostInputs = {
  mocksPerLearner: number;
  costPerSession: number;
  adminOverheadMinutesPerSession: number;
  remediationRatePct: number; // 0-100
  extraCoachingHoursPerRemediationLearner: number;
};

/** Assumptions about what changes with Clarivue */
export type ChangeAssumptions = {
  automationRatePct: number; // 0-100  % of manual mocks Clarivue replaces
  reductionInRemediationRatePct: number; // 0-100
  placementLiftConversionFactor: number; // 0-1
};

/** One-number annual investment to adopt Clarivue */
export type Investment = {
  annualChangeInvestment: number;
};

//  Legacy types kept so old reports still parse 
export type UpliftAssumptions = {
  mockInterviewUpliftPct?: number;
  readinessUpliftPctPoints?: number;
  offerRateUpliftPctPoints?: number;
  advisorTimeSavingsPct?: number;
  retentionImprovementPct?: number;
  timeToOfferImprovementWeeks?: number;
};

/** @deprecated v1 scenario shape */
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

/** @deprecated v2 old types  kept for stored report compat */
export type Economics = {
  revenuePerPlacement: number;
  costPerSession?: number;
  fundingPerOutcome?: number;
  tuitionPerLearner?: number;
  enrollmentCredibilityUpliftPct?: number;
};

export type LeakInputs = {
  employerInterviewsPerLearner: number;
  unreadyAtInterviewRatePct: number;
  remediationRatePct: number;
  extraCoachingHoursPerRemediationLearner: number;
  employerOpportunityRationingPct: number;
};

/** @deprecated Old v2 result type */
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

//  V3 Realistic ROI types 

export type RoiRequest = {
  context: ProgramContext;
  baseline?: BaselinePerformance;
  prepCost: PrepCostInputs;
  change: ChangeAssumptions;
  investment: Investment;
};

export type RoiScenarioBreakdown = {
  /** Red card: total current annual cost of manual interview prep */
  currentPrepCost: number;
  /** Green card: advisor hours freed in dollar terms */
  advisorTimeRecovered: number;
  /** Blue card: additional learners the team can serve with freed capacity */
  additionalLearnersServed: number;
  /** Violet card: expected placement rate lift in percentage points */
  placementRateLiftPct: number;

  // Breakdown sub-components
  mockSessionCost: number;
  adminOverheadCost: number;
  remediationCost: number;
  mockTimeSaved: number;
  adminTimeSaved: number;
  remediationSaved: number;
  hoursPerLearner: number;

  // Financial summary
  netAnnualSavings: number;
  paybackMonths: number | null;
};

export type RoiResult = {
  resultVersion: 3;
  summary: RoiScenarioBreakdown;
  baselineSignals: {
    totalMockSessions: number;
    remediationLearners: number;
    totalAdvisorHoursOnPrep: number;
    unreadyRatePct: number;
  };
  sensitivity: {
    low: RoiScenarioBreakdown;
    expected: RoiScenarioBreakdown;
    high: RoiScenarioBreakdown;
  };
  assumptions: RoiRequest;
};

// ═══════════════════════════════════════════════════════════════════════════
// Database Row Types (supports V3 and V4)
// ═══════════════════════════════════════════════════════════════════════════

/** V3 row (legacy) */
export type RoiRunRow = {
  id: string;
  request: RoiRequest;
  result: RoiResult;
  result_version: number;
  narrative?: string;
  gate_passed: boolean;
  created_at?: string;
  updated_at?: string;
};

/** V4 row */
export type GapRunRow = {
  id: string;
  request: GapCalculatorRequest;
  result: GapCalculatorResult;
  result_version: 4;
  narrative?: string;
  gate_passed: boolean;
  created_at?: string;
  updated_at?: string;
};

/** Union type for any version */
export type AnyRunRow = RoiRunRow | GapRunRow;
