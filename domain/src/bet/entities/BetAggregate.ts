import { AggregateRoot, UUID } from "@domain/shared";
import { BetRequest } from "./BetRequest";
import { Bet } from "./Bet";
import { Terms } from "../value-objects/Terms";
import { IStake } from "../value-objects/Stakes";
import { BetRequestStatus } from "../types/BetRequestStatus";
import { BetStatus } from "../types/BetStatus";

/**
 * Bet Aggregate Root
 * Manages the relationship between BetRequest and Bet entities
 * Handles the transition from bet request to active bet
 */
export class BetAggregate extends AggregateRoot {
  private _betRequest: BetRequest;
  private _bet?: Bet;

  constructor(betRequest: BetRequest, bet?: Bet) {
    super();
    this._betRequest = betRequest;
    this._bet = bet;

    // Add domain events from child entities
    this.addDomainEvents(this._betRequest.domainEvents);
    if (this._bet) {
      this.addDomainEvents(this._bet.domainEvents);
    }
  }

  override get id(): UUID {
    return this._betRequest.id;
  }

  get betRequest(): BetRequest {
    return this._betRequest;
  }

  get bet(): Bet | undefined {
    return this._bet;
  }

  get creatorId(): UUID {
    return this._betRequest.creatorId;
  }

  get participantId(): UUID {
    return this._betRequest.participantId;
  }

  get participants(): UUID[] {
    return this._betRequest.participants;
  }

  get terms(): Terms {
    return this._betRequest.terms;
  }

  get stakes(): IStake | undefined {
    return this._betRequest.stakes;
  }

  // Status checking methods
  hasActiveBet(): boolean {
    return this._bet !== undefined && !this._bet.isDeleted();
  }

  isBetRequestApproved(): boolean {
    return this._betRequest.isApproved();
  }

  isBetRequestPending(): boolean {
    return this._betRequest.isPending();
  }

  isBetRequestRejected(): boolean {
    return this._betRequest.isRejected();
  }

  canCreateBet(): boolean {
    return this.isBetRequestApproved() && !this.hasActiveBet();
  }

  isParticipant(userId: UUID): boolean {
    return this._betRequest.isParticipant(userId);
  }

  isCreator(userId: UUID): boolean {
    return this._betRequest.isCreator(userId);
  }

  // Domain methods for bet request
  updateBetRequestTerms(newTerms: Terms, updatedById: UUID): void {
    if (this.hasActiveBet()) {
      throw new Error("Cannot update terms: bet is already active");
    }

    this._betRequest.updateTerms(newTerms, updatedById);
    this.addDomainEvents(this._betRequest.domainEvents);
    this._betRequest.clearDomainEvents();
  }

  updateBetRequestStakes(newStakes: IStake, updatedById: UUID): void {
    if (this.hasActiveBet()) {
      throw new Error("Cannot update stakes: bet is already active");
    }

    this._betRequest.updateStakes(newStakes, updatedById);
    this.addDomainEvents(this._betRequest.domainEvents);
    this._betRequest.clearDomainEvents();
  }

  updateBetRequestDueDate(newDueDate: Date | undefined, updatedById: UUID): void {
    if (this.hasActiveBet()) {
      throw new Error("Cannot update due date: bet is already active");
    }

    this._betRequest.updateDueDate(newDueDate, updatedById);
    this.addDomainEvents(this._betRequest.domainEvents);
    this._betRequest.clearDomainEvents();
  }

  approveBetRequest(participantId: UUID): void {
    if (this.hasActiveBet()) {
      throw new Error("Cannot approve: bet is already active");
    }

    this._betRequest.approve(participantId);
    this.addDomainEvents(this._betRequest.domainEvents);
    this._betRequest.clearDomainEvents();

    // Automatically create bet if request is now approved
    if (this.canCreateBet()) {
      this.createBet();
    }
  }

  rejectBetRequest(participantId: UUID): void {
    if (this.hasActiveBet()) {
      throw new Error("Cannot reject: bet is already active");
    }

    this._betRequest.reject(participantId);
    this.addDomainEvents(this._betRequest.domainEvents);
    this._betRequest.clearDomainEvents();
  }

  blockBetRequest(participantId: UUID): void {
    this._betRequest.block(participantId);
    this.addDomainEvents(this._betRequest.domainEvents);
    this._betRequest.clearDomainEvents();
  }

  unblockBetRequest(participantId: UUID): void {
    this._betRequest.unblock(participantId);
    this.addDomainEvents(this._betRequest.domainEvents);
    this._betRequest.clearDomainEvents();
  }

  deleteBetRequest(deletedById: UUID): void {
    if (this.hasActiveBet()) {
      throw new Error("Cannot delete bet request: bet is already active");
    }

    this._betRequest.delete(deletedById);
    this.addDomainEvents(this._betRequest.domainEvents);
    this._betRequest.clearDomainEvents();
  }

  // Domain methods for bet
  private createBet(): void {
    if (!this.canCreateBet()) {
      throw new Error("Cannot create bet: conditions not met");
    }

    this._bet = Bet.createFromBetRequest(
      this._betRequest.id,
      this._betRequest.creatorId,
      this._betRequest.participantId,
      this._betRequest.terms,
      this._betRequest.stakes,
      this._betRequest.dueDate
    );

    this.addDomainEvents(this._bet.domainEvents);
    this._bet.clearDomainEvents();
  }

  resolveBet(resolvedById: UUID, winnerId: UUID, evidence?: string): void {
    if (!this.hasActiveBet()) {
      throw new Error("Cannot resolve: no active bet exists");
    }

    this._bet!.resolve(resolvedById, winnerId, evidence);
    this.addDomainEvents(this._bet!.domainEvents);
    this._bet!.clearDomainEvents();
  }

  completeBet(completedById: UUID, completionNotes?: string): void {
    if (!this.hasActiveBet()) {
      throw new Error("Cannot complete: no active bet exists");
    }

    this._bet!.complete(completedById, completionNotes);
    this.addDomainEvents(this._bet!.domainEvents);
    this._bet!.clearDomainEvents();
  }

  deleteBet(deletedById: UUID, reason?: string): void {
    if (!this.hasActiveBet()) {
      throw new Error("Cannot delete: no active bet exists");
    }

    this._bet!.delete(deletedById, reason);
    this.addDomainEvents(this._bet!.domainEvents);
    this._bet!.clearDomainEvents();
  }

  // Factory methods
  static createWithBetRequest(
    creatorId: UUID,
    participantId: UUID,
    terms: Terms,
    stakes?: IStake,
    dueDate?: Date
  ): BetAggregate {
    const betRequest = BetRequest.create(creatorId, participantId, terms, stakes, dueDate);
    return new BetAggregate(betRequest);
  }

  static reconstitute(betRequest: BetRequest, bet?: Bet): BetAggregate {
    return new BetAggregate(betRequest, bet);
  }

  // Aggregate implementation
  override equals(other: AggregateRoot): boolean {
    if (!(other instanceof BetAggregate)) {
      return false;
    }
    return this.id === other.id;
  }

  override toString(): string {
    const betInfo = this._bet ? `, Bet: ${this._bet.status}` : "";
    return `BetAggregate(${this.id}, BetRequest: ${this._betRequest.status}${betInfo})`;
  }
}
