"use client";

import { UserListItem } from "@app/features/users/components/UserListItem";
import { IconButton } from "@app/ui/button/IconButton";
import { Panel } from "@app/ui/layout/Panel";
import { useCorbado } from "@corbado/react";
import type { UserType } from "@domain/user/entities";
import { removeFriend } from "../actions";

interface Props {
  friendIds: string[];
  users: UserType[];
}
export function FriendList({ users, friendIds }: Props) {
  const { sessionToken } = useCorbado();
  const friends = users.filter(({ id }) => friendIds.includes(id));

  const handleRemove = async (friendId: string) => {
    try {
      await removeFriend(friendId, sessionToken);
    } catch (e) {
      console.error(e);
    }
  };

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
            <IconButton
              icon="close"
              variant="ghost"
              onClick={() => handleRemove(friend.id)}
            />
          </UserListItem>
        ))}
      </div>
    </Panel>
  );
}
