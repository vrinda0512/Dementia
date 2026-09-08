"use client";

import { useAlerts } from "@/lib/hooks/use-alerts";
import { AlertTriangle, CheckCircle, ShieldAlert } from "lucide-react";

export function AlertsPanel() {
  const { data: alerts, acknowledgeAlert } = useAlerts();

  const unacknowledged = alerts?.filter((a) => !a.acknowledged) || [];

  return (
    <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-black text-slate-900 tracking-tight flex items-center gap-2">
          <ShieldAlert className="w-5 h-5 text-rose-600" />
          <span>Patient Alerts</span>
        </h2>
        <span className="text-xs font-bold text-slate-500">
          {unacknowledged.length > 0 ? `${unacknowledged.length} Pending` : "All Clear"}
        </span>
      </div>

      <div className="space-y-3">
        {alerts?.map((alert) => {
          const isWarning = alert.severity === "warning";
          return (
            <div
              key={alert.id}
              className={`p-4 rounded-xl border flex items-start gap-3 transition-all ${
                alert.acknowledged
                  ? "bg-slate-50 border-slate-200 opacity-60"
                  : isWarning
                  ? "bg-amber-50/80 border-amber-200"
                  : "bg-emerald-50/80 border-emerald-200"
              }`}
            >
              {isWarning ? (
                <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
              ) : (
                <CheckCircle className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
              )}
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <h3 className={`font-extrabold text-sm ${isWarning ? "text-amber-900" : "text-emerald-900"}`}>
                    {alert.title}
                  </h3>
                  {!alert.acknowledged && (
                    <button
                      onClick={() => acknowledgeAlert.mutate(alert.id)}
                      className="text-xs font-bold text-sky-700 hover:text-sky-900 underline"
                    >
                      Dismiss
                    </button>
                  )}
                </div>
                <p className={`text-xs mt-0.5 font-medium ${isWarning ? "text-amber-800" : "text-emerald-800"}`}>
                  {alert.message}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
