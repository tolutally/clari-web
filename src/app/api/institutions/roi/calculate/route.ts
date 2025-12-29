import { NextResponse } from "next/server";
import { calculateRoi } from "@/lib/institution-roi/calculator";
import type { RoiRequest } from "@/lib/institution-roi/types";

function validate(body: RoiRequest): string | null {
  if (!body?.context) return "context is required";
  if (!body.context.programType) return "programType is required";
  if (!Number.isFinite(body.context.cohortSize)) return "cohortSize is required";
  if (!body?.baseline) return "baseline is required";
  if (!Number.isFinite(body.baseline.readinessRatePct)) return "readinessRatePct is required";
  if (!Number.isFinite(body.baseline.offerRatePct)) return "offerRatePct is required";
  if (!body?.uplift) return "uplift is required";
  if (!body?.economics) return "economics is required";
  if (!Number.isFinite(body.economics.revenuePerPlacement)) return "revenuePerPlacement is required";
  return null;
}

export async function POST(req: Request) {
  const body = (await req.json().catch(() => null)) as RoiRequest | null;
  const err = body ? validate(body as RoiRequest) : "Missing body";
  if (err) return NextResponse.json({ error: err }, { status: 400 });

  const result = calculateRoi(body as RoiRequest);
  return NextResponse.json(result);
}
