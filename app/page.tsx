"use client";

import RoutineOrderingGame from "@/components/games/routine-ordering/RoutineOrderingGame";
import { demoPatient } from "@/components/patient/patientData";

export default function Home() {
  return (
    <RoutineOrderingGame
      patientId={demoPatient.id}
      difficulty={1}
      routine={demoPatient.routine}
      onComplete={(result) => {
        console.log("MEMORA RESULT:", result);
      }}
    />
  );
}