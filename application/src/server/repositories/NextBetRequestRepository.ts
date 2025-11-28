import {
  BetRequest,
  type BetRequestStatus,
  CommonStake,
  getParticipantVote,
  type IBetRequestRepository,
  IndividualStakes,
  type IStake,
  ParticipantVote,
  type ParticipantVoteInfo,
  StakeType,
  Terms,
} from "@domain/bet";
import type { UUID } from "@domain/shared";
import prisma from "../db";
import {
  type BetRequestEntityType,
  getRawStakes,
  reconstituteStake,
  type VoteEntityType,
} from "./model";

export class NextBetRequestRepository implements IBetRequestRepository {
  private table = prisma.betRequestTable;
  private votesTable = prisma.betRequestVoteTable;

  private mapToDomain(
    entity: BetRequestEntityType,
    votes: VoteEntityType[],
  ): BetRequest {
    const voteMap = new Map<string, ParticipantVoteInfo>();
    votes
      .filter((vote) => vote.requestId !== entity.id)
      .forEach((vote) => {
        voteMap.set(vote.participantId, {
          participantId: vote.participantId,
          vote: getParticipantVote(vote.vote),
          votedAt: vote.votedAt || undefined,
        });
      });

    const stake = reconstituteStake(entity);

    return BetRequest.reconstitute(
      entity.id,
      entity.creatorId,
      entity.participantId,
      entity.title,
      new Terms(entity.terms),
      stake,
      entity.status as BetRequestStatus,
      entity.createdAt,
      entity.updatedAt,
      voteMap,
      new Set(),
    );
  }

  async findById(id: UUID): Promise<BetRequest | null> {
    const betRequestEntity = await this.table.findUnique({ where: { id } });
    if (!betRequestEntity) return null;

    const votes = await this.votesTable.findMany({
      where: { requestId: betRequestEntity.id },
    });
    return this.mapToDomain(betRequestEntity, votes);
  }
  findByParticipantId(participantId: UUID): Promise<BetRequest[]> {
    throw new Error("Method not implemented.");
  }
  findByCreatorId(creatorId: UUID): Promise<BetRequest[]> {
    throw new Error("Method not implemented.");
  }
  async findByUserId(userId: UUID): Promise<BetRequest[]> {
    const betRequestEntites = await this.table.findMany({
      where: { OR: [{ participantId: userId }, { creatorId: userId }] },
    });
    const votes = await this.votesTable.findMany({
      where: { participantId: userId },
    });

    return betRequestEntites.map((request) => this.mapToDomain(request, votes));
  }
  findByStatus(status: BetRequestStatus): Promise<BetRequest[]> {
    throw new Error("Method not implemented.");
  }
  findByUserIdAndStatus(
    userId: UUID,
    status: BetRequestStatus,
  ): Promise<BetRequest[]> {
    throw new Error("Method not implemented.");
  }
  findPendingByUserId(userId: UUID): Promise<BetRequest[]> {
    throw new Error("Method not implemented.");
  }
  findRejectedByUserId(userId: UUID): Promise<BetRequest[]> {
    throw new Error("Method not implemented.");
  }
  findPendingTooLong(daysThreshold: number): Promise<BetRequest[]> {
    throw new Error("Method not implemented.");
  }
  async save(betRequest: BetRequest): Promise<void> {
    const stakes = getRawStakes(betRequest.stakes);

    const saveParticipantVote = async (participantId: string) => {
      await this.votesTable.upsert({
        where: {
          voteId: {
            requestId: betRequest.id,
            participantId,
          },
        },
        update: {
          vote: betRequest.getParticipantVote(participantId),
          votedAt: betRequest.participantVotes.get(participantId)?.votedAt,
        },
        create: {
          requestId: betRequest.id,
          participantId: participantId,
          vote: betRequest.getParticipantVote(participantId),
          votedAt: betRequest.participantVotes.get(participantId)?.votedAt,
        },
      });
    };

    try {
      await saveParticipantVote(betRequest.creatorId);
      await saveParticipantVote(betRequest.participantId);
      await this.table.upsert({
        where: { id: betRequest.id },
        update: {
          title: betRequest.title,
          terms: betRequest.terms.value,
          status: betRequest.status,
          updatedAt: betRequest.updatedAt,
          ...stakes,
        },
        create: {
          id: betRequest.id,
          creatorId: betRequest.creatorId,
          participantId: betRequest.participantId,
          title: betRequest.title,
          terms: betRequest.terms.value,
          status: betRequest.status,
          createdAt: betRequest.createdAt,
          updatedAt: betRequest.updatedAt,
          ...stakes,
        },
      });
    } catch (e) {
      console.error(e);
      throw e;
    }
  }
  async delete(id: UUID): Promise<void> {
    try {
      await this.table.delete({ where: { id } });
    } catch (e) {
      console.error(e);
      throw e;
    }
  }
  async exists(id: UUID): Promise<boolean> {
    return !!(await this.table.findUnique({ where: { id } }));
  }
}
