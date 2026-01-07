import type { AuthorizedUser } from "@app/lib/user/AuthorizedUser";
import { AuthenticationError } from "@app/server/exceptions/AuthenticationError";
import NextUserRepository from "@app/server/repositories/NextUserRepository";
import logger from "application/logger";
import type { AuthenticationProvider } from "../authentication.interface";

/**
 * Manualt Authentication Provider
 *
 * Used for tests to verify and validate request sent from application.
 */
export class ManualAuthProvider implements AuthenticationProvider {
  static #instance: ManualAuthProvider;
  static readonly header = "X-ACTIVE-USERID";

  private constructor() {
    logger.info("Using Manual Authentication Provider");
  }

  public static get provider(): ManualAuthProvider {
    if (!ManualAuthProvider.#instance) {
      ManualAuthProvider.#instance = new ManualAuthProvider();
    }
    return ManualAuthProvider.#instance;
  }

  async getUser(request?: Request): Promise<AuthorizedUser> {
    try {
      const userId = request?.headers.get(ManualAuthProvider.header);
      if (!userId)
        throw new AuthenticationError(
          `User not authenticated - Missing ${ManualAuthProvider.header} header and value`,
        );
      const user = await new NextUserRepository().findById(userId);
      if (!user)
        throw new AuthenticationError(
          `Not found user with given userId=${userId} in database`,
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
