import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { demoReminders } from "@/lib/mock-data/reminders";
import type { Reminder } from "@/lib/types";

export function useReminders() {
  const queryClient = useQueryClient();

  const query = useQuery<Reminder[]>({
    queryKey: ["reminders"],
    queryFn: async () => {
      return demoReminders;
    },
    initialData: demoReminders,
  });

  const toggleReminder = useMutation({
    mutationFn: async (id: string) => {
      const rem = demoReminders.find((r) => r.id === id);
      if (rem) {
        rem.completed = !rem.completed;
      }
      return rem;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["reminders"] });
    },
  });

  const addReminder = useMutation({
    mutationFn: async (newReminder: Omit<Reminder, "id" | "patientId" | "completed">) => {
      const created: Reminder = {
        id: `rem-${Date.now()}`,
        patientId: "patient-001",
        completed: false,
        ...newReminder,
      };
      demoReminders.push(created);
      return created;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["reminders"] });
    },
  });

  const deleteReminder = useMutation({
    mutationFn: async (id: string) => {
      const idx = demoReminders.findIndex((r) => r.id === id);
      if (idx !== -1) {
        demoReminders.splice(idx, 1);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["reminders"] });
    },
  });

  return { ...query, toggleReminder, addReminder, deleteReminder };
}
