/** biome-ignore-all lint/style/noNonNullAssertion: <explanation> */
import { AggregateRoot, type UUID } from "@domain/shared";
import type { IStake } from "../value-objects/Stakes";
import type { Terms } from "../value-objects/Terms";
import { Bet } from "./Bet";
import { BetRequest } from "./BetRequest";

/**
 * Bet Aggregate Root
 * Manages the relationship between BetRequest and Bet entities
 * Handles the transition from bet request to active bet
 */
export class BetAggregate extends AggregateRoot {
  readonly betRequest: BetRequest;
  private _bet?: Bet;

  constructor(betRequest: BetRequest, bet?: Bet) {
    super();
    this.betRequest = betRequest;
    this._bet = bet;

    // Add domain events from child entities
    this.addDomainEvents(this.betRequest.domainEvents);
    if (this._bet) {
      this.addDomainEvents(this._bet.domainEvents);
    }
  }

  get bet(): Bet | undefined {
    return this._bet;
  }

  override get id(): UUID {
    return this.betRequest.id;
  }

  get creatorId(): UUID {
    return this.betRequest.creatorId;
  }

  get participantId(): UUID {
    return this.betRequest.participantId;
  }

  get participants(): UUID[] {
    return this.betRequest.participants;
  }

  get terms(): Terms {
    return this.betRequest.terms;
  }

  get stakes(): IStake | undefined {
    return this.betRequest.stakes;
  }

  // Status checking methods
  hasActiveBet(): boolean {
    return this.bet !== undefined && !this.bet.isDeleted();
  }

  isBetRequestApproved(): boolean {
    return this.betRequest.isApproved();
  }

  isBetRequestPending(): boolean {
    return this.betRequest.isPending();
  }

  isBetRequestRejected(): boolean {
    return this.betRequest.isRejected();
  }

  canCreateBet(): boolean {
    return this.isBetRequestApproved() && !this.hasActiveBet();
  }

  isParticipant(userId: UUID): boolean {
    return this.betRequest.isParticipant(userId);
  }

  isCreator(userId: UUID): boolean {
    return this.betRequest.isCreator(userId);
  }

  // Domain methods for bet request
  updateBetRequestTerms(newTerms: Terms, updatedById: UUID): void {
    if (this.hasActiveBet()) {
      throw new Error("Cannot update terms: bet is already active");
    }

    this.betRequest.updateTerms(newTerms, updatedById);
    this.addDomainEvents(this.betRequest.domainEvents);
    this.betRequest.clearDomainEvents();
  }

  updateBetRequestStakes(newStakes: IStake, updatedById: UUID): void {
    if (this.hasActiveBet()) {
      throw new Error("Cannot update stakes: bet is already active");
    }

    this.betRequest.updateStakes(newStakes, updatedById);
    this.addDomainEvents(this.betRequest.domainEvents);
    this.betRequest.clearDomainEvents();
  }

  updateBetDueDate(newDueDate: Date | undefined, updatedById: UUID): void {
    if (!this.bet) throw new Error("Bet was not found!");
    if (this.hasActiveBet()) {
      throw new Error("Cannot update due date: bet is already active");
    }

    this.bet.updateDueDate(newDueDate, updatedById);
    this.addDomainEvents(this.bet.domainEvents);
    this.bet.clearDomainEvents();
  }

  approveBetRequest(participantId: UUID): void {
    if (this.hasActiveBet()) {
      throw new Error("Cannot approve: bet is already active");
    }

    this.betRequest.approve(participantId);
    this.addDomainEvents(this.betRequest.domainEvents);
    this.betRequest.clearDomainEvents();

    // Automatically create bet if request is now approved
    if (this.canCreateBet()) {
      this.createBet();
    }
  }

  rejectBetRequest(participantId: UUID): void {
    if (this.hasActiveBet()) {
      throw new Error("Cannot reject: bet is already active");
    }

    this.betRequest.reject(participantId);
    this.addDomainEvents(this.betRequest.domainEvents);
    this.betRequest.clearDomainEvents();
  }

  blockBetRequest(participantId: UUID): void {
    this.betRequest.block(participantId);
    this.addDomainEvents(this.betRequest.domainEvents);
    this.betRequest.clearDomainEvents();
  }

  unblockBetRequest(participantId: UUID): void {
    this.betRequest.unblock(participantId);
    this.addDomainEvents(this.betRequest.domainEvents);
    this.betRequest.clearDomainEvents();
  }

  deleteBetRequest(deletedById: UUID): void {
    if (this.hasActiveBet()) {
      throw new Error("Cannot delete bet request: bet is already active");
    }

    this.betRequest.delete(deletedById);
    this.addDomainEvents(this.betRequest.domainEvents);
    this.betRequest.clearDomainEvents();
  }

  // Domain methods for bet
  private createBet(): void {
    if (!this.canCreateBet()) {
      throw new Error("Cannot create bet: conditions not met");
    }

    this._bet = Bet.createFromBetRequest(
      this.betRequest.id,
      this.betRequest.creatorId,
      this.betRequest.participantId,
      this.betRequest.terms,
      this.betRequest.stakes,
    );

    this.addDomainEvents(this._bet.domainEvents);
    this._bet.clearDomainEvents();
  }

  resolveBet(
    resolvedById: UUID,
    winnerId: UUID,
    evidence?: string,
    dueDate?: Date,
  ): void {
    if (!this.hasActiveBet()) {
      throw new Error("Cannot resolve: no active bet exists");
    }

    this.bet!.resolve(resolvedById, winnerId, evidence, dueDate);
    this.addDomainEvents(this.bet!.domainEvents);
    this.bet!.clearDomainEvents();
  }

  completeBet(completedById: UUID, completionNotes?: string): void {
    if (!this.hasActiveBet()) {
      throw new Error("Cannot complete: no active bet exists");
    }

    this.bet!.complete(completedById, completionNotes);
    this.addDomainEvents(this.bet!.domainEvents);
    this.bet!.clearDomainEvents();
  }

  deleteBet(deletedById: UUID, reason?: string): void {
    if (!this.hasActiveBet()) {
      throw new Error("Cannot delete: no active bet exists");
    }

    this.bet!.delete(deletedById, reason);
    this.addDomainEvents(this.bet!.domainEvents);
    this.bet!.clearDomainEvents();
  }

  // Factory methods
  static createWithBetRequest(
    creatorId: UUID,
    participantId: UUID,
    terms: Terms,
    stakes?: IStake,
  ): BetAggregate {
    const betRequest = BetRequest.create(
      creatorId,
      participantId,
      terms,
      stakes,
    );
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
    const betInfo = this.betRequest ? `, Bet: ${this.bet?.status}` : "";
    return `BetAggregate(${this.id}, BetRequest: ${this.betRequest.status}${betInfo})`;
  }

  override toObject() {
    return {
      betRequest: this.betRequest.toObject(),
      bet: this.bet?.toObject(),
    };
  }
}
