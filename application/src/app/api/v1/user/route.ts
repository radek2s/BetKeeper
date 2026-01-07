import { getAuth } from "@app/server/auth/authenticatorFactory";
import { ExceptionHandler } from "@app/server/exceptions/ExceptionHandler";

export async function GET(req: Request) {
  try {
    const user = await getAuth().getUser(req);
    return Response.json(user.toObject());
  } catch (e) {
    return ExceptionHandler(e);
  }
}
