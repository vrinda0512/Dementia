import type { Metrics } from "@/lib/types";

const today = new Date();
const dayISO = (daysAgo: number) => {
  const d = new Date(today);
  d.setDate(d.getDate() - daysAgo);
  d.setHours(23, 59, 0, 0);
  return d.toISOString();
};

export const demoMetrics: Metrics[] = [
  {
    id: "metric-001",
    patientId: "patient-001",
    memoryScore: 84,
    attentionScore: 78,
    routineRecallScore: 86,
    recognitionScore: 92,
    averageAccuracy: 88,
    averageResponseTime: 7800,
    calculatedAt: dayISO(0),
  },
  {
    id: "metric-002",
    patientId: "patient-001",
    memoryScore: 80,
    attentionScore: 74,
    routineRecallScore: 82,
    recognitionScore: 88,
    averageAccuracy: 84,
    averageResponseTime: 8500,
    calculatedAt: dayISO(1),
  },
  {
    id: "metric-003",
    patientId: "patient-001",
    memoryScore: 78,
    attentionScore: 72,
    routineRecallScore: 76,
    recognitionScore: 90,
    averageAccuracy: 80,
    averageResponseTime: 9200,
    calculatedAt: dayISO(2),
  },
  {
    id: "metric-004",
    patientId: "patient-001",
    memoryScore: 72,
    attentionScore: 68,
    routineRecallScore: 70,
    recognitionScore: 85,
    averageAccuracy: 74,
    averageResponseTime: 10100,
    calculatedAt: dayISO(3),
  },
  {
    id: "metric-005",
    patientId: "patient-001",
    memoryScore: 70,
    attentionScore: 66,
    routineRecallScore: 72,
    recognitionScore: 88,
    averageAccuracy: 76,
    averageResponseTime: 10800,
    calculatedAt: dayISO(4),
  },
  {
    id: "metric-006",
    patientId: "patient-001",
    memoryScore: 68,
    attentionScore: 62,
    routineRecallScore: 65,
    recognitionScore: 82,
    averageAccuracy: 70,
    averageResponseTime: 11500,
    calculatedAt: dayISO(5),
  },
  {
    id: "metric-007",
    patientId: "patient-001",
    memoryScore: 65,
    attentionScore: 60,
    routineRecallScore: 62,
    recognitionScore: 80,
    averageAccuracy: 68,
    averageResponseTime: 12200,
    calculatedAt: dayISO(6),
  },
];
