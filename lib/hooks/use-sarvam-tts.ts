"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useAppStore } from "@/lib/stores/app-store";

type TtsStatus = "idle" | "requesting" | "speaking" | "error";

type TtsResponse = {
  audio?: string;
  mimeType?: string;
  message?: string;
};

let activeAudio: HTMLAudioElement | null = null;
let activeObjectUrl: string | null = null;
let activeRequest: AbortController | null = null;

function stopActiveAudio() {
  if (activeAudio) {
    activeAudio.pause();
    activeAudio.currentTime = 0;
  }

  if (activeObjectUrl) {
    URL.revokeObjectURL(activeObjectUrl);
  }

  activeAudio = null;
  activeObjectUrl = null;
}

function base64ToUrl(base64: string, mimeType: string) {
  const binary = window.atob(base64);
  const bytes = new Uint8Array(binary.length);

  for (let index = 0; index < binary.length; index += 1) {
    bytes[index] = binary.charCodeAt(index);
  }

  return URL.createObjectURL(new Blob([bytes], { type: mimeType }));
}

export function useSarvamTts() {
  const language = useAppStore((state) => state.activeLanguage);
  const [status, setStatus] = useState<TtsStatus>("idle");
  const [message, setMessage] = useState("");
  const ownedAudioRef = useRef<HTMLAudioElement | null>(null);

  const stop = useCallback(() => {
    activeRequest?.abort();
    activeRequest = null;
    stopActiveAudio();
    ownedAudioRef.current = null;
    setStatus("idle");
    setMessage("");
  }, []);

  const speak = useCallback(
    async (input: string) => {
      const text = input.trim();
      if (!text) return false;

      if (status === "speaking") {
        stop();
        return false;
      }

      if (status === "requesting") return false;

      if (language === "as-IN") {
        setStatus("error");
        setMessage("Voice playback is not available for Assamese yet.");
        return false;
      }

      activeRequest?.abort();
      stopActiveAudio();

      const controller = new AbortController();
      activeRequest = controller;
      setStatus("requesting");
      setMessage("");

      try {
        const response = await fetch("/api/sarvam/tts", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ text, language }),
          signal: controller.signal,
        });
        const result = (await response.json()) as TtsResponse;

        if (!response.ok || !result.audio) {
          throw new Error(result.message || "Voice playback could not be started.");
        }

        const objectUrl = base64ToUrl(result.audio, result.mimeType || "audio/wav");
        const audio = new Audio(objectUrl);
        activeAudio = audio;
        activeObjectUrl = objectUrl;
        ownedAudioRef.current = audio;

        audio.onended = () => {
          if (activeAudio === audio) stopActiveAudio();
          ownedAudioRef.current = null;
          setStatus("idle");
        };
        audio.onerror = () => {
          if (activeAudio === audio) stopActiveAudio();
          ownedAudioRef.current = null;
          setStatus("error");
          setMessage("Voice playback could not be started. Please try again.");
        };

        await audio.play();
        setStatus("speaking");
        return true;
      } catch (error) {
        if (error instanceof DOMException && error.name === "AbortError") return false;

        setStatus("error");
        setMessage(error instanceof Error ? error.message : "Voice playback could not be started.");
        return false;
      } finally {
        if (activeRequest === controller) activeRequest = null;
      }
    },
    [language, status, stop]
  );

  useEffect(() => {
    return () => {
      if (ownedAudioRef.current === activeAudio) stopActiveAudio();
    };
  }, []);

  return { speak, stop, status, message };
}
