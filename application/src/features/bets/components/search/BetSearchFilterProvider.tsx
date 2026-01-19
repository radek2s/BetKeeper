import type { BetStatus } from "@domain/bet";
import {
  createContext,
  type PropsWithChildren,
  useContext,
  useState,
} from "react";
import type { BetRequestResponse, BetResponse } from "../../model/betDto";

export type SearchInType = "CREATOR" | "INVITED";
export type SearchStatusType = BetStatus;
export type BetSearchFilterContextType = {
  bets: (BetRequestResponse | BetResponse)[];
  searchText: string | null;
  setSearchText: (text: string | null) => void;
  searchIn: SearchInType | null;
  setSearchIn: (search: SearchInType | null) => void;
  status: BetStatus[] | null;
  setStatus: (status: BetStatus) => void;
  createdAfter: string | null;
  setCreatedAfter: (createdAfter: string | null) => void;
  createdBefore: string | null;
  setCreatedBefore: (createdBefore: string | null) => void;
  participantIds: string[] | null;
  setParticipant: (participantId: string) => void;
};

export const BetSearchFilterContext =
  createContext<BetSearchFilterContextType | null>(null);

interface Props extends PropsWithChildren {
  bets: (BetRequestResponse | BetResponse)[];
}
export function BetSearchFilterProvider({ bets, children }: Props) {
  const [searchText, setSearchText] = useState<string | null>(null);
  const [searchIn, setSearchIn] = useState<SearchInType | null>(null);
  const [status, _setStatus] = useState<BetStatus[] | null>(null);
  const [createdAfter, setCreatedAfter] = useState<string | null>(null);
  const [createdBefore, setCreatedBefore] = useState<string | null>(null);
  const [participantIds, _setParticiapntIds] = useState<string[] | null>(null);

  const setStatus = (newStatus: BetStatus) => {
    if (status?.includes(newStatus)) {
      _setStatus(
        (old) => old?.filter((oldStatus) => oldStatus !== newStatus) || null,
      );
    } else {
      _setStatus((old) => (!old ? [newStatus] : [...old, newStatus]));
    }
  };

  const setParticipant = (participantId: string) => {
    if (participantIds?.includes(participantId)) {
      _setParticiapntIds(
        (old) => old?.filter((oldId) => oldId !== participantId) || null,
      );
    } else {
      _setParticiapntIds((old) =>
        !old ? [participantId] : [...old, participantId],
      );
    }
  };

  return (
    <BetSearchFilterContext.Provider
      value={{
        bets,
        searchText,
        setSearchText,
        searchIn,
        setSearchIn,
        status,
        setStatus,
        createdAfter,
        setCreatedAfter,
        createdBefore,
        setCreatedBefore,
        participantIds,
        setParticipant,
      }}>
      {children}
    </BetSearchFilterContext.Provider>
  );
}

export function useBetSearchFilter() {
  const ctx = useContext(BetSearchFilterContext);

  if (!ctx) throw new Error("BetSearchFilter must be used within provider");

  return ctx;
}
