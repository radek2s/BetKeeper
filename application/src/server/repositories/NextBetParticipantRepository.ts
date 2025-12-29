import type {
  BetParticipantTableRecord,
  BetStatus,
  BetTableRecord,
  IBetParticipantRepository,
  IBetRepository,
  StakeType,
  VoteType,
} from "@domain/bet";
import type { UUID } from "@domain/shared";
import prisma from "../db";

export class NextBetParticipantRepository implements IBetParticipantRepository {
  private table = prisma.betParticipantTable;

  async findAllByUserId(userId: UUID): Promise<BetParticipantTableRecord[]> {
    const participant = await this.table.findMany({
      where: {
        userId,
      },
    });

    return participant.map((participant) => ({
      betId: participant.betId,
      userId: participant.userId,
      claim: participant.claim,
      stake: participant.stake,
      vote: participant.vote as VoteType,
    }));
  }

  async findAllByBetId(betId: UUID): Promise<BetParticipantTableRecord[]> {
    const participant = await this.table.findMany({
      where: {
        betId,
      },
    });

    return participant.map((participant) => ({
      betId: participant.betId,
      userId: participant.userId,
      claim: participant.claim,
      stake: participant.stake,
      vote: participant.vote as VoteType,
    }));
  }

  async findByUserIdAndBetId(
    userId: UUID,
    betId: UUID,
  ): Promise<BetParticipantTableRecord | null> {
    const participant = await this.table.findUnique({
      where: {
        participantId: {
          userId,
          betId,
        },
      },
    });
    if (!participant) return null;
    return {
      betId: participant.betId,
      userId: participant.userId,
      claim: participant.claim,
      stake: participant.stake,
      vote: participant.vote as VoteType,
    };
  }

  async save(entity: BetParticipantTableRecord): Promise<void> {
    try {
      await this.table.upsert({
        where: {
          participantId: {
            userId: entity.userId,
            betId: entity.betId,
          },
        },
        update: {
          claim: entity.claim,
          vote: entity.vote,
          stake: entity.stake,
        },
        create: {
          betId: entity.betId,
          userId: entity.userId,
          claim: entity.claim,
          vote: entity.vote,
          stake: entity.stake,
        },
      });
    } catch (e) {
      console.error(e);
      throw e;
    }
  }
  async deleteByUserIdAndBetId(userId: UUID, betId: UUID): Promise<void> {
    try {
      await this.table.delete({
        where: {
          participantId: {
            userId,
            betId,
          },
        },
      });
    } catch (e) {
      console.error(e);
      throw e;
    }
  }
}
