import { isBetResponse } from "@app/features/bets/model/betDto";
import { useBetSearchFilter } from "../context/BetSearchFilterProvider";
import type { Bet, BetSearchFilterType } from "./filter.interface";

export function useStatusInFilter(): BetSearchFilterType {
  const { status } = useBetSearchFilter();

  const filter = (bets: Bet[]) => {
    if (!status || status.length === 0) return bets;

    return bets.filter((bet) => {
      if (isBetResponse(bet)) {
        return status.includes(bet.status);
      } else {
        return status.includes("pending");
      }
    });
  };

  return filter;
}
