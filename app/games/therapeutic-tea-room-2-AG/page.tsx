"use client";

import dynamic from "next/dynamic";
import { demoPatient } from "@/components/patient/patientData";
import type { TherapeuticGameContext, TherapeuticSessionEvent } from "@/components/games/therapeutic-tea-room-2-AG/types";

const TherapeuticTeaRoomGame = dynamic(
  () => import("@/components/games/therapeutic-tea-room-2-AG/Game"),
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

export default function TherapeuticTeaRoomPage() {
  const handleSessionEvent = (event: TherapeuticSessionEvent) => {
    // The route remains the session boundary until a persistence gateway is introduced.
    console.info("SMARIKA THERAPEUTIC SESSION:", event);
  };

  return <TherapeuticTeaRoomGame context={demoContext} onSessionEvent={handleSessionEvent} />;
}
