import { getRequest, sendRequest } from "@app/lib/utils/fetchUtils";
import type { UserType } from "@domain/user/entities";

export async function fetchUser(): Promise<UserType> {
  const url = "/api/v1/user";
  const res = await getRequest(url);
  if (!res.ok) throw new Error("Failed to fetch user details");
  return res.json();
}

export async function updateUserProfileImage(avatarUrl: string): Promise<void> {
  const url = "/api/v1/user/image";
  const response = await sendRequest(url, "PUT", { avatarUrl });

  if (!response.ok) throw new Error("Failed to fetch user details");
  return;
}

export async function updateUserName(
  firstName: string,
  lastName: string,
): Promise<void> {
  const url = "/api/v1/user/name";
  const response = await sendRequest(url, "PUT", { firstName, lastName });

  if (!response.ok) throw new Error("Failed to fetch user details");
  return;
}
