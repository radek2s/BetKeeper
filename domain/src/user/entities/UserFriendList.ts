import { type AggregateRoot, Entity, type UUID } from "@domain/shared";
import { FriendRemovedEvent } from "../events/FriendRequestEvents";
import { FriendRequest } from "./FriendRequest";
import type { User } from "./User";

/**
 * Friend List Aggregate Root
 * Manages a user's friends and friend-related operations
 */
export class UserFriendList extends Entity {
  private readonly _userId: UUID;
  private readonly _friends: Map<string, FriendRequest> = new Map();
  private readonly _sentFriendRequests: Map<string, FriendRequest> = new Map();
  private readonly _receivedFriendRequests: Map<string, FriendRequest> =
    new Map();

  constructor(userId: UUID) {
    super();
    this._userId = userId;
  }

  override get id(): UUID {
    return this._userId;
  }

  get userId(): UUID {
    return this._userId;
  }

  get friends(): UUID[] {
    return Array.from(this._friends.keys());
  }

  get friendCount(): number {
    return this._friends.size;
  }

  get sentFriendRequests(): FriendRequest[] {
    return Array.from(this._sentFriendRequests.values());
  }

  get receivedFriendRequests(): FriendRequest[] {
    return Array.from(this._receivedFriendRequests.values());
  }

  get pendingReceivedRequests(): FriendRequest[] {
    return this.receivedFriendRequests.filter((request) => request.isPending());
  }

  sendFriendRequest(targetUser: User): FriendRequest {
    if (!targetUser.canReceiveFriendRequests()) {
      throw new Error("Target user cannot receive friend requests");
    }

    if (this.isFriend(targetUser.id)) {
      throw new Error("User is already a friend");
    }

    if (this.hasPendingFriendRequestTo(targetUser.id)) {
      throw new Error("Friend request already sent to this user");
    }

    if (this.hasPendingFriendRequestFrom(targetUser.id)) {
      throw new Error("User has already sent you a friend request");
    }

    const friendRequest = FriendRequest.create(this._userId, targetUser.id);
    this._sentFriendRequests.set(friendRequest.id, friendRequest);

    this.addDomainEvents(friendRequest.domainEvents);
    friendRequest.clearDomainEvents();

    return friendRequest;
  }

  receiveFriendRequest(friendRequest: FriendRequest): void {
    if (friendRequest.receiverId !== this._userId) {
      throw new Error("Friend request is not for this user");
    }

    this._receivedFriendRequests.set(friendRequest.id, friendRequest);
  }

  approveFriendRequest(requestId: string): FriendRequest {
    const request = this._receivedFriendRequests.get(requestId);
    if (!request) {
      throw new Error("Friend request not found");
    }

    request.approve();
    this.addFriend(request.senderId, requestId);

    this.addDomainEvents(request.domainEvents);
    request.clearDomainEvents();
    return request;
  }

  rejectFriendRequest(requestId: string): FriendRequest {
    const request = this._receivedFriendRequests.get(requestId);
    if (!request) {
      throw new Error("Friend request not found");
    }

    request.reject();

    this.addDomainEvents(request.domainEvents);
    request.clearDomainEvents();
    return request;
  }

  cancelSentFriendRequest(requestId: string): void {
    const request = this._sentFriendRequests.get(requestId);
    if (!request) {
      throw new Error("Sent friend request not found");
    }

    request.cancel();
  }

  addFriend(friendId: UUID, requestId?: UUID): void {
    const getFriendRequest = (requestId: string) => {
      const sent = this._sentFriendRequests.get(requestId);
      const recived = this._receivedFriendRequests.get(requestId);
      const request = sent || recived;
      if (!request) throw new Error(`Unable to find request ${requestId}`);
      return request;
    };

    const getFriendRequestByFriendId = (friendId: string) => {
      const sent = this.sentFriendRequests.find(
        ({ receiverId }) => receiverId === friendId,
      );
      const recived = this.receivedFriendRequests.find(
        ({ senderId }) => senderId === friendId,
      );
      const request = sent || recived;
      if (!request) throw new Error(`Unable to find request ${requestId}`);
      return request;
    };

    const getRequest = () => {
      if (requestId) return getFriendRequest(requestId);
      return getFriendRequestByFriendId(friendId);
    };

    if (friendId === this._userId) {
      throw new Error("Cannot add yourself as a friend");
    }

    if (this.isFriend(friendId)) {
      return;
    }

    const request = getRequest();

    if (!request.isApproved()) {
      request.approve();
    }

    this._friends.set(friendId, request);
  }

  removeFriend(friendId: UUID): UUID {
    if (!this.isFriend(friendId)) {
      throw new Error("User is not in friend list");
    }

    const request = this._friends.get(friendId);
    if (!request) throw new Error("Request not found!");

    this._friends.delete(friendId);
    this.addDomainEvent(new FriendRemovedEvent(this._userId, friendId));
    return request.id;
  }

  isFriend(userId: UUID): boolean {
    return this._friends.has(userId);
  }

  hasPendingFriendRequestTo(userId: UUID): boolean {
    return Array.from(this._sentFriendRequests.values()).some(
      (request) => request.receiverId === userId && request.isPending(),
    );
  }

  hasPendingFriendRequestFrom(userId: UUID): boolean {
    return Array.from(this._receivedFriendRequests.values()).some(
      (request) => request.senderId === userId && request.isPending(),
    );
  }

  getFriendRequest(requestId: string): FriendRequest | undefined {
    return (
      this._receivedFriendRequests.get(requestId) ||
      this._sentFriendRequests.get(requestId)
    );
  }

  canCreateBetRequest(): boolean {
    return this.friendCount > 0;
  }

  override equals(other: AggregateRoot): boolean {
    if (!(other instanceof UserFriendList)) {
      return false;
    }
    return this._userId === other._userId;
  }

  override toString(): string {
    return `FriendList(${this._userId}, ${this.friendCount} friends)`;
  }

  static create(userId: UUID): UserFriendList {
    return new UserFriendList(userId);
  }

  static reconstitute(
    userId: UUID,
    friends: FriendRequest[],
    sentFriendRequests: FriendRequest[],
    receivedFriendRequests: FriendRequest[],
  ): UserFriendList {
    const friendList = new UserFriendList(userId);

    friends.forEach((request) => {
      const received = request.receiverId === userId;
      if (received) {
        friendList._friends.set(request.senderId, request);
      } else {
        friendList._friends.set(request.receiverId, request);
      }
    });

    sentFriendRequests.forEach((request) => {
      friendList._sentFriendRequests.set(request.id, request);
    });

    receivedFriendRequests.forEach((request) => {
      friendList._receivedFriendRequests.set(request.id, request);
    });

    return friendList;
  }

  override toObject() {
    return {
      userId: this.userId,
      friends: this.friends,
      sentFriendRequests: this.sentFriendRequests,
      receivedFriendRequests: this.receivedFriendRequests,
      pendingReceivedRequests: this.pendingReceivedRequests,
    };
  }
}
