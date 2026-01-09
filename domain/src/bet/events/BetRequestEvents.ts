import { DomainEvent, type EventWithWatchers, type UUID } from "@domain/shared";
import type { AbstractBetRequest, StakeType } from "../entities";
import type { BetParticipant } from "../entities/BetParticipant";

export class BetRequestEvent extends DomainEvent implements EventWithWatchers {
  readonly betId: UUID;
  readonly title: string;
  readonly watchers: string[];

  constructor(
    betId: UUID,
    eventType: string,
    title: string,
    participants: string[],
  ) {
    super(eventType);
    this.betId = betId;
    this.title = title;
    this.watchers = participants;
  }

  getAggregateId(): string {
    return this.betId;
  }

  override toLog(): string {
    return `BetRequest[${this.betId}]`;
  }
}

/**
 * Bet Request Created Domain Event
 * Raised when a new bet request is created
 */
export class BetRequestCreatedEvent extends BetRequestEvent {
  readonly creatorId: UUID;
  readonly terms: string;
  readonly participants: BetParticipant[];
  readonly createdAt: Date;
  readonly stakeType: StakeType;

  constructor(
    betId: UUID,
    creatorId: UUID,
    title: string,
    terms: string,
    participants: BetParticipant[],
    createdAt: Date,
    stakeType: StakeType,
  ) {
    super(
      betId,
      "BetRequestCreated",
      title,
      participants.map((participant) => participant.userId),
    );
    this.creatorId = creatorId;
    this.terms = terms;
    this.participants = participants;
    this.createdAt = createdAt;
    this.stakeType = stakeType;
  }

  static fromBet(bet: AbstractBetRequest) {
    return new BetRequestCreatedEvent(
      bet.id,
      bet.creatorId,
      bet.title,
      bet.terms,
      bet.participants,
      bet.createdAt,
      bet.stakeType,
    );
  }

  private getClaims(): string {
    return this.participants
      .map((p) => [p.userId, p.claim].join("->"))
      .join(",");
  }

  override toLog(): string {
    return `BetRequest[${this.betId}]::Created by ${this.creatorId} (title=${this.title}, terms=${this.terms}, claims=[${this.getClaims()}])`;
  }
}

/**
 * Bet Request Updated Domain Event
 * Raised when bet request terms or stakes are updated
 */
export class BetRequestUpdatedEvent extends BetRequestEvent {
  readonly property: string;
  readonly oldValue: string;
  readonly newValue: string;
  readonly changedBy: UUID;

  constructor(
    betId: UUID,
    property: string,
    oldValue: string,
    newValue: string,
    changedBy: UUID,
    title: string,
    participants: string[],
  ) {
    super(betId, "BetRequestUpdated", title, participants);
    this.property = property;
    this.oldValue = oldValue;
    this.newValue = newValue;
    this.changedBy = changedBy;
  }

  override toLog(): string {
    return `BetRequest[${this.betId}]::Updated by ${this.changedBy} (${this.property}::${this.oldValue}->${this.newValue})`;
  }
}

export type ActionEventType = "approve" | "reject";

export class BetRequestActionEvent extends BetRequestEvent {
  readonly action: ActionEventType;
  readonly executedBy: string;

  constructor(
    betId: UUID,
    action: ActionEventType,
    executedBy: UUID,
    title: string,
    participants: string[],
  ) {
    super(betId, "BetRequestActionExecuted", title, participants);
    this.action = action;
    this.executedBy = executedBy;
  }

  override toLog(): string {
    return `BetRequest[${this.betId}]::${this.action} - by ${this.executedBy}`;
  }
}
