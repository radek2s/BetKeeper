import { useUserContext } from "@app/features/users/UserProvider";
import { useBetSearchFilter } from "../context/BetSearchFilterProvider";
import type { Bet, BetSearchFilterType } from "./filter.interface";

export function useParticipantFilter(): BetSearchFilterType {
  const { id } = useUserContext();
  const { participantIds } = useBetSearchFilter();

  const filter = (bets: Bet[]) => {
    if (!participantIds || participantIds.length === 0) return bets;

    return bets.filter((bet) => {
      return participantIds.includes(
        bet.participants
          .map((p) => p.userId)
          .filter((userId) => userId !== id)[0],
      );
    });
  };

  return filter;
}
