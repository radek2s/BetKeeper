import {
  mapUserRequestWithRequester,
  type UserRequestWithRequester,
} from "@app/lib/mappers/user";
import { OkResponse } from "@app/lib/utils/fetchUtils";
import { getAuth } from "@app/server/auth/authenticatorFactory";
import { AuthenticationError } from "@app/server/exceptions/AuthenticationError";
import { ExceptionHandler } from "@app/server/exceptions/ExceptionHandler";
import NextUserRepository from "@app/server/repositories/NextUserRepository";
import { NextUserRequestRepository } from "@app/server/repositories/NextUserRequestRepository";
import type { UserType } from "@domain/user/entities";
import logger from "application/logger";

/**
 * Get all user requests
 * @tag Admin
 * @description Get all user requests
 * @response UserRequestWithRequester
 * @openapi
 */
export async function GET(req: Request) {
  try {
    const user = await getAuth().getUser(req);
    if (user.role !== "ADMINISTRATOR")
      throw new AuthenticationError("User is not allowed to use this endpoint");

    const userRepository = new NextUserRepository();

    const pending = await new NextUserRequestRepository().findAllPending();
    const requesterIdSet = new Set(
      pending.map((request) => request.requesterId),
    );
    const requesterMap = new Map<string, UserType>();
    const requesterPromises = await Promise.allSettled(
      [...requesterIdSet].map((userId) => userRepository.findById(userId)),
    );

    requesterPromises.forEach((promise) => {
      if (promise.status === "fulfilled") {
        if (promise.value != null) {
          requesterMap.set(promise.value.id, promise.value.toObject());
        }
      }
      if (promise.status === "rejected") {
        logger.error(`Failed to load user! ${promise.reason}`);
      }
    });

    const result: UserRequestWithRequester[] = pending
      .map((request) => request.toObject())
      .map((request) =>
        mapUserRequestWithRequester(
          request,
          requesterMap.get(request.requesterId),
        ),
      );

    return OkResponse(result);
  } catch (e) {
    return ExceptionHandler(e);
  }
}
