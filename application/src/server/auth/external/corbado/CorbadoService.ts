import logger from "application/logger";
import { AuthenticationProvider } from "../../authentication.interface";
import { getIdentifierRequest, getRequestInt, getUserRequest } from "../../dto";
import { CorbadoAuthProvider } from "../../providers/cobradoAuth";

export class CorbadoService {
  static #instance: CorbadoService;
  private provider: CorbadoAuthProvider;

  private constructor() {
    this.provider = CorbadoAuthProvider.provider;
  }

  public static get service(): CorbadoService {
    if (!CorbadoService.#instance) {
      CorbadoService.#instance = new CorbadoService();
    }
    return CorbadoService.#instance;
  }

  async createUser(email: string, fullName: string): Promise<string> {
    try {
      const createUserUrl = `${this.provider.backendApi}/v2/users`;
      const response = await fetch(
        createUserUrl,
        getRequestInt(this.provider.authHeader, getUserRequest(fullName)),
      );
      const { userID } = await response.json();

      const identifiersUrl = `${this.provider.backendApi}/v2/users/${userID}/identifiers`;
      await fetch(
        identifiersUrl,
        getRequestInt(this.provider.authHeader, getIdentifierRequest(email)),
      );

      return userID;
    } catch (e) {
      logger.error(e);
      throw e;
    }
  }
}
