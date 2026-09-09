// ─── Categories & Game Formats ────────────────────────────────

export type MemoryCategory =
  | "family"
  | "personal"
  | "childhood"
  | "food"
  | "music"
  | "hobbies"
  | "places"
  | "home";

export type GameFormat =
  | "multiple-choice"
  | "voice"
  | "image"
  | "fill-blank";

// ─── Patient ───────────────────────────────────────────────
export type Patient = {
  id: string;
  name: string;
  age?: number;
  preferredLanguage?: string;
  location?: string;
  avatar?: string;
  avatarUrl?: string;
  caregiverId?: string;
  phone?: string;
  createdAt?: string;
  updatedAt?: string;
};

// ─── Family Member ─────────────────────────────────────────
export type FamilyMember = {
  id: string;
  patientId: string;
  name: string;
  relationship: string;
  photoUrl?: string;
  createdAt?: string;
};

// ─── Routine ───────────────────────────────────────────────
export type Routine = {
  id: string;
  patientId: string;
  label: string;
  emoji?: string;
  description?: string;
  location?: string;
  timeOfDay?: string;
  stepOrder: number;
  order?: number; // Alias for UI compatibility
  active?: boolean;
  createdAt?: string;
  updatedAt?: string;
};

// ─── Personalization Question ──────────────────────────────
export type PersonalizationQuestion = {
  id: string;
  patientId?: string;
  category: MemoryCategory;
  question: string;
  answer: string;
  options?: string[];
  format: GameFormat;
  image?: string;
  audio?: string;
  createdAt?: string;
};

// ─── Game ──────────────────────────────────────────────────
export type Game = {
  id: string;
  name: string;
  type: string;
  description?: string;
  minDifficulty: number;
  maxDifficulty: number;
  active: boolean;
  createdAt?: string;
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
  abandoned?: boolean;
  startedAt?: string;
  completedAt?: string;
  createdAt?: string;
};

// ─── Game Event ────────────────────────────────────────────
export type GameEvent = {
  id: string;
  sessionId: string;
  patientId: string;
  gameId: string;
  eventType: string;
  challengeId?: string;
  value?: any;
  responseTime?: number;
  attemptNumber?: number;
  timestamp?: string;
  createdAt?: string;
};

// ─── Cognitive Metrics ─────────────────────────────────────
export type Metrics = {
  id: string;
  patientId: string;
  memoryScore: number;
  attentionScore: number;
  routineRecallScore: number;
  recognitionScore: number;
  averageAccuracy: number;
  averageResponseTime: number;
  calculatedAt?: string;
  createdAt?: string;
};

// ─── Reminder ──────────────────────────────────────────────
export type Reminder = {
  id: string;
  patientId: string;
  type: string;
  title: string;
  description?: string;
  scheduledTime: string;
  patientPhone?: string;
  scheduledFor?: string;
  status?: "scheduled" | "sent" | "failed";
  //recurring?: string;
  completed: boolean;
  active?: boolean;
  createdAt?: string;
  updatedAt?: string;
};

// ─── Alert ─────────────────────────────────────────────────
export type Alert = {
  id: string;
  patientId: string;
  type: string;
  severity: "low" | "medium" | "high" | "info" | "warning" | "critical";
  title: string;
  message: string;
  acknowledged: boolean;
  createdAt?: string;
  acknowledgedAt?: string;
};

// ─── Companion Interaction ─────────────────────────────────
export type CompanionInteraction = {
  id: string;
  patientId: string;
  type: string;
  message?: string;
  response?: string;
  language?: string;
  timestamp?: string;
  createdAt?: string;
};

// ─── Routine Result ────────────────────────────────────────
export type RoutineResult = {
  id: string;
  patientId: string;
  gameId?: string;
  score?: number;
  accuracy?: number;
  attempts?: number;
  responseTime?: number;
  difficulty?: number;
  hintsUsed?: number;
  completed?: boolean;
  timestamp?: string;
  challenges?: any;
};

// ─── Memory ────────────────────────────────────────────────
export type Memory = {
  id: string;
  patientId: string;
  title: string;
  description: string;
  category: "trip" | "food" | "family" | "festival" | "hobby" | "other" | MemoryCategory;
  people?: string[];
  date?: string;
  imageUrl?: string;
  createdAt?: string;
};

// ─── Caregiver ─────────────────────────────────────────────
export type Caregiver = {
  id: string;
  name: string;
  email: string;
  role?: string;
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
