import { useBetSearchFilter } from "../context/BetSearchFilterProvider";
import type { Bet, BetSearchFilterType } from "./filter.interface";

export function useTextFilter(): BetSearchFilterType {
  const { searchText } = useBetSearchFilter();

  const filter = (bets: Bet[]) => {
    if (!searchText) return bets;

    return bets.filter((bet) => {
      const matchTitle =
        bet.title.toLowerCase().search(searchText.toLowerCase()) > -1;
      const matchTerms =
        bet.terms.toLowerCase().search(searchText.toLowerCase()) > -1;
      return matchTitle || matchTerms;
    });
  };

  return filter;
}
