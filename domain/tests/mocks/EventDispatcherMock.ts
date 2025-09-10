import { DomainEvent } from "../../src/user/events/DomainEvent";
import type { IEventDispatcher } from "../../src/shared/EventDispatcher";

export type EventHandler<T extends DomainEvent = DomainEvent> = (
  event: T,
) => void | Promise<void>;

export class EventDispatcherMock implements IEventDispatcher {
  private _eventHandlers: EventHandler[] = [];
  dispatchedEvents: DomainEvent[] = [];

  addHandler(handler: EventHandler) {
    this._eventHandlers.push(handler);
  }

  clearHandlers() {
    this._eventHandlers = [];
  }

  async dispatch(event: DomainEvent): Promise<void> {
    this.dispatchedEvents.push(event);

    for (const handler of this._eventHandlers) {
      await handler(event);
    }
  }

  async dispatchAll(_events: DomainEvent[]): Promise<void> {
    for (const event of _events) {
      await this.dispatch(event);
    }
  }
}
