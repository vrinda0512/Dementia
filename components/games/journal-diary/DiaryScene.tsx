"use client";

import { BookOpen, ChevronDown, Feather } from "lucide-react";
import { DiaryCover } from "./DiaryCover";
import { DiaryPages } from "./DiaryPages";
import styles from "./JournalDiary.module.css";
import type { DiaryStage } from "./types";
import type { SpeechRecordingStatus } from "@/lib/hooks/use-sarvam-stt";

type DiarySceneProps = {
  stage: DiaryStage;
  entry: string;
  onOpen: () => void;
  onClose: () => void;
  onEntryChange: (value: string) => void;
  onVoicePress: () => void;
  voiceStatus: SpeechRecordingStatus;
  voiceMessage: string;
};

export function DiaryScene({ stage, entry, onOpen, onClose, onEntryChange, onVoicePress, voiceStatus, voiceMessage }: DiarySceneProps) {
  const isClosed = stage === "closed";
  const isWritingReady = stage === "open";

  return (
    <main className={styles.journal} data-stage={stage}>
      <div className={styles.windowGlow} aria-hidden="true" />
      <div className={styles.deskGrain} aria-hidden="true" />
      <div className={styles.gamosaRunner} aria-hidden="true" />
      <div className={styles.deskShadow} aria-hidden="true" />
      <div className={styles.penHolder} aria-hidden="true"><span /><span /><span /></div>
      <div className={styles.bambooPen} aria-hidden="true" />

      <header className={styles.sceneHeader}>
        <span className={styles.headerMark}><Feather size={17} /></span>
        <span>Journal Diary</span>
      </header>

      <section className={styles.sceneCopy} aria-live="polite">
        {isClosed ? (
          <>
            <span className={styles.eyebrow}>A quiet place for your thoughts</span>
            <h1>Open your diary.</h1>
            <p>There is no right way to remember a day.</p>
          </>
        ) : (
          <>
            <span className={styles.eyebrow}>Your page for today</span>
            <h1>Take your time.</h1>
          </>
        )}
      </section>

      <div className={styles.diaryStage}>
        <div className={styles.diaryShell}>
          <div className={styles.diarySpine} aria-hidden="true" />
          <div className={styles.diaryBook}>
            <DiaryPages entry={entry} onEntryChange={onEntryChange} onVoicePress={onVoicePress} voiceStatus={voiceStatus} voiceMessage={voiceMessage} isWritingActive={isWritingReady} />
            <button className={styles.coverButton} type="button" onClick={onOpen} disabled={!isClosed} aria-label="Open diary">
              <DiaryCover />
            </button>
          </div>
        </div>
      </div>

      {isClosed && <button className={styles.openPrompt} type="button" onClick={onOpen}><BookOpen size={19} /> Open diary</button>}
      {isWritingReady && <button className={styles.closeButton} type="button" onClick={onClose}><ChevronDown size={19} /> Close diary</button>}
    </main>
  );
}
