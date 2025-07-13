import { UserId } from '../value-objects/UserId';
import { Email } from '../value-objects/Email';
import { User } from '../entities/User';
import { FriendRequest } from '../entities/FriendRequest';
import { InvitationRequest } from '../entities/InvitationRequest';
import { RequestStatus } from '../types/RequestStatus';
import { DomainEvent } from '../events/DomainEvent';
import { FriendRemovedEvent } from '../events/FriendRequestEvents';

/**
 * Friend List Aggregate Root
 * Manages a user's friends and friend-related operations
 */
export class FriendList {
  private readonly _userId: UserId;
  private readonly _friends: Map<string, UserId> = new Map();
  private readonly _sentFriendRequests: Map<string, FriendRequest> = new Map();
  private readonly _receivedFriendRequests: Map<string, FriendRequest> = new Map();
  private readonly _sentInvitationRequests: Map<string, InvitationRequest> = new Map();
  private _domainEvents: DomainEvent[] = [];

  constructor(userId: UserId) {
    this._userId = userId;
  }

  // Getters
  get userId(): UserId {
    return this._userId;
  }

  get friends(): UserId[] {
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
    return this.receivedFriendRequests.filter(request => request.isPending());
  }

  get sentInvitationRequests(): InvitationRequest[] {
    return Array.from(this._sentInvitationRequests.values());
  }

  get domainEvents(): DomainEvent[] {
    return [...this._domainEvents];
  }

  // Friend management methods
  sendFriendRequest(targetUser: User): FriendRequest {
    if (!targetUser.canReceiveFriendRequests()) {
      throw new Error('Target user cannot receive friend requests');
    }

    if (this.isFriend(targetUser.id)) {
      throw new Error('User is already a friend');
    }

    if (this.hasPendingFriendRequestTo(targetUser.id)) {
      throw new Error('Friend request already sent to this user');
    }

    if (this.hasPendingFriendRequestFrom(targetUser.id)) {
      throw new Error('User has already sent you a friend request');
    }

    const friendRequest = FriendRequest.create(this._userId, targetUser.id);
    this._sentFriendRequests.set(friendRequest.id.value, friendRequest);

    // Add domain events from the friend request
    this.addDomainEvents(friendRequest.domainEvents);
    friendRequest.clearDomainEvents();

    return friendRequest;
  }

  receiveFriendRequest(friendRequest: FriendRequest): void {
    if (!friendRequest.receiverId.equals(this._userId)) {
      throw new Error('Friend request is not for this user');
    }

    this._receivedFriendRequests.set(friendRequest.id.value, friendRequest);
  }

  approveFriendRequest(requestId: string): void {
    const request = this._receivedFriendRequests.get(requestId);
    if (!request) {
      throw new Error('Friend request not found');
    }

    request.approve();
    this.addFriend(request.senderId);

    // Add domain events from the friend request
    this.addDomainEvents(request.domainEvents);
    request.clearDomainEvents();
  }

  rejectFriendRequest(requestId: string): void {
    const request = this._receivedFriendRequests.get(requestId);
    if (!request) {
      throw new Error('Friend request not found');
    }

    request.reject();

    // Add domain events from the friend request
    this.addDomainEvents(request.domainEvents);
    request.clearDomainEvents();
  }

  cancelSentFriendRequest(requestId: string): void {
    const request = this._sentFriendRequests.get(requestId);
    if (!request) {
      throw new Error('Sent friend request not found');
    }

    request.cancel();
  }

  addFriend(friendId: UserId): void {
    if (friendId.equals(this._userId)) {
      throw new Error('Cannot add yourself as a friend');
    }

    if (this.isFriend(friendId)) {
      return; // Already a friend
    }

    this._friends.set(friendId.value, friendId);
  }

  removeFriend(friendId: UserId): void {
    if (!this.isFriend(friendId)) {
      throw new Error('User is not in friend list');
    }

    this._friends.delete(friendId.value);
    this.addDomainEvent(new FriendRemovedEvent(this._userId, friendId));
  }

  // Invitation request methods
  sendInvitationRequest(inviteeEmail: Email): InvitationRequest {
    if (this.hasPendingInvitationRequestFor(inviteeEmail)) {
      throw new Error('Invitation request already sent for this email');
    }

    const invitationRequest = InvitationRequest.create(this._userId, inviteeEmail);
    this._sentInvitationRequests.set(invitationRequest.id.value, invitationRequest);

    // Add domain events from the invitation request
    this.addDomainEvents(invitationRequest.domainEvents);
    invitationRequest.clearDomainEvents();

    return invitationRequest;
  }

  cancelInvitationRequest(requestId: string): void {
    const request = this._sentInvitationRequests.get(requestId);
    if (!request) {
      throw new Error('Invitation request not found');
    }

    request.cancel();
  }

  // Query methods
  isFriend(userId: UserId): boolean {
    return this._friends.has(userId.value);
  }

  hasPendingFriendRequestTo(userId: UserId): boolean {
    return Array.from(this._sentFriendRequests.values())
      .some(request => request.receiverId.equals(userId) && request.isPending());
  }

  hasPendingFriendRequestFrom(userId: UserId): boolean {
    return Array.from(this._receivedFriendRequests.values())
      .some(request => request.senderId.equals(userId) && request.isPending());
  }

  hasPendingInvitationRequestFor(email: Email): boolean {
    return Array.from(this._sentInvitationRequests.values())
      .some(request => request.inviteeEmail.equals(email) && request.isPending());
  }

  getFriendRequest(requestId: string): FriendRequest | undefined {
    return this._receivedFriendRequests.get(requestId) || this._sentFriendRequests.get(requestId);
  }

  getInvitationRequest(requestId: string): InvitationRequest | undefined {
    return this._sentInvitationRequests.get(requestId);
  }

  // Business rules validation
  canCreateBetRequest(): boolean {
    return this.friendCount > 0;
  }

  // Domain events management
  private addDomainEvent(event: DomainEvent): void {
    this._domainEvents.push(event);
  }

  private addDomainEvents(events: DomainEvent[]): void {
    this._domainEvents.push(...events);
  }

  clearDomainEvents(): void {
    this._domainEvents = [];
  }

  // Factory method
  static create(userId: UserId): FriendList {
    return new FriendList(userId);
  }

  // Reconstitution method for persistence
  static reconstitute(
    userId: UserId,
    friends: UserId[],
    sentFriendRequests: FriendRequest[],
    receivedFriendRequests: FriendRequest[],
    sentInvitationRequests: InvitationRequest[]
  ): FriendList {
    const friendList = new FriendList(userId);

    // Restore friends
    friends.forEach(friendId => {
      friendList._friends.set(friendId.value, friendId);
    });

    // Restore sent friend requests
    sentFriendRequests.forEach(request => {
      friendList._sentFriendRequests.set(request.id.value, request);
    });

    // Restore received friend requests
    receivedFriendRequests.forEach(request => {
      friendList._receivedFriendRequests.set(request.id.value, request);
    });

    // Restore sent invitation requests
    sentInvitationRequests.forEach(request => {
      friendList._sentInvitationRequests.set(request.id.value, request);
    });

    return friendList;
  }

  toString(): string {
    return `FriendList(${this._userId.value}, ${this.friendCount} friends)`;
  }
}
