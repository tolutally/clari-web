import crypto from "crypto";
import { getSupabaseAdmin } from "@/lib/db/supabaseAdmin";
import type {
  RoiRequest,
  RoiResult,
  RoiRunRow,
  GapCalculatorRequest,
  GapCalculatorResult,
  GapRunRow,
  AnyRunRow,
} from "./types";

const tableRuns = "institution_roi_runs";
const tableLinks = "institution_roi_magic_links";

// ═══════════════════════════════════════════════════════════════════════════
// V4: Gap Calculator Storage
// ═══════════════════════════════════════════════════════════════════════════

export async function insertGapRun({
  request,
  result,
  narrative,
}: {
  request: GapCalculatorRequest;
  result: GapCalculatorResult;
  narrative?: string;
}): Promise<{ id: string }> {
  const { data, error } = await getSupabaseAdmin()
    .from(tableRuns)
    .insert({
      request,
      result,
      narrative: narrative ?? null,
      gate_passed: false,
      result_version: 4,
    })
    .select("id")
    .single();

  if (error) throw new Error(error.message);
  return { id: data.id };
}

export async function getGapRun(runId: string): Promise<GapRunRow | null> {
  const { data, error } = await getSupabaseAdmin()
    .from(tableRuns)
    .select("id,request,result,narrative,gate_passed,result_version,created_at,updated_at")
    .eq("id", runId)
    .eq("result_version", 4)
    .maybeSingle();

  if (error) throw new Error(error.message);
  if (!data) return null;
  return data as GapRunRow;
}

/**
 * Get any run (V3 or V4) by ID.
 * Use result_version to determine which type to cast to.
 */
export async function getAnyRun(runId: string): Promise<AnyRunRow | null> {
  const { data, error } = await getSupabaseAdmin()
    .from(tableRuns)
    .select("id,request,result,narrative,gate_passed,result_version,created_at,updated_at")
    .eq("id", runId)
    .maybeSingle();

  if (error) throw new Error(error.message);
  if (!data) return null;
  
  const version = data.result_version ?? 1;
  if (version === 4) {
    return data as GapRunRow;
  }
  return {
    ...data,
    result_version: version,
  } as RoiRunRow;
}

// ═══════════════════════════════════════════════════════════════════════════
// Legacy V3 Storage (kept for backward compatibility)
// ═══════════════════════════════════════════════════════════════════════════

export async function insertRun({
  request,
  result,
  narrative,
  result_version = 2,
}: {
  request: RoiRequest;
  result: RoiResult;
  narrative?: string;
  result_version?: number;
}): Promise<{ id: string }> {
  const { data, error } = await getSupabaseAdmin()
    .from(tableRuns)
    .insert({
      request,
      result,
      narrative: narrative ?? null,
      gate_passed: false,
      result_version,
    })
    .select("id")
    .single();

  if (error) throw new Error(error.message);
  return { id: data.id };
}

export async function getRun(runId: string): Promise<RoiRunRow | null> {
  const { data, error } = await getSupabaseAdmin()
    .from(tableRuns)
    .select("id,request,result,narrative,gate_passed,result_version,created_at,updated_at")
    .eq("id", runId)
    .maybeSingle();

  if (error) throw new Error(error.message);
  if (!data) return null;
  return {
    ...data,
    result_version: data.result_version ?? 1, // legacy rows default to v1
  } as RoiRunRow;
}

export async function setGatePassed(runId: string) {
  const { error } = await getSupabaseAdmin()
    .from(tableRuns)
    .update({ gate_passed: true, updated_at: new Date().toISOString() })
    .eq("id", runId);
  if (error) throw new Error(error.message);
}

export async function createMagicLink(runId: string, email: string, baseUrl: string) {
  const token = crypto.randomBytes(24).toString("hex");
  const tokenHash = crypto.createHash("sha256").update(token).digest("hex");
  const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString();

  const { error } = await getSupabaseAdmin().from(tableLinks).insert({
    run_id: runId,
    email: email.trim().toLowerCase(),
    token_hash: tokenHash,
    expires_at: expiresAt,
  });

  if (error) throw new Error(error.message);

  const link = `${baseUrl}/api/institutions/roi/r/${token}`;

  // Optional fast-unlock for in-app flow
  await setGatePassed(runId).catch(() => {});
  await getSupabaseAdmin().from(tableLinks).update({ used_at: new Date().toISOString() }).eq("token_hash", tokenHash);

  return { link };
}
