"use server";
import { Terms } from "@domain/bet";
import type { UUID } from "@domain/shared";
import NextBetService from "application/src/core/services/NextBetService";

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
