"use client";

import { useState } from "react";
import { MemoryCategoryInfo, MemoryQuestion } from "./types";

interface MemoryGameProps {
  category: MemoryCategoryInfo;
  questions: MemoryQuestion[];
  onBack: () => void;
}

export default function MemoryGame({
  category,
  questions,
  onBack,
}: MemoryGameProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);
  const [completed, setCompleted] = useState(false);

  const currentQuestion = questions[currentIndex];

  if (!currentQuestion) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-emerald-50 p-6">
        <div className="text-center">
          <p className="text-lg text-slate-600">
            No memories have been added here yet.
          </p>

          <button
            onClick={onBack}
            className="mt-5 rounded-xl bg-emerald-600 px-6 py-3 font-semibold text-white"
          >
            Back to Memory Map
          </button>
        </div>
      </main>
    );
  }

  const handleAnswer = (answer: string) => {
    if (showResult) return;

    setSelectedAnswer(answer);
    setShowResult(true);

    if (answer === currentQuestion.answer) {
      setScore((previous) => previous + 1);
    }
  };

  const handleNext = () => {
    if (currentIndex === questions.length - 1) {
      setCompleted(true);
      return;
    }

    setCurrentIndex((previous) => previous + 1);
    setSelectedAnswer(null);
    setShowResult(false);
  };

  if (completed) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-gradient-to-b from-emerald-50 to-green-100 p-6">
        <div className="w-full max-w-xl rounded-3xl bg-white p-8 text-center shadow-xl md:p-12">
          <div className="text-6xl">🌿</div>

          <h1 className="mt-5 text-3xl font-bold text-slate-800">
            Memory unlocked!
          </h1>

          <p className="mt-3 text-lg text-slate-600">
            You explored {category.title}.
          </p>

          <div className="mt-8 rounded-2xl bg-emerald-50 p-6">
            <p className="text-sm font-medium text-emerald-700">
              Memories remembered
            </p>

            <p className="mt-1 text-4xl font-bold text-emerald-800">
              {score} / {questions.length}
            </p>
          </div>

          <button
            onClick={onBack}
            className="mt-8 w-full rounded-2xl bg-emerald-600 px-6 py-4 text-lg font-bold text-white transition hover:bg-emerald-700"
          >
            Return to Memory Map
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-emerald-50 to-green-100 p-5 md:p-10">
      <div className="mx-auto max-w-3xl">
        {/* Top bar */}
        <div className="flex items-center justify-between">
          <button
            onClick={onBack}
            className="rounded-xl bg-white px-4 py-3 font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50"
          >
            ← Map
          </button>

          <div className="text-right">
            <div className="text-2xl">{category.emoji}</div>

            <p className="text-sm font-semibold text-slate-700">
              {category.title}
            </p>
          </div>
        </div>

        {/* Progress */}
        <div className="mt-8">
          <div className="flex items-center justify-between text-sm font-medium text-slate-600">
            <span>
              Memory {currentIndex + 1} of {questions.length}
            </span>

            <span>{score} remembered</span>
          </div>

          <div className="mt-2 h-3 overflow-hidden rounded-full bg-white">
            <div
              className="h-full rounded-full bg-emerald-600 transition-all duration-500"
              style={{
                width: `${((currentIndex + 1) / questions.length) * 100}%`,
              }}
            />
          </div>
        </div>

        {/* Question Card */}
        <div className="mt-8 rounded-[2rem] bg-white p-7 shadow-xl md:p-10">
          <div className="text-center">
            <div className="text-5xl">{category.emoji}</div>

            <p className="mt-5 text-2xl font-bold leading-relaxed text-slate-800 md:text-3xl">
              {currentQuestion.question}
            </p>
          </div>

          {/* Multiple Choice */}
          {currentQuestion.format === "multiple-choice" &&
            currentQuestion.options && (
              <div className="mt-10 grid gap-4">
                {currentQuestion.options.map((option) => {
                  const isSelected = selectedAnswer === option;
                  const isCorrect =
                    showResult && option === currentQuestion.answer;
                  const isWrong =
                    showResult && isSelected && option !== currentQuestion.answer;

                  let buttonStyle =
                    "border-slate-200 bg-white text-slate-800 hover:border-emerald-400 hover:bg-emerald-50";

                  if (isCorrect) {
                    buttonStyle =
                      "border-emerald-500 bg-emerald-50 text-emerald-800";
                  }

                  if (isWrong) {
                    buttonStyle =
                      "border-red-300 bg-red-50 text-red-700";
                  }

                  return (
                    <button
                      key={option}
                      onClick={() => handleAnswer(option)}
                      disabled={showResult}
                      className={`min-h-[64px] rounded-2xl border-2 px-5 py-4 text-left text-lg font-semibold transition ${buttonStyle}`}
                    >
                      <span className="flex items-center justify-between">
                        <span>{option}</span>

                        {isCorrect && <span>✓</span>}
                        {isWrong && <span>×</span>}
                      </span>
                    </button>
                  );
                })}
              </div>
            )}

          {/* Result */}
          {showResult && (
            <div
              className={`mt-7 rounded-2xl p-5 ${
                selectedAnswer === currentQuestion.answer
                  ? "bg-emerald-50"
                  : "bg-amber-50"
              }`}
            >
              <p className="text-lg font-bold text-slate-800">
                {selectedAnswer === currentQuestion.answer
                  ? "Wonderful! You remembered it. ❤️"
                  : "That's okay. Let's remember it together."}
              </p>

              {selectedAnswer !== currentQuestion.answer && (
                <p className="mt-2 text-slate-600">
                  The answer was{" "}
                  <strong>{currentQuestion.answer}</strong>.
                </p>
              )}
            </div>
          )}

          {/* Next */}
          {showResult && (
            <button
              onClick={handleNext}
              className="mt-7 w-full rounded-2xl bg-emerald-600 px-6 py-4 text-lg font-bold text-white transition hover:bg-emerald-700"
            >
              {currentIndex === questions.length - 1
                ? "Finish Memory Hill"
                : "Next Memory →"}
            </button>
          )}
        </div>
      </div>
    </main>
  );
}