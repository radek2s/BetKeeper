import { authorizedUserToUserType } from "@app/features/users/model/userDto";
import { getAuthenticatedUserFromCookie } from "@app/server/auth/authentication";

export async function GET() {
  try {
    const user = await getAuthenticatedUserFromCookie();
    if (!user) throw new Error("Not logged");
    return Response.json(authorizedUserToUserType(user));
  } catch (e) {
    console.error(e);
    return Response.json({ error: "Server Error" }, { status: 500 });
  }
}
