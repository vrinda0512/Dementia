import { RoutineStep } from "./types";

/**
 * Load the patient's routine from Supabase `routines` table.
 * Returns [] when empty or unavailable (no silent hardcoded swap when DB is configured).
 */
export async function loadMorningRoutine(patientId?: string): Promise<RoutineStep[]> {
  try {
    const { getSupabaseClient } = await import("@/lib/supabaseClient");
    const { isSupabaseConfigured } = await import("@/lib/supabase/config");
    const supabase = getSupabaseClient();

    if (!supabase || !isSupabaseConfigured()) {
      console.warn("Supabase not configured — no routines loaded");
      return [];
    }

    let query = supabase
      .from("routines")
      .select(
        "id, patient_id, label, emoji, location, description, time_of_day, step_order, active"
      )
      .eq("active", true)
      .order("step_order", { ascending: true });

    if (patientId) {
      query = query.eq("patient_id", patientId);
    }

    const { data, error } = await query;

    if (error) {
      console.error("Supabase error fetching routines:", error);
      return [];
    }

    if (!data || data.length === 0) return [];

    return (data as any[]).map((row) => ({
      id: String(row.id),
      label: String(row.label),
      emoji: row.emoji ? String(row.emoji) : "",
      location: row.location ? String(row.location) : "",
      description: row.description ? String(row.description) : "",
      timeOfDay: row.time_of_day ? String(row.time_of_day) : undefined,
      stepOrder: typeof row.step_order !== "undefined" ? Number(row.step_order) : undefined,
      active: row.active === true,
    }));
  } catch (e) {
    console.error("Failed to load routines from Supabase:", e);
    return [];
  }
}

/** @deprecated Kept for type imports; prefer DB-backed loadMorningRoutine. */
export const morningRoutine: RoutineStep[] = [];
