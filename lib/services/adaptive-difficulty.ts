import type { GameSession, DifficultyResult } from "@/lib/types";

export function calculateAdaptiveDifficulty(
  recentSessions: GameSession[],
  currentDifficulty: number,
  minDifficulty = 1,
  maxDifficulty = 5
): DifficultyResult {
  if (!recentSessions || recentSessions.length === 0) {
    return {
      nextDifficulty: currentDifficulty,
      reason: "Initial session baseline set.",
      direction: "same",
    };
  }

  // Filter completed sessions for this game
  const completed = recentSessions.filter((s) => s.completed);
  if (completed.length === 0) {
    return {
      nextDifficulty: currentDifficulty,
      reason: "Awaiting completed sessions.",
      direction: "same",
    };
  }

  // Get recent 3 sessions
  const last3 = completed.slice(0, 3);
  const avgAccuracy =
    last3.reduce((acc, s) => acc + s.accuracy, 0) / last3.length;

  const latestSession = completed[0];

  // 1. Check for increase: >= 85% accuracy across recent sessions
  if (avgAccuracy >= 85 && last3.length >= 2) {
    if (currentDifficulty < maxDifficulty) {
      return {
        nextDifficulty: currentDifficulty + 1,
        reason: `Patient maintained ${Math.round(avgAccuracy)}% accuracy over recent sessions.`,
        direction: "up",
      };
    } else {
      return {
        nextDifficulty: maxDifficulty,
        reason: "Maximum difficulty level reached.",
        direction: "same",
      };
    }
  }

  // 2. Check for decrease: < 50% accuracy on latest or low average
  if (latestSession.accuracy < 50 || avgAccuracy < 55) {
    if (currentDifficulty > minDifficulty) {
      return {
        nextDifficulty: currentDifficulty - 1,
        reason: `Accuracy dropped to ${Math.round(latestSession.accuracy)}%. Scaling back to reduce cognitive fatigue.`,
        direction: "down",
      };
    } else {
      return {
        nextDifficulty: minDifficulty,
        reason: "Minimum difficulty level maintained for gentle practice.",
        direction: "same",
      };
    }
  }

  // 3. Maintain current level
  return {
    nextDifficulty: currentDifficulty,
    reason: `Steady performance at ${Math.round(avgAccuracy)}% accuracy. Continuing current difficulty level.`,
    direction: "same",
  };
}
