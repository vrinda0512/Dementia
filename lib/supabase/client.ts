import { createBrowserClient } from "@supabase/ssr";
import { SUPABASE_URL, SUPABASE_ANON_KEY, isSupabaseConfigured } from "./config";

export function createClient() {
  const key = isSupabaseConfigured() ? SUPABASE_ANON_KEY : "placeholder-key";
  return createBrowserClient(SUPABASE_URL, key);
}
