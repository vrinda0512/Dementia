"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { VoiceButton } from "@/features/shared/components/voice-button";
import { useRoutines } from "@/lib/hooks/use-routines";
import { useGameStore } from "@/lib/stores/game-store";
import { useGameSessions } from "@/lib/hooks/use-game-sessions";
import { queueOfflineSession } from "@/lib/offline/sync";
import { CheckCircle2, RotateCcw, Award, ArrowRight } from "lucide-react";
import type { Routine } from "@/lib/types";

export default function PatientRoutineOrderingPage() {
  const router = useRouter();
  const { data: routines } = useRoutines();
  const { recordSession } = useGameSessions("routine-ordering");
  const { startSession, recordEvent, completeSession } = useGameStore();

  const [selectedSteps, setSelectedSteps] = useState<Routine[]>([]);
  const [availableSteps, setAvailableSteps] = useState<Routine[]>(() =>
    routines ? [...routines].sort(() => Math.random() - 0.5) : []
  );
  const [feedback, setFeedback] = useState<"correct" | "incorrect" | null>(null);
  const [attempts, setAttempts] = useState(0);

  const handleSelectStep = (step: Routine) => {
    setSelectedSteps((prev) => [...prev, step]);
    setAvailableSteps((prev) => prev.filter((s) => s.id !== step.id));
    recordEvent({
      eventType: "step_selected",
      challengeId: "routine-seq",
      value: step.label,
      responseTime: 1200,
      attemptNumber: attempts + 1,
    });
  };

  const handleReset = () => {
    setSelectedSteps([]);
    setAvailableSteps(routines ? [...routines].sort(() => Math.random() - 0.5) : []);
    setFeedback(null);
  };

  const handleCheck = () => {
    setAttempts((prev) => prev + 1);
    const isCorrect = selectedSteps.every((step, idx) => step.order === idx + 1);

    if (isCorrect && selectedSteps.length === (routines?.length || 0)) {
      setFeedback("correct");
      const session = completeSession(100, attempts + 1);
      recordSession.mutate(session);
      queueOfflineSession(session);
    } else {
      setFeedback("incorrect");
    }
  };

  return (
    <div className="space-y-8 text-center max-w-2xl mx-auto py-4">
      {/* Header */}
      <div className="space-y-2">
        <span className="text-xs font-extrabold uppercase tracking-widest text-blue-600 bg-blue-50 px-3 py-1 rounded-full border border-blue-200">
          🧠 Routine Recall Game
        </span>
        <h1 className="text-3xl font-black text-slate-900">
          What do you usually do first in the morning?
        </h1>
        <p className="text-sm font-semibold text-slate-500">
          Tap the activities in the order they happen.
        </p>
      </div>

      <div className="flex justify-center">
        <VoiceButton textToSpeak="What do you usually do first in the morning? Tap the activities in order." />
      </div>

      {/* Complete State Feedback */}
      {feedback === "correct" ? (
        <div className="bg-emerald-50 border-2 border-emerald-300 rounded-3xl p-8 space-y-6 shadow-xl animate-in zoom-in-95">
          <div className="text-6xl animate-bounce">Wonderful! ❤️</div>
          <h2 className="text-3xl font-black text-emerald-900">You got it right!</h2>
          <p className="text-emerald-700 font-semibold">
            Every remembered step keeps your morning clear and bright.
          </p>

          <div className="flex justify-center gap-4">
            <button
              onClick={() => router.push("/patient/home")}
              className="patient-touch-btn bg-emerald-600 hover:bg-emerald-700 text-white px-8 py-3 rounded-2xl flex items-center gap-2"
            >
              <span>Continue →</span>
            </button>
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Selected Order Slots */}
          <div className="bg-white/90 p-6 rounded-3xl border border-slate-200 shadow-md space-y-3">
            <h3 className="text-xs font-extrabold text-slate-400 uppercase tracking-wider text-left">
              Your Morning Order:
            </h3>

            {selectedSteps.length === 0 ? (
              <div className="py-6 border-2 border-dashed border-slate-200 rounded-2xl text-slate-400 font-bold text-sm">
                Tap activities below to arrange your morning
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {selectedSteps.map((s, idx) => (
                  <div
                    key={s.id}
                    className="p-3 bg-blue-50 border border-blue-200 rounded-2xl flex items-center gap-3 font-bold text-slate-900 shadow-xs"
                  >
                    <span className="w-7 h-7 bg-blue-600 text-white font-black rounded-full text-xs flex items-center justify-center">
                      {idx + 1}
                    </span>
                    <span className="text-xl">{s.emoji}</span>
                    <span className="text-sm font-extrabold">{s.label}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Available Choice Cards */}
          {availableSteps.length > 0 && (
            <div className="space-y-3">
              <h3 className="text-xs font-extrabold text-slate-400 uppercase tracking-wider text-left">
                Available Morning Activities:
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {availableSteps.map((s) => (
                  <button
                    key={s.id}
                    onClick={() => handleSelectStep(s)}
                    className="p-4 bg-white border-2 border-slate-200 hover:border-blue-400 rounded-2xl text-center space-y-1 shadow-sm active:scale-95 transition-all"
                  >
                    <div className="text-3xl">{s.emoji}</div>
                    <span className="font-extrabold text-sm text-slate-900 block">{s.label}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Incorrect Feedback Toast */}
          {feedback === "incorrect" && (
            <div className="p-4 bg-amber-50 border border-amber-200 rounded-2xl text-amber-800 font-bold text-sm">
              That's okay. Let me help you try again! ❤️
            </div>
          )}

          {/* Controls */}
          <div className="flex gap-4 pt-2">
            <button
              onClick={handleReset}
              className="flex-1 py-3 bg-slate-200 hover:bg-slate-300 text-slate-700 font-extrabold rounded-2xl flex items-center justify-center gap-2"
            >
              <RotateCcw className="w-5 h-5" />
              <span>Start Over</span>
            </button>

            {selectedSteps.length === (routines?.length || 0) && (
              <button
                onClick={handleCheck}
                className="flex-1 patient-touch-btn bg-emerald-600 hover:bg-emerald-700 text-white flex items-center justify-center gap-2 shadow-lg"
              >
                <CheckCircle2 className="w-6 h-6" />
                <span>Submit Order</span>
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
