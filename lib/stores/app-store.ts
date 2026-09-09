import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Patient, Caregiver } from "@/lib/types";
import { DEFAULT_CAREGIVER_ID, DEFAULT_PATIENT_ID } from "@/lib/supabase/config";
import {
  DEFAULT_PATIENT_LANGUAGE,
  normalizePatientLanguage,
  type PatientLanguageCode,
} from "@/lib/voice/languages";

export type AppRole = "caregiver" | "patient" | null;

interface AppState {
  role: AppRole;
  caregiver: Caregiver | null;
  patient: Patient | null;
  /** All patients assigned to the logged-in caregiver */
  patients: Patient[];
  isSidebarOpen: boolean;
  isPatientMode: boolean;
  activeLanguage: PatientLanguageCode;
  setRole: (role: AppRole) => void;
  setCaregiver: (caregiver: Caregiver | null) => void;
  setPatient: (patient: Patient | null) => void;
  setPatients: (patients: Patient[]) => void;
  selectPatient: (patientId: string) => void;
  toggleSidebar: () => void;
  setSidebarOpen: (open: boolean) => void;
  enterPatientMode: () => void;
  exitPatientMode: () => void;
  setLanguage: (lang: PatientLanguageCode | string) => void;
  logout: () => void;
}

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      role: null,
      caregiver: null,
      patient: null,
      patients: [],
      isSidebarOpen: false,
      isPatientMode: false,
      activeLanguage: DEFAULT_PATIENT_LANGUAGE,
      setRole: (role) => set({ role }),
      setCaregiver: (caregiver) => set({ caregiver }),
      setPatient: (patient) => set({ patient }),
      setPatients: (patients) => set({ patients }),
      selectPatient: (patientId) => {
        const found = get().patients.find((p) => p.id === patientId);
        if (found) set({ patient: found });
      },
      toggleSidebar: () => set((state) => ({ isSidebarOpen: !state.isSidebarOpen })),
      setSidebarOpen: (open) => set({ isSidebarOpen: open }),
      enterPatientMode: () => set({ isPatientMode: true }),
      exitPatientMode: () => set({ isPatientMode: false }),
      setLanguage: (lang) => set({ activeLanguage: normalizePatientLanguage(lang) }),
      logout: () =>
        set({
          role: null,
          caregiver: null,
          patient: null,
          patients: [],
          isPatientMode: false,
        }),
    }),
    {
      name: "memora-app-storage",
      version: 1,
      migrate: (persistedState) => {
        const state = persistedState as Partial<Pick<
          AppState,
          "role" | "caregiver" | "patient" | "patients" | "isPatientMode" | "activeLanguage"
        >>;
        return {
          role: state.role ?? null,
          caregiver: state.caregiver ?? null,
          patient: state.patient ?? null,
          patients: state.patients ?? [],
          isPatientMode: state.isPatientMode ?? false,
          activeLanguage: normalizePatientLanguage(state.activeLanguage),
        };
      },
      partialize: (state) => ({
        role: state.role,
        caregiver: state.caregiver,
        patient: state.patient,
        patients: state.patients,
        isPatientMode: state.isPatientMode,
        activeLanguage: state.activeLanguage,
      }),
    }
  )
);

/** Active patient id for queries — falls back to seeded demo UUID when unset. */
export function useActivePatientId(): string {
  const patient = useAppStore((s) => s.patient);
  return patient?.id || DEFAULT_PATIENT_ID;
}

export function useActiveCaregiverId(): string {
  const caregiver = useAppStore((s) => s.caregiver);
  return caregiver?.id || DEFAULT_CAREGIVER_ID;
}
