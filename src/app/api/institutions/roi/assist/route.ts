import { NextResponse } from "next/server";
import { buildNarrative } from "@/lib/institution-roi/narrative";
import {
  suggestBaseline,
  suggestPrepCostDefaults,
  suggestChangeDefaults,
  suggestInvestment,
} from "@/lib/institution-roi/defaults";
import type { RoiRequest, RoiResult } from "@/lib/institution-roi/types";
import { calculateRoi } from "@/lib/institution-roi/calculator";

type AssistBody = {
  mode: "suggest" | "narrative";
  request?: RoiRequest;
  result?: RoiResult;
};

export async function POST(req: Request) {
  const body = (await req.json().catch(() => null)) as AssistBody | null;
  if (!body?.mode) return NextResponse.json({ error: "mode is required" }, { status: 400 });

  if (body.mode === "suggest") {
    const programType = body.request?.context.programType ?? "other";
    const cohortSize = body.request?.context.cohortSize ?? 100;

    const baseline = suggestBaseline(programType);
    const prepCost = suggestPrepCostDefaults(programType);
    const change = suggestChangeDefaults(programType);
    const investment = suggestInvestment(cohortSize);

    return NextResponse.json({ baseline, prepCost, change, investment });
  }

  // mode === "narrative"
  if (!body.request) return NextResponse.json({ error: "request is required" }, { status: 400 });
  const computed = body.result ?? calculateRoi(body.request);
  const narrative = await buildNarrative(body.request, computed);
  return NextResponse.json({ narrative });
}
