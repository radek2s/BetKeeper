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

export async function approveBet(betId: string): Promise<void> {
  const url = `/api/v1/bet/${betId}/approve`;
  const res = await sendRequest(url, "PUT");
  if (!res.ok) throw new Error("Failed to approve betRequest");
}

export async function rejectBet(betId: string): Promise<void> {
  const url = `/api/v1/bet/${betId}/reject`;
  const res = await sendRequest(url, "PUT");
  if (!res.ok) throw new Error("Failed to reject betRequest");
}

export async function updateTerms(betId: string, terms: string): Promise<void> {
  const url = `/api/v1/bet/${betId}/terms`;
  const res = await sendRequest(url, "PUT", { terms });
  if (!res.ok) throw new Error("Failed to update betRequest terms");
}

export async function updateStakes(
  betId: string,
  stakes: string,
): Promise<void> {
  const url = `/api/v1/bet/${betId}/stakes`;
  const res = await sendRequest(url, "PUT", { stakes });
  if (!res.ok) throw new Error("Failed to update betRequest stakes");
}

export async function updateClaims(
  betId: string,
  claims: string,
): Promise<void> {
  const url = `/api/v1/bet/${betId}/claims`;
  const res = await sendRequest(url, "PUT", { claims });
  if (!res.ok) throw new Error("Failed to update betRequest claims");
}

export async function startBet(betId: string): Promise<void> {
  const url = `/api/v1/bet/${betId}/start`;
  const res = await sendRequest(url, "PUT");
  if (!res.ok) throw new Error("Failed to start bet");
}

export async function resolveBet(
  betId: string,
  winnerId: string,
): Promise<void> {
  const url = `/api/v1/bet/${betId}/resolve`;
  const res = await sendRequest(url, "PUT", { winnerId });
  if (!res.ok) throw new Error("Failed to resolve bet");
}

export async function completeBet(betId: string): Promise<void> {
  const url = `/api/v1/bet/${betId}/complete`;
  const res = await sendRequest(url, "PUT");
  if (!res.ok) throw new Error("Failed to complete bet");
}
