"use client";

import { useEffect, useMemo, useState } from "react";
import { memoryCategories, loadMemoryQuestions } from "./memoryData";
import { MemoryCategory, MemoryQuestion } from "./types";
import MemoryGame from "./MemoryGame";
import { useActivePatientId } from "@/lib/stores/app-store";
import { VoiceButton } from "@/features/shared/components/voice-button";

export default function MemoryMap() {
  const patientId = useActivePatientId();
  const [questions, setQuestions] = useState<MemoryQuestion[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<MemoryCategory | null>(null);

  const completedCategories = useMemo(() => new Set<MemoryCategory>(), []);

  useEffect(() => {
    let mounted = true;
    (async () => {
      setLoading(true);
      const remote = await loadMemoryQuestions(patientId);
      if (!mounted) return;
      setQuestions(remote);
      setLoading(false);
    })();
    return () => {
      mounted = false;
    };
  }, [patientId]);

  const selectedCategoryInfo = memoryCategories.find(
    (category) => category.id === selectedCategory
  );

  const categoryQuestions = selectedCategory
    ? questions.filter((question) => question.category === selectedCategory)
    : [];

  // Only show hills that have at least one question (or all hills while loading)
  const visibleCategories = loading
    ? memoryCategories
    : memoryCategories.filter(
        (c) => questions.some((q) => q.category === c.id) || questions.length === 0
      );

  if (selectedCategory && selectedCategoryInfo) {
    return (
      <MemoryGame
        category={selectedCategoryInfo}
        questions={categoryQuestions}
        onBack={() => setSelectedCategory(null)}
      />
    );
  }

  return (
    <main className="min-h-screen overflow-hidden bg-[#dff3e5]">
      <header className="relative z-20 px-6 py-5 md:px-10">
        <div className="mx-auto flex max-w-7xl items-center justify-between">
          <div>
            <p className="text-sm font-medium text-emerald-700">GAME 4</p>
            <h1 className="mt-1 text-3xl font-bold text-slate-800 md:text-4xl">Memory Map</h1>
            <p className="mt-1 text-base text-slate-600 md:text-lg">
              Explore the places that hold your memories.
            </p>
            <div className="mt-3">
              <VoiceButton
                textToSpeak="Choose a hill to explore a familiar memory. Take your time and listen carefully."
                size="sm"
              />
            </div>
          </div>

          <div className="hidden rounded-full bg-white/80 px-5 py-3 shadow-sm md:block">
            <span className="text-sm font-medium text-slate-600">
              {loading
                ? "Loading questions…"
                : `${questions.length} personalization question${questions.length === 1 ? "" : "s"}`}
            </span>
          </div>
        </div>
      </header>

      <section className="relative mx-auto h-[calc(100vh-125px)] min-h-[650px] max-w-7xl overflow-hidden px-4 pb-8 md:px-8">
        <div className="absolute inset-0 rounded-[2rem] bg-gradient-to-b from-sky-200 via-sky-100 to-emerald-100 shadow-inner" />

        <div className="absolute left-[8%] top-[7%] text-5xl opacity-70">☁️</div>
        <div className="absolute right-[12%] top-[10%] text-4xl opacity-60">☁️</div>

        <div className="absolute bottom-[18%] left-0 right-0 flex items-end justify-center opacity-40">
          <div className="h-64 w-64 -skew-x-12 rounded-t-[100px] bg-slate-400" />
          <div className="ml-[-50px] h-80 w-80 -skew-x-12 rounded-t-[130px] bg-slate-500" />
          <div className="ml-[-70px] h-56 w-72 -skew-x-12 rounded-t-[110px] bg-slate-400" />
        </div>

        <div className="absolute bottom-0 left-0 right-0 h-[55%] rounded-t-[50%] bg-gradient-to-t from-green-600 via-green-500 to-green-300" />
        <div className="absolute bottom-[12%] left-[18%] h-6 w-[65%] rotate-[-8deg] rounded-full bg-amber-200/80 shadow-sm" />

        <div className="absolute left-1/2 top-[42%] z-10 -translate-x-1/2 -translate-y-1/2 text-center">
          <div className="rounded-3xl bg-white/90 px-7 py-5 shadow-xl backdrop-blur-sm">
            <div className="text-4xl">🧠</div>
            <h2 className="mt-2 text-xl font-bold text-slate-800">Your Memory Journey</h2>
            <p className="mt-1 max-w-xs text-sm text-slate-600">
              {questions.length === 0 && !loading
                ? "Ask your caregiver to add personalization questions."
                : "Choose a hill and explore your memories."}
            </p>
          </div>
        </div>

        {visibleCategories.map((category) => {
          const questionCount = questions.filter((q) => q.category === category.id).length;
          const isCompleted = completedCategories.has(category.id);

          return (
            <button
              key={category.id}
              type="button"
              onClick={() => setSelectedCategory(category.id)}
              disabled={questionCount === 0 && !loading}
              className={`group absolute z-20 ${category.position} flex h-32 w-32 flex-col items-center justify-center rounded-[50%] bg-gradient-to-br ${category.color} p-4 text-center text-white shadow-xl transition-all duration-300 hover:-translate-y-2 hover:scale-105 hover:shadow-2xl active:scale-95 md:h-40 md:w-40 disabled:opacity-40 disabled:hover:translate-y-0 disabled:hover:scale-100`}
            >
              <span className="text-4xl md:text-5xl">{category.emoji}</span>
              <span className="mt-1 text-sm font-bold md:text-base">{category.title}</span>
              <span className="mt-1 text-[11px] opacity-90">
                {questionCount} {questionCount === 1 ? "memory" : "memories"}
              </span>
              {isCompleted && (
                <span className="absolute right-2 top-2 rounded-full bg-white px-2 py-1 text-xs text-green-700">
                  ✓
                </span>
              )}
            </button>
          );
        })}

        <div className="absolute bottom-[16%] left-[4%] text-5xl">🌳</div>
        <div className="absolute bottom-[23%] right-[5%] text-5xl">🌳</div>
        <div className="absolute bottom-[8%] right-[38%] text-4xl">🌲</div>

        <div className="absolute bottom-4 left-1/2 z-30 -translate-x-1/2 rounded-full bg-white/90 px-5 py-3 text-center text-sm font-medium text-slate-700 shadow-lg">
          Tap a hill to begin
        </div>
      </section>
    </main>
  );
}
