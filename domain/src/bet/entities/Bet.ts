import { Entity, type UUID } from "@domain/shared";
import { BetActionEvent, BetCreatedEvent } from "../events/BetEvents";

import type {
  BetParticipant,
  IndividualBetParticipantType,
} from "./BetParticipant";
import {
  type AbstractBetRequest,
  CommonBetRequest,
  IndividualBetRequest,
  type StakeType,
} from "./BetRequest";

export type BetStatus = "pending" | "resolved" | "completed" | "deleted";

export type BetType = {
  id: UUID;
  creatorId: UUID;
  status: BetStatus;
  title: string;
  terms: string;
  participants: BetParticipant[];
  stakeType: StakeType;
  createdAt: Date;
  updatedAt: Date;
  resolvedBy?: UUID;
  resolvedAt?: Date;
  winnerId?: UUID;
  completedAt?: Date;
  completedBy?: UUID;
  dueDate?: Date;
};

export type CommonBetType = BetType & {
  stakeType: "COMMON";
  stake: string;
};

export type IndividualBetType = BetType & {
  stakeType: "INDIVIDUAL";
  participants: IndividualBetParticipantType[];
};

export abstract class AbstractBet extends Entity {
  readonly id: UUID;
  readonly creatorId: UUID;
  readonly title: string;
  readonly terms: string;
  readonly participants: BetParticipant[];
  readonly stakeType: StakeType;
  readonly createdAt: Date;
  protected _updatedAt: Date;
  protected _resolvedBy: string | undefined;
  protected _resolvedAt: Date | undefined;
  protected _winnerId: string | undefined;
  protected _completedAt: Date | undefined;
  protected _completedBy: UUID | undefined;
  protected _status: BetStatus;
  protected _dueDate: Date | undefined;

  constructor(betRequest: AbstractBetRequest) {
    super();
    if (!betRequest.isApproved())
      throw new Error(
        `Bet Request is not approved by all participants! Can't create bet`,
      );

    if (!betRequest.hasEnoughParticipants()) {
      throw new Error(
        `Bet Request does not have enough participants to create bet`,
      );
    }

    this.id = betRequest.id;
    this.creatorId = betRequest.creatorId;
    this.title = betRequest.title;
    this.terms = betRequest.terms;
    this.participants = betRequest.participants;
    this.stakeType = betRequest.stakeType;
    this.createdAt = betRequest.createdAt;
    this._status = "pending";
    this._updatedAt = new Date();

    this.addDomainEvent(new BetCreatedEvent(this.id, this.creatorId));
  }

  get status(): BetStatus {
    return this._status;
  }

  get updatedAt(): Date {
    return this._updatedAt;
  }

  get resolvedBy(): string | undefined {
    return this._resolvedBy;
  }

  get resolvedAt(): Date | undefined {
    return this._resolvedAt;
  }

  get winnerId(): string | undefined {
    return this._winnerId;
  }

  get completedAt(): Date | undefined {
    return this._completedAt;
  }

  get completedBy(): UUID | undefined {
    return this._completedBy;
  }

  get dueDate(): Date | undefined {
    return this._dueDate;
  }

  set dueDate(date: Date | undefined) {
    if (this.status !== "resolved")
      throw new Error(
        "Due date can be modified only when bet is pending completion.",
      );
    if (date) this.isDueDateValid(date);
    this._dueDate = date;
    this._updatedAt = new Date();
  }

  isOverdue(): boolean {
    if (!this.dueDate || this.status !== "resolved") {
      return false;
    }
    return new Date() > this.dueDate;
  }

  isDueSoon(daysThreshold: number = 3): boolean {
    if (!this.dueDate || this.status !== "resolved") {
      return false;
    }
    const now = new Date();
    const timeDiff = this.dueDate.getTime() - now.getTime();
    const daysDiff = Math.ceil(timeDiff / (1000 * 3600 * 24));
    return daysDiff <= daysThreshold && daysDiff > 0;
  }

  resolve(resolvedByParticipantId: UUID, winnerId: UUID, dueDate?: Date) {
    if (this.status !== "pending")
      throw new Error("Cannot resolve: bet is not in pending state");
    if (!this.isParticipant(resolvedByParticipantId)) {
      throw new Error("Only bet participant can resolve bet!");
    }
    if (!this.isParticipant(winnerId)) {
      throw new Error("Provided winnerId is not bet participant!");
    }
    if (dueDate) this.isDueDateValid(dueDate);

    const now = new Date();
    this._status = "resolved";
    this._resolvedAt = now;
    this._resolvedBy = resolvedByParticipantId;
    this._updatedAt = now;
    this._winnerId = winnerId;
    this.dueDate = dueDate;
    this.addDomainEvent(
      new BetActionEvent(this.id, "resolve", resolvedByParticipantId),
    );
  }

