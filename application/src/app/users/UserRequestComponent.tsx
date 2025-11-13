"use client";
import type { UserRequest } from "@domain/user";
import type { UserRequestType } from "@domain/user/entities";
import { ACTIVE_USER_ID } from "application/src/constants";
import { Button } from "application/src/lib/components/button/Button";
import { IconButton } from "application/src/lib/components/button/IconButton";
import { approveUserRequest, rejectUserRequest } from "../actions/usersActions";
import {
  UserRequestConfirmDialog,
  type UserRequestData,
} from "./UserRequestConfirmDialog";

interface Props {
  request: UserRequestType;
}
export function UserRequestComponent({ request }: Props) {
  const handleApproval = async (data: UserRequestData | null) => {
    if (data) {
      await approveUserRequest(
        request.id,
        data.firstName,
        data.lastName,
        ACTIVE_USER_ID,
      );
    }
  };

  const handleReject = async () => {
    try {
      await rejectUserRequest(request.id);
    } catch (e) {
      console.error(e);
    }
  };
  return (
    <div className="flex gap-2 items-center justify-between">
      <div className="flex flex-col">
        <span>{request.inviteeEmail}</span>
        <span className="text-sm">{request.createdAt.toLocaleString()}</span>
      </div>
      <div className="flex gap-1">
        <UserRequestConfirmDialog onClose={handleApproval} />
        <IconButton onClick={handleReject} icon="close" variant="ghost" />
      </div>
    </div>
  );
}
