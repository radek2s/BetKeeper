import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { BetRequestResponse, BetResponse } from "../model/betDto";
import {
  approveBet,
  completeBet,
  createBetRequest,
  deleteBet,
  fetchBet,
  fetchBets,
  rejectBet,
  resolveBet,
  startBet,
  updateClaims,
  updateStakes,
  updateTerms,
} from "./betApi";

const queryKeys = {
  bets: "bets",
  bet: "bet",
} as const;

const mutationKeys = {
  betRequestCreate: "betRequestCreate",
  betRequestDelete: "betRequestDelete",
  betRequestApprove: "betRequestApprove",
  betRequestReject: "betRequestReject",
  betRequestTermsUpdate: "betRequestTermsUpdate",
  betRequestStakesUpdate: "betRequestStakesUpdate",
  betRequestClaimsUpdate: "betRequestClaimsUpdate",
  start: "betStart",
  resovle: "betResolve",
  complete: "betComplete",
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

export function useBetRequestApproveMutation(betId: string) {
  const client = useQueryClient();
  return useMutation({
    mutationKey: [mutationKeys.betRequestApprove],
    mutationFn: () => approveBet(betId),
    retry: false,
    onSuccess: () => {
      client.invalidateQueries({ queryKey: [queryKeys.bet, betId] });
    },
  });
}

export function useBetRequestRejectMutation(betId: string) {
  const client = useQueryClient();
  return useMutation({
    mutationKey: [mutationKeys.betRequestReject],
    mutationFn: () => rejectBet(betId),
    retry: false,
    onSuccess: () => {
      client.invalidateQueries({ queryKey: [queryKeys.bet, betId] });
    },
  });
}

export function useBetRequestTermsMutation(betId: string) {
  const client = useQueryClient();
  return useMutation({
    mutationKey: [mutationKeys.betRequestTermsUpdate],
    mutationFn: (terms: string) => updateTerms(betId, terms),
    retry: false,
    onSuccess: () => {
      client.invalidateQueries({ queryKey: [queryKeys.bet, betId] });
    },
  });
}

export function useBetRequestStakesMutation(betId: string) {
  const client = useQueryClient();
  return useMutation({
    mutationKey: [mutationKeys.betRequestStakesUpdate],
    mutationFn: (stakes: string) => updateStakes(betId, stakes),
    retry: false,
    onSuccess: () => {
      client.invalidateQueries({ queryKey: [queryKeys.bet, betId] });
    },
  });
}

export function useBetRequestClaimsMutation(betId: string) {
  const client = useQueryClient();
  return useMutation({
    mutationKey: [mutationKeys.betRequestClaimsUpdate],
    mutationFn: (claims: string) => updateClaims(betId, claims),
    retry: false,
    onSuccess: () => {
      client.invalidateQueries({ queryKey: [queryKeys.bet, betId] });
    },
  });
}

export function useBetStartMutation(betId: string) {
  const client = useQueryClient();
  return useMutation({
    mutationKey: [mutationKeys.start],
    mutationFn: () => startBet(betId),
    retry: false,
    onSuccess: () => {
      client.invalidateQueries({ queryKey: [queryKeys.bet, betId] });
    },
  });
}

export function useBetResolveMutation(betId: string) {
  const client = useQueryClient();
  return useMutation({
    mutationKey: [mutationKeys.resovle],
    mutationFn: (winnerId: string) => resolveBet(betId, winnerId),
    retry: false,
    onSuccess: () => {
      client.invalidateQueries({ queryKey: [queryKeys.bet, betId] });
    },
  });
}

export function useBetCompleteMutation(betId: string) {
  const client = useQueryClient();
  return useMutation({
    mutationKey: [mutationKeys.complete],
    mutationFn: () => completeBet(betId),
    retry: false,
    onSuccess: () => {
      client.invalidateQueries({ queryKey: [queryKeys.bet, betId] });
    },
  });
}
