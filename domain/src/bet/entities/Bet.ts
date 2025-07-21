import { Entity, generateId, UUID } from "@domain/shared";
import { Terms } from "../value-objects/Terms";
import { IStake } from "../value-objects/Stakes";
import { BetStatus, BetStatusGuards } from "../types/BetStatus";
import {
  BetCreatedEvent,
  BetResolvedEvent,
  BetCompletedEvent,
  BetDeletedEvent,
} from "../events/BetEvents";

/**
 * Bet Entity
 * Represents an active bet with immutable terms and stakes
 * Created when a BetRequest is approved by all participants
 */
export class Bet extends Entity {
  private readonly _id: UUID;
  private readonly _betRequestId: UUID;
  private readonly _creatorId: UUID;
  private readonly _participantId: UUID;
  private readonly _terms: Terms;
  private readonly _stakes?: IStake;
  private _status: BetStatus;
  private readonly _createdAt: Date;
  private _updatedAt: Date;
  private readonly _dueDate?: Date;
  private _resolvedAt?: Date;
  private _completedAt?: Date;
  private _winnerId?: UUID;
  private _loserId?: UUID;
  private _evidence?: string;
  private _completionNotes?: string;

  constructor(
    betRequestId: UUID,
    creatorId: UUID,
    participantId: UUID,
    terms: Terms,
    stakes?: IStake,
    dueDate?: Date,
    id?: UUID,
  ) {
    super();
    this._id = id || generateId();
    this._betRequestId = betRequestId;
    this._creatorId = creatorId;
    this._participantId = participantId;
    this._terms = terms;
    this._stakes = stakes;
    this._status = BetStatus.PENDING;
    this._createdAt = new Date();
    this._updatedAt = new Date();
    this._dueDate = dueDate;

    if (!id) {
      this.addDomainEvent(
        new BetCreatedEvent(
          this._id,
          this._betRequestId,
          this._creatorId,
          this._participantId,
          this._terms.value,
          this._dueDate,
        ),
      );
    }
  }

  // Getters
  override get id(): UUID {
    return this._id;
  }

  get betRequestId(): UUID {
    return this._betRequestId;
  }

  get creatorId(): UUID {
    return this._creatorId;
  }

  get participantId(): UUID {
    return this._participantId;
  }

  get terms(): Terms {
    return this._terms;
  }

  get stakes(): IStake | undefined {
    return this._stakes;
  }

  get status(): BetStatus {
    return this._status;
  }

  get createdAt(): Date {
    return this._createdAt;
  }

  get updatedAt(): Date {
    return this._updatedAt;
  }

  get dueDate(): Date | undefined {
    return this._dueDate;
  }

  get resolvedAt(): Date | undefined {
    return this._resolvedAt;
  }

  get completedAt(): Date | undefined {
    return this._completedAt;
  }

  get winnerId(): UUID | undefined {
    return this._winnerId;
  }

  get loserId(): UUID | undefined {
    return this._loserId;
  }

  get evidence(): string | undefined {
    return this._evidence;
  }

  get completionNotes(): string | undefined {
    return this._completionNotes;
  }

  get participants(): UUID[] {
    return [this._creatorId, this._participantId];
  }

  // Status checking methods
  isPending(): boolean {
    return BetStatusGuards.isPending(this._status);
  }

  isResolved(): boolean {
    return BetStatusGuards.isResolved(this._status);
  }

  isCompleted(): boolean {
    return BetStatusGuards.isCompleted(this._status);
  }

  isDeleted(): boolean {
    return BetStatusGuards.isDeleted(this._status);
  }

  isActive(): boolean {
    return BetStatusGuards.isActive(this._status);
  }

  isFinal(): boolean {
    return BetStatusGuards.isFinal(this._status);
  }

  canBeResolved(): boolean {
    return BetStatusGuards.canBeResolved(this._status);
  }

