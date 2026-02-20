import { BetRequestCreatedEvent } from "@domain/bet";
import type { DomainEvent } from "@domain/shared";
import { BaseEventHandler } from "../events/eventHandler";
import type { EmailProvider } from "./emailProvider.interface";
import getEmailProvider from "./providers";

export class EmailDispatcherHandler extends BaseEventHandler {
  private client: EmailProvider | null;

  constructor() {
    super();
    this.client = getEmailProvider();
  }

  protected async process(event: DomainEvent): Promise<void> {
    if (!this.client) return;

    if (event instanceof BetRequestCreatedEvent) {
      this.client.sendBetRequestCreatedNotification(event);
    }
  }
}
