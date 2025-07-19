import { DomainEvent } from "./DomainEvent";
import { Email } from "../value-objects/Email";
import { UUID } from "@domain/shared";

/**
 * Friend Request Sent Domain Event
 * Raised when a user sends a friend request to another user
 */
export class FriendRequestSentEvent extends DomainEvent {
  public readonly requestId: UUID;
  public readonly senderId: UUID;
  public readonly receiverId: UUID;

  constructor(requestId: UUID, senderId: UUID, receiverId: UUID) {
    super("FriendRequestSent");
    this.requestId = requestId;
    this.senderId = senderId;
    this.receiverId = receiverId;
  }

  getAggregateId(): string {
    return this.senderId;
  }
}

/**
 * Friend Request Approved Domain Event
 * Raised when a friend request is approved
 */
export class FriendRequestApprovedEvent extends DomainEvent {
  public readonly requestId: UUID;
  public readonly senderId: UUID;
  public readonly receiverId: UUID;

  constructor(requestId: UUID, senderId: UUID, receiverId: UUID) {
    super("FriendRequestApproved");
    this.requestId = requestId;
    this.senderId = senderId;
    this.receiverId = receiverId;
  }

  getAggregateId(): string {
    return this.receiverId;
  }
}

/**
 * Friend Request Rejected Domain Event
 * Raised when a friend request is rejected
 */
export class FriendRequestRejectedEvent extends DomainEvent {
  public readonly requestId: UUID;
  public readonly senderId: UUID;
  public readonly receiverId: UUID;

  constructor(requestId: UUID, senderId: UUID, receiverId: UUID) {
    super("FriendRequestRejected");
    this.requestId = requestId;
    this.senderId = senderId;
    this.receiverId = receiverId;
  }

  getAggregateId(): string {
    return this.receiverId;
  }
}

/**
 * Friend Removed Domain Event
 * Raised when a user removes another user from their friend list
 */
export class FriendRemovedEvent extends DomainEvent {
  public readonly userId: UUID;
  public readonly removedFriendId: UUID;

  constructor(userId: UUID, removedFriendId: UUID) {
    super("FriendRemoved");
    this.userId = userId;
    this.removedFriendId = removedFriendId;
  }

  getAggregateId(): string {
    return this.userId;
  }
}

/**
 * Invitation Request Sent Domain Event
 * Raised when a user requests an invitation for a non-existing user
 */
export class InvitationRequestSentEvent extends DomainEvent {
  public readonly requestId: UUID;
  public readonly requesterId: UUID;
  public readonly inviteeEmail: Email;

  constructor(requestId: UUID, requesterId: UUID, inviteeEmail: Email) {
    super("InvitationRequestSent");
    this.requestId = requestId;
    this.requesterId = requesterId;
    this.inviteeEmail = inviteeEmail;
  }

  getAggregateId(): string {
    return this.requesterId;
  }
}

/**
 * Invitation Request Approved Domain Event
 * Raised when an administrator approves an invitation request
 */
export class InvitationRequestApprovedEvent extends DomainEvent {
  public readonly requestId: UUID;
  public readonly requesterId: UUID;
  public readonly inviteeEmail: Email;
  public readonly approvedById: UUID;

  constructor(
    requestId: UUID,
    requesterId: UUID,
    inviteeEmail: Email,
    approvedById: UUID,
  ) {
    super("InvitationRequestApproved");
    this.requestId = requestId;
    this.requesterId = requesterId;
    this.inviteeEmail = inviteeEmail;
    this.approvedById = approvedById;
  }

  getAggregateId(): string {
    return this.requesterId;
  }
}
