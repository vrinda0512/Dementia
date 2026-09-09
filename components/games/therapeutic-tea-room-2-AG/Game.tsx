"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Bookmark, ChevronLeft, ChevronRight, Glasses, KeyRound, Leaf, Mail, Music2, Search, Smartphone, Volume2, VolumeX, X } from "lucide-react";
import { AudioManager } from "./AudioManager";
import { VoiceButton } from "@/features/shared/components/voice-button";
import { createMemoryRound, HIDING_PLACES, MEMORY_ITEMS } from "./content/memoryRound";
import GameWorld from "./GameWorld";
import styles from "./TherapeuticTeaRoom.module.css";
import {
  HidingPlaceId,
  MemoryGamePhase,
  MemoryItemId,
  MemoryPlacement,
  MemoryWorldCommand,
  RecallResult,
  TherapeuticGameContext,
  TherapeuticSessionEvent,
} from "./types";

type TherapeuticTeaRoomGameProps = {
  context: TherapeuticGameContext;
  onSessionEvent?: (event: TherapeuticSessionEvent) => void;
};

type VisitMode = "find" | "relax" | null;

function settledVerb(itemId: MemoryItemId) {
  return itemId === "glasses" ? "have" : "has";
}

const ITEM_ICONS = {
  key: KeyRound,
  phone: Smartphone,
  letter: Mail,
  glasses: Glasses,
  bookmark: Bookmark,
} as const;

function MemoryPrompt({ itemId, title, detail }: { itemId: MemoryItemId; title: string; detail: string }) {
  const Icon = ITEM_ICONS[itemId];
  return (
    <aside className={styles.memoryPrompt} aria-live="polite">
      <Icon className={styles.promptSilhouette} aria-hidden="true" strokeWidth={1.15} />
      <div className={styles.promptContent}>
        <span className={styles.eyebrow}>A familiar object</span>
        <h2>{title}</h2>
        <p>{detail}</p>
        <div className="mt-4"><VoiceButton textToSpeak={`${title}. ${detail}`} size="sm" /></div>
      </div>
    </aside>
  );
}

