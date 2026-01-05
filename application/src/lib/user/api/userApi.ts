import type { UserType } from "@domain/user/entities";

export async function fetchUser(): Promise<UserType> {
  const url = "/api/v1/user";
  const res = await fetch(url);
  if (!res.ok) throw new Error("Failed to fetch user details");
  return res.json();
}
