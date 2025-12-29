type TriageInput = {
  companyName: string;
  roleTitle: string;
  interviewStage: string;
  location?: string;
  sources: { source_type: string; url: string; title?: string; snippet?: string; published_at?: string }[];
};

export function buildSourceTriagePrompt({ companyName, roleTitle, interviewStage, location = "", sources }: TriageInput) {
  return `SOURCE TRIAGE PROMPT
You select which sources to keep for the report.

Context
Company: ${companyName}
Role: ${roleTitle}
Stage: ${interviewStage}
Location: ${location}

Input
A list of candidate sources with:
- source_type
- url
- title
- snippet
- published_at (optional)

Candidate sources:
${sources
  .map(
    (s) =>
      `- type: ${s.source_type}; url: ${s.url}; title: ${s.title ?? ""}; snippet: ${s.snippet ?? ""}; published_at: ${
        s.published_at ?? "n/a"
      }`,
  )
  .join("\n")}

Output
Return ONLY valid JSON.

JSON shape
{
  "kept": [
    {"url":"string","source_type":"string","reason":"string"}
  ],
  "dropped": [
    {"url":"string","source_type":"string","reason":"string"}
  ]
}

Rules
- Keep sources that add unique facts, interview insights, or social listening.
- Prefer sources within last 540 days.
- Keep at least:
  - 6 reddit or forum sources combined
  - 4 glassdoor sources when available
  - 4 company site sources
- Drop duplicates, thin aggregator pages, and pages with no substantive content.
- Do not keep sources requiring login or paywall.
`;
}
