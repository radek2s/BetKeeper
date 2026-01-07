"use client";

import { UserListItem } from "@app/features/users/components/UserListItem";
import { IconButton } from "@app/ui/button/IconButton";
import { Panel } from "@app/ui/layout/Panel";
import { useCorbado } from "@corbado/react";
import { useState } from "react";
import { useFriendRequestUpdateMutation } from "../api/friendQuery";
import type { FriendRequestUser } from "../model/friendsDto";

interface Props {
  users: FriendRequestUser[];
}
export function FriendRequestReceived({ users }: Props) {
  const { sessionToken } = useCorbado();
  const friends = users;
  const { mutateAsync } = useFriendRequestUpdateMutation();
  const [approvePending, setAppprovePending] = useState<boolean>(false);
  const [rejectPending, setRejectPending] = useState<boolean>(false);

  const handleApprove = async (requestId: string) => {
    setAppprovePending(true);
    try {
      await mutateAsync({ requestId, action: "accept" });
    } catch (e) {
      console.error(e);
    } finally {
      setAppprovePending(false);
    }
  };

  const handleReject = async (requestId: string) => {
    setRejectPending(true);
    try {
      await mutateAsync({ requestId, action: "reject" });
    } catch (e) {
      console.error(e);
    } finally {
      setRejectPending(false);
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
              isLoading={approvePending}
            />
            <IconButton
              icon="close"
              variant="ghost"
              onClick={() => handleReject(friend.requestId)}
              isLoading={rejectPending}
            />
          </UserListItem>
        ))}
      </div>
    </Panel>
  );
}
