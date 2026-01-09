import { Button } from "@app/ui/button/Button";
import { IconButton } from "@app/ui/button/IconButton";
import { Popover } from "radix-ui";
import { BetNotificationItem } from "./BetNotificationItem";
import { isBetNotification } from "./model";
import { useNotificiations } from "./NotificationProvider";

export function NotificationBtn() {
  const { notifications, readAll, deleteAll } = useNotificiations();

  const unreaded = notifications.reduce((total, notification) => {
    if (notification.isRead) {
      return total;
    } else {
      return total + 1;
    }
  }, 0);

  return (
    <Popover.Root>
      <Popover.Trigger asChild>
        <IconButton icon="notification" badge={unreaded} />
      </Popover.Trigger>
      <Popover.Portal>
        <Popover.Content>
          <div className="flex flex-col gap-1 panel">
            {notifications.length === 0 ? (
              <div>
                <p className="text-gray mx-2 text-center">
                  You are up to date!
                  <br />
                  There are no new notifications
                </p>
              </div>
            ) : (
              <div>
                <div className="flex gap-1 mb-2">
                  <Button className="w-1/2" onClick={readAll}>
                    Read all
                  </Button>
                  <Button className="w-1/2" onClick={deleteAll}>
                    Delete all
                  </Button>
                </div>
                <div>
                  {notifications.map((notification) => {
                    if (isBetNotification(notification))
                      return (
                        <BetNotificationItem
                          notification={notification}
                          key={notification.id}
                        />
                      );
                    return null;
                  })}
                </div>
              </div>
            )}
          </div>
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  );
}
