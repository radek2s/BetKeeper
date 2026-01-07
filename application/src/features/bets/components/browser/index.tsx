"use client";
import { BetLoader } from "../BetLoader";
import BetBrowserComponent from "./BetBrowser";

function BetBrowser() {
  return (
    <BetLoader>
      {(bets) => <BetBrowserComponent key={bets.length} bets={bets} />}
    </BetLoader>
  );
}

export default BetBrowser;
