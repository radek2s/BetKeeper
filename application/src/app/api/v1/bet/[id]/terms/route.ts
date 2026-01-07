import { OkResponse } from "@app/lib/utils/fetchUtils";
import { getAuth } from "@app/server/auth/authenticatorFactory";
import { ExceptionHandler } from "@app/server/exceptions/ExceptionHandler";
import type { ExceptionResponseBody } from "@app/server/exceptions/exception.interface";
import NextUserRepository from "@app/server/repositories/NextUserRepository";
import NextBetService from "@app/server/services/NextBetService";
import logger from "application/logger";

export async function PUT(
  req: Request,
  { params }: { params: { id: string } },
) {
  try {
    const user = await getAuth().getUser(req);

    const { id: betId } = await params;
    const { terms } = await req.json();

    if (!terms) {
      const response: ExceptionResponseBody = {
        error: "Invalid form data",
        message: "Terms must be provided!",
      };
      return Response.json(response, {
        status: 400,
      });
    }

    await NextBetService.updateTerms(betId, terms, user.id);

    logger.info(
      `[BetRequest][${betId}][Updated] - Updated terms by ${user.id}`,
    );
    return OkResponse(null);
  } catch (e) {
    return ExceptionHandler(e);
  }
}
