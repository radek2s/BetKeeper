"use client";

import type { FriendRequestType } from "@domain/user/entities/FriendRequest";
import { approveFriendRequest } from "../../actions/friendListActions";

interface Props {
  userId: string;
  request: FriendRequestType;
}
export function FriendRequestItem({ userId, request }: Props) {
  const approveRequest = async () => {
    await approveFriendRequest(userId, request.id);
  };

  return (
    <div>
      <div>
        <span>Expires at:</span>
        <span>{request.expiresAt?.toLocaleString()}</span>
      </div>
      <button type="button" onClick={approveRequest}>
        Approve
      </button>
    </div>
  );
}
