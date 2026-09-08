"use client";

type RewardBurstProps = {
  visible: boolean;
  stars: number;
  message: string;
};

export default function RewardBurst({
  visible,
  stars,
  message,
}: RewardBurstProps) {
  if (!visible) return null;

  return (
    <div className="pointer-events-none fixed inset-0 z-[100] flex items-center justify-center">

      {/* Confetti */}
      <div className="absolute inset-0 overflow-hidden">

        {Array.from({ length: 28 }).map(
          (_, index) => (
            <span
              key={index}
              className="absolute left-1/2 top-1/2 text-2xl animate-[confetti-fall_1.4s_ease-out_forwards]"
              style={{
                transform: `rotate(${index * 31}deg) translateY(-${120 + (index % 6) * 35}px)`,
              }}
            >
              {index % 3 === 0
                ? "⭐"
                : index % 3 === 1
                  ? "🌸"
                  : "✨"}
            </span>
          )
        )}

      </div>

      {/* Reward */}
      <div className="animate-[reward-pop_0.65s_cubic-bezier(.17,.67,.34,1.3)] rounded-[2.5rem] bg-white px-12 py-10 text-center shadow-[0_30px_100px_rgba(0,0,0,0.25)]">

        <div className="text-7xl">
          ⭐
        </div>

        <div className="mt-3 text-5xl font-black text-slate-900">
          +{stars}
        </div>

        <div className="mt-2 text-xl font-black text-emerald-600">
          {message}
        </div>

      </div>

    </div>
  );
}