import { Button } from "@app/ui/button/Button";
import { Checkbox } from "@app/ui/checkbox";
import { Panel } from "@app/ui/layout/Panel";
import { useState } from "react";
import type { UserNotificationSettingsType } from "../../model";

interface Props {
  settings: UserNotificationSettingsType;
  onSave: (settings: UserNotificationSettingsType) => Promise<void>;
}
function UserNotificationSettingsForm({ settings, onSave }: Props) {
  const [isLoading, setLoading] = useState<boolean>(false);
  const [userSettings, setUserSettings] =
    useState<UserNotificationSettingsType>(settings);

  const isModified = JSON.stringify(settings) !== JSON.stringify(userSettings);

  const change = (
    settingKey: keyof UserNotificationSettingsType,
    value: boolean,
  ) => {
    setUserSettings((old) => ({ ...old, [settingKey]: value }));
  };

  const handleSave = async () => {
    try {
      setLoading(true);
      await onSave(userSettings);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setUserSettings(settings);
  };

  return (
    <>
      <section>
        <h3 className="mb-1 font-bold">Friends</h3>
        <div className="flex flex-col gap-1">
          <Checkbox
            id="friend-invitation"
            checked={userSettings.friendInvitation}
            onCheckedChange={(checked) => {
              change("friendInvitation", checked);
            }}>
            Recived invitation
          </Checkbox>
        </div>
      </section>
      <section>
        <h3 className="mb-1 font-bold">Bets</h3>
        <div className="flex flex-col gap-1">
          <Checkbox
            id="bet-request-invitation"
            checked={userSettings.betRequestInvitation}
            onCheckedChange={(checked) => {
              change("betRequestInvitation", checked);
            }}>
            Invitation to new bet request
          </Checkbox>
          <Checkbox
            id="bet-request-agreed"
            checked={userSettings.betRequestAggreed}
            onCheckedChange={(checked) => {
              change("betRequestAggreed", checked);
            }}>
            Bet marked as agreed
          </Checkbox>
          <Checkbox
            id="bet-resolved"
            checked={userSettings.betResolved}
            onCheckedChange={(checked) => {
              change("betResolved", checked);
            }}>
            Bet marked as resolved
          </Checkbox>
          <Checkbox
            id="bet-completed"
            checked={userSettings.betCompleted}
            onCheckedChange={(checked) => {
              change("betCompleted", checked);
            }}>
            Bet marked as completed
          </Checkbox>
        </div>
      </section>
      {isModified && (
        <div className="flex gap-1">
          <Button className="w-1/2" onClick={handleCancel}>
            Restore to default
          </Button>
          <Button
            className="w-1/2"
            onClick={handleSave}
            isLoading={isLoading}
            disabled={isLoading}
            variant="primary">
            Save changes
          </Button>
        </div>
      )}
    </>
  );
}
export default UserNotificationSettingsForm;
