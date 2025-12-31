import { DomainEvent, type UUID } from "@domain/shared";

export class BetEvent extends DomainEvent {
  readonly betId: UUID;

  constructor(betId: UUID, eventType: string) {
    super(eventType);
    this.betId = betId;
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
  constructor(betId: UUID, creatorId: UUID) {
    super(betId, "BetCreated");
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

  constructor(betId: UUID, action: BetActionEventType, executedBy: UUID) {
    super(betId, "BetRequestActionExecuted");
    this.action = action;
    this.executedBy = executedBy;
  }

  override toLog(): string {
    return `Bet[${this.betId}]::${this.action} - by ${this.executedBy}`;
  }
}
