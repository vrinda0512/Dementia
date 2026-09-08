"use client";

import { useReminders } from "@/lib/hooks/use-reminders";
import { Bell, CheckCircle2, Clock } from "lucide-react";

export function TodaysReminders() {
  const { data: reminders, toggleReminder } = useReminders();

  const getEmoji = (type: string) => {
    switch (type) {
      case "medicine":
        return "💊";
      case "hydration":
        return "💧";
      case "activity":
        return "🚶";
      default:
        return "⏰";
    }
  };

  return (
    <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-black text-slate-900 tracking-tight flex items-center gap-2">
          <Bell className="w-5 h-5 text-amber-500" />
          <span>Today's Reminders</span>
        </h2>
        <span className="text-xs font-bold text-amber-700 bg-amber-50 px-2.5 py-1 rounded-full border border-amber-200">
          Scheduled
        </span>
      </div>

      <div className="space-y-3">
        {reminders?.map((rem) => (
          <div
            key={rem.id}
            onClick={() => toggleReminder.mutate(rem.id)}
            className={`flex items-center justify-between p-3.5 rounded-xl border transition-all cursor-pointer ${
              rem.completed
                ? "bg-slate-50 border-slate-200 opacity-70"
                : "bg-white border-amber-100 shadow-xs hover:border-amber-300"
            }`}
          >
            <div className="flex items-center gap-3">
              <div className="text-2xl p-2 bg-amber-50 rounded-xl border border-amber-100">
                {getEmoji(rem.type)}
              </div>
              <div>
                <h3 className={`font-extrabold text-sm ${rem.completed ? "line-through text-slate-500" : "text-slate-900"}`}>
                  {rem.title}
                </h3>
                <p className="text-xs text-slate-500 font-medium">{rem.description}</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <span className="text-xs font-bold text-slate-600 bg-slate-100 px-2.5 py-1 rounded-lg flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-slate-400" />
                {rem.scheduledTime}
              </span>
              <button
                type="button"
                className={`w-6 h-6 rounded-full flex items-center justify-center transition-colors ${
                  rem.completed ? "bg-emerald-500 text-white" : "border-2 border-slate-300 hover:border-emerald-500"
                }`}
              >
                {rem.completed && <CheckCircle2 className="w-4 h-4" />}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
