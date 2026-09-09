"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { DiaryAudio } from "./DiaryAudio";
import { DiaryScene } from "./DiaryScene";
import type { DiaryStage, JournalEntry } from "./types";
import { useSarvamStt } from "@/lib/hooks/use-sarvam-stt";

const STORAGE_KEY = "smarika-journal-diary-entry-v1";
const INITIAL_ENTRY: JournalEntry = { text: "", updatedAt: null };

export default function JournalDiary() {
  const audioRef = useRef<DiaryAudio | null>(null);
  const sequenceTimers = useRef<number[]>([]);
  const entryRef = useRef(INITIAL_ENTRY.text);
  const [stage, setStage] = useState<DiaryStage>("closed");
  const [entry, setEntry] = useState(INITIAL_ENTRY.text);

  if (!audioRef.current) audioRef.current = new DiaryAudio();

  useEffect(() => {
    try {
      const saved = window.localStorage.getItem(STORAGE_KEY);
      if (!saved) return;
      const parsed = JSON.parse(saved) as Partial<JournalEntry>;
      if (typeof parsed.text === "string") {
        entryRef.current = parsed.text;
        setEntry(parsed.text);
      }
    } catch {
      // Local persistence is optional; a malformed stored value should not prevent writing.
    }

    return () => {
      sequenceTimers.current.forEach((timer) => window.clearTimeout(timer));
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

  const persistEntry = useCallback((text: string) => {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify({ text, updatedAt: new Date().toISOString() } satisfies JournalEntry));
    } catch {
      // Writing remains available even if browser storage is disabled.
    }
  }, []);

  const updateEntry = useCallback((text: string) => {
    entryRef.current = text;
    setEntry(text);
    persistEntry(text);
  }, [persistEntry]);

  const appendTranscript = useCallback((transcript: string) => {
    const previous = entryRef.current;
    const separator = previous && !/\s$/.test(previous) ? " " : "";
    const nextEntry = `${previous}${separator}${transcript}`;
    entryRef.current = nextEntry;
    setEntry(nextEntry);
    persistEntry(nextEntry);
  }, [persistEntry]);

  const { status: voiceStatus, message: voiceMessage, toggleRecording } = useSarvamStt(appendTranscript);

  return <DiaryScene stage={stage} entry={entry} onOpen={openDiary} onClose={closeDiary} onEntryChange={updateEntry} onVoicePress={toggleRecording} voiceStatus={voiceStatus} voiceMessage={voiceMessage} />;
}
