/** biome-ignore-all lint/performance/noImgElement: <explanation> */
"use client";
import { Panel } from "@app/ui/layout/Panel";
import type {
  FriendInvitationNonUser,
  FriendInvitationUser,
} from "../model/friendsDto";

interface Props {
  invitations: [FriendInvitationNonUser[], FriendInvitationUser[]];
}
export function FriendRequestsSent({ invitations }: Props) {
  const [userInvitations, friendInvitations] = invitations;
  return (
    <Panel header={{ title: "Sent invitations", icon: "groups" }}>
      <h3>Pending friend invitations</h3>
      <div>
        {friendInvitations.map((invitation) => (
          <div key={invitation.id} className="flex gap-2">
            <img
              className="w-[48px] avatar"
              src={invitation.avatarUrl ?? "/avatars/avatar_00.png"}
              alt="Avatar"
            />
            <div className="flex flex-col">
              <span>{invitation.name}</span>
              <span className="text-sm text-gray">{invitation.email}</span>
            </div>
          </div>
        ))}
      </div>

      <h3>Pending user invitations</h3>

      <div>
        {userInvitations.map((invitation) => (
          <div key={invitation.id}>
            <span>{invitation.email}</span>
          </div>
        ))}
      </div>
    </Panel>
  );
}
