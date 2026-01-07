import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { fetchFriends, inviteFriend } from "./friendApi";

const queryKeys = {
  friends: "friends",
} as const;

const mutationKeys = {
  invite: "invitieFriend",
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
