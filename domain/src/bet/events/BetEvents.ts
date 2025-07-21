import { DomainEvent } from "./DomainEvent";
import { UUID } from "@domain/shared";

/**
 * Bet Created Domain Event
 * Raised when a bet request is approved and transforms into an active bet
 */
export class BetCreatedEvent extends DomainEvent {
  public readonly betId: UUID;
  public readonly betRequestId: UUID;
  public readonly creatorId: UUID;
  public readonly participantId: UUID;
  public readonly terms: string;
  public readonly createdAt: Date;
  public readonly dueDate?: Date;

  constructor(
    betId: UUID,
    betRequestId: UUID,
    creatorId: UUID,
    participantId: UUID,
    terms: string,
    dueDate?: Date
  ) {
    super("BetCreated");
    this.betId = betId;
    this.betRequestId = betRequestId;
    this.creatorId = creatorId;
    this.participantId = participantId;
    this.terms = terms;
    this.createdAt = new Date();
    this.dueDate = dueDate;
  }

  getAggregateId(): string {
    return this.betId;
  }
}

/**
 * Bet Resolved Domain Event
 * Raised when a bet is resolved (winner determined)
 */
export class BetResolvedEvent extends DomainEvent {
  public readonly betId: UUID;
  public readonly resolvedById: UUID;
  public readonly winnerId: UUID;
  public readonly loserId: UUID;
  public readonly resolvedAt: Date;
  public readonly evidence?: string;

  constructor(
    betId: UUID,
    resolvedById: UUID,
    winnerId: UUID,
    loserId: UUID,
    evidence?: string
  ) {
    super("BetResolved");
    this.betId = betId;
    this.resolvedById = resolvedById;
    this.winnerId = winnerId;
    this.loserId = loserId;
    this.resolvedAt = new Date();
    this.evidence = evidence;
  }

  getAggregateId(): string {
    return this.betId;
  }
}

/**
 * Bet Completed Domain Event
 * Raised when a bet is marked as completed (stakes fulfilled)
 */
export class BetCompletedEvent extends DomainEvent {
  public readonly betId: UUID;
  public readonly completedById: UUID;
  public readonly completedAt: Date;
  public readonly completionNotes?: string;

  constructor(betId: UUID, completedById: UUID, completionNotes?: string) {
    super("BetCompleted");
    this.betId = betId;
    this.completedById = completedById;
    this.completedAt = new Date();
    this.completionNotes = completionNotes;
  }

  getAggregateId(): string {
    return this.betId;
  }
}

/**
 * Bet Deleted Domain Event
 * Raised when a bet is deleted by creator or admin
 */
export class BetDeletedEvent extends DomainEvent {
  public readonly betId: UUID;
  public readonly deletedById: UUID;
  public readonly deletedAt: Date;
  public readonly reason?: string;

  constructor(betId: UUID, deletedById: UUID, reason?: string) {
    super("BetDeleted");
    this.betId = betId;
    this.deletedById = deletedById;
    this.deletedAt = new Date();
    this.reason = reason;
  }

  getAggregateId(): string {
    return this.betId;
  }
}

/**
 * Bet Due Date Approaching Domain Event
 * Raised when a bet's due date is approaching (3 days left)
 */
export class BetDueDateApproachingEvent extends DomainEvent {
  public readonly betId: UUID;
  public readonly dueDate: Date;
  public readonly daysLeft: number;
  public readonly participants: UUID[];

  constructor(betId: UUID, dueDate: Date, daysLeft: number, participants: UUID[]) {
    super("BetDueDateApproaching");
    this.betId = betId;
    this.dueDate = dueDate;
    this.daysLeft = daysLeft;
    this.participants = participants;
  }

  getAggregateId(): string {
    return this.betId;
  }
}

/**
 * Bet Pending Too Long Domain Event
 * Raised when a bet has been in pending state for more than 1 week
 */
export class BetPendingTooLongEvent extends DomainEvent {
  public readonly betId: UUID;
  public readonly createdAt: Date;
  public readonly daysPending: number;
  public readonly participants: UUID[];

  constructor(betId: UUID, createdAt: Date, daysPending: number, participants: UUID[]) {
    super("BetPendingTooLong");
    this.betId = betId;
    this.createdAt = createdAt;
    this.daysPending = daysPending;
    this.participants = participants;
  }

  getAggregateId(): string {
    return this.betId;
  }
}
