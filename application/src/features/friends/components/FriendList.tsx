"use client";

import { UserListItem } from "@app/features/users/components/UserListItem";
import { IconButton } from "@app/ui/button/IconButton";
import { ConfirmationDialog } from "@app/ui/confirm-dialog";
import { Panel } from "@app/ui/layout/Panel";
import { useCorbado } from "@corbado/react";
import type { UserType } from "@domain/user/entities";
import { removeFriend } from "../actions";

interface Props {
  friends: UserType[];
}
export function FriendList({ friends }: Props) {
  const { sessionToken } = useCorbado();

  const handleRemove = async (accepted: boolean, friendId: string) => {
    if (!accepted) return;
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
              <IconButton icon="close" variant="ghost" />
            </ConfirmationDialog>
          </UserListItem>
        ))}
      </div>
    </Panel>
  );
}
