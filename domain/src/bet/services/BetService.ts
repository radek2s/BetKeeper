import { DomainService } from "../../shared/DomainService";
import { IEventDispatcher } from "../../shared/EventDispatcher";
import { UUID } from "../../shared";
import { BetAggregate } from "../entities/BetAggregate";
import { BetRequest } from "../entities/BetRequest";
import { Bet } from "../entities/Bet";
import { Terms } from "../value-objects/Terms";
import { IStake } from "../value-objects/Stakes";
import { BetRequestStatus } from "../types/BetRequestStatus";
import { BetStatus } from "../types/BetStatus";
import {
  IBetRequestRepository,
  IBetRepository,
  IBetAggregateRepository,
  IBetQueryService,
  BetQueryFilters,
} from "./BetRepositories";

/**
 * Bet Domain Service
 * Handles complex business operations involving multiple aggregates,
 * bet request approval flow, and bet lifecycle management
 */
export class BetService extends DomainService {
  constructor(
    private readonly betRequestRepository: IBetRequestRepository,
    private readonly betRepository: IBetRepository,
    private readonly betAggregateRepository: IBetAggregateRepository,
    private readonly betQueryService: IBetQueryService,
    eventDispatcher?: IEventDispatcher,
  ) {
    super(eventDispatcher);
  }

  // Bet Request Operations
  async createBetRequest(
    creatorId: UUID,
    participantId: UUID,
    terms: Terms,
    stakes?: IStake,
    dueDate?: Date,
  ): Promise<BetAggregate> {
    // Business rule: Creator and participant must be different
    if (creatorId === participantId) {
      throw new Error("Creator and participant cannot be the same person");
    }

    // Business rule: Due date must be in the future
    if (dueDate && dueDate <= new Date()) {
      throw new Error("Due date must be in the future");
    }

    const betAggregate = BetAggregate.createWithBetRequest(
      creatorId,
      participantId,
      terms,
      stakes,
      dueDate,
    );

    await this.betAggregateRepository.save(betAggregate);
    await this.dispatchDomainEvents(betAggregate);

    return betAggregate;
  }

  async updateBetRequestTerms(
    betRequestId: UUID,
    newTerms: Terms,
    updatedById: UUID,
  ): Promise<BetAggregate> {
    const betAggregate = await this.getBetAggregateById(betRequestId);

    if (!betAggregate.isParticipant(updatedById)) {
      throw new Error("Only participants can update bet request terms");
    }

    betAggregate.updateBetRequestTerms(newTerms, updatedById);

    await this.betAggregateRepository.save(betAggregate);
    await this.dispatchDomainEvents(betAggregate);

    return betAggregate;
  }

  async updateBetRequestStakes(
    betRequestId: UUID,
    newStakes: IStake,
    updatedById: UUID,
  ): Promise<BetAggregate> {
    const betAggregate = await this.getBetAggregateById(betRequestId);

    if (!betAggregate.isParticipant(updatedById)) {
      throw new Error("Only participants can update bet request stakes");
    }

    betAggregate.updateBetRequestStakes(newStakes, updatedById);

    await this.betAggregateRepository.save(betAggregate);
    await this.dispatchDomainEvents(betAggregate);

    return betAggregate;
  }

  async updateBetRequestDueDate(
    betRequestId: UUID,
    newDueDate: Date | undefined,
    updatedById: UUID,
  ): Promise<BetAggregate> {
    const betAggregate = await this.getBetAggregateById(betRequestId);

    if (!betAggregate.isParticipant(updatedById)) {
      throw new Error("Only participants can update bet request due date");
    }

    if (newDueDate && newDueDate <= new Date()) {
      throw new Error("Due date must be in the future");
    }

    betAggregate.updateBetRequestDueDate(newDueDate, updatedById);

    await this.betAggregateRepository.save(betAggregate);
    await this.dispatchDomainEvents(betAggregate);

    return betAggregate;
  }

  async approveBetRequest(
    betRequestId: UUID,
    participantId: UUID,
  ): Promise<BetAggregate> {
    const betAggregate = await this.getBetAggregateById(betRequestId);

    if (!betAggregate.isParticipant(participantId)) {
      throw new Error("Only participants can approve bet request");
    }

    betAggregate.approveBetRequest(participantId);

    await this.betAggregateRepository.save(betAggregate);
    await this.dispatchDomainEvents(betAggregate);

    return betAggregate;
  }

