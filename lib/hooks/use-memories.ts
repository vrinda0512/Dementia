import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { memoryService } from "@/lib/supabase/services";
import { useActivePatientId } from "@/lib/stores/app-store";
import type { Memory } from "@/lib/types";

export function useMemories() {
  const patientId = useActivePatientId();
  const queryClient = useQueryClient();

  const query = useQuery<Memory[]>({
    queryKey: ["memories", patientId],
    queryFn: async () => memoryService.getMemories(patientId),
    enabled: Boolean(patientId),
  });

  const addMemory = useMutation({
    mutationFn: async (
      newMemory: Omit<Memory, "id" | "patientId" | "createdAt">
    ) => {
      return memoryService.addMemory({
        ...newMemory,
        patientId,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["memories", patientId] });
    },
  });

  return { ...query, addMemory };
}
