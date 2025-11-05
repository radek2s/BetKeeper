"use client";
/** biome-ignore-all lint/performance/noImgElement: <explanation> */
import type { User } from "@domain/user";
import type { UserType } from "@domain/user/entities";
import { Button } from "application/src/lib/components/button/Button";
import { IconButton } from "application/src/lib/components/button/IconButton";
import { ConfirmationDialog } from "application/src/lib/components/confirm-dialog";
import { objectToUser } from "application/src/lib/mappers/user";
import { suspendUser, toggleUserStatus } from "../actions/usersActions";

interface Props {
  userObject: UserType;
}
export function UserComponent({ userObject }: Props) {
  const user = objectToUser(userObject);

  const handleStatusUpdate = async (performAction: boolean) => {
    if (!performAction) return;
    try {
      await toggleUserStatus(user.id);
    } catch (e) {
      console.error(e);
    }
  };
  const handleUserDelete = async (performAction: boolean) => {
    if (!performAction) return;
    try {
      await suspendUser(user.id);
    } catch (e) {
      console.error(e);
    }
  };
  return (
    <div className="user-item flex justify-between">
      <div className="user-item__details flex gap-2">
        <img
          className="w-[48px] avatar"
          src={user?.avatarUrl || "/avatars/avatar_01.png"}
          alt="User avatar"
        />
        <div className="flex flex-col">
          <span>{user.name}</span>
          <span className="text-sm text-gray-800 dark:text-gray-400">
            {user.email.value}
          </span>
        </div>
      </div>
      <div className="user-item__actions flex gap-1 items-center">
        {user.status !== "suspended" && user.role !== "ADMINISTRATOR" && (
          <ConfirmationDialog
            content={"Do you want to delete user?"}
            title="Delete user"
            onClose={handleUserDelete}
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
      </div>
    </div>
  );
}
