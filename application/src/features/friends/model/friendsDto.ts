import type NextUserRepository from "@app/server/repositories/NextUserRepository";
import type { FriendRequest, UserRequest } from "@domain/user";

export type FriendInviteResponseType = "invite" | "create";

export type FriendInvitation = {
  id: string;
  createdAt: Date;
  email: string;
  name?: string;
  avatarUrl?: string;
};

export function userRequestToInvitationDto(
  userRequest: UserRequest,
): FriendInvitation {
  return {
    id: userRequest.id,
    createdAt: userRequest.createdAt,
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
    createdAt: friendRequest.createdAt,
    name: user.name,
    email: user.email.value,
    avatarUrl: user.avatarUrl,
  };
}
