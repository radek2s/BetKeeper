/**
 * Base Domain Event
 * Abstract base class for all domain events in the user context
 */
export abstract class DomainEvent {
  public readonly eventId: string;
  public readonly occurredOn: Date;
  public readonly eventType: string;

  constructor(eventType: string) {
    this.eventId = `evt_${Date.now()}_${Math.random().toString(36).substring(2)}`;
    this.occurredOn = new Date();
    this.eventType = eventType;
  }

  abstract getAggregateId(): string;
}
