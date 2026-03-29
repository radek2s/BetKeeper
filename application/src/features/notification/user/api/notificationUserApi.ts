import { getRequest, sendRequest } from "@app/lib/utils/fetchUtils";
import { handleErrorResponse } from "@app/ui/api-handler/ApiErrorHandler";
import type { UserNotificationSettingsType } from "../schema";

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

  if (!res.ok) {
    await handleErrorResponse(res);
  }
  return res.json();
}
