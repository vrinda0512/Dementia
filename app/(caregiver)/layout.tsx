"use client";

import { useEffect } from "react";
import { CaregiverSidebar } from "@/features/caregiver/components/sidebar";
import { CaregiverHeader } from "@/features/caregiver/components/header";
import { useAppStore } from "@/lib/stores/app-store";
import { patientService, caregiverService } from "@/lib/supabase/services";
import { DEFAULT_CAREGIVER_ID } from "@/lib/supabase/config";

function CaregiverSessionBootstrap({ children }: { children: React.ReactNode }) {
  const { role, caregiver, setRole, setCaregiver, setPatients, setPatient, patient } =
    useAppStore();

  useEffect(() => {
    let cancelled = false;

    async function ensureSession() {
      if (role === "caregiver" && caregiver && patient) return;

      const caregiverId = caregiver?.id || DEFAULT_CAREGIVER_ID;
      const profile =
        (await caregiverService.getCaregiver(caregiverId)) || {
          id: caregiverId,
          name: "Dr. Ananya Sharma",
          email: "ananya@smarika.care",
          role: "caregiver",
        };

      let patients = await patientService.getPatientsForCaregiver(caregiverId);
      if (patients.length === 0) {
        patients = await patientService.getAllPatients();
      }

      if (cancelled) return;

      setRole("caregiver");
      setCaregiver(profile);
      setPatients(patients);
      if (patients.length > 0) {
        const keep = patient && patients.some((p) => p.id === patient.id);
        if (!keep) setPatient(patients[0]);
      }
    }

    ensureSession();
    return () => {
      cancelled = true;
    };
  }, []); // Run bootstrap check once on layout mount

  return <>{children}</>;
}

export default function CaregiverLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <CaregiverSessionBootstrap>
      <div className="min-h-screen bg-slate-50 flex overflow-x-hidden">
        <CaregiverSidebar />
        <div className="flex-1 md:pl-72 flex flex-col min-w-0">
          <CaregiverHeader />
          <main className="flex-1 p-4 md:p-8 max-w-7xl w-full mx-auto space-y-8">
            {children}
          </main>
        </div>
      </div>
    </CaregiverSessionBootstrap>
  );
}
