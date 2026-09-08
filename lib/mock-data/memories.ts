import type { Memory } from "@/lib/types";

export const demoMemories: Memory[] = [
  {
    id: "mem-001",
    patientId: "patient-001",
    title: "Shillong Family Trip",
    description: "Meena went to Shillong hills with Rajesh and Priya in spring 2018.",
    category: "trip",
    people: ["Rajesh", "Priya"],
    date: "2018-04-15",
    imageUrl: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=600&auto=format&fit=crop&q=80",
    createdAt: "2026-01-10T10:00:00Z",
  },
  {
    id: "mem-002",
    patientId: "patient-001",
    title: "Favourite Food",
    description: "Steamed vegetable momos with red chutney — Meena's favourite treat.",
    category: "food",
    people: ["Rajesh"],
    date: "2023-08-20",
    imageUrl: "https://images.unsplash.com/photo-1534422298391-e4f8c172dddb?w=600&auto=format&fit=crop&q=80",
    createdAt: "2026-01-12T11:30:00Z",
  },
  {
    id: "mem-003",
    patientId: "patient-001",
    title: "Family Garden",
    description: "Planting marigolds in the courtyard with grandson Aarav.",
    category: "family",
    people: ["Aarav"],
    date: "2024-11-05",
    imageUrl: "https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?w=600&auto=format&fit=crop&q=80",
    createdAt: "2026-01-15T14:20:00Z",
  },
];
