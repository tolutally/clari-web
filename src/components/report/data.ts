// ---------------------------------------------------------------------------
// Clarivue — Funder Report data model
// All values below are ILLUSTRATIVE (fictional "Regional Health Careers
// Program"). Replace with a real cohort's figures before publishing.
// The types are the contract; keep them stable and swap the values.
// ---------------------------------------------------------------------------

export interface ReportMeta {
  program: string;
  programType: string;
  period: string;
  preparedFor: string;
  cohort: string;
}

export interface ConfidenceChip {
  label: string;
  kind: "verified" | "auto" | "entered" | "supp";
}

export interface CostStat {
  label: string;
  value: string;
  trend?: string; // e.g. "down 19% from $14,600"
  down?: boolean;
  feature?: boolean;
}

export interface FundsRow {
  label: string;
  spec?: string;
  value: string;
  total?: boolean;
}

export interface Indicator {
  name: string;
  spec: string;
  target: string;
  actual: string;
  /** 0–100, actual position for the bar */
  actualPct: number;
  /** 0–100, target marker position */
  targetPct: number;
  met: boolean;
}

export interface PlacementStat {
  value: string;
  label: string;
  spec: string;
}

export interface ReadinessTheme {
  name: string;
  first: number; // 1–5
  latest: number; // 1–5
}

export interface ActivityStat {
  value: string;
  unit?: string;
  label: string;
  sub?: string;
}

export interface BarrierRow {
  name: string;
  participants: number;
  touchpoints: number;
  readiness: string; // "2.4 → 4.0"
  q2: string; // "72.4%"
}

export interface DecisionRow {
  signal: string;
  signalSpec: string;
  risk: string;
  action: string;
  owner: string;
  when: string;
  ongoing?: boolean;
}

export interface DefinitionRow {
  term: string;
  body: string;
}

// ---------------------------------------------------------------------------

export const meta: ReportMeta = {
  program: "Regional Health Careers Program",
  programType: "Title I Adult",
  period: "Jan 1 – Mar 31, 2026",
  preparedFor: "Local Workforce Board",
  cohort: "60 served · 52 exited",
};

export const confidenceChips: ConfidenceChip[] = [
  { label: "Employment & earnings — wage-record verified", kind: "verified" },
  { label: "Participant activity — captured automatically", kind: "auto" },
  { label: "Funds — entered by program", kind: "entered" },
  { label: "Readiness — supplementary indicator", kind: "supp" },
];

export const summary: string[] = [
  "Sixty participants were served in the 14-week healthcare support track at a total cost of $438,000. Fifty-two exited during the reporting period; four entered further education, leaving 48 in the employment denominator. All five negotiated primary indicators were met, at a cost of $11,838 per Q2 placement — down 19% from the prior cohort.",
  "Of 37 participants employed in Q2, 31 (84%) were placed in-field into healthcare roles at a median wage of $19.40/hour. Cohort readiness rose from 2.7 to 4.1 across six behavioral competencies, and participants entering with employment barriers received the most advising activity.",
];

export const costStats: CostStat[] = [
  { label: "Cost per Q2 placement", value: "$11,838", trend: "from $14,600 prior cohort", down: true, feature: true },
  { label: "Cost per credential", value: "$10,683", trend: "from $12,100", down: true },
  { label: "Cost per participant served", value: "$7,300", trend: "60 served this period" },
];

export const funds: FundsRow[] = [
  { label: "Career & support services expended", spec: "Item 3", value: "$148,000" },
  { label: "Training services expended", spec: "Item 7", value: "$290,000" },
  { label: "Total funds expended", value: "$438,000", total: true },
];

export const indicators: Indicator[] = [
  { name: "Employment Rate (Q2 after exit)", spec: "Item 16 · 37 of 48", target: "70.0%", actual: "77.1%", actualPct: 77, targetPct: 70, met: true },
  { name: "Employment Rate (Q4 after exit)", spec: "Item 19 · 35 of 48", target: "68.0%", actual: "72.9%", actualPct: 73, targetPct: 68, met: true },
  { name: "Median Earnings (Q2 after exit)", spec: "Item 26 · quarterly", target: "$5,800", actual: "$6,240", actualPct: 81, targetPct: 75, met: true },
  { name: "Credential Attainment Rate", spec: "Item 29 · 41 of 52", target: "65.0%", actual: "78.8%", actualPct: 79, targetPct: 65, met: true },
  { name: "Measurable Skill Gains", spec: "Item 32 · 38 of 52", target: "55.0%", actual: "73.1%", actualPct: 73, targetPct: 55, met: true },
];

export const placement: PlacementStat[] = [
  { value: "83.8%", label: "Placed in-field (healthcare)", spec: "31 of 37" },
  { value: "$19.40", label: "Median wage at placement", spec: "per hour" },
  { value: "85.7%", label: "Retained, same employer Q2→Q4", spec: "Item 11 · 30 of 35" },
  { value: "9", label: "Employer partners hired from this cohort", spec: "4 first-time" },
];

