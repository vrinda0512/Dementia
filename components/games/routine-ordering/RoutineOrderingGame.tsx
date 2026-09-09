"use client";

import { useCallback, useEffect, useMemo, useState } from "react";

import ChallengeCard from "./ChallengeCard";
import RewardBurst from "./RewardBurst";
import RoutineWorld from "./RoutineWorld";
import RoutineIcon from "./RoutineIcon";
import { generateChallenges } from "./challengeEngine";
import { ChallengeOption, ChallengeResult, RoutineGameResult, RoutineStep } from "./types";
import "./memoryBook.css";

type Props = {
  patientId: string;
  difficulty: number;
  routine: RoutineStep[];
  onComplete?: (result: RoutineGameResult) => void;
};

type Phase =
  | "intro"
  | "preview"
  | "challenge"
  | "reward"
  | "complete";

const PREVIEW_TIME = 2200;

export default function RoutineOrderingGame({
  patientId,
  difficulty,
  routine,
  onComplete,
}: Props) {
  const [pageFlip, setPageFlip] = useState(false);
  const activeRoutine = useMemo(() => {
    if (routine.length <= 4) {
      return routine;
    }

    if (difficulty <= 1) {
      return routine.slice(0, 4);
    }

    if (difficulty === 2) {
      return routine.slice(0, 5);
    }

    return routine;
  }, [routine, difficulty]);

  const challenges = useMemo(
    () => generateChallenges(activeRoutine, difficulty),
    [activeRoutine, difficulty]
  );

  const [phase, setPhase] = useState<Phase>("intro");

  const [previewIndex, setPreviewIndex] = useState(0);

  const [currentChallengeIndex, setCurrentChallengeIndex] =
    useState(0);

  const level = Math.min(currentChallengeIndex + 1, 5);

  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  const [hintUsed, setHintUsed] = useState(false);

  const [currentAttempts, setCurrentAttempts] = useState(0);

  const [challengeStartedAt, setChallengeStartedAt] =
    useState<number | null>(null);

  const [sessionStartedAt, setSessionStartedAt] =
    useState<number | null>(null);

  const [challengeResults, setChallengeResults] = useState<
    ChallengeResult[]
  >([]);

  const [sessionScore, setSessionScore] = useState(0);

  const [rewardStars, setRewardStars] = useState(1);

  const [rewardMessage, setRewardMessage] = useState(
    "Wonderful! You remembered it."
  );

  const [feedbackMessage, setFeedbackMessage] =
    useState("");

  const [completedResult, setCompletedResult] =
    useState<RoutineGameResult | null>(null);

  const currentChallenge =
    challenges[currentChallengeIndex];

  /*
   * ---------------------------------------------------------
   * START SESSION
   * ---------------------------------------------------------
   */

  const startJourney = useCallback(() => {
    setPhase("preview");
    setPreviewIndex(0);
    setCurrentChallengeIndex(0);
    setSelectedIds([]);
    setHintUsed(false);
    setCurrentAttempts(0);
    setChallengeResults([]);
    setSessionScore(0);
    setCompletedResult(null);
    setFeedbackMessage("");
    setSessionStartedAt(Date.now());
  }, []);

  /*
   * ---------------------------------------------------------
   * PREVIEW
   * ---------------------------------------------------------
   */

  useEffect(() => {
    if (phase !== "preview") {
      return;
    }

    if (previewIndex >= activeRoutine.length) {
      const timer = window.setTimeout(() => {
        setPhase("challenge");
        setChallengeStartedAt(Date.now());
      }, 700);

      return () => window.clearTimeout(timer);
    }

    const timer = window.setTimeout(() => {
      setPreviewIndex((index) => index + 1);
    }, PREVIEW_TIME);

    return () => window.clearTimeout(timer);
  }, [phase, previewIndex, activeRoutine.length]);

  /*
   * ---------------------------------------------------------
   * CURRENT CHALLENGE
   * ---------------------------------------------------------
   */

  useEffect(() => {
    if (phase !== "challenge") {
      return;
    }

    setChallengeStartedAt(Date.now());
  }, [currentChallengeIndex, phase]);

  /*
   * ---------------------------------------------------------
   * SELECT ANSWER
   * ---------------------------------------------------------
   */

  const handleSelect = useCallback(
    (option: ChallengeOption) => {
      if (phase !== "challenge" || !currentChallenge) {
        return;
      }

      setFeedbackMessage("");

      if (
        currentChallenge.type === "sequence" ||
        currentChallenge.type === "rebuild"
      ) {
        setSelectedIds((previous) => {
          if (previous.includes(option.id)) {
            return previous.filter(
              (id) => id !== option.id
            );
          }

          return [...previous, option.id];
        });

        return;
      }

      setSelectedIds((previous) =>
        previous.includes(option.id) ? [] : [option.id]
      );
    },
    [phase, currentChallenge]
  );

  /*
   * ---------------------------------------------------------
   * HINT
   * ---------------------------------------------------------
   */

  const handleHint = useCallback(() => {
    if (phase !== "challenge" || hintUsed) {
      return;
    }

    setHintUsed(true);

    if (!currentChallenge) {
      return;
    }

    if (
      currentChallenge.type === "sequence" ||
      currentChallenge.type === "rebuild"
    ) {
      const nextCorrect =
        currentChallenge.targetIds[selectedIds.length];

      const step = activeRoutine.find(
        (item) => item.id === nextCorrect
      );

      if (step) {
        setFeedbackMessage(
          `Think about what happened around "${step.label}".`
        );
      }

      return;
    }

    if (currentChallenge.correctAnswer) {
      const correctOption =
        currentChallenge.options.find(
          (option) =>
            option.id === currentChallenge.correctAnswer
        );

      if (correctOption) {
        setFeedbackMessage(
          `Think about ${correctOption.emoji} ${correctOption.label}.`
        );
      }
    }
  }, [
    phase,
    hintUsed,
    currentChallenge,
    selectedIds,
    activeRoutine,
  ]);

  /*
   * ---------------------------------------------------------
   * CHECK ANSWER
   * ---------------------------------------------------------
   */

  const handleCheck = useCallback(() => {
    if (!currentChallenge) {
      return;
    }

    if (selectedIds.length === 0) {
      setFeedbackMessage(
        "Take your time. Choose an answer first."
      );
      return;
    }

    const attempts = currentAttempts + 1;

    let correct = false;

    if (
      currentChallenge.type === "sequence" ||
      currentChallenge.type === "rebuild"
    ) {
      const expected = currentChallenge.targetIds;

      correct =
        selectedIds.length === expected.length &&
        selectedIds.every(
          (id, index) => id === expected[index]
        );
    } else {
      correct =
        selectedIds.length === 1 &&
        selectedIds[0] ===
          currentChallenge.correctAnswer;
    }

    const responseTime = challengeStartedAt
      ? Math.round(
          (Date.now() - challengeStartedAt) / 1000
        )
      : 0;

    if (!correct) {
      setCurrentAttempts(attempts);

      setFeedbackMessage(
        attempts === 1
          ? "Almost! Think about the morning again and try once more."
          : "That's okay. Take another look and try again."
      );

      return;
    }

    const baseScore = 100;

    const wrongAttemptPenalty =
      Math.max(0, attempts - 1) * 10;

    const hintPenalty = hintUsed ? 5 : 0;

    const challengeScore = Math.max(
      10,
      baseScore -
        wrongAttemptPenalty -
        hintPenalty
    );

    const result: ChallengeResult = {
      challengeId: currentChallenge.id,
      type: currentChallenge.type,
      correct: true,
      attempts,
      hintsUsed: hintUsed ? 1 : 0,
      responseTime,
      score: challengeScore,
      timestamp: new Date().toISOString(),
    };

    const updatedResults = [
      ...challengeResults,
      result,
    ];

    setChallengeResults(updatedResults);

    setSessionScore(
      (previous) => previous + challengeScore
    );

    setRewardStars(
      attempts === 1 && !hintUsed ? 3 : 2
    );

    setRewardMessage(
      attempts === 1 && !hintUsed
        ? "Amazing memory!"
        : "Well remembered!"
    );

    setPhase("reward");
  }, [
    currentChallenge,
    selectedIds,
    currentAttempts,
    challengeStartedAt,
    hintUsed,
    challengeResults,
  ]);

  /*
   * ---------------------------------------------------------
   * NEXT CHALLENGE
   * ---------------------------------------------------------
   */

  const continueAfterReward = useCallback(() => {
    const nextIndex = currentChallengeIndex + 1;

    // play a short page-flip animation between levels to mimic a memory book page turn
    setPageFlip(true);

    setTimeout(() => {
      setPageFlip(false);

      if (nextIndex >= challenges.length) {
      const totalAttempts =
        challengeResults.reduce(
          (total, item) => total + item.attempts,
          0
        );

      const correctCount =
        challengeResults.filter(
          (item) => item.correct
        ).length;

      const totalResponseTime =
        challengeResults.reduce(
          (total, item) =>
            total + item.responseTime,
          0
        );

      const totalHints =
        challengeResults.reduce(
          (total, item) =>
            total + item.hintsUsed,
          0
        );

      const accuracy =
        challenges.length > 0
          ? Math.round(
              (correctCount /
                challenges.length) *
                100
            )
          : 0;

      const responseTime =
        totalResponseTime > 0
          ? totalResponseTime
          : sessionStartedAt
            ? Math.round(
                (Date.now() - sessionStartedAt) /
                  1000
              )
            : 0;

      const finalResult: RoutineGameResult = {
        patientId,
        gameId: "routine-ordering",
        score: sessionScore,
        accuracy,
        attempts: totalAttempts,
        responseTime,
        difficulty,
        hintsUsed: totalHints,
        completed: true,
        timestamp: new Date().toISOString(),
        challenges: challengeResults,
      };

      setCompletedResult(finalResult);
      setPhase("complete");

        onComplete?.(finalResult);

        return;
      }

      setCurrentChallengeIndex(nextIndex);
      setSelectedIds([]);
      setHintUsed(false);
      setCurrentAttempts(0);
      setFeedbackMessage("");
      setPhase("challenge");
    }, 600);
  }, [
    currentChallengeIndex,
    challenges.length,
    challengeResults,
    sessionScore,
    sessionStartedAt,
    patientId,
    difficulty,
    onComplete,
  ]);

  /*
   * ---------------------------------------------------------
   * RETRY / RESET
   * ---------------------------------------------------------
   */

  const restartGame = useCallback(() => {
    setPhase("intro");
    setPreviewIndex(0);
    setCurrentChallengeIndex(0);
    setSelectedIds([]);
    setHintUsed(false);
    setCurrentAttempts(0);
    setChallengeStartedAt(null);
    setSessionStartedAt(null);
    setChallengeResults([]);
    setSessionScore(0);
    setRewardStars(1);
    setRewardMessage(
      "Wonderful! You remembered it."
    );
    setFeedbackMessage("");
    setCompletedResult(null);
  }, []);

  /*
   * ---------------------------------------------------------
   * MEMORY WORLD SELECTION
   * ---------------------------------------------------------
   */

  const worldTargetId =
    currentChallenge?.targetStepId;

  const worldSelectedIds =
    phase === "preview"
      ? activeRoutine
          .slice(0, previewIndex)
          .map((item) => item.id)
      : selectedIds;

  /*
   * ---------------------------------------------------------
   * INTRO
   * ---------------------------------------------------------
   */

  if (phase === "intro") {
    return (
      <div className={`memory-page level-${level} ${pageFlip ? "page-flip" : ""}`}>
          <main className="page memory-book min-h-screen bg-gradient-to-b from-amber-50 via-orange-50 to-sky-50 px-4 py-8">
        <div className="mx-auto flex min-h-[90vh] max-w-5xl items-center justify-center">
          <section className="w-full overflow-hidden rounded-[2rem] border border-white bg-white/90 shadow-2xl backdrop-blur">
            <div className="grid min-h-[620px] md:grid-cols-2">
              <div className="flex flex-col justify-center p-8 md:p-12">
                <div className="mb-4 text-sm font-bold uppercase tracking-[0.2em] text-orange-500">
                  SMARIKA · MEMORY JOURNEY
                </div>

                <h1 className="text-4xl font-black leading-tight text-slate-900 md:text-5xl">
                  {routine.length > 0
                    ? `${routine.length} little moments`
                    : "Your morning"}
                </h1>

                <p className="mt-5 max-w-md text-lg leading-8 text-slate-600">
                  Let's take a gentle journey through
                  your morning. Watch carefully, remember
                  the little moments, and help your
                  companion remember them too.
                </p>

                <div className="mt-8 grid grid-cols-2 gap-3">
                  <MiniFeature
                    icon="👀"
                    title="Look"
                    text="Watch the morning unfold"
                  />

                  <MiniFeature
                    icon="🧠"
                    title="Remember"
                    text="Recall familiar moments"
                  />

                  <MiniFeature
                    icon="🎮"
                    title="Play"
                    text="Complete gentle challenges"
                  />

                  <MiniFeature
                    icon="🌸"
                    title="Grow"
                    text="Earn Memory Garden stars"
                  />
                </div>

                <button
                  type="button"
                  onClick={startJourney}
                  className="mt-9 w-full rounded-2xl bg-amber-600 px-7 py-5 text-lg font-black text-black shadow-lg transition hover:-translate-y-0.5 hover:shadow-xl active:translate-y-0"
                >
                  Start My Memory Journey →
                </button>
              </div>

              <div className="relative flex min-h-[400px] items-center justify-center overflow-hidden bg-gradient-to-br from-sky-100 via-amber-50 to-orange-100">
                <div className="absolute right-10 top-10 h-24 w-24 rounded-full bg-yellow-300 shadow-lg" />

                <div className="absolute bottom-0 left-0 right-0 h-28 bg-emerald-100" />

                <div className="relative z-10 flex flex-col items-center">
                  <div className="mb-8 rounded-3xl border-4 border-white bg-white/80 px-7 py-4 text-center shadow-xl">
                    <div className="text-xs font-black uppercase tracking-widest text-orange-500">
                      Today's journey
                    </div>

                    <div className="mt-1 text-2xl font-black text-slate-900">
                      My Morning
                    </div>
                  </div>

                  <div className="text-[100px] leading-none drop-shadow-xl">
                    🧓
                  </div>

                  <div className="mt-5 rounded-full bg-white px-6 py-3 font-bold text-slate-700 shadow-lg">
                    Ready when you are ❤️
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>
      </main>
      </div>
    );
  }

  /*
   * ---------------------------------------------------------
   * PREVIEW
   * ---------------------------------------------------------
   */

  if (phase === "preview") {
    const currentPreviewStep =
      activeRoutine[previewIndex];

    return (
      <div className={`memory-page level-${level} ${pageFlip ? "page-flip" : ""}`}>
          <main className="page memory-book min-h-screen bg-gradient-to-b from-amber-50 via-orange-50 to-sky-50 px-4 py-6">
        <div className="mx-auto max-w-6xl">
          <TopBar
            score={sessionScore}
            stars={0}
            challenge={0}
            total={challenges.length}
          />

          <div className="mb-5 rounded-2xl border border-white bg-white/90 px-5 py-4 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-xs font-black uppercase tracking-widest text-orange-500">
                  Watch carefully
                </div>

                <div className="mt-1 text-lg font-black text-slate-900">
                  Your morning is unfolding...
                </div>
              </div>

              <div className="rounded-full bg-orange-50 px-4 py-2 text-sm font-bold text-orange-600">
                {Math.min(
                  previewIndex + 1,
                  activeRoutine.length
                )}{" "}
                / {activeRoutine.length}
              </div>
            </div>
          </div>

          <RoutineWorld
            routine={activeRoutine}
            selectedIds={worldSelectedIds}
            targetId={
              currentPreviewStep?.id
            }
            onSelect={() => {}}
            disabled
            showMemoryTrail
          />

          {currentPreviewStep && (
            <div className="mx-auto mt-5 max-w-2xl rounded-3xl border border-white bg-white p-6 text-center shadow-xl">
              <div className="text-5xl">
                <RoutineIcon value={currentPreviewStep.emoji} alt={currentPreviewStep.label} className="mx-auto h-16 w-16 rounded-2xl" />
              </div>

              <h2 className="mt-3 text-2xl font-black text-slate-900">
                {currentPreviewStep.label}
              </h2>

              <p className="mt-1 text-slate-500">
                {currentPreviewStep.description}
              </p>

              <div className="mt-3 inline-flex rounded-full bg-slate-100 px-4 py-2 text-sm font-bold text-slate-600">
                📍 {currentPreviewStep.location}
              </div>
            </div>
          )}

          {!currentPreviewStep && (
            <div className="mx-auto mt-5 max-w-xl rounded-3xl bg-white p-8 text-center shadow-xl">
              <div className="text-5xl">🧠</div>

              <h2 className="mt-3 text-2xl font-black text-slate-900">
                Remember that journey!
              </h2>

              <p className="mt-2 text-slate-500">
                Your first memory challenge is coming up.
              </p>
            </div>
          )}
        </div>
      </main>
      </div>
    );
  }

  /*
   * ---------------------------------------------------------
   * REWARD
   * ---------------------------------------------------------
   */

  if (phase === "reward") {
    return (
      <div className={`memory-page level-${level} ${pageFlip ? "page-flip" : ""}`}>
        <main className="page memory-book min-h-screen bg-gradient-to-b from-amber-50 via-orange-50 to-sky-50 px-4 py-8">
          <div className="mx-auto flex min-h-[85vh] max-w-4xl items-center justify-center">
          <div className="relative w-full">
            <RewardBurst
              visible
              stars={rewardStars}
              message={rewardMessage}
            />

            <div className="mx-auto mt-10 max-w-lg rounded-[2rem] border border-white bg-white p-8 text-center shadow-2xl">
              <div className="text-7xl">
                {rewardStars === 3
                  ? "🌟"
                  : "⭐"}
              </div>

              <div className="mt-4 text-sm font-black uppercase tracking-[0.2em] text-orange-500">
                Memory unlocked
              </div>

              <h2 className="mt-2 text-3xl font-black text-slate-900">
                {rewardMessage}
              </h2>

              <p className="mt-3 text-slate-500">
                Every remembered moment helps strengthen
                your personal memory journey.
              </p>

              <div className="mt-6 flex items-center justify-center gap-2">
                {Array.from(
                  { length: rewardStars },
                  (_, index) => (
                    <span
                      key={index}
                      className="text-4xl"
                    >
                      ⭐
                    </span>
                  )
                )}
              </div>

              <button
                type="button"
                onClick={continueAfterReward}
                className="mt-8 w-full rounded-2xl bg-amber-600 px-6 py-4 font-black text-black shadow-lg transition hover:-translate-y-0.5"
              >
                Continue Journey →
              </button>
            </div>
          </div>
        </div>
      </main>
      </div>
    );
  }

  /*
   * ---------------------------------------------------------
   * COMPLETE
   * ---------------------------------------------------------
   */

  if (phase === "complete") {
    const accuracy =
      completedResult?.accuracy ?? 0;

    const gardenFlowers =
      Math.max(
        1,
        Math.min(
          5,
          Math.round(accuracy / 20)
        )
      );

    return (
      <div className={`memory-page level-${level} ${pageFlip ? "page-flip" : ""}`}>
        <main className="page memory-book min-h-screen bg-gradient-to-b from-emerald-50 via-amber-50 to-orange-50 px-4 py-8">
        <div className="mx-auto max-w-5xl">
          <div className="rounded-[2rem] border border-white bg-white/90 p-7 shadow-2xl md:p-10">
            <div className="text-center">
              <div className="text-sm font-black uppercase tracking-[0.2em] text-orange-500">
                MEMORY JOURNEY COMPLETE
              </div>

              <h1 className="mt-3 text-4xl font-black text-slate-900">
                You remembered your morning! 🌸
              </h1>

              <p className="mx-auto mt-3 max-w-xl text-slate-500">
                Wonderful work. Your Memory Garden has
                grown a little more today.
              </p>
            </div>

            <div className="mx-auto mt-8 max-w-2xl rounded-[2rem] bg-gradient-to-b from-sky-100 to-emerald-100 p-8 text-center">
              <div className="text-7xl">
                🏡
              </div>

              <div className="mt-4 text-5xl tracking-widest">
                {"🌸".repeat(gardenFlowers)}
              </div>

              <div className="mt-5 text-sm font-black uppercase tracking-widest text-emerald-600">
                Memory Garden
              </div>
            </div>

            <div className="mt-8 grid gap-4 md:grid-cols-4">
              <StatCard
                icon="⭐"
                label="Score"
                value={String(
                  completedResult?.score ?? 0
                )}
              />

              <StatCard
                icon="🧠"
                label="Accuracy"
                value={`${accuracy}%`}
              />

              <StatCard
                icon="🎯"
                label="Challenges"
                value={`${challengeResults.length}/${challenges.length}`}
              />

              <StatCard
                icon="💡"
                label="Hints"
                value={String(
                  completedResult?.hintsUsed ?? 0
                )}
              />
            </div>

            <button
              type="button"
              onClick={restartGame}
              className="mx-auto mt-8 block rounded-2xl bg-amber-600 px-8 py-4 font-black text-black shadow-lg transition hover:-translate-y-0.5"
            >
              Play Again
            </button>
          </div>
        </div>
      </main>
      </div>
    );
  }

  /*
   * ---------------------------------------------------------
   * CHALLENGE
   * ---------------------------------------------------------
   */

  return (
    <div className={`memory-page level-${level} ${pageFlip ? "page-flip" : ""}`}>
      <main className="page memory-book min-h-screen bg-gradient-to-b from-amber-50 via-orange-50 to-sky-50 px-4 py-5">
      <div className="mx-auto max-w-6xl">
        <TopBar
          score={sessionScore}
          stars={challengeResults.reduce(
            (total, item) =>
              total +
              (item.attempts === 1 &&
              item.hintsUsed === 0
                ? 3
                : 2),
            0
          )}
          challenge={currentChallengeIndex + 1}
          total={challenges.length}
        />

        <div className="mb-5 mt-5">
          <RoutineWorld
            routine={activeRoutine}
            selectedIds={worldSelectedIds}
            targetId={worldTargetId}
            onSelect={handleSelect}
            disabled={false}
            showMemoryTrail
          />
        </div>

        <div className="mx-auto max-w-4xl">
          <ChallengeCard
            challenge={currentChallenge}
            selectedIds={selectedIds}
            onSelect={handleSelect}
            onCheck={handleCheck}
            onHint={handleHint}
            disabled={false}
            hintUsed={hintUsed}
          />

          {feedbackMessage && (
            <div className="mt-4 rounded-2xl border border-amber-200 bg-amber-50 px-5 py-4 text-center font-bold text-amber-800 shadow-sm">
              💭 {feedbackMessage}
            </div>
          )}

          {currentAttempts > 0 && (
            <div className="mt-3 text-center text-sm font-semibold text-slate-400">
              Attempts: {currentAttempts}
            </div>
          )}
        </div>
      </div>
    </main>
    </div>
  );
}

