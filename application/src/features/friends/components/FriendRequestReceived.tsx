"use client";

import { UserListItem } from "@app/features/users/components/UserListItem";
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
      <div className="flex flex-col gap-2">
        {friends.length === 0 && (
          <span className="text-gray">No pending friend requests.</span>
        )}
        {friends.map((friend) => (
          <UserListItem key={friend.id} user={friend}>
            <div></div>
          </UserListItem>
        ))}
      </div>
    </Panel>
  );
}
