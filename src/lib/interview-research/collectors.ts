import type { CreateReportInput } from "./types";

export type CollectedSource = {
  source_type: string;
  url?: string | null;
  title?: string | null;
  raw_text: string;
};

export function collectLocalSources(input: CreateReportInput): CollectedSource[] {
  const sources: CollectedSource[] = [];

  // Job description as primary source
  sources.push({
    source_type: "JD",
    title: `${input.roleTitle} – Job Description`,
    raw_text: input.jdText.trim(),
  });

  // Interviewer list (if provided) as a lightweight source
  if (input.interviewers?.length) {
    const names = input.interviewers.map((i) => `${i.name}${i.linkedinUrl ? ` (${i.linkedinUrl})` : ""}`).join("; ");
    sources.push({
      source_type: "INTERVIEWERS",
      title: "Interviewers",
      raw_text: names,
    });
  }

  // Basic company placeholder source (no external fetch yet)
  sources.push({
    source_type: "COMPANY_SITE",
    title: `${input.companyName} company snapshot`,
    raw_text: `${input.companyName} public snapshot placeholder. Stage: ${input.interviewStage}.`,
  });

  // News placeholder (no external calls yet)
  sources.push({
    source_type: "NEWS",
    title: `${input.companyName} recent news`,
    raw_text: `${input.companyName} recent news placeholder`,
  });

  return sources;
}
