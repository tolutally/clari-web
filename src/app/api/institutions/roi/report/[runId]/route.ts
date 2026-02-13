import { NextResponse } from "next/server";
import { getRun } from "@/lib/institution-roi/storage";

export async function GET(_req: Request, ctx: { params: Promise<{ runId: string }> }) {
  try {
    const { runId } = await ctx.params;

    const run = await getRun(runId);

    if (!run) return NextResponse.json({ error: "Not found" }, { status: 404 });

    if (!run.gate_passed) {
      // Teaser varies by result version
      const isV2 = run.result_version === 2;
      return NextResponse.json(
        {
          gatePassed: false,
          resultVersion: run.result_version,
          teaser: isV2
            ? {
                summary: run.result.summary,
                baselineSignals: (run.result as any).baselineSignals,
                sensitivity: run.result.sensitivity,
              }
            : {
                // Legacy v1 shape
                summary: run.result.summary,
                baseline: (run.result as any).baseline,
                sensitivity: run.result.sensitivity,
              },
        },
        { status: 200 },
      );
    }

    return NextResponse.json({
      gatePassed: true,
      resultVersion: run.result_version,
      run,
    });
  } catch (err: any) {
    console.error("[ROI Report API] Error:", err?.message || err);
    return NextResponse.json({ error: err?.message || "Internal error" }, { status: 500 });
  }
}
