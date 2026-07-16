import type { UUID } from "@domain/shared";

export type BetIdeaTableRecord = {
  id: UUID;
  userId: UUID;
  createdAt: Date;
  updatedAt: Date;
  content: string;
};

export interface IBetIdeaRepository {
  findAllByUserId(userId: UUID): Promise<BetIdeaTableRecord[]>;
  findById(id: UUID): Promise<BetIdeaTableRecord | null>;
  save(entity: BetIdeaTableRecord): Promise<void>;
  delete(id: UUID): Promise<void>;
}
