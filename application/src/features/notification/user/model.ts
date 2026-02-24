export class UserNotificationSettings {
  userId: string;
  friendInvitation: boolean = true;
  betRequestInvitation: boolean = true;
  betRequestAggreed: boolean = false;
  betResolved: boolean = false;
  betCompleted: boolean = false;

  constructor(userId: string) {
    this.userId = userId;
  }

  static reconstitute(
    userId: string,
    friendInvitation: boolean,
    betRequestInvitation: boolean,
    betRequestAggreed: boolean,
    betResolved: boolean,
    betCompleted: boolean,
  ) {
    const settings = new UserNotificationSettings(userId);
    settings.friendInvitation = friendInvitation;
    settings.betRequestInvitation = betRequestInvitation;
    settings.betRequestAggreed = betRequestAggreed;
    settings.betResolved = betResolved;
    settings.betCompleted = betCompleted;
    return settings;
  }

  toObject() {
    return {
      userId: this.userId,
      friendInvitation: this.friendInvitation,
      betRequestInvitation: this.betRequestInvitation,
      betRequestAggreed: this.betRequestAggreed,
      betResolved: this.betResolved,
      betCompleted: this.betCompleted,
    };
  }
}

export type UserNotificationSettingsType = ReturnType<
  UserNotificationSettings["toObject"]
>;

export function toUserNotificationSettings(
  settings: UserNotificationSettingsType,
): UserNotificationSettings {
  return UserNotificationSettings.reconstitute(
    settings.userId,
    settings.friendInvitation,
    settings.betRequestInvitation,
    settings.betRequestAggreed,
    settings.betResolved,
    settings.betCompleted,
  );
}
