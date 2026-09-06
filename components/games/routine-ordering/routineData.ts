import { RoutineStep } from "./types";

export const morningRoutine: RoutineStep[] = [
  {
    id: "wake-up",
    label: "Wake Up",
    emoji: "🌅",
    location: "Bedroom",
    description: "You wake up and begin your morning.",
  },

  {
    id: "brush-teeth",
    label: "Brush Teeth",
    emoji: "🪥",
    location: "Bathroom",
    description: "You freshen up in the bathroom.",
  },

  {
    id: "tea",
    label: "Have Tea",
    emoji: "☕",
    location: "Kitchen",
    description: "You sit down and enjoy your morning tea.",
  },

  {
    id: "medicine",
    label: "Take Medicine",
    emoji: "💊",
    location: "Medicine Shelf",
    description: "You take your morning medicine.",
  },

  {
    id: "breakfast",
    label: "Have Breakfast",
    emoji: "🍽️",
    location: "Breakfast Table",
    description: "You sit down for breakfast.",
  },
];