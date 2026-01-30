import type { UserRequestWithRequester } from "@app/lib/mappers/user";
import { UserStatus } from "@domain/user";
import type { UserType } from "@domain/user/entities";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  approveUserRequest,
  fetchActiveUsers,
  fetchPendingUserRequests,
  rejectUserRequest,
  suspendUser,
  toggleUserStatus,
} from "./adminUserApi";

export const queryKeys = {
  usersActive: "admin-users-active",
  usersRequests: "admin-users-requests",
} as const;

const mutationKeys = {
  request: {
    approve: "user-request-approve",
    reject: "user-request-reject",
  },
  user: {
    toggleStatus: "user-toggle-status",
    suspend: "user-suspend",
  },
} as const;

/////////////////////////////////////////////////////

export function useActiveUsers() {
  return useQuery({
    queryKey: [queryKeys.usersActive],
    queryFn: fetchActiveUsers,
    retry: false,
  });
}

export function usePendingUserRequests() {
  return useQuery({
    queryKey: [queryKeys.usersRequests],
    queryFn: fetchPendingUserRequests,
    retry: false,
  });
}

interface ApproveUserReqestType {
  firstName: string;
  lastName: string;
}
export function useApproveUserRequest(requestId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: [mutationKeys.request.approve],
    mutationFn: ({ firstName, lastName }: ApproveUserReqestType) =>
      approveUserRequest(requestId, firstName, lastName),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [queryKeys.usersActive] });
      queryClient.setQueryData(
        [queryKeys.usersRequests],
        (old: UserRequestWithRequester[]) =>
          old.filter(({ id }) => id !== requestId),
      );
    },
  });
}

export function useRejectUserRequest(requestId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: [mutationKeys.request.reject],
    mutationFn: () => rejectUserRequest(requestId),
    onSuccess: () => {
      queryClient.setQueryData(
        [queryKeys.usersRequests],
        (old: UserRequestWithRequester[]) =>
          old.filter(({ id }) => id !== requestId),
      );
    },
  });
}

export function useToggleUserStatus(userId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: [mutationKeys.user.toggleStatus, userId],
    mutationFn: () => toggleUserStatus(userId),
    onSuccess: () => {
      queryClient.setQueryData([queryKeys.usersActive], (old: UserType[]) =>
        old.map((user: UserType) => {
          if (user.id === userId) {
            if (user.status === UserStatus.ACTIVE) {
              user.status = UserStatus.INACTIVE;
            } else if (user.status === UserStatus.INACTIVE) {
              user.status = UserStatus.ACTIVE;
            }
          }
          return user;
        }),
      );
    },
  });
}

export function useSuspendUser(userId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: [mutationKeys.user.suspend, userId],
    mutationFn: () => suspendUser(userId),
    onSuccess: () => {
      queryClient.setQueryData([queryKeys.usersActive], (old: UserType[]) =>
        old.filter(({ id }) => id !== userId),
      );
    },
  });
}
