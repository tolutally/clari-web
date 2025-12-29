import { supabaseAdmin } from "../db/supabaseAdmin";
import { collectLocalSources } from "./collectors";
import { extractSignals } from "./extract";
import { buildFull, buildPreview } from "./synthesis";
import type { ReportStatus } from "./types";

type PipelineResult = {
  preview: any;
  full: any;
  sources: { source_type: string; url?: string; title?: string; raw_text: string }[];
};

function logStep(reportId: string, message: string, extra?: Record<string, unknown>) {
  console.log(`[ir-pipeline] ${reportId} :: ${message}`, extra ? JSON.stringify(extra) : "");
}

async function setStatus(reportId: string, status: ReportStatus, errorText?: string) {
  await supabaseAdmin
    .from("interview_research_reports")
    .update({
      status,
      error_text: errorText ?? null,
      updated_at: new Date().toISOString(),
      ...(status === "READY" ? { ready_at: new Date().toISOString() } : {}),
    })
    .eq("id", reportId);
}

export async function runPipeline(reportId: string): Promise<void> {
  logStep(reportId, "start");
  const { data: report, error } = await supabaseAdmin
    .from("interview_research_reports")
    .select("*")
    .eq("id", reportId)
    .single();

  if (error || !report) throw new Error(error?.message ?? "Report not found");

  await setStatus(reportId, "COLLECTING");
  logStep(reportId, "collecting");

  const sources = collectLocalSources({
    companyName: report.company_name,
    roleTitle: report.role_title,
    interviewStage: report.interview_stage,
    jdText: report.jd_text,
    interviewers: report.interviewers ?? [],
  });
  logStep(reportId, "collected", { sourceCount: sources.length });

  await supabaseAdmin.from("interview_research_sources").insert(
    sources.map((s) => ({
      report_id: reportId,
      source_type: s.source_type,
      url: s.url ?? null,
      title: s.title ?? null,
      raw_text: s.raw_text,
    })),
  );

  await setStatus(reportId, "EXTRACTING");
  logStep(reportId, "extracting");

  const signals = await extractSignals(
    {
      companyName: report.company_name,
      roleTitle: report.role_title,
      interviewStage: report.interview_stage,
      jdText: report.jd_text,
      interviewers: report.interviewers ?? [],
    },
    sources,
  );
  logStep(reportId, "extracted");

  const preview = buildPreview(signals);

  await setStatus(reportId, "WRITING");
  logStep(reportId, "writing");

  const full = await buildFull(signals);
  logStep(reportId, "built report");

  await supabaseAdmin.from("interview_research_render").upsert({
    report_id: reportId,
    preview_json: preview,
    full_json: full,
  });

  await setStatus(reportId, "READY");
  logStep(reportId, "ready");
}
