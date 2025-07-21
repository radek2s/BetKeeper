import { Entity, generateId, UUID } from "@domain/shared";
import { Terms } from "../value-objects/Terms";
import { IStake } from "../value-objects/Stakes";
import {
  BetRequestStatus,
  ParticipantVote,
  BetRequestStatusGuards,
  ParticipantVoteGuards,
} from "../types/BetRequestStatus";
import {
  BetRequestCreatedEvent,
  BetRequestUpdatedEvent,
  BetRequestParticipantVoteChangedEvent,
  BetRequestApprovedEvent,
  BetRequestRejectedEvent,
  BetRequestBlockedEvent,
  BetRequestDeletedEvent,
} from "../events/BetRequestEvents";

/**
 * Participant Vote Information
 * Tracks a participant's vote on the bet request
 */
export interface ParticipantVoteInfo {
  participantId: UUID;
  vote: ParticipantVote;
  votedAt?: Date;
}

/**
 * Bet Request Entity
 * Represents a draft bet where participants must agree on terms and stakes
 */
export class BetRequest extends Entity {
  private readonly _id: UUID;
  private readonly _creatorId: UUID;
  private readonly _participantId: UUID;
  private _terms: Terms;
  private _stakes?: IStake;
  private _status: BetRequestStatus;
  private readonly _createdAt: Date;
  private _updatedAt: Date;
  private _dueDate?: Date;
  private readonly _participantVotes: Map<UUID, ParticipantVoteInfo>;
  private readonly _blockedByParticipants: Set<UUID>;

  constructor(
    creatorId: UUID,
    participantId: UUID,
    terms: Terms,
    stakes?: IStake,
    dueDate?: Date,
    id?: UUID,
  ) {
    super();
    this._id = id || generateId();
    this._creatorId = creatorId;
    this._participantId = participantId;
    this._terms = terms;
    this._stakes = stakes;
    this._status = BetRequestStatus.PENDING;
    this._createdAt = new Date();
    this._updatedAt = new Date();
    this._dueDate = dueDate;
    this._participantVotes = new Map();
    this._blockedByParticipants = new Set();

    // Initialize participant votes as unknown
    this._participantVotes.set(creatorId, {
      participantId: creatorId,
      vote: ParticipantVote.UNKNOWN,
    });
    this._participantVotes.set(participantId, {
      participantId: participantId,
      vote: ParticipantVote.UNKNOWN,
    });

    if (!id) {
      this.addDomainEvent(
        new BetRequestCreatedEvent(
          this._id,
          this._creatorId,
          this._participantId,
          this._terms.value,
        ),
      );
    }
  }

