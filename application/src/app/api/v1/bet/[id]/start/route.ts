import { OkResponse } from "@app/lib/utils/fetchUtils";
import { getAuth } from "@app/server/auth/authenticatorFactory";
import { ExceptionHandler } from "@app/server/exceptions/ExceptionHandler";

import NextBetService from "@app/server/services/NextBetService";
import logger from "application/logger";

/**
 * Start bet
 * @tag Bet
 * @description Start bet - make bet request immutable
 * @response null
 * @openapi
 */
export async function PUT(
  req: Request,
  { params }: { params: { id: string } },
) {
  try {
    const user = await getAuth().getUser(req);

    const { id: betId } = await params;

    await NextBetService.convertToBet(betId);

    logger.info(
      `[BetRequest][${betId}][Started] - BetRequest has been approved by both participants. Deal started by ${user.id}`,
    );
    return OkResponse(null);
  } catch (e) {
    return ExceptionHandler(e);
  }
}
