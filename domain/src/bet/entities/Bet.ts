import { Entity, generateId, type UUID } from "@domain/shared";
import {
  BetCompletedEvent,
  BetCreatedEvent,
  BetDeletedEvent,
  BetResolvedEvent,
} from "../events/BetEvents";
import { BetStatus } from "../types/BetStatus";
import type { IStake } from "../value-objects/Stakes";
import type { Terms } from "../value-objects/Terms";

/**
 * Bet Entity
 * Represents an active bet with immutable terms and stakes
 * Created when a BetRequest is approved by all participants
 */
export class Bet extends Entity {
  readonly id: UUID;
  readonly betRequestId: UUID;
  readonly creatorId: UUID;
  readonly participantId: UUID;
  readonly title: string;
  readonly terms: Terms;
  readonly stakes?: IStake;
  status: BetStatus;
  readonly createdAt: Date;
  updatedAt: Date;
  private _dueDate?: Date;
  resolvedAt?: Date;
  completedAt?: Date;
  winnerId?: UUID;
  evidence?: string;
  completionNotes?: string;

  constructor(
    betRequestId: UUID,
    creatorId: UUID,
    participantId: UUID,
    title: string,
    terms: Terms,
    stakes?: IStake,
    id?: UUID,
    createdAt?: Date,
  ) {
    super();
    this.id = id || generateId();
    this.betRequestId = betRequestId;
    this.creatorId = creatorId;
    this.participantId = participantId;
    this.title = title;
    this.terms = terms;
    this.stakes = stakes;
    this.status = BetStatus.PENDING;
    this.createdAt = createdAt || new Date();
    this.updatedAt = new Date();

    if (!id) {
      this.addDomainEvent(
        new BetCreatedEvent(
          this.id,
          this.betRequestId,
          this.creatorId,
          this.participantId,
          this.terms.value,
        ),
      );
    }
  }

  get participants(): UUID[] {
    return [this.creatorId, this.participantId];
  }

  get loserId(): UUID | undefined {
    if (!this.winnerId) return undefined;
    return this.winnerId === this.creatorId
      ? this.participantId
      : this.creatorId;
  }

  get dueDate(): Date | undefined {
    return this._dueDate;
  }

  private set dueDate(date: Date | undefined) {
    this._dueDate = date;
    this.updatedAt = new Date();
  }

  // Status checking methods
  isPending(): boolean {
    return this.status === BetStatus.PENDING;
  }

  isResolved(): boolean {
    return this.status === BetStatus.RESOLVED;
  }

  isCompleted(): boolean {
    return this.status === BetStatus.COMPLETED;
  }

  isDeleted(): boolean {
    return this.status === BetStatus.DELETED;
  }

  isActive(): boolean {
    return (
      this.status === BetStatus.PENDING || this.status === BetStatus.RESOLVED
    );
  }

  isFinal(): boolean {
    return (
      this.status === BetStatus.COMPLETED || this.status === BetStatus.DELETED
    );
  }

  canBeResolved(): boolean {
    return this.status === BetStatus.PENDING;
  }

  canBeCompleted(): boolean {
    return this.status === BetStatus.RESOLVED;
  }

  canBeDeleted(): boolean {
    return this.status !== BetStatus.DELETED;
  }

  requiresAction(): boolean {
    return (
      this.status === BetStatus.PENDING || this.status === BetStatus.RESOLVED
    );
  }
  isParticipant(userId: UUID): boolean {
    return userId === this.creatorId || userId === this.participantId;
  }

  isCreator(userId: UUID): boolean {
    return userId === this.creatorId;
  }

  isOverdue(): boolean {
    if (!this.dueDate) {
      return false;
    }
    return new Date() > this.dueDate && this.isResolved();
  }

  isDueSoon(daysThreshold: number = 3): boolean {
    if (!this.dueDate || !this.isResolved()) {
      return false;
    }
    const now = new Date();
    const timeDiff = this.dueDate.getTime() - now.getTime();
    const daysDiff = Math.ceil(timeDiff / (1000 * 3600 * 24));
    return daysDiff <= daysThreshold && daysDiff > 0;
  }

