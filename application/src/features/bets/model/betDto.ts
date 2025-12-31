import {
  AbstractBet,
  AbstractBetRequest,
  type BetParticipant,
  type BetStatus,
  CommonBet,
  CommonBetRequest,
  IndividualBet,
  type IndividualBetParticipantType,
  IndividualBetRequest,
  type VoteType,
} from "@domain/bet";
import type { UserType } from "@domain/user/entities";

type BaseBetParticipantResponse = {
  userId: string;
  email: string;
  firstName: string;
  lastName: string;
  avatarUrl: string;
  vote: VoteType;
  claim: string;
};

export type CommonBetParticipantResponse = BaseBetParticipantResponse;

export type IndividualBetParticipantResponse = BaseBetParticipantResponse & {
  stake: string;
};

export type BetParticipantResponse =
  | CommonBetParticipantResponse
  | IndividualBetParticipantResponse;

type BaseBetRequestResponse = {
  id: string;
  creatorId: string;
  title: string;
  terms: string;
  createdAt: Date;
  updatedAt: Date;
};

export type CommonBetRequestResponse = BaseBetRequestResponse & {
  stakeType: "COMMON";
  stake: string;
  participants: CommonBetParticipantResponse[];
};

export type IndividualBetRequestResponse = BaseBetRequestResponse & {
  stakeType: "INDIVIDUAL";
  participants: IndividualBetParticipantResponse[];
};

export function isCommonBetRequestResponse(
  betResponse: BetRequestResponse,
): betResponse is CommonBetRequestResponse {
  return betResponse.stakeType === "COMMON";
}

export function isIndividualBetParticipantResponse(
  participant: BetParticipantResponse,
): participant is IndividualBetParticipantResponse {
  return Object.hasOwn(participant, "stake");
}

export type BetRequestResponse =
  | CommonBetRequestResponse
  | IndividualBetRequestResponse;

type BaseBetResponse = BaseBetRequestResponse & {
  status: BetStatus;
  resolvedBy?: string;
  resolvedAt?: Date;
  winnerId?: string;
  completedAt?: Date;
  completedBy?: string;
  dueDate?: Date;
};

export type CommonBetResponse = BaseBetResponse & {
  stakeType: "COMMON";
  stake: string;
  participants: CommonBetParticipantResponse[];
};

export type IndividualBetResponse = BaseBetResponse & {
  stakeType: "INDIVIDUAL";
  participants: IndividualBetParticipantResponse[];
};

export type BetResponse = CommonBetResponse | IndividualBetResponse;

export function isCommonBetResponse(
  bet: BetResponse,
): bet is CommonBetResponse {
  return Object.hasOwn(bet, "stake");
}

export function isBetResponse(
  bet: BetResponse | BetRequestResponse,
): bet is BetResponse {
  return Object.hasOwn(bet, "status");
}

export type BetSummary = Pick<
  BetRequestResponse,
  | "id"
  | "creatorId"
  | "participants"
  | "title"
  | "terms"
  | "createdAt"
  | "updatedAt"
>;

export function mapToResponse(
  betRequest: AbstractBetRequest | AbstractBet,
  users: Map<string, UserType>,
): BetRequestResponse | BetResponse {
  if (betRequest instanceof AbstractBetRequest) {
    if (betRequest instanceof CommonBetRequest) {
      return mapToCommonBetRequestResponse(betRequest, users);
    } else if (betRequest instanceof IndividualBetRequest) {
      return mapToIndividualBetRequestResponse(betRequest, users);
    }
  } else if (betRequest instanceof AbstractBet) {
    if (betRequest instanceof CommonBet) {
      return mapToCommonBetResponse(betRequest, users);
    } else if (betRequest instanceof IndividualBet) {
      return mapToIndividualBetResponse(betRequest, users);
    }
  }
  throw new Error("Invalid response type");
}

function mapToCommonBetRequestResponse(
  betRequest: CommonBetRequest,
  users: Map<string, UserType>,
): CommonBetRequestResponse {
  return {
    id: betRequest.id,
    creatorId: betRequest.creatorId,
    title: betRequest.title,
    terms: betRequest.terms,
    createdAt: betRequest.createdAt,
    updatedAt: betRequest.updatedAt,
    stakeType: "COMMON",
    stake: betRequest.stake,
    participants: betRequest.participants.map((p) =>
      mapCommonParticipant(p, users.get(p.userId)),
    ),
  };
}

function mapToIndividualBetRequestResponse(
  betRequest: IndividualBetRequest,
  users: Map<string, UserType>,
): IndividualBetRequestResponse {
  return {
    id: betRequest.id,
    creatorId: betRequest.creatorId,
    title: betRequest.title,
    terms: betRequest.terms,
    createdAt: betRequest.createdAt,
    updatedAt: betRequest.updatedAt,
    stakeType: "INDIVIDUAL",
    participants: betRequest.participants.map((p) =>
      mapIndividualParticipant(p, users.get(p.userId)),
    ),
  };
}

function mapToCommonBetResponse(
  bet: CommonBet,
  users: Map<string, UserType>,
): CommonBetResponse {
  return {
    id: bet.id,
    creatorId: bet.creatorId,
    status: bet.status,
    title: bet.title,
    terms: bet.terms,
    createdAt: bet.createdAt,
    updatedAt: bet.updatedAt,
    stakeType: "COMMON",
    stake: bet.stake,
    participants: bet.participants.map((p) =>
      mapCommonParticipant(p, users.get(p.userId)),
    ),
    completedAt: bet.completedAt,
    completedBy: bet.completedBy,
    resolvedAt: bet.resolvedAt,
    resolvedBy: bet.resolvedBy,
    dueDate: bet.dueDate,
    winnerId: bet.winnerId,
  };
}

function mapToIndividualBetResponse(
  bet: IndividualBet,
  users: Map<string, UserType>,
): IndividualBetResponse {
  return {
    id: bet.id,
    creatorId: bet.creatorId,
    status: bet.status,
    title: bet.title,
    terms: bet.terms,
    createdAt: bet.createdAt,
    updatedAt: bet.updatedAt,
    stakeType: "INDIVIDUAL",
    participants: bet.participants.map((p) =>
      mapIndividualParticipant(p, users.get(p.userId)),
    ),
    completedAt: bet.completedAt,
    completedBy: bet.completedBy,
    resolvedAt: bet.resolvedAt,
    resolvedBy: bet.resolvedBy,
    dueDate: bet.dueDate,
    winnerId: bet.winnerId,
  };
}

function mapCommonParticipant(
  betParticipant: BetParticipant,
  user?: UserType,
): CommonBetParticipantResponse {
  if (!user)
    throw new Error(`Unable to find user data for id=${betParticipant.userId}`);
  return {
    userId: betParticipant.userId,
    email: user.email,
    firstName: user.firstName,
    lastName: user.lastName,
    avatarUrl: user.avatarUrl || "",
    vote: betParticipant.vote,
    claim: betParticipant.claim,
  };
}

function mapIndividualParticipant(
  betParticipant: IndividualBetParticipantType,
  user?: UserType,
): IndividualBetParticipantResponse {
  if (!user)
    throw new Error(`Unable to find user data for id=${betParticipant.userId}`);
  return {
    userId: betParticipant.userId,
    email: user.email,
    firstName: user.firstName,
    lastName: user.lastName,
    avatarUrl: user.avatarUrl || "",
    vote: betParticipant.vote,
    claim: betParticipant.claim,
    stake: betParticipant.stake,
  };
}
