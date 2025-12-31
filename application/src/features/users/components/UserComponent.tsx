/** biome-ignore-all lint/performance/noImgElement: <explanation> */
"use client";
import { suspendUser, toggleUserStatus } from "@app/features/users/actions";
import { IconButton } from "@app/ui/button/IconButton";
import { ConfirmationDialog } from "@app/ui/confirm-dialog";
import { useCorbado } from "@corbado/react";
import type { UserType } from "@domain/user/entities";
import { objectToUser } from "application/src/lib/mappers/user";
import { UserListItem } from "./UserListItem";

interface Props {
  userObject: UserType;
}
export function UserComponent({ userObject }: Props) {
  const { sessionToken } = useCorbado();
  const user = objectToUser(userObject);

  const handleStatusUpdate = async (performAction: boolean) => {
    if (!performAction) return;
    try {
      await toggleUserStatus(user.id, sessionToken);
    } catch (e) {
      console.error(e);
    }
  };
  const handleUserDelete = async (performAction: boolean) => {
    if (!performAction) return;
    try {
      await suspendUser(user.id, sessionToken);
    } catch (e) {
      console.error(e);
    }
  };
  return (
    <UserListItem user={userObject}>
      {user.status !== "suspended" && user.role !== "ADMINISTRATOR" && (
        <ConfirmationDialog
          content={"Do you want to delete user?"}
          title="Delete user"
          onClose={handleUserDelete}
          variant="error"
          accept="Delete">
          <IconButton icon="delete" variant="ghost" />
        </ConfirmationDialog>
      )}
      {user.status === "active" && (
        <ConfirmationDialog
          content={"Do you want to disable?"}
          title="Disable user"
          onClose={handleStatusUpdate}
          accept="Disable">
          <IconButton icon="person" variant="ghost" />
        </ConfirmationDialog>
      )}
      {user.status === "inactive" && (
        <ConfirmationDialog
          content={"Do you want to enable?"}
          title="Enable user"
          onClose={handleStatusUpdate}
          accept="Enable">
          <IconButton icon="person-off" variant="ghost" />
        </ConfirmationDialog>
      )}
    </UserListItem>
  );
}
