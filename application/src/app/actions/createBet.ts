"use server";
import NextBetService from "@app/server/services/NextBetService";
import { Terms } from "@domain/bet";
import type { UUID } from "@domain/shared";

export async function createBetRequest(
  creatorId: UUID,
  participantId: UUID,
  terms: string,
) {
  try {
    await NextBetService.create(creatorId, participantId, new Terms(terms));
  } catch (e) {
    console.error(e);
  }
}
