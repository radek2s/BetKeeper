import { toRelativeTime } from "@app/lib/utils/timeUtils";
import { IconButton } from "@app/ui/button/IconButton";
import { useRouter } from "next/navigation";
import type { BetNotificationType } from "./model";
import { useNotificiations } from "./NotificationProvider";

interface Props {
  notification: BetNotificationType;
}
export function BetNotificationItem({ notification }: Props) {
  const { readNotification, deleteNotification } = useNotificiations();

  const router = useRouter();

  const handleShow = () => {
    readNotification(notification.id);
    router.push(`/details/${notification.betId}`);
  };

  return (
    <div className="flex justyfy-between gap-2 mx-2 items-center">
      <div>
        {!notification.isRead && (
          <IconButton
            variant="ghost"
            icon="check"
            onClick={() => readNotification(notification.id)}
          />
        )}
      </div>

      <button
        onClick={handleShow}
        type="button"
        className="flex flex-col items-end clickable">
        <p>{notification.message}</p>
        <p className="text-sm text-gray">
          {toRelativeTime(new Date(notification.timestamp)).join(" ")} ago
        </p>
      </button>
      <div className="grow" />
      <IconButton
        variant="ghost"
        icon="delete"
        onClick={() => deleteNotification(notification.id)}
      />
    </div>
  );
}
