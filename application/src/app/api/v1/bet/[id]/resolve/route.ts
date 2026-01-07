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
    const { winnerId } = await req.json();

    if (!winnerId) {
      const response: ExceptionResponseBody = {
        error: "Invalid form data",
        message: "winnerId must be provided!",
      };
      return Response.json(response, {
        status: 400,
      });
    }

    await NextBetService.resolve(betId, user.id, winnerId);

    logger.info(
      `[BetRequest][${betId}][Resolved] - Winner is ${winnerId} and was resolved by ${user.id}`,
    );
    return OkResponse(null);
  } catch (e) {
    return ExceptionHandler(e);
  }
}
