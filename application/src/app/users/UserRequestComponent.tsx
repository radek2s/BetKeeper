"use client";
import type { UserRequest } from "@domain/user";
import type { UserRequestType } from "@domain/user/entities";
import { ACTIVE_USER_ID } from "application/src/constants";
import { approveUserRequest } from "../actions/usersActions";

interface Props {
  request: UserRequestType;
}
export function UserRequestComponent({ request }: Props) {
  const handleApproval = async () => {
    await approveUserRequest(request.id, "", "", ACTIVE_USER_ID);
  };

  const handleReject = async () => {};
  return (
    <div className="flex flex-col">
      <div className="flex gap-2">
        <span>{request.inviteeEmail}</span>
        <span>{request.createdAt.toLocaleString()}</span>
      </div>
      <div>
        <button type="button" onClick={handleApproval}>
          Approve
        </button>
        <button type="button" onClick={handleReject}>
          Reject
        </button>
      </div>
    </div>
  );
}
