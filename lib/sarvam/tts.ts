import "server-only";

import type { PatientLanguageCode } from "@/lib/voice/languages";
import { getSarvamClient } from "./client";

export class SarvamTtsUnavailableError extends Error {
  constructor() {
    super("Voice playback is not available for Assamese yet.");
    this.name = "SarvamTtsUnavailableError";
  }
}

export async function synthesizeSpeech(text: string, language: PatientLanguageCode) {
  if (language === "as-IN") {
    throw new SarvamTtsUnavailableError();
  }

  const response = await getSarvamClient().textToSpeech.convert({
    text,
    language_code: language,
    model: "bulbul:v3",
    speaker: "shubh",
    pace: 0.8,
    temperature: 0.3,
    output_audio_codec: "wav",
  });

  const audio = response.audios[0];
  if (!audio) {
    throw new Error("Sarvam did not return audio.");
  }

  return audio;
}
