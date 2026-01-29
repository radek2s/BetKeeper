/** biome-ignore-all lint/performance/noImgElement: <explanation> */
"use client";
import { IconButton } from "@app/ui/button/IconButton";
import { ConfirmationDialog } from "@app/ui/confirm-dialog";
import type { UserType } from "@domain/user/entities";
import { objectToUser } from "application/src/lib/mappers/user";
import { UserListItem } from "./UserListItem";

interface Props {
  userObject: UserType;
}
export function UserComponent({ userObject }: Props) {
  const user = objectToUser(userObject);

  const handleStatusUpdate = async (performAction: boolean) => {
    if (!performAction) return;
    try {
      //TODO: Implement user status request method
      throw new Error("Method not implemented");
      // await toggleUserStatus(user.id, sessionToken);
    } catch (e) {
      console.error(e);
    }
  };
  const handleUserDelete = async (performAction: boolean) => {
    if (!performAction) return;
    try {
      //TODO: Implement suspend user request method
      throw new Error("Method not implemented");
      // await suspendUser(user.id, sessionToken);
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
