import type { DomainEvent } from "@domain/shared";

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
    const stream = new ReadableStream({
      start: (controller: ReadableStreamDefaultController) => {
        this.clients.set(watcherId, controller);
        try {
          //@ts-expect-error
          controller.signal?.addEventListener("abort", () => {
            this.clients.delete(watcherId);
          });
        } catch {}
      },
    });

    return stream;
  }

  broadcast(event: DomainEvent, watchers: string[]) {
    const encoder = new TextEncoder();
    const data = JSON.stringify(event);

    watchers.forEach((watcherId) => {
      const controller = this.clients.get(watcherId);
      try {
        controller?.enqueue(encoder.encode(`data: ${data}\n\n`));
      } catch {
        this.clients.delete(watcherId);
      }
    });
  }
}

export const ServerEventStream: EventStream = EventStream.instance;
