import type { UUID } from "@domain/shared";

export type VoteType = "unknown" | "approved" | "rejected";

export interface BetParticipant {
  readonly userId: UUID;
  vote: VoteType;
  claim: string;
}

export type CommonBetParticipantType = BetParticipant;
export type IndividualBetParticipantType = BetParticipant & { stake: string };
