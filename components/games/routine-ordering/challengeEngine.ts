import {
  Challenge,
  ChallengeOption,
  ChallengeType,
  RoutineStep,
} from "./types";

function shuffle<T>(items: T[]): T[] {
  return [...items].sort(() => Math.random() - 0.5);
}

function toOption(step: RoutineStep): ChallengeOption {
  return {
    id: step.id,
    label: step.label,
    emoji: step.emoji,
  };
}

export function generateChallenges(
  routine: RoutineStep[],
  difficulty: number
): Challenge[] {
  const challenges: Challenge[] = [];

  /*
   * ---------------------------------------------------------
   * 1. SEQUENCE
   * ---------------------------------------------------------
   */

  challenges.push({
    id: "sequence-1",

    type: "sequence",

    prompt: "Can you remember the morning in the right order?",

    subtitle:
      "Tap the activities in the order they happened.",

    targetIds: routine.map((step) => step.id),

    options: shuffle(routine).map(toOption),
  });

  /*
   * ---------------------------------------------------------
   * 2. MISSING ACTIVITY
   * ---------------------------------------------------------
   */

  const missingIndex =
    Math.min(
      Math.max(1, difficulty),
      routine.length - 1
    );

  const missingStep =
    routine[missingIndex];

  const missingCandidates = shuffle(
    routine.filter(
      (step) => step.id !== missingStep.id
    )
  ).slice(0, 2);

  challenges.push({
    id: "missing-1",

    type: "missing",

    prompt: "Something is missing from your morning.",

    subtitle:
      "Which activity belongs in the empty space?",

    targetIds: routine.map((step) => step.id),

    targetStepId: missingStep.id,

    correctAnswer: missingStep.id,
    // include a full preview sequence so the UI can show the missing slot
    previewSequence: routine.map(toOption),

    options: shuffle([
      toOption(missingStep),
      ...missingCandidates.map(toOption),
    ]),
  });

  /*
   * ---------------------------------------------------------
   * 3. BEFORE / AFTER
   * ---------------------------------------------------------
   */

  const targetIndex = Math.min(
    Math.max(1, difficulty + 1),
    routine.length - 1
  );

  const target = routine[targetIndex];

  const before = routine[targetIndex - 1];

  const alternatives = routine.filter(
    (step) =>
      step.id !== before.id &&
      step.id !== target.id
  );

  const alternative =
    alternatives[
      Math.floor(
        Math.random() * alternatives.length
      )
    ];

  challenges.push({
    id: "before-1",

    type: "before-after",

    prompt: `What happened just before ${target.label}?`,

    subtitle:
      "Think back to the morning you just experienced.",

    targetIds: routine.map((step) => step.id),

    targetStepId: target.id,

    correctAnswer: before.id,

    options: shuffle([
      toOption(before),
      toOption(alternative),
    ]),
  });

  /*
   * ---------------------------------------------------------
   * 4. LOCATION
   * ---------------------------------------------------------
   */

  const locationStep =
    routine[
      Math.floor(
        Math.random() * routine.length
      )
    ];

  const locations = Array.from(
    new Set(routine.map((step) => step.location))
  );

  challenges.push({
    id: "location-1",

    type: "location",

    prompt: `Where did you ${locationStep.label.toLowerCase()}?`,

    subtitle:
      "Remember where this part of your morning happened.",

    targetIds: routine.map((step) => step.id),

    targetStepId: locationStep.id,

    correctAnswer: locationStep.location,

    options: locations.map((location) => ({
      id: location,
      label: location,
      emoji:
        location === "Bedroom"
          ? "🛏️"
          : location === "Bathroom"
            ? "🚿"
            : location === "Kitchen"
              ? "🍵"
              : location === "Medicine Shelf"
                ? "🧴"
                : "🍽️",
    })),
  });

  /*
   * ---------------------------------------------------------
   * 5. REBUILD
   * ---------------------------------------------------------
   */

  challenges.push({
    id: "rebuild-1",

    type: "rebuild",

    prompt: "One last memory challenge!",

    subtitle:
      "Rebuild your entire morning from memory.",

    targetIds: routine.map((step) => step.id),

    options: shuffle(routine).map(toOption),
  });

  return challenges;
}