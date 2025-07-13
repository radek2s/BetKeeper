import { RequestId } from "../value-objects/RequestId";
import { UserId } from "../value-objects/UserId";
import { Email } from "../value-objects/Email";
import { RequestStatus, RequestStatusGuards } from "../types/RequestStatus";
import {
  InvitationRequestSentEvent,
  InvitationRequestApprovedEvent,
} from "../events/FriendRequestEvents";
import { Entity } from "../../shared/Entity";
import { IEventDispatcher } from "../../shared/EventDispatcher";
import { DomainEvent } from "../events/DomainEvent";

/**
 * Invitation Request Entity
 * Represents a request to invite a non-existing user to join the system
 */
export class InvitationRequest extends Entity<RequestId> {
  private readonly _id: RequestId;
  private readonly _requesterId: UserId;
  private readonly _inviteeEmail: Email;
  private _status: RequestStatus;
  private readonly _createdAt: Date;
  private _updatedAt: Date;
  private _approvedById?: UserId;
  private _approvedAt?: Date;

  constructor(
    id: RequestId,
    requesterId: UserId,
    inviteeEmail: Email,
    status: RequestStatus = RequestStatus.PENDING,
    createdAt?: Date,
    updatedAt?: Date,
    approvedById?: UserId,
    approvedAt?: Date,
    eventDispatcher?: IEventDispatcher,
  ) {
    super(eventDispatcher);

    this._id = id;
    this._requesterId = requesterId;
    this._inviteeEmail = inviteeEmail;
    this._status = status;
    this._createdAt = createdAt || new Date();
    this._updatedAt = updatedAt || new Date();
    this._approvedById = approvedById;
    this._approvedAt = approvedAt;

    // Raise domain event for new invitation request
    if (!createdAt && status === RequestStatus.PENDING) {
      this.addDomainEvent(
        new InvitationRequestSentEvent(
          this._id,
          this._requesterId,
          this._inviteeEmail,
        ),
      );
    }
  }

  // Getters
  get id(): RequestId {
    return this._id;
  }

  get requesterId(): UserId {
    return this._requesterId;
  }

  get inviteeEmail(): Email {
    return this._inviteeEmail;
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

  get approvedById(): UserId | undefined {
    return this._approvedById;
  }

  get approvedAt(): Date | undefined {
    return this._approvedAt;
  }

  // Business methods
  approve(approvedById: UserId): void {
    if (!RequestStatusGuards.isPending(this._status)) {
      throw new Error("Can only approve pending invitation requests");
    }

    this._status = RequestStatus.APPROVED;
    this._approvedById = approvedById;
    this._approvedAt = new Date();
    this._updatedAt = new Date();
    this.markAsModified();

    this.addDomainEvent(
      new InvitationRequestApprovedEvent(
        this._id,
        this._requesterId,
        this._inviteeEmail,
        approvedById,
      ),
    );
  }

  reject(): void {
    if (!RequestStatusGuards.isPending(this._status)) {
      throw new Error("Can only reject pending invitation requests");
    }

    this._status = RequestStatus.REJECTED;
    this._updatedAt = new Date();
    this.markAsModified();
  }

  cancel(): void {
    if (!RequestStatusGuards.isPending(this._status)) {
      throw new Error("Can only cancel pending invitation requests");
    }

    this._status = RequestStatus.CANCELLED;
    this._updatedAt = new Date();
    this.markAsModified();
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

  isFinal(): boolean {
    return RequestStatusGuards.isFinal(this._status);
  }

  canBeModified(): boolean {
    return this.isPending();
  }

  // Factory methods
  static create(
    requesterId: UserId,
    inviteeEmail: Email,
    eventDispatcher?: IEventDispatcher,
  ): InvitationRequest {
    const id = RequestId.generate();
    return new InvitationRequest(
      id,
      requesterId,
      inviteeEmail,
      RequestStatus.PENDING,
      undefined,
      undefined,
      undefined,
      undefined,
      eventDispatcher,
    );
  }

  static reconstitute(
    id: RequestId,
    requesterId: UserId,
    inviteeEmail: Email,
    status: RequestStatus,
    createdAt: Date,
    updatedAt: Date,
    approvedById?: UserId,
    approvedAt?: Date,
    eventDispatcher?: IEventDispatcher,
  ): InvitationRequest {
    return new InvitationRequest(
      id,
      requesterId,
      inviteeEmail,
      status,
      createdAt,
      updatedAt,
      approvedById,
      approvedAt,
      eventDispatcher,
    );
  }

  // Equality
  override equals(other: Entity<RequestId>): boolean {
    if (!(other instanceof InvitationRequest)) {
      return false;
    }
    return this._id.equals(other._id);
  }

  override toString(): string {
    return `InvitationRequest(${this._id.value}, ${this._requesterId.value} -> ${this._inviteeEmail.value}, ${this._status})`;
  }
}
