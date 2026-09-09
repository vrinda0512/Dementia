import type { Reminder } from "@/lib/types";

export const demoReminders: Reminder[] = [
  {
    id: "rem-001",
    patientId: "patient-001",
    type: "medicine",
    title: "Medicine",
    description: "Blood pressure medicine",
    scheduledTime: "10:00 AM",
    //recurring: "Daily",
    completed: true,
    //active: true,
  },
  {
    id: "rem-002",
    patientId: "patient-001",
    type: "hydration",
    title: "Drink Water",
    description: "Drink a warm glass of water",
    scheduledTime: "11:30 AM",
    //recurring: "Every 2 hours",
    completed: false,
    //active: true,
  },
  {
    id: "rem-003",
    patientId: "patient-001",
    type: "activity",
    title: "Evening Walk",
    description: "Gentle stroll in the garden",
    scheduledTime: "5:00 PM",
    // recurring: "Daily",
    completed: false,
    //active: true,
  },
];
