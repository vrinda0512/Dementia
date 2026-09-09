import { DiaryWritingPage } from "./DiaryWritingPage";
import styles from "./JournalDiary.module.css";
import type { SpeechRecordingStatus } from "@/lib/hooks/use-sarvam-stt";

type DiaryPagesProps = {
  entry: string;
  onEntryChange: (value: string) => void;
  onVoicePress: () => void;
  voiceStatus: SpeechRecordingStatus;
  voiceMessage: string;
  isWritingActive: boolean;
};

export function DiaryPages({ entry, onEntryChange, onVoicePress, voiceStatus, voiceMessage, isWritingActive }: DiaryPagesProps) {
  return (
    <>
      <div className={styles.pageStack} aria-hidden="true">
        <span /><span /><span /><span />
      </div>
      <div className={styles.leftPage} aria-hidden="true">
        <div className={styles.leftPageWriting}>A few pages<br />of gentle memories</div>
      </div>
      <div className={styles.turningPage} aria-hidden="true">
        <div className={styles.turningPageFront} />
        <div className={styles.turningPageBack} />
      </div>
      <DiaryWritingPage
        entry={entry}
        onEntryChange={onEntryChange}
        onVoicePress={onVoicePress}
        voiceStatus={voiceStatus}
        voiceMessage={voiceMessage}
        isActive={isWritingActive}
      />
    </>
  );
}
