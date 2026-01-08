import { getRequest, sendRequest } from "@app/lib/utils/fetchUtils";
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

  if (!res.ok) {
    const { error, message } = await res.json();
    if (error === "Business rules error") throw new Error(message);

    throw new Error("Failed to invite friend");
  }

  return (await res.json()).result;
}

export async function removeFriend(friendId: string): Promise<void> {
  const url = `/api/v1/friend/${friendId}`;
  const res = await sendRequest(url, "DELETE");
  if (!res.ok) throw new Error("Failed to delete friend");
}

export async function cancelFriendRequest(requestId: string): Promise<void> {
  const url = `/api/v1/friend/request/${requestId}`;
  const res = await sendRequest(url, "DELETE");
  if (!res.ok) throw new Error("Failed to delete friend request");
}

export type FriendRequestUpdateAction = "accept" | "reject";
export async function updateFriendRequest(
  requestId: string,
  action: FriendRequestUpdateAction,
): Promise<void> {
  const url = `/api/v1/friend/request/${requestId}`;
  const res = await sendRequest(url, "PUT", { action });
  if (!res.ok) throw new Error("Failed to update friend request");
}
