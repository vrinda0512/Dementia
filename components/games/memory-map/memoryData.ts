import { MemoryCategoryInfo, MemoryQuestion } from "./types";
import type { PersonalizationQuestion } from "@/lib/types";

export const memoryCategories: MemoryCategoryInfo[] = [
  {
    id: "family",
    title: "Family",
    description: "People who are close to you",
    emoji: "🏠",
    color: "from-emerald-500 to-green-700",
    position: "left-[8%] top-[18%]",
  },
  {
    id: "childhood",
    title: "Childhood",
    description: "Memories from your younger days",
    emoji: "🌄",
    color: "from-orange-400 to-amber-600",
    position: "left-[45%] top-[5%]",
  },
  {
    id: "personal",
    title: "Personal Life",
    description: "Things about you",
    emoji: "🌿",
    color: "from-teal-500 to-cyan-700",
    position: "right-[7%] top-[20%]",
  },
  {
    id: "food",
    title: "Food & Favorites",
    description: "Foods and things you love",
    emoji: "🍲",
    color: "from-rose-400 to-orange-600",
    position: "left-[17%] bottom-[13%]",
  },
  {
    id: "music",
    title: "Music & Memories",
    description: "Songs and musical memories",
    emoji: "🎵",
    color: "from-purple-500 to-indigo-700",
    position: "right-[20%] bottom-[10%]",
  },
  {
    id: "hobbies",
    title: "Hobbies",
    description: "Things you enjoyed doing",
    emoji: "🌸",
    color: "from-pink-400 to-rose-600",
    position: "right-[5%] bottom-[29%]",
  },
  {
    id: "places",
    title: "Places & Travel",
    description: "Places that hold memories",
    emoji: "🗺️",
    color: "from-blue-400 to-cyan-700",
    position: "left-[10%] bottom-[35%]",
  },
  {
    id: "home",
    title: "Home",
    description: "Memories of home",
    emoji: "🏡",
    color: "from-yellow-400 to-orange-600",
    position: "left-[43%] top-[39%]",
  },
];

/** Legacy fallback — used only when DB has no personalization_questions. */
export const memoryQuestions: MemoryQuestion[] = [];

export function mapPersonalizationToMemoryQuestions(
  rows: PersonalizationQuestion[]
): MemoryQuestion[] {
  return rows.map((q) => ({
    id: q.id,
    category: q.category,
    question: q.question,
    answer: q.answer,
    options: q.options,
    format: q.format,
    image: q.image,
    audio: q.audio,
  }));
}

export async function loadMemoryQuestions(patientId: string): Promise<MemoryQuestion[]> {
  try {
    const { questionService } = await import("@/lib/supabase/services");
    const rows = await questionService.getQuestions(patientId);
    return mapPersonalizationToMemoryQuestions(rows);
  } catch (e) {
    console.error("loadMemoryQuestions:", e);
    return [];
  }
}
