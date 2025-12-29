import crypto from "crypto";
import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/db/supabaseAdmin";

type Body = { reportId: string; email: string };

function sha256(v: string) {
  return crypto.createHash("sha256").update(v).digest("hex");
}

export async function POST(req: Request) {
  const body = (await req.json()) as Body;

  if (!body.reportId || !body.email) {
    return NextResponse.json({ error: "Missing fields" }, { status: 400 });
  }

  const token = crypto.randomBytes(24).toString("hex");
  const tokenHash = sha256(token);
  const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString();

  const { error } = await supabaseAdmin.from("interview_research_magic_links").insert({
    report_id: body.reportId,
    email: body.email.trim().toLowerCase(),
    token_hash: tokenHash,
    expires_at: expiresAt,
  });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  const baseUrl = process.env.APP_BASE_URL!;
  const link = `${baseUrl}/interview-research/r/${token}`;

  return NextResponse.json({ ok: true, link });
}
