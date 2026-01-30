import { useBetSearchFilter } from "../context/BetSearchFilterProvider";
import type { Bet, BetSearchFilterType } from "./filter.interface";

export function useCreatedBeforeFilter(): BetSearchFilterType {
  const { createdBefore } = useBetSearchFilter();

  const filter = (bets: Bet[]) => {
    if (!createdBefore) return bets;

    return bets.filter((bet) => {
      return new Date(bet.createdAt) < new Date(createdBefore);
    });
  };

  return filter;
}
