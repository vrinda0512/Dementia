"use client";

import { RoutineStep } from "./types";

type RoutineCardProps = {
  step: RoutineStep;
  index: number;
  onClick: () => void;
};

export default function RoutineCard({
  step,
  index,
  onClick,
}: RoutineCardProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={`Choose ${step.label}`}
      className="
        group
        relative
        min-h-[155px]
        w-full
        overflow-hidden
        rounded-[2rem]
        border-2
        border-white
        bg-white
        p-5
        text-left
        shadow-md
        ring-1
        ring-black/5
        transition-all
        duration-300
        hover:-translate-y-2
        hover:shadow-xl
        active:scale-[0.97]
      "
    >
      <div className="absolute right-0 top-0 h-24 w-24 rounded-full bg-sky-50 transition-transform duration-500 group-hover:scale-150" />

      <div className="relative flex h-full flex-col items-center justify-center">
        <div className="mb-3 flex h-20 w-20 items-center justify-center rounded-3xl bg-gradient-to-br from-amber-50 to-orange-100 text-5xl shadow-sm transition-transform duration-300 group-hover:scale-110 group-hover:rotate-2">
          {step.emoji}
        </div>

        <span className="text-center text-xl font-extrabold text-slate-800">
          {step.label}
        </span>

        <span className="mt-2 text-sm font-semibold text-slate-400">
          Tap to choose
        </span>
      </div>

      <div className="absolute bottom-3 left-4 text-xs font-bold text-slate-300">
        {index + 1}
      </div>
    </button>
  );
}