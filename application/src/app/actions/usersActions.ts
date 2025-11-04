"use server";
import type { UUID } from "@domain/shared";
import { Email } from "@domain/user";
import type { UserRequestType } from "@domain/user/entities";
import { ACTIVE_USER_ID } from "application/src/constants";
import NextUserRepository from "application/src/core/repositories/NextUserRepository";
import { NextUserRequestRepository } from "application/src/core/repositories/NextUserRequestRepository";
import NextUserInvitationService from "application/src/core/services/NextUserInvitationService";
import NextUserService from "application/src/core/services/NextUserService";
import { userToObject } from "application/src/lib/mappers/user";
import { revalidatePath } from "next/cache";

const userRepository = new NextUserRepository();

export async function getPedingUserRequests(): Promise<UserRequestType[]> {
  try {
    const pending = await new NextUserRequestRepository().findAllPending();
    return pending.map((request) => request.toObject());
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

export async function getActiveUser() {
  return await userRepository.findById(ACTIVE_USER_ID);
}
