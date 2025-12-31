"use client";
import { useEffect, useState } from "react";
import {
  type BetRequestResponse,
  type BetResponse,
  isBetResponse,
} from "../../model/betDto";
import { BetCard } from "../BetCard";
import BetEmptyList from "./BetEmptyList";
import { BetTabIcon } from "./BetTabIcon";
import type { TabName } from "./types";

interface Props {
  bets: (BetRequestResponse | BetResponse)[];
}
function BetBrowser({ bets }: Props) {
  const [activeTab, setActiveTab] = useState<TabName>("requests");
  const [activeBets, setActiveBets] = useState<
    (BetRequestResponse | BetResponse)[]
  >([]);

  const { requests, pending, resolved, completed } = groupBets(bets);

  const changeTab = (tabName: TabName) => {
    console.log(tabName);
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
          icon="timeline"
          name="In progress"
        />
        <BetTabIcon
          isActive={activeTab === "completed"}
          onClick={() => changeTab("completed")}
          icon="fact-check"
          name="Finished"
        />
      </div>
      <section key={activeTab}>
        <div className="flex flex-col gap-3">
          {activeBets.length === 0 ? (
            <BetEmptyList tabName={activeTab} />
          ) : (
            <>
              {activeBets.map((request) => (
                <BetCard key={request.id} bet={request} />
              ))}
            </>
          )}
        </div>
      </section>
    </div>
  );
}

function groupBets(bets: (BetRequestResponse | BetResponse)[]) {
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
  console.log({ requests, pending, resolved, completed });
  return {
    requests,
    pending,
    resolved,
    completed,
  };
}

export default BetBrowser;
