import type { BetParticipantRequest, StakeType } from "@domain/bet";

export type TermsResult = {
  title: string;
  terms: string;
  stakeType: StakeType;
  stake?: string;
};

export type BetRequestCreate = {
  creatorId: string;
  participants: BetParticipantRequest[];
} & TermsResult;

export function isTermsResult(result: object): result is TermsResult {
  return Object.hasOwn(result, "title");
}

export function isBetParticipantRequest(
  result: object,
): result is BetParticipantRequest {
  return Object.hasOwn(result, "userId");
}
