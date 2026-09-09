export type PersonalRoutineStep = {
  id: string;
  label: string;
  emoji: string;
  location: string;
  description: string;
  timeOfDay?: string;
};

export type PatientProfile = {
  id: string;
  name: string;
  preferredLanguage: string;
  routine: PersonalRoutineStep[];
};