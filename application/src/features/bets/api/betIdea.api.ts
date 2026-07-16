import { getRequest, sendRequest } from "@app/lib/utils/fetchUtils";
import { handleErrorResponse } from "@app/ui/api-handler/ApiErrorHandler";
import type { BetIdeaType } from "../model/betIdeaSchema";

export async function fetchBetIdeas(): Promise<BetIdeaType[]> {
  const url = "/api/v1/bet/idea";
  const res = await getRequest(url);
  if (!res.ok) throw new Error("Failed to fetch bet ideas");
  return res.json();
}

export async function saveBetIdea(content: string): Promise<BetIdeaType> {
  const url = "/api/v1/bet/idea";
  const res = await sendRequest(url, "POST", { content });
  if (!res.ok) await handleErrorResponse(res);
  return res.json();
}

export async function updateBetIdea(
  id: string,
  content: string,
): Promise<BetIdeaType> {
  const url = `/api/v1/bet/idea/${id}`;
  const res = await sendRequest(url, "PATCH", { content });
  if (!res.ok) await handleErrorResponse(res);
  return res.json();
}

export async function deleteBetIdea(id: string): Promise<void> {
  const url = `/api/v1/bet/idea/${id}`;
  const res = await sendRequest(url, "DELETE");
  if (!res.ok) await handleErrorResponse(res);
}
