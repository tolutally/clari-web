import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/db/supabaseAdmin";

export async function GET(_req: Request, ctx: { params: Promise<{ reportId: string }> }) {
  const { reportId } = await ctx.params;

  const { data: report, error: reportErr } = await supabaseAdmin
    .from("interview_research_reports")
    .select("id,status,error_text,company_name,role_title,interview_stage,created_at,ready_at,gate_passed")
    .eq("id", reportId)
    .single();

  if (reportErr || !report) {
    return NextResponse.json({ error: reportErr?.message ?? "Report not found" }, { status: 404 });
  }

  const { data: render } = await supabaseAdmin
    .from("interview_research_render")
    .select("preview_json,full_json,pdf_url")
    .eq("report_id", reportId)
    .maybeSingle();

  // Only return full artifacts when the report is ready AND gate has been passed.
  const isReady = report.status === "READY" && report.gate_passed === true;

  return NextResponse.json({
    report,
    preview: render?.preview_json ?? null,
    full: isReady ? render?.full_json ?? null : null,
    pdfUrl: isReady ? render?.pdf_url ?? null : null,
  });
}
