"use client";

import { useRoutines } from "@/lib/hooks/use-routines";
import { VoiceButton } from "@/features/shared/components/voice-button";
import { CheckCircle2, Clock } from "lucide-react";

export default function PatientRoutinePage() {
  const { data: routines } = useRoutines();

  return (
    <div className="space-y-8 text-center max-w-2xl mx-auto py-4">
      <div>
        <h1 className="text-3xl font-black text-slate-900 tracking-tight">
          🌅 My Morning Routine
        </h1>
        <p className="text-base text-slate-600 font-semibold mt-1">
          Your daily morning activities in order.
        </p>
      </div>

      <div className="flex justify-center">
        <VoiceButton textToSpeak="Here is your morning routine. Wake up, brush teeth, prayer, breakfast, and medicine." />
      </div>

      <div className="space-y-4">
        {routines?.map((r, idx) => (
          <div
            key={r.id}
            className="p-5 bg-white rounded-3xl border-2 border-slate-200 shadow-md flex items-center justify-between"
          >
            <div className="flex items-center gap-4">
              <span className="w-9 h-9 bg-amber-500 text-white font-black rounded-full flex items-center justify-center text-base shadow-xs">
                {idx + 1}
              </span>
              <span className="text-3xl">{r.emoji}</span>
              <div className="text-left">
                <h3 className="text-lg font-black text-slate-900">{r.label}</h3>
                <p className="text-xs text-slate-500 font-bold flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-slate-400" />
                  {r.timeOfDay} • {r.location}
                </p>
              </div>
            </div>

            <CheckCircle2 className="w-7 h-7 text-emerald-600" />
          </div>
        ))}
      </div>
    </div>
  );
}