export const placementNote =
  "Placements concentrated across nine regional healthcare employers, including three that hired multiple graduates and four hiring from the program for the first time. Repeat and first-time employer activity both feed the partnership base the program draws on for future cohorts.";

export const readiness: ReadinessTheme[] = [
  { name: "Ownership", first: 2.6, latest: 4.0 },
  { name: "Listening", first: 2.9, latest: 4.2 },
  { name: "Composure", first: 2.3, latest: 3.8 },
  { name: "Preparation", first: 3.1, latest: 4.4 },
  { name: "Communication", first: 2.7, latest: 4.1 },
  { name: "Presence", first: 2.5, latest: 3.9 },
];

export const readinessOverall = { first: 2.7, latest: 4.1 };

export const activity: ActivityStat[] = [
  { value: "176", label: "Mock interviews completed", sub: "3.4 avg" },
  { value: "3.2", label: "Avg resume revisions per participant" },
  { value: "412", label: "Advising touchpoints", sub: "7.9 avg" },
  { value: "22", unit: "d", label: "Median days to first interview" },
  { value: "61", unit: "d", label: "Median days to first offer" },
];

export const barriers: BarrierRow[] = [
  { name: "No barrier flagged", participants: 13, touchpoints: 6.1, readiness: "3.0 → 4.3", q2: "84.6%" },
  { name: "Low-income", participants: 29, touchpoints: 9.1, readiness: "2.4 → 4.0", q2: "72.4%" },
  { name: "Long-term unemployed", participants: 14, touchpoints: 10.2, readiness: "2.2 → 3.8", q2: "71.4%" },
  { name: "Single parent", participants: 11, touchpoints: 8.7, readiness: "2.5 → 3.9", q2: "72.7%" },
  { name: "Justice-involved", participants: 6, touchpoints: 11.3, readiness: "2.1 → 3.7", q2: "66.7%" },
];

export const decisions: DecisionRow[] = [
  { signal: "Composure lowest entry competency", signalSpec: "2.3 at first attempt", risk: "Candidates underperform in live interviews", action: "Add pressure-based mock interview by week 3", owner: "Career Svc Lead", when: "Next cohort" },
  { signal: "Justice-involved subgroup placed lowest", signalSpec: "66.7% Q2", risk: "Equity gap + funder performance risk", action: "Front-load readiness and employer-partner matching earlier", owner: "Program Manager", when: "30 days" },
  { signal: "Preparation strongest entry competency", signalSpec: "3.1 at first attempt", risk: "Advising time over-allocated here", action: "Reallocate advising hours toward composure and listening", owner: "Advisor Team", when: "Next cycle" },
  { signal: "Time-to-offer improving", signalSpec: "61d, was 94d", risk: "Gain worth protecting", action: "Hold advisor cadence; document what drove the drop", owner: "Director", when: "Ongoing", ongoing: true },
  { signal: "Four first-time employers", signalSpec: "this cohort", risk: "Partnership base expanding", action: "Convert to repeat hirers via post-placement check-ins", owner: "Employer Partnerships", when: "60 days" },
];

export const certNarrative =
  "The Regional Health Careers Program met all five negotiated primary indicators for the reporting period at a declining cost per outcome. Employment, earnings, and retention outcomes reflect state wage-record matching. Readiness figures reflect participant activity captured during program delivery and are reported as supplementary context to the primary indicators.";

export const definitions: DefinitionRow[] = [
  { term: "Employment (Q2 / Q4)", body: "Employed in the second and fourth quarters after exit, per state wage records. Denominator excludes exclusionary exits (ETA-9169 OTHER REASON FOR EXIT = 00)." },
  { term: "Median earnings", body: "Midpoint of Q2-after-exit wages across employed exiters (ETA-9169 Item 26)." },
  { term: "Credential / skill gains", body: "Recognized postsecondary credential within one year of exit (Item 29); measurable skill gains per the five defined gain types (Item 32)." },
  { term: "Readiness competencies", body: "Mock interview performance scored 1–5 across six behavioral signals. Captured automatically during delivery. A leading indicator, not a WIOA performance metric." },
  { term: "Cost per outcome", body: "Program-provided funds expended divided by outcome counts; computed by Clarivue." },
];

export const portability =
  "This report follows US WIOA / ETA-9169 structure. The same underlying data maps to other funder frameworks — Canadian employment-services outcomes, private-grant agreements, or generic served/completed/placed/retained reporting — without re-collecting from participants.";

export const disclaimer =
  "Sample document. Regional Health Careers Program is fictional; all figures are illustrative and shown to demonstrate report structure. WIOA primary indicators (employment, earnings, credential attainment, measurable skill gains) and retention are state-verified, wage-record measures. Readiness competencies are leading indicators captured by Clarivue and are not WIOA performance metrics. Funds figures are program-provided.";
