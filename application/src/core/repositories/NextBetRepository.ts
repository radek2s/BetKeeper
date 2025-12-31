import { Bet, type BetStatus, type IBetRepository, Terms } from "@domain/bet";
import type { UUID } from "@domain/shared";
import prisma from "application/src/lib/prisma";

export class NextBetRepository implements IBetRepository {
  private table = prisma.betTable;

  async findById(id: UUID): Promise<Bet | null> {
    const betEntity = await this.table.findUnique({ where: { id } });
    if (!betEntity) return null;

    return Bet.reconstitute(
      betEntity.id,
      betEntity.id,
      betEntity.creatorId,
      betEntity.participantId,
      new Terms(betEntity.terms),
      undefined,
      betEntity.status as BetStatus,
      betEntity.createdAt,
      betEntity.updatedAt,
      betEntity.dueDate ?? undefined,
      betEntity.resolvedAt ?? undefined,
      betEntity.completedAt ?? undefined,
      betEntity.winnerId ?? undefined,
      betEntity.evidence ?? undefined,
      betEntity.completionNotes ?? undefined,
    );
  }
  findByBetRequestId(betRequestId: UUID): Promise<Bet | null> {
    return this.findById(betRequestId);
  }
  async findByParticipantId(participantId: UUID): Promise<Bet[]> {
    const betEntities = await this.table.findMany({ where: { participantId } });
    if (!betEntities) return [];

    return betEntities.map((betEntity) =>
      Bet.reconstitute(
        betEntity.id,
        betEntity.id,
        betEntity.creatorId,
        betEntity.participantId,
        new Terms(betEntity.terms),
        undefined,
        betEntity.status as BetStatus,
        betEntity.createdAt,
        betEntity.updatedAt,
        betEntity.dueDate ?? undefined,
        betEntity.resolvedAt ?? undefined,
        betEntity.completedAt ?? undefined,
        betEntity.winnerId ?? undefined,
        betEntity.evidence ?? undefined,
        betEntity.completionNotes ?? undefined,
      ),
    );
  }
  async findByCreatorId(creatorId: UUID): Promise<Bet[]> {
    const betEntities = await this.table.findMany({ where: { creatorId } });
    if (!betEntities) return [];

    return betEntities.map((betEntity) =>
      Bet.reconstitute(
        betEntity.id,
        betEntity.id,
        betEntity.creatorId,
        betEntity.participantId,
        new Terms(betEntity.terms),
        undefined,
        betEntity.status as BetStatus,
        betEntity.createdAt,
        betEntity.updatedAt,
        betEntity.dueDate ?? undefined,
        betEntity.resolvedAt ?? undefined,
        betEntity.completedAt ?? undefined,
        betEntity.winnerId ?? undefined,
        betEntity.evidence ?? undefined,
        betEntity.completionNotes ?? undefined,
      ),
    );
  }
  async findByUserId(userId: UUID): Promise<Bet[]> {
    const betEntities = await this.table.findMany({
      where: { OR: [{ creatorId: userId }, { participantId: userId }] },
    });
    if (!betEntities) return [];

    return betEntities.map((betEntity) =>
      Bet.reconstitute(
        betEntity.id,
        betEntity.id,
        betEntity.creatorId,
        betEntity.participantId,
        new Terms(betEntity.terms),
        undefined,
        betEntity.status as BetStatus,
        betEntity.createdAt,
        betEntity.updatedAt,
        betEntity.dueDate ?? undefined,
        betEntity.resolvedAt ?? undefined,
        betEntity.completedAt ?? undefined,
        betEntity.winnerId ?? undefined,
        betEntity.evidence ?? undefined,
        betEntity.completionNotes ?? undefined,
      ),
    );
  }
  async findByStatus(status: BetStatus): Promise<Bet[]> {
    const betEntities = await this.table.findMany({
      where: { status },
    });
    if (!betEntities) return [];

    return betEntities.map((betEntity) =>
      Bet.reconstitute(
        betEntity.id,
        betEntity.id,
        betEntity.creatorId,
        betEntity.participantId,
        new Terms(betEntity.terms),
        undefined,
        betEntity.status as BetStatus,
        betEntity.createdAt,
        betEntity.updatedAt,
        betEntity.dueDate ?? undefined,
        betEntity.resolvedAt ?? undefined,
        betEntity.completedAt ?? undefined,
        betEntity.winnerId ?? undefined,
        betEntity.evidence ?? undefined,
        betEntity.completionNotes ?? undefined,
      ),
    );
  }
  async findByUserIdAndStatus(userId: UUID, status: BetStatus): Promise<Bet[]> {
    const betEntities = await this.table.findMany({
      where: {
        AND: [
          { OR: [{ participantId: userId }, { creatorId: userId }] },
          { status },
        ],
      },
    });
    if (!betEntities) return [];

    return betEntities.map((betEntity) =>
      Bet.reconstitute(
        betEntity.id,
        betEntity.id,
        betEntity.creatorId,
        betEntity.participantId,
        new Terms(betEntity.terms),
        undefined,
        betEntity.status as BetStatus,
        betEntity.createdAt,
        betEntity.updatedAt,
        betEntity.dueDate ?? undefined,
        betEntity.resolvedAt ?? undefined,
        betEntity.completedAt ?? undefined,
        betEntity.winnerId ?? undefined,
        betEntity.evidence ?? undefined,
        betEntity.completionNotes ?? undefined,
      ),
    );
  }
  findActiveByUserId(userId: UUID): Promise<Bet[]> {
    throw new Error("Method not implemented.");
  }
  findCompletedByUserId(userId: UUID): Promise<Bet[]> {
    throw new Error("Method not implemented.");
  }
  findDueSoon(daysThreshold: number): Promise<Bet[]> {
    throw new Error("Method not implemented.");
  }
  findPendingTooLong(daysThreshold: number): Promise<Bet[]> {
    throw new Error("Method not implemented.");
  }
  findOverdue(): Promise<Bet[]> {
    throw new Error("Method not implemented.");
  }
  async save(bet: Bet): Promise<void> {
    try {
      this.table.upsert({
        where: { id: bet.id },
        update: {
          status: bet.status,
          updatedAt: bet.updatedAt,
          terms: bet.terms.value,
          dueDate: bet.dueDate,
          resolvedAt: bet.resolvedAt,
          completedAt: bet.completedAt,
          winnerId: bet.winnerId,
          evidence: bet.evidence,
          completionNotes: bet.completionNotes,
        },
        create: {
          id: bet.id,
          createdAt: bet.createdAt,
          creatorId: bet.creatorId,
          participantId: bet.participantId,
          status: bet.status,
          updatedAt: bet.updatedAt,
          terms: bet.terms.value,
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
