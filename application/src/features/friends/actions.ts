"use server";

import { NextFriendListRepository } from "@app/server/repositories/NextFriendListRepository";
import NextUserRepository from "@app/server/repositories/NextUserRepository";
import { NextUserRequestRepository } from "@app/server/repositories/NextUserRequestRepository";
import { NextUserService } from "@app/server/services/NextUserService";
import type { UUID } from "@domain/shared";
import { Email } from "@domain/user";
import { revalidatePath } from "next/cache";
import {
  type FriendInvitation,
  type FriendInviteResponseType,
  friendRequestToInvitationDto,
  userRequestToInvitationDto,
} from "./model/friendsDto";

/**
 * @deprecated
 */
export async function sendFriendRequest(
  email: string,
  token: string | undefined,
): Promise<FriendInviteResponseType> {
  const friendEmail = new Email(email);
  const userExists = await NextUserService.userExists(friendEmail);

  if (userExists) {
    await NextUserService.sendFriendRequest("user-01", friendEmail);
    revalidatePath(`/friends`);
    return "invite";
  } else {
    return "create";
    // throw new UserNotExistsError(email);
  }
}

/**
 * @deprecated
 */
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
