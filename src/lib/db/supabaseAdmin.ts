import { createClient, SupabaseClient } from "@supabase/supabase-js";

// Lazy initialization to allow builds without env vars
let _supabaseAdmin: SupabaseClient | null = null;

export function getSupabaseAdmin(): SupabaseClient {
  if (_supabaseAdmin) return _supabaseAdmin;

  const url = process.env.SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !serviceKey) {
    throw new Error("Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY");
  }

  _supabaseAdmin = createClient(url, serviceKey, {
    auth: { persistSession: false },
  });

  return _supabaseAdmin;
}

// For backward compatibility - will throw at runtime if env vars missing
export const supabaseAdmin = (() => {
  const url = process.env.SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  
  // During build time, return a placeholder that will be replaced at runtime
  if (!url || !serviceKey) {
    console.warn("Supabase credentials not available - using placeholder for build");
    return null as unknown as SupabaseClient;
  }
  
  return createClient(url, serviceKey, {
    auth: { persistSession: false },
  });
})();
