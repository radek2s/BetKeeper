"use client";

import { UserListItem } from "@app/features/users/components/UserListItem";
import { IconButton } from "@app/ui/button/IconButton";
import { Panel } from "@app/ui/layout/Panel";
import { useCorbado } from "@corbado/react";
import type { UserType } from "@domain/user/entities";
import { approveFriendRequest, rejectFriendRequest } from "../actions";

type FriendRequestUser = UserType & {
  requestId: string;
};

interface Props {
  users: FriendRequestUser[];
}
export function FriendRequestReceived({ users }: Props) {
  const { sessionToken } = useCorbado();
  const friends = users;

  const handleApprove = async (requestId: string) => {
    try {
      approveFriendRequest(requestId, sessionToken);
    } catch (e) {
      console.error(e);
    }
  };

  const handleReject = async (requestId: string) => {
    try {
      rejectFriendRequest(requestId, sessionToken);
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <Panel header={{ title: "Pending request", icon: "waving-hand" }}>
      <div className="flex flex-col gap-2">
        {friends.length === 0 && (
          <span className="text-gray">No pending friend requests.</span>
        )}
        {friends.map((friend) => (
          <UserListItem key={friend.id} user={friend}>
            <IconButton
              icon="check"
              variant="ghost"
              onClick={() => handleApprove(friend.requestId)}
            />
            <IconButton
              icon="close"
              variant="ghost"
              onClick={() => handleReject(friend.requestId)}
            />
          </UserListItem>
        ))}
      </div>
    </Panel>
  );
}
