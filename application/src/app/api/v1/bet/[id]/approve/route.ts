import { OkResponse } from "@app/lib/utils/fetchUtils";
import { getAuth } from "@app/server/auth/authenticatorFactory";
import { ExceptionHandler } from "@app/server/exceptions/ExceptionHandler";
import type { ExceptionResponseBody } from "@app/server/exceptions/exception.interface";

import NextBetService from "@app/server/services/NextBetService";
import logger from "application/logger";

export async function PUT(
  req: Request,
  { params }: { params: { id: string } },
) {
  try {
    const user = await getAuth().getUser(req);

    const { id: betId } = await params;

    await NextBetService.approve(betId, user.id);

    logger.info(`[BetRequest][${betId}][Approved] - Approved by ${user.id}`);
    return OkResponse(null);
  } catch (e) {
    return ExceptionHandler(e);
  }
}
