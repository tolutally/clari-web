import { NextResponse } from "next/server";
import { getRun } from "@/lib/institution-roi/storage";

export async function GET(_req: Request, ctx: { params: Promise<{ runId: string }> }) {
  const { runId } = await ctx.params;
  const run = await getRun(runId);
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
}
