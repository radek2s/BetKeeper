import {
  BetActionEvent,
  BetCreatedEvent,
  BetRequestCreatedEvent,
} from "@domain/bet";
import type { DomainEvent } from "@domain/shared";
import {
  FriendRequestSentEvent,
  InvitationRequestSentEvent,
} from "@domain/user";
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

    if (event instanceof InvitationRequestSentEvent) {
      this.client.sendUserRequestNotification(event);
    }

    if (event instanceof FriendRequestSentEvent) {
      this.client.sendFriendRequestNotification(event);
    }

    if (event instanceof BetRequestCreatedEvent) {
      this.client.sendBetRequestCreatedNotification(event);
    }

    if (event instanceof BetCreatedEvent) {
      this.client.sendBetCreatedNotification(event);
    }

    if (event instanceof BetActionEvent) {
      this.client.sendBetUpdateNotification(event);
    }
  }
}
