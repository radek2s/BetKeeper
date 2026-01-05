import type { UserType } from "@domain/user/entities";
import type { FriendsResponse } from "../model/friendsDto";

export async function fetchFriends(): Promise<FriendsResponse> {
  const url = "/api/v1/friend";
  const res = await fetch(url);
  if (!res.ok) throw new Error("Failed to fetch friends");
  return res.json();
}
