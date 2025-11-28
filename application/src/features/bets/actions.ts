"use server";

import { validateToken } from "@app/server/auth/authentication";
import NextUserRepository from "@app/server/repositories/NextUserRepository";
import NextBetService from "@app/server/services/NextBetService";
import { CommonStake, IndividualStakes, Terms } from "@domain/bet";
import type { UserType } from "@domain/user/entities";
import { userIdToUserType } from "../users/model/userDto";
import type { BetRequestCreate } from "./components/wizzard/types";
import { type BetRequestResponse, mapToResponse } from "./model/betDto";

export async function createBetRequest(
  request: BetRequestCreate,
  token: string | undefined,
) {
  const requestingUser = await validateToken(token);

  const terms = new Terms(request.description);
  const stakes =
    request.type === "common"
      ? new CommonStake(request.stake)
      : new IndividualStakes(request.userStake, request.friendStake);
  const betRequest = await NextBetService.create(
    requestingUser.id,
    request.friendId,
    request.title,
    terms,
    stakes,
  );
  await NextBetService.approve(betRequest.id, requestingUser.id);
}

export async function getBetRequests(
  participantId: string,
): Promise<BetRequestResponse[]> {
  const requests = await NextBetService.getUserBetRequests(participantId);
  const repository = new NextUserRepository();

  const usersIds = new Set(
    requests.flatMap((request) => [request.participantId, request.creatorId]),
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

  return requests.map((request) => mapToResponse(request, userMap));
}
