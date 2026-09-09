"use client";

import { useEffect, useMemo, useRef } from "react";
import { VoiceButton } from "./VoiceButton";
import styles from "./JournalDiary.module.css";
import type { SpeechRecordingStatus } from "@/lib/hooks/use-sarvam-stt";

type DiaryWritingPageProps = {
  entry: string;
  onEntryChange: (value: string) => void;
  onVoicePress: () => void;
  voiceStatus: SpeechRecordingStatus;
  voiceMessage: string;
  isActive: boolean;
};

export function DiaryWritingPage({ entry, onEntryChange, onVoicePress, voiceStatus, voiceMessage, isActive }: DiaryWritingPageProps) {
  const entryRef = useRef<HTMLTextAreaElement>(null);
  const date = useMemo(
    () => new Intl.DateTimeFormat("en-IN", { weekday: "long", day: "numeric", month: "long", year: "numeric" }).format(new Date()),
    []
  );

  useEffect(() => {
    if (isActive) entryRef.current?.focus();
  }, [isActive]);

  return (
    <div className={styles.writingPage} aria-hidden={!isActive}>
      <div className={styles.pageHeader}>
        <span className={styles.pagePrompt}>What do you remember about today?</span>
        <time dateTime={new Date().toISOString().slice(0, 10)}>{date}</time>
      </div>
      <div className={styles.writingRule} />
      <textarea
        ref={entryRef}
        className={styles.entryField}
        value={entry}
        onChange={(event) => onEntryChange(event.target.value)}
        placeholder="Let your thoughts rest here..."
        aria-label="Your journal entry"
        spellCheck
        readOnly={!isActive}
        tabIndex={isActive ? 0 : -1}
      />
      <VoiceButton onPress={onVoicePress} status={voiceStatus} message={voiceMessage} />
      <span className={styles.pageNumber}>1</span>
    </div>
  );
}
