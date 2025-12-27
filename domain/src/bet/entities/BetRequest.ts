import { Entity, generateId, type UUID } from "@domain/shared";
import {
  BetRequestApprovedEvent,
  BetRequestBlockedEvent,
  BetRequestCreatedEvent,
  BetRequestDeletedEvent,
  BetRequestParticipantVoteChangedEvent,
  BetRequestRejectedEvent,
  BetRequestUpdatedEvent,
} from "../events/BetRequestEvents";
import type { BetStatus } from "../types";
import {
  BetRequestStatus,
  BetRequestStatusGuards,
  ParticipantVote,
  ParticipantVoteGuards,
} from "../types/BetRequestStatus";
import type { IStake } from "../value-objects/Stakes";
import type { Terms } from "../value-objects/Terms";
import type {
  BetParticipant,
  IndividualBetParticipant,
} from "./BetParticipant";

export type StakeType = "INDIVIDUAL" | "COMMON";

export type BetRequestType = {
  id: UUID;
  creatorId: UUID;
  title: string;
  terms: string;
  participants: BetParticipant[];
  stakeType: StakeType;
  createdAt: Date;
  updatedAt: Date;
};

export type CommonBetRequestType = BetRequestType & {
  stakeType: "COMMON";
  stake: string;
};

export abstract class AbstractBetRequest extends Entity {
  readonly id: UUID;
  readonly creatorId: UUID;
  abstract readonly stakeType: StakeType;
  readonly createdAt: Date;
  title: string;
  terms: string;
  participants: BetParticipant[];
  updatedAt: Date;

  constructor(
    creatorId: UUID,
    title: string,
    terms: string,
    participants: BetParticipant[],
    id: string | undefined,
  ) {
    super();
    const now = new Date();
    this.id = id || generateId();
    this.creatorId = creatorId;
    this.title = title;
    this.terms = terms;
    this.participants = participants;
    this.createdAt = now;
    this.updatedAt = now;
  }
}

export class CommonBetRequest extends AbstractBetRequest {
  stakeType: StakeType = "COMMON";
  stake: string;

  constructor(
    creatorId: UUID,
    title: string,
    terms: string,
    stake: string,
    participants: BetParticipant[],
    id: string | undefined,
  ) {
    super(creatorId, title, terms, participants, id);
    this.stake = stake;
  }

  static reconstitute(betRequest: CommonBetRequestType): CommonBetRequest {
    const newBetRequest = new CommonBetRequest(
      betRequest.creatorId,
      betRequest.title,
      betRequest.terms,
      betRequest.stake,
      betRequest.participants,
      betRequest.id,
    );
    newBetRequest.stake = betRequest.stake;
    newBetRequest.updatedAt = betRequest.updatedAt;
    return newBetRequest;
  }

  override equals(other: Entity): boolean {
    throw new Error("Method not implemented.");
  }
  override toString(): string {
    throw new Error("Method not implemented.");
  }
  override toObject(): object {
    throw new Error("Method not implemented.");
  }
}

export class IndividualBetRequest extends AbstractBetRequest {
  stakeType: StakeType = "INDIVIDUAL";
  override participants: IndividualBetParticipant[];

