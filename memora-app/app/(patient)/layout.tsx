import { ReactNode } from "react";
import Link from "next/link";
import { ArrowLeft, ShieldCheck } from "lucide-react";

export default function PatientLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50/70 via-orange-50/50 to-sky-50/70 text-slate-900 flex flex-col justify-between selection:bg-amber-200">
      {/* Top minimal bar with simple back button if needed */}
      <header className="px-4 py-3 flex items-center justify-between max-w-4xl w-full mx-auto">
        <Link
          href="/patient/home"
          className="inline-flex items-center gap-2 text-slate-600 hover:text-slate-900 text-sm font-extrabold bg-white/80 backdrop-blur-xs px-3.5 py-1.5 rounded-full border border-slate-200 shadow-xs"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Home</span>
        </Link>

        {/* Subtle caregiver switch - hidden behind a discrete button */}
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
        Memora • Friendly Companion Mode
      </footer>
    </div>
  );
}
