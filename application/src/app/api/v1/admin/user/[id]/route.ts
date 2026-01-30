import { userToObject } from "@app/lib/mappers/user";
import { OkResponse } from "@app/lib/utils/fetchUtils";
import { getAuth } from "@app/server/auth/authenticatorFactory";
import { AuthenticationError } from "@app/server/exceptions/AuthenticationError";
import { ExceptionHandler } from "@app/server/exceptions/ExceptionHandler";
import type { ExceptionResponseBody } from "@app/server/exceptions/exception.interface";
import NextUserRepository from "@app/server/repositories/NextUserRepository";
import logger from "application/logger";

interface RouteParams {
  id: string;
}

export async function PATCH(req: Request, { params }: { params: RouteParams }) {
  try {
    const user = await getAuth().getUser(req);
    if (user.role !== "ADMINISTRATOR")
      throw new AuthenticationError("User is not allowed to use this endpoint");

    const { id: userId } = await params;

    const userRepository = new NextUserRepository();
    const targetUser = await userRepository.findById(userId);

    if (!targetUser) {
      const response: ExceptionResponseBody = {
        error: "User not found",
        message: `User with id ${userId} not found`,
      };
      return Response.json(response, {
        status: 404,
      });
    }

    if (targetUser.isActive()) {
      targetUser.deactivate();
      logger.info(`[User][${userId}][Deactivated] by ${user.id}`);
    } else {
      targetUser.activate();
      logger.info(`[User][${userId}][Activated] by ${user.id}`);
    }

    await userRepository.save(targetUser);

    return OkResponse(userToObject(targetUser));
  } catch (e) {
    return ExceptionHandler(e);
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: RouteParams },
) {
  try {
    const user = await getAuth().getUser(req);
    if (user.role !== "ADMINISTRATOR")
      throw new AuthenticationError("User is not allowed to use this endpoint");

    const { id: userId } = await params;

    const userRepository = new NextUserRepository();
    const targetUser = await userRepository.findById(userId);

    if (!targetUser) {
      const response: ExceptionResponseBody = {
        error: "User not found",
        message: `User with id ${userId} not found`,
      };
      return Response.json(response, {
        status: 404,
      });
    }

    targetUser.suspend();
    await userRepository.save(targetUser);
    logger.info(`[User][${userId}][Suspended] by ${user.id}`);

    return OkResponse(null);
  } catch (e) {
    return ExceptionHandler(e);
  }
}
