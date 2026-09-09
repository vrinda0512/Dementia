import { NextResponse } from "next/server";

import { SarvamConfigurationError } from "@/lib/sarvam/client";
import { transcribeSpeech } from "@/lib/sarvam/stt";
import { isPatientLanguageCode } from "@/lib/voice/languages";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const MAX_AUDIO_BYTES = 10 * 1024 * 1024;

export async function POST(request: Request) {
  let formData: FormData;

  try {
    formData = await request.formData();
  } catch {
    return NextResponse.json({ message: "The recording could not be read." }, { status: 400 });
  }

  const audio = formData.get("audio");
  const language = formData.get("language");

  if (!(audio instanceof File) || audio.size === 0 || audio.size > MAX_AUDIO_BYTES) {
    return NextResponse.json({ message: "Please record a short audio clip before transcribing." }, { status: 400 });
  }

  if (!audio.type.startsWith("audio/")) {
    return NextResponse.json({ message: "This recording format is not supported." }, { status: 400 });
  }

  if (!isPatientLanguageCode(language)) {
    return NextResponse.json({ message: "Please choose a supported language." }, { status: 400 });
  }

  try {
    const transcript = await transcribeSpeech(audio, language);
    if (!transcript) {
      return NextResponse.json({ message: "No speech was heard. Please try again." }, { status: 422 });
    }

    return NextResponse.json({ transcript });
  } catch (error) {
    if (error instanceof SarvamConfigurationError) {
      return NextResponse.json({ message: "Transcription is unavailable right now." }, { status: 503 });
    }

    return NextResponse.json({ message: "Transcription could not be completed. Please try again." }, { status: 502 });
  }
}
