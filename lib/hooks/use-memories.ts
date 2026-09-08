import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { demoMemories } from "@/lib/mock-data/memories";
import type { Memory } from "@/lib/types";

export function useMemories() {
  const queryClient = useQueryClient();

  const query = useQuery<Memory[]>({
    queryKey: ["memories"],
    queryFn: async () => {
      return demoMemories;
    },
    initialData: demoMemories,
  });

  const addMemory = useMutation({
    mutationFn: async (newMemory: Omit<Memory, "id" | "patientId" | "createdAt">) => {
      const created: Memory = {
        id: `mem-${Date.now()}`,
        patientId: "patient-001",
        createdAt: new Date().toISOString(),
        ...newMemory,
      };
      demoMemories.unshift(created);
      return created;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["memories"] });
    },
  });

  return { ...query, addMemory };
}
