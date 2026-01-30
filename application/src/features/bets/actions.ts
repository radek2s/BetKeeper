"use server";

import NextUserRepository from "@app/server/repositories/NextUserRepository";
import NextBetService from "@app/server/services/NextBetService";

import type { UserType } from "@domain/user/entities";

import { userIdToUserType } from "../users/model/userDto";
import { mapToResponse } from "./model/betDto";

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
