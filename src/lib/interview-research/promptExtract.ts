import type { ExtractedSignals } from "./types";
import { callLlm, callPerplexity } from "./llmClient";

export async function extractWithLlm({
  companyName,
  roleTitle,
  interviewStage,
  chunks,
}: {
  companyName: string;
  roleTitle: string;
  interviewStage: string;
  chunks: { source_type: string; text: string }[];
}): Promise<ExtractedSignals> {
  const prompt = `You are extracting interview research signals from provided text chunks. 
Return ONLY valid JSON matching this shape (all keys required):
{
  "companyHighlights": [string],
  "roleSignals": [string],
  "stage": string,
  "interviewers": [
    { "name": string, "linkedinUrl": string|null, "notes": string|null }
  ],
  "risksOrWatchouts": [string],
  "toneKeywords": [string]
}

Guidelines:
- Be concise and precise; do not invent facts.
- If a field is missing, use an empty array or null.
- Ignore irrelevant content and boilerplate.
- Include source_type or URL in notes only if explicitly present.

Context:
Company: ${companyName}
Role: ${roleTitle}
Stage: ${interviewStage}

Chunks:
${chunks.map((c) => `- [${c.source_type}] ${c.text.slice(0, 800)}`).join("\n")}
`;

  async function callProvider() {
    // Try Perplexity first if available, else OpenAI
    if (process.env.PERPLEXITY_API_KEY) {
      try {
        return await callPerplexity({
          model: "llama-3.1-sonar-small-128k-online",
          messages: [
            { role: "system", content: "You are a precise JSON extractor." },
            { role: "user", content: prompt },
          ],
          temperature: 0.1,
          maxTokens: 600,
        });
      } catch {
        // fall through to OpenAI
      }
    }
    return await callLlm({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: "You are a precise JSON extractor." },
        { role: "user", content: prompt },
      ],
      temperature: 0.1,
      maxTokens: 600,
    });
  }

  const raw = await callProvider();

  let parsed: ExtractedSignals = {
    companyHighlights: [],
    roleSignals: [],
    stage: interviewStage,
    interviewers: [],
  };

  try {
    parsed = JSON.parse(raw);
  } catch {
    // keep default
  }

  // Ensure defaults
  if (!Array.isArray(parsed.companyHighlights)) parsed.companyHighlights = [];
  if (!Array.isArray(parsed.roleSignals)) parsed.roleSignals = [];
  if (!Array.isArray(parsed.interviewers)) parsed.interviewers = [];
  if (!parsed.stage) parsed.stage = interviewStage;

  return parsed;
}
