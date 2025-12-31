"use server";
import { Config, SDK } from "@corbado/node-sdk";
import logger from "application/logger";
import { cookies } from "next/headers";
import type { NextRequest } from "next/server";
import NextUserRepository from "../repositories/NextUserRepository";
import { getTestUser } from "./authentication.mock";
import { AuthenticationError, UserNotProvidedError } from "./dto";

const projectId = process.env.NEXT_PUBLIC_CORBADO_PROJECT_ID;
const apiSecret = process.env.CORBADO_API_SECRET;
const isTestMode = process.env.DISABLE_AUTH;

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
    const user = await new NextUserRepository().findByProviderId(result.userId);
    if (!user) throw new UserNotProvidedError(result.userId);
    return user;
  } catch (e) {
    if (e instanceof Error) logger.error(e.message);
    if (e instanceof AuthenticationError) throw e;
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
  if (isTestMode) return await getTestUser();
  if (!token) throw new AuthenticationError("Access Token is missing!");
  const result = await sdk.sessions().validateToken(token);
  const user = await new NextUserRepository().findByProviderId(result.userId);
  if (!user) throw new UserNotProvidedError(result.userId);
  return user;
}

export async function getAuthHeader() {
  return Buffer.from(`${projectId}:${apiSecret}`).toString("base64");
}

export async function getBackendApi() {
  return backendApi;
}
