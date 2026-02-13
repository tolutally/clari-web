import { NextResponse } from "next/server";
import { calculateRoi } from "@/lib/institution-roi/calculator";
import type { RoiRequest } from "@/lib/institution-roi/types";

function validate(body: RoiRequest): string | null {
  if (!body?.context) return "context is required";
  if (!body.context.programType) return "programType is required";
  if (!Number.isFinite(body.context.cohortSize) || body.context.cohortSize <= 0)
    return "cohortSize is required and must be > 0";

  if (!body?.economics) return "economics is required";
  if (!Number.isFinite(body.economics.revenuePerPlacement) || body.economics.revenuePerPlacement <= 0)
    return "revenuePerPlacement is required and must be > 0";

  if (!body?.leak) return "leak is required";
  if (!Number.isFinite(body.leak.employerInterviewsPerLearner))
    return "leak.employerInterviewsPerLearner is required";

  if (!body?.change) return "change is required";
  if (!body?.investment) return "investment is required";
  if (!Number.isFinite(body.investment.annualChangeInvestment))
    return "investment.annualChangeInvestment is required";

  return null;
}

export async function POST(req: Request) {
  const body = (await req.json().catch(() => null)) as RoiRequest | null;
  const err = body ? validate(body as RoiRequest) : "Missing body";
  if (err) return NextResponse.json({ error: err }, { status: 400 });

  const result = calculateRoi(body as RoiRequest);
  return NextResponse.json(result);
}
