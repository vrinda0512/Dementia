import { useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { patientService, familyService } from "@/lib/supabase/services";
import { useActivePatientId, useAppStore } from "@/lib/stores/app-store";
import type { Patient, FamilyMember } from "@/lib/types";

export function usePatient() {
  const patientId = useActivePatientId();
  const setPatient = useAppStore((s) => s.setPatient);
  const queryClient = useQueryClient();

  const query = useQuery<Patient | null>({
    queryKey: ["patient", patientId],
    queryFn: async () => {
      return await patientService.getPatient(patientId);
    },
    enabled: Boolean(patientId),
  });

  useEffect(() => {
    if (query.data) {
      setPatient(query.data);
    }
  }, [query.data, setPatient]);

  const updatePatient = useMutation({
    mutationFn: async (updates: Partial<Patient>) => {
      return await patientService.updatePatient(patientId, updates);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["patient", patientId] });
      queryClient.invalidateQueries({ queryKey: ["caregiver-patients"] });
    },
  });

  const createPatient = useMutation({
    mutationFn: async (newPatient: Omit<Patient, "id">) => {
      return await patientService.createPatient(newPatient);
    },
    onSuccess: (created) => {
      queryClient.invalidateQueries({ queryKey: ["patient"] });
      queryClient.invalidateQueries({ queryKey: ["caregiver-patients"] });
      if (created) setPatient(created);
    },
  });

  return { ...query, updatePatient, createPatient };
}

export function useCaregiverPatients(caregiverId?: string) {
  const setPatients = useAppStore((s) => s.setPatients);
  const setPatient = useAppStore((s) => s.setPatient);
  const current = useAppStore((s) => s.patient);

  const query = useQuery<Patient[]>({
    queryKey: ["caregiver-patients", caregiverId],
    queryFn: async () => {
      if (!caregiverId) return [];
      const list = await patientService.getPatientsForCaregiver(caregiverId);
      // If none linked to caregiver, show all patients so dropdown still works
      return list.length > 0 ? list : await patientService.getAllPatients();
    },
    enabled: Boolean(caregiverId),
  });

  useEffect(() => {
    if (query.data) {
      const patients = query.data;
      setPatients(patients);
      if (patients.length > 0) {
        const stillValid = current && patients.some((p) => p.id === current.id);
        if (!stillValid) setPatient(patients[0]);
      }
    }
  }, [query.data, setPatients, setPatient, current]);

  return query;
}

export function useFamilyMembers() {
  const patientId = useActivePatientId();
  const queryClient = useQueryClient();

  const query = useQuery<FamilyMember[]>({
    queryKey: ["family-members", patientId],
    queryFn: async () => familyService.getFamilyMembers(patientId),
    enabled: Boolean(patientId),
  });

  const addMember = useMutation({
    mutationFn: async (newMember: Omit<FamilyMember, "id" | "patientId" | "createdAt">) => {
      return await familyService.addFamilyMember({
        ...newMember,
        patientId,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["family-members", patientId] });
    },
  });

  const deleteMember = useMutation({
    mutationFn: async (id: string) => familyService.deleteFamilyMember(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["family-members", patientId] });
    },
  });

  return { ...query, addMember, deleteMember };
}
