"use client";

import { LoaderCircle, Volume2, VolumeX } from "lucide-react";
import { useSarvamTts } from "@/lib/hooks/use-sarvam-tts";

interface VoiceButtonProps {
  textToSpeak: string;
  className?: string;
  size?: "sm" | "md" | "lg";
  iconOnly?: boolean;
}

export function VoiceButton({ textToSpeak, className = "", size = "md", iconOnly = false }: VoiceButtonProps) {
  const { speak, stop, status, message } = useSarvamTts();
  const isSpeaking = status === "speaking";
  const isRequesting = status === "requesting";

  const sizeClasses = {
    sm: "px-3 py-1.5 text-sm gap-1.5",
    md: "px-5 py-3 text-lg font-bold gap-2 rounded-2xl",
    lg: "px-8 py-4 text-xl font-extrabold gap-3 rounded-3xl",
  };

  return (
    <span className="inline-flex max-w-xs flex-col items-center gap-1.5">
      <button
        type="button"
        onClick={() => (isSpeaking ? stop() : void speak(textToSpeak))}
        disabled={isRequesting}
        className={`inline-flex items-center justify-center transition-all transform active:scale-95 shadow-md bg-amber-500 hover:bg-amber-600 text-white border-2 border-amber-400 focus:outline-none focus:ring-4 focus:ring-amber-200 disabled:cursor-wait disabled:opacity-70 ${iconOnly ? "h-11 w-11 rounded-full p-0" : sizeClasses[size]} ${className}`}
        aria-label={isSpeaking ? "Stop voice prompt" : "Listen to voice prompt"}
        title={isSpeaking ? "Stop voice prompt" : "Listen to voice prompt"}
      >
        {isRequesting ? (
          <LoaderCircle className="w-5 h-5 animate-spin" />
        ) : isSpeaking ? (
          <>
            <VolumeX className="w-6 h-6 animate-pulse" />
            {!iconOnly && <span>Stop listening</span>}
          </>
        ) : (
          <>
            <Volume2 className="w-6 h-6" />
            {!iconOnly && <span>Listen</span>}
          </>
        )}
      </button>
      {message && <span className="text-center text-xs font-semibold text-amber-800" role="status">{message}</span>}
    </span>
  );
}
