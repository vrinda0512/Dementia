"use client";

import { useMetrics } from "@/lib/hooks/use-metrics";
import { getDayName } from "@/lib/utils";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid,
} from "recharts";

export function CognitiveChart() {
  const { data: metrics } = useMetrics();

  const chartData = metrics
    ? [...metrics].reverse().map((m) => {
        const d = new Date(m.calculatedAt);
        return {
          day: getDayName(d),
          Memory: m.memoryScore,
          Attention: m.attentionScore,
          "Routine Recall": m.routineRecallScore,
          Recognition: m.recognitionScore,
        };
      })
    : [];

  return (
    <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-black text-slate-900 tracking-tight">
            Cognitive Activity Trend
          </h2>
          <p className="text-xs font-semibold text-slate-500">
            7-Day score breakdown across cognitive domains
          </p>
        </div>
        <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
          +8% overall progress
        </span>
      </div>

      <div className="h-64 w-full pt-2">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
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
                boxShadow: "0 10px 25px -5px rgba(0,0,0,0.3)",
              }}
            />
            <Legend wrapperStyle={{ fontSize: "12px", paddingTop: "10px" }} />
            <Line type="monotone" dataKey="Memory" stroke="#3b82f6" strokeWidth={3} dot={{ r: 4 }} />
            <Line type="monotone" dataKey="Attention" stroke="#8b5cf6" strokeWidth={3} dot={{ r: 4 }} />
            <Line type="monotone" dataKey="Routine Recall" stroke="#f59e0b" strokeWidth={3} dot={{ r: 4 }} />
            <Line type="monotone" dataKey="Recognition" stroke="#10b981" strokeWidth={3} dot={{ r: 4 }} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
