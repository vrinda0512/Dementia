"use client";

import { useEffect, useState } from "react";
import RoutineOrderingGame from "@/components/games/routine-ordering/RoutineOrderingGame";
import { demoPatient } from "@/components/patient/patientData";
import { RoutineStep } from "@/components/games/routine-ordering/types";

export default function RoutineOrderingPage() {
  const [routine, setRoutine] = useState<RoutineStep[]>(
    demoPatient.routine
  );

  useEffect(() => {
    let mounted = true;

    async function load() {
      try {
        const { loadMorningRoutine } = await import("@/components/games/routine-ordering/routineData");

        const remote = await loadMorningRoutine(demoPatient.id);

        if (mounted && remote && remote.length > 0) {
          setRoutine(remote);
        }
      } catch (e) {
        // keep demoPatient.routine as fallback
        // console.info("Using fallback routine", e);
      }
    }

    load();

    return () => {
      mounted = false;
    };
  }, []);

  return (
    <RoutineOrderingGame
      patientId={demoPatient.id}
      difficulty={1}
      routine={routine}
      onComplete={async (result) => {
        try {
          const { saveRoutineResult } = await import("@/components/games/routine-ordering/supabaseHelpers");
          const resp = await saveRoutineResult(result);

          if (!resp?.ok) {
            console.warn("Result not saved to Supabase", resp);
          }
        } catch (e) {
          console.error("Failed to persist result:", e);
        }

        console.log("MEMORA SESSION RESULT:", result);
      }}
    />
  );
}