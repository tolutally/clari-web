import { NextResponse } from "next/server";
import { getRun } from "@/lib/institution-roi/storage";

export async function GET(_req: Request, ctx: { params: Promise<{ runId: string }> }) {
  try {
    const { runId } = await ctx.params;
    console.log("[ROI Report API] Fetching runId:", runId);
    
    const run = await getRun(runId);
    console.log("[ROI Report API] Run found:", !!run);
    
    if (!run) return NextResponse.json({ error: "Not found" }, { status: 404 });

    if (!run.gate_passed) {
      return NextResponse.json(
        {
          gatePassed: false,
          teaser: {
            summary: run.result.summary,
            baseline: run.result.baseline,
            sensitivity: run.result.sensitivity,
          },
        },
        { status: 200 },
      );
    }

    return NextResponse.json({
      gatePassed: true,
      run,
    });
  } catch (err: any) {
    console.error("[ROI Report API] Error:", err?.message || err);
    return NextResponse.json({ error: err?.message || "Internal error" }, { status: 500 });
  }
}
