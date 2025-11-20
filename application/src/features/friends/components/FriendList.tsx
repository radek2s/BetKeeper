"use client";

import { Panel } from "@app/ui/layout/Panel";
import type { UserType } from "@domain/user/entities";

interface Props {
  friendIds: string[];
  users: UserType[];
}
export function FriendList({ users, friendIds }: Props) {
  const friends = users.filter(({ id }) => friendIds.includes(id));
  return (
    <Panel header={{ title: "Your friends", icon: "group" }}>
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
