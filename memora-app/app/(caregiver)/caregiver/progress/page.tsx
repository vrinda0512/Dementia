"use client";

import { useState } from "react";
import { TrendingUp, Award, Brain, Eye, RotateCcw, Heart, Clock } from "lucide-react";
import { useMetrics } from "@/lib/hooks/use-metrics";
import { useGameSessions } from "@/lib/hooks/use-game-sessions";
import { getDayName } from "@/lib/utils";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";

export default function CaregiverProgressPage() {
  const [timeRange, setTimeRange] = useState<"7d" | "30d">("7d");
  const { data: metrics } = useMetrics();
  const { data: sessions } = useGameSessions();

  const chartData = metrics
    ? [...metrics].reverse().map((m) => {
        const d = new Date(m.calculatedAt);
        return {
          day: getDayName(d),
          Overall: Math.round(
            (m.memoryScore + m.attentionScore + m.routineRecallScore + m.recognitionScore) / 4
          ),
          Memory: m.memoryScore,
          Attention: m.attentionScore,
          Routine: m.routineRecallScore,
          Recognition: m.recognitionScore,
        };
      })
    : [];

  const categories = [
    { title: "Memory", score: 82, icon: Brain, color: "text-blue-600", bg: "bg-blue-50 border-blue-200" },
    { title: "Attention", score: 74, icon: Eye, color: "text-purple-600", bg: "bg-purple-50 border-purple-200" },
    { title: "Routine Recall", score: 81, icon: RotateCcw, color: "text-amber-600", bg: "bg-amber-50 border-amber-200" },
    { title: "Recognition", score: 89, icon: Heart, color: "text-rose-600", bg: "bg-rose-50 border-rose-200" },
  ];

  const gamePerformance = [
    { game: "Routine Recall", accuracy: "81%", avgTime: "8.2 sec", difficulty: "Medium (L2)" },
    { game: "Hide the Object", accuracy: "76%", avgTime: "11.4 sec", difficulty: "Medium (L2)" },
    { game: "Family Memory", accuracy: "91%", avgTime: "6.8 sec", difficulty: "Easy (L1)" },
  ];

  return (
    <div className="space-y-8">
      {/* Top Banner */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
            <TrendingUp className="w-6 h-6 text-emerald-600" />
            <span>Cognitive Progress Analytics</span>
          </h1>
          <p className="text-sm font-semibold text-slate-500 mt-1">
            Long-term trends across memory, attention, routine recall, and personal recognition.
          </p>
        </div>

        <div className="bg-emerald-50 border border-emerald-200 p-4 rounded-2xl flex items-center gap-4">
          <div>
            <span className="text-[11px] font-extrabold uppercase text-emerald-800 tracking-wider block">
              Overall Performance
            </span>
            <span className="text-2xl font-black text-emerald-900 block">78% ↑ 8%</span>
          </div>
          <Award className="w-8 h-8 text-emerald-600" />
        </div>
      </div>

      {/* 4 Category Score Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {categories.map((cat, idx) => {
          const Icon = cat.icon;
          return (
            <div
              key={idx}
              className={`bg-white p-5 rounded-2xl border ${cat.bg} shadow-xs flex items-center justify-between`}
            >
              <div>
                <span className="text-xs font-extrabold text-slate-400 uppercase tracking-wider block mb-1">
                  {cat.title}
                </span>
                <span className="text-3xl font-black text-slate-900 block">{cat.score}%</span>
              </div>
              <div className={`p-3 rounded-xl ${cat.bg}`}>
                <Icon className={`w-6 h-6 ${cat.color}`} />
              </div>
            </div>
          );
        })}
      </div>

      {/* Trend Chart with 7d / 30d toggle */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-black text-slate-900 tracking-tight">Performance Trend</h2>
            <p className="text-xs font-semibold text-slate-500">Overall cognitive index over time</p>
          </div>

          <div className="bg-slate-100 p-1 rounded-xl flex items-center gap-1 border border-slate-200">
            <button
              onClick={() => setTimeRange("7d")}
              className={`px-3 py-1 text-xs font-bold rounded-lg transition-colors ${
                timeRange === "7d" ? "bg-white text-slate-900 shadow-xs" : "text-slate-500"
              }`}
            >
              7 Days
            </button>
            <button
              onClick={() => setTimeRange("30d")}
              className={`px-3 py-1 text-xs font-bold rounded-lg transition-colors ${
                timeRange === "30d" ? "bg-white text-slate-900 shadow-xs" : "text-slate-500"
              }`}
            >
              30 Days
            </button>
          </div>
        </div>

        <div className="h-64 w-full pt-2">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="colorOverall" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0.0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="day" stroke="#94a3b8" fontSize={12} tickLine={false} />
              <YAxis domain={[50, 100]} stroke="#94a3b8" fontSize={12} tickLine={false} />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#0f172a",
                  borderColor: "#334155",
                  borderRadius: "12px",
                  color: "#fff",
                  fontSize: "12px",
                }}
              />
              <Area type="monotone" dataKey="Overall" stroke="#10b981" strokeWidth={3} fillOpacity={1} fill="url(#colorOverall)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Game Performance Table */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
        <h2 className="text-lg font-black text-slate-900 tracking-tight">Game Performance Breakdown</h2>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-100 text-[11px] font-extrabold text-slate-400 uppercase tracking-wider">
                <th className="pb-3 px-2">Game</th>
                <th className="pb-3 px-2">Accuracy</th>
                <th className="pb-3 px-2">Avg Response Time</th>
                <th className="pb-3 px-2">Current Difficulty</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50 text-sm">
              {gamePerformance.map((gp, idx) => (
                <tr key={idx} className="hover:bg-slate-50 transition-colors">
                  <td className="py-3 px-2 font-bold text-slate-900">{gp.game}</td>
                  <td className="py-3 px-2 font-extrabold text-emerald-600">{gp.accuracy}</td>
                  <td className="py-3 px-2 text-xs font-semibold text-slate-600">{gp.avgTime}</td>
                  <td className="py-3 px-2">
                    <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-800">
                      {gp.difficulty}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
