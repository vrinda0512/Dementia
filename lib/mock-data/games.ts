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
    id: "memory-map",
    name: "Memory Map",
    type: "spatial",
    description: "Navigate familiar places and locations. Strengthens spatial memory and environmental awareness.",
    minDifficulty: 1,
    maxDifficulty: 5,
    active: true,
    createdAt: "2026-01-01T00:00:00Z",
  },
  {
    id: "therapeutic-tea-room-2-AG",
    name: "Quiet Tea Room",
    type: "therapeutic",
    description: "A calming, multi-sensory tea-making experience. Reduces anxiety while exercising procedural memory.",
    minDifficulty: 1,
    maxDifficulty: 3,
    active: true,
    createdAt: "2026-01-01T00:00:00Z",
  },
  {
    id: "journal-diary",
    name: "My Journal",
    type: "expression",
    description: "A guided journaling experience for self-expression. Strengthens narrative memory and emotional well-being.",
    minDifficulty: 1,
    maxDifficulty: 3,
    active: true,
    createdAt: "2026-01-01T00:00:00Z",
  },
];

export const gameEmojis: Record<string, string> = {
  "routine-ordering": "🧠",
  "memory-map": "🗺️",
  "therapeutic-tea-room-2-AG": "🍵",
  "journal-diary": "📔",
};

export const gameColors: Record<string, { bg: string; text: string; border: string }> = {
  "routine-ordering": {
    bg: "bg-amber-50",
    text: "text-amber-700",
    border: "border-amber-200",
  },
  "memory-map": {
    bg: "bg-emerald-50",
    text: "text-emerald-700",
    border: "border-emerald-200",
  },
  "therapeutic-tea-room-2-AG": {
    bg: "bg-teal-50",
    text: "text-teal-700",
    border: "border-teal-200",
  },
  "journal-diary": {
    bg: "bg-violet-50",
    text: "text-violet-700",
    border: "border-violet-200",
  },
};
