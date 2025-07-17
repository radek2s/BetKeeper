import type { Email } from "../value-objects/Email";
import type { User } from "../entities/User";
import { FriendRequest } from "../entities/FriendRequest";

import { FriendRemovedEvent } from "../events/FriendRequestEvents";
import { type AggregateRoot, Entity } from "../../shared/Entity";
import type { IEventDispatcher } from "../../shared/EventDispatcher";
import type { UUID } from "../../shared/Uuid";
import { UserInvitationRequest } from "./UserInvitationRequest";

/**
 * Friend List Aggregate Root
 * Manages a user's friends and friend-related operations
 */
export class UserFriendList extends Entity {
  private readonly _userId: UUID;
  private readonly _friends: Map<string, UUID> = new Map();
  private readonly _sentFriendRequests: Map<string, FriendRequest> = new Map();
  private readonly _receivedFriendRequests: Map<string, FriendRequest> =
    new Map();
  private readonly _sentInvitationRequests: Map<string, UserInvitationRequest> =
    new Map();

  constructor(userId: UUID, eventDispatcher?: IEventDispatcher) {
    super(eventDispatcher);
    this._userId = userId;
  }

  override get id(): UUID {
    return this._userId;
  }

  get userId(): UUID {
    return this._userId;
  }

  get friends(): UUID[] {
    return Array.from(this._friends.values());
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

  get sentInvitationRequests(): UserInvitationRequest[] {
    return Array.from(this._sentInvitationRequests.values());
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

  approveFriendRequest(requestId: string): void {
    const request = this._receivedFriendRequests.get(requestId);
    if (!request) {
      throw new Error("Friend request not found");
    }

    request.approve();
    this.addFriend(request.senderId);

    this.addDomainEvents(request.domainEvents);
    request.clearDomainEvents();
  }

  rejectFriendRequest(requestId: string): void {
    const request = this._receivedFriendRequests.get(requestId);
    if (!request) {
      throw new Error("Friend request not found");
    }

    request.reject();

    this.addDomainEvents(request.domainEvents);
    request.clearDomainEvents();
  }

  cancelSentFriendRequest(requestId: string): void {
    const request = this._sentFriendRequests.get(requestId);
    if (!request) {
      throw new Error("Sent friend request not found");
    }

    request.cancel();
  }

  addFriend(friendId: UUID): void {
    if (friendId === this._userId) {
      throw new Error("Cannot add yourself as a friend");
    }

    if (this.isFriend(friendId)) {
      return;
    }

    this._friends.set(friendId, friendId);
  }

  removeFriend(friendId: UUID): void {
    if (!this.isFriend(friendId)) {
      throw new Error("User is not in friend list");
    }

    this._friends.delete(friendId);
    this.addDomainEvent(new FriendRemovedEvent(this._userId, friendId));
  }

  sendInvitationRequest(inviteeEmail: Email): UserInvitationRequest {
    if (this.hasPendingInvitationRequestFor(inviteeEmail)) {
      throw new Error("Invitation request already sent for this email");
    }

    const invitationRequest = UserInvitationRequest.create(
      this._userId,
      inviteeEmail,
    );
    this._sentInvitationRequests.set(invitationRequest.id, invitationRequest);

    this.addDomainEvents(invitationRequest.domainEvents);
    invitationRequest.clearDomainEvents();

    return invitationRequest;
  }

  cancelInvitationRequest(requestId: string): void {
    const request = this._sentInvitationRequests.get(requestId);
    if (!request) {
      throw new Error("Invitation request not found");
    }

    request.cancel();
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

  hasPendingInvitationRequestFor(email: Email): boolean {
    return Array.from(this._sentInvitationRequests.values()).some(
      (request) => request.inviteeEmail.equals(email) && request.isPending(),
    );
  }

  getFriendRequest(requestId: string): FriendRequest | undefined {
    return (
      this._receivedFriendRequests.get(requestId) ||
      this._sentFriendRequests.get(requestId)
    );
  }

  getInvitationRequest(requestId: string): UserInvitationRequest | undefined {
    return this._sentInvitationRequests.get(requestId);
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

  static create(
    userId: UUID,
    eventDispatcher?: IEventDispatcher,
  ): UserFriendList {
    return new UserFriendList(userId, eventDispatcher);
  }

  static reconstitute(
    userId: UUID,
    friends: UUID[],
    sentFriendRequests: FriendRequest[],
    receivedFriendRequests: FriendRequest[],
    sentInvitationRequests: UserInvitationRequest[],
    eventDispatcher?: IEventDispatcher,
  ): UserFriendList {
    const friendList = new UserFriendList(userId, eventDispatcher);

    friends.forEach((friendId) => {
      friendList._friends.set(friendId, friendId);
    });

    sentFriendRequests.forEach((request) => {
      friendList._sentFriendRequests.set(request.id, request);
    });

    receivedFriendRequests.forEach((request) => {
      friendList._receivedFriendRequests.set(request.id, request);
    });

    sentInvitationRequests.forEach((request) => {
      friendList._sentInvitationRequests.set(request.id, request);
    });

    return friendList;
  }
}