  complete(completedByParticipantId: UUID) {
    if (this.status !== "resolved")
      throw new Error("Cannot complete: bet is not in resolved state");
    if (!this.isParticipant(completedByParticipantId)) {
      throw new Error("Only bet participant can complete bet!");
    }
    const now = new Date();
    this._status = "completed";
    this._completedAt = now;
    this._completedBy = completedByParticipantId;
    this._updatedAt = now;
    this.addDomainEvent(
      new BetActionEvent(this.id, "complete", completedByParticipantId),
    );
  }

  delete(deletedById: UUID) {
    if (this.status === "deleted")
      throw new Error("Cannot delete: bet is already deleted!");
    this._status = "deleted";
    this._updatedAt = new Date();
    this.addDomainEvent(new BetActionEvent(this.id, "delete", deletedById));
  }

  protected isParticipant(participantId: UUID) {
    return !!this.participants.find(({ userId }) => userId === participantId);
  }

  private isDueDateValid(dueDate: Date) {
    const now = new Date();
    if (dueDate <= now) throw new Error("Due date must be in the future");
  }

  abstract override toObject(): BetType;
}

export class CommonBet extends AbstractBet {
  readonly stake: string;
  constructor(commonBetRequest: CommonBetRequest) {
    super(commonBetRequest);
    this.stake = commonBetRequest.stake;
  }

  static reconstitute(bet: CommonBetType): CommonBet {
    const commonBet = new CommonBet(
      CommonBetRequest.reconstitute({
        id: bet.id,
        creatorId: bet.creatorId,
        title: bet.title,
        terms: bet.terms,
        stake: bet.stake,
        participants: bet.participants,
        updatedAt: bet.updatedAt,
        stakeType: "COMMON",
        createdAt: bet.createdAt,
      }),
    );
    commonBet.clearDomainEvents();
    commonBet._updatedAt = bet.updatedAt;
    commonBet._status = bet.status;
    commonBet._resolvedAt = bet.resolvedAt;
    commonBet._resolvedBy = bet.resolvedBy;
    commonBet._winnerId = bet.winnerId;
    commonBet._dueDate = bet.dueDate;
    commonBet._completedBy = bet.completedBy;
    commonBet._completedAt = bet.completedAt;
    return commonBet;
  }

  override equals(other: Entity): boolean {
    if (!(other instanceof CommonBet)) return false;
    return this.id === other.id;
  }
  override toString(): string {
    return `CommonBet[${this.id}] (status=${this.status})`;
  }
  override toObject(): CommonBetType {
    return {
      id: this.id,
      creatorId: this.creatorId,
      status: this.status,
      title: this.title,
      terms: this.terms,
      participants: this.participants,
      stakeType: "COMMON",
      stake: this.stake,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
      resolvedAt: this.resolvedAt,
      resolvedBy: this.resolvedBy,
      winnerId: this.winnerId,
      dueDate: this.dueDate,
      completedAt: this.completedAt,
      completedBy: this.completedBy,
    };
  }
}

export class IndividualBet extends AbstractBet {
  override participants: IndividualBetParticipantType[];
  constructor(individualBetRequest: IndividualBetRequest) {
    super(individualBetRequest);
    this.participants = individualBetRequest.participants;
  }

  static reconstitute(bet: IndividualBetType): IndividualBet {
    const individualBet = new IndividualBet(
      IndividualBetRequest.reconstitute({
        id: bet.id,
        creatorId: bet.creatorId,
        title: bet.title,
        terms: bet.terms,
        participants: bet.participants,
        updatedAt: bet.updatedAt,
        stakeType: "INDIVIDUAL",
        createdAt: bet.createdAt,
      }),
    );
    individualBet.clearDomainEvents();
    individualBet._updatedAt = bet.updatedAt;
    individualBet._status = bet.status;
    individualBet._resolvedAt = bet.resolvedAt;
    individualBet._resolvedBy = bet.resolvedBy;
    individualBet._winnerId = bet.winnerId;
    individualBet._dueDate = bet.dueDate;
    individualBet._completedBy = bet.completedBy;
    individualBet._completedAt = bet.completedAt;
    return individualBet;
  }

  override equals(other: Entity): boolean {
    if (!(other instanceof IndividualBet)) return false;
    return this.id === other.id;
  }
  override toString(): string {
    return `IndividualBet[${this.id}] (status=${this.status})`;
  }
  override toObject(): IndividualBetType {
    return {
      id: this.id,
      creatorId: this.creatorId,
      status: this.status,
      title: this.title,
      terms: this.terms,
      participants: this.participants,
      stakeType: "INDIVIDUAL",
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
      resolvedAt: this.resolvedAt,
      resolvedBy: this.resolvedBy,
      winnerId: this.winnerId,
      dueDate: this.dueDate,
      completedAt: this.completedAt,
      completedBy: this.completedBy,
    };
  }
}
