import { getSupabaseClient } from "@/lib/supabaseClient";
import { RoutineGameResult } from "./types";

export async function saveRoutineResult(result: RoutineGameResult) {
  try {
    const supabase = getSupabaseClient();

    if (!supabase) {
      console.info("Supabase not configured - skipping save of routine result");
      return { ok: false, message: "Supabase not configured" };
    }

    const payload = {
      patient_id: result.patientId,
      game_id: result.gameId,
      score: result.score,
      accuracy: result.accuracy,
      attempts: result.attempts,
      response_time: result.responseTime,
      difficulty: result.difficulty,
      hints_used: result.hintsUsed,
      completed: result.completed,
      timestamp: result.timestamp,
      challenges: result.challenges,
    };

    const { data, error } = await supabase.from("routine_results").insert([payload]);

    if (error) {
      console.error("Error saving routine result:", error);
      return { ok: false, error };
    }

    return { ok: true, data };
  } catch (e) {
    console.error("Failed to save routine result:", e);
    return { ok: false, error: e };
  }
}
