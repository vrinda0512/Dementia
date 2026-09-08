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
      subtitle: "Arrange your morning activities",
      href: "/patient/games/routine-ordering",
      bgColor: "bg-blue-500 hover:bg-blue-600",
      cardBg: "bg-blue-50 border-blue-200",
    },
    {
      id: "hide-object",
      title: "Hide the Object",
      emoji: "👁️",
      subtitle: "Remember where objects were placed",
      href: "/patient/games/hide-object",
      bgColor: "bg-purple-500 hover:bg-purple-600",
      cardBg: "bg-purple-50 border-purple-200",
    },
    {
      id: "family-memory",
      title: "Family Memory",
      emoji: "❤️",
      subtitle: "Recognize family members & photos",
      href: "/patient/games/family-memory",
      bgColor: "bg-rose-500 hover:bg-rose-600",
      cardBg: "bg-rose-50 border-rose-200",
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

      {/* 3 Giant Game Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
        {games.map((g) => (
          <div
            key={g.id}
            className={`rounded-3xl p-6 border ${g.cardBg} shadow-lg flex flex-col justify-between items-center text-center space-y-6 transform hover:scale-102 transition-all`}
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