  async rejectBetRequest(
    betRequestId: UUID,
    participantId: UUID,
  ): Promise<BetAggregate> {
    const betAggregate = await this.getBetAggregateById(betRequestId);

    if (!betAggregate.isParticipant(participantId)) {
      throw new Error("Only participants can reject bet request");
    }

    betAggregate.rejectBetRequest(participantId);

    await this.betAggregateRepository.save(betAggregate);
    await this.dispatchDomainEvents(betAggregate);

    return betAggregate;
  }

  async blockBetRequest(
    betRequestId: UUID,
    participantId: UUID,
  ): Promise<BetAggregate> {
    const betAggregate = await this.getBetAggregateById(betRequestId);

    if (!betAggregate.isParticipant(participantId)) {
      throw new Error("Only participants can block bet request");
    }

    betAggregate.blockBetRequest(participantId);

    await this.betAggregateRepository.save(betAggregate);
    await this.dispatchDomainEvents(betAggregate);

    return betAggregate;
  }

  async unblockBetRequest(
    betRequestId: UUID,
    participantId: UUID,
  ): Promise<BetAggregate> {
    const betAggregate = await this.getBetAggregateById(betRequestId);

    if (!betAggregate.isParticipant(participantId)) {
      throw new Error("Only participants can unblock bet request");
    }

    betAggregate.unblockBetRequest(participantId);

    await this.betAggregateRepository.save(betAggregate);
    await this.dispatchDomainEvents(betAggregate);

    return betAggregate;
  }

  async deleteBetRequest(
    betRequestId: UUID,
    deletedById: UUID,
    isAdmin: boolean = false,
  ): Promise<void> {
    const betAggregate = await this.getBetAggregateById(betRequestId);

    // Business rule: Only creator or admin can delete
    if (!isAdmin && !betAggregate.isCreator(deletedById)) {
      throw new Error("Only the creator or admin can delete this bet request");
    }

    betAggregate.deleteBetRequest(deletedById);

    await this.betAggregateRepository.save(betAggregate);
    await this.dispatchDomainEvents(betAggregate);
  }

  // Bet Operations
  async resolveBet(
    betRequestId: UUID,
    resolvedById: UUID,
    winnerId: UUID,
    evidence?: string,
  ): Promise<BetAggregate> {
    const betAggregate = await this.getBetAggregateById(betRequestId);

    if (!betAggregate.hasActiveBet()) {
      throw new Error("No active bet found for this bet request");
    }

    if (!betAggregate.isParticipant(resolvedById)) {
      throw new Error("Only participants can resolve the bet");
    }

    if (!betAggregate.isParticipant(winnerId)) {
      throw new Error("Winner must be one of the bet participants");
    }

    betAggregate.resolveBet(resolvedById, winnerId, evidence);

    await this.betAggregateRepository.save(betAggregate);
    await this.dispatchDomainEvents(betAggregate);

    return betAggregate;
  }

  async completeBet(
    betRequestId: UUID,
    completedById: UUID,
    completionNotes?: string,
  ): Promise<BetAggregate> {
    const betAggregate = await this.getBetAggregateById(betRequestId);

    if (!betAggregate.hasActiveBet()) {
      throw new Error("No active bet found for this bet request");
    }

    if (!betAggregate.isParticipant(completedById)) {
      throw new Error("Only participants can mark the bet as completed");
    }

    betAggregate.completeBet(completedById, completionNotes);

    await this.betAggregateRepository.save(betAggregate);
    await this.dispatchDomainEvents(betAggregate);

    return betAggregate;
  }

  async deleteBet(
    betRequestId: UUID,
    deletedById: UUID,
    reason?: string,
    isAdmin: boolean = false,
  ): Promise<BetAggregate> {
    const betAggregate = await this.getBetAggregateById(betRequestId);

    if (!betAggregate.hasActiveBet()) {
      throw new Error("No active bet found for this bet request");
    }

    // Business rule: Only creator or admin can delete
    if (!isAdmin && !betAggregate.isCreator(deletedById)) {
      throw new Error("Only the creator or admin can delete this bet");
    }

    betAggregate.deleteBet(deletedById, reason);

    await this.betAggregateRepository.save(betAggregate);
    await this.dispatchDomainEvents(betAggregate);

    return betAggregate;
  }

  // Query Operations
  async getBetAggregateById(betRequestId: UUID): Promise<BetAggregate> {
    const betAggregate =
      await this.betAggregateRepository.findById(betRequestId);
    if (!betAggregate) {
      throw new Error(`Bet aggregate not found with ID: ${betRequestId}`);
    }
    return betAggregate;
  }

