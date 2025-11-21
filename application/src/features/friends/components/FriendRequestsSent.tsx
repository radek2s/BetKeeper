/** biome-ignore-all lint/performance/noImgElement: <explanation> */
"use client";
import { toRelativeTime } from "@app/lib/utils/timeUtils";
import { Panel } from "@app/ui/layout/Panel";
import type { FriendInvitation } from "../model/friendsDto";

interface Props {
  invitations: FriendInvitation[];
}
export function FriendRequestsSent({ invitations }: Props) {
  const relativeTime = (invitation: FriendInvitation) => {
    const [value, unit] = toRelativeTime(invitation.createdAt);
    if (unit === "seconds") return "now";
    return `${value} ${unit} ago`;
  };
  return (
    <Panel header={{ title: "Sent invitations", icon: "group-add" }}>
      <div className="flex flex-col gap-2">
        {invitations.length === 0 && (
          <span className="text-gray">No sent frirend requests.</span>
        )}
        {invitations.map((invitation) => (
          <div
            key={invitation.id}
            className="user-item flex gap-2 items-center justify-between actions-wrapper">
            {invitation.name ? (
              <div className="user-item__details flex gap-2">
                <img
                  className="w-[48px] h-[48px] avatar"
                  src={invitation.avatarUrl || "/avatars/avatar_00.png"}
                  alt="User avatar"
                />
                <div className="flex flex-col">
                  <span>{invitation.name}</span>
                  <span className="text-sm text-gray">
                    invited {relativeTime(invitation)}
                  </span>
                </div>
              </div>
            ) : (
              <div className="flex flex-col">
                <span>{invitation.email}</span>
                <span className="text-sm text-gray">
                  invited {relativeTime(invitation)}
                </span>
              </div>
            )}
            <div className="flex gap-1 actions-wrapper__actions"></div>
          </div>
        ))}
      </div>
    </Panel>
  );
}
