import type { ReactNode } from "react";
import { useFriends } from "../api/friendQuery";
import type { FriendsResponse } from "../model/friendsDto";

interface Props {
  loader?: ReactNode;
  children: (friends: FriendsResponse) => ReactNode;
}
export function FriendLoader({ loader, children }: Props) {
  const { data, isLoading, error } = useFriends();
  if (isLoading) return loader ? loader : <div>Loading friends...</div>;
  if (error) return <div>Error: {(error as Error).message}</div>;
  if (!data) return <div>No data available</div>;

  return <>{children(data)}</>;
}
