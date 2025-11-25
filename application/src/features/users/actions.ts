"use server";
import {
  getAuthHeader,
  getBackendApi,
  validateToken,
} from "@app/server/auth/authentication";
import {
  getIdentifierRequest,
  getRequestInt,
  getUserRequest,
} from "@app/server/auth/dto";
import NextUserRepository from "@app/server/repositories/NextUserRepository";
import { NextUserRequestRepository } from "@app/server/repositories/NextUserRequestRepository";
import NextUserInvitationService from "@app/server/services/NextUserInvitationService";
import { NextUserService } from "@app/server/services/NextUserService";
import type { UUID } from "@domain/shared";
import { Email, UserStatus } from "@domain/user";
import type { UserType } from "@domain/user/entities";
import logger from "application/logger";

import {
  mapUserRequestWithRequester,
  type UserRequestWithRequester,
  userToObject,
} from "application/src/lib/mappers/user";
import { revalidatePath } from "next/cache";

const userRepository = new NextUserRepository();

export async function getPedingUserRequests(): Promise<
  UserRequestWithRequester[]
> {
  try {
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

    return pending
      .map((request) => request.toObject())
      .map((request) =>
        mapUserRequestWithRequester(
          request,
          requesterMap.get(request.requesterId),
        ),
      );
  } catch (e) {
    logger.error(e);
    throw e;
  }
}

export async function getAllUsers() {
  try {
    const users = await new NextUserRepository().findAll();
    return users.map(userToObject);
  } catch (e) {
    logger.error(e);
    throw e;
  }
}

export async function getAllActiveUsers() {
  try {
    const users = await getAllUsers();
    return users.filter(({ status }) => status !== UserStatus.SUSPENDED);
  } catch (e) {
    logger.error(e);
    throw e;
  }
}

export async function approveUserRequest(
  requestId: UUID,
  firstName: string,
  lastName: string,
  token: string | undefined,
) {
  const requestingUser = await validateToken(token);

  try {
    const user = await NextUserInvitationService.approveInvitationRequest(
      requestId,
      requestingUser.id,
      firstName,
      lastName,
    );

    const providerId = await createCorbadoUser(
      user.email.value,
      `${firstName} ${lastName}`,
    );
    await new NextUserRepository().attachProviderId(user.id, providerId);
    logger.info(
      `[User Request][${requestId}][Approved] - by ${requestingUser.id}`,
    );

    // biome-ignore lint/style/noNonNullAssertion: Request must exist because was previously approved.
    const request = (await new NextUserRequestRepository().findById(
      requestId,
    ))!;
    await NextUserService.sendFriendRequest(
      request.requesterId,
      request.inviteeEmail,
    );

    //Approved and created user -> so send invitation to friend
    revalidatePath(`/users`);
  } catch (e) {
    logger.error(e);
    throw e;
  }
}

export async function rejectUserRequest(
  requestId: UUID,
  token: string | undefined,
) {
  const user = await validateToken(token);

  try {
    await NextUserInvitationService.rejectInvitationRequest(requestId);
    logger.info(`[User Request][${requestId}][Rejected] by ${user.id}`);
    revalidatePath(`/users`);
  } catch (e) {
    logger.error(e);
    throw e;
  }
}

export async function createUserRequest(
  inviteeEmail: string,
  token: string | undefined,
  revalidate: boolean = true,
) {
  const user = await validateToken(token);
  try {
    const email = new Email(inviteeEmail);
    if (await NextUserService.userExists(email)) {
      throw new Error("User already exists!");
    }
    const userRequest = await NextUserService.sendUserRequest(user.id, email);
    logger.info(
      `[User Request][${userRequest.id}][Created] - Invited ${userRequest.inviteeEmail} by ${user.id}`,
    );
    if (revalidate) revalidatePath(`/users`);
  } catch (e) {
    if (e instanceof Error) {
      logger.error(e.message);
    }
    throw e;
  }
}

export async function updateAvatar(
  userId: string,
  avatarUrl: string,
  token: string | undefined,
) {
  const requestingUser = await validateToken(token);

  try {
    const user = await userRepository.findById(userId);
    if (!user) throw new Error("User was not found!");
    user.avatarUrl = avatarUrl;
    await userRepository.save(user);
    logger.info(
      `[User][${userId}][Updated] - Updated avatar to ${avatarUrl} by ${requestingUser.id}`,
    );
    revalidatePath(`/profile`);
  } catch (e) {
    logger.error(e);
  }
}

export async function toggleUserStatus(
  userId: string,
  token: string | undefined,
) {
  const requestingUser = await validateToken(token);

  try {
    const user = await userRepository.findById(userId);
    if (!user) throw new Error("User with id not found!");
    if (user.isActive()) {
      user.deactivate();
      logger.info(`[User][${userId}][Deactivated] by ${requestingUser.id}`);
    } else {
      user.activate();
      logger.info(`[User][${userId}][Activated] by ${requestingUser.id}`);
    }
    await userRepository.save(user);
    revalidatePath(`/users`);
  } catch (e) {
    logger.error(e);
  }
}

export async function suspendUser(userId: string, token: string | undefined) {
  const requestingUser = await validateToken(token);

  try {
    const user = await userRepository.findById(userId);
    if (!user) throw new Error("User with id not found!");
    user.suspend();
    await userRepository.save(user);
    logger.info(`[User][${userId}][Suspended] by ${requestingUser.id}`);
    revalidatePath(`/users`);
  } catch (e) {
    logger.error(e);
  }
}

async function createCorbadoUser(userEmail: string, fullName: string) {
  const res = await fetch(
    `${await getBackendApi()}/v2/users`,
    getRequestInt(await getAuthHeader(), getUserRequest(fullName)),
  );
  const { userID } = await res.json();

  await fetch(
    `${await getBackendApi()}/v2/users/${userID}/identifiers`,
    getRequestInt(await getAuthHeader(), getIdentifierRequest(userEmail)),
  );

  return userID;
}

export async function getUserDetails(userId: string) {
  const user = await userRepository.findById(userId);
  if (!user) throw new Error("User not found");
  return user;
}
