import { DomainEvent } from './DomainEvent';
import { UserId } from '../value-objects/UserId';
import { RequestId } from '../value-objects/RequestId';
import { Email } from '../value-objects/Email';

/**
 * Friend Request Sent Domain Event
 * Raised when a user sends a friend request to another user
 */
export class FriendRequestSentEvent extends DomainEvent {
  public readonly requestId: RequestId;
  public readonly senderId: UserId;
  public readonly receiverId: UserId;

  constructor(requestId: RequestId, senderId: UserId, receiverId: UserId) {
    super('FriendRequestSent');
    this.requestId = requestId;
    this.senderId = senderId;
    this.receiverId = receiverId;
  }

  getAggregateId(): string {
    return this.senderId.value;
  }
}

/**
 * Friend Request Approved Domain Event
 * Raised when a friend request is approved
 */
export class FriendRequestApprovedEvent extends DomainEvent {
  public readonly requestId: RequestId;
  public readonly senderId: UserId;
  public readonly receiverId: UserId;

  constructor(requestId: RequestId, senderId: UserId, receiverId: UserId) {
    super('FriendRequestApproved');
    this.requestId = requestId;
    this.senderId = senderId;
    this.receiverId = receiverId;
  }

  getAggregateId(): string {
    return this.receiverId.value;
  }
}

/**
 * Friend Request Rejected Domain Event
 * Raised when a friend request is rejected
 */
export class FriendRequestRejectedEvent extends DomainEvent {
  public readonly requestId: RequestId;
  public readonly senderId: UserId;
  public readonly receiverId: UserId;

  constructor(requestId: RequestId, senderId: UserId, receiverId: UserId) {
    super('FriendRequestRejected');
    this.requestId = requestId;
    this.senderId = senderId;
    this.receiverId = receiverId;
  }

  getAggregateId(): string {
    return this.receiverId.value;
  }
}

/**
 * Friend Removed Domain Event
 * Raised when a user removes another user from their friend list
 */
export class FriendRemovedEvent extends DomainEvent {
  public readonly userId: UserId;
  public readonly removedFriendId: UserId;

  constructor(userId: UserId, removedFriendId: UserId) {
    super('FriendRemoved');
    this.userId = userId;
    this.removedFriendId = removedFriendId;
  }

  getAggregateId(): string {
    return this.userId.value;
  }
}

/**
 * Invitation Request Sent Domain Event
 * Raised when a user requests an invitation for a non-existing user
 */
export class InvitationRequestSentEvent extends DomainEvent {
  public readonly requestId: RequestId;
  public readonly requesterId: UserId;
  public readonly inviteeEmail: Email;

  constructor(requestId: RequestId, requesterId: UserId, inviteeEmail: Email) {
    super('InvitationRequestSent');
    this.requestId = requestId;
    this.requesterId = requesterId;
    this.inviteeEmail = inviteeEmail;
  }

  getAggregateId(): string {
    return this.requesterId.value;
  }
}

/**
 * Invitation Request Approved Domain Event
 * Raised when an administrator approves an invitation request
 */
export class InvitationRequestApprovedEvent extends DomainEvent {
  public readonly requestId: RequestId;
  public readonly requesterId: UserId;
  public readonly inviteeEmail: Email;
  public readonly approvedById: UserId;

  constructor(requestId: RequestId, requesterId: UserId, inviteeEmail: Email, approvedById: UserId) {
    super('InvitationRequestApproved');
    this.requestId = requestId;
    this.requesterId = requesterId;
    this.inviteeEmail = inviteeEmail;
    this.approvedById = approvedById;
  }

  getAggregateId(): string {
    return this.requesterId.value;
  }
}
