import { getAuthenticatedUserFromCookie } from "@app/server/auth/authentication";

export async function handleUserLogin() {
  const user = await getAuthenticatedUserFromCookie();
  if (!user) {
    return { success: false, message: "Not authenticated" };
  }

  return { success: true };
}
