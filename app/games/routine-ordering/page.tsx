"use client";

import { useEffect, useState } from "react";
import RoutineOrderingGame from "@/components/games/routine-ordering/RoutineOrderingGame";
import { RoutineStep } from "@/components/games/routine-ordering/types";
import { useActivePatientId } from "@/lib/stores/app-store";
import { useGameSessions } from "@/lib/hooks/use-game-sessions";

export default function RoutineOrderingPage() {
  const patientId = useActivePatientId();
  const { recordSession } = useGameSessions();
  const [routine, setRoutine] = useState<RoutineStep[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    async function load() {
      try {
        const { loadMorningRoutine } = await import(
          "@/components/games/routine-ordering/routineData"
        );
        const remote = await loadMorningRoutine(patientId);
        if (mounted) setRoutine(remote || []);
      } catch (e) {
        console.error(e);
      } finally {
        if (mounted) setLoading(false);
      }
    }

    load();
    return () => {
      mounted = false;
    };
  }, [patientId]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-amber-50">
        <p className="font-bold text-amber-900">Loading routine…</p>
      </div>
    );
  }

  if (!routine.length) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-amber-50 px-6 text-center">
        <p className="max-w-md font-bold text-amber-900">
          No daily routine steps found for this patient. Add them in the caregiver Profile & Setup
          page.
        </p>
      </div>
    );
  }

  return (
    <RoutineOrderingGame
      patientId={patientId}
      difficulty={1}
      routine={routine}
      onComplete={async (result) => {
        try {
          const { saveRoutineResult } = await import(
            "@/components/games/routine-ordering/supabaseHelpers"
          );
          await saveRoutineResult(result);
          await recordSession.mutateAsync({
            patientId,
            gameId: result.gameId || "routine-ordering",
            difficulty: result.difficulty,
            score: result.score,
            accuracy: result.accuracy,
            attempts: result.attempts,
            responseTime: result.responseTime,
            hintsUsed: result.hintsUsed,
            completed: result.completed,
            startedAt: result.timestamp,
            completedAt: new Date().toISOString(),
          });
        } catch (e) {
          console.error("Failed to persist result:", e);
        }
      }}
    />
  );
}
