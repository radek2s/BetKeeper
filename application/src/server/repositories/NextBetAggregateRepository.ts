import {
  BetAggregate,
  type BetRequestStatus,
  type BetStatus,
  type IBetAggregateRepository,
  type IBetRepository,
  type IBetRequestRepository,
} from "@domain/bet";
import type { UUID } from "@domain/shared";
import { NextBetRepository } from "./NextBetRepository";
import { NextBetRequestRepository } from "./NextBetRequestRepository";

export class NextBetAggregateRepository implements IBetAggregateRepository {
  betRequestRepository: IBetRequestRepository;
  betRepository: IBetRepository;

  constructor() {
    this.betRepository = new NextBetRepository();
    this.betRequestRepository = new NextBetRequestRepository();
  }
  async findById(betRequestId: UUID): Promise<BetAggregate | null> {
    const betRequest = await this.betRequestRepository.findById(betRequestId);
    if (!betRequest) return null;

    const bet = (await this.betRepository.findById(betRequestId)) || undefined;

    return new BetAggregate(betRequest, bet);
  }
  findByUserId(userId: UUID): Promise<BetAggregate[]> {
    throw new Error("Method not implemented.");
  }
  findByBetRequestStatus(status: BetRequestStatus): Promise<BetAggregate[]> {
    throw new Error("Method not implemented.");
  }
  findByBetStatus(status: BetStatus): Promise<BetAggregate[]> {
    throw new Error("Method not implemented.");
  }
  findPendingBetRequestsByUserId(userId: UUID): Promise<BetAggregate[]> {
    throw new Error("Method not implemented.");
  }
  findActiveBetsByUserId(userId: UUID): Promise<BetAggregate[]> {
    throw new Error("Method not implemented.");
  }
  findCompletedBetsByUserId(userId: UUID): Promise<BetAggregate[]> {
    throw new Error("Method not implemented.");
  }
  async save(betAggregate: BetAggregate): Promise<void> {
    const promises = [];
    promises.push(this.betRequestRepository.save(betAggregate.betRequest));
    if (betAggregate.bet) {
      promises.push(this.betRepository.save(betAggregate.bet));
    }
    await Promise.all(promises);
  }
  async delete(betRequestId: UUID): Promise<void> {
    this.betRequestRepository.delete(betRequestId);
    this.betRepository.delete(betRequestId);
  }
  async exists(betRequestId: UUID): Promise<boolean> {
    return await this.betRequestRepository.exists(betRequestId);
  }
}
