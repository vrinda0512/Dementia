/** Shared Supabase project config used by browser + legacy clients. */

export const SUPABASE_URL =
  process.env.NEXT_PUBLIC_SUPABASE_URL ||
  "https://mcxjoetyewldeybhjzrr.supabase.co";

export const SUPABASE_ANON_KEY =
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
  "";

/** True when a real anon/publishable key is present (not empty / placeholder). */
export function isSupabaseConfigured(): boolean {
  return Boolean(
    SUPABASE_URL &&
      SUPABASE_ANON_KEY &&
      SUPABASE_ANON_KEY !== "placeholder-key" &&
      SUPABASE_ANON_KEY.length > 20
  );
}

/** Demo caregiver id used when seeding / logging in without Auth. */
export const DEFAULT_CAREGIVER_ID = "b1eebc99-9c0b-4ef8-bb6d-6bb9bd380a11";

/** Demo patient id aligned with existing inserts in this project. */
export const DEFAULT_PATIENT_ID = "a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11";
