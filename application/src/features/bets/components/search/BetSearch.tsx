import type { BetRequestResponse, BetResponse } from "../../model/betDto";
import { BetSearchResults } from "./components/BetSearchResults";

import SearchCreateFilter from "./components/SearchCreateFilter";
import SearchInFilter from "./components/SearchInFilter";
import SearchParticipantFilter from "./components/SearchParticipantFilter";
import SearchStatusFilter from "./components/SearchStatusFilter";
import SearchTextFilter from "./components/SearchTextFilter";
import { BetSearchFilterProvider } from "./context/BetSearchFilterProvider";

interface Props {
  isActive: boolean;
  onChange: (isActive: boolean) => void;
  bets: (BetResponse | BetRequestResponse)[];
}
function BetSearch({ isActive, onChange, bets }: Props) {
  return (
    <div className="bet-search">
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