export default function TherapeuticTeaRoomGame({ context, onSessionEvent }: TherapeuticTeaRoomGameProps) {
  const audioRef = useRef<AudioManager | null>(null);
  const activeRef = useRef(false);
  const eventHandlerRef = useRef(onSessionEvent);
  const [sessionActive, setSessionActive] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(context.accessibility.soundEnabled);
  const [hoverLabel, setHoverLabel] = useState<string | null>(null);
  const [message, setMessage] = useState("The room is ready whenever you are.");
  const [webGLUnavailable, setWebGLUnavailable] = useState(false);
  const [phase, setPhase] = useState<MemoryGamePhase>("welcome");
  const [mode, setMode] = useState<VisitMode>(null);
  const [round, setRound] = useState<MemoryPlacement[]>(() => createMemoryRound());
  const [observationIndex, setObservationIndex] = useState(0);
  const [recallIndex, setRecallIndex] = useState(0);
  const [recallStartedAt, setRecallStartedAt] = useState(0);
  const [feedback, setFeedback] = useState<RecallResult | null>(null);
  const [worldCommand, setWorldCommand] = useState<MemoryWorldCommand>({ id: 0, type: "reset" });

  if (!audioRef.current) {
    audioRef.current = new AudioManager(context.accessibility.soundEnabled);
  }

  const sendWorldCommand = useCallback((command: Omit<MemoryWorldCommand, "id">) => {
    setWorldCommand((previous) => ({ ...command, id: previous.id + 1 }));
  }, []);

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
          gameId: "therapeutic-tea-room-2-AG",
          reason: "unmounted",
          timestamp: new Date().toISOString(),
        });
      }
      audioRef.current?.dispose();
    };
  }, [context.patientId]);

  const beginObservation = useCallback((index: number, activeRound: MemoryPlacement[]) => {
    const placement = activeRound[index];
    const item = MEMORY_ITEMS[placement.itemId];
    setObservationIndex(index);
    setPhase("observing");
    setFeedback(null);
    setHoverLabel(null);
    setMessage(`Watch the ${item.label.toLowerCase()} find a quiet place in the room.`);
    sendWorldCommand({ type: "observe", itemId: placement.itemId, hidingPlaceId: placement.hidingPlaceId });
    audioRef.current?.playMemoryCue();
  }, [sendWorldCommand]);

  const startSession = useCallback(() => {
    void audioRef.current?.start();
    activeRef.current = true;
    setSessionActive(true);
    onSessionEvent?.({
      type: "session_started",
      patientId: context.patientId,
      gameId: "therapeutic-tea-room-2-AG",
      timestamp: new Date().toISOString(),
    });
  }, [context.patientId, onSessionEvent]);

  const beginFindMode = useCallback(() => {
    if (sessionActive) return;
    let nextRound = createMemoryRound();
    for (let attempt = 0; attempt < 4 && nextRound.every((placement, index) => placement.itemId === round[index]?.itemId && placement.hidingPlaceId === round[index]?.hidingPlaceId); attempt += 1) {
      nextRound = createMemoryRound();
    }
    setMode("find");
    setRound(nextRound);
    startSession();
    onSessionEvent?.({
      type: "round_started",
      patientId: context.patientId,
      gameId: "therapeutic-tea-room-2-AG",
      timestamp: new Date().toISOString(),
    });
    beginObservation(0, nextRound);
  }, [beginObservation, context.patientId, onSessionEvent, round, sessionActive, startSession]);

  const beginRelaxingAsmr = useCallback(() => {
    if (sessionActive) return;
    setMode("relax");
    startSession();
    audioRef.current?.setOutdoorPresence(true);
    setPhase("explore");
    setMessage("A gentle soundscape is ready. Touch anything that catches your eye.");
  }, [sessionActive, startSession]);

  const endVisit = useCallback(() => {
    if (!sessionActive) return;
    audioRef.current?.toggleRadio(false);
    audioRef.current?.setOutdoorPresence(false);
    activeRef.current = false;
    setSessionActive(false);
    setMode(null);
    setPhase("welcome");
    setHoverLabel(null);
    setFeedback(null);
    setMessage("The room is ready whenever you would like another quiet visit.");
    sendWorldCommand({ type: "reset" });
    onSessionEvent?.({
      type: "session_ended",
      patientId: context.patientId,
      gameId: "therapeutic-tea-room-2-AG",
      reason: "user_exit",
      timestamp: new Date().toISOString(),
    });
  }, [context.patientId, onSessionEvent, sendWorldCommand, sessionActive]);

  const handleObservationComplete = useCallback(() => {
    const placement = round[observationIndex];
    const item = MEMORY_ITEMS[placement.itemId];
    setPhase("observation-ready");
    setMessage(`The ${item.label.toLowerCase()} ${settledVerb(item.id)} found a quiet place.`);
    audioRef.current?.playMemoryArrival();
    onSessionEvent?.({
      type: "item_observed",
      patientId: context.patientId,
      gameId: "therapeutic-tea-room-2-AG",
      itemId: placement.itemId,
      hidingPlaceId: placement.hidingPlaceId,
      timestamp: new Date().toISOString(),
    });
  }, [context.patientId, observationIndex, onSessionEvent, round]);

  const continueObservation = useCallback(() => {
    const nextIndex = observationIndex + 1;
    if (nextIndex < round.length) {
      beginObservation(nextIndex, round);
      return;
    }
    setPhase("recalling");
    setRecallIndex(0);
    setRecallStartedAt(performance.now());
    setMessage("Take your time. Choose the place that feels right.");
    sendWorldCommand({ type: "reset" });
  }, [beginObservation, observationIndex, round, sendWorldCommand]);

  const handleMemoryLocationSelect = useCallback((selectedPlaceId: HidingPlaceId) => {
    if (phase !== "recalling") return;
    const placement = round[recallIndex];
    const result: RecallResult = {
      itemId: placement.itemId,
      selectedPlaceId,
      expectedPlaceId: placement.hidingPlaceId,
      correct: selectedPlaceId === placement.hidingPlaceId,
      responseTimeMs: Math.max(0, Math.round(performance.now() - recallStartedAt)),
    };
    setFeedback(result);
    setPhase("feedback");
    setMessage(
      result.correct
        ? `Yes. The ${MEMORY_ITEMS[result.itemId].label.toLowerCase()} rested there.`
        : `Let's look together. The ${MEMORY_ITEMS[result.itemId].label.toLowerCase()} had a quiet place in the room.`
    );
    sendWorldCommand({
      type: "reveal",
      itemId: placement.itemId,
      hidingPlaceId: placement.hidingPlaceId,
      selectedPlaceId,
    });
    audioRef.current?.playMemoryReveal(result.correct);
    onSessionEvent?.({
      type: "recall_response",
      patientId: context.patientId,
      gameId: "therapeutic-tea-room-2-AG",
      result,
      timestamp: new Date().toISOString(),
    });
  }, [context.patientId, onSessionEvent, phase, recallIndex, recallStartedAt, round, sendWorldCommand]);

  const continueRecall = useCallback(() => {
    const nextIndex = recallIndex + 1;
    if (nextIndex < round.length) {
      setRecallIndex(nextIndex);
      setRecallStartedAt(performance.now());
      setFeedback(null);
      setPhase("recalling");
      setMessage("Take your time. Choose the place that feels right.");
      sendWorldCommand({ type: "reset" });
      return;
    }
    setPhase("complete");
    setFeedback(null);
    setMessage("You took time to notice each familiar object.");
    onSessionEvent?.({
      type: "round_completed",
      patientId: context.patientId,
      gameId: "therapeutic-tea-room-2-AG",
      itemCount: round.length,
      timestamp: new Date().toISOString(),
    });
  }, [context.patientId, onSessionEvent, recallIndex, round.length, sendWorldCommand]);

  const beginExploring = useCallback(() => {
    setPhase("explore");
    setMessage("The room is yours to explore. Touch anything that catches your eye.");
    sendWorldCommand({ type: "reset" });
  }, [sendWorldCommand]);

  const toggleSound = useCallback(() => {
    const nextValue = !soundEnabled;
    setSoundEnabled(nextValue);
    if (nextValue) void audioRef.current?.start();
  }, [soundEnabled]);

  const handleWebGLFailure = useCallback(() => setWebGLUnavailable(true), []);
  const handleFreeInteraction = useCallback((response: { message: string }) => {
    setMessage(response.message);
  }, []);
  const observationItem = round[observationIndex] ? MEMORY_ITEMS[round[observationIndex].itemId] : null;
  const recallItem = round[recallIndex] ? MEMORY_ITEMS[round[recallIndex].itemId] : null;
  const revealedPlace = feedback ? HIDING_PLACES[feedback.expectedPlaceId] : null;

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
    <main className={styles.game} data-visit-mode={mode ?? "home"}>
      <GameWorld
        audio={audioRef.current}
        sessionActive={sessionActive}
        reducedMotion={context.accessibility.reducedMotion}
        memoryPhase={phase}
        memoryCommand={worldCommand}
        onWebGLFailure={handleWebGLFailure}
        onHoverChange={setHoverLabel}
        onInteraction={handleFreeInteraction}
        onObservationComplete={handleObservationComplete}
        onMemoryLocationSelect={handleMemoryLocationSelect}
      />

      <header className={styles.topbar}>
        <div className={styles.brand}>
          <span className={styles.brandMark}><Leaf size={16} /></span>
          <span>Quiet Tea Room</span>
        </div>
        <div className={styles.controls}>
          <VoiceButton
            textToSpeak={message}
            iconOnly
            size="sm"
            className={styles.iconButton}
          />
          <button className={styles.iconButton} type="button" onClick={toggleSound} aria-label={soundEnabled ? "Turn sound off" : "Turn sound on"} title={soundEnabled ? "Turn sound off" : "Turn sound on"}>
            {soundEnabled ? <Volume2 size={18} /> : <VolumeX size={18} />}
          </button>
          {sessionActive && <button className={styles.endButton} type="button" onClick={endVisit}><X size={15} /> End visit</button>}
        </div>
      </header>

      {phase === "welcome" && (
        <section className={styles.welcome} aria-label="Choose a quiet visit">
          <div className={styles.welcomeCopy}>
            <span className={styles.eyebrow}>A familiar morning room</span>
            <h1>Choose a quiet visit.</h1>
            <p>There is no rush. Begin with a familiar memory activity or simply settle into the room's gentle sounds.</p>
            <div className="mt-4"><VoiceButton textToSpeak="There is no rush. Choose a familiar memory activity, or settle into the room's gentle sounds." size="sm" /></div>
            <div className={styles.modeOptions}>
              <button className={styles.beginButton} type="button" onClick={beginFindMode}><Search size={18} /> Find the objects</button>
              <button className={styles.asmrButton} type="button" onClick={beginRelaxingAsmr}><Music2 size={18} /> Relaxing ASMR</button>
            </div>
          </div>
        </section>
      )}

      {phase === "observing" && observationItem && <MemoryPrompt itemId={observationItem.id} title={observationItem.label} detail="Watch it move slowly and find a quiet place." />}

      {phase === "observation-ready" && observationItem && (
        <aside className={styles.smallPrompt} aria-live="polite">
          <span className={styles.eyebrow}>A quiet place</span>
          <h2>The {observationItem.label.toLowerCase()} {settledVerb(observationItem.id)} settled.</h2>
          <div className="mt-4"><VoiceButton textToSpeak={message} size="sm" /></div>
          <button className={styles.nextButton} type="button" onClick={continueObservation}>{observationIndex + 1 === round.length ? "Bring the places to mind" : "Show the next object"}</button>
        </aside>
      )}

      {phase === "recalling" && recallItem && <MemoryPrompt itemId={recallItem.id} title={recallItem.prompt} detail="Tap the place where you remember it resting." />}

      {phase === "feedback" && feedback && revealedPlace && (
        <aside className={styles.smallPrompt} aria-live="polite">
          <span className={styles.eyebrow}>{feedback.correct ? "A clear memory" : "Let’s look together"}</span>
          <h2>{feedback.correct ? "That feels right." : "There it is."}</h2>
          <p>The {MEMORY_ITEMS[feedback.itemId].label.toLowerCase()} rested by the {revealedPlace.label.toLowerCase()}.</p>
          <div className="mt-4"><VoiceButton textToSpeak={message} size="sm" /></div>
          <button className={styles.nextButton} type="button" onClick={continueRecall}>{recallIndex + 1 === round.length ? "Finish this visit" : "Remember the next one"}</button>
        </aside>
      )}

      {phase === "complete" && (
        <aside className={styles.smallPrompt} aria-live="polite">
          <span className={styles.eyebrow}>A quiet visit</span>
          <h2>You took time to notice.</h2>
          <p>The room is still here for a gentle look around.</p>
          <div className="mt-4"><VoiceButton textToSpeak={message} size="sm" /></div>
          <button className={styles.nextButton} type="button" onClick={beginExploring}>Explore the room</button>
        </aside>
      )}

      {sessionActive && phase === "explore" && <div className={styles.guidance} aria-live="polite">{hoverLabel ? <span className={styles.hoverHint}>{hoverLabel}</span> : <span>{message}</span>} {!hoverLabel && <VoiceButton textToSpeak={message} iconOnly size="sm" />}</div>}

      {sessionActive && (
        <nav className={styles.cameraControls} aria-label="Camera navigation">
          <button
            className={styles.cameraPanButton}
            type="button"
            onClick={() => sendWorldCommand({ type: "pan_left" })}
            aria-label="Pan camera left"
            title="Pan camera left"
          >
            <ChevronLeft size={18} />
          </button>
          <span className={styles.cameraHint}>Look Around</span>
          <button
            className={styles.cameraPanButton}
            type="button"
            onClick={() => sendWorldCommand({ type: "pan_right" })}
            aria-label="Pan camera right"
            title="Pan camera right"
          >
            <ChevronRight size={18} />
          </button>
        </nav>
      )}

    </main>
  );
}
