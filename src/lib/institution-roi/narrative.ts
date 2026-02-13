import { callLlm } from "@/lib/interview-research/llmClient";
import type { RoiRequest, RoiResult } from "./types";

export async function buildNarrative(input: RoiRequest, result: RoiResult): Promise<string> {
  const { summary, sensitivity } = result;

  const fmt = (n: number) => `$${Math.round(n).toLocaleString("en-US")}`;

  const prompt = `Write a concise executive take (3-4 bullets) for an institution stakeholder about the cost of graduating interview-unready candidates and the value of adopting a verified readiness operating model.

Context:
- Institution type: ${input.context.programType}
- Cohort size: ${input.context.cohortSize}
- Annual cost of doing nothing: ${fmt(summary.costOfDoingNothing)}
- Rework loop tax: ${fmt(summary.reworkCost)}
- Outcome leakage: ${fmt(summary.outcomeLeak)}
- Employer confidence tax: ${fmt(summary.confidenceLeak)}
- Annual value recovered with verified readiness: ${fmt(summary.valueRecovered)}
- Net annual benefit: ${fmt(summary.netAnnual)}
- ROI: ${summary.roiPct != null ? `${summary.roiPct.toFixed(0)}%` : "N/A"}
- Payback: ${summary.paybackMonths != null ? `${summary.paybackMonths.toFixed(1)} months` : "N/A"}
- Low/high annual value recovered: ${fmt(sensitivity.low.valueRecovered)} / ${fmt(sensitivity.high.valueRecovered)}

Rules:
- 3 to 4 bullets max.
- First bullet states the reframe: current interview prep creates "readiness debt" paid as rework, missed outcomes, and employer pullback.
- Second bullet states the priced cost of doing nothing.
- Third bullet states the value recovered and payback timeline.
- Fourth bullet states the sensitivity band.
- Plain language, no fluff. Do NOT mention any product name.
- Return bullets separated by newline.`;

  try {
    const resp = await callLlm({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content:
            "You produce brief, confident executive summaries about institutional readiness economics. Never mention any product name.",
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
      `Your current interview prep model creates readiness debt that shows up as rework, missed outcomes, and employer pullback.`,
      `Estimated annual cost of doing nothing: ${fmt(summary.costOfDoingNothing)}, driven by ${fmt(summary.reworkCost)} rework, ${fmt(summary.outcomeLeak)} outcome leakage, ${fmt(summary.confidenceLeak)} employer confidence loss.`,
      `Verified readiness operating model recovers ~${fmt(summary.valueRecovered)} per year${summary.paybackMonths != null ? `, with payback in ${summary.paybackMonths.toFixed(1)} months` : ""}.`,
      `Low to high annual recovery range: ${fmt(sensitivity.low.valueRecovered)} to ${fmt(sensitivity.high.valueRecovered)}.`,
    ].join("\n");
  }
}
