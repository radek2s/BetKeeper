import { userToObject } from "@app/lib/mappers/user";
import { OkResponse } from "@app/lib/utils/fetchUtils";
import { getAuth } from "@app/server/auth/authenticatorFactory";
import { CorbadoService } from "@app/server/auth/external/corbado/CorbadoService";
import { AuthenticationError } from "@app/server/exceptions/AuthenticationError";
import { ExceptionHandler } from "@app/server/exceptions/ExceptionHandler";
import type { ExceptionResponseBody } from "@app/server/exceptions/exception.interface";
import NextUserRepository from "@app/server/repositories/NextUserRepository";
import { NextUserRequestRepository } from "@app/server/repositories/NextUserRequestRepository";
import NextUserInvitationService from "@app/server/services/NextUserInvitationService";
import { NextUserService } from "@app/server/services/NextUserService";
import logger from "application/logger";

type AuthModeType = "CORBADO" | "MANUAL";
const AUTH_MODE: AuthModeType = (process.env.NEXT_PUBLIC_AUTH_MODE ??
  "CORBADO") as AuthModeType;

interface RouteParams {
  id: string;
}

type CreateUserBodySchema = {
  firstName: string;
  lastName: string;
};
/**
 * Create new user
 * @tag Admin
 * @description Create new user
 * @body CreateUserBodySchema
 * @response UserType
 * @openapi
 */
export async function POST(req: Request, { params }: { params: RouteParams }) {
  try {
    const user = await getAuth().getUser(req);
    if (user.role !== "ADMINISTRATOR")
      throw new AuthenticationError("User is not allowed to use this endpoint");

    const { id: requestId } = await params;
    const { firstName, lastName } = await req.json();

    if (!firstName) {
      const response: ExceptionResponseBody = {
        error: "Invalid form data",
        message: "First name must be provided",
      };
      return Response.json(response, {
        status: 400,
      });
    }

    if (!lastName) {
      const response: ExceptionResponseBody = {
        error: "Invalid form data",
        message: "Last name must be provided",
      };
      return Response.json(response, {
        status: 400,
      });
    }

    const userRepository = new NextUserRepository();

    const newUser = await NextUserInvitationService.approveUserRequest(
      requestId,
      user.id,
      firstName,
      lastName,
    );

    if (AUTH_MODE !== "MANUAL") {
      await createExternalUser(
        newUser.id,
        newUser.email.value,
        `${firstName} ${lastName}`.trim(),
        userRepository,
      );
    }

    logger.info(`[User Request][${requestId}][Approved] - by ${user.id}`);

    // biome-ignore lint/style/noNonNullAssertion: Request must exist because was previously approved.
    const request = (await new NextUserRequestRepository().findById(
      requestId,
    ))!;
    await NextUserService.sendFriendRequest(
      request.requesterId,
      request.inviteeEmail,
    );

    async function createExternalUser(
      userId: string,
      email: string,
      name: string,
      repository: NextUserRepository,
    ) {
      const providerId = await CorbadoService.service.createUser(email, name);
      await repository.attachProviderId(userId, providerId);
      logger.info(
        `[User Request][${requestId}][Created external user] - Provided id=${providerId}`,
      );
    }

    const result = await userRepository.findById(newUser.id);
    if (!result)
      return Response.json(null, {
        status: 500,
      });

    return OkResponse(userToObject(result));
  } catch (e) {
    return ExceptionHandler(e);
  }
}

/**
 * Reject user request
 * @tag Admin
 * @description Reject user request
 * @openapi
 */
export async function DELETE(
  req: Request,
  { params }: { params: RouteParams },
) {
  try {
    const user = await getAuth().getUser(req);
    if (user.role !== "ADMINISTRATOR")
      throw new AuthenticationError("User is not allowed to use this endpoint");

    const { id: requestId } = await params;

    await NextUserInvitationService.rejectInvitationRequest(requestId);
    logger.info(`[User Request][${requestId}][Rejected] by ${user.id}`);
    return OkResponse(null);
  } catch (e) {
    return ExceptionHandler(e);
  }
}
