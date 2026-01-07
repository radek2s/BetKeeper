import { AuthenticationError } from "@app/server/exceptions/AuthenticationError";
import { ConfigurationError } from "@app/server/exceptions/ConfigurationError";
import NextUserRepository from "@app/server/repositories/NextUserRepository";
import { Config, SDK } from "@corbado/node-sdk";
import type { User } from "@domain/user";
import logger from "application/logger";
import { cookies } from "next/headers";
import type { AuthenticationProvider } from "../authentication.interface";

/**
 * Corbado Authorization Provider
 *
 * Verify and validate user request based on the active user session
 * according to corbado session cookie.
 */
export class CorbadoAuthProvider implements AuthenticationProvider {
  static #instance: CorbadoAuthProvider;

  private sdk;

  private constructor() {
    logger.info("Using Corbado Authentication Provider");
    const projectId = process.env.NEXT_PUBLIC_CORBADO_PROJECT_ID;
    if (!projectId)
      throw new ConfigurationError("Corbado project ID is not defined!");
    const apiSecret = process.env.CORBADO_API_SECRET;
    if (!apiSecret)
      throw new ConfigurationError("Corbado API secret is not defined!");
    const frontendApi = process.env.CORBADO_FRONTEND_API;
    if (!frontendApi)
      throw new ConfigurationError("Corbado fronted API is not defined!");
    const backendApi = process.env.CORBADO_BACKEND_API;
    if (!backendApi)
      throw new ConfigurationError("Corbado backend API is not defined!");

    const configuration = new Config(
      projectId,
      apiSecret,
      frontendApi,
      backendApi,
    );
    this.sdk = new SDK(configuration);
  }

  public static get provider(): CorbadoAuthProvider {
    if (!CorbadoAuthProvider.#instance) {
      CorbadoAuthProvider.#instance = new CorbadoAuthProvider();
    }
    return CorbadoAuthProvider.#instance;
  }

  async getUser(): Promise<User> {
    try {
      const requestCookies = await cookies();
      const sessionToken = requestCookies.get("cbo_session_token")?.value;
      if (!sessionToken)
        throw new AuthenticationError(
          "User not authenticated - Missing session token.",
        );
      const corbadoUser = await this.sdk.sessions().validateToken(sessionToken);
      const user = await new NextUserRepository().findByProviderId(
        corbadoUser.userId,
      );
      if (!user)
        throw new AuthenticationError(
          `User account [corbadoId=${corbadoUser.userId}] is not allowed to use BetKeeper. Not found in application database.`,
        );
      return user;
    } catch (e) {
      if (e instanceof Error) {
        logger.error(e.message);
      }
      throw e;
    }
  }
}
