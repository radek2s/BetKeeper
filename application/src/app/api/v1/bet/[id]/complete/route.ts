import { OkResponse } from "@app/lib/utils/fetchUtils";
import { getAuth } from "@app/server/auth/authenticatorFactory";
import { ExceptionHandler } from "@app/server/exceptions/ExceptionHandler";

import NextBetService from "@app/server/services/NextBetService";
import logger from "application/logger";

export async function PUT(
  req: Request,
  { params }: { params: { id: string } },
) {
  try {
    const user = await getAuth().getUser(req);

    const { id: betId } = await params;

    await NextBetService.complete(betId, user.id);

    logger.info(`[Bet][${betId}][Completed] - Completed by ${user.id}`);
    return OkResponse(null);
  } catch (e) {
    return ExceptionHandler(e);
  }
}
