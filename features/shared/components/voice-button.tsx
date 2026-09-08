"use client";

import { useState } from "react";
import { Volume2, VolumeX } from "lucide-react";

interface VoiceButtonProps {
  textToSpeak: string;
  className?: string;
  size?: "sm" | "md" | "lg";
}

export function VoiceButton({ textToSpeak, className = "", size = "md" }: VoiceButtonProps) {
  const [isSpeaking, setIsSpeaking] = useState(false);

  const speak = () => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) {
      alert("Voice playback is not supported on this browser.");
      return;
    }

    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      return;
    }

    window.speechSynthesis.cancel(); // Clear any previous queue
    const utterance = new SpeechSynthesisUtterance(textToSpeak);
    utterance.rate = 0.85; // Slightly slower, calm pace for elderly users
    utterance.pitch = 1.0;

    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    setIsSpeaking(true);
    window.speechSynthesis.speak(utterance);
  };

  const sizeClasses = {
    sm: "px-3 py-1.5 text-sm gap-1.5",
    md: "px-5 py-3 text-lg font-bold gap-2 rounded-2xl",
    lg: "px-8 py-4 text-xl font-extrabold gap-3 rounded-3xl",
  };

  return (
    <button
      type="button"
      onClick={speak}
      className={`inline-flex items-center justify-center transition-all transform active:scale-95 shadow-md bg-amber-500 hover:bg-amber-600 text-white border-2 border-amber-400 focus:outline-none focus:ring-4 focus:ring-amber-200 ${sizeClasses[size]} ${className}`}
      aria-label="Listen to voice prompt"
    >
      {isSpeaking ? (
        <>
          <VolumeX className="w-6 h-6 animate-pulse" />
          <span>Stop Listening</span>
        </>
      ) : (
        <>
          <Volume2 className="w-6 h-6" />
          <span>🔊 Tap to Listen</span>
        </>
      )}
    </button>
  );
}
