import type { UUID } from "@domain/shared";
import {
  type AbstractBet,
  type AbstractBetRequest,
  type BetParticipant,
  CommonBet,
  CommonBetRequest,
  IndividualBet,
  type IndividualBetParticipantType,
  IndividualBetRequest,
} from "../entities";
import type {
  BetParticipantTableRecord,
  IBetParticipantRepository,
} from "./BetParticipantRepository";
import type { BetTableRecord } from "./BetRepository";

export function participantToRecord(
  participant: BetParticipant | IndividualBetParticipantType,
  betId: UUID,
): BetParticipantTableRecord {
  if (Object.hasOwn(participant, "stake")) {
    return {
      betId,
      ...(participant as IndividualBetParticipantType),
    };
  } else {
    return {
      betId,
      stake: "",
      ...participant,
    };
  }
}

export function participantRecordToCommon(
  participant: BetParticipantTableRecord,
): BetParticipant {
  return {
    userId: participant.userId,
    vote: participant.vote,
    claim: participant.claim,
  };
}

export function participantRecordToIndividual(
  participant: BetParticipantTableRecord,
): IndividualBetParticipantType {
  if (!participant.stake)
    throw new Error(
      `Individual Participant (bet=${participant.betId}, userId=${participant.userId}) does not have stake!`,
    );
  return {
    userId: participant.userId,
    vote: participant.vote,
    claim: participant.claim,
    stake: participant.stake,
  };
}

export async function getBetRequestFromRecord(
  record: BetTableRecord,
  betParticipantRepository: IBetParticipantRepository,
): Promise<AbstractBetRequest> {
  if (record.status) throw new Error("This is bet not betRequest!");
  const participants = await betParticipantRepository.findAllByBetId(record.id);

  switch (record.stakeType) {
    case "COMMON":
      return CommonBetRequest.reconstitute({
        id: record.id,
        creatorId: record.creatorId,
        title: record.title,
        terms: record.terms,
        participants: participants.map(participantRecordToCommon),
        stakeType: "COMMON",
        // biome-ignore lint/style/noNonNullAssertion: Stake type Enforce this not null
        stake: record.stake!,
        createdAt: record.createdAt,
        updatedAt: record.updatedAt,
      });
    case "INDIVIDUAL":
      return IndividualBetRequest.reconstitute({
        id: record.id,
        creatorId: record.creatorId,
        title: record.title,
        terms: record.terms,
        participants: participants.map(participantRecordToIndividual),
        stakeType: "INDIVIDUAL",
        createdAt: record.createdAt,
        updatedAt: record.updatedAt,
      });
  }
}

export async function getBetFromRecord(
  record: BetTableRecord,
  betParticipantRepository: IBetParticipantRepository,
): Promise<AbstractBet> {
  if (!record.status) throw new Error("This is betRequest not bet!");
  const participants = await betParticipantRepository.findAllByBetId(record.id);

  switch (record.stakeType) {
    case "COMMON":
      return CommonBet.reconstitute({
        id: record.id,
        creatorId: record.creatorId,
        title: record.title,
        terms: record.terms,
        status: record.status,
        participants: participants.map(participantRecordToCommon),
        stakeType: "COMMON",
        // biome-ignore lint/style/noNonNullAssertion: Stake type Enforce this not null
        stake: record.stake!,
        createdAt: record.createdAt,
        updatedAt: record.updatedAt,
        resolvedAt: record.resolvedAt,
        resolvedBy: record.resolvedBy,
        winnerId: record.winnerId,
        dueDate: record.dueDate,
        completedAt: record.completedAt,
        completedBy: record.completedBy,
      });
    case "INDIVIDUAL":
      return IndividualBet.reconstitute({
        id: record.id,
        creatorId: record.creatorId,
        title: record.title,
        terms: record.terms,
        status: record.status,
        participants: participants.map(participantRecordToIndividual),
        stakeType: "INDIVIDUAL",
        createdAt: record.createdAt,
        updatedAt: record.updatedAt,
        resolvedAt: record.resolvedAt,
        resolvedBy: record.resolvedBy,
        winnerId: record.winnerId,
        dueDate: record.dueDate,
        completedAt: record.completedAt,
        completedBy: record.completedBy,
      });
  }
}
