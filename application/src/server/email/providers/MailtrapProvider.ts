import type { BetRequestCreatedEvent } from "@domain/bet";
import {
  Email,
  type FriendRequestSentEvent,
  type InvitationRequestSentEvent,
  type IUserRepository,
} from "@domain/user";
import type { User } from "@domain/user/entities";
import logger from "application/logger";
import { type Address, MailtrapClient } from "mailtrap";
import type { EmailProvider } from "../emailProvider.interface";

class MailtrapProvider implements EmailProvider {
  private client: MailtrapClient;
  private userRepository: IUserRepository;
  private administratorUser?: User;
  private readonly fromAddress: Address;

  constructor(userRepository: IUserRepository, administrator?: User) {
    logger.info("Using Mailtrap Email Provider");

    const token = process.env.EMAIL_MAILTRAP_API_KEY;
    if (!token)
      throw new Error(
        "Can't create MailtrapProvider - EMAIL_MAILTRAP_API_KEY is not provided!",
      );
    this.client = new MailtrapClient({
      token,
    });
    this.administratorUser = administrator;
    this.userRepository = userRepository;
    this.fromAddress = { name: "NoReply", email: "no-reply@betkeeper.ovh" };
  }

  async sendBetRequestCreatedNotification(event: BetRequestCreatedEvent) {
    try {
      const recipients = event.participants.filter(
        ({ userId }) => userId !== event.creatorId,
      );

      const recipientData = (
        await Promise.all(
          recipients.map(
            async ({ userId }) => await this.userRepository.findById(userId),
          ),
        )
      ).filter((user) => !!user);
      const creatorData = await this.userRepository.findById(event.creatorId);

      recipientData.forEach((recipient) => {
        this.client.send({
          from: this.fromAddress,
          to: [{ email: recipient.email.value }],
          subject: "New bet request create",
          text: `You have been invited to bet reqest ${event.title} created by ${creatorData?.name}.`,
        });
      });
    } catch (e) {
      if (e instanceof Error) {
        logger.error(`Unable to send email - ${e.message}`);
      }
    }
  }

  async sendUserRequestNotification(
    event: InvitationRequestSentEvent,
  ): Promise<void> {
    try {
      const administrator = await this.getAdministrator();
      const requester = await this.userRepository.findById(event.requesterId);

      this.client.send({
        from: this.fromAddress,
        to: [{ email: administrator.email.value }],
        subject: "New pending user request",
        text: `${requester?.name} invited ${event.inviteeEmail.value} to join to BetKeeper. Check users management panel.`,
      });
    } catch (e) {
      if (e instanceof Error) {
        logger.error(`Unable to send email - ${e.message}`);
      }
    }
  }

  async sendFriendRequestNotification(
    event: FriendRequestSentEvent,
  ): Promise<void> {
    try {
      const recipient = await this.userRepository.findById(event.receiverId);
      const sender = await this.userRepository.findById(event.senderId);
      if (!recipient || !sender)
        throw new Error("Recipient or sender was not found in database");

      this.client.send({
        from: this.fromAddress,
        to: [{ email: recipient.email.value }],
        subject: "New pending friend request",
        text: `${sender.name} invited you to be a friend. Check your Friend list in application to approve or reject invitation`,
      });
    } catch (e) {
      if (e instanceof Error) {
        logger.error(`Unable to send email - ${e.message}`);
      }
    }
  }

  private async getAdministrator(): Promise<User> {
    if (this.administratorUser) return this.administratorUser;

    const adminEmailString = process.env.EMAIL_ADMIN;
    if (!adminEmailString)
      throw new Error(
        "Email provider require administrator account. Provide EMAIL_ADMIN variable",
      );
    const adminEmail = new Email(adminEmailString);
    const administrator = await this.userRepository.findByEmail(adminEmail);
    if (!administrator || administrator?.role !== "ADMINISTRATOR")
      throw new Error("Invalid administrator email");
    return administrator;
  }
}

export default MailtrapProvider;
