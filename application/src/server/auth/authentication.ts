import { Config, SDK } from "@corbado/node-sdk";
import { cookies } from "next/headers";
import type { NextRequest } from "next/server";
import NextUserRepository from "../repositories/NextUserRepository";

const projectId = process.env.NEXT_PUBLIC_CORBADO_PROJECT_ID;
const apiSecret = process.env.CORBADO_API_SECRET;

if (!projectId) {
  throw Error("Project ID is not set");
}

if (!apiSecret) {
  throw Error("API Secret is not set");
}

const frontendApi = process.env.CORBADO_FRONTEND_API;
const backendApi = process.env.CORBADO_BACKEND_API;

if (!frontendApi) {
  throw Error("Frontend API URL is not set");
}
if (!backendApi) {
  throw Error("Backend API URL is not set");
}

const config = new Config(projectId, apiSecret, frontendApi, backendApi);
const sdk = new SDK(config);

export async function getAuthenticatedUserFromCookie() {
  const reqCookies = await cookies();
  const sessionToken = reqCookies.get("cbo_session_token")?.value;
  if (!sessionToken) {
    return null;
  }
  try {
    const result = await sdk.sessions().validateToken(sessionToken);
    return await new NextUserRepository().findByProviderId(result.userId);
  } catch {
    return null;
  }
}

export async function getAuthenticatedUserFromAuthorizationHeader(
  req: NextRequest,
) {
  const sessionToken = req.headers.get("Authorization")?.replace("Bearer ", "");
  if (!sessionToken) {
    return null;
  }
  try {
    return await sdk.sessions().validateToken(sessionToken);
  } catch {
    return null;
  }
}

export async function validateToken(token?: string) {
  if (!token) throw new Error("Access Token is missing!");
  const result = await sdk.sessions().validateToken(token);
  const user = await new NextUserRepository().findByProviderId(result.userId);
  if (!user) throw new Error("User does not exists in BetKeeper");
  return user;
}

export function getAuthHeader() {
  return Buffer.from(`${projectId}:${apiSecret}`).toString("base64");
}

export function getBackendApi() {
  return backendApi;
}