  isPendingTooLong(daysThreshold: number = 7): boolean {
    if (!this.isResolved()) {
      return false;
    }
    const now = new Date();
    const timeDiff = now.getTime() - this.createdAt.getTime();
    const daysDiff = Math.ceil(timeDiff / (1000 * 3600 * 24));
    return daysDiff > daysThreshold;
  }

  updateDueDate(newDueDate: Date | undefined, updatedById: UUID): void {
    if (this.status !== BetStatus.RESOLVED)
      new Error(
        "Due date can be modified only when bet is pending completion.",
      );

    if (!this.isParticipant(updatedById)) {
      throw new Error("Only participants can update bet request due date");
    }

    if (newDueDate && newDueDate <= new Date()) {
      throw new Error("Due date must be in the future");
    }

    this.dueDate = newDueDate;
  }

  // Domain methods
  resolve(
    resolvedById: UUID,
    winnerId: UUID,
    evidence?: string,
    dueDate?: Date,
  ): void {
    if (!this.canBeResolved()) {
      throw new Error("Cannot resolve: bet is not in pending state");
    }

    if (!this.isParticipant(resolvedById)) {
      throw new Error("Only participants can resolve the bet");
    }

    if (!this.isParticipant(winnerId)) {
      throw new Error("Winner must be one of the bet participants");
    }

    this.status = BetStatus.RESOLVED;
    this.resolvedAt = new Date();
    this.updatedAt = new Date();
    this.winnerId = winnerId;
    this.evidence = evidence;
    this._dueDate = dueDate;

    if (!this.loserId) {
      throw new Error("Loser Id is invalid!");
    }

    this.addDomainEvent(
      new BetResolvedEvent(
        this.id,
        resolvedById,
        this.winnerId,
        this.loserId,
        evidence,
        this.dueDate,
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

    this.status = BetStatus.COMPLETED;
    this.completedAt = new Date();
    this.updatedAt = new Date();
    this.completionNotes = completionNotes;

    this.addDomainEvent(
      new BetCompletedEvent(this.id, completedById, completionNotes),
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

    this.status = BetStatus.DELETED;
    this.updatedAt = new Date();

    this.addDomainEvent(new BetDeletedEvent(this.id, deletedById, reason));
  }

  // Factory method
  static createFromBetRequest(
    betRequestId: UUID,
    creatorId: UUID,
    participantId: UUID,
    title: string,
    terms: Terms,
    stakes?: IStake,
  ): Bet {
    return new Bet(
      betRequestId,
      creatorId,
      participantId,
      title,
      terms,
      stakes,
    );
  }

  static reconstitute(
    id: UUID,
    betRequestId: UUID,
    creatorId: UUID,
    participantId: UUID,
    title: string,
    terms: Terms,
    stakes: IStake | undefined,
    status: BetStatus,
    createdAt: Date,
    updatedAt: Date,
    dueDate: Date | undefined,
    resolvedAt: Date | undefined,
    completedAt: Date | undefined,
    winnerId: UUID | undefined,
    evidence: string | undefined,
    completionNotes: string | undefined,
  ) {
    const bet = new Bet(
      betRequestId,
      creatorId,
      participantId,
      title,
      terms,
      stakes,
      id,
      createdAt,
    );
    bet._dueDate = dueDate;
    bet.status = status;
    bet.updatedAt = updatedAt;
    bet.resolvedAt = resolvedAt;
    bet.completedAt = completedAt;
    bet.winnerId = winnerId;
    bet.evidence = evidence;
    bet.completionNotes = completionNotes;
    return bet;
  }

  // Entity implementation
  override equals(other: Entity): boolean {
    if (!(other instanceof Bet)) {
      return false;
    }
    return this.id === other.id;
  }

  override toString(): string {
    return `Bet(${this.id}, ${this.status}, ${this.title}, Creator: ${this.creatorId}, Participant: ${this.participantId})`;
  }

  override toObject() {
    return {
      id: this.id,
      betRequestId: this.betRequestId,
      creatorId: this.creatorId,
      participantId: this.participantId,
      title: this.title,
      terms: this.terms,
      stakes: this.stakes?.toObject(),
      status: this.status,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
      dueDate: this.dueDate,
      resolvedAt: this.resolvedAt,
      winnerId: this.winnerId,
      evidence: this.evidence,
      completionNotes: this.completionNotes,
    };
  }
}
