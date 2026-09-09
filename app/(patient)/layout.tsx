"use client";

import { ReactNode } from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { usePathname } from "next/navigation";

export default function PatientLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();

  /* Game pages (anything under /patient/games/<slug>) render full-viewport
     so each game can own its own layout, background, and responsive behaviour.
     Non-game pages (home, memories, routine, game-selection list) keep the
     cozy constrained container. */
  const isGamePage =
    /^\/patient\/games\/[^/]+/.test(pathname);

  if (isGamePage) {
    return (
      <div className="min-h-screen flex flex-col">
        {/* Minimal floating nav overlay for game pages */}
        <header className="absolute top-0 left-0 right-0 z-50 px-4 py-3 flex items-center justify-between pointer-events-none">
          <Link
            href="/patient/games"
            className="pointer-events-auto inline-flex items-center gap-2 text-slate-600 hover:text-slate-900 text-sm font-extrabold bg-white/90 backdrop-blur-sm px-3.5 py-1.5 rounded-full border border-slate-200 shadow-md transition-all hover:bg-white"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Games</span>
          </Link>

          <Link
            href="/caregiver/dashboard"
            className="pointer-events-auto text-xs font-bold text-slate-400 hover:text-slate-600 bg-white/70 backdrop-blur-sm px-3 py-1 rounded-full border border-slate-200/50 transition-colors"
            title="Caregiver Portal"
          >
            Caregiver View
          </Link>
        </header>

        {/* Full-viewport game content */}
        <main className="flex-1">
          {children}
        </main>
      </div>
    );
  }

  /* Standard constrained layout for non-game patient pages */
  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50/70 via-orange-50/50 to-sky-50/70 text-slate-900 flex flex-col justify-between selection:bg-amber-200">
      <header className="px-4 py-3 flex items-center justify-between max-w-4xl w-full mx-auto">
        <Link
          href="/patient/home"
          className="inline-flex items-center gap-2 text-slate-600 hover:text-slate-900 text-sm font-extrabold bg-white/80 backdrop-blur-xs px-3.5 py-1.5 rounded-full border border-slate-200 shadow-xs"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Home</span>
        </Link>

        <Link
          href="/caregiver/dashboard"
          className="text-xs font-bold text-slate-400 hover:text-slate-600 bg-white/50 px-3 py-1 rounded-full border border-slate-200/50 transition-colors"
          title="Caregiver Portal"
        >
          Caregiver View
        </Link>
      </header>

      <main className="flex-1 max-w-4xl w-full mx-auto px-4 py-4 flex flex-col justify-center">
        {children}
      </main>

      <footer className="py-4 text-center text-xs font-semibold text-slate-400">
        Smarika • Friendly Companion Mode
      </footer>
    </div>
  );
}
