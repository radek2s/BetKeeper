import type {
  BetParticipantTableRecord,
  IBetParticipantRepository,
} from "@domain/bet/persistence/BetParticipantRepository";

import type { UUID } from "../../src/shared/Uuid";

export class InMemoryBetParticipantRepository
  implements IBetParticipantRepository
{
  storage: BetParticipantTableRecord[] = [];
  async findAllByUserId(userId: UUID): Promise<BetParticipantTableRecord[]> {
    return this.storage.filter((u) => u.userId === userId);
  }
  async findAllByBetId(betId: UUID): Promise<BetParticipantTableRecord[]> {
    return this.storage.filter((u) => u.betId === betId);
  }
  async findByUserIdAndBetId(
    userId: UUID,
    betId: UUID,
  ): Promise<BetParticipantTableRecord | null> {
    return this.storage.filter(
      (u) => u.betId === betId && u.userId === userId,
    )[0];
  }
  async save(entity: BetParticipantTableRecord): Promise<void> {
    await this.deleteByUserIdAndBetId(entity.userId, entity.betId);
    this.storage.push(entity);
  }
  async deleteByUserIdAndBetId(userId: UUID, betId: UUID): Promise<void> {
    this.storage = this.storage.filter(
      (u) => !(u.betId === betId && u.userId === userId),
    );
  }
}
