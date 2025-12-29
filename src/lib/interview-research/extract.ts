import type { CollectedSource } from "./collectors";
import type { CreateReportInput, ExtractedSignals } from "./types";
import { extractWithLlm } from "./promptExtract";

function chunkText(text: string, size = 1200): string[] {
  const words = text.split(/\s+/);
  const chunks: string[] = [];
  let current: string[] = [];
  for (const w of words) {
    if ((current.join(" ").length + w.length + 1) > size) {
      chunks.push(current.join(" "));
      current = [];
    }
    current.push(w);
  }
  if (current.length) chunks.push(current.join(" "));
  return chunks;
}

export async function extractSignals(input: CreateReportInput, sources: CollectedSource[]): Promise<ExtractedSignals> {
  const chunks = sources.flatMap((s) =>
    chunkText(s.raw_text, 1000).map((text) => ({ source_type: s.source_type, text })),
  );

  try {
    return await extractWithLlm({
      companyName: input.companyName,
      roleTitle: input.roleTitle,
      interviewStage: input.interviewStage,
      chunks,
    });
  } catch {
    // fallback to simple heuristic
    const jd = sources.find((s) => s.source_type === "JD")?.raw_text ?? "";
    return {
      companyHighlights: ["Company research placeholder"],
      roleSignals: [
        `Role: ${input.roleTitle}`,
        `Stage: ${input.interviewStage}`,
        jd ? `JD length: ${jd.length} chars` : "JD text missing",
      ],
      stage: input.interviewStage,
      interviewers: input.interviewers ?? [],
    };
  }
}
