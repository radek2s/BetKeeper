import { Panel } from "@app/ui/layout/Panel";
import type { PropsWithChildren, ReactNode } from "react";
import { useUserNotificationSettings } from "../../api/notificationUserQuery";
import type { UserNotificationSettingsType } from "../../model";

interface Props {
  children: (settings: UserNotificationSettingsType) => ReactNode;
}
function UserNotificationSettingsLoader({ children }: Props) {
  const { data, isLoading, error } = useUserNotificationSettings();

  if (isLoading)
    return (
      <EmailNotificationPanel>
        <section className="flex flex-col gap-1">
          <div className="skeleton h-[38]"></div>
          <div className="skeleton h-[24]"></div>
        </section>
        <section className="flex flex-col gap-1">
          <div className="skeleton h-[38]"></div>
          <div className="skeleton h-[24]"></div>
          <div className="skeleton h-[24]"></div>
          <div className="skeleton h-[24]"></div>
          <div className="skeleton h-[24]"></div>
        </section>
      </EmailNotificationPanel>
    );

  if (error)
    return (
      <EmailNotificationPanel>
        Unable to load notification settings
      </EmailNotificationPanel>
    );

  if (!data)
    return <EmailNotificationPanel>No settings</EmailNotificationPanel>;

  return <EmailNotificationPanel>{children(data)}</EmailNotificationPanel>;
}
export default UserNotificationSettingsLoader;

function EmailNotificationPanel({ children }: PropsWithChildren) {
  return (
    <Panel
      header={{ title: "Email notification", icon: "mail" }}
      className="flex flex-col gap-3 notification-settings-panel">
      {children}
    </Panel>
  );
}
