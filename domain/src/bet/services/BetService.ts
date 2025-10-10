import type { UUID } from "../../shared";
import { DomainService } from "../../shared/DomainService";
import type { IEventDispatcher } from "../../shared/EventDispatcher";
import type { Bet } from "../entities/Bet";
import { BetAggregate } from "../entities/BetAggregate";
import type { BetRequest } from "../entities/BetRequest";
import type { BetRequestStatus } from "../types/BetRequestStatus";
import type { BetStatus } from "../types/BetStatus";
import type { IStake } from "../value-objects/Stakes";
import type { Terms } from "../value-objects/Terms";
import type {
  BetQueryFilters,
  IBetAggregateRepository,
  IBetQueryService,
} from "./BetRepositories";

/**
 * Bet Domain Service
 * Handles complex business operations involving multiple aggregates,
 * bet request approval flow, and bet lifecycle management
 */
export class BetService extends DomainService {
  constructor(
    private readonly betAggregateRepository: IBetAggregateRepository,
    private readonly betQueryService: IBetQueryService,
    eventDispatcher?: IEventDispatcher,
  ) {
    super(eventDispatcher);
  }

  // Bet Request Operations
  async create(
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

  async updateTerms(
    betRequestId: UUID,
    newTerms: Terms,
    updatedById: UUID,
  ): Promise<BetAggregate> {
    const betAggregate = await this.getById(betRequestId);

    if (!betAggregate.isParticipant(updatedById)) {
      throw new Error("Only participants can update bet request terms");
    }

    betAggregate.updateBetRequestTerms(newTerms, updatedById);

    await this.betAggregateRepository.save(betAggregate);
    await this.dispatchDomainEvents(betAggregate);

    return betAggregate;
  }

  async updateStakes(
    betRequestId: UUID,
    newStakes: IStake,
    updatedById: UUID,
  ): Promise<BetAggregate> {
    const betAggregate = await this.getById(betRequestId);

    if (!betAggregate.isParticipant(updatedById)) {
      throw new Error("Only participants can update bet request stakes");
    }

    betAggregate.updateBetRequestStakes(newStakes, updatedById);

    await this.betAggregateRepository.save(betAggregate);
    await this.dispatchDomainEvents(betAggregate);

    return betAggregate;
  }

  async updateDueDate(
    betRequestId: UUID,
    newDueDate: Date | undefined,
    updatedById: UUID,
  ): Promise<BetAggregate> {
    const betAggregate = await this.getById(betRequestId);

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

  async approve(
    betRequestId: UUID,
    participantId: UUID,
  ): Promise<BetAggregate> {
    const betAggregate = await this.getById(betRequestId);

    if (!betAggregate.isParticipant(participantId)) {
      throw new Error("Only participants can approve bet request");
    }

    betAggregate.approveBetRequest(participantId);

    await this.betAggregateRepository.save(betAggregate);
    await this.dispatchDomainEvents(betAggregate);

    return betAggregate;
  }

  async reject(betRequestId: UUID, participantId: UUID): Promise<BetAggregate> {
    const betAggregate = await this.getById(betRequestId);

    if (!betAggregate.isParticipant(participantId)) {
      throw new Error("Only participants can reject bet request");
    }

    betAggregate.rejectBetRequest(participantId);

    await this.betAggregateRepository.save(betAggregate);
    await this.dispatchDomainEvents(betAggregate);

    return betAggregate;
  }

  async block(betRequestId: UUID, participantId: UUID): Promise<BetAggregate> {
    const betAggregate = await this.getById(betRequestId);

    if (!betAggregate.isParticipant(participantId)) {
      throw new Error("Only participants can block bet request");
    }

    betAggregate.blockBetRequest(participantId);

    await this.betAggregateRepository.save(betAggregate);
    await this.dispatchDomainEvents(betAggregate);

    return betAggregate;
  }

  async unblock(
    betRequestId: UUID,
    participantId: UUID,
  ): Promise<BetAggregate> {
    const betAggregate = await this.getById(betRequestId);

    if (!betAggregate.isParticipant(participantId)) {
      throw new Error("Only participants can unblock bet request");
    }

    betAggregate.unblockBetRequest(participantId);

    await this.betAggregateRepository.save(betAggregate);
    await this.dispatchDomainEvents(betAggregate);

    return betAggregate;
  }

  async delete(
    betRequestId: UUID,
    deletedById: UUID,
    isAdmin: boolean = false,
    reason?: string,
  ): Promise<BetAggregate> {
    const betAggregate = await this.getById(betRequestId);

    // Business rule: Only creator or admin can delete
    if (!isAdmin && !betAggregate.isCreator(deletedById)) {
      throw new Error("Only the creator or admin can delete this bet request");
    }

    betAggregate.deleteBetRequest(deletedById);
    if (betAggregate.bet) {
      betAggregate.deleteBet(deletedById, reason);
    }

    await this.betAggregateRepository.save(betAggregate);
    await this.dispatchDomainEvents(betAggregate);
    return betAggregate;
  }

  // Bet Operations
  async resolve(
    betRequestId: UUID,
    resolvedById: UUID,
    winnerId: UUID,
    evidence?: string,
  ): Promise<BetAggregate> {
    const betAggregate = await this.getById(betRequestId);

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

  async complete(
    betRequestId: UUID,
    completedById: UUID,
    completionNotes?: string,
  ): Promise<BetAggregate> {
    const betAggregate = await this.getById(betRequestId);

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

  // Query Operations
  async getById(id: UUID): Promise<BetAggregate> {
    const betAggregate = await this.betAggregateRepository.findById(id);
    if (!betAggregate) {
      throw new Error(`Bet aggregate not found with ID: ${id}`);
    }
    return betAggregate;
  }

  async getBetRequestById(betRequestId: UUID): Promise<BetRequest> {
    const aggregate = await this.betAggregateRepository.findById(betRequestId);
    if (!aggregate?.betRequest) {
      throw new Error(`Bet request not found with ID: ${betRequestId}`);
    }
    return aggregate.betRequest;
  }

  async getBetById(betId: UUID): Promise<Bet> {
    const aggregate = await this.betAggregateRepository.findById(betId);
    if (!aggregate?.bet) {
      throw new Error(`Bet not found with ID: ${betId}`);
    }
    return aggregate.bet;
  }

  async getUserBetRequests(
    userId: UUID,
    status?: BetRequestStatus,
  ): Promise<BetRequest[]> {
    if (status) {
      return await this.betAggregateRepository.betRequestRepository.findByUserIdAndStatus(
        userId,
        status,
      );
    }
    return await this.betAggregateRepository.betRequestRepository.findByUserId(
      userId,
    );
  }

  async getUserBets(userId: UUID, status?: BetStatus): Promise<Bet[]> {
    if (status) {
      return await this.betAggregateRepository.betRepository.findByUserIdAndStatus(
        userId,
        status,
      );
    }
    return await this.betAggregateRepository.betRepository.findByUserId(userId);
  }

  async getUserPendingBetRequests(userId: UUID): Promise<BetRequest[]> {
    return await this.betAggregateRepository.betRequestRepository.findPendingByUserId(
      userId,
    );
  }

  async getUserActiveBets(userId: UUID): Promise<Bet[]> {
    return await this.betAggregateRepository.betRepository.findActiveByUserId(
      userId,
    );
  }

  async getUserCompletedBets(userId: UUID): Promise<Bet[]> {
    return await this.betAggregateRepository.betRepository.findCompletedByUserId(
      userId,
    );
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
    return await this.betAggregateRepository.betRepository.findDueSoon(
      daysThreshold,
    );
  }

  async findBetsPendingTooLong(daysThreshold: number = 7): Promise<Bet[]> {
    return await this.betAggregateRepository.betRepository.findPendingTooLong(
      daysThreshold,
    );
  }

  async findBetRequestsPendingTooLong(
    daysThreshold: number = 7,
  ): Promise<BetRequest[]> {
    return await this.betAggregateRepository.betRequestRepository.findPendingTooLong(
      daysThreshold,
    );
  }

  async findOverdueBets(): Promise<Bet[]> {
    return await this.betAggregateRepository.betRepository.findOverdue();
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

  async deleteBatch(
    betRequestIds: UUID[],
    deletedById: UUID,
    reason?: string,
    isAdmin: boolean = false,
  ): Promise<void> {
    for (const betRequestId of betRequestIds) {
      try {
        await this.delete(betRequestId, deletedById, isAdmin, reason);
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
