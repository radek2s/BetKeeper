import type { DomainEvent } from "../user/events/DomainEvent";

/**
 * Event Dispatcher Interface
 * Defines the contract for dispatching domain events
 */
export interface IEventDispatcher {
  /**
   * Dispatches a single domain event
   * @param event The domain event to dispatch
   */
  dispatch(event: DomainEvent): Promise<void>;

  /**
   * Dispatches multiple domain events
   * @param events Array of domain events to dispatch
   */
  dispatchAll(events: DomainEvent[]): Promise<void>;
}

/**
 * Null Object Pattern implementation for EventDispatcher
 * Used when no event dispatcher is provided
 */
export class NullEventDispatcher implements IEventDispatcher {
  async dispatch(_event: DomainEvent): Promise<void> {
    // Do nothing - null object pattern
  }

  async dispatchAll(_events: DomainEvent[]): Promise<void> {
    // Do nothing - null object pattern
  }
}

/**
 * In-Memory Event Dispatcher
 * Simple implementation that stores events in memory for testing
 */
export class InMemoryEventDispatcher implements IEventDispatcher {
  private _dispatchedEvents: DomainEvent[] = [];

  async dispatch(event: DomainEvent): Promise<void> {
    this._dispatchedEvents.push(event);
  }

  async dispatchAll(events: DomainEvent[]): Promise<void> {
    this._dispatchedEvents.push(...events);
  }

  get dispatchedEvents(): DomainEvent[] {
    return [...this._dispatchedEvents];
  }

  clear(): void {
    this._dispatchedEvents = [];
  }
}
