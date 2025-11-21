"use server";
import { validateToken } from "@app/server/auth/authentication";
import { NextFriendListRepository } from "@app/server/repositories/NextFriendListRepository";
import NextUserRepository from "@app/server/repositories/NextUserRepository";
import { NextUserRequestRepository } from "@app/server/repositories/NextUserRequestRepository";
import NextUserService from "@app/server/services/NextUserService";
import type { UUID } from "@domain/shared";
import { Email } from "@domain/user";
import { createUserRequest } from "../users/actions";
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
    const request = await NextUserService.sendFriendRequest(
      requestingUser.id,
      friendEmail,
    );
    return request.id;
  } else {
    createUserRequest(email, token, false);
  }
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

export async function approveFriendRequest(reciverId: UUID, requestId: UUID) {
  await NextUserService.approveFriendRequest(reciverId, requestId);
}
