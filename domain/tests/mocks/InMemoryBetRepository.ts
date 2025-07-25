import { Bet } from "../../src/bet/entities/Bet";
import { IBetRepository } from "../../src/bet/services/BetRepositories";
import { BetStatus } from "../../src/bet/types/BetStatus";
import { UUID } from "../../src/shared/Uuid";

export class InMemoryBetRepository implements IBetRepository {
  private bets: Bet[] = [];

  async findById(id: UUID): Promise<Bet | null> {
    return this.bets.find((bet) => bet.id === id) || null;
  }

  async findByBetRequestId(betRequestId: UUID): Promise<Bet | null> {
    return this.bets.find((bet) => bet.betRequestId === betRequestId) || null;
  }

  async findByCreatorId(creatorId: UUID): Promise<Bet[]> {
    return this.bets.filter((bet) => bet.creatorId === creatorId);
  }

  async findByParticipantId(participantId: UUID): Promise<Bet[]> {
    return this.bets.filter((bet) => bet.participantId === participantId);
  }

  async findByUserId(userId: UUID): Promise<Bet[]> {
    return this.bets.filter(
      (bet) => bet.creatorId === userId || bet.participantId === userId,
    );
  }

  async findByStatus(status: BetStatus): Promise<Bet[]> {
    return this.bets.filter((bet) => bet.status === status);
  }

  async findByUserIdAndStatus(userId: UUID, status: BetStatus): Promise<Bet[]> {
    return this.bets.filter(
      (bet) =>
        (bet.creatorId === userId || bet.participantId === userId) &&
        bet.status === status,
    );
  }

  async findActiveBetsByUserId(userId: UUID): Promise<Bet[]> {
    return this.bets.filter(
      (bet) =>
        (bet.creatorId === userId || bet.participantId === userId) &&
        bet.isPending(),
    );
  }

  async findCompletedBetsByUserId(userId: UUID): Promise<Bet[]> {
    return this.bets.filter(
      (bet) =>
        (bet.creatorId === userId || bet.participantId === userId) &&
        bet.isCompleted(),
    );
  }

  async findResolvedBetsByUserId(userId: UUID): Promise<Bet[]> {
    return this.bets.filter(
      (bet) =>
        (bet.creatorId === userId || bet.participantId === userId) &&
        bet.isResolved(),
    );
  }

  async findBetsDueBeforeDate(date: Date): Promise<Bet[]> {
    return this.bets.filter(
      (bet) => bet.dueDate && bet.dueDate < date && bet.isPending(),
    );
  }

  async findBetsCreatedBetweenDates(
    startDate: Date,
    endDate: Date,
  ): Promise<Bet[]> {
    return this.bets.filter(
      (bet) => bet.createdAt >= startDate && bet.createdAt <= endDate,
    );
  }

  async save(bet: Bet): Promise<void> {
    const existingIndex = this.bets.findIndex((b) => b.id === bet.id);

    if (existingIndex >= 0) {
      this.bets[existingIndex] = bet;
    } else {
      this.bets.push(bet);
    }
  }

  async delete(id: UUID): Promise<void> {
    this.bets = this.bets.filter((bet) => bet.id !== id);
  }

  async exists(id: UUID): Promise<boolean> {
    return this.bets.some((bet) => bet.id === id);
  }

  // Helper method for testing
  clear(): void {
    this.bets = [];
  }

  // Helper method for testing
  getAll(): Bet[] {
    return [...this.bets];
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
}
