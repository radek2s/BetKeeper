import type NextUserRepository from "@app/server/repositories/NextUserRepository";
import type { FriendRequest, UserRequest } from "@domain/user";

export type FriendInvitation = FriendInvitationUser | FriendInvitationNonUser;
export type FriendInvitationNonUser = {
  id: string;
  createdAt: Date;
  email: string;
};
export type FriendInvitationUser = {
  id: string;
  createdAt: Date;
  name: string;
  email: string;
  avatarUrl?: string;
};

export function userRequestToInvitationDto(
  userRequest: UserRequest,
): FriendInvitationNonUser {
  return {
    id: userRequest.id,
    createdAt: userRequest.createdAt,
    email: userRequest.inviteeEmail.value,
  };
}

export async function friendRequestToInvitationDto(
  friendRequest: FriendRequest,
  userRepository: NextUserRepository,
): Promise<FriendInvitationUser> {
  const user = await userRepository.findById(friendRequest.receiverId);
  if (!user) throw new Error(`Unable to find user ${friendRequest.receiverId}`);
  return {
    id: friendRequest.id,
    createdAt: friendRequest.createdAt,
    name: user.name,
    email: user.email.value,
    avatarUrl: user.avatarUrl,
  };
}
