"use client";

import RoutineCard from "./RoutineCard";
import { RoutineStep } from "./types";

type RoutineBoardProps = {
  steps: RoutineStep[];
  onSelect: (step: RoutineStep) => void;
};

export default function RoutineBoard({
  steps,
  onSelect,
}: RoutineBoardProps) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {steps.map((step, index) => (
        <RoutineCard
          key={step.id}
          step={step}
          index={index}
          onClick={() => onSelect(step)}
        />
      ))}
    </div>
  );
}