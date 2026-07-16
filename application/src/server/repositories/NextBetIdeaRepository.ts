import type {
  BetIdeaTableRecord,
  IBetIdeaRepository,
} from "@domain/bet/persistence/BetIdeaRepository";
import type { UUID } from "@domain/shared";
import prisma from "../db";
import { handleDbError } from "../db/exceptions";

export class NextBetIdeaRepository implements IBetIdeaRepository {
  private table = prisma.betIdeaTable;

  async findAllByUserId(userId: string): Promise<BetIdeaTableRecord[]> {
    const ideas = await this.table.findMany({ where: { userId } });
    return ideas.map((item) => ({
      id: item.id,
      userId: item.userId,
      content: item.content,
      createdAt: item.createdAt,
      updatedAt: item.updatedAt,
    }));
  }

  async save(item: BetIdeaTableRecord): Promise<void> {
    try {
      await this.table.upsert({
        where: { id: item.id },
        update: {
          content: item.content,
          updatedAt: item.updatedAt,
        },
        create: {
          id: item.id,
          userId: item.userId,
          content: item.content,
          createdAt: item.createdAt,
          updatedAt: item.updatedAt,
        },
      });
    } catch (e) {
      throw handleDbError(e);
    }
  }

  async findById(id: UUID): Promise<BetIdeaTableRecord | null> {
    const betItem = await this.table.findUnique({
      where: { id },
    });
    if (!betItem) return null;

    return betItem;
  }

  async delete(id: UUID): Promise<void> {
    await this.table.delete({ where: { id } });
  }
}
