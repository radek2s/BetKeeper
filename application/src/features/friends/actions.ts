"use server";
import { UserNotExistsError } from "@app/lib/user/UserErrors";
import { validateToken } from "@app/server/auth/authentication";
import { NextFriendListRepository } from "@app/server/repositories/NextFriendListRepository";
import NextUserRepository from "@app/server/repositories/NextUserRepository";
import { NextUserRequestRepository } from "@app/server/repositories/NextUserRequestRepository";
import { NextUserService } from "@app/server/services/NextUserService";
import type { UUID } from "@domain/shared";
import { Email } from "@domain/user";
import { revalidatePath } from "next/cache";
import {
  type FriendInvitation,
  friendRequestToInvitationDto,
  userRequestToInvitationDto,
} from "./model/friendsDto";

export async function sendFriendRequest(
  email: string,
  token: string | undefined,
) {
  const requestingUser = await validateToken(token);
  const friendEmail = new Email(email);
  const userExists = await NextUserService.userExists(friendEmail);

  if (userExists) {
    await NextUserService.sendFriendRequest(requestingUser.id, friendEmail);
  } else {
    throw new UserNotExistsError(email);
  }
  revalidatePath(`/friends`);
}

export async function getSentInvitations(
  userId: UUID,
): Promise<FriendInvitation[]> {
  const userRepository = new NextUserRepository();
  const userRequestRepository = new NextUserRequestRepository();

  const pendingUsers =
    await userRequestRepository.findAllPendingByRequesterId(userId);
  const friendList = await new NextFriendListRepository().findByUserId(userId);

  if (!friendList) throw new Error("Friend List not found!");

  const nonUserInvitations = pendingUsers.map(userRequestToInvitationDto);
  const invitations = await Promise.all(
    friendList.sentFriendRequests.map((request) =>
      friendRequestToInvitationDto(request, userRepository),
    ),
  );

  return [...invitations, ...nonUserInvitations];
}

export async function getFriendList(userId: string) {
  const friendList = await new NextFriendListRepository().findByUserId(userId);

  if (!friendList) throw new Error("Friend List not found!");
  return friendList;
}

export async function approveFriendRequest(
  requestId: UUID,
  token: string | undefined,
) {
  const user = await validateToken(token);
  await NextUserService.approveFriendRequest(user.id, requestId);
  revalidatePath("/friends");
}

export async function rejectFriendRequest(
  requestId: UUID,
  token: string | undefined,
) {
  const user = await validateToken(token);
  await NextUserService.rejectFriendRequest(user.id, requestId);
  revalidatePath("/friends");
}

export async function cancelRequest(
  requestId: UUID,
  token: string | undefined,
) {
  const user = await validateToken(token);
  await NextUserService.cancelFriendRequest(requestId);
  revalidatePath("/friends");
}

export async function removeFriend(friendId: UUID, token: string | undefined) {
  const user = await validateToken(token);
  await NextUserService.removeFriend(user.id, friendId);

  revalidatePath("/friends");
}
