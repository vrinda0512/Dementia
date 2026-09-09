import { createClient, SupabaseClient } from "@supabase/supabase-js";
import { createClient as createBrowserClient } from "@/lib/supabase/client";
import { SUPABASE_URL, SUPABASE_ANON_KEY, isSupabaseConfigured } from "@/lib/supabase/config";

/**
 * Unified Supabase access for game helpers and services.
 * Prefer createBrowserClient() in React; this export keeps legacy imports working.
 */
export const supabaseClient: SupabaseClient | null = isSupabaseConfigured()
  ? createClient(SUPABASE_URL, SUPABASE_ANON_KEY)
  : null;

export function getSupabaseClient(): SupabaseClient | null {
  if (!isSupabaseConfigured()) return null;
  try {
    // Browser path: cookie-aware SSR client
    if (typeof window !== "undefined") {
      return createBrowserClient() as unknown as SupabaseClient;
    }
  } catch {
    // fall through
  }
  return supabaseClient;
}
