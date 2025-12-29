import crypto from "crypto";
import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/db/supabaseAdmin";

function sha256(v: string) {
  return crypto.createHash("sha256").update(v).digest("hex");
}

export async function POST(req: Request) {
  const body = (await req.json().catch(() => null)) as { reportId?: string; email?: string } | null;
  if (!body?.reportId || !body?.email) {
    return NextResponse.json({ error: "Missing fields" }, { status: 400 });
  }

  const email = body.email.trim().toLowerCase();
  if (!email) return NextResponse.json({ error: "Email required" }, { status: 400 });

  const token = crypto.randomBytes(24).toString("hex");
  const tokenHash = sha256(token);
  const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString();

  const { data: linkRow, error } = await supabaseAdmin.from("interview_research_magic_links").insert({
    report_id: body.reportId,
    email,
    token_hash: tokenHash,
    expires_at: expiresAt,
  }).select("id").single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  // Immediately mark gate as passed to unlock in-app (still issues a link for inbox access).
  await supabaseAdmin
    .from("interview_research_reports")
    .update({ gate_passed: true, updated_at: new Date().toISOString() })
    .eq("id", body.reportId);

  await supabaseAdmin
    .from("interview_research_magic_links")
    .update({ used_at: new Date().toISOString() })
    .eq("id", linkRow.id);

  const baseUrl =
    process.env.APP_BASE_URL ||
    req.headers.get("origin") ||
    `${process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "http://localhost:3000"}`;
  const link = `${baseUrl}/interview-research/r/${token}`;

  return NextResponse.json({ ok: true, link });
}
