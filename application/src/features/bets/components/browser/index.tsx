"use client";
import { BetLoader } from "../BetLoader";
import BetBrowserComponent from "./BetBrowser";

function BetBrowser() {
  return <BetLoader>{(bets) => <BetBrowserComponent bets={bets} />}</BetLoader>;
}

export default BetBrowser;
