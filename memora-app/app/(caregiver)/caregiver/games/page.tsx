"use client";

import { useState } from "react";
import { Gamepad2, Play, ToggleLeft, ToggleRight, Sparkles } from "lucide-react";
import { useGameSessions } from "@/lib/hooks/use-game-sessions";
import Link from "next/link";

export default function CaregiverGamesPage() {
  const { data: sessions } = useGameSessions();

  const [activeStates, setActiveStates] = useState<Record<string, boolean>>({
    "routine-ordering": true,
    "hide-object": true,
    "family-memory": true,
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
      color: "from-blue-500 to-sky-600",
      bgLight: "bg-blue-50 border-blue-200",
    },
    {
      id: "hide-object",
      name: "Hide the Object",
      emoji: "👁️",
      category: "Spatial Memory & Attention",
      description: "Remember where an object was hidden in a room layout (Bed, Table, Cupboard, Drawer, Door).",
      difficulty: "Medium (Level 2)",
      href: "/patient/games/hide-object",
      color: "from-purple-500 to-indigo-600",
      bgLight: "bg-purple-50 border-purple-200",
    },
    {
      id: "family-memory",
      name: "Family Memory",
      emoji: "❤️",
      category: "Personal Recognition",
      description: "Identify familiar family members (Rajesh, Priya, Aarav) and personalized memories.",
      difficulty: "Easy (Level 1)",
      href: "/patient/games/family-memory",
      color: "from-rose-500 to-pink-600",
      bgLight: "bg-rose-50 border-rose-200",
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

      {/* Games Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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
