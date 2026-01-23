"use client";
import { useEffect, useState } from "react";
import {
  type BetRequestResponse,
  type BetResponse,
  type BetResponseType,
  isBetResponse,
} from "../../model/betDto";
import { BetCard } from "../BetCard";
import BetEmptyList from "./BetEmptyList";
import BetSortBtn from "./BetSortBtn";
import { BetTabIcon } from "./BetTabIcon";
import { sortByCreatedAt, sortByUpdatedAt } from "./sortUtils";
import type { SortType, TabName } from "./types";

interface Props {
  bets: BetResponseType[];
}
function BetBrowser({ bets }: Props) {
  const [activeTab, setActiveTab] = useState<TabName>("requests");
  const [activeBets, setActiveBets] = useState<
    (BetRequestResponse | BetResponse)[]
  >([]);
  const [sortConfig, setSortConfig] = useState<SortType>({
    sortBy: null,
    order: null,
  });

  const { requests, pending, resolved, completed } = groupBets(bets);

  const changeTab = (tabName: TabName) => {
    setActiveTab(tabName);
    switch (tabName) {
      case "requests": {
        setActiveBets([...requests]);
        break;
      }
      case "pending": {
        setActiveBets([...pending]);
        break;
      }
      case "resolved": {
        setActiveBets([...resolved]);
        break;
      }
      case "completed": {
        setActiveBets([...completed]);
        break;
      }
    }
  };

  //   biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  useEffect(() => {
    changeTab("requests");
  }, []);

  const getSorted = (a: BetResponseType, b: BetResponseType) => {
    if (sortConfig.sortBy === "UPDATED") {
      return sortByUpdatedAt(a, b);
    }
    return sortByCreatedAt(a, b);
  };
  const sortedBets = activeBets.sort(getSorted);
  const orderedBets =
    sortConfig.order === "ASC" ? sortedBets : sortedBets.reverse();

  return (
    <div className="min-w-[400px]">
      <div className="flex justify-between my-4">
        <BetTabIcon
          isActive={activeTab === "requests"}
          onClick={() => changeTab("requests")}
          icon="waving-hand"
          name="Requests"
        />
        <BetTabIcon
          isActive={activeTab === "pending"}
          onClick={() => changeTab("pending")}
          icon="handshake"
          name="Unresolved"
        />
        <BetTabIcon
          isActive={activeTab === "resolved"}
          onClick={() => changeTab("resolved")}
          icon="gift"
          name="Unclaimed"
        />
        <BetTabIcon
          isActive={activeTab === "completed"}
          onClick={() => changeTab("completed")}
          icon="fact-check"
          name="Finished"
        />
      </div>
      <section key={activeTab}>
        <div className="flex flex-col mt-6">
          {activeBets.length === 0 ? (
            <BetEmptyList tabName={activeTab} />
          ) : (
            <div>
              <div className="flex justify-end mb-3">
                <BetSortBtn state={sortConfig} onChange={setSortConfig} />
              </div>

              <div className="flex flex-col gap-3">
                {orderedBets.map((request) => (
                  <BetCard key={request.id} bet={request} />
                ))}
              </div>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}

function groupBets(bets: BetResponseType[]) {
  const requests: BetRequestResponse[] = [];
  const pending: BetResponse[] = [];
  const resolved: BetResponse[] = [];
  const completed: BetResponse[] = [];

  bets.forEach((bet) => {
    if (isBetResponse(bet)) {
      switch (bet.status) {
        case "pending": {
          pending.push(bet);
          break;
        }
        case "resolved": {
          resolved.push(bet);
          break;
        }
        case "completed": {
          completed.push(bet);
          break;
        }
      }
    } else {
      requests.push(bet);
    }
  });

  return {
    requests,
    pending,
    resolved,
    completed,
  };
}

export default BetBrowser;
