"use client";

import { AlertCircle, CheckCircle2, LoaderCircle, Mic, Square } from "lucide-react";
import styles from "./JournalDiary.module.css";
import type { SpeechRecordingStatus } from "@/lib/hooks/use-sarvam-stt";

type VoiceButtonProps = {
  onPress: () => void;
  status: SpeechRecordingStatus;
  message: string;
};

export function VoiceButton({ onPress, status, message }: VoiceButtonProps) {
  const hint = status === "idle" ? "Tap to speak" : message;
  const label = status === "recording" ? "Stop recording" : "Start voice journaling";

  return (
    <div className={styles.voiceControl}>
      <button
        className={styles.voiceButton}
        data-status={status}
        type="button"
        onClick={onPress}
        disabled={status === "processing"}
        aria-label={label}
        title={label}
      >
        {status === "recording" && <Square size={17} fill="currentColor" />}
        {status === "processing" && <LoaderCircle size={19} className={styles.voiceSpinner} />}
        {status === "success" && <CheckCircle2 size={19} />}
        {status === "error" && <AlertCircle size={19} />}
        {status === "idle" && <Mic size={19} strokeWidth={1.8} />}
      </button>
      {hint && <span className={styles.voiceHint} role="status">{hint}</span>}
    </div>
  );
}
