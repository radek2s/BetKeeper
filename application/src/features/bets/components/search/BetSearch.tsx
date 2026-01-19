import type { BetRequestResponse, BetResponse } from "../../model/betDto";
import { BetSearchFilterProvider } from "./BetSearchFilterProvider";
import { BetSearchResults } from "./BetSearchResults";
import SearchCreateFilter from "./filters/SearchCreateFilter";
import SearchInFilter from "./filters/SearchInFilter";
import SearchParticipantFilter from "./filters/SearchParticipantFilter";
import SearchStatusFilter from "./filters/SearchStatusFilter";
import SearchTextFilter from "./filters/SearchTextFilter";

interface Props {
  isActive: boolean;
  onChange: (isActive: boolean) => void;
  bets: (BetResponse | BetRequestResponse)[];
}
function BetSearch({ isActive, onChange, bets }: Props) {
  return (
    <div>
      <BetSearchFilterProvider bets={bets}>
        <SearchTextFilter isActive={isActive} onChange={onChange} />
        {isActive && (
          <div className="mt-4 flex flex-col gap-2">
            <SearchInFilter />
            <SearchStatusFilter />
            <SearchCreateFilter />
            <SearchParticipantFilter />
            <BetSearchResults />
          </div>
        )}
      </BetSearchFilterProvider>
    </div>
  );
}

export default BetSearch;
