import { create } from "zustand";
import type { GameSession, GameEvent } from "@/lib/types";

interface GameState {
  currentSession: Partial<GameSession> | null;
  events: GameEvent[];
  difficulty: number;
  score: number;
  hintsUsed: number;
  startTime: number | null;
  
  startSession: (gameId: string, initialDifficulty?: number) => void;
  recordEvent: (event: Omit<GameEvent, "id" | "timestamp" | "sessionId" | "patientId" | "gameId">) => void;
  updateScore: (delta: number) => void;
  useHint: () => void;
  setDifficulty: (diff: number) => void;
  completeSession: (accuracy: number, attempts: number) => GameSession;
  resetSession: () => void;
}

export const useGameStore = create<GameState>((set, get) => ({
  currentSession: null,
  events: [],
  difficulty: 2, // default medium
  score: 0,
  hintsUsed: 0,
  startTime: null,

  startSession: (gameId, initialDifficulty = 2) => {
    const now = Date.now();
    set({
      currentSession: {
        id: `sess-${now}`,
        patientId: "patient-001",
        gameId,
        difficulty: initialDifficulty,
        score: 0,
        accuracy: 0,
        attempts: 0,
        responseTime: 0,
        hintsUsed: 0,
        completed: false,
        abandoned: false,
        startedAt: new Date(now).toISOString(),
      },
      events: [],
      difficulty: initialDifficulty,
      score: 0,
      hintsUsed: 0,
      startTime: now,
    });
  },

  recordEvent: (eventData) => {
    const state = get();
    if (!state.currentSession?.gameId) return;

    const newEvent: GameEvent = {
      id: `evt-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      sessionId: state.currentSession.id || "",
      patientId: "patient-001",
      gameId: state.currentSession.gameId,
      timestamp: new Date().toISOString(),
      ...eventData,
    };

    set({ events: [...state.events, newEvent] });
  },

  updateScore: (delta) => {
    set((state) => ({ score: Math.max(0, state.score + delta) }));
  },

  useHint: () => {
    set((state) => ({ hintsUsed: state.hintsUsed + 1 }));
  },

  setDifficulty: (diff) => {
    set({ difficulty: Math.min(5, Math.max(1, diff)) });
  },

  completeSession: (accuracy, attempts) => {
    const state = get();
    const now = Date.now();
    const elapsed = state.startTime ? now - state.startTime : 10000;

    const completedSession: GameSession = {
      id: state.currentSession?.id || `sess-${now}`,
      patientId: "patient-001",
      gameId: state.currentSession?.gameId || "unknown",
      difficulty: state.difficulty,
      score: state.score,
      accuracy,
      attempts,
      responseTime: elapsed,
      hintsUsed: state.hintsUsed,
      completed: true,
      abandoned: false,
      startedAt: state.currentSession?.startedAt || new Date(now - elapsed).toISOString(),
      completedAt: new Date(now).toISOString(),
    };

    set({ currentSession: completedSession });
    return completedSession;
  },

  resetSession: () => {
    set({
      currentSession: null,
      events: [],
      score: 0,
      hintsUsed: 0,
      startTime: null,
    });
  },
}));
