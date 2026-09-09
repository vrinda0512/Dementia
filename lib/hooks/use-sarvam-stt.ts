"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useAppStore } from "@/lib/stores/app-store";

export type SpeechRecordingStatus = "idle" | "recording" | "processing" | "success" | "error";

type SttResponse = {
  transcript?: string;
  message?: string;
};

const MAX_RECORDING_MS = 27_000;
const RECORDING_MIME_TYPES = ["audio/webm;codecs=opus", "audio/webm", "audio/ogg;codecs=opus"];

function selectRecordingMimeType() {
  return RECORDING_MIME_TYPES.find((mimeType) => MediaRecorder.isTypeSupported(mimeType));
}

export function useSarvamStt(onTranscript: (transcript: string) => void) {
  const language = useAppStore((state) => state.activeLanguage);
  const recorderRef = useRef<MediaRecorder | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const timeoutRef = useRef<number | null>(null);
  const uploadControllerRef = useRef<AbortController | null>(null);
  const [status, setStatus] = useState<SpeechRecordingStatus>("idle");
  const [message, setMessage] = useState("");

  const stopStream = useCallback(() => {
    streamRef.current?.getTracks().forEach((track) => track.stop());
    streamRef.current = null;
  }, []);

  const clearTimeoutRef = useCallback(() => {
    if (timeoutRef.current !== null) {
      window.clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
  }, []);

  const uploadRecording = useCallback(
    async (audio: Blob, mimeType: string) => {
      if (audio.size < 500) {
        setStatus("error");
        setMessage("No speech was heard. Please try again.");
        return;
      }

      const controller = new AbortController();
      uploadControllerRef.current = controller;
      const extension = mimeType.includes("ogg") ? "ogg" : "webm";
      const formData = new FormData();
      formData.append("audio", audio, `diary-recording.${extension}`);
      formData.append("language", language);

      try {
        const response = await fetch("/api/sarvam/stt", {
          method: "POST",
          body: formData,
          signal: controller.signal,
        });
        const result = (await response.json()) as SttResponse;
        const transcript = result.transcript?.trim();

        if (!response.ok || !transcript) {
          throw new Error(result.message || "Transcription could not be completed.");
        }

        onTranscript(transcript);
        setStatus("success");
        setMessage("Added to diary");
      } catch (error) {
        if (error instanceof DOMException && error.name === "AbortError") return;

        setStatus("error");
        setMessage(error instanceof Error ? error.message : "Transcription could not be completed.");
      } finally {
        if (uploadControllerRef.current === controller) uploadControllerRef.current = null;
      }
    },
    [language, onTranscript]
  );

  const toggleRecording = useCallback(async () => {
    if (status === "processing") return;

    if (status === "recording") {
      clearTimeoutRef();
      recorderRef.current?.stop();
      return;
    }

    if (!navigator.mediaDevices?.getUserMedia || typeof MediaRecorder === "undefined") {
      setStatus("error");
      setMessage("Voice journaling is not supported in this browser.");
      return;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mimeType = selectRecordingMimeType();
      const recorder = mimeType ? new MediaRecorder(stream, { mimeType }) : new MediaRecorder(stream);

      streamRef.current = stream;
      recorderRef.current = recorder;
      chunksRef.current = [];
      setStatus("recording");
      setMessage("Listening...");

      recorder.ondataavailable = (event) => {
        if (event.data.size > 0) chunksRef.current.push(event.data);
      };
      recorder.onstop = () => {
        clearTimeoutRef();
        stopStream();
        recorderRef.current = null;
        setStatus("processing");
        setMessage("Transcribing...");
        const audio = new Blob(chunksRef.current, { type: recorder.mimeType || mimeType || "audio/webm" });
        chunksRef.current = [];
        void uploadRecording(audio, recorder.mimeType || mimeType || "audio/webm");
      };

      recorder.start(250);
      timeoutRef.current = window.setTimeout(() => {
        if (recorder.state === "recording") recorder.stop();
      }, MAX_RECORDING_MS);
    } catch {
      stopStream();
      setStatus("error");
      setMessage("Microphone access was not granted. You can continue writing instead.");
    }
  }, [clearTimeoutRef, status, stopStream, uploadRecording]);

  useEffect(() => {
    return () => {
      clearTimeoutRef();
      uploadControllerRef.current?.abort();
      const recorder = recorderRef.current;
      if (recorder?.state === "recording") {
        recorder.onstop = null;
        recorder.stop();
      }
      stopStream();
    };
  }, [clearTimeoutRef, stopStream]);

  return { status, message, toggleRecording };
}
