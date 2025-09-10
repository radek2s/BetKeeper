import { Entity, generateId, UUID } from "@domain/shared";
import { Email } from "../value-objects";
import { UserStatus, UserStatusGuards } from "../types/RequestStatus";
import { UserCreatedEvent } from "../events/UserCreatedEvent";
import { UserStatusChangedEvent } from "../events/UserStatusChangedEvent";

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

  /**
   * Create a new User Instance
   *
   * Emits a UserCreatedEvent if the user is newly created
   */
  constructor(
    email: Email,
    firstName: string,
    lastName: string,
    status: UserStatus = UserStatus.PENDING_ACTIVATION,
    id?: UUID,
  ) {
    super();
    this._id = id || generateId();
    this._email = email;
    this._firstName = firstName;
    this._lastName = lastName;
    this._status = status;

    if (!id) {
      this.addDomainEvent(
        new UserCreatedEvent(this._id, this._email, this.name),
      );
    }
  }

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

  activate(): void {
    if (this._status === UserStatus.ACTIVE) {
      throw new Error("User is already active");
    }

    if (this._status === UserStatus.SUSPENDED) {
      throw new Error("Cannot activate suspended user");
    }

    const previousStatus = this._status;
    this._status = UserStatus.ACTIVE;

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
  }

  updateEmail(newEmail: Email): void {
    if (this._email.equals(newEmail)) {
      return;
    }

    this._email = newEmail;
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

  static create(email: Email, firstName: string, lastName: string): User {
    const id = generateId();

    return new User(
      email,
      firstName,
      lastName,
      UserStatus.PENDING_ACTIVATION,
      id,
    );
  }

  static reconstitute(
    id: UUID,
    email: Email,
    firstName: string,
    lastName: string,
    status: UserStatus,
  ): User {
    return new User(email, firstName, lastName, status, id);
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
