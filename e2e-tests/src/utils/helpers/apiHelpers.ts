import { APIResponse } from "@playwright/test";

export function getHeaders(activeUserId: string) {
  return {
    "Content-Type": "application/json",
    "x-active-userid": activeUserId,
  };
}

export async function getBody<T>(response: APIResponse): Promise<T> {
  return await response.json();
}