import type { DomainEvent, IEventDispatcher } from "@domain/shared";
import { EmailDispatcherHandler } from "../email/emailDispatcher";
import type { BaseEventHandler, DomainEventHandler } from "./eventHandler";
import { ServerSideEventDispatcherHandler } from "./ServerSideEventHandler";

export class ServerEventDispatcher implements IEventDispatcher {
  private handlers: BaseEventHandler[];

  constructor(handlers: BaseEventHandler[] = []) {
    this.handlers = handlers;
  }

  async dispatch(event: DomainEvent): Promise<void> {
    this.eventHandlerChain()?.handle(event);
  }

  async dispatchAll(events: DomainEvent[]): Promise<void> {
    events.forEach((event) => {
      this.eventHandlerChain()?.handle(event);
    });
  }

  private eventHandlerChain(): DomainEventHandler | null {
    if (this.handlers.length === 0) return null;
    for (let i = 0; i < this.handlers.length - 1; i++) {
      this.handlers[i].setNext(this.handlers[i + 1]);
    }
    return this.handlers[0];
  }
}

export const ServerDispatcher = new ServerEventDispatcher([
  new ServerSideEventDispatcherHandler(),
  new EmailDispatcherHandler(),
]);
