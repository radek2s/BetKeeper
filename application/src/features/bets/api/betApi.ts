import type { BetRequestResponse, BetResponse } from "../model/betDto";

export async function fetchBets(): Promise<
  (BetResponse | BetRequestResponse)[]
> {
  const url = "/api/v1/bet";
  const res = await fetch(url);
  if (!res.ok) throw new Error("Failed to fetch bets");
  return res.json();
}

export async function fetchBet(
  betId: string,
): Promise<BetResponse | BetRequestResponse> {
  const url = `/api/v1/bet/${betId}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error("Failed to fetch bet");
  return res.json();
}
