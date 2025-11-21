"use client";

import { UserListItem } from "@app/features/users/components/UserListItem";
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
      <div className="flex flex-col gap-2">
        {friends.length === 0 && (
          <span className="text-gray">
            You do not have any friend yet.
            <br /> Try to invite somebody!
          </span>
        )}
        {friends.map((friend) => (
          <UserListItem key={friend.id} user={friend}>
            <div></div>
          </UserListItem>
          // <div key={friend.id}>
          //   <span>
          //     {friend.firstName} {friend.lastName}
          //   </span>
          // </div>
        ))}
      </div>
    </Panel>
  );
}
