import { getAuth } from "@app/server/auth/authenticatorFactory";
import { ExceptionHandler } from "@app/server/exceptions/ExceptionHandler";
import { NextUserService } from "@app/server/services/NextUserService";
import logger from "application/logger";

export async function DELTE(
  req: Request,
  { params }: { params: { friendId: string } },
) {
  try {
    const user = await getAuth().getUser(req);
    const { friendId } = await params;

    await NextUserService.removeFriend(user.id, friendId);
    logger.info(`[Friend] - Friend ${friendId} has been removed by ${user.id}`);
  } catch (e) {
    return ExceptionHandler(e);
  }
}
