import type { Patient, Caregiver } from "@/lib/types";

export const demoCaregiver: Caregiver = {
  id: "caregiver-001",
  name: "Dr. Ananya Sharma",
  email: "ananya@smarika.care",
};

export const demoPatient: Patient = {
  id: "patient-001",
  name: "Meena Sharma",
  age: 72,
  preferredLanguage: "Hindi",
  location: "Shillong",
  caregiverId: "caregiver-001",
};
