import { useQuery } from "@tanstack/react-query";
import { metricsService } from "@/lib/supabase/services";
import type { Metrics } from "@/lib/types";

export function useMetrics() {
  return useQuery<Metrics[]>({
    queryKey: ["metrics"],
    queryFn: async () => {
      const metric = await metricsService.getMetrics();
      return [metric];
    },
  });
}
