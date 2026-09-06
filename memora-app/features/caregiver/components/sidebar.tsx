"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  User,
  Heart,
  Gamepad2,
  TrendingUp,
  Bell,
  Settings,
  HeartPulse,
  Smartphone,
  X,
} from "lucide-react";
import { useAppStore } from "@/lib/stores/app-store";

const navGroups = [
  {
    items: [
      { name: "Overview", href: "/caregiver/dashboard", icon: LayoutDashboard },
    ],
  },
  {
    title: "PATIENT",
    items: [
      { name: "Profile", href: "/caregiver/patient", icon: User },
      { name: "Memories", href: "/caregiver/memories", icon: Heart },
    ],
  },
  {
    title: "ACTIVITIES",
    items: [
      { name: "Games", href: "/caregiver/games", icon: Gamepad2 },
      { name: "Progress", href: "/caregiver/progress", icon: TrendingUp },
    ],
  },
  {
    title: "CARE",
    items: [
      { name: "Reminders", href: "/caregiver/reminders", icon: Bell },
    ],
  },
];

export function CaregiverSidebar() {
  const pathname = usePathname();
  const { isSidebarOpen, setSidebarOpen } = useAppStore();

  return (
    <>
      {/* Mobile Backdrop */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-slate-900/50 backdrop-blur-xs md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 w-64 bg-slate-900 text-slate-300 flex flex-col border-r border-slate-800 transition-transform duration-200 ease-in-out md:translate-x-0 ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Brand Header */}
        <div className="p-6 border-b border-slate-800 flex items-center justify-between">
          <Link href="/caregiver/dashboard" className="flex items-center gap-3 group">
            <div className="w-10 h-10 bg-gradient-to-tr from-sky-500 to-emerald-500 rounded-xl flex items-center justify-center shadow-lg shadow-sky-500/20 group-hover:scale-105 transition-transform">
              <HeartPulse className="w-6 h-6 text-white" />
            </div>
            <div>
              <span className="text-xl font-black text-white tracking-tight block">Memora</span>
              <span className="text-[10px] font-bold text-sky-400 uppercase tracking-widest block">Caregiver Mode</span>
            </div>
          </Link>

          <button
            onClick={() => setSidebarOpen(false)}
            className="md:hidden text-slate-400 hover:text-white p-1"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Items */}
        <div className="flex-1 overflow-y-auto p-4 space-y-6">
          {navGroups.map((group, groupIdx) => (
            <div key={groupIdx} className="space-y-1">
              {group.title && (
                <div className="px-3 text-[11px] font-extrabold text-slate-400 tracking-wider uppercase mb-2">
                  {group.title}
                </div>
              )}
              {group.items.map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setSidebarOpen(false)}
                    className={`flex items-center gap-3 px-3 py-2.5 rounded-xl font-medium text-sm transition-all ${
                      isActive
                        ? "bg-sky-600 text-white font-bold shadow-md shadow-sky-600/30"
                        : "text-slate-400 hover:bg-slate-800 hover:text-slate-200"
                    }`}
                  >
                    <Icon className={`w-5 h-5 ${isActive ? "text-white" : "text-slate-400"}`} />
                    <span>{item.name}</span>
                  </Link>
                );
              })}
            </div>
          ))}
        </div>

        {/* Patient Switch & Settings Footer */}
        <div className="p-4 border-t border-slate-800 space-y-2 bg-slate-950/50">
          <Link
            href="/patient/home"
            className="w-full flex items-center justify-center gap-2 px-3 py-2.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs uppercase tracking-wider rounded-xl shadow-md transition-all transform active:scale-95"
          >
            <Smartphone className="w-4 h-4" />
            <span>Switch to Patient Mode</span>
          </Link>

          <Link
            href="/caregiver/settings"
            className={`flex items-center gap-3 px-3 py-2.5 rounded-xl font-medium text-sm transition-all ${
              pathname === "/caregiver/settings"
                ? "bg-sky-600 text-white font-bold"
                : "text-slate-400 hover:bg-slate-800 hover:text-slate-200"
            }`}
          >
            <Settings className="w-5 h-5 text-slate-400" />
            <span>Settings</span>
          </Link>
        </div>
      </aside>
    </>
  );
}
