import { authorizedUserToUserType } from "@app/features/users/model/userDto";
import { getAuthenticatedUserFromCookie } from "@app/server/auth/authentication";
import { getAuth } from "@app/server/auth/authenticatorFactory";

export async function GET(req: Request) {
  try {
    const user = await getAuth().getUser(req);
    return Response.json(user.toObject());
  } catch (e) {
    console.error(e);
    return Response.json({ error: "Server Error" }, { status: 500 });
  }
}
