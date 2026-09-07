"use client";

import { useGameSessions } from "@/lib/hooks/use-game-sessions";
import { formatTime } from "@/lib/utils";
import { History, CheckCircle2 } from "lucide-react";

export function RecentActivity() {
  const { data: sessions } = useGameSessions();

  const getGameTitle = (gameId: string) => {
    switch (gameId) {
      case "routine-ordering":
        return "Routine Recall";
      case "hide-object":
        return "Hide the Object";
      case "family-memory":
        return "Family Memory";
      default:
        return gameId;
    }
  };

  const getDifficultyLabel = (diff: number) => {
    if (diff <= 1) return "Easy";
    if (diff <= 3) return "Medium";
    return "Hard";
  };

  const recentSessions = sessions?.slice(0, 6) || [];

  return (
    <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-black text-slate-900 tracking-tight flex items-center gap-2">
          <History className="w-5 h-5 text-indigo-600" />
          <span>Recent Activity</span>
        </h2>
        <span className="text-xs font-bold text-slate-500">Last 6 sessions</span>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-slate-100 text-[11px] font-extrabold text-slate-400 uppercase tracking-wider">
              <th className="pb-3 px-2">Activity</th>
              <th className="pb-3 px-2">Score</th>
              <th className="pb-3 px-2">Accuracy</th>
              <th className="pb-3 px-2">Difficulty</th>
              <th className="pb-3 px-2">Time</th>
              <th className="pb-3 px-2 text-right">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50 text-sm">
            {recentSessions.map((s) => (
              <tr key={s.id} className="hover:bg-slate-50/80 transition-colors">
                <td className="py-3 px-2 font-bold text-slate-900">
                  {getGameTitle(s.gameId)}
                </td>
                <td className="py-3 px-2 font-extrabold text-slate-900">
                  {s.score} pts
                </td>
                <td className="py-3 px-2 font-bold text-emerald-600">
                  {s.accuracy}%
                </td>
                <td className="py-3 px-2">
                  <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700">
                    {getDifficultyLabel(s.difficulty)}
                  </span>
                </td>
                <td className="py-3 px-2 text-xs text-slate-500 font-medium">
                  {formatTime(s.startedAt || new Date().toISOString())}
                </td>
                <td className="py-3 px-2 text-right">
                  <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    Completed
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
