import {
  type BetRequest,
  CommonStake,
  IndividualStakes,
  type IStake,
  StakeType,
} from "@domain/bet";
import type { UserType } from "@domain/user/entities";

export type ParticipantVoteType = "unknown" | "approved" | "rejected";
export type BetRequestStatusType =
  | "pending"
  | "approved"
  | "rejected"
  | "blocked"
  | "deleted";

export type BetSummary = Pick<
  BetRequestResponse,
  | "id"
  | "creator"
  | "participant"
  | "title"
  | "terms"
  | "status"
  | "createdAt"
  | "updatedAt"
>;

export type IStakeReponse = CommonStakeResponse | IndividualStakeResponse;

export type CommonStakeResponse = {
  type: "common";
  description: string;
};

export type IndividualStakeResponse = {
  type: "individual";
  creatorStake: string;
  participantStake: string;
};

export type ParticipantVoteInfoReponse = {
  participantId: string;
  vote: ParticipantVoteType;
  votedAt?: Date;
};

export interface BetRequestResponse {
  id: string;
  creator: UserType;
  participant: UserType;
  title: string;
  terms: string;
  stakes: IStakeReponse;
  status: BetRequestStatusType;
  createdAt: Date;
  updatedAt: Date;
  participantVotes: ParticipantVoteInfoReponse[];
  blockedByParticipants: string[];
}

export function mapToResponse(
  betRequest: BetRequest,
  users: Map<string, UserType>,
): BetRequestResponse {
  return {
    id: betRequest.id,
    creator: {
      // biome-ignore lint/style/noNonNullAssertion: <explanation>
      ...users.get(betRequest.creatorId)!,
    },
    participant: {
      // biome-ignore lint/style/noNonNullAssertion: <explanation>
      ...users.get(betRequest.participantId)!,
    },
    title: betRequest.title,
    terms: betRequest.terms.value,
    stakes: stakeToReponse(betRequest.stakes),
    status: betRequest.status,
    createdAt: betRequest.createdAt,
    updatedAt: betRequest.updatedAt,
    participantVotes: betRequest.participantVotes.values().toArray(),
    blockedByParticipants: betRequest.blockedByParticipants.values().toArray(),
  };
}

function stakeToReponse(stake: IStake | undefined): IStakeReponse {
  if (!stake) throw new Error("Stake is missing!");
  if (stake instanceof CommonStake) {
    return {
      type: "common",
      description: stake.description,
    };
  } else if (stake instanceof IndividualStakes) {
    return {
      type: "individual",
      creatorStake: stake.creatorStake,
      participantStake: stake.participantStake,
    };
  } else {
    throw new Error("Unrecognized stake type");
  }
}
