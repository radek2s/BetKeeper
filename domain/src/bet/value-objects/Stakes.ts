import { UUID } from "@domain/shared";

/**
 * Stake Type Enumeration
 * Represents the type of stake in a bet
 */
export enum StakeType {
  COMMON = "common",
  INDIVIDUAL = "individual",
}

/**
 * Base Stake Interface
 * Common interface for all stake types
 */
export interface IStake {
  readonly type: StakeType;
  readonly description: string;
  equals(other: IStake): boolean;
  toString(): string;
}

/**
 * Common Stake Value Object
 * Represents a stake where both participants have the same consequence
 */
export class CommonStake implements IStake {
  public readonly type = StakeType.COMMON;
  private readonly _description: string;

  constructor(description: string) {
    this.validate(description);
    this._description = description.trim();
  }

  private validate(description: string): void {
    if (!description || typeof description !== "string") {
      throw new Error("Stake description cannot be empty");
    }

    const trimmedDescription = description.trim();
    if (trimmedDescription.length === 0) {
      throw new Error("Stake description cannot be empty");
    }
  }

  get description(): string {
    return this._description;
  }

  equals(other: IStake): boolean {
    return (
      other instanceof CommonStake && this._description === other._description
    );
  }

  toString(): string {
    return `Common Stake: ${this._description}`;
  }
}

/**
 * Individual Stake Value Object
 * Represents individual stakes for each participant
 */
export class IndividualStakes implements IStake {
  public readonly type = StakeType.INDIVIDUAL;
  private readonly _creatorStake: string;
  private readonly _participantStake: string;

  constructor(creatorStake: string, participantStake: string) {
    this.validate(creatorStake, "Creator stake");
    this.validate(participantStake, "Participant stake");
    this._creatorStake = creatorStake.trim();
    this._participantStake = participantStake.trim();
  }

  private validate(stake: string, fieldName: string): void {
    if (!stake || typeof stake !== "string") {
      throw new Error(`${fieldName} cannot be empty`);
    }

    const trimmedStake = stake.trim();
    if (trimmedStake.length === 0) {
      throw new Error(`${fieldName} cannot be empty`);
    }
  }

  get description(): string {
    return `Creator: ${this._creatorStake} | Participant: ${this._participantStake}`;
  }

  get creatorStake(): string {
    return this._creatorStake;
  }

  get participantStake(): string {
    return this._participantStake;
  }

  /**
   * Gets the stake for a specific participant
   */
  getStakeForParticipant(participantId: UUID, creatorId: UUID): string {
    if (participantId === creatorId) {
      return this._creatorStake;
    }
    return this._participantStake;
  }

  equals(other: IStake): boolean {
    return (
      other instanceof IndividualStakes &&
      this._creatorStake === other._creatorStake &&
      this._participantStake === other._participantStake
    );
  }

  toString(): string {
    return `Individual Stakes - ${this.description}`;
  }
}

/**
 * Stakes Factory
 * Factory for creating different types of stakes
 */
export class StakesFactory {
  static createCommonStake(description: string): CommonStake {
    return new CommonStake(description);
  }

  static createIndividualStakes(
    creatorStake: string,
    participantStake: string,
  ): IndividualStakes {
    return new IndividualStakes(creatorStake, participantStake);
  }
}
