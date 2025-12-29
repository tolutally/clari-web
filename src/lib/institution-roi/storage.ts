import crypto from "crypto";
import { supabaseAdmin } from "@/lib/db/supabaseAdmin";
import type { RoiRequest, RoiResult, RoiRunRow } from "./types";

const tableRuns = "institution_roi_runs";
const tableLinks = "institution_roi_magic_links";

export async function insertRun({
  request,
  result,
  narrative,
}: {
  request: RoiRequest;
  result: RoiResult;
  narrative?: string;
}): Promise<{ id: string }> {
  const { data, error } = await supabaseAdmin
    .from(tableRuns)
    .insert({
      request,
      result,
      narrative: narrative ?? null,
      gate_passed: false,
    })
    .select("id")
    .single();

  if (error) throw new Error(error.message);
  return { id: data.id };
}

export async function getRun(runId: string): Promise<RoiRunRow | null> {
  const { data, error } = await supabaseAdmin
    .from(tableRuns)
    .select("id,request,result,narrative,gate_passed,created_at,updated_at")
    .eq("id", runId)
    .maybeSingle();

  if (error) throw new Error(error.message);
  return data as RoiRunRow | null;
}

export async function setGatePassed(runId: string) {
  const { error } = await supabaseAdmin
    .from(tableRuns)
    .update({ gate_passed: true, updated_at: new Date().toISOString() })
    .eq("id", runId);
  if (error) throw new Error(error.message);
}

export async function createMagicLink(runId: string, email: string, baseUrl: string) {
  const token = crypto.randomBytes(24).toString("hex");
  const tokenHash = crypto.createHash("sha256").update(token).digest("hex");
  const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString();

  const { error } = await supabaseAdmin.from(tableLinks).insert({
    run_id: runId,
    email: email.trim().toLowerCase(),
    token_hash: tokenHash,
    expires_at: expiresAt,
  });

  if (error) throw new Error(error.message);

  const link = `${baseUrl}/api/institutions/roi/r/${token}`;

  // Optional fast-unlock for in-app flow
  await setGatePassed(runId).catch(() => {});
  await supabaseAdmin.from(tableLinks).update({ used_at: new Date().toISOString() }).eq("token_hash", tokenHash);

  return { link };
}