  constructor(
    creatorId: UUID,
    title: string,
    terms: string,
    participants: IndividualBetParticipant[],
    id: string | undefined,
  ) {
    super(creatorId, title, terms, participants, id);
    this.participants = participants;
  }
  override equals(other: Entity): boolean {
    throw new Error("Method not implemented.");
  }
  override toString(): string {
    throw new Error("Method not implemented.");
  }
  override toObject(): object {
    throw new Error("Method not implemented.");
  }
}

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
  readonly id: UUID;
  readonly creatorId: UUID;
  readonly participantId: UUID;
  title: string;
  terms: Terms;
  stakes?: IStake;
  status: BetRequestStatus;
  readonly createdAt: Date;
  updatedAt: Date;
  readonly participantVotes: Map<UUID, ParticipantVoteInfo>;
  readonly blockedByParticipants: Set<UUID>;

  constructor(
    creatorId: UUID,
    participantId: UUID,
    title: string,
    terms: Terms,
    stakes?: IStake,
    id?: UUID,
    createdAt?: Date,
    participantVotes?: Map<UUID, ParticipantVoteInfo>,
    blockedByParticipants?: Set<UUID>,
  ) {
    super();
    this.id = id || generateId();
    this.creatorId = creatorId;
    this.participantId = participantId;
    this.title = title;
    this.terms = terms;
    this.stakes = stakes;
    this.status = BetRequestStatus.PENDING;
    this.createdAt = createdAt || new Date();
    this.updatedAt = new Date();
    this.participantVotes = participantVotes || new Map();
    this.blockedByParticipants = blockedByParticipants || new Set();

    // Initialize participant votes as unknown
    this.participantVotes.set(creatorId, {
      participantId: creatorId,
      vote: ParticipantVote.UNKNOWN,
    });
    this.participantVotes.set(participantId, {
      participantId: participantId,
      vote: ParticipantVote.UNKNOWN,
    });

    if (!id) {
      this.addDomainEvent(
        new BetRequestCreatedEvent(
          this.id,
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

  // Status and vote checking methods
  isPending(): boolean {
    return BetRequestStatusGuards.isPending(this.status);
  }

  isApproved(): boolean {
    return BetRequestStatusGuards.isApproved(this.status);
  }

  isRejected(): boolean {
    return BetRequestStatusGuards.isRejected(this.status);
  }

  isBlocked(): boolean {
    return BetRequestStatusGuards.isBlocked(this.status);
  }

  isDeleted(): boolean {
    return BetRequestStatusGuards.isDeleted(this.status);
  }

  canBeModified(): boolean {
    return BetRequestStatusGuards.canBeModified(this.status);
  }

  getParticipantVote(participantId: UUID): ParticipantVote {
    const voteInfo = this.participantVotes.get(participantId);
    return voteInfo ? voteInfo.vote : ParticipantVote.UNKNOWN;
  }

  isParticipant(userId: UUID): boolean {
    return userId === this.creatorId || userId === this.participantId;
  }

  isCreator(userId: UUID): boolean {
    return userId === this.creatorId;
  }

  isBlockedByParticipant(participantId: UUID): boolean {
    return this.blockedByParticipants.has(participantId);
  }

  allParticipantsApproved(): boolean {
    return Array.from(this.participantVotes.values()).every((voteInfo) =>
      ParticipantVoteGuards.isApproved(voteInfo.vote),
    );
  }

  hasAnyRejection(): boolean {
    return Array.from(this.participantVotes.values()).some((voteInfo) =>
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

    const previousTerms = this.terms.value;
    this.terms = newTerms;
    this.updatedAt = new Date();

    // Reset all participant votes when terms are updated
    this.resetParticipantVotes();

    this.addDomainEvent(
      new BetRequestUpdatedEvent(
        this.id,
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

    this.stakes = newStakes;
    this.updatedAt = new Date();

    // Reset all participant votes when stakes are updated
    this.resetParticipantVotes();

    this.addDomainEvent(
      new BetRequestUpdatedEvent(
        this.id,
        updatedById,
        "Stakes updated",
        newStakes.toString(),
        true,
      ),
    );
  }

  private resetParticipantVotes(): void {
    for (const [participantId, voteInfo] of this.participantVotes) {
      const previousVote = voteInfo.vote;
      const newVoteInfo: ParticipantVoteInfo = {
        participantId,
        vote: ParticipantVote.UNKNOWN,
      };
      this.participantVotes.set(participantId, newVoteInfo);

      if (ParticipantVoteGuards.hasVoted(previousVote)) {
        this.addDomainEvent(
          new BetRequestParticipantVoteChangedEvent(
            this.id,
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
    this.participantVotes.set(participantId, voteInfo);

    this.addDomainEvent(
      new BetRequestParticipantVoteChangedEvent(
        this.id,
        participantId,
        currentVote,
        ParticipantVote.APPROVED,
      ),
    );

    // Check if all participants have approved
    if (this.allParticipantsApproved()) {
      this.status = BetRequestStatus.APPROVED;
      this.updatedAt = new Date();

      this.addDomainEvent(
        new BetRequestApprovedEvent(
          this.id,
          this.creatorId,
          this.participantId,
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
    this.participantVotes.set(participantId, voteInfo);

    this.status = BetRequestStatus.REJECTED;
    this.updatedAt = new Date();

    this.addDomainEvent(
      new BetRequestParticipantVoteChangedEvent(
        this.id,
        participantId,
        currentVote,
        ParticipantVote.REJECTED,
      ),
    );

    this.addDomainEvent(new BetRequestRejectedEvent(this.id, participantId));
  }

  block(participantId: UUID): void {
    if (!this.isParticipant(participantId)) {
      throw new Error("Only participants can block bet request");
    }

    if (this.isBlockedByParticipant(participantId)) {
      throw new Error("Bet request is already blocked by this participant");
    }

    this.blockedByParticipants.add(participantId);
    this.updatedAt = new Date();

    this.addDomainEvent(new BetRequestBlockedEvent(this.id, participantId));
  }

  unblock(participantId: UUID): void {
    if (!this.isParticipant(participantId)) {
      throw new Error("Only participants can unblock bet request");
    }

    if (!this.isBlockedByParticipant(participantId)) {
      throw new Error("Bet request is not blocked by this participant");
    }

    this.blockedByParticipants.delete(participantId);
    this.updatedAt = new Date();
  }

  delete(deletedById: UUID): void {
    if (this.isDeleted()) {
      throw new Error("Bet request is already deleted");
    }

    // Only creator or admin can delete (admin check would be done at service level)
    if (!this.isCreator(deletedById)) {
      throw new Error("Only the creator can delete this bet request");
    }

    this.status = BetRequestStatus.DELETED;
    this.updatedAt = new Date();

    this.addDomainEvent(new BetRequestDeletedEvent(this.id, deletedById));
  }

  // Factory method
  static create(
    creatorId: UUID,
    participantId: UUID,
    title: string,
    terms: Terms,
    stakes?: IStake,
  ): BetRequest {
    if (creatorId === participantId) {
      throw new Error("Creator and participant cannot be the same person");
    }

    return new BetRequest(creatorId, participantId, title, terms, stakes);
  }

  static reconstitute(
    id: UUID,
    creatorId: UUID,
    participantId: UUID,
    title: string,
    terms: Terms,
    stakes: IStake | undefined,
    status: BetRequestStatus,
    createdAt: Date,
    updatedAt: Date,
    participantVotes: Map<UUID, ParticipantVoteInfo>,
    blockedByParticipants: Set<UUID>,
  ): BetRequest {
    const betRequest = new BetRequest(
      creatorId,
      participantId,
      title,
      terms,
      stakes,
      id,
      createdAt,
      participantVotes,
      blockedByParticipants,
    );

    betRequest.status = status;
    betRequest.updatedAt = updatedAt;
    return betRequest;
  }

  // Entity implementation
  override equals(other: Entity): boolean {
    if (!(other instanceof BetRequest)) {
      return false;
    }
    return this.id === other.id;
  }

  override toString(): string {
    return `BetRequest(${this.id}, ${this.status}, ${this.title}, Creator: ${this.creatorId}, Participant: ${this.participantId})`;
  }

  override toObject() {
    return {
      id: this.id,
      creatorId: this.creatorId,
      participantId: this.participantId,
      title: this.title,
      terms: this.terms,
      stakes: this.stakes?.toObject(),
      status: this.status,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
      participantVotes: this.participantVotes,
      blockedByParticipants: this.blockedByParticipants,
    };
  }
}
