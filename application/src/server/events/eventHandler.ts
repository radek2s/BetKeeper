import type { DomainEvent } from "@domain/shared";

export interface DomainEventHandler {
  setNext(handler: DomainEventHandler): DomainEventHandler;

  handle(event: DomainEvent): Promise<void> | void;
}
export abstract class BaseEventHandler implements DomainEventHandler {
  private next: DomainEventHandler | undefined;

  public setNext(handler: DomainEventHandler): DomainEventHandler {
    this.next = handler;
    return handler;
  }

  public async handle(event: DomainEvent): Promise<void> {
    try {
      await this.process(event);
    } catch (e) {
      if (e instanceof Error)
        console.error(`Event processing failed, ${e.message}`);
    }
    if (this.next) {
      return this.next.handle(event);
    }
  }

  protected abstract process(event: DomainEvent): Promise<void> | void;
}
