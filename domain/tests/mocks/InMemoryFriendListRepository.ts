import type { UUID } from "../../src/shared/Uuid";
import {
  FriendRequest,
  RequestStatus,
  UserFriendList,
} from "../../src/user/index";
import type { IFriendListRepository } from "../../src/user/services/UserService";

interface RequestStorage {
  id: string;
  senderId: string;
  reciverId: string;
  status: RequestStatus;
  createdAt: Date;
  expiresAt?: Date;
}

function toRequestStorage(request: FriendRequest): RequestStorage {
  return {
    id: request.id,
    senderId: request.senderId,
    reciverId: request.receiverId,
    status: request.status,
    createdAt: request.createdAt,
    expiresAt: request.expiresAt,
  };
}

export class InMemoryFriendListRepository implements IFriendListRepository {
  private friendRequestStorage = new Map<string, RequestStorage>();

  private getEntires(): RequestStorage[] {
    return Array.from(this.friendRequestStorage.values());
  }

  async findRequestById(requestId: UUID): Promise<FriendRequest | null> {
    const entity = this.friendRequestStorage.get(requestId);
    if (!entity) return null;
    return FriendRequest.reconstitute(
      entity.id,
      entity.senderId,
      entity.reciverId,
      entity.status,
      entity.createdAt,
      entity.expiresAt,
    );
  }

  async saveRequest(friendRequest: FriendRequest): Promise<void> {
    this.friendRequestStorage.set(
      friendRequest.id,
      toRequestStorage(friendRequest),
    );
  }
  async deleteRequest(requestId: UUID): Promise<void> {
    this.friendRequestStorage.delete(requestId);
  }

  async findByUserId(userId: UUID): Promise<UserFriendList | null> {
    const entries = this.getEntires().filter(
      ({ senderId, reciverId }) => userId === senderId || userId === reciverId,
    );
    const requests = entries.map(this.mapToFriendRequest);
    const friends = requests.filter(
      ({ status }) => status === RequestStatus.APPROVED,
    );
    const sent = requests.filter(({ senderId }) => senderId === userId);
    const recived = requests.filter(({ receiverId }) => receiverId === userId);
    return UserFriendList.reconstitute(userId, friends, sent, recived);
  }

  async save(friendList: UserFriendList): Promise<void> {
    const friends = friendList.friendRequests;
    const sent = friendList.sentFriendRequests;
    const recived = friendList.receivedFriendRequests;

    const requests = [...friends, ...sent, ...recived];

    requests.forEach((request) => {
      this.friendRequestStorage.set(request.id, toRequestStorage(request));
    });
  }

  private mapToFriendRequest(entity: RequestStorage): FriendRequest {
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
