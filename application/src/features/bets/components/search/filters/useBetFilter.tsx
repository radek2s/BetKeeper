import { useBetSearchFilter } from "../context/BetSearchFilterProvider";
import { pipe } from "./filter.interface";
import { useCreatedAfterFilter } from "./useCreatedAfterFilter";
import { useCreatedBeforeFilter } from "./useCreatedBeforeFilter";
import { useParticipantFilter } from "./useParticipantFilter";
import { useSearchInFilter } from "./useSearchInFilter";
import { useStatusInFilter } from "./useStatusInFilter";
import { useTextFilter } from "./useTextFilter";

export function useBetFilterResults() {
  const { bets } = useBetSearchFilter();

  const filterText = useTextFilter();
  const filterSearchIn = useSearchInFilter();
  const filterStatusIn = useStatusInFilter();
  const filterCreatedAfter = useCreatedAfterFilter();
  const filterCreatedBefore = useCreatedBeforeFilter();
  const filterParticipants = useParticipantFilter();

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
