"use client";

import { Menu, Bell, User, Smartphone } from "lucide-react";
import Link from "next/link";
import { useAppStore } from "@/lib/stores/app-store";
import { getGreeting } from "@/lib/utils";

export function CaregiverHeader() {
  const { caregiver, patient, toggleSidebar } = useAppStore();
  const greeting = getGreeting();

  return (
    <header className="sticky top-0 z-30 bg-white/80 backdrop-blur-md border-b border-slate-200 px-4 md:px-8 py-4 flex items-center justify-between shadow-xs">
      <div className="flex items-center gap-4">
        <button
          onClick={toggleSidebar}
          className="md:hidden text-slate-600 hover:text-slate-900 p-1 rounded-lg hover:bg-slate-100"
          aria-label="Toggle Navigation"
        >
          <Menu className="w-6 h-6" />
        </button>

        <div>
          <h1 className="text-xl md:text-2xl font-black text-slate-900 tracking-tight">
            {greeting}, {caregiver?.name || "Caregiver"}
          </h1>
          <div className="flex items-center gap-2 mt-0.5">
            <span className="text-xs text-slate-500 font-medium">Patient:</span>
            <span className="text-xs font-bold text-slate-800">{patient?.name || "Meena Sharma"}</span>
            <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
              Active
            </span>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <Link
          href="/patient/home"
          className="hidden sm:flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs uppercase tracking-wider rounded-xl shadow-md transition-all active:scale-95"
        >
          <Smartphone className="w-4 h-4" />
          <span>Patient Mode</span>
        </Link>

        <div className="w-10 h-10 rounded-full bg-sky-100 border border-sky-200 flex items-center justify-center text-sky-800 font-bold text-sm shadow-xs">
          {caregiver?.name?.[0] || "A"}
        </div>
      </div>
    </header>
  );
}
