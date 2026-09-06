// ─── Patient ───────────────────────────────────────────────
export type Patient = {
  id: string;
  name: string;
  age: number;
  preferredLanguage: string;
  location: string;
  caregiverId: string;
  avatarUrl?: string;
  createdAt?: string;
};

// ─── Family Member (local/structured data) ─────────────────
export type FamilyMember = {
  id: string;
  patientId: string;
  name: string;
  relationship: string;
  photoUrl?: string;
};

// ─── Routine ───────────────────────────────────────────────
export type Routine = {
  id: string;
  patientId: string;
  label: string;
  emoji: string;
  description: string;
  location: string;
  timeOfDay: string;
  order: number;
};

// ─── Game ──────────────────────────────────────────────────
export type Game = {
  id: string;
  name: string;
  type: string;
  description: string;
  minDifficulty: number;
  maxDifficulty: number;
  active: boolean;
  createdAt: string;
};

// ─── Game Session ──────────────────────────────────────────
export type GameSession = {
  id: string;
  patientId: string;
  gameId: string;
  difficulty: number;
  score: number;
  accuracy: number;
  attempts: number;
  responseTime: number;
  hintsUsed: number;
  completed: boolean;
  abandoned: boolean;
  startedAt: string;
  completedAt?: string;
};

// ─── Game Event ────────────────────────────────────────────
export type GameEvent = {
  id: string;
  sessionId: string;
  patientId: string;
  gameId: string;
  eventType: string;
  challengeId: string;
  value: string;
  responseTime: number;
  attemptNumber: number;
  timestamp: string;
};

// ─── Metrics ───────────────────────────────────────────────
export type Metrics = {
  id: string;
  patientId: string;
  memoryScore: number;
  attentionScore: number;
  routineRecallScore: number;
  recognitionScore: number;
  averageAccuracy: number;
  averageResponseTime: number;
  calculatedAt: string;
};

// ─── Reminder ──────────────────────────────────────────────
export type Reminder = {
  id: string;
  patientId: string;
  type: string;
  title: string;
  description: string;
  scheduledTime: string;
  recurring?: string;
  completed: boolean;
  active: boolean;
};

// ─── Alert ─────────────────────────────────────────────────
export type Alert = {
  id: string;
  patientId: string;
  type: string;
  severity: "info" | "warning" | "critical";
  title: string;
  message: string;
  acknowledged: boolean;
  createdAt: string;
};

// ─── Memory ────────────────────────────────────────────────
export type Memory = {
  id: string;
  patientId: string;
  title: string;
  description: string;
  category: "trip" | "food" | "family" | "festival" | "hobby" | "other";
  people: string[];
  date?: string;
  imageUrl?: string;
  createdAt: string;
};

// ─── Caregiver ─────────────────────────────────────────────
export type Caregiver = {
  id: string;
  name: string;
  email: string;
};

// ─── Adaptive Difficulty ───────────────────────────────────
export type DifficultyResult = {
  nextDifficulty: number;
  reason: string;
  direction: "up" | "down" | "same";
};

// ─── Generated Activity ───────────────────────────────────
export type GeneratedActivity = {
  question: string;
  options: string[];
  correctAnswer: string;
  difficulty: "Easy" | "Medium" | "Hard";
  sourceMemoryId: string;
};
