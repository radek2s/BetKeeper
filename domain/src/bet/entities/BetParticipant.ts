import { Entity, type UUID } from "@domain/shared";

export type VoteType = "unknown" | "approved" | "rejected";

export interface BetParticipant {
  readonly userId: UUID;
  vote: VoteType;
  claim: string;
}

export type CommonBetParticipantType = BetParticipant;
export type IndividualBetParticipantType = BetParticipant & { stake: string };

export class CommonBetParticipant extends Entity implements BetParticipant {
  readonly userId: UUID;
  vote: VoteType;
  claim: string;

  constructor(userId: string, claim: string, vote: VoteType = "unknown") {
    super();
    this.userId = userId;
    this.vote = vote;
    this.claim = claim;
  }

  override get id(): string {
    return this.userId;
  }

  override equals(other: Entity): boolean {
    throw new Error("Method not implemented.");
  }
  override toString(): string {
    throw new Error("Method not implemented.");
  }
  override toObject(): CommonBetParticipantType {
    throw new Error("Method not implemented.");
  }
}

export class IndividualBetParticipant extends Entity implements BetParticipant {
  readonly userId: UUID;
  vote: VoteType;
  claim: string;
  stake: string;

  constructor(
    userId: string,
    claim: string,
    stake: string,
    vote: VoteType = "unknown",
  ) {
    super();
    this.userId = userId;
    this.claim = claim;
    this.stake = stake;
    this.vote = vote;
  }

  override get id(): string {
    return this.userId;
  }
  override equals(other: Entity): boolean {
    throw new Error("Method not implemented.");
  }
  override toString(): string {
    throw new Error("Method not implemented.");
  }
  override toObject(): IndividualBetParticipantType {
    throw new Error("Method not implemented.");
  }
}
