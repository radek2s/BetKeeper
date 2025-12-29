import { generateId, type UUID } from "./Uuid";

export abstract class DomainEvent {
  public readonly eventId: UUID;
  public readonly occurredOn: Date;
  public readonly eventType: string;

  constructor(eventType: string) {
    this.eventId = generateId();
    this.occurredOn = new Date();
    this.eventType = eventType;
  }

  abstract getAggregateId(): string;

  abstract toLog(): string;
}
