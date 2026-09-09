"use client";

import { Award, Gamepad2, Bell, Flame } from "lucide-react";
import { useGameSessions } from "@/lib/hooks/use-game-sessions";
import { useReminders } from "@/lib/hooks/use-reminders";

function dayKey(iso?: string) {
  if (!iso) return "";
  const d = new Date(iso);
  return `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`;
}

function computeStreak(sessions: { completed?: boolean; completedAt?: string; startedAt?: string }[]) {
  const days = new Set(
    sessions
      .filter((s) => s.completed)
      .map((s) => dayKey(s.completedAt || s.startedAt))
      .filter(Boolean)
  );
  let streak = 0;
  const cursor = new Date();
  for (;;) {
    const key = `${cursor.getFullYear()}-${cursor.getMonth()}-${cursor.getDate()}`;
    if (!days.has(key)) break;
    streak += 1;
    cursor.setDate(cursor.getDate() - 1);
  }
  return streak;
}

export function SummaryCards() {
  const { data: sessions } = useGameSessions();
  const { data: reminders } = useReminders();

  const list = sessions || [];
  const totalScore = list.reduce((acc, s) => acc + s.score, 0);
  const avgScore = list.length ? Math.round(totalScore / list.length) : 0;
  const gamesCompleted = list.filter((s) => s.completed).length;
  const activeRemindersCount = reminders?.filter((r) => !r.completed).length || 0;
  const completedReminders = reminders?.filter((r) => r.completed).length || 0;
  const streakDays = computeStreak(list);
  const uniqueGames = new Set(list.map((s) => s.gameId)).size;

  const cards = [
    {
      title: "Average Score",
      value: list.length ? `${avgScore}%` : "—",
      subtitle: list.length ? `From ${list.length} sessions` : "No sessions yet",
      icon: Award,
      color: "bg-blue-500",
      textColor: "text-blue-600",
      bgLight: "bg-blue-50",
      border: "border-blue-100",
    },
    {
      title: "Games Completed",
      value: gamesCompleted,
      subtitle: `Across ${uniqueGames} activity types`,
      icon: Gamepad2,
      color: "bg-purple-500",
      textColor: "text-purple-600",
      bgLight: "bg-purple-50",
      border: "border-purple-100",
    },
    {
      title: "Reminders Pending",
      value: activeRemindersCount,
      subtitle: `${completedReminders} completed`,
      icon: Bell,
      color: "bg-amber-500",
      textColor: "text-amber-600",
      bgLight: "bg-amber-50",
      border: "border-amber-100",
    },
    {
      title: "Current Streak",
      value: `${streakDays} days`,
      subtitle: streakDays > 0 ? "Consistent daily engagement" : "Play today to start",
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
