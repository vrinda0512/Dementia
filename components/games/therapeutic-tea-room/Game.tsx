"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Leaf, RotateCcw, Volume2, VolumeX, X } from "lucide-react";
import { AudioManager } from "./AudioManager";
import GameWorld from "./GameWorld";
import styles from "./TherapeuticTeaRoom.module.css";
import { InteractionResponse, TherapeuticGameContext, TherapeuticSessionEvent } from "./types";
import { VoiceButton } from "@/features/shared/components/voice-button";

type TherapeuticTeaRoomGameProps = {
  context: TherapeuticGameContext;
  onSessionEvent?: (event: TherapeuticSessionEvent) => void;
};

export default function TherapeuticTeaRoomGame({ context, onSessionEvent }: TherapeuticTeaRoomGameProps) {
  const audioRef = useRef<AudioManager | null>(null);
  const activeRef = useRef(false);
  const eventHandlerRef = useRef(onSessionEvent);
  const [sessionActive, setSessionActive] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(context.accessibility.soundEnabled);
  const [hoverLabel, setHoverLabel] = useState<string | null>(null);
  const [message, setMessage] = useState("The room is ready whenever you are.");
  const [webGLUnavailable, setWebGLUnavailable] = useState(false);

  if (!audioRef.current) {
    audioRef.current = new AudioManager(context.accessibility.soundEnabled);
  }

  useEffect(() => {
    eventHandlerRef.current = onSessionEvent;
  }, [onSessionEvent]);

  useEffect(() => {
    audioRef.current?.setEnabled(soundEnabled);
  }, [soundEnabled]);

  useEffect(() => {
    return () => {
      if (activeRef.current) {
        eventHandlerRef.current?.({
          type: "session_ended",
          patientId: context.patientId,
          gameId: "therapeutic-tea-room",
          reason: "unmounted",
          timestamp: new Date().toISOString(),
        });
      }
      audioRef.current?.dispose();
    };
  }, [context.patientId]);

  const beginVisit = useCallback(() => {
    if (sessionActive) return;
    void audioRef.current?.start();
    activeRef.current = true;
    setSessionActive(true);
    setMessage("Take your time. Drag gently to look around, then tap anything that catches your eye.");
    onSessionEvent?.({
      type: "session_started",
      patientId: context.patientId,
      gameId: "therapeutic-tea-room",
      timestamp: new Date().toISOString(),
    });
  }, [context.patientId, onSessionEvent, sessionActive]);

  const endVisit = useCallback(() => {
    if (!sessionActive) return;
    audioRef.current?.toggleRadio(false);
    audioRef.current?.setOutdoorPresence(false);
    activeRef.current = false;
    setSessionActive(false);
    setHoverLabel(null);
    setMessage("The room is ready whenever you would like another quiet visit.");
    onSessionEvent?.({
      type: "session_ended",
      patientId: context.patientId,
      gameId: "therapeutic-tea-room",
      reason: "user_exit",
      timestamp: new Date().toISOString(),
    });
  }, [context.patientId, onSessionEvent, sessionActive]);

  const handleInteraction = useCallback((response: InteractionResponse) => {
    setMessage(response.message);
    onSessionEvent?.({
      type: "object_interacted",
      patientId: context.patientId,
      gameId: "therapeutic-tea-room",
      objectId: response.objectId,
      timestamp: new Date().toISOString(),
    });
  }, [context.patientId, onSessionEvent]);

  const toggleSound = useCallback(() => {
    const nextValue = !soundEnabled;
    setSoundEnabled(nextValue);
    if (nextValue) void audioRef.current?.start();
  }, [soundEnabled]);

  const handleWebGLFailure = useCallback(() => {
    setWebGLUnavailable(true);
  }, []);

  if (webGLUnavailable) {
    return (
      <main className={styles.fallback}>
        <div className={styles.fallbackContent}>
          <Leaf aria-hidden="true" size={28} />
          <h1>Quiet Tea Room</h1>
          <p>This calming room needs WebGL support to open. Please try a current desktop browser with graphics acceleration enabled.</p>
        </div>
      </main>
    );
  }

  return (
    <main className={styles.game}>
      <GameWorld
        audio={audioRef.current}
        sessionActive={sessionActive}
        reducedMotion={context.accessibility.reducedMotion}
        onWebGLFailure={handleWebGLFailure}
        onHoverChange={setHoverLabel}
        onInteraction={handleInteraction}
      />

      <header className={styles.topbar}>
        <div className={styles.brand}>
          <span className={styles.brandMark}><Leaf size={16} /></span>
          <span>Quiet Tea Room</span>
        </div>
        <div className={styles.controls}>
          <VoiceButton
            textToSpeak={sessionActive ? message : "Take your time. Enter the room, look around slowly, and tap anything that catches your eye."}
            iconOnly
            size="sm"
            className={styles.iconButton}
          />
          <button
            className={styles.iconButton}
            type="button"
            onClick={toggleSound}
            aria-label={soundEnabled ? "Turn sound off" : "Turn sound on"}
            title={soundEnabled ? "Turn sound off" : "Turn sound on"}
          >
            {soundEnabled ? <Volume2 size={18} /> : <VolumeX size={18} />}
          </button>
          {sessionActive && (
            <button className={styles.endButton} type="button" onClick={endVisit}>
              <X size={15} /> End visit
            </button>
          )}
        </div>
      </header>

      {!sessionActive && (
        <section className={styles.welcome} aria-label="Start a quiet visit">
          <div className={styles.welcomeCopy}>
            <span className={styles.eyebrow}>A familiar morning room</span>
            <h1>Settle in for a quiet moment.</h1>
            <p>Look around slowly. Familiar objects in the room respond with small, gentle moments.</p>
            <div className="mt-6 flex flex-wrap gap-3">
              <button className={styles.beginButton} type="button" onClick={beginVisit}>
                <Leaf size={18} /> Enter the room
              </button>
              <VoiceButton
                textToSpeak="Take your time. Enter the room, look around slowly, and tap anything that catches your eye."
                size="sm"
              />
            </div>
          </div>
        </section>
      )}

      {sessionActive && (
        <div className={styles.guidance} aria-live="polite">
          {hoverLabel ? <span className={styles.hoverHint}>{hoverLabel}</span> : <span>{message}</span>}
          {!hoverLabel && <VoiceButton textToSpeak={message} size="sm" iconOnly />}
        </div>
      )}

      {!sessionActive && message.includes("another quiet") && (
        <button className={styles.returnButton} type="button" onClick={beginVisit}>
          <RotateCcw size={15} /> Begin another visit
        </button>
      )}
    </main>
  );
}
