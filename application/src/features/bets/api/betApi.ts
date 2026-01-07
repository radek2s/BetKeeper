import { getRequest, sendRequest } from "@app/lib/utils/fetchUtils";
import type { BetRequestCreate } from "../components/wizzard/types";
import type { BetRequestResponse, BetResponse } from "../model/betDto";

export async function fetchBets(): Promise<
  (BetResponse | BetRequestResponse)[]
> {
  const url = "/api/v1/bet";
  const res = await getRequest(url);
  if (!res.ok) throw new Error("Failed to fetch bets");
  return res.json();
}

export async function fetchBet(
  betId: string,
): Promise<BetResponse | BetRequestResponse> {
  const url = `/api/v1/bet/${betId}`;
  const res = await getRequest(url);
  if (!res.ok) throw new Error("Failed to fetch bet");
  return res.json();
}

export async function createBetRequest(
  request: BetRequestCreate,
): Promise<BetResponse | BetRequestResponse> {
  const url = `/api/v1/bet`;
  const res = await sendRequest(url, "POST", request);
  if (!res.ok) throw new Error("Failed to create bet");
  return res.json();
}

export async function deleteBet(betId: string): Promise<void> {
  const url = `/api/v1/bet/${betId}`;
  const res = await sendRequest(url, "DELETE");
  if (!res.ok) throw new Error("Failed to delete bet");
}
