/**
 * Unit tests for the V3 ROI calculator engine.
 * Run with: npx tsx src/lib/institution-roi/__tests__/calculator.test.ts
 *
 * Uses Node built-in assert - no test framework dependency required.
 */

import assert from "node:assert/strict";
import { calculateRoi } from "../calculator";
import {
  suggestPrepCostDefaults,
  suggestChangeDefaults,
  suggestInvestment,
} from "../defaults";
import type { RoiRequest } from "../types";

/* -- Helpers -- */

function makeRequest(overrides: Partial<RoiRequest> = {}): RoiRequest {
  return {
    context: { programType: "bootcamp", cohortSize: 100, avgAdvisorHourlyCost: 60 },
    prepCost: {
      mocksPerLearner: 3,
      costPerSession: 55,
      adminOverheadMinutesPerSession: 15,
      remediationRatePct: 30,
      extraCoachingHoursPerRemediationLearner: 3,
    },
    change: {
      automationRatePct: 65,
      reductionInRemediationRatePct: 25,
      placementLiftConversionFactor: 0.45,
    },
    investment: { annualChangeInvestment: 15_000 },
    ...overrides,
  };
}

function approx(actual: number, expected: number, tolerance = 1, msg?: string) {
  assert.ok(
    Math.abs(actual - expected) <= tolerance,
    `${msg ?? "approx"}: expected ~${expected}, got ${actual}`,
  );
}

/* -- Tests -- */

let pass = 0;
let fail = 0;

function test(name: string, fn: () => void) {
  try {
    fn();
    pass++;
    console.log("  + " + name);
  } catch (err: any) {
    fail++;
    console.error("  x " + name);
    console.error("    " + err.message);
  }
}

console.log("\n=== V3 Calculator Tests ===\n");

// 1. Result version is 3
test("resultVersion is 3", () => {
  const res = calculateRoi(makeRequest());
  assert.equal(res.resultVersion, 3);
});

// 2. Summary fields exist
test("summary has all required fields", () => {
  const s = calculateRoi(makeRequest()).summary;
  const keys = [
    "currentPrepCost", "advisorTimeRecovered", "additionalLearnersServed",
    "placementRateLiftPct",
    "mockSessionCost", "adminOverheadCost", "remediationCost",
    "mockTimeSaved", "adminTimeSaved", "remediationSaved",
    "hoursPerLearner", "netAnnualSavings", "paybackMonths",
  ];
  for (const k of keys) {
    assert.ok(k in s, "missing summary field: " + k);
  }
});

// 3. Manual math: currentPrepCost
test("currentPrepCost = mockSessionCost + adminOverheadCost + remediationCost", () => {
  const req = makeRequest();
  const s = calculateRoi(req).summary;
  // mockSessionCost = 100 * 3 * 55 = 16500
  approx(s.mockSessionCost, 16500, 0.01, "mockSessionCost");
  // adminOverheadCost = 300 * (15/60) * 60 = 4500
  approx(s.adminOverheadCost, 4500, 0.01, "adminOverheadCost");
  // remediationCost = 100 * 0.30 * 3 * 60 = 5400
  approx(s.remediationCost, 5400, 0.01, "remediationCost");
  // total
  approx(s.currentPrepCost, 16500 + 4500 + 5400, 0.01, "currentPrepCost");
});

// 4. Manual math: advisorTimeRecovered
test("advisorTimeRecovered = mockTimeSaved + adminTimeSaved + remediationSaved", () => {
  const req = makeRequest();
  const s = calculateRoi(req).summary;
  // mockTimeSaved = 300 * 0.65 * 1 * 60 = 11700
  approx(s.mockTimeSaved, 11700, 0.01, "mockTimeSaved");
  // adminTimeSaved = 300 * 0.65 * (15/60) * 60 = 2925
  approx(s.adminTimeSaved, 2925, 0.01, "adminTimeSaved");
  // remediationSaved = 5400 * 0.25 = 1350
  approx(s.remediationSaved, 1350, 0.01, "remediationSaved");
  // total
  approx(s.advisorTimeRecovered, 11700 + 2925 + 1350, 1, "advisorTimeRecovered");
});

