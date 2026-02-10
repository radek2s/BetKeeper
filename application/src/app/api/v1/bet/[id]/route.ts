import { getBet } from "@app/features/bets/actions";
import { isBetResponse } from "@app/features/bets/model/betDto";
import { getAuth } from "@app/server/auth/authenticatorFactory";
import { ExceptionHandler } from "@app/server/exceptions/ExceptionHandler";
import NextBetService from "@app/server/services/NextBetService";
import logger from "application/logger";
import { NextResponse } from "next/server";

/**
 * Get signle Bet
 * @tag Bet
 * @description Get single bet
 * @response BetRequestResponse | BetResponse
 * @openapi
 */
export async function GET(
  req: Request,
  { params }: { params: { id: string } },
) {
  try {
    const { id } = await params;
    await getAuth().getUser(req);
    //TODO: Add validation that only participants or administrators can open bets
    const bet = await getBet(id);
    return NextResponse.json(bet);
  } catch (e) {
    return ExceptionHandler(e);
  }
}

/**
 * Delete bet
 * @tag Bet
 * @description Delete bet
 * @openapi
 */
export async function DELETE(
  req: Request,
  { params }: { params: { id: string } },
) {
  try {
    const { id } = await params;
    const user = await getAuth().getUser(req);
    const bet = await getBet(id);
    if (isBetResponse(bet)) {
      await NextBetService.deleteBet(
        id,
        user.id,
        user.role === "ADMINISTRATOR",
      );
      logger.info(`[Bet][${id}][Deleted] - Deleted by ${user.id}`);
    } else {
      await NextBetService.deleteBetRequest(
        id,
        user.id,
        user.role === "ADMINISTRATOR",
      );
      logger.info(`[BetRequest][${id}][Deleted] - Deleted by ${user.id}`);
    }
    return Response.json(null);
  } catch (e) {
    return ExceptionHandler(e);
  }
}
