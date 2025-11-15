import type { UUID } from "@domain/shared";
import {
  FriendRequest,
  type IFriendListRepository,
  RequestStatus,
  UserFriendList,
} from "@domain/user";
import prisma from "../db";

export class NextFriendListRepository implements IFriendListRepository {
  private table = prisma.friendRequestTable;

  async findByUserId(userId: UUID): Promise<UserFriendList | null> {
    const friendRequests = await this.table.findMany({
      where: { OR: [{ senderId: userId }, { reciverId: userId }] },
    });
    if (friendRequests.length === 0) return new UserFriendList(userId);

    const friends: FriendRequest[] = [];
    const sentFriendRequests: FriendRequest[] = [];
    const receivedFriendRequests: FriendRequest[] = [];

    friendRequests.forEach((element) => {
      if (element.status === RequestStatus.APPROVED) {
        friends.push(this.mapToFriendRequest(element));
        return;
      }
      if (element.senderId === userId) {
        sentFriendRequests.push(this.mapToFriendRequest(element));
        return;
      }
      if (element.reciverId === userId) {
        receivedFriendRequests.push(this.mapToFriendRequest(element));
      }
    });

    const friendsIds = new Set(
      friends.flatMap((friend) => [friend.senderId, friend.receiverId]),
    )
      .values()
      .filter((id) => id !== userId)
      .toArray();

    return UserFriendList.reconstitute(
      userId,
      friendsIds,
      sentFriendRequests,
      receivedFriendRequests,
    );
  }
  async save(friendList: UserFriendList): Promise<void> {
    friendList.sentFriendRequests.forEach(async (request) => {
      await this.table.upsert({
        where: { id: request.id },
        update: {
          status: request.status,
          createdAt: request.createdAt,
          expiresAt: request.expiresAt,
        },
        create: {
          id: request.id,
          senderId: request.senderId,
          reciverId: request.receiverId,
          createdAt: request.createdAt,
          status: request.status,
          expiresAt: request.expiresAt,
        },
      });
    });
  }

  private mapToFriendRequest(entity: FreindRequestEntity): FriendRequest {
    return FriendRequest.reconstitute(
      entity.id,
      entity.senderId,
      entity.reciverId,
      entity.status as RequestStatus,
      entity.createdAt,
      entity.expiresAt ?? undefined,
    );
  }
}

type FreindRequestEntity = {
  id: UUID;
  senderId: UUID;
  reciverId: UUID;
  status: string;
  createdAt: Date;
  expiresAt?: Date | null;
};
