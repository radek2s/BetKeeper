// import { CommonStake, IndividualStakes, type IStake } from "@domain/bet";

export type BetRequestEntityType = {
  id: string;
  creatorId: string;
  participantId: string;
  title: string;
  terms: string;
  status: string;
  createdAt: Date;
  updatedAt: Date;
  stakeType: string;
  stakeBase: string;
  stakeAdditional: string | null;
};

export type VoteEntityType = {
  requestId: string;
  participantId: string;
  vote: string;
  votedAt?: Date | null;
};

export type StakeRaw = Pick<
  BetRequestEntityType,
  "stakeType" | "stakeBase" | "stakeAdditional"
>;
