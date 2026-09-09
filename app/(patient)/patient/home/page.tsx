"use client";

import Link from "next/link";
import { VoiceButton } from "@/features/shared/components/voice-button";
import { usePatient } from "@/lib/hooks/use-patient";
import { useReminders } from "@/lib/hooks/use-reminders";
import { useTranslation } from "@/lib/i18n/use-translation";
import { useAppStore } from "@/lib/stores/app-store";
import { PATIENT_LANGUAGES } from "@/lib/voice/languages";
import { getGreeting } from "@/lib/utils";
import { Play, Sparkles, CheckCircle2 } from "lucide-react";

export default function PatientHomePage() {
  const { data: patient } = usePatient();
  const { data: reminders } = useReminders();
  const { t } = useTranslation();
  const activeLanguage = useAppStore((state) => state.activeLanguage);
  const setLanguage = useAppStore((state) => state.setLanguage);
  const greeting = getGreeting();
  const isHindi = activeLanguage === "hi-IN";
  const greetingText = greeting.includes("Afternoon")
    ? t("goodAfternoon")
    : greeting.includes("Evening")
      ? t("goodEvening")
      : t("goodMorning");
  const reminderTitle = (type: string, title: string) => {
    if (type === "medicine") return t("medicine");
    if (type === "hydration") return t("hydration");
    if (type === "walk") return t("walk");
    return title;
  };

  const activeReminders = reminders?.filter((r) => !r.completed) || [];

  return (
    <div className="space-y-8 text-center py-4 animate-in fade-in duration-300">
      {/* Friendly Greeting Header */}
      <div className="space-y-2">
        <div className="inline-flex items-center gap-2 bg-rose-100 text-rose-800 font-black text-sm px-4 py-1.5 rounded-full border border-rose-200 shadow-xs">
          <span>❤️</span>
          <span>{greetingText}, {patient?.name || "Meena"}</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
          "{t("letsDoTodayActivity")}"
        </h1>
        <p className="text-base text-slate-600 font-semibold max-w-md mx-auto">
          {isHindi
            ? "मुस्कान और स्पष्टता के साथ दिन शुरू करने के लिए एक छोटा, आसान अभ्यास।"
            : "A short, fun exercise to start your day with smile & clarity."}
        </p>
      </div>

      <section className="mx-auto max-w-md text-left" aria-label="Language selection">
        <p className="mb-2 text-sm font-extrabold text-slate-700">{isHindi ? "भाषा" : "Language"}</p>
        <div className="grid grid-cols-3 gap-2 rounded-2xl border border-slate-200 bg-white/80 p-2 shadow-sm">
          {PATIENT_LANGUAGES.map((language) => {
            const selected = activeLanguage === language.code;

            return (
              <button
                key={language.code}
                type="button"
                onClick={() => setLanguage(language.code)}
                aria-pressed={selected}
                className={`min-h-14 rounded-xl px-2 text-center text-sm font-extrabold transition focus:outline-none focus:ring-4 focus:ring-amber-200 ${
                  selected
                    ? "bg-amber-500 text-white shadow-sm"
                    : "bg-slate-50 text-slate-700 hover:bg-amber-50"
                }`}
              >
                {language.nativeLabel}
              </button>
            );
          })}
        </div>
      </section>

      {/* Voice Assistant Playback Button */}
      <div>
        <VoiceButton
          textToSpeak={isHindi
            ? `${greetingText}, ${patient?.name || "Meena"}. आइए आज का याददाश्त का खेल खेलें।`
            : `${greeting}, ${patient?.name || "Meena"}. Let's do today's memory game.`}
          size="lg"
        />
      </div>

      {/* Primary Hero Activity Button */}
      <div className="max-w-md mx-auto bg-gradient-to-br from-amber-400 via-orange-400 to-rose-400 p-1 rounded-3xl shadow-xl hover:scale-102 transition-transform">
        <div className="bg-white rounded-[1.4rem] p-6 sm:p-8 space-y-5 text-center">
          <div className="w-20 h-20 bg-amber-100 text-amber-800 rounded-3xl flex items-center justify-center text-4xl mx-auto shadow-inner border border-amber-200">
            🧠
          </div>

          <div>
            <span className="text-xs font-black uppercase tracking-widest text-amber-600 block">
              {isHindi ? "आज का सुझाया गया अभ्यास" : "Suggested Memory Activity"}
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 mt-1">
              {isHindi ? "दिनचर्या याद रखने का खेल" : "Routine Recall Game"}
            </h2>
          </div>

          <Link
            href="/patient/games/routine-ordering"
            className="w-full patient-touch-btn bg-slate-900 hover:bg-slate-800 text-white flex items-center justify-center gap-3 shadow-lg active:scale-95 transition-all text-xl"
          >
            <Play className="w-8 h-8 fill-white" />
            <span>{isHindi ? "खेल शुरू करें" : "START GAME"}</span>
          </Link>
        </div>
      </div>

      {/* Quick Choice to All Activities */}
      <div className="pt-2">
        <Link
          href="/patient/games"
          className="inline-flex items-center gap-2 text-slate-700 hover:text-slate-900 font-black text-base bg-white/90 px-6 py-3 rounded-2xl border border-slate-200 shadow-md transition-all hover:bg-white"
        >
          <Sparkles className="w-5 h-5 text-amber-500" />
          <span>{isHindi ? "सभी दैनिक गतिविधियां देखें →" : "See All Daily Activities →"}</span>
        </Link>
      </div>

      {/* Today's Reminders List */}
      <div className="max-w-md mx-auto bg-white/90 backdrop-blur-md rounded-3xl p-6 border border-slate-200/80 shadow-md space-y-4 text-left">
        <h3 className="text-lg font-black text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-2">
          <span>⏰</span>
          <span>{t("todaysReminders")}</span>
        </h3>

        <div className="space-y-3">
          {reminders?.map((rem) => (
            <div
              key={rem.id}
              className={`p-3.5 rounded-2xl border flex items-center justify-between transition-colors ${
                rem.completed
                  ? "bg-slate-50 border-slate-200 opacity-60"
                  : "bg-amber-50/80 border-amber-200"
              }`}
            >
              <div className="flex items-center gap-3">
                <span className="text-2xl">
                  {rem.type === "medicine" ? "💊" : rem.type === "hydration" ? "💧" : "🚶"}
                </span>
                <div>
                  <h4 className={`font-black text-base ${rem.completed ? "line-through text-slate-500" : "text-slate-900"}`}>
                    {reminderTitle(rem.type, rem.title)}
                  </h4>
                  <span className="text-xs font-bold text-slate-500">{rem.scheduledTime}</span>
                </div>
              </div>

              {rem.completed && (
                <CheckCircle2 className="w-6 h-6 text-emerald-600" />
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
