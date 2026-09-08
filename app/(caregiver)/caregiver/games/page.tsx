"use client";

import { useState } from "react";
import { Gamepad2, Play, ToggleLeft, ToggleRight } from "lucide-react";
import { useGameSessions } from "@/lib/hooks/use-game-sessions";
import Link from "next/link";

export default function CaregiverGamesPage() {
  const { data: sessions } = useGameSessions();

  const [activeStates, setActiveStates] = useState<Record<string, boolean>>({
    "routine-ordering": true,
    "memory-map": true,
    "therapeutic-tea-room-2-AG": true,
    "journal-diary": true,
  });

  const games = [
    {
      id: "routine-ordering",
      name: "Routine Recall",
      emoji: "🧠",
      category: "Sequencing & Daily Memory",
      description: "Arrange daily activities in the correct order. Patient reorders morning steps based on their personal schedule.",
      difficulty: "Medium (Level 2)",
      href: "/patient/games/routine-ordering",
      color: "from-amber-500 to-orange-600",
      bgLight: "bg-amber-50 border-amber-200",
    },
    {
      id: "memory-map",
      name: "Memory Map",
      emoji: "🗺️",
      category: "Navigation & Spatial Recall",
      description: "Navigate familiar places and locations. Strengthens spatial memory and environmental awareness.",
      difficulty: "Medium (Level 2)",
      href: "/patient/games/memory-map",
      color: "from-emerald-500 to-green-600",
      bgLight: "bg-emerald-50 border-emerald-200",
    },
    {
      id: "therapeutic-tea-room-2-AG",
      name: "Quiet Tea Room",
      emoji: "🍵",
      category: "Therapeutic & Calming",
      description: "A calming, multi-sensory tea-making experience. Reduces anxiety while exercising procedural memory.",
      difficulty: "Easy (Level 1)",
      href: "/patient/games/therapeutic-tea-room-2-AG",
      color: "from-teal-500 to-cyan-600",
      bgLight: "bg-teal-50 border-teal-200",
    },
    {
      id: "journal-diary",
      name: "My Journal",
      emoji: "📔",
      category: "Expression & Reflection",
      description: "A guided journaling experience for self-expression. Strengthens narrative memory and emotional well-being.",
      difficulty: "Easy (Level 1)",
      href: "/patient/games/journal-diary",
      color: "from-violet-500 to-purple-600",
      bgLight: "bg-violet-50 border-violet-200",
    },
  ];

  const getStats = (gameId: string) => {
    const gameSessions = sessions?.filter((s) => s.gameId === gameId) || [];
    const count = gameSessions.length;
    const avgScore = count
      ? Math.round(gameSessions.reduce((acc, s) => acc + s.score, 0) / count)
      : 80;
    return { count, avgScore };
  };

  const toggleGame = (id: string) => {
    setActiveStates((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs">
        <h1 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
          <Gamepad2 className="w-6 h-6 text-sky-600" />
          <span>Cognitive Activity Configuration</span>
        </h1>
        <p className="text-sm font-semibold text-slate-500 mt-1">
          Configure active cognitive games, review session counts, and test patient gameplay.
        </p>
      </div>

      {/* Games Cards Grid - 2x2 on desktop, single column on mobile */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {games.map((game) => {
          const stats = getStats(game.id);
          const isActive = activeStates[game.id];

          return (
            <div
              key={game.id}
              className={`bg-white rounded-3xl border ${game.bgLight} p-6 shadow-xs flex flex-col justify-between space-y-6 transition-all hover:shadow-md`}
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="text-4xl p-3 bg-white rounded-2xl shadow-xs border border-slate-100">
                    {game.emoji}
                  </div>
                  <button
                    type="button"
                    onClick={() => toggleGame(game.id)}
                    className="flex items-center gap-1.5 text-xs font-bold"
                  >
                    {isActive ? (
                      <>
                        <span className="text-emerald-700 font-extrabold">Active</span>
                        <ToggleRight className="w-7 h-7 text-emerald-600" />
                      </>
                    ) : (
                      <>
                        <span className="text-slate-400">Disabled</span>
                        <ToggleLeft className="w-7 h-7 text-slate-300" />
                      </>
                    )}
                  </button>
                </div>

                <div>
                  <h3 className="text-xl font-black text-slate-900">{game.name}</h3>
                  <span className="text-xs font-bold text-slate-500 block mt-0.5">
                    {game.category}
                  </span>
                </div>

                <p className="text-xs text-slate-600 leading-relaxed font-medium">
                  {game.description}
                </p>

                {/* Difficulty & Stats */}
                <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-100 grid grid-cols-3 gap-2 text-center">
                  <div>
                    <span className="text-[10px] font-extrabold uppercase text-slate-400 block">
                      Difficulty
                    </span>
                    <span className="text-xs font-black text-slate-800 block mt-0.5">
                      {game.difficulty.split(" ")[0]}
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] font-extrabold uppercase text-slate-400 block">
                      Sessions
                    </span>
                    <span className="text-xs font-black text-slate-800 block mt-0.5">
                      {stats.count}
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] font-extrabold uppercase text-slate-400 block">
                      Avg Score
                    </span>
                    <span className="text-xs font-black text-emerald-600 block mt-0.5">
                      {stats.avgScore}%
                    </span>
                  </div>
                </div>
              </div>

              <Link
                href={game.href}
                className={`w-full py-3 bg-gradient-to-r ${game.color} text-white font-bold text-xs uppercase tracking-wider rounded-xl shadow-md flex items-center justify-center gap-2 transition-all hover:brightness-110 active:scale-95`}
              >
                <Play className="w-4 h-4 fill-white" />
                <span>Test Game Flow</span>
              </Link>
            </div>
          );
        })}
      </div>
    </div>
  );
}
