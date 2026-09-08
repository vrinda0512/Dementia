"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { DiaryAudio } from "./DiaryAudio";
import { DiaryScene } from "./DiaryScene";
import type { DiaryStage, JournalEntry } from "./types";

const STORAGE_KEY = "memora-journal-diary-entry-v1";
const INITIAL_ENTRY: JournalEntry = { text: "", updatedAt: null };

export default function JournalDiary() {
  const audioRef = useRef<DiaryAudio | null>(null);
  const sequenceTimers = useRef<number[]>([]);
  const hintTimer = useRef<number | null>(null);
  const [stage, setStage] = useState<DiaryStage>("closed");
  const [entry, setEntry] = useState(INITIAL_ENTRY.text);
  const [showVoiceHint, setShowVoiceHint] = useState(false);

  if (!audioRef.current) audioRef.current = new DiaryAudio();

  useEffect(() => {
    try {
      const saved = window.localStorage.getItem(STORAGE_KEY);
      if (!saved) return;
      const parsed = JSON.parse(saved) as Partial<JournalEntry>;
      if (typeof parsed.text === "string") setEntry(parsed.text);
    } catch {
      // Local persistence is optional; a malformed stored value should not prevent writing.
    }

    return () => {
      sequenceTimers.current.forEach((timer) => window.clearTimeout(timer));
      if (hintTimer.current !== null) window.clearTimeout(hintTimer.current);
      audioRef.current?.dispose();
    };
  }, []);

  const schedule = useCallback((callback: () => void, delay: number) => {
    const timer = window.setTimeout(callback, delay);
    sequenceTimers.current.push(timer);
  }, []);

  const openDiary = useCallback(() => {
    if (stage !== "closed") return;
    audioRef.current?.playCover();
    setStage("opening");
    schedule(() => {
      audioRef.current?.playPageTurn();
      setStage("turning");
    }, 520);
    schedule(() => setStage("open"), 1160);
  }, [schedule, stage]);

  const closeDiary = useCallback(() => {
    if (stage !== "open") return;
    audioRef.current?.playCover();
    setStage("closing");
    schedule(() => setStage("closed"), 680);
  }, [schedule, stage]);

  const updateEntry = useCallback((text: string) => {
    setEntry(text);
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify({ text, updatedAt: new Date().toISOString() } satisfies JournalEntry));
    } catch {
      // Writing remains available even if browser storage is disabled.
    }
  }, []);

  const showVoicePlaceholder = useCallback(() => {
    setShowVoiceHint(true);
    if (hintTimer.current !== null) window.clearTimeout(hintTimer.current);
    hintTimer.current = window.setTimeout(() => {
      setShowVoiceHint(false);
      hintTimer.current = null;
    }, 1800);
  }, []);

  return <DiaryScene stage={stage} entry={entry} onOpen={openDiary} onClose={closeDiary} onEntryChange={updateEntry} onVoicePress={showVoicePlaceholder} showVoiceHint={showVoiceHint} />;
}
