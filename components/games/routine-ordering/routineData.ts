import { RoutineStep } from "./types";

export const morningRoutine: RoutineStep[] = [
  {
    id: "wake-up",
    label: "Wake Up",
    emoji: "/wake%20up%20emoji.jpg",
    location: "Bedroom",
    description: "You wake up and begin your morning.",
  },

  {
    id: "brush-teeth",
    label: "Brush Teeth",
    emoji: "/bathroom%20emoji.jpg",
    location: "Bathroom",
    description: "You freshen up in the bathroom.",
  },

  {
    id: "tea",
    label: "Have Tea",
    emoji: "/have%20tea%20emoji.jpg",
    location: "Kitchen",
    description: "You sit down and enjoy your morning tea.",
  },

  {
    id: "medicine",
    label: "Take Medicine",
    emoji: "/medicine%20icon.jpg",
    location: "Medicine Shelf",
    description: "You take your morning medicine.",
  },

  {
    id: "breakfast",
    label: "Have Breakfast",
    emoji: "🍽️",
    location: "Breakfast Table",
    description: "You sit down for breakfast.",
  },
];

/**
 * Load the morning routine from Supabase if available, otherwise fall back
 * to the bundled `morningRoutine` constant.
 */
export async function loadMorningRoutine(patientId?: string): Promise<RoutineStep[]> {
  try {
    const { getSupabaseClient } = await import("../../../lib/supabaseClient");
    const supabase = getSupabaseClient();

    if (!supabase) return morningRoutine;

    // Expect a table `routines` with columns matching your schema:
    // id, patient_id, label, emoji, location, description, time_of_day, step_order, active
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
      return morningRoutine;
    }

    if (!data || data.length === 0) return morningRoutine;

    // Supabase returns generic `any[]` rows; coerce to RoutineStep[]
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
    return morningRoutine;
  }
}