"use client";
import type { UserRequest } from "@domain/user";
import type { UserRequestType } from "@domain/user/entities";
import { ACTIVE_USER_ID } from "application/src/constants";
import { Button } from "application/src/lib/components/button/Button";
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
      <div className="flex gap-1">
        <Button variant="primary" onClick={handleApproval}>
          Approve
        </Button>
        <Button onClick={handleReject}>Reject</Button>
      </div>
    </div>
  );
}
