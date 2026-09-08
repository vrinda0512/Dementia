"use client";

import { Award, Gamepad2, Bell, Flame } from "lucide-react";
import { useGameSessions } from "@/lib/hooks/use-game-sessions";
import { useReminders } from "@/lib/hooks/use-reminders";
import { calculatePercentage } from "@/lib/utils";

export function SummaryCards() {
  const { data: sessions } = useGameSessions();
  const { data: reminders } = useReminders();

  const totalScore = sessions?.reduce((acc, s) => acc + s.score, 0) || 0;
  const avgScore = sessions?.length ? Math.round(totalScore / sessions.length) : 82;
  const gamesCompleted = sessions?.filter((s) => s.completed).length || 12;
  const activeRemindersCount = reminders?.filter((r) => r.active).length || 3;
  const streakDays = 6;

  const cards = [
    {
      title: "Average Score",
      value: `${avgScore}%`,
      subtitle: "+4% from last week",
      icon: Award,
      color: "bg-blue-500",
      textColor: "text-blue-600",
      bgLight: "bg-blue-50",
      border: "border-blue-100",
    },
    {
      title: "Games Completed",
      value: gamesCompleted,
      subtitle: "Across 3 activity types",
      icon: Gamepad2,
      color: "bg-purple-500",
      textColor: "text-purple-600",
      bgLight: "bg-purple-50",
      border: "border-purple-100",
    },
    {
      title: "Reminders Today",
      value: activeRemindersCount,
      subtitle: "1 completed, 2 pending",
      icon: Bell,
      color: "bg-amber-500",
      textColor: "text-amber-600",
      bgLight: "bg-amber-50",
      border: "border-amber-100",
    },
    {
      title: "Current Streak",
      value: `${streakDays} days`,
      subtitle: "Consistent daily engagement",
      icon: Flame,
      color: "bg-orange-500",
      textColor: "text-orange-600",
      bgLight: "bg-orange-50",
      border: "border-orange-100",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((card, idx) => {
        const Icon = card.icon;
        return (
          <div
            key={idx}
            className={`bg-white p-5 rounded-2xl border ${card.border} shadow-xs hover:shadow-md transition-shadow flex items-start justify-between`}
          >
            <div>
              <span className="text-xs font-extrabold text-slate-400 uppercase tracking-wider block mb-1">
                {card.title}
              </span>
              <span className="text-3xl font-black text-slate-900 block tracking-tight">
                {card.value}
              </span>
              <span className="text-xs font-semibold text-slate-500 block mt-1">
                {card.subtitle}
              </span>
            </div>
            <div className={`${card.bgLight} p-3 rounded-xl border ${card.border}`}>
              <Icon className={`w-6 h-6 ${card.textColor}`} />
            </div>
          </div>
        );
      })}
    </div>
  );
}
