import {
  BetRequest,
  type BetRequestStatus,
  type IBetRequestRepository,
  Terms,
} from "@domain/bet";
import type { UUID } from "@domain/shared";
import prisma from "application/src/lib/prisma";

export class NextBetRequestRepository implements IBetRequestRepository {
  private table = prisma.betRequestTable;

  async findById(id: UUID): Promise<BetRequest | null> {
    const betRequestEntity = await this.table.findUnique({ where: { id } });
    if (!betRequestEntity) return null;

    return BetRequest.reconstitute(
      betRequestEntity.id,
      betRequestEntity.creatorId,
      betRequestEntity.participantId,
      new Terms(betRequestEntity.terms),
      undefined,
      betRequestEntity.status as BetRequestStatus,
      betRequestEntity.createdAt,
      betRequestEntity.updatedAt,
      new Map(),
      new Set(),
    );
  }
  findByParticipantId(participantId: UUID): Promise<BetRequest[]> {
    throw new Error("Method not implemented.");
  }
  findByCreatorId(creatorId: UUID): Promise<BetRequest[]> {
    throw new Error("Method not implemented.");
  }
  findByUserId(userId: UUID): Promise<BetRequest[]> {
    throw new Error("Method not implemented.");
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
    try {
      await this.table.upsert({
        where: { id: betRequest.id },
        update: {
          terms: betRequest.terms.value,
          status: betRequest.status,
          updatedAt: betRequest.updatedAt,
        },
        create: {
          id: betRequest.id,
          creatorId: betRequest.creatorId,
          participantId: betRequest.participantId,
          terms: betRequest.terms.value,
          status: betRequest.status,
          createdAt: betRequest.createdAt,
          updatedAt: betRequest.updatedAt,
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
