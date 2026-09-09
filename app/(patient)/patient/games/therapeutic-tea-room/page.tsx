"use client";

import dynamic from "next/dynamic";
import { demoPatient } from "@/components/patient/patientData";
import type { TherapeuticGameContext, TherapeuticSessionEvent } from "@/components/games/therapeutic-tea-room/types";

const TherapeuticTeaRoomGame = dynamic(
  () => import("@/components/games/therapeutic-tea-room/Game"),
  {
    ssr: false,
    loading: () => <main style={{ minHeight: "100dvh", background: "#829a85" }} aria-label="Loading Quiet Tea Room" />,
  }
);

const demoContext: TherapeuticGameContext = {
  patientId: demoPatient.id,
  locale: demoPatient.preferredLanguage === "English" ? "en-IN" : "en",
  therapeuticConfig: {
    sensoryMode: "quiet",
    preferredObjects: ["kettle", "cup", "photo"],
  },
  accessibility: {
    reducedMotion: false,
    soundEnabled: true,
  },
  routine: demoPatient.routine.map(({ id, label, location }) => ({ id, label, location })),
};

export default function PatientTherapeuticTeaRoomPage() {
  const handleSessionEvent = (event: TherapeuticSessionEvent) => {
    console.info("SMARIKA THERAPEUTIC SESSION:", event);
  };

  return <TherapeuticTeaRoomGame context={demoContext} onSessionEvent={handleSessionEvent} />;
}
