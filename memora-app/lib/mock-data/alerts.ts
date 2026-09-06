import type { Alert } from "@/lib/types";

export const demoAlerts: Alert[] = [
  {
    id: "alert-001",
    patientId: "patient-001",
    type: "session_abandoned",
    severity: "warning",
    title: "Attention Required",
    message: "Patient abandoned Routine Recall twice today. Consider checking in.",
    acknowledged: false,
    createdAt: new Date(Date.now() - 3600000 * 2).toISOString(),
  },
  {
    id: "alert-002",
    patientId: "patient-001",
    type: "streak",
    severity: "info",
    title: "Great Consistency",
    message: "Meena completed 6 consecutive days of memory exercises!",
    acknowledged: true,
    createdAt: new Date(Date.now() - 3600000 * 24).toISOString(),
  },
];
