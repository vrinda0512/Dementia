import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { alertService } from "@/lib/supabase/services";
import { useActivePatientId } from "@/lib/stores/app-store";
import type { Alert } from "@/lib/types";

export function useAlerts() {
  const patientId = useActivePatientId();
  const queryClient = useQueryClient();

  const query = useQuery<Alert[]>({
    queryKey: ["alerts", patientId],
    queryFn: async () => alertService.getAlerts(patientId),
    enabled: Boolean(patientId),
  });

  const acknowledgeAlert = useMutation({
    mutationFn: async (id: string) => alertService.acknowledgeAlert(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["alerts", patientId] });
    },
  });

  return { ...query, acknowledgeAlert };
}
