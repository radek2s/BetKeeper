import type { DomainEvent } from "../user/events/DomainEvent";
import type { IEventDispatcher } from "./EventDispatcher";
import { NullEventDispatcher } from "./EventDispatcher";
import type { UUID } from "./Uuid";

/**
 * Abstract Entity Base Class
 * Provides unified domain event management and optional event dispatching
 * following DDD principles
 */
export abstract class Entity {
  private _domainEvents: DomainEvent[] = [];
  private readonly _eventDispatcher: IEventDispatcher;

  constructor(eventDispatcher?: IEventDispatcher) {
    this._eventDispatcher = eventDispatcher || new NullEventDispatcher();
  }

  abstract get id(): UUID;

  /**
   * Gets all domain events that have been raised by this entity
   */
  get domainEvents(): DomainEvent[] {
    return [...this._domainEvents];
  }

  /**
   * Adds a domain event to the entity's event collection
   * @param event The domain event to add
   */
  protected addDomainEvent(event: DomainEvent): void {
    this._domainEvents.push(event);
  }

  /**
   * Adds multiple domain events to the entity's event collection
   * @param events Array of domain events to add
   */
  protected addDomainEvents(events: DomainEvent[]): void {
    this._domainEvents.push(...events);
  }

  /**
   * Clears all domain events from the entity
   */
  clearDomainEvents(): void {
    this._domainEvents = [];
  }

  /**
   * Dispatches all pending domain events using the configured event dispatcher
   * and clears the events after dispatching
   */
  async dispatchDomainEvents(): Promise<void> {
    if (this._domainEvents.length === 0) {
      return;
    }

    const eventsToDispatch = [...this._domainEvents];
    this.clearDomainEvents();

    await this._eventDispatcher.dispatchAll(eventsToDispatch);
  }

  abstract equals(other: Entity): boolean;

  abstract toString(): string;
}

/**
 * Abstract Aggregate Root Base Class
 * Extends Entity with additional aggregate-specific functionality
 */
export abstract class AggregateRoot extends Entity {
  constructor(eventDispatcher?: IEventDispatcher) {
    super(eventDispatcher);
  }

  /**
   * Gets the aggregate version for optimistic concurrency control
   * Subclasses should implement this if they need versioning
   */
  get version(): number {
    return 0; // Default implementation
  }

  /**
   * Applies an event to the aggregate and adds it to the domain events
   * @param event The domain event to apply
   */
  protected applyEvent(event: DomainEvent): void {
    this.addDomainEvent(event);
    this.when(event);
  }

  /**
   * Event handler method that subclasses can override to handle specific events
   * @param event The domain event to handle
   */
  protected when(_event: DomainEvent): void {
    // Default implementation does nothing
    // Subclasses can override to implement event sourcing patterns
  }
}
