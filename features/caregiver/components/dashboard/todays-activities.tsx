"use client";

import { CheckCircle2, Gamepad2 } from "lucide-react";
import { useGameSessions } from "@/lib/hooks/use-game-sessions";
import { gameEmojis } from "@/lib/mock-data/games";

function isToday(iso?: string) {
  if (!iso) return false;
  const d = new Date(iso);
  const now = new Date();
  return (
    d.getFullYear() === now.getFullYear() &&
    d.getMonth() === now.getMonth() &&
    d.getDate() === now.getDate()
  );
}

const GAME_META: Record<string, { name: string; category: string }> = {
  "routine-ordering": { name: "Routine Recall", category: "Routine Memory" },
  "memory-map": { name: "Memory Map", category: "Spatial Recall" },
  "therapeutic-tea-room-2-AG": { name: "Quiet Tea Room", category: "Therapeutic Calming" },
  "family-tree": { name: "Family Tree", category: "Personal Recognition" },
  "journal-diary": { name: "My Journal", category: "Expression" },
};

export function TodaysActivities() {
  const { data: sessions } = useGameSessions();

  const todaySessions = (sessions || []).filter(
    (s) => isToday(s.completedAt || s.startedAt) && s.completed
  );

  // Deduplicate by game — keep latest
  const byGame = new Map<string, (typeof todaySessions)[0]>();
  for (const s of todaySessions) {
    if (!byGame.has(s.gameId)) byGame.set(s.gameId, s);
  }
  const activities = Array.from(byGame.values());

  return (
    <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-black text-slate-900 tracking-tight flex items-center gap-2">
          <Gamepad2 className="w-5 h-5 text-sky-600" />
          <span>Today&apos;s Activities</span>
        </h2>
        <span className="text-xs font-bold text-slate-500 bg-slate-100 px-2.5 py-1 rounded-full">
          {activities.length} completed today
        </span>
      </div>

      {activities.length === 0 ? (
        <p className="text-sm text-slate-500 font-medium py-6 text-center">
          No game sessions recorded for this patient today yet.
        </p>
      ) : (
        <div className="space-y-3">
          {activities.map((act) => {
            const meta = GAME_META[act.gameId] || {
              name: act.gameId,
              category: "Cognitive",
            };
            return (
              <div
                key={act.id}
                className="flex items-center justify-between p-3.5 rounded-xl border border-slate-100 bg-slate-50/50 hover:bg-slate-50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="text-2xl p-2 bg-white rounded-xl shadow-xs border border-slate-100">
                    {gameEmojis[act.gameId] || "🎮"}
                  </div>
                  <div>
                    <h3 className="font-extrabold text-sm text-slate-900">{meta.name}</h3>
                    <span className="text-xs font-medium text-slate-500">
                      {meta.category} • Diff: L{act.difficulty}
                    </span>
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-base font-black text-slate-900 block">{act.score}%</span>
                  <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-600">
                    <CheckCircle2 className="w-3 h-3" />
                    Completed
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
