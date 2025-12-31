import type { UUID } from "@domain/shared";
import type { BetStatus, StakeType } from "../entities";

export type BetTableRecord = {
  id: UUID;
  creatorId: UUID;
  status?: BetStatus;
  title: string;
  terms: string;
  stakeType: StakeType;
  stake?: string;
  createdAt: Date;
  updatedAt: Date;
  resolvedBy?: UUID;
  resolvedAt?: Date;
  winnerId?: UUID;
  dueDate?: Date;
  completedBy?: UUID;
  completedAt?: Date;
};

export interface IBetRepository {
  findAll(): Promise<BetTableRecord[]>;
  findAllBetRequests(): Promise<BetTableRecord[]>;
  findAllBets(): Promise<BetTableRecord[]>;
  findAllByCreatorId(): Promise<BetTableRecord[]>;
  findById(id: UUID): Promise<BetTableRecord | null>;
  save(betEntity: BetTableRecord): Promise<void>;
  delete(id: UUID): Promise<void>;
}
