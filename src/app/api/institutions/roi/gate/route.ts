import { NextResponse } from "next/server";
import { createMagicLink } from "@/lib/institution-roi/storage";

export async function POST(req: Request) {
  const body = (await req.json().catch(() => null)) as { runId?: string; email?: string } | null;
  if (!body?.runId || !body?.email) {
    return NextResponse.json({ error: "Missing fields" }, { status: 400 });
  }

  const email = body.email.trim().toLowerCase();
  if (!email) return NextResponse.json({ error: "Email required" }, { status: 400 });

  const baseUrl =
    process.env.APP_BASE_URL ||
    req.headers.get("origin") ||
    `${process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "http://localhost:3000"}`;

  try {
    const { link } = await createMagicLink(body.runId, email, baseUrl);
    return NextResponse.json({ ok: true, link });
  } catch (err: any) {
    return NextResponse.json({ error: err?.message ?? "Failed to gate" }, { status: 500 });
  }
}
