import type { UserRequestWithRequester } from "@app/lib/mappers/user";
import { getRequest } from "@app/lib/utils/fetchUtils";
import type { UserType } from "@domain/user/entities";

export async function fetchActiveUsers(): Promise<UserType[]> {
  const url = "/api/v1/admin/user";
  const res = await getRequest(url);

  if (!res.ok) throw new Error("Failed to fetch user details");
  return res.json();
}

export async function fetchPendingUserRequests(): Promise<
  UserRequestWithRequester[]
> {
  const url = "/api/v1/admin/request";
  const res = await getRequest(url);

  if (!res.ok) throw new Error("Failed to fetch user details");
  return res.json();
}
