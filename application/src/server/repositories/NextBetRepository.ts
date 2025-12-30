import type {
  BetStatus,
  BetTableRecord,
  IBetRepository,
  StakeType,
} from "@domain/bet";
import type { UUID } from "@domain/shared";
import prisma from "../db";

export class NextBetRepository implements IBetRepository {
  private table = prisma.betTable;

  async findAll(): Promise<BetTableRecord[]> {
    const bets = await this.table.findMany();
    return bets.map((bet) => ({
      id: bet.id,
      creatorId: bet.creatorId,
      status: bet.status as BetStatus,
      title: bet.title,
      terms: bet.terms,
      stakeType: bet.stakeType as StakeType,
      stake: bet.stake || undefined,
      createdAt: bet.createdAt,
      updatedAt: bet.updatedAt,
      resolvedBy: bet.resolvedBy || undefined,
      resolvedAt: bet.resolvedAt || undefined,
      winnerId: bet.winnerId || undefined,
      dueDate: bet.dueDate || undefined,
      completedBy: bet.completedBy || undefined,
      completedAt: bet.completedAt || undefined,
    }));
  }
  findAllBetRequests(): Promise<BetTableRecord[]> {
    throw new Error("Method not implemented.");
  }
  findAllBets(): Promise<BetTableRecord[]> {
    throw new Error("Method not implemented.");
  }
  findAllByCreatorId(): Promise<BetTableRecord[]> {
    throw new Error("Method not implemented.");
  }

  async findById(id: UUID): Promise<BetTableRecord | null> {
    const bet = await this.table.findUnique({ where: { id } });
    if (!bet) return null;

    return {
      id: bet.id,
      creatorId: bet.creatorId,
      status: bet.status as BetStatus,
      title: bet.title,
      terms: bet.terms,
      stakeType: bet.stakeType as StakeType,
      stake: bet.stake || undefined,
      createdAt: bet.createdAt,
      updatedAt: bet.updatedAt,
      resolvedBy: bet.resolvedBy || undefined,
      resolvedAt: bet.resolvedAt || undefined,
      winnerId: bet.winnerId || undefined,
      dueDate: bet.dueDate || undefined,
      completedBy: bet.completedBy || undefined,
      completedAt: bet.completedAt || undefined,
    };
  }

  async save(bet: BetTableRecord): Promise<void> {
    try {
      await this.table.upsert({
        where: { id: bet.id },
        update: {
          status: bet.status,
          title: bet.title,
          terms: bet.terms,
          stakeType: bet.stakeType,
          stake: bet.stake,
          createdAt: bet.createdAt,
          updatedAt: bet.updatedAt,
          resolvedBy: bet.resolvedBy,
          resolvedAt: bet.resolvedAt,
          winnerId: bet.winnerId,
          dueDate: bet.dueDate,
          completedBy: bet.completedBy,
          completedAt: bet.completedAt,
        },
        create: {
          id: bet.id,
          creatorId: bet.creatorId,
          status: bet.status,
          title: bet.title,
          terms: bet.terms,
          stakeType: bet.stakeType,
          stake: bet.stake,
          createdAt: bet.createdAt,
          updatedAt: bet.updatedAt,
          resolvedBy: bet.resolvedBy,
          resolvedAt: bet.resolvedAt,
          winnerId: bet.winnerId,
          dueDate: bet.dueDate,
          completedBy: bet.completedBy,
          completedAt: bet.completedAt,
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
}
