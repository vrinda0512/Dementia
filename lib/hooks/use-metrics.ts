import { useQuery } from "@tanstack/react-query";
import { metricsService } from "@/lib/supabase/services";
import { useActivePatientId } from "@/lib/stores/app-store";
import type { Metrics } from "@/lib/types";

export function useMetrics() {
  const patientId = useActivePatientId();

  return useQuery<Metrics[]>({
    queryKey: ["metrics", patientId],
    queryFn: async () => metricsService.getMetrics(patientId),
    enabled: Boolean(patientId),
  });
}
