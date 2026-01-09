import type { BetActionEventType } from "@domain/bet";

export type DomainEventType = {
  eventId: string;
  occurredOn: string;
  eventType: string;
};

export type EventWithWatchersType = DomainEventType & {
  watchers: string;
};

export type BetEventType = EventWithWatchersType & {
  title: string;
  betId: string;
};

export function isBetEvent(event: object): event is BetEventType {
  return Object.hasOwn(event, "betId");
}

export type BetCreatedEventType = BetEventType & {
  creatorId: string;
};
export function isBetCreatedEvent(event: object): event is BetCreatedEventType {
  return Object.hasOwn(event, "creatorId");
}

export type BetActionType = BetEventType & {
  action: BetActionEventType;
  executedBy: string;
};

export function isBetActionEvent(event: object): event is BetActionType {
  return Object.hasOwn(event, "action");
}

export type BetUpdateEventType = BetEventType & {
  property: string;
  oldValue: string;
  newValue: string;
  changedBy: string;
};
export function isBetUpdateEvent(event: object): event is BetUpdateEventType {
  return Object.hasOwn(event, "newValue");
}
