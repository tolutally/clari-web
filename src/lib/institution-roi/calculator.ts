import { RoiRequest, RoiResult, ScenarioBreakdown } from "./types";

const clampPct = (v: number | undefined, min = 0, max = 100) =>
  Math.min(max, Math.max(min, Number.isFinite(v ?? NaN) ? (v as number) : 0));

const safe = (v: number | undefined) => (Number.isFinite(v ?? NaN) ? (v as number) : 0);

function computeScenario(input: RoiRequest, multiplier = 1): ScenarioBreakdown {
  const cohort = Math.max(0, safe(input.context.cohortSize));

  const readinessRate = clampPct(input.baseline.readinessRatePct) / 100;
  const offerRate = clampPct(input.baseline.offerRatePct) / 100;
  const readinessUplift = clampPct(input.uplift.readinessUpliftPctPoints) / 100;
  const offerUplift = clampPct(input.uplift.offerRateUpliftPctPoints) / 100;
  const advisorTimeSavings = clampPct(input.uplift.advisorTimeSavingsPct) / 100;

  const mockInterviewsPerLearner = safe(input.baseline.mockInterviewsPerLearner);
  const sessionUplift = 1 + (safe(input.uplift.mockInterviewUpliftPct) / 100 || 0);
  const baselineSessionsRaw = mockInterviewsPerLearner * cohort;
  const baselineSessions = baselineSessionsRaw * sessionUplift;

  const avgSessionDurationHours = safe(input.context.avgSessionDurationHours) || 0.75;
  // Keep advisorHourlyCost for time savings only
  const advisorHourlyCost = safe(input.context.avgAdvisorHourlyCost) || 0;
  // Use explicit costPerSession when provided; otherwise fall back to time-based approximation
  const explicitCostPerSession = safe(input.economics.costPerSession);
  const costPerSessionRate =
    explicitCostPerSession || (avgSessionDurationHours > 0 ? avgSessionDurationHours * advisorHourlyCost : advisorHourlyCost);
  const revenuePerPlacement = safe(input.economics.revenuePerPlacement);
  const tuitionPerLearner = safe(input.economics.tuitionPerLearner);
  const enrollmentUpliftPct = safe(input.economics.enrollmentCredibilityUpliftPct) / 100 || 0;

  const addedReadyLearners = cohort * readinessUplift * multiplier;
  const baselineReady = cohort * readinessRate;
  const finalReady = clampPct((baselineReady + addedReadyLearners) / cohort * 100) / 100;

  const addedOffers = cohort * offerUplift * multiplier;
  const baselineOffers = cohort * offerRate;
  const finalOffers = clampPct((baselineOffers + addedOffers) / cohort * 100) / 100;

  const advisorHoursSaved = baselineSessions * advisorTimeSavings * avgSessionDurationHours * multiplier;
  const costSavings = advisorHoursSaved * advisorHourlyCost;
  const revenueImpact = addedOffers * revenuePerPlacement;
  const addedSessions = Math.max(0, baselineSessions - baselineSessionsRaw);
  const addedSessionsCost = addedSessions * costPerSessionRate;

  const baselineTimeToOffer = safe(input.baseline.avgTimeToOfferWeeks);
  const hasBaselineTime = Number.isFinite(baselineTimeToOffer);
  const newTimeToOffer =
    hasBaselineTime && input.uplift.timeToOfferImprovementWeeks
      ? Math.max(0, baselineTimeToOffer - safe(input.uplift.timeToOfferImprovementWeeks) * multiplier)
      : hasBaselineTime
        ? baselineTimeToOffer
        : null;

  return {
    totalValueImpact: revenueImpact + costSavings - addedSessionsCost,
    revenueImpact,
    costSavings,
    addedSessionsCost,
    advisorHoursSaved,
    addedReadyLearners: cohort * (finalReady - readinessRate),
    addedOffers: cohort * (finalOffers - offerRate),
    newTimeToOfferWeeks: Number.isFinite(newTimeToOffer ?? NaN) ? (newTimeToOffer as number) : null,
    // enrollment impact modeled separately (handled in buildResult)
  };
}

export function calculateRoi(input: RoiRequest): RoiResult {
  const expected = computeScenario(input, 1);
  const low = computeScenario(input, 0.8);
  const high = computeScenario(input, 1.2);

  const baselineReady = input.context.cohortSize * (clampPct(input.baseline.readinessRatePct) / 100);
  const baselineOffers = input.context.cohortSize * (clampPct(input.baseline.offerRatePct) / 100);
  const baselineSessions = safe(input.baseline.mockInterviewsPerLearner) * safe(input.context.cohortSize);

  // Outcome funding impact (for programs paid per successful outcome)
  const outcomeFundingPerOffer = safe(input.economics.fundingPerOutcome);
  const outcomeFundingUplift = expected.addedOffers * outcomeFundingPerOffer;

  // Simple retention/tuition protection model: at-risk tuition from placement gap; protection from added offers
  const tuitionPerLearner = safe(input.economics.tuitionPerLearner);
  const baseEnrollmentAtRisk = Math.max(
    0,
    (1 - clampPct(input.baseline.offerRatePct) / 100) * safe(input.context.cohortSize) * tuitionPerLearner,
  );
  const enrollmentProtection = Math.min(baseEnrollmentAtRisk, expected.addedOffers * tuitionPerLearner);

  return {
    summary: expected,
    enrollment: {
      atRisk: baseEnrollmentAtRisk,
      uplift: enrollmentProtection,
    },
    baseline: {
      readyLearners: baselineReady,
      offers: baselineOffers,
      sessions: baselineSessions,
    },
    timeline: {
      baselineTimeToOfferWeeks: safe(input.baseline.avgTimeToOfferWeeks) || null,
      newTimeToOfferWeeks: expected.newTimeToOfferWeeks,
    },
    sensitivity: {
      low,
      expected,
      high,
    },
    assumptions: {
      ...input,
      economics: {
        ...input.economics,
        fundingPerOutcome: outcomeFundingPerOffer,
      },
    },
  };
}
