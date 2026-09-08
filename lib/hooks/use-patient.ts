import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { patientService, familyService } from "@/lib/supabase/services";
import type { Patient, FamilyMember } from "@/lib/types";

export function usePatient() {
  const queryClient = useQueryClient();

  const query = useQuery<Patient>({
    queryKey: ["patient"],
    queryFn: async () => {
      return await patientService.getPatient();
    },
  });

  const updatePatient = useMutation({
    mutationFn: async (updates: Partial<Patient>) => {
      return await patientService.updatePatient(updates);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["patient"] });
    },
  });

  return { ...query, updatePatient };
}

export function useFamilyMembers() {
  const queryClient = useQueryClient();

  const query = useQuery<FamilyMember[]>({
    queryKey: ["family-members"],
    queryFn: async () => {
      return await familyService.getFamilyMembers();
    },
  });

  const addMember = useMutation({
    mutationFn: async (newMember: Omit<FamilyMember, "id" | "patientId">) => {
      return await familyService.addFamilyMember({
        ...newMember,
        patientId: "a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11",
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["family-members"] });
    },
  });

  const deleteMember = useMutation({
    mutationFn: async (id: string) => {
      return await familyService.deleteFamilyMember(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["family-members"] });
    },
  });

  return { ...query, addMember, deleteMember };
}
