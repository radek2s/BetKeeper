import type {
  BetTableRecord,
  IBetRepository,
} from "@domain/bet/persistence/BetRepository";

import type { UUID } from "../../src/shared/Uuid";

export class InMemoryBetRepository implements IBetRepository {
  storage: Map<UUID, BetTableRecord> = new Map();

  async findAll(): Promise<BetTableRecord[]> {
    return this.storage.values().toArray();
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
    return this.storage.get(id) || null;
  }
  async save(betEntity: BetTableRecord): Promise<void> {
    this.storage.set(betEntity.id, betEntity);
  }
  async delete(id: UUID): Promise<void> {
    this.storage.delete(id);
  }
}
