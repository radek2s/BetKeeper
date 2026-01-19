import { useUserContext } from "@app/features/users/UserProvider";
import {
  type BetRequestResponse,
  type BetResponse,
  isBetResponse,
} from "../../model/betDto";
import { useBetSearchFilter } from "./BetSearchFilterProvider";

type Bet = BetRequestResponse | BetResponse;

type PipeFn<T> = (value: T) => T;

function pipe<T>(value: T, ...fns: PipeFn<T>[]): T {
  return fns.reduce((acc, fn) => fn(acc), value);
}

export function useBetFilterResults() {
  const { id } = useUserContext();
  const {
    bets,
    searchText,
    searchIn,
    status,
    createdAfter,
    createdBefore,
    participantIds,
  } = useBetSearchFilter();

  const filterText = (bets: Bet[]) => {
    if (!searchText) return bets;

    return bets.filter((bet) => {
      const matchTitle =
        bet.title.toLowerCase().search(searchText.toLowerCase()) > -1;
      const matchTerms =
        bet.terms.toLowerCase().search(searchText.toLowerCase()) > -1;
      return matchTitle || matchTerms;
    });
  };

  const filterSearchIn = (bets: Bet[]) => {
    if (!searchIn) return bets;

    return bets.filter((bet) =>
      searchIn === "CREATOR" ? bet.creatorId === id : bet.creatorId !== id,
    );
  };

  const filterStatusIn = (bets: Bet[]) => {
    if (!status || status.length === 0) return bets;

    return bets.filter((bet) => {
      if (isBetResponse(bet)) {
        return status.includes(bet.status);
      } else {
        return status.includes("pending");
      }
    });
  };

  const filterCreatedAfter = (bets: Bet[]) => {
    if (!createdAfter) return bets;

    return bets.filter((bet) => {
      return new Date(bet.createdAt) > new Date(createdAfter);
    });
  };

  const filterCreatedBefore = (bets: Bet[]) => {
    if (!createdBefore) return bets;

    return bets.filter((bet) => {
      return new Date(bet.createdAt) < new Date(createdBefore);
    });
  };

  const filterParticipants = (bets: Bet[]) => {
    if (!participantIds || participantIds.length === 0) return bets;

    return bets.filter((bet) => {
      return participantIds.includes(
        bet.participants
          .map((p) => p.userId)
          .filter((userId) => userId !== id)[0],
      );
    });
  };

  return pipe(
    bets,
    filterText,
    filterSearchIn,
    filterStatusIn,
    filterCreatedAfter,
    filterCreatedBefore,
    filterParticipants,
  );
}
