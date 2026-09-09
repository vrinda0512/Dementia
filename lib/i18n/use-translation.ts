"use client";

import { useAppStore } from "@/lib/stores/app-store";
import { en } from "./en";
import { hi } from "./hi";

export function useTranslation() {
  const activeLanguage = useAppStore((state) => state.activeLanguage);

  const dict = activeLanguage === "hi-IN" ? hi : en;

  return {
    t: (key: keyof typeof en) => dict[key] || en[key] || key,
    language: activeLanguage,
  };
}
