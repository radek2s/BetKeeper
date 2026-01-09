import type { DomainEvent } from "@domain/shared";
import logger from "application/logger";

export class EventStream {
  private clients = new Map<string, ReadableStreamDefaultController>();
  static #instance: EventStream;

  private constructor() {}

  //Ensure that only one instance of EventSteam is created
  static get instance(): EventStream {
    if (!EventStream.#instance) {
      EventStream.#instance = new EventStream();
    }
    return EventStream.#instance;
  }

  subscribe(watcherId: string) {
    logger.info(`New watcher: ${watcherId}`);
    const stream = new ReadableStream({
      start: (controller: ReadableStreamDefaultController) => {
        this.clients.set(watcherId, controller);
        try {
          //@ts-expect-error
          controller.signal?.addEventListener("abort", () => {
            logger.info(`Stream for watcher ${watcherId} has been aborted.`);
            this.clients.delete(watcherId);
          });
        } catch (e) {
          if (e instanceof Error) {
            logger.info(`Subscribe: ${e.message}`);
          }
        }
      },
    });

    return stream;
  }

  broadcast(event: DomainEvent, watchers: string[]) {
    const encoder = new TextEncoder();
    const data = JSON.stringify(event);
    logger.info(`Active subscribers: ${this.clients.size}`);
    logger.info(`Broadcasting to watchers: ${watchers.join(", ")}`);

    watchers.forEach((watcherId) => {
      const controller = this.clients.get(watcherId);
      try {
        logger.info(`Sending data to controller: ${watcherId} C:${controller}`);
        controller?.enqueue(encoder.encode(`data: ${data}\n\n`));
      } catch (e) {
        if (e instanceof Error) {
          logger.info(`Broadcast: ${e.message}`);
        }

        this.clients.delete(watcherId);
      }
    });
  }
}

export const ServerEventStream: EventStream = EventStream.instance;
