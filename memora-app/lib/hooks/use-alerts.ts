import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { alertService } from "@/lib/supabase/services";
import type { Alert } from "@/lib/types";

export function useAlerts() {
  const queryClient = useQueryClient();

  const query = useQuery<Alert[]>({
    queryKey: ["alerts"],
    queryFn: async () => {
      return await alertService.getAlerts();
    },
  });

  const acknowledgeAlert = useMutation({
    mutationFn: async (id: string) => {
      const alert = query.data?.find((a) => a.id === id);
      if (alert) alert.acknowledged = true;
      return alert;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["alerts"] });
    },
  });

  return { ...query, acknowledgeAlert };
}
