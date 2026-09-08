import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { routineService } from "@/lib/supabase/services";
import type { Routine } from "@/lib/types";

export function useRoutines() {
  const queryClient = useQueryClient();

  const query = useQuery<Routine[]>({
    queryKey: ["routines"],
    queryFn: async () => {
      const data = await routineService.getRoutines();
      return data.sort((a, b) => (a.stepOrder || a.order || 1) - (b.stepOrder || b.order || 1));
    },
  });

  const addRoutine = useMutation({
    mutationFn: async (newRoutine: Omit<Routine, "id">) => {
      return await routineService.addRoutine(newRoutine);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["routines"] });
    },
  });

  const deleteRoutine = useMutation({
    mutationFn: async (id: string) => {
      return await routineService.deleteRoutine(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["routines"] });
    },
  });

  return { ...query, addRoutine, deleteRoutine };
}
