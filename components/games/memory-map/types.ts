export type MemoryCategory =
  | "family"
  | "personal"
  | "childhood"
  | "food"
  | "music"
  | "hobbies"
  | "places"
  | "home";

export type GameFormat =
  | "multiple-choice"
  | "voice"
  | "image"
  | "fill-blank";

export interface MemoryQuestion {
  id: string;
  category: MemoryCategory;
  question: string;
  answer: string;
  options?: string[];
  format: GameFormat;
  image?: string;
  audio?: string;
}

export interface MemoryCategoryInfo {
  id: MemoryCategory;
  title: string;
  description: string;
  emoji: string;
  color: string;
  position: string;
}