# ROI Calculator Engine — v2 Challenger Architecture

## Table of Contents

1. [Overview](#overview)
2. [System Architecture](#system-architecture)
3. [Core Concept: Readiness Debt](#core-concept-readiness-debt)
4. [Type System](#type-system)
5. [Calculation Engine](#calculation-engine)
6. [Sensitivity Model](#sensitivity-model)
7. [Defaults & Heuristics](#defaults--heuristics)
8. [LLM Narrative](#llm-narrative)
9. [Storage Layer](#storage-layer)
10. [API Endpoints](#api-endpoints)
11. [Frontend Flow (5 Steps)](#frontend-flow-5-steps)
12. [Report Page](#report-page)
13. [Gate & Magic Link System](#gate--magic-link-system)
14. [Result Versioning](#result-versioning)
15. [Database Schema](#database-schema)
16. [Tests](#tests)
17. [Design Principles](#design-principles)

---

## Overview

The **Institution ROI Calculator** is a challenger-sale lead generation tool that helps educational institutions (bootcamps, universities, workforce programs) quantify the **cost of graduating interview-unready candidates** and the **value of adopting a verified-readiness operating model**.

### Framing

- **No product name** appears in any user-facing output.
- The thesis is: *institutions are paying a hidden "readiness tax"* — rework, missed outcomes, employer pullback — and a verified-readiness model recovers that lost value.
- Clarivue is "the enabler, not the thesis."

### Purpose

| Goal               | Mechanism                                          |
| ------------------- | -------------------------------------------------- |
| **Lead Capture**    | Email-gated shareable reports                      |
| **Value Demo**      | Personalized cost-of-doing-nothing projections     |
| **Sales Enablement**| Magic-link reports for stakeholder circulation      |

---

## System Architecture

```
┌─────────────────────┐
│  Frontend UI        │  ClarivueImpactCalculator.tsx
│  (5-Step Wizard)    │  Steps 1-5: Collect institution context + leak data
└──────────┬──────────┘
           │ POST /api/institutions/roi/calculate
           ▼
┌─────────────────────┐
│  Calculate Route    │  Validates inputs → calculateRoi() → buildNarrative()
│                     │  → insertRun() → returns runId + result
└──────────┬──────────┘
           │
     ┌─────┴──────┐
     ▼            ▼
┌──────────┐  ┌──────────────┐
│ Storage  │  │ LLM Narrative│  GPT-4o-mini
│ Supabase │  │ (narrative.ts)│
└──────────┘  └──────────────┘

┌─────────────────────┐
│  Assist Route       │  POST /api/institutions/roi/assist
│                     │  Returns suggested defaults for program type
└─────────────────────┘

┌─────────────────────┐
│  Gate Route         │  POST /api/institutions/roi/gate
│                     │  Captures email → creates magic link → unlocks report
└──────────┬──────────┘
           │
           ▼
┌─────────────────────┐
│  Report Page        │  /institutions/roi/report/[runId]
│  (Server Component) │  Reads run from DB → renders v1 or v2 layout
└─────────────────────┘
```

---

## Core Concept: Readiness Debt

The calculator prices three "taxes" that institutions pay when they graduate candidates who are not interview-ready:

### Block 1 — Rework Loop Tax

Advisors spend extra coaching hours re-prepping learners who were not ready for employer interviews.

$$\text{reworkCost} = L \times R_m \times H_x \times W$$

| Symbol | Meaning |
|--------|---------|
| $L$    | Cohort size (learners per year) |
| $R_m$  | Remediation rate (% of learners needing extra coaching) |
| $H_x$  | Extra coaching hours per remediation learner |
| $W$    | Advisor hourly cost (default \$60) |

### Block 2 — Outcome Leakage

When unready candidates go to interviews, a fraction of placement value is destroyed per failed interview.

$$\text{outcomeLeak} = L \times I \times U \times f \times V$$

| Symbol | Meaning |
|--------|---------|
| $I$    | Employer interviews per learner |
| $U$    | Unready-at-interview rate (0–1) |
| $f$    | `FAIL_CONVERSION_VALUE_FACTOR[programType]` — fraction of placement value destroyed per unready interview |
| $V$    | Revenue per placement |

### Block 3 — Employer Confidence Tax

When employers see weak candidates, they ration future opportunities from that institution.

$$\text{confidenceLeak} = L \times p \times O_r \times V$$

| Symbol | Meaning |
|--------|---------|
| $p$    | Placement rate proxy (`baseline.offerRatePct / 100` if supplied, else `PLACEMENT_RATE_PROXY[programType]`) |
| $O_r$  | Employer opportunity rationing rate (0–1) |

### Totals

$$\text{costOfDoingNothing} = \text{reworkCost} + \text{outcomeLeak} + \text{confidenceLeak}$$

When the institution adopts a verified-readiness operating model, each block is partially recovered:

$$\text{reworkSaved} = \text{reworkCost} \times \Delta R_m$$
$$\text{outcomeRecovered} = \text{outcomeLeak} \times \Delta U$$
$$\text{confidenceRecovered} = \text{confidenceLeak} \times \text{rec}_{O_r}$$

$$\text{valueRecovered} = \text{reworkSaved} + \text{outcomeRecovered} + \text{confidenceRecovered}$$
$$\text{netAnnual} = \text{valueRecovered} - \text{Investment}$$
$$\text{roiPct} = \frac{\text{netAnnual}}{\text{Investment}} \times 100 \quad (\text{null if Investment} \leq 0)$$
$$\text{paybackMonths} = \frac{\text{Investment}}{\text{valueRecovered}} \times 12 \quad (\text{null if valueRecovered} \leq 0)$$

---

## Type System

All types live in `src/lib/institution-roi/types.ts`.

### Input Types

```typescript
// Institution context
ProgramContext {
  institutionName?: string
  programType: "bootcamp" | "university" | "workforce" | "other"
  cohortSize: number
  advisorCount?: number
  avgAdvisorHourlyCost?: number  // default 60
  ...
}

// Status-quo leak inputs — the "readiness debt" observed today
LeakInputs {
  employerInterviewsPerLearner: number
  unreadyAtInterviewRatePct: number       // 0-100
  remediationRatePct: number              // 0-100
  extraCoachingHoursPerRemediationLearner: number
  employerOpportunityRationingPct: number // 0-100
}

// What changes under verified-readiness model
ChangeAssumptions {
  reductionInUnreadyRatePct: number           // 0-100
  reductionInRemediationRatePct: number       // 0-100
  recoveryOfRationedOpportunityPct: number    // 0-100
}

// Annual investment to adopt the approach
Investment {
  annualChangeInvestment: number
}
```

### RoiRequest

```typescript
RoiRequest {
  context: ProgramContext
  baseline?: BaselinePerformance    // optional reference data
  economics: Economics
  leak: LeakInputs
  change: ChangeAssumptions
  investment: Investment
}
```

### Output Types

```typescript
ChallengerScenarioBreakdown {
  costOfDoingNothing: number
  valueRecovered: number
  netAnnual: number
  roiPct: number | null
  paybackMonths: number | null
  reworkCost: number
  reworkSaved: number
  outcomeLeak: number
  outcomeRecovered: number
  confidenceLeak: number
  confidenceRecovered: number
}

RoiResult {
  resultVersion: 2
  summary: ChallengerScenarioBreakdown      // expected scenario (1.0x)
  baselineSignals: {
    placementProxyUsed: number
    interviewsPerYear: number
    unreadyInterviewsPerYear: number
  }
  sensitivity: {
    low: ChallengerScenarioBreakdown         // 0.8x
    expected: ChallengerScenarioBreakdown    // 1.0x
    high: ChallengerScenarioBreakdown        // 1.2x
  }
  assumptions: RoiRequest                   // echo back for audit
}
```

### Legacy Types

`UpliftAssumptions`, `ScenarioBreakdown` — marked `@deprecated`, kept so v1 report rows still parse.

---

## Calculation Engine

File: `src/lib/institution-roi/calculator.ts` (~112 lines)

### Exported Function

```typescript
calculateRoi(input: RoiRequest): RoiResult
```

### Internal Flow

1. **`computeScenario(input, multiplier)`** — private. Computes one scenario:
   - Reads leak inputs at face value (never multiplied).
   - Reads change assumptions, **multiplies each by `multiplier`** (0.8 / 1.0 / 1.2).
   - Computes three blocks → totals → returns `ChallengerScenarioBreakdown`.
2. **`calculateRoi(input)`** — calls `computeScenario` three times:
   - `expected = computeScenario(input, 1.0)`
   - `low = computeScenario(input, 0.8)`
   - `high = computeScenario(input, 1.2)`
   - Computes `baselineSignals`.
   - Returns `RoiResult`.

### Key Helpers

- **`clampPct(v, min, max)`** — clamps value to `[0, 100]` by default, guards against NaN.
- **`safe(v, floor)`** — returns `max(floor, v)`, guards against NaN/undefined.

---

## Sensitivity Model

The sensitivity band is **not** a Monte Carlo or a separate user input. It is a single multiplier applied **only** to the three change assumptions:

| Scenario | Multiplier | Meaning |
|----------|-----------|---------|
| **Low**  | 0.8x      | Conservative: the model recovers 20% less than expected |
| **Expected** | 1.0x | Base case |
| **High** | 1.2x      | Optimistic: recovers 20% more than expected |

Leak inputs (the "cost of doing nothing" side) are **never** scaled — they describe today's reality.

---

## Defaults & Heuristics

File: `src/lib/institution-roi/defaults.ts`

### Constants

**`FAIL_CONVERSION_VALUE_FACTOR`** — fraction of placement value destroyed per unready interview:

| Program Type | Factor |
|-------------|--------|
| bootcamp    | 0.35   |
| university  | 0.30   |
| workforce   | 0.40   |
| other       | 0.32   |

**`PLACEMENT_RATE_PROXY`** — fallback placement rate when `baseline.offerRatePct` is not provided:

| Program Type | Proxy |
|-------------|-------|
| bootcamp    | 0.30  |
| university  | 0.18  |
| workforce   | 0.15  |
| other       | 0.20  |

### Default Functions

| Function | Returns | Used By |
|----------|---------|---------|
| `suggestLeakDefaults(programType)` | `LeakInputs` | Assist route, frontend |
| `suggestChangeDefaults(programType)` | `ChangeAssumptions` | Assist route, frontend |
| `suggestInvestment(cohortSize, revenuePerPlacement)` | `Investment` | Assist route |
| `suggestEconomics(programType)` | `Economics` | Assist route |
| `suggestBaseline(programType)` | `BaselinePerformance` | Assist route (backward compat) |

#### `suggestInvestment` Heuristic

```
perLearner = revenue < 5k ? $100 : revenue < 10k ? $150 : $200
annualChangeInvestment = round(cohort × perLearner, nearest 100)
```

---

## LLM Narrative

File: `src/lib/institution-roi/narrative.ts`

### Function

```typescript
buildNarrative(input: RoiRequest, result: RoiResult): Promise<string>
```

### Prompt Rules

- 3–4 bullets max.
- Bullet 1: Reframe — "readiness debt" paid as rework, missed outcomes, employer pullback.
- Bullet 2: Priced cost of doing nothing.
- Bullet 3: Value recovered + payback timeline.
- Bullet 4: Sensitivity band.
- **No product name mentioned, ever.**

### Model Config

| Setting | Value |
|---------|-------|
| Model | `gpt-4o-mini` |
| Temperature | 0.35 |
| Max tokens | 260 |
| System prompt | "You produce brief, confident executive summaries about institutional readiness economics. Never mention any product name." |

### Fallback

On LLM failure, a hard-coded 4-bullet template is returned using the same data points.

---

## Storage Layer

File: `src/lib/institution-roi/storage.ts`

### Tables

| Table | Purpose |
|-------|---------|
| `institution_roi_runs` | Stores each calculation run (request, result, narrative, version) |
| `institution_roi_magic_links` | Token-hashed, time-limited shareable links |

### Functions

| Function | Description |
|----------|-------------|
| `insertRun({ request, result, narrative?, result_version? })` | Inserts a run row. `result_version` defaults to 2. Returns `{ id }`. |
| `getRun(runId)` | Fetches a run. Defaults `result_version` to 1 for legacy rows. |
| `setGatePassed(runId)` | Marks the run as gate-passed (email captured). |
| `createMagicLink(runId, email, baseUrl)` | SHA-256 hashes a random token, stores with 24h expiry, auto-unlocks run, returns link URL. |

---

## API Endpoints

All routes live under `src/app/api/institutions/roi/`.

### POST `/calculate`

**Request body:** `RoiRequest`

**Validation:**
- `context.programType` must be a valid enum value.
- `context.cohortSize > 0`
- `economics.revenuePerPlacement > 0`
- `leak.employerInterviewsPerLearner` must exist.
- `change` object must exist.
- `investment.annualChangeInvestment` required.

**Flow:**
1. Validate → 400 on failure.
2. `calculateRoi(body)` → `RoiResult`.
3. `buildNarrative(body, result)` → narrative string.
4. `insertRun({ request, result, narrative, result_version: result.resultVersion })`.
5. Return `{ runId, result, narrative }`.

### POST `/assist`

**Request body:** `{ context: { programType, cohortSize }, economics?: ... }`

**Response (`suggest` mode):** `{ baseline, economics, leak, change, investment }`

Calls `suggestLeakDefaults`, `suggestChangeDefaults`, `suggestInvestment`, `suggestBaseline`, `suggestEconomics`.

### POST `/run`

Creates a run from pre-computed data (used internally). Stores `result_version` from the result payload.

### GET `/report/[runId]`

Teaser route. Returns run summary without full result when gate is not passed.

Response varies by `result_version`:
- **v2:** Returns `baselineSignals` and `costOfDoingNothing / valueRecovered` from summary.
- **v1:** Returns legacy `baseline` and `totalValueImpact` from expected scenario.

---

## Frontend Flow (5 Steps)

File: `src/components/sections/institution/ClarivueImpactCalculator.tsx` (~780 lines)

### Step Progression

| Step | Title | Inputs |
|------|-------|--------|
| 1 | Scale | Learners per year (slider 20–2000) |
| 2 | Program Model | Funding model select (bootcamp / university / workforce / other) |
| 3 | Interview Volume | Employer interviews per learner (slider 0–5) |
| 4 | Interview Readiness | % unready at interview (slider 5–60%) |
| 5 | Economics | Value per placement ($) + Advanced toggle |

### Advanced Toggle (Step 5)

When expanded, shows:
- Remediation rate (%)
- Extra coaching hours per remediation learner
- Advisor hourly cost ($)
- Employer opportunity rationing (%)
- Annual change investment ($)

### CTA Button

> "Price the cost of weak interview readiness"

### Results View

After submission:
- **4 top metric cards:** cost of doing nothing, value recovered, payback months, ROI %
- **3 tax breakdown cards:** rework loop, outcome leakage, employer confidence — each with cost + recovered
- **Sensitivity row:** low / expected / high value recovered
- **Narrative section:** LLM-generated bullets
- **Baseline signals:** placement proxy, interviews/year, unready interviews/year
- **Lead capture:** Email input to unlock the full shareable report

No product names in any user-facing copy.

---

## Report Page

File: `src/app/institutions/roi/report/[runId]/page.tsx` (~490 lines)

### Version Router

The page reads `run.result_version` and renders:
- **v2 → `V2Report`** — Challenger layout
- **v1 → `V1Report`** — Legacy layout (preserved for old links)

### V2 Report Layout

1. **Hero:** "Annual cost of doing nothing" as the main dollar figure
2. **4 Metric Cards:** value recovered, payback months, ROI %, unready interviews/year
3. **3 TaxCard Components:** rework loop, outcome leakage, employer confidence (each with cost + recovered)
4. **Value Recovered Section:** Total with breakdown
5. **Sensitivity Table:** Low / Expected / High
6. **Narrative Block:** LLM-generated bullets
7. **"If nothing changes" callout:** Annualized readiness debt projection
8. **Collapsible Assumptions:** Full echo of all inputs

### V1 Report Layout (Legacy)

Hero with `hardValueTotal`, metric cards for `addedOffers`, `readyLearners`, `hours`, `revenue`, sensitivity table with `totalValueImpact`.

### Shared Components

- `MetricCard` — label + formatted value
- `SectionHeader` — section titles
- `TaxCard` — tax block with annual cost + amount recovered
- `AssumptionCard` — key-value pair display

---

## Gate & Magic Link System

### Flow

1. User sees teaser results on the report page.
2. User enters email → `POST /api/institutions/roi/gate` with `{ runId, email }`.
3. Backend: `createMagicLink(runId, email, baseUrl)`.
4. A random 24-byte token is generated, SHA-256 hashed, stored with 24h expiry.
5. The run is auto-unlocked (`gate_passed = true`).
6. A shareable link is returned: `/api/institutions/roi/r/{token}`.
7. Visiting that link validates the token hash and redirects to the full report.

### Security

- Tokens are never stored raw — only SHA-256 hashes.
- 24-hour expiry enforced at validation time.
- Email is normalized (trimmed, lowercased).

---

## Result Versioning

| Version | Model | Stored As |
|---------|-------|-----------|
| **1** | Legacy feature ROI (uplift-based) | `result_version = 1` (DB default) |
| **2** | Challenger readiness-debt model | `result_version = 2` |

### Backward Compatibility

- Old rows default to `result_version = 1` via DB default and code fallback.
- `getRun()` returns `result_version: 1` for rows where the column is null.
- Report page conditionally renders `V1Report` or `V2Report`.
- Teaser route returns v1 or v2 shaped previews.
- Legacy types (`UpliftAssumptions`, `ScenarioBreakdown`) are kept with `@deprecated` tags.

---

## Database Schema

### Table: `institution_roi_runs`

| Column | Type | Notes |
|--------|------|-------|
| `id` | uuid | PK, auto-generated |
| `request` | jsonb | `RoiRequest` payload |
| `result` | jsonb | `RoiResult` payload |
| `narrative` | text | LLM-generated bullet summary |
| `gate_passed` | boolean | Whether email was captured |
| `result_version` | integer | `1` (legacy) or `2` (challenger). Default `1`. |
| `created_at` | timestamptz | Auto-set |
| `updated_at` | timestamptz | Updated on gate pass |

### Table: `institution_roi_magic_links`

| Column | Type | Notes |
|--------|------|-------|
| `id` | uuid | PK |
| `run_id` | uuid | FK → `institution_roi_runs.id` |
| `email` | text | Normalized (trimmed, lowercased) |
| `token_hash` | text | SHA-256 of random token |
| `expires_at` | timestamptz | 24h from creation |
| `used_at` | timestamptz | Set on first use |

### Migration

```sql
-- migrations/sql/20250212_roi_result_version.sql
ALTER TABLE institution_roi_runs
  ADD COLUMN IF NOT EXISTS result_version integer NOT NULL DEFAULT 1;
```

---

## Tests

File: `src/lib/institution-roi/__tests__/calculator.test.ts`

19 tests using Node's built-in `assert` module. Run with:

```bash
node --import tsx src/lib/institution-roi/__tests__/calculator.test.ts
```

### Coverage

- `resultVersion` is always 2
- All `ChallengerScenarioBreakdown` fields present
- Percentage clamping (values > 100 clamped to 100)
- Edge cases: zero investment → null `roiPct`, zero `valueRecovered` → null `paybackMonths`
- Sensitivity multiplier applied only to change assumptions (leak inputs unchanged across bands)
- Sensitivity ratios verified (low ~0.8x, high ~1.2x of expected)
- `baseline.offerRatePct` overrides `PLACEMENT_RATE_PROXY`
- All 4 program types covered for both `FAIL_CONVERSION_VALUE_FACTOR` and `PLACEMENT_RATE_PROXY`
- Manual arithmetic verification for `reworkCost` and `outcomeLeak`
- `baselineSignals` correctness
- `costOfDoingNothing` = sum of 3 costs
- `valueRecovered` = sum of 3 recoveries
- `netAnnual` = `valueRecovered` – investment
- `suggestLeakDefaults`, `suggestChangeDefaults`, `suggestInvestment` output shapes

---

## Design Principles

1. **Challenger sale framing** — The calculator does not sell a product. It prices a problem (readiness debt) and shows value recovered by changing the operating model.
2. **No product mentions** — Zero references to Clarivue or any product name in user-facing output (UI, narrative, report).
3. **Sensitivity on change only** — Leak inputs describe observed reality; only "what changes" gets uncertainty bands.
4. **Backward compatibility** — Old v1 report links never break. Legacy types and code paths are preserved.
5. **Deterministic math** — No randomness in the calculator. Same inputs → same outputs.
6. **LLM as garnish** — The narrative is non-critical. Calculator works without it, and a hard-coded fallback exists.
7. **Lead capture as unlock** — Full report requires email gate passage; teaser shows enough to entice.
