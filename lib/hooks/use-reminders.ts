import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { reminderService } from "@/lib/supabase/services";
import { useActivePatientId } from "@/lib/stores/app-store";
import type { Reminder } from "@/lib/types";

export function useReminders() {
  const patientId = useActivePatientId();
  const queryClient = useQueryClient();

  const query = useQuery<Reminder[]>({
    queryKey: ["reminders", patientId],
    queryFn: async () => reminderService.getReminders(patientId),
    enabled: Boolean(patientId),
  });

  const toggleReminder = useMutation({
    mutationFn: async (id: string) => {
      const current = query.data?.find((r) => r.id === id);
      if (!current) return false;
      return reminderService.toggleReminder(id, !current.completed);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["reminders", patientId] });
    },
  });

  const addReminder = useMutation({
    mutationFn: async (
      newRem: Omit<Reminder, "id" | "patientId" | "completed">
    ) => {
      return reminderService.addReminder({
        ...newRem,
        patientId,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["reminders", patientId] });
    },
  });

  const deleteReminder = useMutation({
    mutationFn: async (id: string) => reminderService.deleteReminder(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["reminders", patientId] });
    },
  });

  return { ...query, toggleReminder, addReminder, deleteReminder };
}
