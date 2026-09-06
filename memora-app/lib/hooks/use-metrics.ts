import { useQuery } from "@tanstack/react-query";
import { demoMetrics } from "@/lib/mock-data/metrics";
import type { Metrics } from "@/lib/types";

export function useMetrics() {
  return useQuery<Metrics[]>({
    queryKey: ["metrics"],
    queryFn: async () => {
      return demoMetrics;
    },
    initialData: demoMetrics,
  });
}
