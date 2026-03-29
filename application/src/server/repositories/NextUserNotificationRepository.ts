import { UserNotificationSettings } from "@app/features/notification/user/model";
import type { UUID } from "@domain/shared";
import prisma from "../db";
import { handleDbError } from "../db/exceptions";

export interface IUserNotificationRepository {
  findById(userId: UUID): Promise<UserNotificationSettings>;
  save(settings: UserNotificationSettings): Promise<void>;
}
export class NextUserNotificationRepository
  implements IUserNotificationRepository
{
  private table = prisma.userNotifications;

  async findById(userId: UUID): Promise<UserNotificationSettings> {
    try {
      const settings = await this.table.findUnique({
        where: { id: userId },
      });
      if (!settings) return new UserNotificationSettings(userId);

      return UserNotificationSettings.reconstitute(
        settings.id,
        settings.friendInvitation,
        settings.betRequestInvitation,
        settings.betRequestAggreed,
        settings.betResolved,
        settings.betCompleted,
      );
    } catch (e) {
      throw handleDbError(e);
    }
  }

  async save(settings: UserNotificationSettings): Promise<void> {
    try {
      await this.table.upsert({
        where: { id: settings.userId },
        update: {
          friendInvitation: settings.friendInvitation,
          betRequestInvitation: settings.betRequestInvitation,
          betRequestAggreed: settings.betRequestAggreed,
          betResolved: settings.betResolved,
          betCompleted: settings.betCompleted,
        },
        create: {
          id: settings.userId,
          friendInvitation: settings.friendInvitation,
          betRequestInvitation: settings.betRequestInvitation,
          betRequestAggreed: settings.betRequestAggreed,
          betResolved: settings.betResolved,
          betCompleted: settings.betCompleted,
        },
      });
    } catch (e) {
      throw handleDbError(e);
    }
  }
}

export default NextUserNotificationRepository;
