import crypto from "crypto";
import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/db/supabaseAdmin";
import { setGatePassed } from "@/lib/institution-roi/storage";

function sha256(v: string) {
  return crypto.createHash("sha256").update(v).digest("hex");
}

export async function GET(_req: Request, ctx: { params: Promise<{ token: string }> }) {
  const { token } = await ctx.params;
  if (!token) return NextResponse.json({ error: "Invalid token" }, { status: 400 });

  const tokenHash = sha256(token);
  const nowIso = new Date().toISOString();

  const { data: link, error } = await supabaseAdmin
    .from("institution_roi_magic_links")
    .select("run_id, expires_at, used_at")
    .eq("token_hash", tokenHash)
    .gt("expires_at", nowIso)
    .is("used_at", null)
    .maybeSingle();

  if (error || !link) {
    return NextResponse.json({ error: "Invalid or expired link" }, { status: 400 });
  }

  await supabaseAdmin
    .from("institution_roi_magic_links")
    .update({ used_at: new Date().toISOString() })
    .eq("token_hash", tokenHash);

  await setGatePassed(link.run_id);

  const baseUrl =
    process.env.APP_BASE_URL ||
    _req.headers.get("origin") ||
    `${process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "http://localhost:3000"}`;
  return NextResponse.redirect(`${baseUrl}/institutions/roi/report/${link.run_id}`, 307);
}
