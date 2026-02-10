import { userToObject } from "@app/lib/mappers/user";
import { OkResponse } from "@app/lib/utils/fetchUtils";
import { getAuth } from "@app/server/auth/authenticatorFactory";
import { AuthenticationError } from "@app/server/exceptions/AuthenticationError";
import { ExceptionHandler } from "@app/server/exceptions/ExceptionHandler";
import NextUserRepository from "@app/server/repositories/NextUserRepository";
import { UserStatus } from "@domain/user";
import type { UserType } from "@domain/user/entities";

/**
 * Get all application users
 * @tag Admin
 * @description Get all application users
 * @response UserType[]
 * @openapi
 */
export async function GET(req: Request) {
  try {
    const user = await getAuth().getUser(req);
    if (user.role !== "ADMINISTRATOR")
      throw new AuthenticationError("User is not allowed to use this endpoint");

    const users = await new NextUserRepository().findAll();
    const result: UserType[] = users
      .filter(({ status }) => status !== UserStatus.SUSPENDED)
      .map(userToObject);

    return OkResponse(result);
  } catch (e) {
    return ExceptionHandler(e);
  }
}
