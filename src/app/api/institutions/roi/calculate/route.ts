import { NextResponse } from "next/server";
import { calculateRoi } from "@/lib/institution-roi/calculator";
import { insertRun } from "@/lib/institution-roi/storage";
import type { RoiRequest } from "@/lib/institution-roi/types";

function validate(body: RoiRequest): string | null {
  if (!body?.context) return "context is required";
  if (!body.context.programType) return "programType is required";
  if (!Number.isFinite(body.context.cohortSize) || body.context.cohortSize <= 0)
    return "cohortSize is required and must be > 0";

  if (!body?.prepCost) return "prepCost is required";
  if (!Number.isFinite(body.prepCost.mocksPerLearner))
    return "prepCost.mocksPerLearner is required";

  if (!body?.change) return "change is required";
  if (!body?.investment) return "investment is required";
  if (!Number.isFinite(body.investment.annualChangeInvestment))
    return "investment.annualChangeInvestment is required";

  return null;
}

export async function POST(req: Request) {
  let step = "parse";
  try {
    const body = (await req.json().catch(() => null)) as RoiRequest | null;
    const err = body ? validate(body as RoiRequest) : "Missing body";
    if (err) return NextResponse.json({ error: err }, { status: 400 });

    step = "calculate";
    const request = body as RoiRequest;
    const result = calculateRoi(request);

    // Store the run immediately — narrative is generated lazily on the report page
    step = "store";
    const { id } = await insertRun({
      request,
      result,
      result_version: result.resultVersion,
    });

    return NextResponse.json({ runId: id });
  } catch (e: any) {
    console.error(`[ROI calculate] Failed at step="${step}":`, e?.message ?? e);
    return NextResponse.json(
      { error: `Report generation failed at ${step}: ${e?.message ?? "unknown error"}` },
      { status: 500 },
    );
  }
}
