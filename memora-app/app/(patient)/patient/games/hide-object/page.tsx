"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { VoiceButton } from "@/features/shared/components/voice-button";
import { useGameStore } from "@/lib/stores/game-store";
import { useGameSessions } from "@/lib/hooks/use-game-sessions";
import { queueOfflineSession } from "@/lib/offline/sync";
import { CheckCircle2, RotateCcw, Eye, Sparkles } from "lucide-react";

const roomLocations = [
  { id: "cupboard", label: "Cupboard", emoji: "🚪", bg: "bg-amber-100 border-amber-300" },
  { id: "drawer", label: "Drawer", emoji: "🗄️", bg: "bg-blue-100 border-blue-300" },
  { id: "table", label: "Table", emoji: "🍽️", bg: "bg-emerald-100 border-emerald-300" },
  { id: "bed", label: "Bed", emoji: "🛏️", bg: "bg-purple-100 border-purple-300" },
];

export default function HideObjectGamePage() {
  const router = useRouter();
  const { recordSession } = useGameSessions("hide-object");
  const { startSession, completeSession } = useGameStore();

  const [phase, setPhase] = useState<"reveal" | "hidden" | "complete">("reveal");
  const [targetLocation, setTargetLocation] = useState(roomLocations[0]);
  const [selectedGuess, setSelectedGuess] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<"correct" | "incorrect" | null>(null);
  const [attempts, setAttempts] = useState(0);

  useEffect(() => {
    // Pick random location
    const randomLoc = roomLocations[Math.floor(Math.random() * roomLocations.length)];
    setTargetLocation(randomLoc);
    startSession("hide-object", 2);

    // After 3.5 seconds, hide the teddy
    const timer = setTimeout(() => {
      setPhase("hidden");
    }, 3500);

    return () => clearTimeout(timer);
  }, []);

  const handleGuess = (locId: string) => {
    setAttempts((prev) => prev + 1);
    setSelectedGuess(locId);

    if (locId === targetLocation.id) {
      setFeedback("correct");
      setPhase("complete");

      const session = completeSession(100, attempts + 1);
      recordSession.mutate(session);
      queueOfflineSession(session);
    } else {
      setFeedback("incorrect");
    }
  };

  const handleRestart = () => {
    const randomLoc = roomLocations[Math.floor(Math.random() * roomLocations.length)];
    setTargetLocation(randomLoc);
    setSelectedGuess(null);
    setFeedback(null);
    setAttempts(0);
    setPhase("reveal");

    setTimeout(() => {
      setPhase("hidden");
    }, 3500);
  };

  return (
    <div className="space-y-8 text-center max-w-2xl mx-auto py-4">
      {/* Header */}
      <div className="space-y-2">
        <span className="text-xs font-extrabold uppercase tracking-widest text-purple-600 bg-purple-50 px-3 py-1 rounded-full border border-purple-200">
          👁️ Hide the Object Game
        </span>
        <h1 className="text-3xl font-black text-slate-900">
          {phase === "reveal" ? "Look closely! Where is the teddy?" : "Where did we keep the teddy?"}
        </h1>
      </div>

      <div className="flex justify-center">
        <VoiceButton
          textToSpeak={
            phase === "reveal"
              ? "Look closely! Where is the teddy bear?"
              : "Where did we keep the teddy bear? Tap the location."
          }
        />
      </div>

      {/* Room Visualization Box */}
      <div className="bg-white p-6 rounded-3xl border-2 border-purple-200 shadow-xl space-y-6">
        <div className="grid grid-cols-2 gap-4">
          {roomLocations.map((loc) => {
            const isTarget = loc.id === targetLocation.id;
            return (
              <div
                key={loc.id}
                className={`p-5 rounded-2xl border-2 ${loc.bg} flex flex-col items-center justify-center space-y-2 relative transition-all min-h-[120px]`}
              >
                <div className="text-3xl">{loc.emoji}</div>
                <span className="font-extrabold text-sm text-slate-800">{loc.label}</span>

                {/* Show teddy during reveal phase or on correct completion */}
                {((phase === "reveal" && isTarget) || (phase === "complete" && isTarget)) && (
                  <div className="absolute -top-3 -right-2 text-4xl animate-bounce filter drop-shadow-md">
                    🧸
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Question / Choice Buttons */}
      {phase === "hidden" && (
        <div className="space-y-4">
          <h3 className="text-lg font-black text-slate-900">
            Tap the spot where the teddy bear is hidden:
          </h3>

          <div className="grid grid-cols-2 gap-4">
            {roomLocations.map((loc) => (
              <button
                key={loc.id}
                onClick={() => handleGuess(loc.id)}
                className="patient-touch-btn bg-slate-900 hover:bg-slate-800 text-white flex items-center justify-center gap-3 shadow-md"
              >
                <span className="text-2xl">{loc.emoji}</span>
                <span>{loc.label}</span>
              </button>
            ))}
          </div>

          {feedback === "incorrect" && (
            <div className="p-4 bg-amber-50 border border-amber-200 rounded-2xl text-amber-800 font-bold text-sm">
              That's okay! Try another spot. ❤️
            </div>
          )}
        </div>
      )}

      {/* Completion Modal / State */}
      {phase === "complete" && (
        <div className="bg-emerald-50 border-2 border-emerald-300 rounded-3xl p-8 space-y-6 shadow-xl animate-in zoom-in-95">
          <div className="text-6xl animate-bounce">Wonderful! ❤️</div>
          <h2 className="text-3xl font-black text-emerald-900">
            You found the teddy in the {targetLocation.label}!
          </h2>
          <p className="text-emerald-700 font-semibold">
            Great spatial memory practice.
          </p>

          <div className="flex justify-center gap-4">
            <button
              onClick={handleRestart}
              className="py-3 px-6 bg-slate-200 hover:bg-slate-300 text-slate-800 font-extrabold rounded-2xl flex items-center gap-2"
            >
              <RotateCcw className="w-5 h-5" />
              <span>Play Again</span>
            </button>

            <button
              onClick={() => router.push("/patient/home")}
              className="patient-touch-btn bg-emerald-600 hover:bg-emerald-700 text-white px-8 py-3 rounded-2xl"
            >
              <span>Continue →</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
