"use server";

import { validateToken } from "@app/server/auth/authentication";
import NextUserRepository from "@app/server/repositories/NextUserRepository";
import NextBetService from "@app/server/services/NextBetService";

import type { UserType } from "@domain/user/entities";
import { revalidatePath } from "next/cache";
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
    request.terms,
    request.creatorId,
    request.participants,
    request.stake,
  );
  await NextBetService.approve(betRequest.id, requestingUser.id);
  revalidatePath(`/`);
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

export async function getBet(betId: string) {
  const bet = await NextBetService.getById(betId);
  const repository = new NextUserRepository();

  const usersIds = new Set(bet.participants.map((p) => p.userId))
    .values()
    .toArray();

  const users = await Promise.all(
    usersIds.map((userId) => userIdToUserType(userId, repository)),
  );
  const userMap = new Map<string, UserType>();
  users.forEach((user) => {
    userMap.set(user.id, user);
  });

  return mapToResponse(bet, userMap);
}

export async function updatedBetRequestTerms(
  betRequestId: string,
  newTerms: string,
  token: string | undefined,
) {
  const requestingUser = await validateToken(token);

  await NextBetService.updateTerms(betRequestId, newTerms, requestingUser.id);
  revalidatePath(`/details/${betRequestId}`);
}

export async function updatedBetRequestClaim(
  betRequestId: string,
  newClaims: string,
  token: string | undefined,
) {
  const requestingUser = await validateToken(token);

  await NextBetService.updateClaims(betRequestId, newClaims, requestingUser.id);
  revalidatePath(`/details/${betRequestId}`);
}

export async function updatedBetRequestStake(
  betRequestId: string,
  newStakes: string,
  token: string | undefined,
) {
  const requestingUser = await validateToken(token);

  await NextBetService.updateStakes(betRequestId, newStakes, requestingUser.id);
  revalidatePath(`/details/${betRequestId}`);
}

export async function approveBet(
  betRequestId: string,
  token: string | undefined,
) {
  const requestingUser = await validateToken(token);

  await NextBetService.approve(betRequestId, requestingUser.id);
  revalidatePath(`/details/${betRequestId}`);
}

export async function rejectBet(
  betRequestId: string,
  token: string | undefined,
) {
  const requestingUser = await validateToken(token);

  await NextBetService.reject(betRequestId, requestingUser.id);
  revalidatePath(`/details/${betRequestId}`);
}

export async function startBet(
  betRequestId: string,
  token: string | undefined,
) {
  await validateToken(token);

  await NextBetService.convertToBet(betRequestId);
  revalidatePath(`/details/${betRequestId}`);
}

export async function resolveBet(
  betId: string,
  winnerId: string,
  token: string | undefined,
) {
  const user = await validateToken(token);

  await NextBetService.resolve(betId, user.id, winnerId);
  revalidatePath(`/details/${betId}`);
}

export async function completeBet(betId: string, token: string | undefined) {
  const user = await validateToken(token);

  await NextBetService.complete(betId, user.id);
  revalidatePath(`/details/${betId}`);
}

export async function deleteBetRequest(
  betRequestId: string,
  token: string | undefined,
) {
  const user = await validateToken(token);

  await NextBetService.deleteBetRequest(
    betRequestId,
    user.id,
    user.role === "ADMINISTRATOR",
  );
}

export async function deleteBet(betId: string, token: string | undefined) {
  const user = await validateToken(token);

  await NextBetService.deleteBet(betId, user.id, user.role === "ADMINISTRATOR");
}
