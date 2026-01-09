export type NotificationType = {
  id: string;
  timestamp: string;
  message: string;
  isRead: boolean;
};

export type BetNotificationType = NotificationType & {
  betId: string;
};
export function isBetNotification(
  notification: object,
): notification is BetNotificationType {
  return Object.hasOwn(notification, "betId");
}
