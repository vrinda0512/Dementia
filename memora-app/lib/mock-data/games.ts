import type { Game } from "@/lib/types";

export const demoGames: Game[] = [
  {
    id: "routine-ordering",
    name: "Routine Recall",
    type: "routine",
    description: "Arrange daily activities in the correct order. Strengthens routine memory and daily planning skills.",
    minDifficulty: 1,
    maxDifficulty: 5,
    active: true,
    createdAt: "2026-01-01T00:00:00Z",
  },
  {
    id: "hide-object",
    name: "Hide the Object",
    type: "spatial",
    description: "Remember where an object was placed in a room. Improves spatial memory and visual attention.",
    minDifficulty: 1,
    maxDifficulty: 5,
    active: true,
    createdAt: "2026-01-01T00:00:00Z",
  },
  {
    id: "family-memory",
    name: "Family Memory",
    type: "recognition",
    description: "Identify familiar family members and memories. Strengthens personal recognition and emotional connections.",
    minDifficulty: 1,
    maxDifficulty: 5,
    active: true,
    createdAt: "2026-01-01T00:00:00Z",
  },
];

export const gameEmojis: Record<string, string> = {
  "routine-ordering": "🧠",
  "hide-object": "👁️",
  "family-memory": "❤️",
};

export const gameColors: Record<string, { bg: string; text: string; border: string }> = {
  "routine-ordering": {
    bg: "bg-blue-50",
    text: "text-blue-700",
    border: "border-blue-200",
  },
  "hide-object": {
    bg: "bg-purple-50",
    text: "text-purple-700",
    border: "border-purple-200",
  },
  "family-memory": {
    bg: "bg-rose-50",
    text: "text-rose-700",
    border: "border-rose-200",
  },
};
