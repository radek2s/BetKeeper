import {
  BetIdeaRequestSchema,
  type BetIdeaType,
} from "@app/features/bets/model/betIdeaSchema";
import { OkResponse } from "@app/lib/utils/fetchUtils";
import { getAuth } from "@app/server/auth/authenticatorFactory";
import { ExceptionHandler } from "@app/server/exceptions/ExceptionHandler";
import NextBetIdeaService from "@app/server/services/NextBetIdeaService";
import logger from "application/logger";

/**
 * Update Bet Idea
 * @tag BetIdea
 * @description Update bet idea
 * @body BetIdeaRequestTypeApi
 * @response BetIdeaTypeApi
 * @openapi
 */
export async function PATCH(
  req: Request,
  { params }: { params: { id: string } },
) {
  try {
    const user = await getAuth().getUser(req);
    const body = BetIdeaRequestSchema.parse(await req.json());
    const { id } = await params;

    const betIdea = await NextBetIdeaService.update(id, body.content);

    const result: BetIdeaType = {
      id: betIdea.id,
      content: betIdea.content,
      createdAt: betIdea.createdAt,
      updatedAt: betIdea.updatedAt,
    };
    logger.info(`[BetIdea][${result.id}][Updated] - by ${user.id}`);
    return OkResponse(result);
  } catch (e) {
    return ExceptionHandler(e);
  }
}

/**
 * Delete Bet Idea
 * @tag BetIdea
 * @description Delete bet idea
 * @openapi
 */
export async function DELETE(
  req: Request,
  { params }: { params: { id: string } },
) {
  try {
    const user = await getAuth().getUser(req);
    const { id } = await params;

    await NextBetIdeaService.delete(user.id, id);

    logger.info(`[BetIdea][${id}][Deleted] - by ${user.id}`);
    return OkResponse(null);
  } catch (e) {
    return ExceptionHandler(e);
  }
}
