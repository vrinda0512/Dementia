import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { gameSessionService, gameService } from "@/lib/supabase/services";
import { useActivePatientId } from "@/lib/stores/app-store";
import type { GameSession, Game } from "@/lib/types";

export function useGameSessions(gameId?: string) {
  const patientId = useActivePatientId();
  const queryClient = useQueryClient();

  const query = useQuery<GameSession[]>({
    queryKey: ["game-sessions", patientId, gameId],
    queryFn: async () => gameSessionService.getSessions(patientId, gameId),
    enabled: Boolean(patientId),
  });

  const recordSession = useMutation({
    mutationFn: async (session: Omit<GameSession, "id" | "createdAt">) => {
      return gameSessionService.recordSession({
        ...session,
        patientId: session.patientId || patientId,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["game-sessions"] });
      queryClient.invalidateQueries({ queryKey: ["metrics"] });
    },
  });

  return { ...query, recordSession };
}

export function useGames() {
  const queryClient = useQueryClient();

  const query = useQuery<Game[]>({
    queryKey: ["games"],
    queryFn: async () => gameService.getGames(),
  });

  const toggleActive = useMutation({
    mutationFn: async ({ id, active }: { id: string; active: boolean }) =>
      gameService.setGameActive(id, active),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["games"] });
    },
  });

  return { ...query, toggleActive };
}
