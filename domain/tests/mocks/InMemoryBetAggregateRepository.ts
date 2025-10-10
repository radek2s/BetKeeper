import type { BetAggregate } from "../../src/bet/entities/BetAggregate";
import type {
  IBetAggregateRepository,
  IBetRepository,
  IBetRequestRepository,
} from "../../src/bet/services/BetRepositories";
import type { BetRequestStatus } from "../../src/bet/types/BetRequestStatus";
import type { BetStatus } from "../../src/bet/types/BetStatus";
import type { UUID } from "../../src/shared/Uuid";
import type { InMemoryBetRepository } from "./InMemoryBetRepository";
import type { InMemoryBetRequestRepository } from "./InMemoryBetRequestRepository";

export class InMemoryBetAggregateRepository implements IBetAggregateRepository {
  private betAggregates: BetAggregate[] = [];

  betRequestRepository: IBetRequestRepository;
  betRepository: IBetRepository;

  constructor(
    betRequestRepository: InMemoryBetRequestRepository,
    betRepository: InMemoryBetRepository,
  ) {
    this.betRequestRepository = betRequestRepository;
    this.betRepository = betRepository;
  }

  async findById(betRequestId: UUID): Promise<BetAggregate | null> {
    return (
      this.betAggregates.find((aggregate) => aggregate.id === betRequestId) ||
      null
    );
  }

  async findByUserId(userId: UUID): Promise<BetAggregate[]> {
    return this.betAggregates.filter(
      (aggregate) =>
        aggregate.creatorId === userId ||
        aggregate.betRequest.participantId === userId,
    );
  }

  async findByBetRequestStatus(
    status: BetRequestStatus,
  ): Promise<BetAggregate[]> {
    return this.betAggregates.filter(
      (aggregate) => aggregate.betRequest.status === status,
    );
  }

  async findByBetStatus(status: BetStatus): Promise<BetAggregate[]> {
    return this.betAggregates.filter(
      (aggregate) => aggregate.bet?.status === status,
    );
  }

  async findPendingBetRequestsByUserId(userId: UUID): Promise<BetAggregate[]> {
    return this.betAggregates.filter(
      (aggregate) =>
        (aggregate.creatorId === userId ||
          aggregate.betRequest.participantId === userId) &&
        aggregate.betRequest.isPending(),
    );
  }

  async findActiveBetsByUserId(userId: UUID): Promise<BetAggregate[]> {
    return this.betAggregates.filter(
      (aggregate) =>
        (aggregate.creatorId === userId ||
          aggregate.betRequest.participantId === userId) &&
        aggregate.bet?.isPending(),
    );
  }

  async findCompletedBetsByUserId(userId: UUID): Promise<BetAggregate[]> {
    return this.betAggregates.filter(
      (aggregate) =>
        (aggregate.creatorId === userId ||
          aggregate.betRequest.participantId === userId) &&
        aggregate.bet?.isCompleted(),
    );
  }

  async save(betAggregate: BetAggregate): Promise<void> {
    const existingIndex = this.betAggregates.findIndex(
      (aggregate) => aggregate.id === betAggregate.id,
    );

    if (existingIndex >= 0) {
      this.betAggregates[existingIndex] = betAggregate;
    } else {
      this.betAggregates.push(betAggregate);
    }
  }

  async delete(betRequestId: UUID): Promise<void> {
    this.betAggregates = this.betAggregates.filter(
      (aggregate) => aggregate.id !== betRequestId,
    );
  }

  async exists(betRequestId: UUID): Promise<boolean> {
    return this.betAggregates.some(
      (aggregate) => aggregate.id === betRequestId,
    );
  }

  // Helper method for testing
  clear(): void {
    this.betAggregates = [];
  }

  // Helper method for testing
  getAll(): BetAggregate[] {
    return [...this.betAggregates];
  }
}
