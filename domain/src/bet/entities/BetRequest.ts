import { Entity, generateId, type UUID } from "@domain/shared";
import { DomainError } from "@domain/shared/DomainError";
import {
  BetRequestActionEvent,
  BetRequestCreatedEvent,
  BetRequestUpdatedEvent,
} from "../events/BetRequestEvents";
import type {
  BetParticipant,
  IndividualBetParticipantType,
} from "./BetParticipant";

export type StakeType = "INDIVIDUAL" | "COMMON";

export type BetRequestType = {
  id: UUID;
  creatorId: UUID;
  title: string;
  terms: string;
  participants: BetParticipant[];
  createdAt: Date;
  updatedAt: Date;
};

export type CommonBetRequestType = BetRequestType & {
  stakeType: "COMMON";
  stake: string;
};

export type IndividualBetRequestType = BetRequestType & {
  stakeType: "INDIVIDUAL";
  participants: IndividualBetParticipantType[];
};

export abstract class AbstractBetRequest extends Entity {
  readonly id: UUID;
  readonly creatorId: UUID;
  abstract readonly stakeType: StakeType;
  readonly createdAt: Date;
  protected _title: string;
  protected _terms: string;
  participants: BetParticipant[];
  protected _updatedAt: Date;

  constructor(
    creatorId: UUID,
    title: string,
    terms: string,
    participants: BetParticipant[],
    id: string | undefined,
    createdAt?: Date,
  ) {
    super();
    this.isValidCreator(creatorId, participants);
    const now = new Date();
    this.id = id || generateId();
    this.creatorId = creatorId;
    this._title = title;
    this._terms = terms;
    this.participants = participants;
    this.createdAt = createdAt || now;
    this._updatedAt = now;

    if (id === undefined) {
      this.addDomainEvent(BetRequestCreatedEvent.fromBet(this));
    }
  }

  get title(): string {
    return this._title;
  }

  setTitle(value: string, updatingId: UUID) {
    const oldValue = this._title;
    this._title = value;
    this._updatedAt = new Date();
    this.resetVotes(updatingId);
    this.addDomainEvent(
      new BetRequestUpdatedEvent(
        this.id,
        "title",
        oldValue,
        value,
        updatingId,
        this._title,
        this.getParticipantIds(),
      ),
    );
  }

  get terms(): string {
    return this._terms;
  }

  setTerms(value: string, updatingId: UUID) {
    const oldValue = this._terms;
    this._terms = value;
    this._updatedAt = new Date();
    this.resetVotes(updatingId);
    this.addDomainEvent(
      new BetRequestUpdatedEvent(
        this.id,
        "terms",
        oldValue,
        value,
        updatingId,
        this._title,
        this.getParticipantIds(),
      ),
    );
  }

  setClaims(value: string, participantId: UUID) {
    let oldValue: string | null = null;
    this.participants = this.participants.map((participant) => {
      if (participant.userId === participantId) {
        oldValue = participant.claim;
        return {
          ...participant,
          claim: value,
        };
      }
      return participant;
    });
    this.resetVotes(participantId);
    this._updatedAt = new Date();

    if (oldValue) {
      this.addDomainEvent(
        new BetRequestUpdatedEvent(
          this.id,
          "terms",
          oldValue,
          value,
          participantId,
          this._title,
          this.getParticipantIds(),
        ),
      );
    }
  }

  abstract setStake(value: string, updatingId: string): void;

  get updatedAt() {
    return this._updatedAt;
  }

  approve(participantId: UUID) {
    if (!this.isParticipant(participantId)) {
      throw new DomainError("Only bet participant can approve bet request!");
    }
    this.participants = this.participants.map((participant) => {
      if (participant.userId === participantId) {
        return {
          ...participant,
          vote: "approved",
        };
      }
      return participant;
    });
    this._updatedAt = new Date();
    this.addDomainEvent(
      new BetRequestActionEvent(
        this.id,
        "approve",
        participantId,
        this._title,
        this.getParticipantIds(),
      ),
    );
  }

  reject(participantId: UUID) {
    if (!this.isParticipant(participantId)) {
      throw new DomainError("Only bet participant can reject bet request!");
    }
    this.participants = this.participants.map((participant) => {
      if (participant.userId === participantId) {
        return {
          ...participant,
          vote: "rejected",
        };
      }
      return participant;
    });
    this._updatedAt = new Date();
    this.addDomainEvent(
      new BetRequestActionEvent(
        this.id,
        "reject",
        participantId,
        this._title,
        this.getParticipantIds(),
      ),
    );
  }

  isApproved(): boolean {
    return this.participants.every(({ vote }) => vote === "approved");
  }

  hasEnoughParticipants(): boolean {
    return this.participants.length >= 2;
  }

  protected isParticipant(participantId: UUID) {
    return !!this.participants.find(({ userId }) => userId === participantId);
  }

  protected resetVotes(updatingId: UUID) {
    this.participants = this.participants.map((participant) => {
      if (participant.userId === updatingId) return participant;
      return { ...participant, vote: "unknown" };
    });
  }

