import type { UUID } from "@domain/shared";
import type { VoteType } from "../entities";

export type BetParticipantTableRecord = {
  betId: UUID;
  userId: UUID;
  vote: VoteType;
  claim: string;
  stake: string | null;
};

export interface IBetParticipantRepository {
  findAllByUserId(userId: UUID): Promise<BetParticipantTableRecord[]>;
  findAllByBetId(betId: UUID): Promise<BetParticipantTableRecord[]>;
  findByUserIdAndBetId(
    userId: UUID,
    betId: UUID,
  ): Promise<BetParticipantTableRecord | null>;
  save(entity: BetParticipantTableRecord): Promise<void>;
  deleteByUserIdAndBetId(userId: UUID, betId: UUID): Promise<void>;
}