  canBeCompleted(): boolean {
    return BetStatusGuards.canBeCompleted(this._status);
  }

  canBeDeleted(): boolean {
    return BetStatusGuards.canBeDeleted(this._status);
  }

  isParticipant(userId: UUID): boolean {
    return userId === this._creatorId || userId === this._participantId;
  }

  isCreator(userId: UUID): boolean {
    return userId === this._creatorId;
  }

  isOverdue(): boolean {
    if (!this._dueDate) {
      return false;
    }
    return new Date() > this._dueDate && this.isPending();
  }

  isDueSoon(daysThreshold: number = 3): boolean {
    if (!this._dueDate || !this.isPending()) {
      return false;
    }
    const now = new Date();
    const timeDiff = this._dueDate.getTime() - now.getTime();
    const daysDiff = Math.ceil(timeDiff / (1000 * 3600 * 24));
    return daysDiff <= daysThreshold && daysDiff > 0;
  }

  isPendingTooLong(daysThreshold: number = 7): boolean {
    if (!this.isPending()) {
      return false;
    }
    const now = new Date();
    const timeDiff = now.getTime() - this._createdAt.getTime();
    const daysDiff = Math.ceil(timeDiff / (1000 * 3600 * 24));
    return daysDiff > daysThreshold;
  }

  // Domain methods
  resolve(resolvedById: UUID, winnerId: UUID, evidence?: string): void {
    if (!this.canBeResolved()) {
      throw new Error("Cannot resolve: bet is not in pending state");
    }

    if (!this.isParticipant(resolvedById)) {
      throw new Error("Only participants can resolve the bet");
    }

    if (!this.isParticipant(winnerId)) {
      throw new Error("Winner must be one of the bet participants");
    }

    this._status = BetStatus.RESOLVED;
    this._resolvedAt = new Date();
    this._updatedAt = new Date();
    this._winnerId = winnerId;
    this._loserId =
      winnerId === this._creatorId ? this._participantId : this._creatorId;
    this._evidence = evidence;

    this.addDomainEvent(
      new BetResolvedEvent(
        this._id,
        resolvedById,
        this._winnerId,
        this._loserId,
        evidence,
      ),
    );
  }

  complete(completedById: UUID, completionNotes?: string): void {
    if (!this.canBeCompleted()) {
      throw new Error("Cannot complete: bet is not in resolved state");
    }

    if (!this.isParticipant(completedById)) {
      throw new Error("Only participants can mark the bet as completed");
    }

    this._status = BetStatus.COMPLETED;
    this._completedAt = new Date();
    this._updatedAt = new Date();
    this._completionNotes = completionNotes;

    this.addDomainEvent(
      new BetCompletedEvent(this._id, completedById, completionNotes),
    );
  }

  delete(deletedById: UUID, reason?: string): void {
    if (!this.canBeDeleted()) {
      throw new Error("Cannot delete: bet is already deleted");
    }

    // Only creator or admin can delete (admin check would be done at service level)
    if (!this.isCreator(deletedById)) {
      throw new Error("Only the creator can delete this bet");
    }

    this._status = BetStatus.DELETED;
    this._updatedAt = new Date();

    this.addDomainEvent(new BetDeletedEvent(this._id, deletedById, reason));
  }

  // Factory method
  static createFromBetRequest(
    betRequestId: UUID,
    creatorId: UUID,
    participantId: UUID,
    terms: Terms,
    stakes?: IStake,
    dueDate?: Date,
  ): Bet {
    return new Bet(
      betRequestId,
      creatorId,
      participantId,
      terms,
      stakes,
      dueDate,
    );
  }

  // Entity implementation
  override equals(other: Entity): boolean {
    if (!(other instanceof Bet)) {
      return false;
    }
    return this._id === other._id;
  }

  override toString(): string {
    return `Bet(${this._id}, ${this._status}, Creator: ${this._creatorId}, Participant: ${this._participantId})`;
  }
}
