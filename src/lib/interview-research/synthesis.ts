import { synthesizeReport } from "./promptSynthesis";
import type { ExtractedSignals, ReportFullJson } from "./types";

export function buildPreview(signals: ExtractedSignals) {
  return {
    tldr: [
      signals.companyHighlights[0] ?? "Company snapshot coming soon",
      signals.roleSignals[0] ?? "Role context coming soon",
      signals.interviewers.length ? `Interviewers: ${signals.interviewers.map((i) => i.name).join(", ")}` : "Interviewers pending",
    ].slice(0, 3),
    nextSteps: ["Start with JD signals", "Add company/news collectors", "Draft follow-up questions"],
  };
}

export async function buildFull(signals: ExtractedSignals): Promise<ReportFullJson> {
  try {
    return await synthesizeReport(signals);
  } catch {
    return {
      companyResearch: { bullets: signals.companyHighlights },
      whatMattersNow: { bullets: ["Recent news pending", "Press signals pending", "Social listening pending", "Role expectations pending", "Delivery expectations pending", "Hiring signals pending"] },
      interviewer: { bullets: signals.interviewers.map((i) => `${i.name}${i.linkedinUrl ? ` (${i.linkedinUrl})` : ""}`) },
      questionsYouMightFace: { bullets: ["Tell me about a recent project", "How do you handle ambiguity?", "Describe stakeholder conflict resolution", "How do you prioritize under pressure?", "Explain a delivery risk you mitigated", "How do you align cross-functional teams?", "Walk me through a failed project", "How do you measure success?"] },
      questionsToAskInterviewer: { bullets: ["What does success look like in 90 days? (Source: company_site)", "How is performance measured? (Source: careers)", "Team collaboration norms? (Source: linkedin)", "Current delivery risks? (Source: news)", "How does the team handle ambiguity? (Source: reddit)", "What’s the decision timeline? (Source: press)"] },
      sourcesAndTimestamps: { bullets: ["Sources captured locally (no external fetch yet)"], generatedAt: new Date().toISOString() },
    };
  }
}
