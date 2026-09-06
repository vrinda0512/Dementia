"use client";

import { CheckCircle2, Gamepad2 } from "lucide-react";

export function TodaysActivities() {
  const activities = [
    {
      name: "Routine Recall",
      category: "Routine Memory",
      emoji: "🧠",
      score: 85,
      difficulty: "Medium",
      status: "Completed",
      color: "bg-blue-50 text-blue-700 border-blue-200",
    },
    {
      name: "Hide the Object",
      category: "Spatial Attention",
      emoji: "👁️",
      score: 72,
      difficulty: "Medium",
      status: "Completed",
      color: "bg-purple-50 text-purple-700 border-purple-200",
    },
    {
      name: "Family Memory",
      category: "Personal Recognition",
      emoji: "❤️",
      score: 91,
      difficulty: "Easy",
      status: "Completed",
      color: "bg-rose-50 text-rose-700 border-rose-200",
    },
  ];

  return (
    <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-black text-slate-900 tracking-tight flex items-center gap-2">
          <Gamepad2 className="w-5 h-5 text-sky-600" />
          <span>Today's Activities</span>
        </h2>
        <span className="text-xs font-bold text-slate-500 bg-slate-100 px-2.5 py-1 rounded-full">
          3/3 Complete
        </span>
      </div>

      <div className="space-y-3">
        {activities.map((act, idx) => (
          <div
            key={idx}
            className="flex items-center justify-between p-3.5 rounded-xl border border-slate-100 bg-slate-50/50 hover:bg-slate-50 transition-colors"
          >
            <div className="flex items-center gap-3">
              <div className="text-2xl p-2 bg-white rounded-xl shadow-xs border border-slate-100">
                {act.emoji}
              </div>
              <div>
                <h3 className="font-extrabold text-sm text-slate-900">{act.name}</h3>
                <span className="text-xs font-medium text-slate-500">{act.category} • Diff: {act.difficulty}</span>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="text-right">
                <span className="text-base font-black text-slate-900 block">{act.score}%</span>
                <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-600">
                  <CheckCircle2 className="w-3 h-3" />
                  {act.status}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
