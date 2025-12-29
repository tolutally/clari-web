import { NextResponse } from "next/server";
import type { RoiRequest, RoiResult } from "@/lib/institution-roi/types";
import { insertRun } from "@/lib/institution-roi/storage";

type Body = {
  request: RoiRequest;
  result: RoiResult;
  narrative?: string;
};

export async function POST(req: Request) {
  const body = (await req.json().catch(() => null)) as Body | null;
  if (!body?.request || !body?.result) {
    return NextResponse.json({ error: "request and result are required" }, { status: 400 });
  }
  try {
    const { id } = await insertRun(body);
    return NextResponse.json({ runId: id });
  } catch (err: any) {
    return NextResponse.json({ error: err?.message ?? "Failed to save run" }, { status: 500 });
  }
}
