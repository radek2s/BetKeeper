import { RequestId } from '../value-objects/RequestId';
import { UserId } from '../value-objects/UserId';
import { RequestStatus, RequestStatusGuards } from '../types/RequestStatus';
import { DomainEvent } from '../events/DomainEvent';
import { FriendRequestSentEvent, FriendRequestApprovedEvent, FriendRequestRejectedEvent } from '../events/FriendRequestEvents';

/**
 * Friend Request Entity
 * Represents a request from one user to become friends with another user
 */
export class FriendRequest {
  private readonly _id: RequestId;
  private readonly _senderId: UserId;
  private readonly _receiverId: UserId;
  private _status: RequestStatus;
  private readonly _createdAt: Date;
  private _updatedAt: Date;
  private _expiresAt?: Date;
  private _domainEvents: DomainEvent[] = [];

  constructor(
    id: RequestId,
    senderId: UserId,
    receiverId: UserId,
    status: RequestStatus = RequestStatus.PENDING,
    createdAt?: Date,
    updatedAt?: Date,
    expiresAt?: Date
  ) {
    if (senderId.equals(receiverId)) {
      throw new Error('Cannot send friend request to yourself');
    }

    this._id = id;
    this._senderId = senderId;
    this._receiverId = receiverId;
    this._status = status;
    this._createdAt = createdAt || new Date();
    this._updatedAt = updatedAt || new Date();
    this._expiresAt = expiresAt;

    // Raise domain event for new friend request
    if (!createdAt && status === RequestStatus.PENDING) {
      this.addDomainEvent(new FriendRequestSentEvent(this._id, this._senderId, this._receiverId));
    }
  }

  // Getters
  get id(): RequestId {
    return this._id;
  }

  get senderId(): UserId {
    return this._senderId;
  }

  get receiverId(): UserId {
    return this._receiverId;
  }

  get status(): RequestStatus {
    return this._status;
  }

  get createdAt(): Date {
    return this._createdAt;
  }

  get updatedAt(): Date {
    return this._updatedAt;
  }

  get expiresAt(): Date | undefined {
    return this._expiresAt;
  }

  get domainEvents(): DomainEvent[] {
    return [...this._domainEvents];
  }

  // Business methods
  approve(): void {
    if (!RequestStatusGuards.isPending(this._status)) {
      throw new Error('Can only approve pending friend requests');
    }

    if (this.isExpired()) {
      throw new Error('Cannot approve expired friend request');
    }

    this._status = RequestStatus.APPROVED;
    this._updatedAt = new Date();

    this.addDomainEvent(new FriendRequestApprovedEvent(this._id, this._senderId, this._receiverId));
  }

  reject(): void {
    if (!RequestStatusGuards.isPending(this._status)) {
      throw new Error('Can only reject pending friend requests');
    }

    this._status = RequestStatus.REJECTED;
    this._updatedAt = new Date();

    this.addDomainEvent(new FriendRequestRejectedEvent(this._id, this._senderId, this._receiverId));
  }

  cancel(): void {
    if (!RequestStatusGuards.isPending(this._status)) {
      throw new Error('Can only cancel pending friend requests');
    }

    this._status = RequestStatus.CANCELLED;
    this._updatedAt = new Date();
  }

  expire(): void {
    if (!RequestStatusGuards.isPending(this._status)) {
      throw new Error('Can only expire pending friend requests');
    }

    this._status = RequestStatus.EXPIRED;
    this._updatedAt = new Date();
  }

  // Domain behavior checks
  isPending(): boolean {
    return RequestStatusGuards.isPending(this._status);
  }

  isApproved(): boolean {
    return RequestStatusGuards.isApproved(this._status);
  }

  isRejected(): boolean {
    return RequestStatusGuards.isRejected(this._status);
  }

  isCancelled(): boolean {
    return RequestStatusGuards.isCancelled(this._status);
  }

  isExpired(): boolean {
    if (this._expiresAt && new Date() > this._expiresAt) {
      if (this.isPending()) {
        this.expire();
      }
      return true;
    }
    return RequestStatusGuards.isExpired(this._status);
  }

  isFinal(): boolean {
    return RequestStatusGuards.isFinal(this._status);
  }

  canBeModified(): boolean {
    return this.isPending() && !this.isExpired();
  }

  // Domain events management
  private addDomainEvent(event: DomainEvent): void {
    this._domainEvents.push(event);
  }

  clearDomainEvents(): void {
    this._domainEvents = [];
  }

  // Factory methods
  static create(senderId: UserId, receiverId: UserId, expirationDays: number = 30): FriendRequest {
    const id = RequestId.generate();
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + expirationDays);

    return new FriendRequest(id, senderId, receiverId, RequestStatus.PENDING, undefined, undefined, expiresAt);
  }

  static reconstitute(
    id: RequestId,
    senderId: UserId,
    receiverId: UserId,
    status: RequestStatus,
    createdAt: Date,
    updatedAt: Date,
    expiresAt?: Date
  ): FriendRequest {
    return new FriendRequest(id, senderId, receiverId, status, createdAt, updatedAt, expiresAt);
  }

  // Equality
  equals(other: FriendRequest): boolean {
    return this._id.equals(other._id);
  }

  toString(): string {
    return `FriendRequest(${this._id.value}, ${this._senderId.value} -> ${this._receiverId.value}, ${this._status})`;
  }
}
