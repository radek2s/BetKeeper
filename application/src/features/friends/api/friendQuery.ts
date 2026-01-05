import { useQuery } from "@tanstack/react-query";
import { fetchFriends } from "./friendApi";

const queryKeys = {
  friends: "friends",
} as const;

export function useFriends() {
  return useQuery({
    queryKey: [queryKeys.friends],
    queryFn: fetchFriends,
  });
}
