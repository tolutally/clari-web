export type ReportStatus = "QUEUED" | "COLLECTING" | "EXTRACTING" | "WRITING" | "READY" | "FAILED";

export type CreateReportInput = {
  companyName: string;
  roleTitle: string;
  interviewStage: string;
  jdText: string;
  interviewers: { name: string; linkedinUrl?: string }[];
};

export type ReportRow = {
  id: string;
  status: ReportStatus;
  company_name: string;
  role_title: string;
  interview_stage: string;
  jd_text: string;
  interview_email_text: string | null;
  interviewer_urls: string[];
  interviewers: { name: string; linkedinUrl?: string }[];
  gate_passed: boolean;
  error_text: string | null;
};

export type ReportFullJson = {
  companyResearch: { bullets: string[] };
  whatMattersNow: { bullets: string[] };
  interviewer: { bullets: string[] };
  questionsYouMightFace: { bullets: string[] };
  questionsToAskInterviewer: { bullets: string[] };
  sourcesAndTimestamps: { bullets: string[]; generatedAt: string };
};

export type ExtractedSignals = {
  companyHighlights: string[];
  roleSignals: string[];
  stage: string;
  interviewers: { name: string; linkedinUrl?: string }[];
  risksOrWatchouts?: string[];
  toneKeywords?: string[];
};
