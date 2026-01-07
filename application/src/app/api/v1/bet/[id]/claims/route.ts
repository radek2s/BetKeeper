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
    const { claims } = await req.json();

    if (!claims) {
      const response: ExceptionResponseBody = {
        error: "Invalid form data",
        message: "Stakes must be provided!",
      };
      return Response.json(response, {
        status: 400,
      });
    }

    await NextBetService.updateClaims(betId, claims, user.id);

    logger.info(
      `[BetRequest][${betId}][Updated] - Updated claims by ${user.id}`,
    );
    return OkResponse(null);
  } catch (e) {
    return ExceptionHandler(e);
  }
}
