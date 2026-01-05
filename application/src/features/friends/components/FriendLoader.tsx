import type { UserType } from "@domain/user/entities";
import type { ReactNode } from "react";
import { useFriends } from "../api/friendQuery";
import type { FriendsResponse } from "../model/friendsDto";

interface Props {
  children: (friends: FriendsResponse) => ReactNode;
}
export function FriendLoader({ children }: Props) {
  const { data, isLoading, error } = useFriends();
  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {(error as Error).message}</div>;
  if (!data) return <div>No data available</div>;

  return <>{children(data)}</>;
}
