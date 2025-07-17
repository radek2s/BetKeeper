import { RequestStatus, RequestStatusGuards } from "../types/RequestStatus";
import {
  FriendRequestSentEvent,
  FriendRequestApprovedEvent,
  FriendRequestRejectedEvent,
} from "../events/FriendRequestEvents";
import { Entity } from "../../shared/Entity";
import type { IEventDispatcher } from "../../shared/EventDispatcher";
import { generateId, type UUID } from "../../shared/Uuid";

/**
 * Friend Request Entity
 * Represents a request from one user to become friends with another user
 */
export class FriendRequest extends Entity {
  private readonly _id: UUID;
  private readonly _senderId: UUID;
  private readonly _receiverId: UUID;
  private _status: RequestStatus;
  private readonly _createdAt: Date;
  private _expiresAt?: Date;

  constructor(
    id: UUID,
    senderId: UUID,
    receiverId: UUID,
    status: RequestStatus = RequestStatus.PENDING,
    createdAt?: Date,
    expiresAt?: Date,
    eventDispatcher?: IEventDispatcher,
  ) {
    super(eventDispatcher);

    if (senderId === receiverId) {
      throw new Error("Cannot send friend request to yourself");
    }

    this._id = id;
    this._senderId = senderId;
    this._receiverId = receiverId;
    this._status = status;
    this._createdAt = createdAt || new Date();
    this._expiresAt = expiresAt;

    if (!createdAt && status === RequestStatus.PENDING) {
      this.addDomainEvent(
        new FriendRequestSentEvent(this._id, this._senderId, this._receiverId),
      );
    }
  }

  get id(): UUID {
    return this._id;
  }

  get senderId(): UUID {
    return this._senderId;
  }

  get receiverId(): UUID {
    return this._receiverId;
  }

  get status(): RequestStatus {
    return this._status;
  }

  get createdAt(): Date {
    return this._createdAt;
  }

  get expiresAt(): Date | undefined {
    return this._expiresAt;
  }

  approve(): void {
    if (!RequestStatusGuards.isPending(this._status)) {
      throw new Error("Can only approve pending friend requests");
    }

    if (this.isExpired()) {
      throw new Error("Cannot approve expired friend request");
    }

    this._status = RequestStatus.APPROVED;

    this.addDomainEvent(
      new FriendRequestApprovedEvent(
        this._id,
        this._senderId,
        this._receiverId,
      ),
    );
  }

  reject(): void {
    if (!RequestStatusGuards.isPending(this._status)) {
      throw new Error("Can only reject pending friend requests");
    }

    this._status = RequestStatus.REJECTED;

    this.addDomainEvent(
      new FriendRequestRejectedEvent(
        this._id,
        this._senderId,
        this._receiverId,
      ),
    );
  }

  cancel(): void {
    if (!RequestStatusGuards.isPending(this._status)) {
      throw new Error("Can only cancel pending friend requests");
    }

    this._status = RequestStatus.CANCELLED;
  }

  expire(): void {
    if (!RequestStatusGuards.isPending(this._status)) {
      throw new Error("Can only expire pending friend requests");
    }

    this._status = RequestStatus.EXPIRED;
  }

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

  static create(
    senderId: UUID,
    receiverId: UUID,
    expirationDays: number = 30,
    eventDispatcher?: IEventDispatcher,
  ): FriendRequest {
    const id = generateId();
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + expirationDays);

    return new FriendRequest(
      id,
      senderId,
      receiverId,
      RequestStatus.PENDING,
      undefined,
      expiresAt,
      eventDispatcher,
    );
  }

  static reconstitute(
    id: UUID,
    senderId: UUID,
    receiverId: UUID,
    status: RequestStatus,
    createdAt: Date,
    expiresAt?: Date,
    eventDispatcher?: IEventDispatcher,
  ): FriendRequest {
    return new FriendRequest(
      id,
      senderId,
      receiverId,
      status,
      createdAt,
      expiresAt,
      eventDispatcher,
    );
  }

  override equals(other: Entity): boolean {
    if (!(other instanceof FriendRequest)) {
      return false;
    }
    return this._id === other._id;
  }

  override toString(): string {
    return `FriendRequest(${this._id}, ${this._senderId} -> ${this._receiverId}, ${this._status})`;
  }
}