// 5. Manual math: additionalLearnersServed
test("additionalLearnersServed computed correctly", () => {
  const req = makeRequest();
  const s = calculateRoi(req).summary;
  // hoursSaved = 300*0.65*1 + 300*0.65*(15/60) + 30*3*0.25
  //            = 195 + 48.75 + 22.5 = 266.25
  // hoursPerLearner = 3*1 + 3*(15/60) = 3 + 0.75 = 3.75
  // additional = floor(266.25 / 3.75) = floor(71) = 71
  assert.equal(s.additionalLearnersServed, 71);
});

// 6. Manual math: placementRateLiftPct
test("placementRateLiftPct = unreadyRate * remReduction * liftFactor * 100", () => {
  const req = makeRequest();
  const s = calculateRoi(req).summary;
  // 0.30 * 0.25 * 0.45 * 100 = 3.375
  approx(s.placementRateLiftPct, 3.375, 0.01, "placementRateLiftPct");
});

// 7. Zero investment -> paybackMonths is 0 (or null based on recovered)
test("zero investment -> paybackMonths is 0", () => {
  const req = makeRequest({ investment: { annualChangeInvestment: 0 } });
  const res = calculateRoi(req);
  // paybackMonths = (0 / advisorTimeRecovered) * 12 = 0
  approx(res.summary.paybackMonths!, 0, 0.01);
});

// 8. Zero change assumptions -> no savings
test("zero change assumptions -> no savings", () => {
  const req = makeRequest({
    change: {
      automationRatePct: 0,
      reductionInRemediationRatePct: 0,
      placementLiftConversionFactor: 0,
    },
  });
  const res = calculateRoi(req);
  assert.equal(res.summary.advisorTimeRecovered, 0);
  assert.equal(res.summary.additionalLearnersServed, 0);
  assert.equal(res.summary.placementRateLiftPct, 0);
  assert.equal(res.summary.paybackMonths, null);
});

// 9. Sensitivity multiplier: currentPrepCost is same across all scenarios
test("sensitivity: currentPrepCost same across scenarios", () => {
  const res = calculateRoi(makeRequest());
  approx(res.sensitivity.low.currentPrepCost, res.sensitivity.expected.currentPrepCost, 0.01,
    "low.currentPrepCost == expected.currentPrepCost");
  approx(res.sensitivity.high.currentPrepCost, res.sensitivity.expected.currentPrepCost, 0.01,
    "high.currentPrepCost == expected.currentPrepCost");
});

// 10. Sensitivity: advisorTimeRecovered -- low < expected < high
test("sensitivity: low.advisorTimeRecovered < expected < high", () => {
  const res = calculateRoi(makeRequest());
  assert.ok(res.sensitivity.low.advisorTimeRecovered < res.sensitivity.expected.advisorTimeRecovered,
    "low < expected");
  assert.ok(res.sensitivity.expected.advisorTimeRecovered < res.sensitivity.high.advisorTimeRecovered,
    "expected < high");
});

// 11. Sensitivity ratios: low ~0.8x, high ~1.2x
test("sensitivity ratios: low ~ 0.8x, high ~ 1.2x", () => {
  const res = calculateRoi(makeRequest());
  const exp = res.sensitivity.expected.advisorTimeRecovered;
  approx(res.sensitivity.low.advisorTimeRecovered / exp, 0.8, 0.02, "low ratio");
  approx(res.sensitivity.high.advisorTimeRecovered / exp, 1.2, 0.02, "high ratio");
});

// 12. Pct clamping: remediationRatePct > 100 gets clamped
test("pct clamping: remediationRatePct > 100 clamped to 100", () => {
  const req = makeRequest({
    prepCost: {
      ...makeRequest().prepCost,
      remediationRatePct: 150,
    },
  });
  const res = calculateRoi(req);
  // With 100% remediation: cost = 100 * 1.0 * 3 * 60 = 18000
  approx(res.summary.remediationCost, 18000, 0.01, "remediationCost with clamped pct");
});

