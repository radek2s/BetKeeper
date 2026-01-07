import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { BetRequestResponse, BetResponse } from "../model/betDto";
import { createBetRequest, deleteBet, fetchBet, fetchBets } from "./betApi";

const queryKeys = {
  bets: "bets",
  bet: "bet",
} as const;

const mutationKeys = {
  betRequestCreate: "betRequestCreate",
  betRequestDelete: "betRequestDelete",
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

export function useBetRequestCreateMutation() {
  const client = useQueryClient();
  return useMutation({
    mutationKey: [mutationKeys.betRequestCreate],
    mutationFn: createBetRequest,
    retry: false,
    onSuccess: (data) => {
      client.setQueryData(
        [queryKeys.bets],
        (old: (BetResponse | BetRequestResponse)[]) => [...old, data],
      );
    },
  });
}

export function useBetDeleteMutation(betId: string) {
  const client = useQueryClient();
  return useMutation({
    mutationKey: [mutationKeys.betRequestDelete],
    mutationFn: () => deleteBet(betId),
    retry: false,
    onSuccess: () => {
      client.setQueryData(
        [queryKeys.bets],
        (old: (BetResponse | BetRequestResponse)[]) =>
          old.filter(({ id }) => betId !== id),
      );
    },
  });
}
