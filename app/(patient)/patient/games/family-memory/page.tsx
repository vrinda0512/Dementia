"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { VoiceButton } from "@/features/shared/components/voice-button";
import { useFamilyMembers } from "@/lib/hooks/use-patient";
import { useGameStore } from "@/lib/stores/game-store";
import { useGameSessions } from "@/lib/hooks/use-game-sessions";
import { queueOfflineSession } from "@/lib/offline/sync";
import { Heart, RotateCcw, CheckCircle2 } from "lucide-react";

export default function FamilyMemoryGamePage() {
  const router = useRouter();
  const { data: family } = useFamilyMembers();
  const { recordSession } = useGameSessions("family-memory");
  const { startSession, completeSession } = useGameStore();

  const [targetPerson, setTargetPerson] = useState(family?.[1] || { name: "Priya", relationship: "Daughter" });
  const [choices, setChoices] = useState<string[]>([]);
  const [feedback, setFeedback] = useState<"correct" | "incorrect" | null>(null);
  const [attempts, setAttempts] = useState(0);

  useEffect(() => {
    startSession("family-memory", 1);
    const target = family?.[Math.floor(Math.random() * (family.length || 1))] || { name: "Priya", relationship: "Daughter" };
    setTargetPerson(target);

    const options = [target.name, "Meena", "Rajesh", "Aarav"].filter(
      (v, idx, arr) => arr.indexOf(v) === idx
    );
    setChoices(options.sort(() => Math.random() - 0.5).slice(0, 3));
  }, [family]);

  const handleSelectChoice = (name: string) => {
    setAttempts((prev) => prev + 1);

    if (name === targetPerson.name) {
      setFeedback("correct");
      const session = completeSession(100, attempts + 1);
      recordSession.mutate(session);
      queueOfflineSession(session);
    } else {
      setFeedback("incorrect");
    }
  };

  const handleNext = () => {
    setFeedback(null);
    setAttempts(0);
    const target = family?.[Math.floor(Math.random() * (family.length || 1))] || { name: "Priya", relationship: "Daughter" };
    setTargetPerson(target);

    const options = [target.name, "Meena", "Rajesh", "Aarav"].filter(
      (v, idx, arr) => arr.indexOf(v) === idx
    );
    setChoices(options.sort(() => Math.random() - 0.5).slice(0, 3));
  };

  return (
    <div className="space-y-8 text-center max-w-2xl mx-auto py-4">
      {/* Header */}
      <div className="space-y-2">
        <span className="text-xs font-extrabold uppercase tracking-widest text-rose-600 bg-rose-50 px-3 py-1 rounded-full border border-rose-200">
          ❤️ Family Memory Game
        </span>
        <h1 className="text-3xl sm:text-4xl font-black text-slate-900">
          Who is this?
        </h1>
        <p className="text-sm font-semibold text-slate-500">
          Identify your loved one.
        </p>
      </div>

      <div className="flex justify-center">
        <VoiceButton textToSpeak="Who is this? Tap the correct name." />
      </div>

      {/* Family Card Photo */}
      <div className="bg-white p-8 rounded-3xl border-2 border-rose-200 shadow-xl space-y-4 max-w-sm mx-auto">
        <div className="w-32 h-32 bg-gradient-to-tr from-rose-400 to-amber-400 text-white font-black text-5xl rounded-full flex items-center justify-center mx-auto shadow-lg border-4 border-white">
          {targetPerson.name[0]}
        </div>

        <div>
          <h2 className="text-2xl font-black text-slate-900">{targetPerson.name}</h2>
          <span className="text-xs font-bold text-rose-600 bg-rose-50 px-3 py-1 rounded-full border border-rose-200 inline-block mt-1">
            Your {targetPerson.relationship}
          </span>
        </div>
      </div>

      {/* Correct Feedback */}
      {feedback === "correct" ? (
        <div className="bg-emerald-50 border-2 border-emerald-300 rounded-3xl p-8 space-y-6 shadow-xl animate-in zoom-in-95">
          <div className="text-6xl animate-bounce">Wonderful! ❤️</div>
          <h2 className="text-3xl font-black text-emerald-900">
            Yes! That is your {targetPerson.relationship}, {targetPerson.name}!
          </h2>

          <div className="flex justify-center gap-4">
            <button
              onClick={handleNext}
              className="py-3 px-6 bg-slate-200 hover:bg-slate-300 text-slate-800 font-extrabold rounded-2xl flex items-center gap-2"
            >
              <RotateCcw className="w-5 h-5" />
              <span>Next Person</span>
            </button>

            <button
              onClick={() => router.push("/patient/home")}
              className="patient-touch-btn bg-emerald-600 hover:bg-emerald-700 text-white px-8 py-3 rounded-2xl"
            >
              <span>Continue →</span>
            </button>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          <h3 className="text-lg font-black text-slate-900">
            Tap the correct name below:
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {choices.map((name, idx) => (
              <button
                key={idx}
                onClick={() => handleSelectChoice(name)}
                className="patient-touch-btn bg-slate-900 hover:bg-slate-800 text-white flex items-center justify-center shadow-md active:scale-95 transition-all text-xl"
              >
                <span>{name}</span>
              </button>
            ))}
          </div>

          {feedback === "incorrect" && (
            <div className="p-4 bg-amber-50 border border-amber-200 rounded-2xl text-amber-800 font-bold text-sm">
              That's okay! Try another name. ❤️
            </div>
          )}
        </div>
      )}
    </div>
  );
}
