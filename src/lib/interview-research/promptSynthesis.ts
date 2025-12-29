import type { ExtractedSignals, ReportFullJson } from "./types";
import { callLlm } from "./llmClient";

export async function synthesizeReport(
  signals: ExtractedSignals,
  opts?: { location?: string; contradictionEdits?: string },
): Promise<ReportFullJson> {
  const location = opts?.location ?? "";
  const contradictionEdits = opts?.contradictionEdits ?? "";
  const companyLine = signals.companyHighlights.length ? signals.companyHighlights.join(" | ") : "Company details pending";
  const roleLine = signals.roleSignals.length ? signals.roleSignals.join(" | ") : "Role details pending";

  const prompt = `SYNTHESIS PROMPT (v2)
You write a guide-style pre-interview research brief from extracted signals.

Inputs
Company: ${companyLine}
Role: ${roleLine}
Stage: ${signals.stage}
Location: ${location}
Extraction JSON: ${JSON.stringify(signals)}
Contradiction edits: ${contradictionEdits || "None provided"}

Output
Return ONLY valid JSON.

JSON shape
{
  "companyResearch": {"bullets":[string]},
  "whatMattersNow": {"bullets":[string]},
  "interviewer": {"bullets":[string]},
  "questionsYouMightFace": {"bullets":[string]},
  "questionsToAskInterviewer": {"bullets":[string]},
  "sourcesAndTimestamps": {"bullets":[string], "generatedAt": "string"}
}

Rules
- Use only extracted signals and evidence.
- Apply contradictionEdits before writing the final bullets.
- Keep each bullet 6 to 18 words.
- companyResearch: 5 to 7 bullets.
- whatMattersNow: 6 bullets. Include:
  - 2 bullets derived from socialListening themes when available
  - 2 bullets derived from news, press, or careers signals
  - 2 bullets derived from roleSignals and delivery expectations
- interviewer: 3 to 5 bullets only when interviewer data exists. Else return [].
- questionsYouMightFace: 8 bullets. Mix:
  - execution and delivery
  - stakeholder conflict and governance
  - ambiguity and pressure tests
- questionsToAskInterviewer: 6 bullets tied to whatMattersNow and roleSignals.
- Each bullet ends with a short source tag in parentheses.
  Use one of: company_site, careers, case_study, press, news, reviews, glassdoor, reddit, blind, fishbowl, linkedin, job_history.
  Example: “Clients span UK and North America delivery. (Source: careers)”
- sourcesAndTimestamps.bullets lists 8 to 12 sources with source_type and title.
- generatedAt uses ISO-8601 UTC timestamp.
`;

  const raw = await callLlm({
    model: "gpt-4o-mini",
    messages: [
      { role: "system", content: "You are a concise, reliable summarizer returning valid JSON only." },
      { role: "user", content: prompt },
    ],
    temperature: 0.2,
    maxTokens: 1000,
  });

  let parsed: ReportFullJson = {
    companyResearch: { bullets: [] },
    whatMattersNow: { bullets: [] },
    interviewer: { bullets: [] },
    questionsYouMightFace: { bullets: [] },
    questionsToAskInterviewer: { bullets: [] },
    sourcesAndTimestamps: { bullets: [], generatedAt: new Date().toISOString() },
  };

  try {
    parsed = JSON.parse(raw);
  } catch {
    // keep defaults
  }

  if (!parsed.sourcesAndTimestamps?.generatedAt) {
    parsed.sourcesAndTimestamps = parsed.sourcesAndTimestamps || { bullets: [], generatedAt: "" };
    parsed.sourcesAndTimestamps.generatedAt = new Date().toISOString();
  }

  return parsed;
}
