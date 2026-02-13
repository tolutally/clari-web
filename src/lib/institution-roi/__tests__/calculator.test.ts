/**
 * Unit tests for the Challenger ROI calculator engine.
 * Run with: npx tsx src/lib/institution-roi/__tests__/calculator.test.ts
 *
 * Uses Node built-in assert — no test framework dependency required.
 */

import assert from "node:assert/strict";
import { calculateRoi } from "../calculator";
import {
  FAIL_CONVERSION_VALUE_FACTOR,
  PLACEMENT_RATE_PROXY,
  suggestLeakDefaults,
  suggestChangeDefaults,
  suggestInvestment,
} from "../defaults";
import type { RoiRequest } from "../types";

/* ── Helpers ─────────────────────────────────────────────────────────── */

function makeRequest(overrides: Partial<RoiRequest> = {}): RoiRequest {
  return {
    context: { programType: "bootcamp", cohortSize: 100, avgAdvisorHourlyCost: 60 },
    economics: { revenuePerPlacement: 10_000 },
    leak: {
      employerInterviewsPerLearner: 3,
      unreadyAtInterviewRatePct: 25,
      remediationRatePct: 30,
      extraCoachingHoursPerRemediationLearner: 3,
      employerOpportunityRationingPct: 10,
    },
    change: {
      reductionInUnreadyRatePct: 20,
      reductionInRemediationRatePct: 25,
      recoveryOfRationedOpportunityPct: 30,
    },
    investment: { annualChangeInvestment: 15_000 },
    ...overrides,
  };
}

function approx(actual: number, expected: number, tolerance = 0.5, msg?: string) {
  assert.ok(
    Math.abs(actual - expected) <= tolerance,
    `${msg ?? "approx"}: expected ~${expected}, got ${actual}`,
  );
}

/* ── Tests ───────────────────────────────────────────────────────────── */

let pass = 0;
let fail = 0;

function test(name: string, fn: () => void) {
  try {
    fn();
    pass++;
    console.log(`  ✓ ${name}`);
  } catch (err: any) {
    fail++;
    console.error(`  ✗ ${name}`);
    console.error(`    ${err.message}`);
  }
}

console.log("\n=== Calculator Tests ===\n");

// 1. Result version is 2
test("resultVersion is 2", () => {
  const res = calculateRoi(makeRequest());
  assert.equal(res.resultVersion, 2);
});

// 2. Summary fields exist
test("summary has all required fields", () => {
  const s = calculateRoi(makeRequest()).summary;
  const keys = [
    "costOfDoingNothing", "valueRecovered", "netAnnual",
    "roiPct", "paybackMonths",
    "reworkCost", "reworkSaved",
    "outcomeLeak", "outcomeRecovered",
    "confidenceLeak", "confidenceRecovered",
  ];
  for (const k of keys) {
    assert.ok(k in s, `missing summary field: ${k}`);
  }
});

// 3. Pct clamping — unreadyAtInterviewRatePct > 100 gets clamped
test("pct clamping: unready > 100 clamped to 100", () => {
  const req = makeRequest({
    leak: {
      ...makeRequest().leak,
      unreadyAtInterviewRatePct: 150,
    },
  });
  const res = calculateRoi(req);
  // With 100% unready: outcomeLeak = L * I * 1.0 * failFactor * V
  const expected = 100 * 3 * 1.0 * 0.35 * 10_000;
  approx(res.summary.outcomeLeak, expected, 1, "outcomeLeak with clamped pct");
});

// 4. Zero investment → roiPct is null
test("zero investment → roiPct is null", () => {
  const req = makeRequest({ investment: { annualChangeInvestment: 0 } });
  const res = calculateRoi(req);
  assert.equal(res.summary.roiPct, null, "roiPct should be null when investment is 0");
});

// 5. Zero valueRecovered → paybackMonths is null
test("zero valueRecovered → paybackMonths is null", () => {
  const req = makeRequest({
    change: {
      reductionInUnreadyRatePct: 0,
      reductionInRemediationRatePct: 0,
      recoveryOfRationedOpportunityPct: 0,
    },
  });
  const res = calculateRoi(req);
  assert.equal(res.summary.valueRecovered, 0);
  assert.equal(res.summary.paybackMonths, null);
});

// 6. Sensitivity applies multiplier to change assumptions only
test("sensitivity multiplier only on change assumptions", () => {
  const req = makeRequest();
  const res = calculateRoi(req);

  // costOfDoingNothing should be SAME across all scenarios (leak-side only)
  approx(res.sensitivity.low.costOfDoingNothing, res.sensitivity.expected.costOfDoingNothing, 0.01,
    "low.costOfDoingNothing == expected.costOfDoingNothing");
  approx(res.sensitivity.high.costOfDoingNothing, res.sensitivity.expected.costOfDoingNothing, 0.01,
    "high.costOfDoingNothing == expected.costOfDoingNothing");

  // valueRecovered should differ: low < expected < high
  assert.ok(res.sensitivity.low.valueRecovered < res.sensitivity.expected.valueRecovered,
    "low.valueRecovered < expected.valueRecovered");
  assert.ok(res.sensitivity.expected.valueRecovered < res.sensitivity.high.valueRecovered,
    "expected.valueRecovered < high.valueRecovered");
});

// 7. Sensitivity ratios: low = 0.8x, high = 1.2x of expected recovered
test("sensitivity ratios: low ≈ 0.8x, high ≈ 1.2x", () => {
  const res = calculateRoi(makeRequest());
  const exp = res.sensitivity.expected.valueRecovered;
  approx(res.sensitivity.low.valueRecovered / exp, 0.8, 0.01, "low ratio");
  approx(res.sensitivity.high.valueRecovered / exp, 1.2, 0.01, "high ratio");
});

