import { PatientProfile } from "./types";

export const demoPatient: PatientProfile = {
  id: "demo-patient-001",

  name: "Meena",

  preferredLanguage: "English",

  routine: [
    {
      id: "wake-up",
      label: "Wake Up",
      emoji: "/wake%20up%20emoji.jpg",
      location: "Bedroom",
      description: "You wake up and begin your morning.",
      timeOfDay: "6:30 AM",
    },
    {
      id: "tea",
      label: "Have Tea",
      emoji: "/have%20tea%20emoji.jpg",
      location: "Kitchen",
      description: "You enjoy your morning tea.",
      timeOfDay: "7:00 AM",
    },
    {
      id: "medicine",
      label: "Take Medicine",
      emoji: "/medicine%20icon.jpg",
      location: "Medicine Shelf",
      description: "You take your morning medicine.",
      timeOfDay: "7:15 AM",
    },
    {
      id: "breakfast",
      label: "Have Breakfast",
      emoji: "🍽️",
      location: "Dining Table",
      description: "You sit down and have breakfast.",
      timeOfDay: "8:00 AM",
    },
  ],
};