  private isValidCreator(creatorId: UUID, participants: BetParticipant[]) {
    const creator = participants.some(({ userId }) => userId === creatorId);
    if (!creator)
      throw new DomainError(
        `Invalid creatorId=${creatorId}! Creator must be participant of bet request!`,
      );
  }

  protected getParticipantIds(): string[] {
    return this.participants.map((participant) => participant.userId);
  }

  override toObject(): BetRequestType {
    return {
      id: this.id,
      title: this.title,
      terms: this.terms,
      createdAt: this.createdAt,
      creatorId: this.creatorId,
      participants: this.participants,
      updatedAt: this.updatedAt,
    };
  }
}

export class CommonBetRequest extends AbstractBetRequest {
  stakeType: StakeType = "COMMON";
  protected _stake: string;

  constructor(
    creatorId: UUID,
    title: string,
    terms: string,
    stake: string,
    participants: BetParticipant[],
    id: string | undefined = undefined,
    createdAt?: Date,
  ) {
    super(creatorId, title, terms, participants, id, createdAt);
    this._stake = stake;
  }

  get stake() {
    return this._stake;
  }

  setStake(value: string, updatingId: string) {
    const oldValue = this._stake;
    this._stake = value;
    this.resetVotes(updatingId);
    this._updatedAt = new Date();
    this.addDomainEvent(
      new BetRequestUpdatedEvent(
        this.id,
        "stake",
        oldValue,
        value,
        updatingId,
        this._title,
        this.getParticipantIds(),
      ),
    );
  }

  static reconstitute(betRequest: CommonBetRequestType): CommonBetRequest {
    const newBetRequest = new CommonBetRequest(
      betRequest.creatorId,
      betRequest.title,
      betRequest.terms,
      betRequest.stake,
      betRequest.participants,
      betRequest.id,
      betRequest.createdAt,
    );
    newBetRequest._stake = betRequest.stake;
    newBetRequest._updatedAt = betRequest.updatedAt;
    return newBetRequest;
  }

  override equals(other: Entity): boolean {
    if (!(other instanceof CommonBetRequest)) return false;
    return this.id === other.id;
  }
  override toString(): string {
    return `CommonBetRequest[${this.id}] (createdAt=${this.createdAt}, creatorId=${this.creatorId}, title=${this.title}, terms=${this.terms})`;
  }
  override toObject(): CommonBetRequestType {
    return {
      id: this.id,
      title: this.title,
      terms: this.terms,
      createdAt: this.createdAt,
      creatorId: this.creatorId,
      participants: this.participants,
      stake: this.stake,
      stakeType: "COMMON",
      updatedAt: this.updatedAt,
    };
  }
}

export class IndividualBetRequest extends AbstractBetRequest {
  stakeType: StakeType = "INDIVIDUAL";
  override participants: IndividualBetParticipantType[];

  constructor(
    creatorId: UUID,
    title: string,
    terms: string,
    participants: IndividualBetParticipantType[],
    id: string | undefined = undefined,
    createdAt?: Date,
  ) {
    super(creatorId, title, terms, participants, id, createdAt);
    this.participants = participants;
  }

  setStake(stake: string, participantId: UUID) {
    if (!this.isParticipant(participantId)) {
      throw new Error("Only participant can change his stakes!");
    }
    let oldValue: string | null = null;
    this.participants = this.participants.map((participant) => {
      if (participant.userId === participantId) {
        oldValue = participant.stake;
        return {
          ...participant,
          stake,
        };
      }
      return participant;
    });
    this.resetVotes(participantId);
    this._updatedAt = new Date();

    if (oldValue) {
      this.addDomainEvent(
        new BetRequestUpdatedEvent(
          this.id,
          "stake",
          oldValue,
          stake,
          participantId,
          this._title,
          this.getParticipantIds(),
        ),
      );
    }
  }

  static reconstitute(
    betRequest: IndividualBetRequestType,
  ): IndividualBetRequest {
    const newBetRequest = new IndividualBetRequest(
      betRequest.creatorId,
      betRequest.title,
      betRequest.terms,
      betRequest.participants,
      betRequest.id,
      betRequest.createdAt,
    );
    newBetRequest._updatedAt = betRequest.updatedAt;
    return newBetRequest;
  }

  override equals(other: Entity): boolean {
    if (!(other instanceof IndividualBetRequest)) return false;
    return this.id === other.id;
  }
  override toString(): string {
    return `IndividualBetRequest[${this.id}] (createdAt=${this.createdAt}, creatorId=${this.creatorId}, title=${this.title}, terms=${this.terms})`;
  }
  override toObject(): IndividualBetRequestType {
    return {
      id: this.id,
      title: this.title,
      terms: this.terms,
      createdAt: this.createdAt,
      creatorId: this.creatorId,
      participants: this.participants,
      stakeType: "INDIVIDUAL",
      updatedAt: this.updatedAt,
    };
  }
}