// 8. baseline.offerRatePct overrides PLACEMENT_RATE_PROXY
test("baseline.offerRatePct overrides placement proxy", () => {
  const reqWithBaseline = makeRequest({ baseline: { offerRatePct: 50 } });
  const reqWithoutBaseline = makeRequest();

  const withB = calculateRoi(reqWithBaseline);
  const withoutB = calculateRoi(reqWithoutBaseline);

  assert.equal(withB.baselineSignals.placementProxyUsed, 0.5);
  assert.equal(withoutB.baselineSignals.placementProxyUsed, PLACEMENT_RATE_PROXY.bootcamp);
  assert.notEqual(withB.summary.confidenceLeak, withoutB.summary.confidenceLeak);
});

// 9. All program types have defaults in FAIL_CONVERSION_VALUE_FACTOR
test("all program types have FAIL_CONVERSION_VALUE_FACTOR", () => {
  for (const t of ["bootcamp", "university", "workforce", "other"]) {
    assert.ok(t in FAIL_CONVERSION_VALUE_FACTOR, `missing ${t} in FAIL_CONVERSION_VALUE_FACTOR`);
    assert.ok(FAIL_CONVERSION_VALUE_FACTOR[t] > 0 && FAIL_CONVERSION_VALUE_FACTOR[t] < 1);
  }
});

// 10. All program types have defaults in PLACEMENT_RATE_PROXY
test("all program types have PLACEMENT_RATE_PROXY", () => {
  for (const t of ["bootcamp", "university", "workforce", "other"]) {
    assert.ok(t in PLACEMENT_RATE_PROXY, `missing ${t} in PLACEMENT_RATE_PROXY`);
    assert.ok(PLACEMENT_RATE_PROXY[t] > 0 && PLACEMENT_RATE_PROXY[t] < 1);
  }
});

// 11. Manual math check — rework cost
test("rework cost = L × Rm × Hx × W", () => {
  const req = makeRequest();
  const res = calculateRoi(req);
  const expected = 100 * 0.30 * 3 * 60; // 5400
  approx(res.summary.reworkCost, expected, 0.01, "rework cost");
});

// 12. Manual math check — outcome leak
test("outcome leak = L × I × U × failFactor × V", () => {
  const req = makeRequest();
  const res = calculateRoi(req);
  const expected = 100 * 3 * 0.25 * 0.35 * 10_000; // 26250
  approx(res.summary.outcomeLeak, expected, 0.01, "outcome leak");
});

// 13. Baseline signals
test("baselineSignals computed correctly", () => {
  const req = makeRequest();
  const res = calculateRoi(req);
  assert.equal(res.baselineSignals.interviewsPerYear, 300); // 100 * 3
  assert.equal(res.baselineSignals.unreadyInterviewsPerYear, 75); // 100 * 3 * 0.25
});

// 14. costOfDoingNothing = sum of 3 taxes
test("costOfDoingNothing = rework + outcomeLeak + confidenceLeak", () => {
  const res = calculateRoi(makeRequest());
  const s = res.summary;
  approx(s.costOfDoingNothing, s.reworkCost + s.outcomeLeak + s.confidenceLeak, 0.01);
});

// 15. valueRecovered = sum of 3 recovery blocks
test("valueRecovered = reworkSaved + outcomeRecovered + confidenceRecovered", () => {
  const res = calculateRoi(makeRequest());
  const s = res.summary;
  approx(s.valueRecovered, s.reworkSaved + s.outcomeRecovered + s.confidenceRecovered, 0.01);
});

// 16. netAnnual = valueRecovered - investment
test("netAnnual = valueRecovered - investment", () => {
  const req = makeRequest();
  const res = calculateRoi(req);
  approx(res.summary.netAnnual, res.summary.valueRecovered - 15_000, 0.01);
});

console.log("\n=== Defaults Tests ===\n");

// 17. suggestLeakDefaults returns valid values for each program type
test("suggestLeakDefaults for all program types", () => {
  for (const pt of ["bootcamp", "university", "workforce", "other"] as const) {
    const d = suggestLeakDefaults(pt);
    assert.ok(d.employerInterviewsPerLearner > 0, `${pt} interviews`);
    assert.ok(d.unreadyAtInterviewRatePct > 0 && d.unreadyAtInterviewRatePct <= 100, `${pt} unready`);
    assert.ok(d.remediationRatePct >= 0 && d.remediationRatePct <= 100, `${pt} remediation`);
    assert.ok(d.extraCoachingHoursPerRemediationLearner >= 0, `${pt} coaching hrs`);
    assert.ok(d.employerOpportunityRationingPct >= 0, `${pt} rationing`);
  }
});

// 18. suggestChangeDefaults returns valid values
test("suggestChangeDefaults for all program types", () => {
  for (const pt of ["bootcamp", "university", "workforce", "other"] as const) {
    const d = suggestChangeDefaults(pt);
    assert.ok(d.reductionInUnreadyRatePct > 0 && d.reductionInUnreadyRatePct <= 100);
    assert.ok(d.reductionInRemediationRatePct > 0 && d.reductionInRemediationRatePct <= 100);
    assert.ok(d.recoveryOfRationedOpportunityPct > 0 && d.recoveryOfRationedOpportunityPct <= 100);
  }
});

// 19. suggestInvestment returns sane values
test("suggestInvestment returns positive, rounded value", () => {
  const inv = suggestInvestment(100, 10_000);
  assert.ok(inv.annualChangeInvestment > 0);
  assert.equal(inv.annualChangeInvestment % 100, 0, "should be rounded to nearest 100");
});

/* ── Summary ─────────────────────────────────────────────────────────── */

console.log(`\n${pass + fail} tests: ${pass} passed, ${fail} failed\n`);
if (fail > 0) process.exit(1);
