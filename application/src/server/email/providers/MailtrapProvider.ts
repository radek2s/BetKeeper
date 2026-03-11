import type { UserNotificationSettings } from "@app/features/notification/user/model";
import type NextUserNotificationRepository from "@app/server/repositories/NextUserNotificationRepository";
import type { IUserNotificationRepository } from "@app/server/repositories/NextUserNotificationRepository";
import type {
  BetActionEvent,
  BetActionEventType,
  BetCreatedEvent,
  BetParticipant,
  BetRequestCreatedEvent,
} from "@domain/bet";
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
  private userSettingsRepository: IUserNotificationRepository;
  private administratorUser?: User;
  private readonly fromAddress: Address;

  private readonly friendInviteTemplateId: string;
  private readonly betInviteTemplateId: string;
  private readonly betAgreedTemplateId: string;
  private readonly betStatusTemplateId: string;

  constructor(
    userRepository: IUserRepository,
    userSettingsRepository: IUserNotificationRepository,
    administrator?: User,
  ) {
    logger.info("Using Mailtrap Email Provider");

    const token = process.env.EMAIL_MAILTRAP_API_KEY;
    if (!token)
      throw new Error(
        "Can't create MailtrapProvider - EMAIL_MAILTRAP_API_KEY is not provided!",
      );

    const friendInviteTemplateId = process.env.EMAIL_MAILTRAP_FRIEND_INVITE;
    if (!friendInviteTemplateId)
      throw new Error(
        "Can't create MailtrapProvider - Template ID is not provided! [EMAIL_MAILTRAP_FRIEND_INVITE]",
      );
    this.friendInviteTemplateId = friendInviteTemplateId;

    const betInviteTemplateId = process.env.EMAIL_MAILTRAP_BET_INVITE;
    if (!betInviteTemplateId)
      throw new Error(
        "Can't create MailtrapProvider - Template ID is not provided! [EMAIL_MAILTRAP_BET_INVITE]",
      );
    this.betInviteTemplateId = betInviteTemplateId;

    const betAgreedTemplateId = process.env.EMAIL_MAILTRAP_BET_AGREED;
    if (!betAgreedTemplateId)
      throw new Error(
        "Can't create MailtrapProvider - Template ID is not provided! [EMAIL_MAILTRAP_BET_AGREED]",
      );
    this.betAgreedTemplateId = betAgreedTemplateId;

    const betStatusTemplateId = process.env.EMAIL_MAILTRAP_BET_STATUS;
    if (!betStatusTemplateId)
      throw new Error(
        "Can't create MailtrapProvider - Template ID is not provided! [EMAIL_MAILTRAP_BET_STATUS]",
      );
    this.betStatusTemplateId = betStatusTemplateId;

    this.client = new MailtrapClient({
      token,
    });
    this.administratorUser = administrator;
    this.userRepository = userRepository;
    this.userSettingsRepository = userSettingsRepository;
    this.fromAddress = { name: "BetKeeper", email: "no-reply@betkeeper.ovh" };
  }

  async sendBetRequestCreatedNotification(event: BetRequestCreatedEvent) {
    try {
      const recipients = event.participants.filter(
        ({ userId }) => userId !== event.creatorId,
      );

      const enabledRecipientIds = await this.filterWithActiveSetting(
        recipients,
        "betRequestInvitation",
      );

      const recipientData = (
        await Promise.all(
          enabledRecipientIds.map(
            async (userId) => await this.userRepository.findById(userId),
          ),
        )
      ).filter((user) => !!user);
      const creatorData = await this.userRepository.findById(event.creatorId);

      recipientData.forEach((recipient) => {
        this.client.send({
          from: this.fromAddress,
          to: [{ email: recipient.email.value }],
          template_uuid: this.betInviteTemplateId,
          template_variables: {
            creatorName: `${creatorData?.name}`,
            betTitle: `${event.title}`,
            betId: event.betId,
          },
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

      if (!(await this.hasActiveSetting(recipient.id, "friendInvitation")))
        return;

      this.client.send({
        from: this.fromAddress,
        to: [{ email: recipient.email.value }],
        template_uuid: this.friendInviteTemplateId,
        template_variables: {
          senderName: sender.name,
        },
      });
    } catch (e) {
      if (e instanceof Error) {
        logger.error(`Unable to send email - ${e.message}`);
      }
    }
  }

  async sendBetCreatedNotification(event: BetCreatedEvent): Promise<void> {
    try {
      const enabledRecipientIds = await this.filterWithActiveSetting(
        event.watchers,
        "betRequestAggreed",
      );

      const recipientData = (
        await Promise.all(
          enabledRecipientIds.map(
            async (userId) => await this.userRepository.findById(userId),
          ),
        )
      ).filter((user) => !!user);

      recipientData.forEach((recipient) => {
        this.client.send({
          from: this.fromAddress,
          to: [{ email: recipient.email.value }],
          template_uuid: this.betAgreedTemplateId,
          template_variables: {
            betTitle: event.title,
            betId: event.betId,
          },
        });
      });
    } catch (e) {
      if (e instanceof Error) {
        logger.error(`Unable to send email - ${e.message}`);
      }
    }
  }

  async sendBetUpdateNotification(event: BetActionEvent): Promise<void> {
    try {
      const setting = this.mapEventToSetting(event.action);

      //Guard against unsupported event actions
      if (!setting) return;

      const enabledRecipientIds = await this.filterWithActiveSetting(
        event.watchers,
        setting,
      );

      const recipientData = (
        await Promise.all(
          enabledRecipientIds.map(
            async (userId) => await this.userRepository.findById(userId),
          ),
        )
      ).filter((user) => !!user);

      recipientData.forEach((recipient) => {
        this.client.send({
          from: this.fromAddress,
          to: [{ email: recipient.email.value }],
          template_uuid: this.betStatusTemplateId,
          template_variables: {
            betId: event.betId,
            betStatus: event.action,
            betTitle: event.title,
          },
        });
      });
    } catch (e) {
      if (e instanceof Error) {
        logger.error(`Unable to send email - ${e.message}`);
      }
    }
  }

  private mapEventToSetting(
    eventActionType: BetActionEventType,
  ): keyof UserNotificationSettings | null {
    switch (eventActionType) {
      case "complete":
        return "betCompleted";
      case "resolve":
        return "betResolved";
      case "delete":
        return null;
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

  private async filterWithActiveSetting(
    participants: BetParticipant[] | string[],
    setting: keyof UserNotificationSettings,
  ): Promise<string[]> {
    const result = await Promise.all(
      participants.map(async (user) => {
        const userId = typeof user === "string" ? user : user.userId;
        try {
          const settings = await this.userSettingsRepository.findById(userId);
          return settings[setting] ? userId : null;
        } catch {
          return null;
        }
      }),
    );
    return result.filter((value) => value !== null);
  }

  private async hasActiveSetting(
    userId: string,
    setting: keyof UserNotificationSettings,
  ): Promise<boolean> {
    try {
      const settings = await this.userSettingsRepository.findById(userId);
      const result = settings[setting];
      if (typeof result === "boolean") {
        return result;
      } else {
        throw new Error(`Unsupported setting ${setting}`);
      }
    } catch (e) {
      console.error(e);
      return false;
    }
  }
}

export default MailtrapProvider;
