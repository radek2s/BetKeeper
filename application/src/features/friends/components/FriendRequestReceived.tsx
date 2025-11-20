"use client";

import { Panel } from "@app/ui/layout/Panel";
import type { UserType } from "@domain/user/entities";

interface Props {
  invitingUserId: string[];
  users: UserType[];
}
export function FriendRequestReceived({ users, invitingUserId }: Props) {
  const friends = users.filter(({ id }) => invitingUserId.includes(id));
  return (
    <Panel header={{ title: "Pending request", icon: "waving-hand" }}>
      <div>
        {friends.map((friend) => (
          <div key={friend.id}>
            <span>
              {friend.firstName} {friend.lastName}
            </span>
          </div>
        ))}
      </div>
    </Panel>
  );
}
