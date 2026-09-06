import { useQuery } from "@tanstack/react-query";
import { demoRoutines } from "@/lib/mock-data/routines";
import type { Routine } from "@/lib/types";

export function useRoutines() {
  return useQuery<Routine[]>({
    queryKey: ["routines"],
    queryFn: async () => {
      return demoRoutines.sort((a, b) => a.order - b.order);
    },
    initialData: demoRoutines.sort((a, b) => a.order - b.order),
  });
}
