import { APIResponse } from "@playwright/test";
import { ApiError } from "e2e-tests/src/api/Errors";

export function getHeaders(activeUserId: string) {
  return {
    "Content-Type": "application/json",
    "x-active-userid": activeUserId,
  };
}

export async function handleResponse<T>(response: APIResponse): Promise<T> {
  if (!response.ok())
    throw new ApiError(response.status(), await response.json());
  return await response.json();
}