import { DomainEvent, type UUID } from "@domain/shared";

/**
 * Bet Request Created Domain Event
 * Raised when a new bet request is created
 */
export class BetRequestCreatedEvent extends DomainEvent {
  public readonly betRequestId: UUID;
  public readonly creatorId: UUID;
  public readonly participantId: UUID;
  public readonly terms: string;

  constructor(
    betRequestId: UUID,
    creatorId: UUID,
    participantId: UUID,
    terms: string,
  ) {
    super("BetRequestCreated");
    this.betRequestId = betRequestId;
    this.creatorId = creatorId;
    this.participantId = participantId;
    this.terms = terms;
  }

  getAggregateId(): string {
    return this.betRequestId;
  }
}

/**
 * Bet Request Updated Domain Event
 * Raised when bet request terms or stakes are updated
 */
export class BetRequestUpdatedEvent extends DomainEvent {
  public readonly betRequestId: UUID;
  public readonly updatedById: UUID;
  public readonly previousTerms: string;
  public readonly newTerms: string;
  public readonly votesReset: boolean;

  constructor(
    betRequestId: UUID,
    updatedById: UUID,
    previousTerms: string,
    newTerms: string,
    votesReset: boolean = true,
  ) {
    super("BetRequestUpdated");
    this.betRequestId = betRequestId;
    this.updatedById = updatedById;
    this.previousTerms = previousTerms;
    this.newTerms = newTerms;
    this.votesReset = votesReset;
  }

  getAggregateId(): string {
    return this.betRequestId;
  }
}

/**
 * Bet Request Participant Vote Changed Domain Event
 * Raised when a participant approves or rejects a bet request
 */
export class BetRequestParticipantVoteChangedEvent extends DomainEvent {
  public readonly betRequestId: UUID;
  public readonly participantId: UUID;
  public readonly previousVote: string;
  public readonly newVote: string;

  constructor(
    betRequestId: UUID,
    participantId: UUID,
    previousVote: string,
    newVote: string,
  ) {
    super("BetRequestParticipantVoteChanged");
    this.betRequestId = betRequestId;
    this.participantId = participantId;
    this.previousVote = previousVote;
    this.newVote = newVote;
  }

  getAggregateId(): string {
    return this.betRequestId;
  }
}

/**
 * Bet Request Approved Domain Event
 * Raised when all participants have approved the bet request
 */
export class BetRequestApprovedEvent extends DomainEvent {
  public readonly betRequestId: UUID;
  public readonly creatorId: UUID;
  public readonly participantId: UUID;
  public readonly approvedAt: Date;

  constructor(betRequestId: UUID, creatorId: UUID, participantId: UUID) {
    super("BetRequestApproved");
    this.betRequestId = betRequestId;
    this.creatorId = creatorId;
    this.participantId = participantId;
    this.approvedAt = new Date();
  }

  getAggregateId(): string {
    return this.betRequestId;
  }
}

/**
 * Bet Request Rejected Domain Event
 * Raised when a participant rejects a bet request
 */
export class BetRequestRejectedEvent extends DomainEvent {
  public readonly betRequestId: UUID;
  public readonly rejectedById: UUID;
  public readonly rejectedAt: Date;

  constructor(betRequestId: UUID, rejectedById: UUID) {
    super("BetRequestRejected");
    this.betRequestId = betRequestId;
    this.rejectedById = rejectedById;
    this.rejectedAt = new Date();
  }

  getAggregateId(): string {
    return this.betRequestId;
  }
}

/**
 * Bet Request Blocked Domain Event
 * Raised when a participant blocks a bet request
 */
export class BetRequestBlockedEvent extends DomainEvent {
  public readonly betRequestId: UUID;
  public readonly blockedById: UUID;
  public readonly blockedAt: Date;

  constructor(betRequestId: UUID, blockedById: UUID) {
    super("BetRequestBlocked");
    this.betRequestId = betRequestId;
    this.blockedById = blockedById;
    this.blockedAt = new Date();
  }

  getAggregateId(): string {
    return this.betRequestId;
  }
}

/**
 * Bet Request Deleted Domain Event
 * Raised when a bet request is deleted by creator or admin
 */
export class BetRequestDeletedEvent extends DomainEvent {
  public readonly betRequestId: UUID;
  public readonly deletedById: UUID;
  public readonly deletedAt: Date;

  constructor(betRequestId: UUID, deletedById: UUID) {
    super("BetRequestDeleted");
    this.betRequestId = betRequestId;
    this.deletedById = deletedById;
    this.deletedAt = new Date();
  }

  getAggregateId(): string {
    return this.betRequestId;
  }
}
