"use client";
import { BetLoader } from "../BetLoader";
import { BetBrowserSkeleton } from "../HomePageSkeleton";
import BetBrowserComponent from "./BetBrowser";

function BetBrowser() {
  return (
    <BetLoader loader={<BetBrowserSkeleton />}>
      {(bets) => <BetBrowserComponent key={bets.length} bets={bets} />}
    </BetLoader>
  );
}

export default BetBrowser;
