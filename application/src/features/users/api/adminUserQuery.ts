import { useQuery } from "@tanstack/react-query";
import { fetchActiveUsers, fetchPendingUserRequests } from "./adminUserApi";

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
