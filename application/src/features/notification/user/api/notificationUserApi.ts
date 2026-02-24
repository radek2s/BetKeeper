import { getRequest, sendRequest } from "@app/lib/utils/fetchUtils";
import type { UserNotificationSettingsType } from "../model";

export async function fetchUserNotificationSettings(): Promise<UserNotificationSettingsType> {
  const url = "/api/v1/user/notification";
  const res = await getRequest(url);

  if (!res.ok) throw new Error("Failed to fetch user notification settings");
  return res.json();
}

export async function saveUserNotificationSettings(
  settings: UserNotificationSettingsType,
): Promise<UserNotificationSettingsType> {
  const url = "/api/v1/user/notification";
  const res = await sendRequest(url, "PUT", settings);

  if (!res.ok) throw new Error("Failed to fetch user notification settings");
  return res.json();
}
