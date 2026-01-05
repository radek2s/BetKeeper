import { useQuery } from "@tanstack/react-query";
import { fetchUser } from "./userApi";

const queryKeys = {
  activeUser: "activeUser",
};

export function useUser() {
  return useQuery({
    queryKey: [queryKeys.activeUser],
    queryFn: fetchUser,
  });
}
