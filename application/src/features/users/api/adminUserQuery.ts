import { useMutation, useQuery } from "@tanstack/react-query";
import {
  approveUserRequest,
  fetchActiveUsers,
  fetchPendingUserRequests,
  rejectUserRequest,
} from "./adminUserApi";

export function useActiveUsers() {
  return useQuery({
    queryKey: ["admin-active-users"],
    queryFn: fetchActiveUsers,
    retry: false,
  });
}

export function usePendingUserRequests() {
  return useQuery({
    queryKey: ["admin-requests-users"],
    queryFn: fetchPendingUserRequests,
    retry: false,
  });
}

interface ApproveUserReqestType {
  firstName: string;
  lastName: string;
}
export function useApproveUserRequest(requestId: string) {
  return useMutation({
    mutationKey: ["admin-requests-approve"],
    mutationFn: ({ firstName, lastName }: ApproveUserReqestType) =>
      approveUserRequest(requestId, firstName, lastName),
  });
}

export function useRejectUserRequest(requestId: string) {
  return useMutation({
    mutationKey: ["admin-requests-approve"],
    mutationFn: () => rejectUserRequest(requestId),
  });
}