/*
 * =========================================================
 * SMALL UI COMPONENTS
 * =========================================================
 */

function TopBar({
  score,
  stars,
  challenge,
  total,
}: {
  score: number;
  stars: number;
  challenge: number;
  total: number;
}) {
  return (
    <header className="flex items-center justify-between gap-3">
      <div>
        <div className="text-[10px] font-black uppercase tracking-[0.25em] text-orange-500">
          SMARIKA · MEMORY JOURNEY
        </div>

        <h1 className="mt-1 text-2xl font-black text-slate-900">
          🌅 My Morning
        </h1>
      </div>

      <div className="flex items-center gap-2">
        <div className="rounded-full border border-white bg-white px-4 py-2 text-sm font-black text-slate-800 shadow-sm">
          ⭐ {score}
        </div>

        <div className="hidden rounded-full border border-white bg-white px-4 py-2 text-sm font-black text-slate-800 shadow-sm sm:block">
          🌟 {stars}
        </div>
      </div>

      {total > 0 && (
        <div className="absolute left-1/2 hidden -translate-x-1/2 rounded-full border border-white bg-white px-4 py-2 text-xs font-black text-slate-500 shadow-sm md:block">
          Memory Challenge {challenge} / {total}
        </div>
      )}
    </header>
  );
}

function MiniFeature({
  icon,
  title,
  text,
}: {
  icon: string;
  title: string;
  text: string;
}) {
  return (
    <div className="rounded-2xl border border-slate-100 bg-slate-50 p-4">
      <div className="text-2xl">{icon}</div>

      <div className="mt-2 font-black text-slate-900">
        {title}
      </div>

      <div className="mt-1 text-xs leading-5 text-slate-500">
        {text}
      </div>
    </div>
  );
}

function StatCard({
  icon,
  label,
  value,
}: {
  icon: string;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-2xl border border-slate-100 bg-slate-50 p-5 text-center">
      <div className="text-3xl">{icon}</div>

      <div className="mt-2 text-xs font-black uppercase tracking-wider text-slate-400">
        {label}
      </div>

      <div className="mt-1 text-2xl font-black text-slate-900">
        {value}
      </div>
    </div>
  );
}