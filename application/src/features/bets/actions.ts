"use server";

import { validateToken } from "@app/server/auth/authentication";
import NextBetService from "@app/server/services/NextBetService";
import { CommonStake, IndividualStakes, Terms } from "@domain/bet";
import type { BetRequestCreate } from "./components/wizzard/types";

export async function createBetRequest(
  request: BetRequestCreate,
  token: string | undefined,
) {
  const requestingUser = await validateToken(token);

  const terms = new Terms(request.title);
  const stakes =
    request.type === "common"
      ? new CommonStake(request.stake)
      : new IndividualStakes(request.userStake, request.friendStake);
  const betRequest = await NextBetService.create(
    requestingUser.id,
    request.friendId,
    terms,
    stakes,
  );

  //TODO: Correct database model to keep also stakes...
  //TODO: Update domain model of bet to include shor title

  console.log(JSON.stringify(betRequest));
}
