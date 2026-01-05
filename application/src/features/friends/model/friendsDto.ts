import type NextUserRepository from "@app/server/repositories/NextUserRepository";
import type { FriendRequest, UserRequest } from "@domain/user";
import type { UserType } from "@domain/user/entities";

export type FriendInviteResponseType = "invite" | "create";

export type FriendInvitation = {
  id: string;
  createdAt: string;
  email: string;
  name?: string;
  avatarUrl?: string;
};

export type FriendRequestUser = UserType & {
  requestId: string;
};

export type FriendsResponse = {
  friends: UserType[];
  pendingInvitations: FriendRequestUser[];
  sentInvitations: FriendInvitation[];
};

export function userRequestToInvitationDto(
  userRequest: UserRequest,
): FriendInvitation {
  return {
    id: userRequest.id,
    createdAt: userRequest.createdAt.toISOString(),
    email: userRequest.inviteeEmail.value,
  };
}

export async function friendRequestToInvitationDto(
  friendRequest: FriendRequest,
  userRepository: NextUserRepository,
): Promise<FriendInvitation> {
  const user = await userRepository.findById(friendRequest.receiverId);
  if (!user) throw new Error(`Unable to find user ${friendRequest.receiverId}`);
  return {
    id: friendRequest.id,
    createdAt: friendRequest.createdAt.toISOString(),
    name: user.name,
    email: user.email.value,
    avatarUrl: user.avatarUrl,
  };
}
