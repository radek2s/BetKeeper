import { useQuery, useQueryClient } from "@tanstack/react-query";
import { fetchBet, fetchBets } from "./betApi";

const queryKeys = {
  bets: "bets",
  bet: "bet",
} as const;

export function useBets() {
  return useQuery({
    queryKey: [queryKeys.bets],
    queryFn: fetchBets,
  });
}

export function useBet(betId: string) {
  return useQuery({
    queryKey: [queryKeys.bet, betId],
    queryFn: () => fetchBet(betId),
    retry: false,
  });
}

export function useBetInvalidate(betId: string) {
  const client = useQueryClient();
  const invalidate = () => {
    client.invalidateQueries({
      queryKey: [queryKeys.bet, betId],
    });
  };
  return {
    invalidate,
  };
}
