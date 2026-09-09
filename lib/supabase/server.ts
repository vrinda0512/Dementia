import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { SUPABASE_URL, SUPABASE_ANON_KEY, isSupabaseConfigured } from "./config";

export async function createServerSupabaseClient() {
  const cookieStore = await cookies();
  const key = isSupabaseConfigured() ? SUPABASE_ANON_KEY : "placeholder-key";

  return createServerClient(SUPABASE_URL, key, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) =>
            cookieStore.set(name, value, options)
          );
        } catch {
          // Server Component — cookie writes may be ignored.
        }
      },
    },
  });
}
