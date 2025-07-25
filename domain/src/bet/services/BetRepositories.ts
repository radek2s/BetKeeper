import { UUID } from "@domain/shared";
import { BetRequest } from "../entities/BetRequest";
import { Bet } from "../entities/Bet";
import { BetAggregate } from "../entities/BetAggregate";
import { BetRequestStatus } from "../types/BetRequestStatus";
import { BetStatus } from "../types/BetStatus";

/**
 * Bet Request Repository Interface
 * Defines the contract for bet request persistence operations
 */
export interface IBetRequestRepository {
  /**
   * Find a bet request by its ID
   */
  findById(id: UUID): Promise<BetRequest | null>;

  /**
   * Find all bet requests for a specific participant
   */
  findByParticipantId(participantId: UUID): Promise<BetRequest[]>;

  /**
   * Find all bet requests created by a specific user
   */
  findByCreatorId(creatorId: UUID): Promise<BetRequest[]>;

  /**
   * Find all bet requests where a user is either creator or participant
   */
  findByUserId(userId: UUID): Promise<BetRequest[]>;

  /**
   * Find bet requests by status
   */
  findByStatus(status: BetRequestStatus): Promise<BetRequest[]>;

  /**
   * Find bet requests by status for a specific user
   */
  findByUserIdAndStatus(
    userId: UUID,
    status: BetRequestStatus,
  ): Promise<BetRequest[]>;

  /**
   * Find pending bet requests for a specific user (not blocked)
   */
  findPendingByUserId(userId: UUID): Promise<BetRequest[]>;

  /**
   * Find rejected bet requests for a specific user
   */
  findRejectedByUserId(userId: UUID): Promise<BetRequest[]>;

  /**
   * Find bet requests that have been pending for too long
   */
  findPendingTooLong(daysThreshold: number): Promise<BetRequest[]>;

  /**
   * Save a bet request
   */
  save(betRequest: BetRequest): Promise<void>;

  /**
   * Delete a bet request
   */
  delete(id: UUID): Promise<void>;

  /**
   * Check if a bet request exists
   */
  exists(id: UUID): Promise<boolean>;
}

/**
 * Bet Repository Interface
 * Defines the contract for bet persistence operations
 */
export interface IBetRepository {
  /**
   * Find a bet by its ID
   */
  findById(id: UUID): Promise<Bet | null>;

  /**
   * Find a bet by its bet request ID
   */
  findByBetRequestId(betRequestId: UUID): Promise<Bet | null>;

  /**
   * Find all bets for a specific participant
   */
  findByParticipantId(participantId: UUID): Promise<Bet[]>;

  /**
   * Find all bets created by a specific user
   */
  findByCreatorId(creatorId: UUID): Promise<Bet[]>;

  /**
   * Find all bets where a user is either creator or participant
   */
  findByUserId(userId: UUID): Promise<Bet[]>;

  /**
   * Find bets by status
   */
  findByStatus(status: BetStatus): Promise<Bet[]>;

  /**
   * Find bets by status for a specific user
   */
  findByUserIdAndStatus(userId: UUID, status: BetStatus): Promise<Bet[]>;

  /**
   * Find active bets for a specific user (pending or resolved)
   */
  findActiveByUserId(userId: UUID): Promise<Bet[]>;

  /**
   * Find completed bets for a specific user
   */
  findCompletedByUserId(userId: UUID): Promise<Bet[]>;

  /**
   * Find bets that are due soon
   */
  findDueSoon(daysThreshold: number): Promise<Bet[]>;

  /**
   * Find bets that have been pending for too long
   */
  findPendingTooLong(daysThreshold: number): Promise<Bet[]>;

  /**
   * Find overdue bets
   */
  findOverdue(): Promise<Bet[]>;

  /**
   * Save a bet
   */
  save(bet: Bet): Promise<void>;

  /**
   * Delete a bet
   */
  delete(id: UUID): Promise<void>;

  /**
   * Check if a bet exists
   */
  exists(id: UUID): Promise<boolean>;
}

/**
 * Bet Aggregate Repository Interface
 * Defines the contract for bet aggregate persistence operations
 */
export interface IBetAggregateRepository {
  /**
   * Find a bet aggregate by bet request ID
   */
  findById(betRequestId: UUID): Promise<BetAggregate | null>;

  /**
   * Find all bet aggregates for a specific user
   */
  findByUserId(userId: UUID): Promise<BetAggregate[]>;

  /**
   * Find bet aggregates by bet request status
   */
  findByBetRequestStatus(status: BetRequestStatus): Promise<BetAggregate[]>;

  /**
   * Find bet aggregates by bet status
   */
  findByBetStatus(status: BetStatus): Promise<BetAggregate[]>;

  /**
   * Find bet aggregates where user has pending bet requests
   */
  findPendingBetRequestsByUserId(userId: UUID): Promise<BetAggregate[]>;

  /**
   * Find bet aggregates where user has active bets
   */
  findActiveBetsByUserId(userId: UUID): Promise<BetAggregate[]>;

  /**
   * Find bet aggregates where user has completed bets
   */
  findCompletedBetsByUserId(userId: UUID): Promise<BetAggregate[]>;

  /**
   * Save a bet aggregate (saves both bet request and bet if exists)
   */
  save(betAggregate: BetAggregate): Promise<void>;

  /**
   * Delete a bet aggregate
   */
  delete(betRequestId: UUID): Promise<void>;

  /**
   * Check if a bet aggregate exists
   */
  exists(betRequestId: UUID): Promise<boolean>;
}

/**
 * Bet Query Filters
 * Common filters for querying bets and bet requests
 */
export interface BetQueryFilters {
  userId?: UUID;
  creatorId?: UUID;
  participantId?: UUID;
  status?: BetRequestStatus | BetStatus;
  fromDate?: Date;
  toDate?: Date;
  dueDateFrom?: Date;
  dueDateTo?: Date;
  isOverdue?: boolean;
  isDueSoon?: boolean;
  isPendingTooLong?: boolean;
  limit?: number;
  offset?: number;
  sortBy?: "createdAt" | "updatedAt" | "dueDate";
  sortOrder?: "asc" | "desc";
}

/**
 * Bet Query Service Interface
 * Defines advanced querying capabilities for bets and bet requests
 */
export interface IBetQueryService {
  /**
   * Query bet requests with filters
   */
  queryBetRequests(filters: BetQueryFilters): Promise<BetRequest[]>;

  /**
   * Query bets with filters
   */
  queryBets(filters: BetQueryFilters): Promise<Bet[]>;

  /**
   * Query bet aggregates with filters
   */
  queryBetAggregates(filters: BetQueryFilters): Promise<BetAggregate[]>;

  /**
   * Count bet requests with filters
   */
  countBetRequests(filters: BetQueryFilters): Promise<number>;

  /**
   * Count bets with filters
   */
  countBets(filters: BetQueryFilters): Promise<number>;

  /**
   * Get bet statistics for a user
   */
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
  }>;
}
