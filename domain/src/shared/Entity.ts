import { DomainEvent } from '../user/events/DomainEvent';
import { IEventDispatcher, NullEventDispatcher } from './EventDispatcher';

/**
 * Abstract Entity Base Class
 * Provides unified domain event management and optional event dispatching
 * following DDD principles
 */
export abstract class Entity<TId> {
  private _domainEvents: DomainEvent[] = [];
  private readonly _eventDispatcher: IEventDispatcher;

  constructor(eventDispatcher?: IEventDispatcher) {
    this._eventDispatcher = eventDispatcher || new NullEventDispatcher();
  }

  /**
   * Gets the unique identifier of the entity
   */
  abstract get id(): TId;

  /**
   * Gets all domain events that have been raised by this entity
   */
  get domainEvents(): DomainEvent[] {
    return [...this._domainEvents];
  }

  /**
   * Checks if the entity has any pending domain events
   */
  get hasDomainEvents(): boolean {
    return this._domainEvents.length > 0;
  }

  /**
   * Gets the number of pending domain events
   */
  get domainEventCount(): number {
    return this._domainEvents.length;
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

  /**
   * Dispatches a specific domain event immediately
   * @param event The domain event to dispatch
   */
  protected async dispatchEvent(event: DomainEvent): Promise<void> {
    await this._eventDispatcher.dispatch(event);
  }

  /**
   * Marks the entity as modified by updating its timestamp
   * Subclasses should call this method when entity state changes
   */
  protected markAsModified(): void {
    // Subclasses can override this to update timestamps or other metadata
  }

  /**
   * Abstract method for entity equality comparison
   * @param other The other entity to compare with
   */
  abstract equals(other: Entity<TId>): boolean;

  /**
   * Abstract method for string representation of the entity
   */
  abstract toString(): string;
}

/**
 * Abstract Aggregate Root Base Class
 * Extends Entity with additional aggregate-specific functionality
 */
export abstract class AggregateRoot<TId> extends Entity<TId> {
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
