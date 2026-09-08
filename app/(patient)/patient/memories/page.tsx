"use client";

import { useMemories } from "@/lib/hooks/use-memories";
import { VoiceButton } from "@/features/shared/components/voice-button";
import { Heart } from "lucide-react";

export default function PatientMemoriesPage() {
  const { data: memories } = useMemories();

  return (
    <div className="space-y-8 text-center max-w-2xl mx-auto py-4">
      <div>
        <h1 className="text-3xl font-black text-slate-900 tracking-tight flex items-center justify-center gap-2">
          <Heart className="w-8 h-8 text-rose-500" />
          <span>My Favorite Memories</span>
        </h1>
        <p className="text-base text-slate-600 font-semibold mt-1">
          Special moments with family and loved ones.
        </p>
      </div>

      <div className="flex justify-center">
        <VoiceButton textToSpeak="Here are your special family memories and trip photos." />
      </div>

      <div className="space-y-6">
        {memories?.map((mem) => (
          <div
            key={mem.id}
            className="bg-white rounded-3xl border-2 border-rose-200 shadow-xl overflow-hidden text-left"
          >
            {mem.imageUrl && (
              <img
                src={mem.imageUrl}
                alt={mem.title}
                className="w-full h-64 object-cover"
              />
            )}
            <div className="p-6 space-y-2">
              <h2 className="text-2xl font-black text-slate-900">{mem.title}</h2>
              <p className="text-sm font-semibold text-slate-600 leading-relaxed">
                {mem.description}
              </p>
              {mem.people && mem.people.length > 0 && (
                <div className="pt-2 text-xs font-bold text-rose-700 bg-rose-50 px-3 py-1 rounded-full border border-rose-200 inline-block">
                  With {mem.people.join(" & ")}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