  // Getters
  override get id(): UUID {
    return this._id;
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

  get status(): BetRequestStatus {
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

  get participants(): UUID[] {
    return [this._creatorId, this._participantId];
  }

  // Status and vote checking methods
  isPending(): boolean {
    return BetRequestStatusGuards.isPending(this._status);
  }

  isApproved(): boolean {
    return BetRequestStatusGuards.isApproved(this._status);
  }

  isRejected(): boolean {
    return BetRequestStatusGuards.isRejected(this._status);
  }

  isBlocked(): boolean {
    return BetRequestStatusGuards.isBlocked(this._status);
  }

  isDeleted(): boolean {
    return BetRequestStatusGuards.isDeleted(this._status);
  }

  canBeModified(): boolean {
    return BetRequestStatusGuards.canBeModified(this._status);
  }

  getParticipantVote(participantId: UUID): ParticipantVote {
    const voteInfo = this._participantVotes.get(participantId);
    return voteInfo ? voteInfo.vote : ParticipantVote.UNKNOWN;
  }

  isParticipant(userId: UUID): boolean {
    return userId === this._creatorId || userId === this._participantId;
  }

  isCreator(userId: UUID): boolean {
    return userId === this._creatorId;
  }

  isBlockedByParticipant(participantId: UUID): boolean {
    return this._blockedByParticipants.has(participantId);
  }

  allParticipantsApproved(): boolean {
    return Array.from(this._participantVotes.values()).every((voteInfo) =>
      ParticipantVoteGuards.isApproved(voteInfo.vote),
    );
  }

  hasAnyRejection(): boolean {
    return Array.from(this._participantVotes.values()).some((voteInfo) =>
      ParticipantVoteGuards.isRejected(voteInfo.vote),
    );
  }

  // Domain methods
  updateTerms(newTerms: Terms, updatedById: UUID): void {
    if (!this.canBeModified()) {
      throw new Error(
        "Cannot update terms: bet request is not in pending state",
      );
    }

    if (!this.isParticipant(updatedById)) {
      throw new Error("Only participants can update bet request terms");
    }

    const previousTerms = this._terms.value;
    this._terms = newTerms;
    this._updatedAt = new Date();

    // Reset all participant votes when terms are updated
    this.resetParticipantVotes();

    this.addDomainEvent(
      new BetRequestUpdatedEvent(
        this._id,
        updatedById,
        previousTerms,
        newTerms.value,
        true,
      ),
    );
  }

  updateStakes(newStakes: IStake, updatedById: UUID): void {
    if (!this.canBeModified()) {
      throw new Error(
        "Cannot update stakes: bet request is not in pending state",
      );
    }

    if (!this.isParticipant(updatedById)) {
      throw new Error("Only participants can update bet request stakes");
    }

    this._stakes = newStakes;
    this._updatedAt = new Date();

    // Reset all participant votes when stakes are updated
    this.resetParticipantVotes();

    this.addDomainEvent(
      new BetRequestUpdatedEvent(
        this._id,
        updatedById,
        "Stakes updated",
        newStakes.toString(),
        true,
      ),
    );
  }

  updateDueDate(newDueDate: Date | undefined, updatedById: UUID): void {
    if (!this.canBeModified()) {
      throw new Error(
        "Cannot update due date: bet request is not in pending state",
      );
    }

    if (!this.isParticipant(updatedById)) {
      throw new Error("Only participants can update bet request due date");
    }

    if (newDueDate && newDueDate <= new Date()) {
      throw new Error("Due date must be in the future");
    }

    this._dueDate = newDueDate;
    this._updatedAt = new Date();
  }

  private resetParticipantVotes(): void {
    for (const [participantId, voteInfo] of this._participantVotes) {
      const previousVote = voteInfo.vote;
      const newVoteInfo: ParticipantVoteInfo = {
        participantId,
        vote: ParticipantVote.UNKNOWN,
      };
      this._participantVotes.set(participantId, newVoteInfo);

      if (ParticipantVoteGuards.hasVoted(previousVote)) {
        this.addDomainEvent(
          new BetRequestParticipantVoteChangedEvent(
            this._id,
            participantId,
            previousVote,
            ParticipantVote.UNKNOWN,
          ),
        );
      }
    }
  }

  approve(participantId: UUID): void {
    if (!this.canBeModified()) {
      throw new Error("Cannot approve: bet request is not in pending state");
    }

    if (!this.isParticipant(participantId)) {
      throw new Error("Only participants can approve bet request");
    }

    const currentVote = this.getParticipantVote(participantId);
    if (ParticipantVoteGuards.isApproved(currentVote)) {
      throw new Error("Participant has already approved this bet request");
    }

    const voteInfo: ParticipantVoteInfo = {
      participantId,
      vote: ParticipantVote.APPROVED,
      votedAt: new Date(),
    };
    this._participantVotes.set(participantId, voteInfo);

    this.addDomainEvent(
      new BetRequestParticipantVoteChangedEvent(
        this._id,
        participantId,
        currentVote,
        ParticipantVote.APPROVED,
      ),
    );

    // Check if all participants have approved
    if (this.allParticipantsApproved()) {
      this._status = BetRequestStatus.APPROVED;
      this._updatedAt = new Date();

      this.addDomainEvent(
        new BetRequestApprovedEvent(
          this._id,
          this._creatorId,
          this._participantId,
        ),
      );
    }
  }

  reject(participantId: UUID): void {
    if (!this.canBeModified()) {
      throw new Error("Cannot reject: bet request is not in pending state");
    }

    if (!this.isParticipant(participantId)) {
      throw new Error("Only participants can reject bet request");
    }

    const currentVote = this.getParticipantVote(participantId);
    if (ParticipantVoteGuards.isRejected(currentVote)) {
      throw new Error("Participant has already rejected this bet request");
    }

    const voteInfo: ParticipantVoteInfo = {
      participantId,
      vote: ParticipantVote.REJECTED,
      votedAt: new Date(),
    };
    this._participantVotes.set(participantId, voteInfo);

    this._status = BetRequestStatus.REJECTED;
    this._updatedAt = new Date();

    this.addDomainEvent(
      new BetRequestParticipantVoteChangedEvent(
        this._id,
        participantId,
        currentVote,
        ParticipantVote.REJECTED,
      ),
    );

    this.addDomainEvent(new BetRequestRejectedEvent(this._id, participantId));
  }

  block(participantId: UUID): void {
    if (!this.isParticipant(participantId)) {
      throw new Error("Only participants can block bet request");
    }

    if (this.isBlockedByParticipant(participantId)) {
      throw new Error("Bet request is already blocked by this participant");
    }

    this._blockedByParticipants.add(participantId);
    this._updatedAt = new Date();

    this.addDomainEvent(new BetRequestBlockedEvent(this._id, participantId));
  }

  unblock(participantId: UUID): void {
    if (!this.isParticipant(participantId)) {
      throw new Error("Only participants can unblock bet request");
    }

    if (!this.isBlockedByParticipant(participantId)) {
      throw new Error("Bet request is not blocked by this participant");
    }

    this._blockedByParticipants.delete(participantId);
    this._updatedAt = new Date();
  }

  delete(deletedById: UUID): void {
    if (this.isDeleted()) {
      throw new Error("Bet request is already deleted");
    }

    // Only creator or admin can delete (admin check would be done at service level)
    if (!this.isCreator(deletedById)) {
      throw new Error("Only the creator can delete this bet request");
    }

    this._status = BetRequestStatus.DELETED;
    this._updatedAt = new Date();

    this.addDomainEvent(new BetRequestDeletedEvent(this._id, deletedById));
  }

  // Factory method
  static create(
    creatorId: UUID,
    participantId: UUID,
    terms: Terms,
    stakes?: IStake,
    dueDate?: Date,
  ): BetRequest {
    if (creatorId === participantId) {
      throw new Error("Creator and participant cannot be the same person");
    }

    return new BetRequest(creatorId, participantId, terms, stakes, dueDate);
  }

  // Entity implementation
  override equals(other: Entity): boolean {
    if (!(other instanceof BetRequest)) {
      return false;
    }
    return this._id === other._id;
  }

  override toString(): string {
    return `BetRequest(${this._id}, ${this._status}, Creator: ${this._creatorId}, Participant: ${this._participantId})`;
  }
}
