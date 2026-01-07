"use client";

import { UserListItem } from "@app/features/users/components/UserListItem";
import { IconButton } from "@app/ui/button/IconButton";
import { ConfirmationDialog } from "@app/ui/confirm-dialog";
import { Panel } from "@app/ui/layout/Panel";
import type { UserType } from "@domain/user/entities";
import { useState } from "react";
import { useFriendRemoveMutation } from "../api/friendQuery";

interface Props {
  friends: UserType[];
}
export function FriendList({ friends }: Props) {
  const { mutateAsync, isPending } = useFriendRemoveMutation();
  const [activeFriendId, setActiveFriendId] = useState<string | null>(null);

  const handleRemove = async (accepted: boolean, friendId: string) => {
    if (!accepted) return;
    try {
      setActiveFriendId(friendId);
      await mutateAsync(friendId);
    } catch (e) {
      console.error(e);
    }
    setActiveFriendId(null);
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
            <ConfirmationDialog
              content={
                <div className="text-center">
                  Are you sure about removing
                  <br />
                  <strong className="text-error">
                    {friend.firstName} {friend.lastName}
                  </strong>
                  <br />
                  from your friend list?
                </div>
              }
              title="Remove friend"
              onClose={(accepted) => handleRemove(accepted, friend.id)}
              variant="error"
              accept="Remove">
              <IconButton
                icon="close"
                variant="ghost"
                isLoading={isPending && friend.id === activeFriendId}
              />
            </ConfirmationDialog>
          </UserListItem>
        ))}
      </div>
    </Panel>
  );
}
