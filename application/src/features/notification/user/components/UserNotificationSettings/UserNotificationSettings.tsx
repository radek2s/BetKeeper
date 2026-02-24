"use client";

import { useSaveUserNotificationSettings } from "../../api/notificationUserQuery";
import type { UserNotificationSettingsType } from "../../model";
import UserNotificationSettingsForm from "./UserNotificationSettingsForm";
import UserNotificationSettingsLoader from "./UserNotificationSettingsLoader";

function UserNotificationSettings() {
  const { mutateAsync: saveSettings } = useSaveUserNotificationSettings();

  const handleSave = async (settings: UserNotificationSettingsType) => {
    try {
      await saveSettings(settings);
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <UserNotificationSettingsLoader>
      {(settings) => (
        <UserNotificationSettingsForm settings={settings} onSave={handleSave} />
      )}
    </UserNotificationSettingsLoader>
  );
}

export default UserNotificationSettings;
