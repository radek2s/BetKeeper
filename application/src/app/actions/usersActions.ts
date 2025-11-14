"use server";
import type { UUID } from "@domain/shared";
import { Email, UserStatus } from "@domain/user";
import type { UserRequestType, UserType } from "@domain/user/entities";
import { ACTIVE_USER_ID } from "application/src/constants";
import NextUserRepository from "application/src/core/repositories/NextUserRepository";
import { NextUserRequestRepository } from "application/src/core/repositories/NextUserRequestRepository";
import NextUserInvitationService from "application/src/core/services/NextUserInvitationService";
import NextUserService from "application/src/core/services/NextUserService";
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
        console.error(`Failed to load user! ${promise.reason}`);
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
    console.error(e);
    throw e;
  }
}

export async function getAllUsers() {
  try {
    const users = await new NextUserRepository().findAll();
    return users.map(userToObject);
  } catch (e) {
    console.error(e);
    throw e;
  }
}

export async function getAllActiveUsers() {
  try {
    const users = await getAllUsers();
    return users.filter(({ status }) => status !== UserStatus.SUSPENDED);
  } catch (e) {
    console.error(e);
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
    revalidatePath(`/users`);
  } catch (e) {
    console.error(e);
    throw e;
  }
}

export async function rejectUserRequest(requestId: UUID) {
  try {
    await NextUserInvitationService.rejectInvitationRequest(requestId);
    revalidatePath(`/users`);
  } catch (e) {
    console.error(e);
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
    await NextUserService.sendUserRequest(requesterId, new Email(inviteeEmail));
    revalidatePath(`/users`);
  } catch (e) {
    console.error(e);
  }
}

export async function updateAvatar(userId: string, avatarUrl: string) {
  try {
    const user = await userRepository.findById(userId);
    if (!user) throw new Error("User was not found!");
    user.avatarUrl = avatarUrl;
    await userRepository.save(user);
    revalidatePath(`/profile`);
  } catch (e) {
    console.error(e);
  }
}

export async function toggleUserStatus(userId: string) {
  try {
    const user = await userRepository.findById(userId);
    if (!user) throw new Error("User with id not found!");
    console.log(user.isActive());
    if (user.isActive()) {
      user.deactivate();
    } else {
      user.activate();
    }
    await userRepository.save(user);
    revalidatePath(`/users`);
  } catch (e) {
    console.error(e);
  }
}

export async function suspendUser(userId: string) {
  try {
    const user = await userRepository.findById(userId);
    if (!user) throw new Error("User with id not found!");
    user.suspend();
    await userRepository.save(user);
    revalidatePath(`/users`);
  } catch (e) {
    console.error(e);
  }
}

export async function getActiveUser() {
  return await userRepository.findById(ACTIVE_USER_ID);
}
