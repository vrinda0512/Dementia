"use client";

import { RoutineStep } from "./types";

type GameFeedbackProps = {
  selectedSteps: RoutineStep[];
  correctSteps: RoutineStep[];
  score: number;
  onContinue: () => void;
};

export default function GameFeedback({
  selectedSteps,
  correctSteps,
  score,
  onContinue,
}: GameFeedbackProps) {
  const perfect =
    selectedSteps.length === correctSteps.length &&
    selectedSteps.every(
      (step, index) => step.id === correctSteps[index].id
    );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 p-4 backdrop-blur-sm">
      <div className="w-full max-w-2xl animate-[pop-in_0.3s_ease-out] rounded-[2rem] bg-white p-7 shadow-2xl sm:p-10">
        <div className="text-center">
          <div className="text-6xl">
            {perfect ? "🎉" : "💚"}
          </div>

          <h2 className="mt-4 text-3xl font-extrabold text-slate-900">
            {perfect
              ? "Wonderful! You remembered it!"
              : "Let's try that together"}
          </h2>

          <p className="mt-3 text-lg leading-relaxed text-slate-600">
            {perfect
              ? "Your morning journey was in the right order."
              : "That's okay. Memory takes practice. There's no hurry."}
          </p>
        </div>

        <div className="mt-8 rounded-3xl bg-slate-50 p-5">
          <div className="mb-4 text-center text-sm font-bold uppercase tracking-widest text-slate-400">
            Your Journey
          </div>

          <div className="flex flex-wrap items-center justify-center gap-2">
            {correctSteps.map((step, index) => {
              const correct =
                selectedSteps[index]?.id === step.id;

              return (
                <div key={step.id} className="flex items-center gap-2">
                  <div
                    className={`flex min-w-[100px] flex-col items-center rounded-2xl p-3 ${
                      correct
                        ? "bg-emerald-100"
                        : "bg-amber-100"
                    }`}
                  >
                    <span className="text-3xl">{step.emoji}</span>

                    <span className="mt-1 text-center text-sm font-bold text-slate-700">
                      {step.label}
                    </span>

                    <span className="mt-1">
                      {correct ? "✓" : "→"}
                    </span>
                  </div>

                  {index < correctSteps.length - 1 && (
                    <span className="text-xl text-slate-300">
                      →
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        <div className="mt-6 flex items-center justify-center">
          <div className="rounded-3xl bg-amber-50 px-8 py-4 text-center">
            <div className="text-sm font-bold uppercase tracking-widest text-amber-600">
              Your Score
            </div>

            <div className="mt-1 text-4xl font-extrabold text-slate-900">
              ⭐ {score}
            </div>
          </div>
        </div>

        <button
          type="button"
          onClick={onContinue}
          className="mt-8 w-full rounded-2xl bg-slate-900 px-8 py-5 text-xl font-extrabold text-white shadow-lg transition hover:-translate-y-1 hover:shadow-xl"
        >
          {perfect ? "Continue →" : "Try Again →"}
        </button>
      </div>
    </div>
  );
}