// 13. netAnnualSavings = advisorTimeRecovered - investment
test("netAnnualSavings = advisorTimeRecovered - investment", () => {
  const req = makeRequest();
  const res = calculateRoi(req);
  approx(res.summary.netAnnualSavings, res.summary.advisorTimeRecovered - 15_000, 1);
});

// 14. baselineSignals
test("baselineSignals computed correctly", () => {
  const req = makeRequest();
  const res = calculateRoi(req);
  assert.equal(res.baselineSignals.totalMockSessions, 300); // 100 * 3
  assert.equal(res.baselineSignals.remediationLearners, 30); // 100 * 0.30
  assert.equal(res.baselineSignals.unreadyRatePct, 30);
});

// 15. paybackMonths formula
test("paybackMonths = (investment / advisorTimeRecovered) * 12", () => {
  const req = makeRequest();
  const res = calculateRoi(req);
  const expected = (15_000 / res.summary.advisorTimeRecovered) * 12;
  approx(res.summary.paybackMonths!, expected, 0.01);
});

console.log("\n=== Defaults Tests ===\n");

// 16. suggestPrepCostDefaults returns valid values
test("suggestPrepCostDefaults for all program types", () => {
  for (const pt of ["bootcamp", "university", "workforce", "other"] as const) {
    const d = suggestPrepCostDefaults(pt);
    assert.ok(d.mocksPerLearner > 0, pt + " mocks");
    assert.ok(d.costPerSession > 0, pt + " costPerSession");
    assert.ok(d.adminOverheadMinutesPerSession > 0, pt + " admin");
    assert.ok(d.remediationRatePct >= 0 && d.remediationRatePct <= 100, pt + " remediation");
    assert.ok(d.extraCoachingHoursPerRemediationLearner >= 0, pt + " coaching hrs");
  }
});

// 17. suggestChangeDefaults returns valid values
test("suggestChangeDefaults for all program types", () => {
  for (const pt of ["bootcamp", "university", "workforce", "other"] as const) {
    const d = suggestChangeDefaults(pt);
    assert.ok(d.automationRatePct > 0 && d.automationRatePct <= 100, pt + " automation");
    assert.ok(d.reductionInRemediationRatePct > 0 && d.reductionInRemediationRatePct <= 100, pt + " remediation reduction");
    assert.ok(d.placementLiftConversionFactor > 0 && d.placementLiftConversionFactor <= 1, pt + " lift factor");
  }
});

// 18. suggestInvestment returns positive, rounded value
test("suggestInvestment returns positive, rounded value", () => {
  const inv = suggestInvestment(100);
  assert.ok(inv.annualChangeInvestment > 0);
  assert.equal(inv.annualChangeInvestment % 100, 0, "should be rounded to nearest 100");
});

// 19. Large cohort produces reasonable numbers
test("large cohort (500 learners) produces reasonable numbers", () => {
  const req = makeRequest({
    context: { programType: "workforce", cohortSize: 500, avgAdvisorHourlyCost: 55 },
  });
  const res = calculateRoi(req);
  // currentPrepCost should be > 0 and < 500k for 500 learners
  assert.ok(res.summary.currentPrepCost > 0, "currentPrepCost > 0");
  assert.ok(res.summary.currentPrepCost < 500_000, "currentPrepCost < 500k");
  // advisorTimeRecovered should be > 0 and < currentPrepCost
  assert.ok(res.summary.advisorTimeRecovered > 0, "advisorTimeRecovered > 0");
  assert.ok(res.summary.advisorTimeRecovered < res.summary.currentPrepCost, "recovered < total cost");
  // placementRateLiftPct should be reasonable (0-10 pp range)
  assert.ok(res.summary.placementRateLiftPct > 0, "lift > 0");
  assert.ok(res.summary.placementRateLiftPct < 10, "lift < 10pp");
});

/* -- Summary -- */

console.log("\n" + (pass + fail) + " tests: " + pass + " passed, " + fail + " failed\n");
if (fail > 0) process.exit(1);
