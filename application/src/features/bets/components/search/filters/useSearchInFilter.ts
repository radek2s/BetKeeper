import { useUserContext } from "@app/features/users/UserProvider";
import { useBetSearchFilter } from "../context/BetSearchFilterProvider";
import type { Bet, BetSearchFilterType } from "./filter.interface";

export function useSearchInFilter(): BetSearchFilterType {
  const { id } = useUserContext();
  const { searchIn } = useBetSearchFilter();

  const filter = (bets: Bet[]) => {
    if (!searchIn) return bets;

    return bets.filter((bet) =>
      searchIn === "CREATOR" ? bet.creatorId === id : bet.creatorId !== id,
    );
  };

  return filter;
}
