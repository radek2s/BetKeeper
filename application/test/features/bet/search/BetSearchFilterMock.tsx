import {
  BetSearchFilterContext,
  type BetSearchFilterContextType,
} from "@app/features/bets/components/search/context/BetSearchFilterProvider";
import type { PropsWithChildren } from "react";

type Props = PropsWithChildren & Partial<BetSearchFilterContextType>;
export function BetSearchFilterMock({ children, ...ctx }: Props) {
  const context: BetSearchFilterContextType = {
    bets: [],
    searchText: null,
    setSearchText: () => {},
    searchIn: null,
    setSearchIn: () => {},
    status: null,
    setStatus: () => {},
    createdAfter: null,
    setCreatedAfter: () => {},
    createdBefore: null,
    setCreatedBefore: () => {},
    participantIds: null,
    setParticipant: () => {},
    ...ctx,
  };

  return (
    <BetSearchFilterContext.Provider value={context}>
      {children}
    </BetSearchFilterContext.Provider>
  );
}
