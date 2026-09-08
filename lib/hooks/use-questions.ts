import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { questionService } from "@/lib/supabase/services";
import type { PersonalizationQuestion } from "@/lib/types";

export function useQuestions() {
  const queryClient = useQueryClient();

  const query = useQuery<PersonalizationQuestion[]>({
    queryKey: ["personalization-questions"],
    queryFn: async () => {
      return await questionService.getQuestions();
    },
  });

  const addQuestion = useMutation({
    mutationFn: async (newQuestion: Omit<PersonalizationQuestion, "id">) => {
      return await questionService.addQuestion(newQuestion);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["personalization-questions"] });
    },
  });

  const deleteQuestion = useMutation({
    mutationFn: async (id: string) => {
      return await questionService.deleteQuestion(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["personalization-questions"] });
    },
  });

  return { ...query, addQuestion, deleteQuestion };
}
