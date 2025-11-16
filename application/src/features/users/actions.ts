"use server";
import NextUserRepository from "@app/server/repositories/NextUserRepository";
import { NextUserRequestRepository } from "@app/server/repositories/NextUserRequestRepository";
import NextUserInvitationService from "@app/server/services/NextUserInvitationService";
import NextUserService from "@app/server/services/NextUserService";
import type { UUID } from "@domain/shared";
import { Email, UserStatus } from "@domain/user";
import type { UserType } from "@domain/user/entities";
import logger from "application/logger";
import { ACTIVE_USER_ID } from "application/src/constants";

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
      requesterIdSet.values().map((userId) => userRepository.findById(userId)),
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
  approvedBy: UUID,
) {
  try {
    await NextUserInvitationService.approveInvitationRequest(
      requestId,
      approvedBy,
      firstName,
      lastName,
    );
    logger.info(`[User Request][${requestId}][Approved] - by ${approvedBy}`);
    revalidatePath(`/users`);
  } catch (e) {
    logger.error(e);
    throw e;
  }
}

export async function rejectUserRequest(requestId: UUID) {
  try {
    await NextUserInvitationService.rejectInvitationRequest(requestId);
    logger.info(`[User Request][${requestId}][Rejected]`);
    revalidatePath(`/users`);
  } catch (e) {
    logger.error(e);
    throw e;
  }
}

interface SendUserRequestType {
  requesterId: UUID;
  inviteeEmail: string;
}

export async function createUserRequest({
  requesterId,
  inviteeEmail,
}: SendUserRequestType) {
  try {
    const email = new Email(inviteeEmail);
    if (await NextUserService.userExists(email)) {
      throw new Error("User already exists!");
    }
    const userRequest = await NextUserService.sendUserRequest(
      requesterId,
      email,
    );
    logger.info(
      `[User Request][${userRequest.id}][Created] - Invited ${userRequest.inviteeEmail} by ${requesterId}`,
    );
    revalidatePath(`/users`);
  } catch (e) {
    if (e instanceof Error) {
      logger.error(e.message);
    }
    throw e;
  }
}

export async function updateAvatar(userId: string, avatarUrl: string) {
  try {
    const user = await userRepository.findById(userId);
    if (!user) throw new Error("User was not found!");
    user.avatarUrl = avatarUrl;
    await userRepository.save(user);
    logger.info(`[User][${userId}][Updated] - Updated avatar to ${avatarUrl}`);
    revalidatePath(`/profile`);
  } catch (e) {
    logger.error(e);
  }
}

export async function toggleUserStatus(userId: string) {
  try {
    const user = await userRepository.findById(userId);
    if (!user) throw new Error("User with id not found!");
    if (user.isActive()) {
      user.deactivate();
      logger.info(`[User][${userId}][Deactivated]`);
    } else {
      user.activate();
      logger.info(`[User][${userId}][Activated]`);
    }
    await userRepository.save(user);
    revalidatePath(`/users`);
  } catch (e) {
    logger.error(e);
  }
}

export async function suspendUser(userId: string) {
  try {
    const user = await userRepository.findById(userId);
    if (!user) throw new Error("User with id not found!");
    user.suspend();
    await userRepository.save(user);
    logger.info(`[User][${userId}][Suspended]`);
    revalidatePath(`/users`);
  } catch (e) {
    logger.error(e);
  }
}

export async function getActiveUser() {
  return await userRepository.findById(ACTIVE_USER_ID);
}
