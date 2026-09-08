export type DiaryStage = "closed" | "opening" | "turning" | "open" | "closing";

export type JournalEntry = {
  text: string;
  updatedAt: string | null;
};
