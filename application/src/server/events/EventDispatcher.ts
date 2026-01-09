import {
  type DomainEvent,
  type IEventDispatcher,
  isWithWatchers,
} from "@domain/shared";
import { ServerEventStream } from "./ServerSideEventDispatcher";

export class ServerEventDispatcher implements IEventDispatcher {
  async dispatch(event: DomainEvent): Promise<void> {
    if (isWithWatchers(event)) {
      ServerEventStream.broadcast(event, event.watchers);
    }
  }
  async dispatchAll(events: DomainEvent[]): Promise<void> {
    events.forEach((event) => {
      if (isWithWatchers(event)) {
        ServerEventStream.broadcast(event, event.watchers);
      }
    });
  }
}

export const ServerDispatcher = new ServerEventDispatcher();
