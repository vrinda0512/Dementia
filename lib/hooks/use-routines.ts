import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { routineService } from "@/lib/supabase/services";
import { useActivePatientId } from "@/lib/stores/app-store";
import type { Routine } from "@/lib/types";

export function useRoutines() {
  const patientId = useActivePatientId();
  const queryClient = useQueryClient();

  const query = useQuery<Routine[]>({
    queryKey: ["routines", patientId],
    queryFn: async () => {
      const data = await routineService.getRoutines(patientId);
      return data.sort(
        (a, b) => (a.stepOrder || a.order || 1) - (b.stepOrder || b.order || 1)
      );
    },
    enabled: Boolean(patientId),
  });

  const addRoutine = useMutation({
    mutationFn: async (newRoutine: Omit<Routine, "id" | "patientId">) => {
      return await routineService.addRoutine({
        ...newRoutine,
        patientId,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["routines", patientId] });
    },
  });

  const deleteRoutine = useMutation({
    mutationFn: async (id: string) => routineService.deleteRoutine(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["routines", patientId] });
    },
  });

  return { ...query, addRoutine, deleteRoutine };
}
