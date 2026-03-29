"use client";

import { InvalidRequestDataError } from "@app/ui/api-handler/ApiErrorHandler";
import InvalidRequestDataMessage from "@app/ui/api-handler/InvalidRequestDataMessage";
import { useSaveUserNotificationSettings } from "../../api/notificationUserQuery";
import type { UserNotificationSettingsType } from "../../schema";
import UserNotificationSettingsForm from "./UserNotificationSettingsForm";
import UserNotificationSettingsLoader from "./UserNotificationSettingsLoader";

function UserNotificationSettings() {
  const { mutateAsync: saveSettings, error } =
    useSaveUserNotificationSettings();

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
        <>
          <UserNotificationSettingsForm
            settings={settings}
            onSave={handleSave}
          />
          {error && error instanceof InvalidRequestDataError && (
            <InvalidRequestDataMessage issues={error.issues} />
          )}
        </>
      )}
    </UserNotificationSettingsLoader>
  );
}

export default UserNotificationSettings;
