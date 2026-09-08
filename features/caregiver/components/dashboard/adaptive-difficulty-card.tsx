"use client";

import { Cpu, TrendingUp, HelpCircle } from "lucide-react";
import { useGameSessions } from "@/lib/hooks/use-game-sessions";
import { calculateAdaptiveDifficulty } from "@/lib/services/adaptive-difficulty";

export function AdaptiveDifficultyCard() {
  const { data: sessions } = useGameSessions();

  const routineSessions = sessions?.filter((s) => s.gameId === "routine-ordering") || [];
  const difficultyState = calculateAdaptiveDifficulty(routineSessions, 2);

  return (
    <div className="bg-gradient-to-br from-slate-900 to-sky-950 text-white p-6 rounded-2xl border border-sky-800/40 shadow-lg space-y-4 relative overflow-hidden">
      {/* Decorative gradient glow */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-sky-500/10 rounded-full blur-2xl pointer-events-none" />

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="p-2 bg-sky-500/20 rounded-xl border border-sky-400/30">
            <Cpu className="w-5 h-5 text-sky-400 animate-pulse" />
          </div>
          <div>
            <h2 className="text-base font-black tracking-tight">Adaptive Difficulty Engine</h2>
            <span className="text-xs text-sky-300 font-medium">Memory Game Engine</span>
          </div>
        </div>

        <span className="text-xs font-extrabold uppercase bg-sky-500/20 text-sky-300 px-3 py-1 rounded-full border border-sky-400/30">
          AI Active
        </span>
      </div>

      <div className="grid grid-cols-2 gap-3 pt-1">
        <div className="bg-white/5 backdrop-blur-xs p-3.5 rounded-xl border border-white/10">
          <span className="text-[11px] font-extrabold uppercase text-slate-400 block mb-1">
            Previous Level
          </span>
          <span className="text-lg font-black text-slate-200 block">Easy (L1)</span>
        </div>

        <div className="bg-sky-500/20 backdrop-blur-xs p-3.5 rounded-xl border border-sky-400/30">
          <span className="text-[11px] font-extrabold uppercase text-sky-300 block mb-1 flex items-center gap-1">
            Current Level
            <TrendingUp className="w-3 h-3 text-emerald-400" />
          </span>
          <span className="text-lg font-black text-white block">Medium (L2) ↑</span>
        </div>
      </div>

      <div className="bg-white/5 backdrop-blur-xs p-4 rounded-xl border border-white/10 space-y-1">
        <div className="flex items-center gap-1.5 text-xs font-bold text-sky-300">
          <HelpCircle className="w-3.5 h-3.5" />
          <span>Why did difficulty adjust?</span>
        </div>
        <p className="text-xs text-slate-300 leading-relaxed font-medium">
          {difficultyState.reason}
        </p>
      </div>
    </div>
  );
}
