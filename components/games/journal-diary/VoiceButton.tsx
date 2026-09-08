"use client";

import { Mic } from "lucide-react";
import styles from "./JournalDiary.module.css";

type VoiceButtonProps = {
  onPress: () => void;
  isShowingHint: boolean;
};

export function VoiceButton({ onPress, isShowingHint }: VoiceButtonProps) {
  return (
    <div className={styles.voiceControl}>
      <button className={styles.voiceButton} type="button" onClick={onPress} aria-label="Voice journaling coming soon" title="Voice journaling coming soon">
        <Mic size={19} strokeWidth={1.8} />
      </button>
      {isShowingHint && <span className={styles.voiceHint} role="status">Voice journaling is coming soon</span>}
    </div>
  );
}
