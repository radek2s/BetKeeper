import { Email } from "../value-objects/Email";
import { Entity } from "../../shared/Entity";
import { UserStatus, UserStatusGuards } from "../types/RequestStatus";
import { UserCreatedEvent } from "../events/UserCreatedEvent";
import { UserStatusChangedEvent } from "../events/UserStatusChangedEvent";
import { IEventDispatcher } from "../../shared/EventDispatcher";
import { generateId, UUID } from "../../shared/Uuid";

/**
 * User Entity
 * Represents a user in the BetKeeper system following DDD principles
 */
export class User extends Entity {
  private readonly _id: UUID;
  private _email: Email;
  private _firstName: string;
  private _lastName: string;
  private _status: UserStatus;
  private readonly _createdAt: Date;
  private _updatedAt: Date;

  constructor(
    id: UUID,
    email: Email,
    firstName: string,
    lastName: string,
    status: UserStatus = UserStatus.PENDING_ACTIVATION,
    createdAt?: Date,
    updatedAt?: Date,
    eventDispatcher?: IEventDispatcher,
  ) {
    super(eventDispatcher);

    this._id = id;
    this._email = email;
    this._firstName = firstName;
    this._lastName = lastName;
    this._status = status;
    this._createdAt = createdAt || new Date();
    this._updatedAt = updatedAt || new Date();

    // Raise domain event for new user creation
    if (!createdAt) {
      this.addDomainEvent(
        new UserCreatedEvent(this._id, this._email, this.name),
      );
    }
  }

  // Getters
  get id(): UUID {
    return this._id;
  }

  get email(): Email {
    return this._email;
  }

  get name(): string {
    return `${this._firstName} ${this._lastName}`;
  }

  get status(): UserStatus {
    return this._status;
  }

  get createdAt(): Date {
    return this._createdAt;
  }

  get updatedAt(): Date {
    return this._updatedAt;
  }

  activate(): void {
    if (this._status === UserStatus.ACTIVE) {
      throw new Error("User is already active");
    }

    if (this._status === UserStatus.SUSPENDED) {
      throw new Error("Cannot activate suspended user");
    }

    const previousStatus = this._status;
    this._status = UserStatus.ACTIVE;
    this._updatedAt = new Date();
    this.markAsModified();

    this.addDomainEvent(
      new UserStatusChangedEvent(this._id, previousStatus, this._status),
    );
  }

  deactivate(): void {
    if (this._status === UserStatus.INACTIVE) {
      throw new Error("User is already inactive");
    }

    const previousStatus = this._status;
    this._status = UserStatus.INACTIVE;
    this._updatedAt = new Date();
    this.markAsModified();

    this.addDomainEvent(
      new UserStatusChangedEvent(this._id, previousStatus, this._status),
    );
  }

  suspend(): void {
    if (this._status === UserStatus.SUSPENDED) {
      throw new Error("User is already suspended");
    }

    const previousStatus = this._status;
    this._status = UserStatus.SUSPENDED;
    this._updatedAt = new Date();
    this.markAsModified();

    this.addDomainEvent(
      new UserStatusChangedEvent(this._id, previousStatus, this._status),
    );
  }

  updateName(firstName: string, lastName: string): void {
    if (this._firstName === firstName && this._lastName === lastName) {
      return;
    }

    this._firstName = firstName;
    this._lastName = lastName;
    this._updatedAt = new Date();
    this.markAsModified();
  }

  updateEmail(newEmail: Email): void {
    if (this._email.equals(newEmail)) {
      return;
    }

    this._email = newEmail;
    this._updatedAt = new Date();
    this.markAsModified();
  }

  canReceiveFriendRequests(): boolean {
    return UserStatusGuards.canReceiveFriendRequests(this._status);
  }

  canSendFriendRequests(): boolean {
    return UserStatusGuards.canSendFriendRequests(this._status);
  }

  isActive(): boolean {
    return UserStatusGuards.isActive(this._status);
  }

  static create(
    email: Email,
    firstName: string,
    lastName: string,
    eventDispatcher?: IEventDispatcher,
  ): User {
    const id = generateId();

    return new User(
      id,
      email,
      firstName,
      lastName,
      UserStatus.PENDING_ACTIVATION,
      undefined,
      undefined,
      eventDispatcher,
    );
  }

  static reconstitute(
    id: UUID,
    email: Email,
    firstName: string,
    lastName: string,
    status: UserStatus,
    createdAt: Date,
    updatedAt: Date,
    eventDispatcher?: IEventDispatcher,
  ): User {
    return new User(
      id,
      email,
      firstName,
      lastName,
      status,
      createdAt,
      updatedAt,
      eventDispatcher,
    );
  }

  override equals(other: Entity): boolean {
    if (!(other instanceof User)) {
      return false;
    }
    return this._id === other._id;
  }

  override toString(): string {
    return `User(${this._id}, ${this._email.value}, ${this._firstName} ${this._lastName})`;
  }
}
