import { callLlm } from "@/lib/interview-research/llmClient";
import type { RoiRequest, RoiResult } from "./types";

export async function buildNarrative(input: RoiRequest, result: RoiResult): Promise<string> {
  const { summary, sensitivity } = result;
  const prompt = `Write a concise executive take (3-4 bullets) for an institution stakeholder about interview readiness ROI.

Context:
- Institution type: ${input.context.programType}
- Cohort size: ${input.context.cohortSize}
- Added offers: ${summary.addedOffers.toFixed(1)}
- Added ready learners: ${summary.addedReadyLearners.toFixed(1)}
- Advisor hours saved: ${summary.advisorHoursSaved.toFixed(1)}
- Revenue impact: $${summary.revenueImpact.toFixed(0)}
- Cost savings: $${summary.costSavings.toFixed(0)}
- Total impact (expected): $${summary.totalValueImpact.toFixed(0)}
- Sensitivity low/high total: $${sensitivity.low.totalValueImpact.toFixed(0)} / $${sensitivity.high.totalValueImpact.toFixed(0)}

Rules:
- 3 to 4 bullets max.
- Plain language, no fluff.
- Mention both revenue/offer lift and advisor time savings.
- Note the upside/downside band briefly.
- Return bullets separated by newline.`;

  try {
    const resp = await callLlm({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: "You produce brief, confident executive summaries." },
        { role: "user", content: prompt },
      ],
      temperature: 0.35,
      maxTokens: 220,
    });
    return resp;
  } catch {
    return [
      `Expect ~$${summary.totalValueImpact.toFixed(0)} total impact combining revenue lift and advisor savings.`,
      `${summary.addedOffers.toFixed(1)} additional offers and ${summary.addedReadyLearners.toFixed(1)} more ready learners.`,
      `${summary.advisorHoursSaved.toFixed(1)} advisor hours saved; low/high band: $${sensitivity.low.totalValueImpact.toFixed(
        0,
      )}–$${sensitivity.high.totalValueImpact.toFixed(0)}.`,
    ].join("\n");
  }
}
