"use client";
import {
  approveUserRequest,
  rejectUserRequest,
} from "@app/features/users/actions";
import { IconButton } from "@app/ui/button/IconButton";
import { ConfirmationDialog } from "@app/ui/confirm-dialog";
import { useCorbado } from "@corbado/react";
import type { UserRequestWithRequester } from "application/src/lib/mappers/user";
import { toRelativeTime } from "application/src/lib/utils/timeUtils";
import {
  UserRequestConfirmDialog,
  type UserRequestData,
} from "./UserRequestConfirmDialog";

interface Props {
  request: UserRequestWithRequester;
}
export function UserRequestComponent({ request }: Props) {
  const { sessionToken } = useCorbado();
  const handleApproval = async (data: UserRequestData | null) => {
    if (data) {
      await approveUserRequest(
        request.id,
        data.firstName,
        data.lastName,
        sessionToken,
      );
    }
  };

  const handleReject = async (performAction: boolean) => {
    if (!performAction) return;
    try {
      await rejectUserRequest(request.id, sessionToken);
    } catch (e) {
      console.error(e);
    }
  };

  const relativeTime = () => {
    const [value, unit] = toRelativeTime(request.createdAt);
    if (unit === "seconds") return "now";
    return `${value} ${unit} ago`;
  };
  return (
    <div className="flex gap-2 items-center justify-between actions-wrapper">
      <div className="flex flex-col">
        <span>{request.inviteeEmail}</span>
        <span className="text-sm text-gray">
          {relativeTime()} by {request.requesterName}
        </span>
      </div>
      <div className="flex gap-1 actions-wrapper__actions">
        <UserRequestConfirmDialog onClose={handleApproval} />
        <ConfirmationDialog
          content="Do you want to reject this invitation?"
          title="Reject user request"
          onClose={handleReject}
          variant="error"
          accept="Reject">
          <IconButton icon="close" variant="ghost" />
        </ConfirmationDialog>
      </div>
    </div>
  );
}
