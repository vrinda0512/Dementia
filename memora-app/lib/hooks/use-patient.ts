import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { demoPatient, demoCaregiver } from "@/lib/mock-data/patient";
import { demoFamily } from "@/lib/mock-data/family";
import type { Patient, FamilyMember } from "@/lib/types";

export function usePatient() {
  return useQuery<Patient>({
    queryKey: ["patient"],
    queryFn: async () => {
      // Return mock data for prototype, ready for Supabase replacement
      return demoPatient;
    },
    initialData: demoPatient,
  });
}

export function useFamilyMembers() {
  const queryClient = useQueryClient();

  const query = useQuery<FamilyMember[]>({
    queryKey: ["family-members"],
    queryFn: async () => {
      return demoFamily;
    },
    initialData: demoFamily,
  });

  const addMember = useMutation({
    mutationFn: async (newMember: Omit<FamilyMember, "id" | "patientId">) => {
      const created: FamilyMember = {
        id: `family-${Date.now()}`,
        patientId: "patient-001",
        ...newMember,
      };
      demoFamily.push(created);
      return created;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["family-members"] });
    },
  });

  return { ...query, addMember };
}
