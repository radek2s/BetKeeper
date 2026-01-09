import { DomainEvent, type EventWithWatchers, type UUID } from "@domain/shared";

export class BetEvent extends DomainEvent implements EventWithWatchers {
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
    return `Bet[${this.betId}]`;
  }
}

/**
 * Bet Created Domain Event
 * Raised when a bet request is approved and transforms into an active bet
 */
export class BetCreatedEvent extends BetEvent {
  readonly creatorId: UUID;
  constructor(
    betId: UUID,
    creatorId: UUID,
    title: string,
    participants: string[],
  ) {
    super(betId, "BetCreated", title, participants);
    this.creatorId = creatorId;
  }

  override toLog(): string {
    return `Bet[${this.betId}]::Created by ${this.creatorId}`;
  }
}

export type BetActionEventType = "resolve" | "complete" | "delete";

export class BetActionEvent extends BetEvent {
  readonly action: BetActionEventType;
  readonly executedBy: string;

  constructor(
    betId: UUID,
    action: BetActionEventType,
    executedBy: UUID,
    title: string,
    participants: string[],
  ) {
    super(betId, "BetRequestActionExecuted", title, participants);
    this.action = action;
    this.executedBy = executedBy;
  }

  override toLog(): string {
    return `Bet[${this.betId}]::${this.action} - by ${this.executedBy}`;
  }
}
