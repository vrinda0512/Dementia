import { NextResponse } from "next/server";

import { SarvamConfigurationError } from "@/lib/sarvam/client";
import { synthesizeSpeech, SarvamTtsUnavailableError } from "@/lib/sarvam/tts";
import { isPatientLanguageCode } from "@/lib/voice/languages";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const MAX_TTS_CHARACTERS = 500;

export async function POST(request: Request) {
  let body: { text?: unknown; language?: unknown };

  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ message: "Please provide a voice prompt." }, { status: 400 });
  }

  const text = typeof body.text === "string" ? body.text.trim() : "";
  if (!text || text.length > MAX_TTS_CHARACTERS) {
    return NextResponse.json(
      { message: "Please use a shorter voice prompt." },
      { status: 400 }
    );
  }

  if (!isPatientLanguageCode(body.language)) {
    return NextResponse.json({ message: "Please choose a supported language." }, { status: 400 });
  }

  try {
    const audio = await synthesizeSpeech(text, body.language);
    return NextResponse.json({ audio, mimeType: "audio/wav" });
  } catch (error) {
    if (error instanceof SarvamTtsUnavailableError) {
      return NextResponse.json({ message: error.message, code: "tts_unavailable" }, { status: 422 });
    }

    if (error instanceof SarvamConfigurationError) {
      return NextResponse.json({ message: "Voice playback is unavailable right now." }, { status: 503 });
    }

    return NextResponse.json({ message: "Voice playback could not be started. Please try again." }, { status: 502 });
  }
}
