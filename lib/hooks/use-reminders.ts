import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { reminderService } from "@/lib/supabase/services";
import type { Reminder } from "@/lib/types";

export function useReminders() {
  const queryClient = useQueryClient();

  const query = useQuery<Reminder[]>({
    queryKey: ["reminders"],
    queryFn: async () => {
      return await reminderService.getReminders();
    },
  });

  const toggleReminder = useMutation({
    mutationFn: async (id: string) => {
      const current = query.data?.find((r) => r.id === id);
      if (current) {
        current.completed = !current.completed;
      }
      return current;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["reminders"] });
    },
  });

  const addReminder = useMutation({
    mutationFn: async (newRem: Omit<Reminder, "id" | "patientId" | "completed">) => {
      const created: Reminder = {
        id: `rem-${Date.now()}`,
        patientId: "a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11",
        completed: false,
        ...newRem,
      };
      return created;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["reminders"] });
    },
  });

  const deleteReminder = useMutation({
    mutationFn: async (id: string) => {
      return true;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["reminders"] });
    },
  });

  return { ...query, toggleReminder, addReminder, deleteReminder };
}
