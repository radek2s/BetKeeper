import { ManualSession } from "@app/server/auth/session/manualSession";

export type RequestMethod = "POST" | "PUT" | "DELETE";

export const AUTH_MODE = process.env.NEXT_PUBLIC_AUTH_MODE ?? "CORBADO";

// biome-ignore lint/suspicious/noExplicitAny: This can be object, single string or antthing
export function sendRequest(url: string, method: RequestMethod, payload?: any) {
  return fetch(url, {
    method,
    headers: { "Content-Type": "application/json" },
    body: payload ? JSON.stringify(payload) : undefined,
  });
}

/**
 * getRequest
 *
 * Send request to server API. When using manual mode it will
 * append to each request acitve user identifier from ManualSessionManager
 * @param url
 * @returns
 */
export function getRequest(url: string) {
  return fetch(url, { method: "GET", headers: getHeaders() });
}

function getHeaders(): HeadersInit {
  if (AUTH_MODE !== "MANUAL") {
    return { "Content-Type": "application/json" };
  } else {
    const headers = new Headers({ "Content-Type": "application/json" });
    headers.set("X-ACTIVE-USERID", ManualSession.userId);
    return headers;
  }
}
