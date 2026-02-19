import { BetRequestCreatedEvent } from "@domain/bet";
import type { DomainEvent } from "@domain/shared";
import type { MailtrapClient } from "mailtrap";
import { BaseEventHandler } from "../events/eventHandler";
import { mailtrapClinet } from "./emailProvider";

export class EmailDispatcherHandler extends BaseEventHandler {
  private client: MailtrapClient | null;

  constructor() {
    super();
    this.client = mailtrapClinet;
    if (this.client == null) {
      console.log(
        "EmailDispatcher does not have attached client. Emails will not be sent.",
      );
    }
  }

  protected async process(event: DomainEvent): Promise<void> {
    if (!this.client) return;

    if (event instanceof BetRequestCreatedEvent) {
      try {
        await this.client.send({
          from: { name: "NoReply", email: "no-reply@betkeeper.ovh" },
          to: [{ email: "..." }],
          subject: "New bet request created",
          text: `Bet request about: ${event.title} has been creted.`,
        });
      } catch (e) {
        console.error(e);
      }
    }

    return;
  }
}
