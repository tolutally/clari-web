import { config } from "dotenv";
config({ path: ".env.local" });
config();

import { supabaseAdmin } from "../src/lib/db/supabaseAdmin";
import { runPipeline } from "../src/lib/interview-research/pipeline";

async function pickOneQueuedReport() {
  const { data } = await supabaseAdmin
    .from("interview_research_reports")
    .select("id")
    .eq("status", "QUEUED")
    .order("created_at", { ascending: true })
    .limit(1);

  return data?.[0]?.id ?? null;
}

async function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function main() {
  console.log("[ir-worker] started");
  for (;;) {
    const reportId = await pickOneQueuedReport();
    if (!reportId) {
      console.log("[ir-worker] idle");
      await sleep(1500);
      continue;
    }

    try {
      console.log(`[ir-worker] picked ${reportId}`);
      await runPipeline(reportId);
      console.log(`[ir-worker] completed ${reportId}`);
    } catch (e: any) {
      console.error(`[ir-worker] failed ${reportId}`, e);
      await supabaseAdmin
        .from("interview_research_reports")
        .update({
          status: "FAILED",
          error_text: e?.message ?? "Pipeline error",
          updated_at: new Date().toISOString(),
        })
        .eq("id", reportId);
    }
  }
}

main().catch(() => process.exit(1));
