import { getRequest, sendRequest } from "@app/lib/utils/fetchUtils";
import type { UserType } from "@domain/user/entities";
import type { FriendsResponse } from "../model/friendsDto";

export async function fetchFriends(): Promise<FriendsResponse> {
  const url = "/api/v1/friend";
  const res = await getRequest(url);
  if (!res.ok) throw new Error("Failed to fetch friends");
  return res.json();
}

export async function inviteFriend(
  email: string,
): Promise<"invite" | "create"> {
  const url = "/api/v1/friend";
  const res = await sendRequest(url, "POST", { email });
  if (!res.ok) throw new Error("Failed to invite friend");

  return (await res.json()).result;
}
