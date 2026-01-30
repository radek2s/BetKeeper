"use client";

import { IconButton } from "@app/ui/button/IconButton";
import { ConfirmationDialog } from "@app/ui/confirm-dialog";

import type { UserRequestWithRequester } from "application/src/lib/mappers/user";
import { toRelativeTime } from "application/src/lib/utils/timeUtils";
import {
  useApproveUserRequest,
  useRejectUserRequest,
} from "../api/adminUserQuery";
import {
  UserRequestConfirmDialog,
  type UserRequestData,
} from "./UserRequestConfirmDialog";

interface Props {
  request: UserRequestWithRequester;
}
export function UserRequestComponent({ request }: Props) {
  const { mutateAsync: approve } = useApproveUserRequest(request.id);
  const { mutateAsync: reject, isPending: isRejecting } = useRejectUserRequest(
    request.id,
  );

  const handleApproval = async (data: UserRequestData | null) => {
    if (data) {
      try {
        await approve({ firstName: data.firstName, lastName: data.lastName });
      } catch (e) {
        console.error(e);
      }
    }
  };

  const handleReject = async (performAction: boolean) => {
    if (!performAction) return;
    try {
      await reject();
    } catch (e) {
      console.error(e);
    }
  };

  const relativeTime = () => {
    const [value, unit] = toRelativeTime(new Date(request.createdAt));
    if (unit === "second(s)") return "now";
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
          <IconButton icon="close" isLoading={isRejecting} variant="ghost" />
        </ConfirmationDialog>
      </div>
    </div>
  );
}
