"use client";

import {
  Challenge,
  ChallengeOption,
} from "./types";

type ChallengeCardProps = {
  challenge: Challenge;

  selectedIds: string[];

  onSelect: (option: ChallengeOption) => void;

  onCheck: () => void;

  onHint: () => void;

  disabled?: boolean;

  hintUsed?: boolean;
};

export default function ChallengeCard({
  challenge,
  selectedIds,
  onSelect,
  onCheck,
  onHint,
  disabled = false,
  hintUsed = false,
}: ChallengeCardProps) {

  const isRebuild =
    challenge.type === "rebuild";

  return (
    <section className="mx-auto mt-6 max-w-5xl rounded-[2rem] border border-white bg-white/95 p-6 shadow-2xl backdrop-blur sm:p-8">

      {/* HEADER */}

      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">

        <div>

          <div className="text-xs font-black uppercase tracking-[0.25em] text-orange-500">
            Memory Challenge
          </div>

          <h2 className="mt-2 text-2xl font-black text-slate-900 sm:text-3xl">
            {challenge.prompt}
          </h2>

          <p className="mt-2 text-slate-500">
            {challenge.subtitle}
          </p>

        </div>

        <button
          type="button"
          onClick={onHint}
          disabled={disabled || hintUsed}
          className="rounded-2xl bg-amber-50 px-5 py-3 font-black text-amber-700 transition hover:bg-amber-100 disabled:opacity-40"
        >
          💡 {hintUsed ? "Hint Used" : "Hint"}
        </button>

      </div>

      {/* SEQUENCE / REBUILD */}

      {(challenge.type === "sequence" ||
        isRebuild) && (
        <div className="mt-7">

          <div className="mb-3 text-sm font-bold text-slate-400">
            Your memory path
          </div>

          <div className="min-h-28 rounded-3xl border-2 border-dashed border-slate-200 bg-slate-50 p-4">

            {selectedIds.length === 0 ? (
              <div className="flex h-20 items-center justify-center text-slate-400">
                Start building the morning...
              </div>
            ) : (
              <div className="flex flex-wrap gap-3">

                {selectedIds.map(
                  (id, index) => {

                    const option =
                      challenge.options.find(
                        (item) =>
                          item.id === id
                      );

                    if (!option) return null;

                    return (
                      <div
                        key={id}
                        className="animate-[pop-in_0.25s_ease-out] rounded-2xl bg-white px-4 py-3 shadow-md"
                      >
                        <span className="mr-2 text-slate-300">
                          {index + 1}
                        </span>

                        <span className="mr-2 text-2xl">
                          {option.emoji}
                        </span>

                        <span className="font-bold">
                          {option.label}
                        </span>
                      </div>
                    );
                  }
                )}

              </div>
            )}

          </div>

        </div>
      )}

      {/* MISSING / BEFORE / LOCATION */}

      {challenge.type !== "sequence" &&
        challenge.type !== "rebuild" && (
          <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2">

            {challenge.options.map(
              (option) => {

                const selected =
                  selectedIds.includes(
                    option.id
                  );

                return (
                  <button
                    key={option.id}
                    type="button"
                    disabled={disabled}
                    onClick={() =>
                      onSelect(option)
                    }
                    className={`group flex min-h-28 items-center gap-5 rounded-3xl border-2 p-5 text-left transition-all duration-200

                      ${
                        selected
                          ? "border-orange-400 bg-orange-50 shadow-lg"
                          : "border-slate-100 bg-white hover:-translate-y-1 hover:border-orange-200 hover:shadow-xl"
                      }
                    `}
                  >

                    <span className="text-5xl transition-transform group-hover:scale-110">
                      {option.emoji}
                    </span>

                    <span>
                      <span className="block text-lg font-black text-slate-900">
                        {option.label}
                      </span>

                      {challenge.type ===
                        "location" && (
                        <span className="text-sm text-slate-400">
                          Choose this place
                        </span>
                      )}
                    </span>

                  </button>
                );
              }
            )}

          </div>
        )}

      {/* OPTIONS */}

      {(challenge.type === "sequence" ||
        challenge.type === "rebuild") && (

        <div className="mt-7 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">

          {challenge.options.map(
            (option) => {

              const selected =
                selectedIds.includes(
                  option.id
                );

              return (
                <button
                  key={option.id}
                  type="button"
                  disabled={disabled || selected}
                  onClick={() =>
                    onSelect(option)
                  }
                  className={`flex min-h-32 flex-col items-center justify-center rounded-3xl border-2 p-4 transition-all

                    ${
                      selected
                        ? "scale-95 border-emerald-300 bg-emerald-50 opacity-50"
                        : "border-slate-100 bg-white hover:-translate-y-2 hover:border-orange-200 hover:shadow-xl"
                    }
                  `}
                >

                  <span className="text-5xl">
                    {selected
                      ? "✓"
                      : option.emoji}
                  </span>

                  <span className="mt-3 text-center text-sm font-black text-slate-700">
                    {option.label}
                  </span>

                </button>
              );
            }
          )}

        </div>
      )}

      {/* CHECK */}

      <button
        type="button"
        onClick={onCheck}
        disabled={
          disabled ||
          selectedIds.length === 0
        }
        className="mt-8 w-full rounded-2xl bg-slate-900 px-6 py-5 text-xl font-black text-white shadow-xl transition hover:-translate-y-1 hover:shadow-2xl disabled:cursor-not-allowed disabled:opacity-30"
      >
        Check My Memory →
      </button>

    </section>
  );
}