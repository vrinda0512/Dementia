"use client";

import { Menu, Smartphone, ChevronDown } from "lucide-react";
import Link from "next/link";
import { useAppStore } from "@/lib/stores/app-store";
import { useCaregiverPatients } from "@/lib/hooks/use-patient";
import { getGreeting } from "@/lib/utils";
import { DEFAULT_CAREGIVER_ID } from "@/lib/supabase/config";

export function CaregiverHeader() {
  const { caregiver, patient, patients, selectPatient, setSidebarOpen } = useAppStore();
  const caregiverId = caregiver?.id || DEFAULT_CAREGIVER_ID;
  useCaregiverPatients(caregiverId);
  const greeting = getGreeting();

  const list = patients.length > 0 ? patients : patient ? [patient] : [];

  return (
    <header className="sticky top-0 z-30 bg-white/90 backdrop-blur-md border-b border-slate-200 px-4 md:px-8 py-3.5 flex items-center justify-between shadow-xs">
      <div className="flex items-center gap-3 md:gap-4 min-w-0">
        <button
          type="button"
          onClick={() => setSidebarOpen(true)}
          className="md:hidden text-slate-700 hover:text-slate-900 active:bg-slate-200 p-2.5 rounded-xl border border-slate-200 bg-slate-50 transition-all cursor-pointer touch-manipulation flex items-center justify-center active:scale-95 shadow-xs"
          aria-label="Open Navigation Sidebar"
        >
          <Menu className="w-6 h-6 text-slate-800" />
        </button>

        <div className="min-w-0">
          <h1 className="text-lg md:text-2xl font-black text-slate-900 tracking-tight truncate">
            {greeting}, {caregiver?.name || "Caregiver"}
          </h1>
          <div className="flex items-center gap-2 mt-0.5 flex-wrap">
            <span className="text-xs text-slate-500 font-medium hidden sm:inline">Patient:</span>
            {list.length > 1 ? (
              <div className="relative">
                <select
                  value={patient?.id || ""}
                  onChange={(e) => selectPatient(e.target.value)}
                  className="appearance-none pl-2.5 pr-7 py-1 text-xs font-bold text-slate-800 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 cursor-pointer max-w-[200px]"
                  aria-label="Select patient"
                >
                  {list.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name}
                    </option>
                  ))}
                </select>
                <ChevronDown className="w-3.5 h-3.5 text-slate-500 absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
            ) : (
              <span className="text-xs font-bold text-slate-800">
                {patient?.name || "No patient selected"}
              </span>
            )}
            <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
              Active
            </span>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-3 shrink-0">
        <Link
          href="/patient/home"
          className="hidden sm:flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs uppercase tracking-wider rounded-xl shadow-md transition-all active:scale-95"
        >
          <Smartphone className="w-4 h-4" />
          <span>Patient Mode</span>
        </Link>

        <div className="w-10 h-10 rounded-full bg-sky-100 border border-sky-200 flex items-center justify-center text-sky-800 font-bold text-sm shadow-xs">
          {caregiver?.name?.[0] || "C"}
        </div>
      </div>
    </header>
  );
}
