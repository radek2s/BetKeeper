import { UserNotificationSettings } from "@app/features/notification/user/model";
import type { IUserNotificationRepository } from "@app/server/repositories/NextUserNotificationRepository";
import type { UUID } from "../../src/shared/Uuid";

export class InMemoryUserSettingsRepository
  implements IUserNotificationRepository
{
  private userSettings: UserNotificationSettings[] = [];

  async findById(userId: UUID): Promise<UserNotificationSettings> {
    return (
      this.userSettings.find((settings) => settings.userId === userId) ??
      new UserNotificationSettings(userId)
    );
  }
  async save(settings: UserNotificationSettings): Promise<void> {
    const exisitngSettings = this.userSettings.find(
      ({ userId }) => userId === settings.userId,
    );
    if (exisitngSettings) {
      this.userSettings = this.userSettings.map((s) =>
        s.userId === exisitngSettings.userId ? settings : s,
      );
    } else {
      this.userSettings.push(settings);
    }
  }
}
