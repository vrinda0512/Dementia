import "server-only";

import type { PatientLanguageCode } from "@/lib/voice/languages";
import { getSarvamClient } from "./client";

export async function transcribeSpeech(audio: File, language: PatientLanguageCode) {
  const response = await getSarvamClient().speechToText.transcribe({
    file: audio,
    language_code: language,
    model: "saaras:v3",
    mode: "transcribe",
  });

  return response.transcript.trim();
}
