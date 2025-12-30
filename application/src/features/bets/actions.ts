"use server";

import { validateToken } from "@app/server/auth/authentication";
import NextUserRepository from "@app/server/repositories/NextUserRepository";
import NextBetService from "@app/server/services/NextBetService";

import type { UserType } from "@domain/user/entities";
import { userIdToUserType } from "../users/model/userDto";
import type { BetRequestCreate } from "./components/wizzard/types";
import {
  type BetRequestResponse,
  type BetResponse,
  mapToResponse,
} from "./model/betDto";

export async function createBetRequest(
  request: BetRequestCreate,
  token: string | undefined,
) {
  const requestingUser = await validateToken(token);

  const betRequest = await NextBetService.create(
    request.title,
    request.description,
    requestingUser.id,
    [
      {
        userId: requestingUser.id,
        claim: "",
      },
      {
        userId: request.friendId,
        claim: "",
      },
    ],
    "",
  );
  await NextBetService.approve(betRequest.id, requestingUser.id);
}

export async function getBets(
  participantId: string,
): Promise<(BetRequestResponse | BetResponse)[]> {
  const requests = await NextBetService.getAllByParticipantId(participantId);
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

  return requests.map((request) => mapToResponse(request, userMap));
}
