import { Entity } from "../../shared/Entity";
import { generateId, type UUID } from "../../shared/Uuid";
import {
  InvitationRequestApprovedEvent,
  InvitationRequestSentEvent,
} from "../events/FriendRequestEvents";
import { RequestStatus, RequestStatusGuards } from "../types/RequestStatus";
import type { Email } from "../value-objects/Email";

/**
 * Invitation Request Entity
 * Represents a request to invite a non-existing user to join the system
 */
export class UserRequest extends Entity {
  private readonly _id: UUID;
  private readonly _requesterId: UUID;
  private readonly _inviteeEmail: Email;
  private _status: RequestStatus;
  private readonly _createdAt: Date;
  private _approvedById?: UUID;
  private _approvedAt?: Date;

  constructor(
    requesterId: UUID,
    inviteeEmail: Email,
    status: RequestStatus = RequestStatus.PENDING,
    createdAt?: Date,
    approvedById?: UUID,
    approvedAt?: Date,
    id?: UUID,
  ) {
    super();

    this._id = id || generateId();
    this._requesterId = requesterId;
    this._inviteeEmail = inviteeEmail;
    this._status = status;
    this._createdAt = createdAt || new Date();
    this._approvedById = approvedById;
    this._approvedAt = approvedAt;

    if (!id) {
      this.addDomainEvent(
        new InvitationRequestSentEvent(
          this._id,
          this._requesterId,
          this._inviteeEmail,
        ),
      );
    }
  }

  get id(): UUID {
    return this._id;
  }

  get requesterId(): UUID {
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

  get approvedById(): UUID | undefined {
    return this._approvedById;
  }

  get approvedAt(): Date | undefined {
    return this._approvedAt;
  }

  approve(approvedById: UUID): void {
    if (!RequestStatusGuards.isPending(this._status)) {
      throw new Error("Can only approve pending invitation requests");
    }

    this._status = RequestStatus.APPROVED;
    this._approvedById = approvedById;
    this._approvedAt = new Date();

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
  }

  cancel(): void {
    if (!RequestStatusGuards.isPending(this._status)) {
      throw new Error("Can only cancel pending invitation requests");
    }

    this._status = RequestStatus.CANCELLED;
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

  isFinal(): boolean {
    return RequestStatusGuards.isFinal(this._status);
  }

  canBeModified(): boolean {
    return this.isPending();
  }

  static create(requesterId: UUID, inviteeEmail: Email): UserRequest {
    const id = generateId();
    return new UserRequest(
      requesterId,
      inviteeEmail,
      RequestStatus.PENDING,
      undefined,
      undefined,
      undefined,
      id,
    );
  }

  static reconstitute(
    id: UUID,
    requesterId: UUID,
    inviteeEmail: Email,
    status: RequestStatus,
    createdAt: Date,
    approvedById?: UUID,
    approvedAt?: Date,
  ): UserRequest {
    return new UserRequest(
      requesterId,
      inviteeEmail,
      status,
      createdAt,
      approvedById,
      approvedAt,
      id,
    );
  }

  override equals(other: Entity): boolean {
    if (!(other instanceof UserRequest)) {
      return false;
    }
    return this._id === other._id;
  }

  override toString(): string {
    return `InvitationRequest(${this._id}, ${this._requesterId} -> ${this._inviteeEmail.value}, ${this._status})`;
  }

  override toObject() {
    return {
      id: this._id,
      requesterId: this.requesterId,
      inviteeEmail: this.inviteeEmail,
      status: this.status,
      createdAt: this.createdAt,
      approvedById: this.approvedById,
      approvedAt: this.approvedAt,
    };
  }
}

export type UserRequestType = ReturnType<UserRequest["toObject"]>;
