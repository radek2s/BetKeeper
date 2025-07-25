import { BetRequest } from "../../src/bet/entities/BetRequest";
import { Bet } from "../../src/bet/entities/Bet";
import { BetAggregate } from "../../src/bet/entities/BetAggregate";
import {
  IBetQueryService,
  BetQueryFilters,
} from "../../src/bet/services/BetRepositories";
import { InMemoryBetRequestRepository } from "./InMemoryBetRequestRepository";
import { InMemoryBetRepository } from "./InMemoryBetRepository";
import { InMemoryBetAggregateRepository } from "./InMemoryBetAggregateRepository";
import type { UUID } from "@domain/shared/index";

export class InMemoryBetQueryService implements IBetQueryService {
  constructor(
    private betRequestRepository: InMemoryBetRequestRepository,
    private betRepository: InMemoryBetRepository,
    private betAggregateRepository: InMemoryBetAggregateRepository,
  ) {}

  async queryBetRequests(filters: BetQueryFilters): Promise<BetRequest[]> {
    let results = this.betRequestRepository.getAll();

    if (filters.userId) {
      results = results.filter(
        (br) =>
          br.creatorId === filters.userId ||
          br.participantId === filters.userId,
      );
    }

    if (filters.creatorId) {
      results = results.filter((br) => br.creatorId === filters.creatorId);
    }

    if (filters.participantId) {
      results = results.filter(
        (br) => br.participantId === filters.participantId,
      );
    }

    if (filters.status) {
      results = results.filter((br) => br.status === filters.status);
    }

    if (filters.fromDate) {
      results = results.filter((br) => br.createdAt >= filters.fromDate!);
    }

    if (filters.toDate) {
      results = results.filter((br) => br.createdAt <= filters.toDate!);
    }

    if (filters.dueDateFrom) {
      results = results.filter(
        (br) => br.dueDate && br.dueDate >= filters.dueDateFrom!,
      );
    }

    if (filters.dueDateTo) {
      results = results.filter(
        (br) => br.dueDate && br.dueDate <= filters.dueDateTo!,
      );
    }

    // Apply limit
    if (filters.limit && filters.limit > 0) {
      results = results.slice(0, filters.limit);
    }

    return results;
  }

  async queryBets(filters: BetQueryFilters): Promise<Bet[]> {
    let results = this.betRepository.getAll();

    if (filters.userId) {
      results = results.filter(
        (bet) =>
          bet.creatorId === filters.userId ||
          bet.participantId === filters.userId,
      );
    }

    if (filters.creatorId) {
      results = results.filter((bet) => bet.creatorId === filters.creatorId);
    }

    if (filters.participantId) {
      results = results.filter(
        (bet) => bet.participantId === filters.participantId,
      );
    }

    if (filters.status) {
      results = results.filter((bet) => bet.status === filters.status);
    }

    if (filters.fromDate) {
      results = results.filter((bet) => bet.createdAt >= filters.fromDate!);
    }

    if (filters.toDate) {
      results = results.filter((bet) => bet.createdAt <= filters.toDate!);
    }

    if (filters.dueDateFrom) {
      results = results.filter(
        (bet) => bet.dueDate && bet.dueDate >= filters.dueDateFrom!,
      );
    }

    if (filters.dueDateTo) {
      results = results.filter(
        (bet) => bet.dueDate && bet.dueDate <= filters.dueDateTo!,
      );
    }

    // Apply limit
    if (filters.limit && filters.limit > 0) {
      results = results.slice(0, filters.limit);
    }

    return results;
  }

  async queryBetAggregates(filters: BetQueryFilters): Promise<BetAggregate[]> {
    let results = this.betAggregateRepository.getAll();

    if (filters.userId) {
      results = results.filter(
        (agg) =>
          agg.creatorId === filters.userId ||
          agg.betRequest.participantId === filters.userId,
      );
    }

    if (filters.creatorId) {
      results = results.filter((agg) => agg.creatorId === filters.creatorId);
    }

    if (filters.participantId) {
      results = results.filter(
        (agg) => agg.betRequest.participantId === filters.participantId,
      );
    }

    if (filters.status) {
      results = results.filter(
        (agg) => agg.betRequest.status === filters.status,
      );
    }

    // if (filters.betStatus) {
    //   results = results.filter((agg) => agg.bet?.status === filters.betStatus);
    // }

    if (filters.fromDate) {
      results = results.filter(
        (agg) => agg.betRequest.createdAt >= filters.fromDate!,
      );
    }

    if (filters.toDate) {
      results = results.filter(
        (agg) => agg.betRequest.createdAt <= filters.toDate!,
      );
    }

    if (filters.dueDateFrom) {
      results = results.filter(
        (agg) =>
          agg.betRequest.dueDate &&
          agg.betRequest.dueDate >= filters.dueDateFrom!,
      );
    }

    if (filters.dueDateTo) {
      results = results.filter(
        (agg) =>
          agg.betRequest.dueDate &&
          agg.betRequest.dueDate <= filters.dueDateTo!,
      );
    }

    // Apply limit
    if (filters.limit && filters.limit > 0) {
      results = results.slice(0, filters.limit);
    }

    return results;
  }

  countBetRequests(filters: BetQueryFilters): Promise<number> {
    throw new Error("Method not implemented.");
  }
  countBets(filters: BetQueryFilters): Promise<number> {
    throw new Error("Method not implemented.");
  }
  getBetStatistics(userId: UUID): Promise<{
    totalBetRequests: number;
    pendingBetRequests: number;
    approvedBetRequests: number;
    rejectedBetRequests: number;
    totalBets: number;
    activeBets: number;
    completedBets: number;
    wonBets: number;
    lostBets: number;
  }> {
    throw new Error("Method not implemented.");
  }
}
