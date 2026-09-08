"use client";

import dynamic from "next/dynamic";

const JournalDiary = dynamic(
  () => import("@/components/games/journal-diary/JournalDiary"),
  {
    ssr: false,
    loading: () => <main style={{ minHeight: "100dvh", display: "flex", justifyContent: "center", alignItems: "center" }}>Loading Journal...</main>,
  }
);

export default function PatientJournalDiaryPage() {
  return <JournalDiary />;
}
