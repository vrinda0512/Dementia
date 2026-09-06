import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { demoGameSessions } from "@/lib/mock-data/game-sessions";
import type { GameSession } from "@/lib/types";

export function useGameSessions(gameId?: string) {
  const queryClient = useQueryClient();

  const query = useQuery<GameSession[]>({
    queryKey: ["game-sessions", gameId],
    queryFn: async () => {
      if (gameId) {
        return demoGameSessions.filter((s) => s.gameId === gameId);
      }
      return demoGameSessions;
    },
    initialData: gameId
      ? demoGameSessions.filter((s) => s.gameId === gameId)
      : demoGameSessions,
  });

  const recordSession = useMutation({
    mutationFn: async (session: GameSession) => {
      demoGameSessions.unshift(session);
      return session;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["game-sessions"] });
      queryClient.invalidateQueries({ queryKey: ["metrics"] });
    },
  });

  return { ...query, recordSession };
}
