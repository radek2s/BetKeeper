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
 * Get BetIdeas
 * @tag BetIdea
 * @description Fetch all user bet ideas
 * @response BetIdeaTypeApi
 * @openapi
 */
export async function GET(req: Request) {
  try {
    const user = await getAuth().getUser(req);
    const betIdeas = await NextBetIdeaService.getAll(user.id);

    if (betIdeas.length === 0) return OkResponse([]);

    const result: BetIdeaType[] = betIdeas.map((idea) => ({
      id: idea.id,
      content: idea.content,
      createdAt: idea.createdAt,
      updatedAt: idea.updatedAt,
    }));
    return OkResponse(result);
  } catch (e) {
    return ExceptionHandler(e);
  }
}

/**
 * Create bet idea
 * @tag BetIdea
 * @description Create bet idea
 * @body BetIdeaRequestTypeApi
 * @response BetIdeaTypeApi
 * @openapi
 */
export async function POST(req: Request) {
  try {
    const user = await getAuth().getUser(req);
    const body = BetIdeaRequestSchema.parse(await req.json());
    const betIdea = await NextBetIdeaService.create(user.id, body.content);
    const result: BetIdeaType = {
      id: betIdea.id,
      content: betIdea.content,
      createdAt: betIdea.createdAt,
      updatedAt: betIdea.updatedAt,
    };
    logger.info(`[BetIdea][${result.id}][Created] - by ${user.id}`);
    return OkResponse(result);
  } catch (e) {
    return ExceptionHandler(e);
  }
}
