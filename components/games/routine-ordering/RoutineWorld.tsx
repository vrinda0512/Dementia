"use client";

import { useEffect, useState } from "react";
import { RoutineStep } from "./types";
import RoutineIcon from "./RoutineIcon";

type RoutineWorldProps = {
  routine: RoutineStep[];

  selectedIds: string[];

  targetId?: string;

  onSelect: (step: RoutineStep) => void;

  disabled?: boolean;

  showMemoryTrail?: boolean;
};

const positions: Record<string, string> = {
  "wake-up":
    "left-[8%] bottom-[27%]",

  "brush-teeth":
    "left-[31%] bottom-[29%]",

  tea:
    "right-[29%] bottom-[30%]",

  medicine:
    "right-[8%] bottom-[48%]",

  breakfast:
    "right-[14%] bottom-[8%]",
};

export default function RoutineWorld({
  routine,
  selectedIds,
  targetId,
  onSelect,
  disabled = false,
  showMemoryTrail = true,
}: RoutineWorldProps) {
  const [width, setWidth] = useState<number>(typeof window !== "undefined" ? window.innerWidth : 1200);

  useEffect(() => {
    const onResize = () => setWidth(window.innerWidth);
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  const isMobile = width <= 640;

  // Build the full illustrated world once so we can reuse for desktop and mobile scroll view
  const worldContent = (
    <div className="relative mx-auto aspect-[16/9] w-[1100px] overflow-hidden rounded-[2.5rem] border-8 border-white bg-[#f7ead8] shadow-2xl">

      {/* Sky */}
      <div className="absolute inset-0 bg-gradient-to-b from-sky-100 via-orange-50 to-amber-100" />

      {/* Sun */}
      <div className="absolute right-[7%] top-[7%] h-24 w-24 rounded-full bg-yellow-300 shadow-[0_0_80px_rgba(250,204,21,0.7)]" />

      {/* Wall */}
      <div className="absolute inset-x-0 top-[12%] h-[55%] bg-[#fff5e5]" />

      {/* Floor */}
      <div className="absolute inset-x-0 bottom-0 h-[34%] bg-[#b97a4b]" />

      {/* Floor lines */}
      <div className="absolute bottom-[24%] left-0 right-0 h-[2px] bg-black/10" />
      <div className="absolute bottom-[12%] left-0 right-0 h-[2px] bg-black/10" />

      {/* Mountain picture */}
      <div className="absolute left-[45%] top-[19%] flex h-24 w-32 items-center justify-center rounded-2xl border-8 border-[#8b5e3c] bg-sky-100 text-4xl shadow-lg">
        🏔️
      </div>

      {/* BED */}
      <div className="absolute bottom-[27%] left-[2%] h-[34%] w-[27%] rounded-t-[2rem] bg-[#dfbd94] shadow-xl">

        <div className="absolute left-[8%] top-[8%] h-[30%] w-[84%] rounded-t-3xl bg-[#8b5e3c]" />

        <div className="absolute bottom-[5%] left-[5%] h-[55%] w-[90%] rounded-3xl bg-white shadow-lg" />

        <div className="absolute bottom-[28%] left-[12%] h-[22%] w-[28%] rounded-xl bg-sky-100" />

        <div className="room-label absolute bottom-2 left-1/2 z-[60] -translate-x-1/2 rounded-full bg-white/90 px-3 py-1 shadow-md">
          BEDROOM
        </div>

      </div>

      {/* BATHROOM */}
      <div className="absolute bottom-[27%] left-[29%] h-[37%] w-[23%] rounded-t-3xl bg-[#d7eef2] shadow-inner">

        <div className="absolute left-[15%] top-[10%] flex h-[42%] w-[70%] items-center justify-center rounded-xl border-4 border-slate-300 bg-white text-3xl">
          ✨
        </div>

        <div className="absolute left-[28%] top-[38%] flex h-12 w-12 items-center justify-center rounded-full bg-[#dbeafe] text-2xl shadow-sm">
          🪥
        </div>

        <div className="absolute bottom-[8%] left-[18%] h-[25%] w-[64%] rounded-b-3xl bg-white shadow-lg" />

        <div className="room-label absolute bottom-2 left-1/2 z-[60] -translate-x-1/2 rounded-full bg-white/90 px-3 py-1 shadow-md">
          BATHROOM
        </div>

      </div>

      {/* KITCHEN */}
      <div className="absolute bottom-[27%] right-[1%] h-[45%] w-[43%] rounded-t-[2rem] bg-[#efd0a5] shadow-inner">

        <div className="absolute left-[8%] top-[10%] h-[38%] w-[34%] rounded-xl border-8 border-[#8b5e3c] bg-sky-200">
          🌳
        </div>

        <div className="absolute bottom-[8%] left-[6%] right-[6%] h-[20%] rounded-xl bg-[#93613f]" />

        <div className="absolute bottom-[32%] right-[10%] flex h-20 w-24 items-center justify-center rounded-xl bg-slate-700 text-3xl">
          🔥
        </div>

        <div className="room-label absolute bottom-2 left-1/2 z-[60] -translate-x-1/2 rounded-full bg-white/90 px-3 py-1 shadow-md">
          KITCHEN
        </div>

      </div>

      {/* TABLE */}
      <div className="absolute bottom-[2%] right-[8%] h-[23%] w-[29%]">

        <div className="absolute top-0 h-[30%] w-full rounded-3xl bg-[#865735] shadow-xl" />

        <div className="absolute bottom-0 left-[15%] h-[75%] w-[12%] bg-[#68432b]" />

        <div className="absolute bottom-0 right-[15%] h-[75%] w-[12%] bg-[#68432b]" />

      </div>

      {/* CHARACTER */}
      <div className="absolute bottom-[27%] left-[18%] z-20 animate-[character-bob_3s_ease-in-out_infinite]">

        <div className="relative flex flex-col items-center">

          <div className="flex h-16 w-16 items-center justify-center rounded-full border-4 border-white bg-pink-100 text-4xl shadow-xl">
            👵
          </div>

          <div className="h-16 w-14 rounded-t-3xl bg-purple-400 shadow-lg" />

          <div className="flex gap-3">
            <div className="h-8 w-3 rounded-full bg-slate-700" />
            <div className="h-8 w-3 rounded-full bg-slate-700" />
          </div>

        </div>

      </div>

      {/* OBJECTS */}
      {routine.map((step) => {

        const selected =
          selectedIds.includes(step.id);

        const isTarget =
          targetId === step.id;

        return (
          <button
            key={step.id}
            type="button"
            disabled={disabled}
            onClick={() => onSelect(step)}
            className={`absolute z-30 flex h-24 w-24 flex-col items-center justify-center rounded-3xl border-4 transition-all duration-300

              ${positions[step.id] ?? "left-1/2 top-1/2"}

              ${
                selected
                  ? "scale-90 border-emerald-400 bg-emerald-100/90 opacity-60"
                  : isTarget && showMemoryTrail
                    ? "animate-memory-pulse border-yellow-400 bg-yellow-100 shadow-[0_0_35px_rgba(250,204,21,0.8)]"
                    : "border-white bg-white/90 shadow-xl hover:scale-110 hover:-translate-y-2 animate-pop-in"
              }
            `}
          >

            <span className="text-4xl">
              {selected ? "✓" : <RoutineIcon value={step.emoji} alt={step.label} className="h-12 w-12 rounded-xl" />}
            </span>

            <span className="mt-1 text-[10px] font-black text-slate-700">
              {selected
                ? "Remembered"
                : step.label}
            </span>

          </button>
        );
      })}

      {/* Memory trail */}
      {selectedIds.length > 0 && (
        <div className="absolute left-5 top-5 z-40 flex max-w-[80%] gap-2 rounded-2xl bg-white/90 p-3 shadow-xl backdrop-blur">

          {selectedIds.map((id, index) => {

            const step =
              routine.find(
                (item) => item.id === id
              );

            return (
              <div
                key={id}
                className="animate-pop-in text-center"
              >
                <div className="text-2xl">
                  {step && <RoutineIcon value={step.emoji} alt={step.label} className="mx-auto h-8 w-8 rounded-lg" />}
                </div>

                <div className="text-[9px] font-black text-slate-500">
                  {index + 1}
                </div>
              </div>
            );
          })}

        </div>
      )}

    </div>
  );

  if (isMobile) {
    // show a horizontally scrollable scaled world so visuals remain intact on phones
    return (
      <div className="mx-auto w-full overflow-x-auto -mx-4 px-4 touch-pan-x">
        <div className="inline-block transform-gpu scale-75 origin-top-left">
          {worldContent}
        </div>
      </div>
    );
  }

  return worldContent;
}