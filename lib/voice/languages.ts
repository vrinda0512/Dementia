export const PATIENT_LANGUAGE_CODES = ["en-IN", "hi-IN", "as-IN"] as const;

export type PatientLanguageCode = (typeof PATIENT_LANGUAGE_CODES)[number];

export type PatientLanguage = {
  code: PatientLanguageCode;
  label: string;
  nativeLabel: string;
  ttsAvailable: boolean;
};

export const PATIENT_LANGUAGES: readonly PatientLanguage[] = [
  { code: "en-IN", label: "English", nativeLabel: "English", ttsAvailable: true },
  { code: "hi-IN", label: "Hindi", nativeLabel: "हिंदी", ttsAvailable: true },
  { code: "as-IN", label: "Assamese", nativeLabel: "অসমীয়া", ttsAvailable: false },
];

export const DEFAULT_PATIENT_LANGUAGE: PatientLanguageCode = "en-IN";

const LEGACY_LANGUAGE_CODES: Record<string, PatientLanguageCode> = {
  English: "en-IN",
  Hindi: "hi-IN",
  Assamese: "as-IN",
};

export function isPatientLanguageCode(value: unknown): value is PatientLanguageCode {
  return typeof value === "string" && PATIENT_LANGUAGE_CODES.includes(value as PatientLanguageCode);
}

export function normalizePatientLanguage(value: unknown): PatientLanguageCode {
  if (isPatientLanguageCode(value)) return value;
  if (typeof value === "string" && value in LEGACY_LANGUAGE_CODES) {
    return LEGACY_LANGUAGE_CODES[value];
  }

  return DEFAULT_PATIENT_LANGUAGE;
}

export function getPatientLanguage(value: unknown): PatientLanguage {
  const code = normalizePatientLanguage(value);
  return PATIENT_LANGUAGES.find((language) => language.code === code) ?? PATIENT_LANGUAGES[0];
}
