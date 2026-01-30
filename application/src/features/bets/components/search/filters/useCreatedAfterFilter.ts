import { useBetSearchFilter } from "../context/BetSearchFilterProvider";
import type { Bet, BetSearchFilterType } from "./filter.interface";

export function useCreatedAfterFilter(): BetSearchFilterType {
  const { createdAfter } = useBetSearchFilter();

  const filter = (bets: Bet[]) => {
    if (!createdAfter) return bets;

    return bets.filter((bet) => {
      return new Date(bet.createdAt) > new Date(createdAfter);
    });
  };

  return filter;
}
