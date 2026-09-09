import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { questionService } from "@/lib/supabase/services";
import { useActivePatientId } from "@/lib/stores/app-store";
import type { PersonalizationQuestion } from "@/lib/types";

export function useQuestions() {
  const patientId = useActivePatientId();
  const queryClient = useQueryClient();

  const query = useQuery<PersonalizationQuestion[]>({
    queryKey: ["personalization-questions", patientId],
    queryFn: async () => questionService.getQuestions(patientId),
    enabled: Boolean(patientId),
  });

  const addQuestion = useMutation({
    mutationFn: async (newQuestion: Omit<PersonalizationQuestion, "id" | "patientId">) => {
      return await questionService.addQuestion({
        ...newQuestion,
        patientId,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["personalization-questions", patientId] });
    },
  });

  const deleteQuestion = useMutation({
    mutationFn: async (id: string) => questionService.deleteQuestion(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["personalization-questions", patientId] });
    },
  });

  return { ...query, addQuestion, deleteQuestion };
}
