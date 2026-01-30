"use client";
import { IconButton } from "@app/ui/button/IconButton";
import { ConfirmationDialog } from "@app/ui/confirm-dialog";
import type { UserType } from "@domain/user/entities";
import { useSuspendUser, useToggleUserStatus } from "../api/adminUserQuery";
import { UserListItem } from "./UserListItem";

interface Props {
  userObject: UserType;
}
export function UserComponent({ userObject }: Props) {
  const { mutateAsync: toggleUser } = useToggleUserStatus(userObject.id);
  const { mutateAsync: suspendUser } = useSuspendUser(userObject.id);

  const handleStatusUpdate = async (performAction: boolean) => {
    if (!performAction) return;
    try {
      await toggleUser();
    } catch (e) {
      console.error(e);
    }
  };
  const handleUserDelete = async (performAction: boolean) => {
    if (!performAction) return;
    try {
      await suspendUser();
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <UserListItem user={userObject}>
      {userObject.status !== "suspended" &&
        userObject.role !== "ADMINISTRATOR" && (
          <ConfirmationDialog
            content={"Do you want to delete user?"}
            title="Delete user"
            onClose={handleUserDelete}
            variant="error"
            accept="Delete">
            <IconButton icon="delete" variant="ghost" />
          </ConfirmationDialog>
        )}
      {userObject.status === "active" && (
        <ConfirmationDialog
          content={"Do you want to disable?"}
          title="Disable user"
          onClose={handleStatusUpdate}
          accept="Disable">
          <IconButton icon="person" variant="ghost" />
        </ConfirmationDialog>
      )}
      {userObject.status === "inactive" && (
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
