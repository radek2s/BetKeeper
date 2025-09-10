import { Entity } from "./Entity";
import { IEventDispatcher, NullEventDispatcher } from "./EventDispatcher";

export abstract class DomainService {
  private readonly _eventDispatcher: IEventDispatcher;

  constructor(eventDispatcher?: IEventDispatcher) {
    this._eventDispatcher = eventDispatcher || new NullEventDispatcher();
  }

  /**
   * Dispatches all pending domain events using the configured event dispatcher
   * and clears the events after dispatching
   */
  async dispatchDomainEvents(entity: Entity): Promise<void> {
    if (entity.domainEvents.length === 0) {
      return;
    }

    const eventsToDispatch = [...entity.domainEvents];
    entity.clearDomainEvents();

    await this._eventDispatcher.dispatchAll(eventsToDispatch);
  }
}
