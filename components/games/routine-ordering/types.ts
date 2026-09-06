export type RoutineStep = {
  id: string;
  label: string;
  emoji: string;
  location: string;
  description: string;
};

export type ChallengeType =
  | "sequence"
  | "missing"
  | "before-after"
  | "location"
  | "rebuild";

export type ChallengeOption = {
  id: string;
  label: string;
  emoji: string;
};

export type Challenge = {
  id: string;
  type: ChallengeType;
  prompt: string;
  subtitle: string;

  targetIds: string[];

  options: ChallengeOption[];

  targetStepId?: string;

  correctAnswer?: string;

  locationOptions?: string[];
};

export type ChallengeResult = {
  challengeId: string;
  type: ChallengeType;

  correct: boolean;

  attempts: number;

  hintsUsed: number;

  responseTime: number;

  score: number;

  timestamp: string;
};

export type RoutineGameResult = {
  patientId: string;
  gameId: "routine-ordering";

  score: number;
  accuracy: number;

  attempts: number;

  responseTime: number;

  difficulty: number;

  hintsUsed: number;

  completed: boolean;

  timestamp: string;

  challenges: ChallengeResult[];
};