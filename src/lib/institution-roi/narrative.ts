import { callLlm } from "@/lib/interview-research/llmClient";
import type { RoiRequest, RoiResult } from "./types";

export async function buildNarrative(input: RoiRequest, result: RoiResult): Promise<string> {
  const { summary, sensitivity } = result;

  const fmt = (n: number) => `$${Math.round(n).toLocaleString("en-US")}`;

  const prompt = `Write a concise executive take (3-4 bullets) for a career-services director about the cost of their current manual interview-prep model and the operational gains from automating it.

Context:
- Institution type: ${input.context.programType}
- Cohort size: ${input.context.cohortSize}
- Current annual interview-prep cost: ${fmt(summary.currentPrepCost)}
  - Mock session cost: ${fmt(summary.mockSessionCost)}
  - Admin overhead cost: ${fmt(summary.adminOverheadCost)}
  - Remediation coaching cost: ${fmt(summary.remediationCost)}
- Advisor time recovered (annual dollar value): ${fmt(summary.advisorTimeRecovered)}
- Additional learners the team can serve: ${summary.additionalLearnersServed}
- Estimated placement-rate lift: ${summary.placementRateLiftPct.toFixed(1)} percentage points
- Payback: ${summary.paybackMonths != null ? `${summary.paybackMonths.toFixed(1)} months` : "N/A"}
- Conservative to upside time-recovered range: ${fmt(sensitivity.low.advisorTimeRecovered)} to ${fmt(sensitivity.high.advisorTimeRecovered)}

Rules:
- 3 to 4 bullets max.
- First bullet: state the hidden cost — manual mock interviews, scheduling overhead, and repeat coaching add up to a real annual line item.
- Second bullet: state the time recovered and what it means in capacity (additional learners served).
- Third bullet: mention the placement-rate lift and payback timeline.
- Fourth bullet (optional): state the sensitivity band.
- Plain language, no fluff. Do NOT mention any product name.
- Return bullets separated by newline.`;

  try {
    const resp = await callLlm({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content:
            "You produce brief, confident executive summaries about career-services operational economics. Never mention any product name.",
        },
        { role: "user", content: prompt },
      ],
      temperature: 0.35,
      maxTokens: 260,
    });
    return resp;
  } catch {
    // Hard-coded fallback
    return [
      `Your current manual interview-prep model costs an estimated ${fmt(summary.currentPrepCost)} per year in staff time, mock sessions, and remediation coaching.`,
      `Automating the bulk of mock delivery recovers ~${fmt(summary.advisorTimeRecovered)} in advisor capacity, enough to serve ${summary.additionalLearnersServed} additional learners per year.`,
      `Expected placement-rate lift of ${summary.placementRateLiftPct.toFixed(1)} percentage points${summary.paybackMonths != null ? `, with full payback in ${summary.paybackMonths.toFixed(1)} months` : ""}.`,
      `Conservative to upside time-recovered range: ${fmt(sensitivity.low.advisorTimeRecovered)} to ${fmt(sensitivity.high.advisorTimeRecovered)}.`,
    ].join("\n");
  }
}
