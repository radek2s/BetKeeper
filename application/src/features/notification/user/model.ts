import type { UserNotificationSettingsType } from "./schema";

export class UserNotificationSettings {
  userId: string;
  friendInvitation: boolean = true;
  betRequestInvitation: boolean = true;
  betRequestAgreed: boolean = false;
  betResolved: boolean = false;
  betCompleted: boolean = false;

  constructor(userId: string) {
    this.userId = userId;
  }

  static reconstitute(
    userId: string,
    friendInvitation: boolean,
    betRequestInvitation: boolean,
    betRequestAgreed: boolean,
    betResolved: boolean,
    betCompleted: boolean,
  ) {
    const settings = new UserNotificationSettings(userId);
    settings.friendInvitation = friendInvitation;
    settings.betRequestInvitation = betRequestInvitation;
    settings.betRequestAgreed = betRequestAgreed;
    settings.betResolved = betResolved;
    settings.betCompleted = betCompleted;
    return settings;
  }

  toObject() {
    return {
      userId: this.userId,
      friendInvitation: this.friendInvitation,
      betRequestInvitation: this.betRequestInvitation,
      betRequestAgreed: this.betRequestAgreed,
      betResolved: this.betResolved,
      betCompleted: this.betCompleted,
    };
  }
}

export function toUserNotificationSettings(
  settings: UserNotificationSettingsType,
): UserNotificationSettings {
  return UserNotificationSettings.reconstitute(
    settings.userId,
    settings.friendInvitation,
    settings.betRequestInvitation,
    settings.betRequestAgreed,
    settings.betResolved,
    settings.betCompleted,
  );
}
