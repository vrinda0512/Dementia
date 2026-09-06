import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { demoAlerts } from "@/lib/mock-data/alerts";
import type { Alert } from "@/lib/types";

export function useAlerts() {
  const queryClient = useQueryClient();

  const query = useQuery<Alert[]>({
    queryKey: ["alerts"],
    queryFn: async () => {
      return demoAlerts;
    },
    initialData: demoAlerts,
  });

  const acknowledgeAlert = useMutation({
    mutationFn: async (id: string) => {
      const alert = demoAlerts.find((a) => a.id === id);
      if (alert) alert.acknowledged = true;
      return alert;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["alerts"] });
    },
  });

  return { ...query, acknowledgeAlert };
}
