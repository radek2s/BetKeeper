export type RequestMethod = "POST" | "PUT" | "DELETE";

export const AUTH_MODE = process.env.NEXT_PUBLIC_AUTH_MODE ?? "CORBADO";

// biome-ignore lint/suspicious/noExplicitAny: This can be object, single string or antthing
export function sendRequest(url: string, method: RequestMethod, payload?: any) {
  return fetch(url, {
    method,
    headers: getHeaders(),
    body: payload ? JSON.stringify(payload) : undefined,
  });
}

/**
 * getRequest
 *
 * Send request to server API. When using manual mode it will
 * append to each request acitve user identifier from LocalStorage
 * @param url
 * @returns
 */
export function getRequest(url: string) {
  return fetch(url, { method: "GET", headers: getHeaders() });
}

// biome-ignore lint/suspicious/noExplicitAny: This can be object, single string or antthing
export function OkResponse(response: any, status: number = 200) {
  return new Response(JSON.stringify(response), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}

function getHeaders(): HeadersInit {
  if (AUTH_MODE !== "MANUAL") {
    return { "Content-Type": "application/json" };
  } else {
    const headers = new Headers({ "Content-Type": "application/json" });
    const userId =
      localStorage.getItem("active-user-id") ??
      process.env.NEXT_PUBLIC_USER_ID ??
      "";
    if (!userId) throw new Error("UserId must not be null!");

    headers.set("X-ACTIVE-USERID", userId);
    return headers;
  }
}
