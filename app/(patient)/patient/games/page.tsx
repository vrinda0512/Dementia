"use client";

import Link from "next/link";
import { VoiceButton } from "@/features/shared/components/voice-button";
import { useTranslation } from "@/lib/i18n/use-translation";
import { Play } from "lucide-react";

export default function PatientGameSelectionPage() {
  const { t } = useTranslation();

  const games = [
    {
      id: "routine-ordering",
      title: "Routine Recall",
      emoji: "🧠",
      subtitle: "Arrange your morning activities in order",
      href: "/patient/games/routine-ordering",
      bgColor: "bg-amber-500 hover:bg-amber-600",
      cardBg: "bg-amber-50 border-amber-200",
    },
    {
      id: "memory-map",
      title: "Memory Map",
      emoji: "🗺️",
      subtitle: "Navigate familiar places & memories",
      href: "/patient/games/memory-map",
      bgColor: "bg-emerald-500 hover:bg-emerald-600",
      cardBg: "bg-emerald-50 border-emerald-200",
    },
    {
      id: "therapeutic-tea-room-2-AG",
      title: "Quiet Tea Room",
      emoji: "🍵",
      subtitle: "A calming, therapeutic tea experience",
      href: "/patient/games/therapeutic-tea-room-2-AG",
      bgColor: "bg-teal-500 hover:bg-teal-600",
      cardBg: "bg-teal-50 border-teal-200",
    },
    {
      id: "journal-diary",
      title: "My Journal",
      emoji: "📔",
      subtitle: "Express your thoughts & feelings",
      href: "/patient/games/journal-diary",
      bgColor: "bg-violet-500 hover:bg-violet-600",
      cardBg: "bg-violet-50 border-violet-200",
    },
  ];

  return (
    <div className="space-y-8 text-center py-4">
      <div>
        <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
          What would you like to do?
        </h1>
        <p className="text-base text-slate-600 font-semibold mt-1">
          Tap any game to begin.
        </p>
      </div>

      <div className="flex justify-center">
        <VoiceButton textToSpeak="What would you like to do? Tap any activity to play." size="md" />
      </div>

      {/* Game Cards - 2x2 grid on desktop, single column on mobile */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-3xl mx-auto">
        {games.map((g) => (
          <div
            key={g.id}
            className={`rounded-3xl p-6 border ${g.cardBg} shadow-lg flex flex-col justify-between items-center text-center space-y-6 transform hover:scale-[1.02] transition-all`}
          >
            <div className="space-y-3">
              <div className="w-24 h-24 bg-white rounded-3xl flex items-center justify-center text-5xl mx-auto shadow-md border border-slate-100">
                {g.emoji}
              </div>
              <h2 className="text-2xl font-black text-slate-900">{g.title}</h2>
              <p className="text-xs font-semibold text-slate-600 leading-relaxed">
                {g.subtitle}
              </p>
            </div>

            <Link
              href={g.href}
              className={`w-full patient-touch-btn ${g.bgColor} text-white flex items-center justify-center gap-2 shadow-md active:scale-95 transition-all text-lg`}
            >
              <Play className="w-6 h-6 fill-white" />
              <span>{t("play")}</span>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}
