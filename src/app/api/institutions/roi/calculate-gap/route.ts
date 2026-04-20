import { NextResponse } from "next/server";
import { calculateGapCost } from "@/lib/institution-roi/calculator";
import { insertGapRun, createMagicLink } from "@/lib/institution-roi/storage";
import type { GapCalculatorRequest } from "@/lib/institution-roi/types";

const VALID_PROGRAM_TYPES = ["bootcamp", "workforce", "university", "other"] as const;

function validate(body: { request?: GapCalculatorRequest; email?: string }): string | null {
  if (!body?.request) return "request is required";
  
  const req = body.request;
  
  if (!Number.isFinite(req.learnersPerYear) || req.learnersPerYear <= 0) {
    return "learnersPerYear is required and must be > 0";
  }
  
  if (!req.programType || !VALID_PROGRAM_TYPES.includes(req.programType)) {
    return `programType must be one of: ${VALID_PROGRAM_TYPES.join(", ")}`;
  }
  
  if (!Number.isFinite(req.advisorsCount) || req.advisorsCount <= 0) {
    return "advisorsCount is required and must be > 0";
  }
  
  if (!Number.isFinite(req.currentCaseload) || req.currentCaseload <= 0) {
    return "currentCaseload is required and must be > 0";
  }
  
  if (!body.email?.trim()) {
    return "email is required";
  }
  
  return null;
}

export async function POST(req: Request) {
  let step = "parse";
  try {
    const body = (await req.json().catch(() => null)) as {
      request?: GapCalculatorRequest;
      email?: string;
    } | null;
    
    const err = body ? validate(body) : "Missing body";
    if (err) return NextResponse.json({ error: err }, { status: 400 });

    step = "calculate";
    const request = body!.request!;
    const email = body!.email!.trim().toLowerCase();
    const result = calculateGapCost(request);

    // Store the run
    step = "store";
    const { id } = await insertGapRun({
      request,
      result,
    });

    // Create magic link (marks gate_passed and stores email)
    step = "gate";
    const baseUrl =
      process.env.APP_BASE_URL ||
      req.headers.get("origin") ||
      `${process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "http://localhost:3000"}`;
    
    await createMagicLink(id, email, baseUrl);

    return NextResponse.json({ 
      runId: id,
      result: {
        aggregateGapCost: result.summary.aggregateGapCost,
        additionalPlacements: result.summary.additionalPlacements,
        losses: result.summary.losses,
      }
    });
  } catch (e: unknown) {
    const message = e instanceof Error ? e.message : "unknown error";
    console.error(`[Gap Calculator] Failed at step="${step}":`, message);
    return NextResponse.json(
      { error: `Calculation failed at ${step}: ${message}` },
      { status: 500 },
    );
  }
}
