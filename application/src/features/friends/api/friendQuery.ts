import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  cancelFriendRequest,
  type FriendRequestUpdateAction,
  fetchFriends,
  inviteFriend,
  removeFriend,
  updateFriendRequest,
} from "./friendApi";

const queryKeys = {
  friends: "friends",
} as const;

const mutationKeys = {
  invite: "invitieFriend",
  remove: "removeFriend",
  requestUpdate: "friendRequestUpdate",
  requestCancel: "friendRequestCancel",
} as const;

export function useFriends() {
  return useQuery({
    queryKey: [queryKeys.friends],
    queryFn: fetchFriends,
  });
}

export function useFriendInviteMutation() {
  const client = useQueryClient();
  return useMutation({
    mutationKey: [mutationKeys.invite],
    mutationFn: inviteFriend,
    onSuccess(data) {
      if (data === "invite") {
        client.invalidateQueries({ queryKey: [queryKeys.friends] });
      }
    },
  });
}

export function useFriendRemoveMutation() {
  const client = useQueryClient();
  return useMutation({
    mutationKey: [mutationKeys.remove],
    mutationFn: removeFriend,
    onSuccess() {
      client.invalidateQueries({ queryKey: [queryKeys.friends] });
    },
  });
}

export interface UpdateFriendRequestMutationType {
  requestId: string;
  action: FriendRequestUpdateAction;
}
export function useFriendRequestUpdateMutation() {
  const client = useQueryClient();
  return useMutation({
    mutationKey: [mutationKeys.requestUpdate],
    mutationFn: ({ requestId, action }: UpdateFriendRequestMutationType) =>
      updateFriendRequest(requestId, action),
    onSuccess() {
      client.invalidateQueries({ queryKey: [queryKeys.friends] });
    },
  });
}

export function useFriendRequestCancelMutation() {
  const client = useQueryClient();
  return useMutation({
    mutationKey: [mutationKeys.requestCancel],
    mutationFn: cancelFriendRequest,
    onSuccess() {
      client.invalidateQueries({ queryKey: [queryKeys.friends] });
    },
  });
}
