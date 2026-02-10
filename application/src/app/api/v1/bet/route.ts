import {
  type BetRequestResponse,
  type BetResponse,
  mapToResponse,
} from "@app/features/bets/model/betDto";
import { userIdToUserType } from "@app/features/users/model/userDto";
import { OkResponse } from "@app/lib/utils/fetchUtils";
import { getAuth } from "@app/server/auth/authenticatorFactory";
import { ExceptionHandler } from "@app/server/exceptions/ExceptionHandler";
import NextUserRepository from "@app/server/repositories/NextUserRepository";
import NextBetService from "@app/server/services/NextBetService";
import type { UserType } from "@domain/user/entities";
import logger from "application/logger";

type BetResponseSchema = BetRequestResponse | BetResponse;
type BetParticipantSchema = {
  userId: string;
  claim: string;
  stake?: string;
};
type BetCreateSchema = {
  title: string;
  terms: string;
  creatorId: string;
  participants: BetParticipantSchema[];
  stake?: string;
};

/**
 * Get All bets
 * @tag Bet
 * @description Fetch list of all user bets
 * @response BetResponseSchema[]
 * @openapi
 */
export async function GET(req: Request) {
  try {
    const user = await getAuth().getUser(req);
    const requests = await NextBetService.getAllByParticipantId(user?.id);
    const repository = new NextUserRepository();

    const usersIds = new Set(
      requests.flatMap((request) => request.participants.map((p) => p.userId)),
    )
      .values()
      .toArray();
    const users = await Promise.all(
      usersIds.map((userId) => userIdToUserType(userId, repository)),
    );
    const userMap = new Map<string, UserType>();
    users.forEach((user) => {
      userMap.set(user.id, user);
    });

    const reponse = requests.map((request) => mapToResponse(request, userMap));
    return Response.json(reponse);
  } catch (e) {
    return ExceptionHandler(e);
  }
}

/**
 * Create Bet
 * @tag Bet
 * @description Create Bet
 * @body BetCreateSchema
 * @response BetResponseSchema[]
 * @openapi
 */
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const user = await getAuth().getUser(req);
    const betRequest = await NextBetService.create(
      body.title,
      body.terms,
      body.creatorId,
      body.participants,
      body.stake,
    );
    await NextBetService.approve(betRequest.id, user.id);
    logger.info(
      `[BetRequest][${betRequest.id}][Created] - Created by ${user.id}`,
    );
    return OkResponse(betRequest.toObject(), 201);
  } catch (e) {
    return ExceptionHandler(e);
  }
}
