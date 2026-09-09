"use client";

import { Gamepad2, Play, ToggleLeft, ToggleRight } from "lucide-react";
import { useGameSessions, useGames } from "@/lib/hooks/use-game-sessions";
import { gameEmojis, gameColors } from "@/lib/mock-data/games";
import Link from "next/link";

const HREF_BY_ID: Record<string, string> = {
  "routine-ordering": "/patient/games/routine-ordering",
  "memory-map": "/patient/games/memory-map",
  "therapeutic-tea-room-2-AG": "/patient/games/therapeutic-tea-room-2-AG",
  "family-tree": "/games/family-tree",
  "journal-diary": "/patient/games/journal-diary",
};

/** Display name + route overrides for Supabase game catalog rows. */
const GAME_DISPLAY: Record<
  string,
  { name: string; href?: string; emoji?: string; colorKey?: string }
> = {
  "focus finder": {
    name: "Quiet Tea Room",
    href: "/patient/games/therapeutic-tea-room-2-AG",
    emoji: "🍵",
    colorKey: "therapeutic-tea-room-2-AG",
  },
  "memory match": {
    name: "Family Tree",
    href: "/games/family-tree",
    emoji: "🌳",
    colorKey: "family-tree",
  },
  "morning memory journey": {
    name: "Routine Recall",
    emoji: "🧠",
    colorKey: "routine-ordering",
    // href intentionally omitted — keep existing routing
  },
  "memory map": {
    name: "Memory Map",
    href: "/patient/games/memory-map",
    emoji: "🗺️",
    colorKey: "memory-map",
  },
};

const JOURNAL_CARD = {
  id: "journal-diary",
  name: "My Journal",
  type: "expression",
  description:
    "A guided journaling experience for self-expression. Strengthens narrative memory and emotional well-being.",
  minDifficulty: 1,
  maxDifficulty: 3,
  active: true,
};

export default function CaregiverGamesPage() {
  const { data: sessions } = useGameSessions();
  const { data: dbGames, toggleActive, isLoading } = useGames();

  const games = (() => {
    const list = [...(dbGames || [])];
    const hasJournal = list.some(
      (g) =>
        g.id === "journal-diary" ||
        g.name.toLowerCase() === "my journal" ||
        g.name.toLowerCase() === "journal diary"
    );
    if (!hasJournal) list.push(JOURNAL_CARD);
    return list;
  })();

  const getStats = (gameId: string) => {
    const gameSessions = sessions?.filter((s) => s.gameId === gameId) || [];
    const count = gameSessions.length;
    const avgScore = count
      ? Math.round(gameSessions.reduce((acc, s) => acc + s.score, 0) / count)
      : 0;
    return { count, avgScore };
  };

  return (
    <div className="space-y-8">
      <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs">
        <h1 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
          <Gamepad2 className="w-6 h-6 text-sky-600" />
          <span>Cognitive Activity Configuration</span>
        </h1>
        <p className="text-sm font-semibold text-slate-500 mt-1">
          Configure active cognitive games from Supabase, review session counts, and test gameplay.
        </p>
      </div>

      {isLoading ? (
        <p className="text-sm text-slate-500">Loading games…</p>
      ) : games.length === 0 ? (
        <p className="text-sm text-slate-500 bg-white p-6 rounded-2xl border border-slate-200">
          No rows in the <code>games</code> table yet. Run <code>supabase/seed.sql</code> to seed the catalog.
        </p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {games.map((game) => {
            const override = GAME_DISPLAY[game.name.toLowerCase()];
            const displayName = override?.name || game.name;
            const stats = getStats(game.id);
            const isActive = game.active;
            const colorKey = override?.colorKey || game.id;
            const colors = gameColors[colorKey] || {
              bg: "bg-slate-50",
              text: "text-slate-700",
              border: "border-slate-200",
            };
            const href =
              override?.href ||
              HREF_BY_ID[game.id] ||
              (game.id === "journal-diary"
                ? "/patient/games/journal-diary"
                : `/games/${game.id}`);
            const emoji =
              override?.emoji || gameEmojis[colorKey] || gameEmojis[game.id] || "🎮";

            return (
              <div
                key={game.id}
                className={`bg-white rounded-3xl border ${colors.border} ${colors.bg} p-6 shadow-xs flex flex-col justify-between space-y-6 transition-all hover:shadow-md`}
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="text-4xl p-3 bg-white rounded-2xl shadow-xs border border-slate-100">
                      {emoji}
                    </div>
                    <button
                      type="button"
                      onClick={() =>
                        toggleActive.mutate({ id: game.id, active: !isActive })
                      }
                      className="flex items-center gap-1.5 text-xs font-bold"
                      disabled={game.id === "journal-diary" && !dbGames?.some((g) => g.id === game.id)}
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
                    <h3 className="text-xl font-black text-slate-900">{displayName}</h3>
                    <span className="text-xs font-bold text-slate-500 block mt-0.5">
                      {game.type}
                    </span>
                  </div>

                  <p className="text-xs text-slate-600 leading-relaxed font-medium">
                    {game.description}
                  </p>

                  <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-100 grid grid-cols-3 gap-2 text-center">
                    <div>
                      <span className="text-[10px] font-extrabold uppercase text-slate-400 block">
                        Difficulty
                      </span>
                      <span className="text-xs font-black text-slate-800 block mt-0.5">
                        L{game.minDifficulty}–{game.maxDifficulty}
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
                        {stats.count ? `${stats.avgScore}%` : "—"}
                      </span>
                    </div>
                  </div>
                </div>

                <Link
                  href={href}
                  className="w-full py-3 bg-sky-600 hover:bg-sky-700 text-white font-bold text-xs uppercase tracking-wider rounded-xl shadow-md flex items-center justify-center gap-2 transition-all active:scale-95"
                >
                  <Play className="w-4 h-4 fill-white" />
                  <span>Test Game Flow</span>
                </Link>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