  async getBetRequestById(betRequestId: UUID): Promise<BetRequest> {
    const betRequest = await this.betRequestRepository.findById(betRequestId);
    if (!betRequest) {
      throw new Error(`Bet request not found with ID: ${betRequestId}`);
    }
    return betRequest;
  }

  async getBetById(betId: UUID): Promise<Bet> {
    const bet = await this.betRepository.findById(betId);
    if (!bet) {
      throw new Error(`Bet not found with ID: ${betId}`);
    }
    return bet;
  }

  async getUserBetRequests(
    userId: UUID,
    status?: BetRequestStatus,
  ): Promise<BetRequest[]> {
    if (status) {
      return await this.betRequestRepository.findByUserIdAndStatus(
        userId,
        status,
      );
    }
    return await this.betRequestRepository.findByUserId(userId);
  }

  async getUserBets(userId: UUID, status?: BetStatus): Promise<Bet[]> {
    if (status) {
      return await this.betRepository.findByUserIdAndStatus(userId, status);
    }
    return await this.betRepository.findByUserId(userId);
  }

  async getUserPendingBetRequests(userId: UUID): Promise<BetRequest[]> {
    return await this.betRequestRepository.findPendingByUserId(userId);
  }

  async getUserActiveBets(userId: UUID): Promise<Bet[]> {
    return await this.betRepository.findActiveByUserId(userId);
  }

  async getUserCompletedBets(userId: UUID): Promise<Bet[]> {
    return await this.betRepository.findCompletedByUserId(userId);
  }

  // Advanced Query Operations
  async queryBetRequests(filters: BetQueryFilters): Promise<BetRequest[]> {
    return await this.betQueryService.queryBetRequests(filters);
  }

  async queryBets(filters: BetQueryFilters): Promise<Bet[]> {
    return await this.betQueryService.queryBets(filters);
  }

  async queryBetAggregates(filters: BetQueryFilters): Promise<BetAggregate[]> {
    return await this.betQueryService.queryBetAggregates(filters);
  }

  async getBetStatistics(userId: UUID) {
    return await this.betQueryService.getBetStatistics(userId);
  }

  // Notification and Maintenance Operations
  async findBetsDueSoon(daysThreshold: number = 3): Promise<Bet[]> {
    return await this.betRepository.findDueSoon(daysThreshold);
  }

  async findBetsPendingTooLong(daysThreshold: number = 7): Promise<Bet[]> {
    return await this.betRepository.findPendingTooLong(daysThreshold);
  }

  async findBetRequestsPendingTooLong(
    daysThreshold: number = 7,
  ): Promise<BetRequest[]> {
    return await this.betRequestRepository.findPendingTooLong(daysThreshold);
  }

  async findOverdueBets(): Promise<Bet[]> {
    return await this.betRepository.findOverdue();
  }

  // Business Rule Validation
  async canUserCreateBetRequest(userId: UUID): Promise<boolean> {
    // Business rule: User can create bet requests (could add more complex rules here)
    // For example, check if user has too many pending requests, is suspended, etc.
    const pendingRequests = await this.getUserPendingBetRequests(userId);
    const maxPendingRequests = 10; // Business rule: max 10 pending requests per user

    return pendingRequests.length < maxPendingRequests;
  }

  async canUsersCreateBetTogether(
    creatorId: UUID,
    participantId: UUID,
  ): Promise<boolean> {
    // Business rule: Check if users can create bets together
    // Could check for blocked relationships, previous disputes, etc.

    if (creatorId === participantId) {
      return false;
    }

    // Additional business rules could be added here
    // For example: check if users are friends, not blocked, etc.

    return true;
  }

  // Bulk Operations
  async deleteBetRequestsBatch(
    betRequestIds: UUID[],
    deletedById: UUID,
    isAdmin: boolean = false,
  ): Promise<void> {
    for (const betRequestId of betRequestIds) {
      try {
        await this.deleteBetRequest(betRequestId, deletedById, isAdmin);
      } catch (error) {
        // Log error but continue with other deletions
        console.error(`Failed to delete bet request ${betRequestId}:`, error);
      }
    }
  }

  async deleteBetsBatch(
    betRequestIds: UUID[],
    deletedById: UUID,
    reason?: string,
    isAdmin: boolean = false,
  ): Promise<void> {
    for (const betRequestId of betRequestIds) {
      try {
        await this.deleteBet(betRequestId, deletedById, reason, isAdmin);
      } catch (error) {
        // Log error but continue with other deletions
        console.error(
          `Failed to delete bet for request ${betRequestId}:`,
          error,
        );
      }
    }
  }
}
