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
      { name: "Profile & Setup", href: "/caregiver/patient", icon: User },
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
      {/* Mobile Backdrop Overlay */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-slate-900/70 backdrop-blur-xs md:hidden cursor-pointer transition-opacity duration-200"
          onClick={() => setSidebarOpen(false)}
          aria-label="Close Mobile Sidebar Backdrop"
        />
      )}

      {/* Sidebar Drawer */}
      <aside
        className={`fixed inset-y-0 left-0 h-full z-50 w-72 max-w-[85vw] bg-slate-900 text-slate-300 flex flex-col border-r border-slate-800 transition-transform duration-300 ease-in-out ${
          isSidebarOpen ? "translate-x-0 shadow-2xl" : "-translate-x-full md:translate-x-0"
        }`}
      >
        {/* Brand Header */}
        <div className="p-5 md:p-6 border-b border-slate-800 flex items-center justify-between">
          <Link
            href="/caregiver/dashboard"
            onClick={() => setSidebarOpen(false)}
            className="flex items-center gap-3 group"
          >
            <div className="w-10 h-10 bg-gradient-to-tr from-sky-500 to-emerald-500 rounded-xl flex items-center justify-center shadow-lg shadow-sky-500/20 group-hover:scale-105 transition-transform">
              <HeartPulse className="w-6 h-6 text-white" />
            </div>
            <div>
              <span className="text-xl font-black text-white tracking-tight block">Memora</span>
              <span className="text-[10px] font-bold text-sky-400 uppercase tracking-widest block">Caregiver Mode</span>
            </div>
          </Link>

          {/* Mobile Cross Close Button */}
          <button
            type="button"
            onClick={() => setSidebarOpen(false)}
            className="md:hidden text-slate-400 hover:text-white active:text-white bg-slate-800/80 hover:bg-slate-800 p-2.5 rounded-xl transition-all focus:outline-none focus:ring-2 focus:ring-sky-500 cursor-pointer touch-manipulation flex items-center justify-center active:scale-95"
            aria-label="Close Sidebar"
          >
            <X className="w-6 h-6 text-slate-200" />
          </button>
        </div>

        {/* Navigation Links */}
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
                    className={`flex items-center gap-3 px-3.5 py-3 rounded-xl font-semibold text-sm transition-all touch-manipulation ${
                      isActive
                        ? "bg-sky-600 text-white font-bold shadow-md shadow-sky-600/30"
                        : "text-slate-400 hover:bg-slate-800 hover:text-slate-200 active:bg-slate-800"
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

        {/* Footer Actions */}
        <div className="p-4 border-t border-slate-800 space-y-2 bg-slate-950/50">
          <Link
            href="/patient/home"
            onClick={() => setSidebarOpen(false)}
            className="w-full flex items-center justify-center gap-2 px-3 py-3 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs uppercase tracking-wider rounded-xl shadow-md transition-all transform active:scale-95 touch-manipulation"
          >
            <Smartphone className="w-4 h-4" />
            <span>Switch to Patient Mode</span>
          </Link>

          <Link
            href="/caregiver/settings"
            onClick={() => setSidebarOpen(false)}
            className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl font-medium text-sm transition-all touch-manipulation ${
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
