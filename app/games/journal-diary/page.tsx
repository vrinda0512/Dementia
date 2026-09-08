"use client";

import dynamic from "next/dynamic";

const JournalDiary = dynamic(() => import("@/components/games/journal-diary/JournalDiary"), {
  ssr: false,
  loading: () => <main style={{ minHeight: "100dvh", background: "#b88b57" }} aria-label="Loading Journal Diary" />,
});

export default function JournalDiaryPage() {
  return <JournalDiary />;
}
