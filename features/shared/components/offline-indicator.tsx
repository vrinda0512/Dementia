"use client";

import { useOnlineStatus } from "@/lib/offline/hooks";
import { WifiOff } from "lucide-react";

export function OfflineIndicator() {
  const isOnline = useOnlineStatus();

  if (isOnline) return null;

  return (
    <div className="fixed top-0 left-0 right-0 z-50 bg-amber-600 text-white px-4 py-2 text-center text-sm font-bold flex items-center justify-center gap-2 shadow-lg animate-bounce">
      <WifiOff className="w-4 h-4" />
      <span>Internet unavailable — Playing in offline mode (Data saved locally 📴)</span>
    </div>
  );
}
