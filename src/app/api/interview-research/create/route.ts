import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/db/supabaseAdmin";
import type { CreateReportInput } from "@/lib/interview-research/types";

function cleanText(v: string) {
  return v.trim().replace(/\s+/g, " ");
}

function validate(body: CreateReportInput) {
  if (!body) return "Missing body";
  if (!body.companyName?.trim()) return "companyName is required";
  if (!body.roleTitle?.trim()) return "roleTitle is required";
  if (!body.interviewStage?.trim()) return "interviewStage is required";
  if (!body.jdText?.trim()) return "jdText is required";
  if (!Array.isArray(body.interviewers)) return "interviewers must be an array";
  const hasInvalid = body.interviewers.some((i) => !i?.name?.trim());
  if (hasInvalid) return "each interviewer needs a name";
  return null;
}

export async function POST(req: Request) {
  const body = (await req.json().catch(() => null)) as CreateReportInput | null;
  const err = body ? validate(body as CreateReportInput) : "Missing body";
  if (err) return NextResponse.json({ error: err }, { status: 400 });

  const interviewers = (body!.interviewers ?? []).map((i) => ({
    name: cleanText(i.name),
    ...(i.linkedinUrl?.trim() ? { linkedinUrl: i.linkedinUrl.trim() } : {}),
  }));

  const payload = {
    company_name: cleanText(body!.companyName),
    role_title: cleanText(body!.roleTitle),
    interview_stage: cleanText(body!.interviewStage),
    jd_text: body!.jdText.trim(),
    interviewers,
    status: "QUEUED" as const,
  };

  const { data, error } = await supabaseAdmin
    .from("interview_research_reports")
    .insert(payload)
    .select("id,status")
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ reportId: data.id, status: data.status });
}
