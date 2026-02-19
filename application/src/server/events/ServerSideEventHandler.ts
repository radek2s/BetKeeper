import { type DomainEvent, isWithWatchers } from "@domain/shared";
import { BaseEventHandler } from "./eventHandler";
import { ServerEventStream } from "./ServerSideEventDispatcher";

export class ServerSideEventDispatcherHandler extends BaseEventHandler {
  protected process(event: DomainEvent): Promise<void> | void {
    if (isWithWatchers(event)) {
      ServerEventStream.broadcast(event, event.watchers);
    }
  }
}
