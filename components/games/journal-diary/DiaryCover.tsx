import styles from "./JournalDiary.module.css";

export function DiaryCover() {
  return (
    <div className={styles.coverArt} aria-hidden="true">
      <span className={styles.coverBorder} />
      <span className={styles.coverTitle}>My Journal</span>
      <span className={styles.coverSubtitle}>Quiet moments, held close</span>
      <span className={styles.textileBand}>
        <i /><i /><i /><i /><i /><i /><i />
      </span>
      <span className={styles.coverLeaf}>✦</span>
    </div>
  );
}
