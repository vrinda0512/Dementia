import { create } from "zustand";
import { persist } from "zustand/middleware";
import { demoPatient, demoCaregiver } from "@/lib/mock-data/patient";
import type { Patient, Caregiver } from "@/lib/types";

interface AppState {
  caregiver: Caregiver | null;
  patient: Patient | null;
  isSidebarOpen: boolean;
  isPatientMode: boolean;
  activeLanguage: string;
  setCaregiver: (caregiver: Caregiver | null) => void;
  setPatient: (patient: Patient | null) => void;
  toggleSidebar: () => void;
  setSidebarOpen: (open: boolean) => void;
  enterPatientMode: () => void;
  exitPatientMode: () => void;
  setLanguage: (lang: string) => void;
}

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      caregiver: demoCaregiver,
      patient: demoPatient,
      isSidebarOpen: false,
      isPatientMode: false,
      activeLanguage: "English",
      setCaregiver: (caregiver) => set({ caregiver }),
      setPatient: (patient) => set({ patient }),
      toggleSidebar: () => set((state) => ({ isSidebarOpen: !state.isSidebarOpen })),
      setSidebarOpen: (open) => set({ isSidebarOpen: open }),
      enterPatientMode: () => set({ isPatientMode: true }),
      exitPatientMode: () => set({ isPatientMode: false }),
      setLanguage: (lang) => set({ activeLanguage: lang }),
    }),
    {
      name: "memora-app-storage",
      partialize: (state) => ({
        isPatientMode: state.isPatientMode,
        activeLanguage: state.activeLanguage,
      }),
    }
  )
);
