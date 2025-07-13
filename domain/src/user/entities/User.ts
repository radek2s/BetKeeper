import { UserId } from '../value-objects/UserId';
import { Email } from '../value-objects/Email';
import { UserName } from '../value-objects/UserName';
import { UserStatus, UserStatusGuards } from '../types/RequestStatus';
import { DomainEvent } from '../events/DomainEvent';
import { UserCreatedEvent } from '../events/UserCreatedEvent';
import { UserStatusChangedEvent } from '../events/UserStatusChangedEvent';

/**
 * User Entity
 * Represents a user in the BetKeeper system following DDD principles
 */
export class User {
  private readonly _id: UserId;
  private _email: Email;
  private _name: UserName;
  private _status: UserStatus;
  private readonly _createdAt: Date;
  private _updatedAt: Date;
  private _domainEvents: DomainEvent[] = [];

  constructor(
    id: UserId,
    email: Email,
    name: UserName,
    status: UserStatus = UserStatus.PENDING_ACTIVATION,
    createdAt?: Date,
    updatedAt?: Date
  ) {
    this._id = id;
    this._email = email;
    this._name = name;
    this._status = status;
    this._createdAt = createdAt || new Date();
    this._updatedAt = updatedAt || new Date();

    // Raise domain event for new user creation
    if (!createdAt) {
      this.addDomainEvent(new UserCreatedEvent(this._id, this._email, this._name));
    }
  }

  // Getters
  get id(): UserId {
    return this._id;
  }

  get email(): Email {
    return this._email;
  }

  get name(): UserName {
    return this._name;
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

  get domainEvents(): DomainEvent[] {
    return [...this._domainEvents];
  }

  // Business methods
  activate(): void {
    if (this._status === UserStatus.ACTIVE) {
      throw new Error('User is already active');
    }

    if (this._status === UserStatus.SUSPENDED) {
      throw new Error('Cannot activate suspended user');
    }

    const previousStatus = this._status;
    this._status = UserStatus.ACTIVE;
    this._updatedAt = new Date();

    this.addDomainEvent(new UserStatusChangedEvent(this._id, previousStatus, this._status));
  }

  deactivate(): void {
    if (this._status === UserStatus.INACTIVE) {
      throw new Error('User is already inactive');
    }

    const previousStatus = this._status;
    this._status = UserStatus.INACTIVE;
    this._updatedAt = new Date();

    this.addDomainEvent(new UserStatusChangedEvent(this._id, previousStatus, this._status));
  }

  suspend(): void {
    if (this._status === UserStatus.SUSPENDED) {
      throw new Error('User is already suspended');
    }

    const previousStatus = this._status;
    this._status = UserStatus.SUSPENDED;
    this._updatedAt = new Date();

    this.addDomainEvent(new UserStatusChangedEvent(this._id, previousStatus, this._status));
  }

  updateName(newName: UserName): void {
    if (this._name.equals(newName)) {
      return; // No change needed
    }

    this._name = newName;
    this._updatedAt = new Date();
  }

  updateEmail(newEmail: Email): void {
    if (this._email.equals(newEmail)) {
      return; // No change needed
    }

    this._email = newEmail;
    this._updatedAt = new Date();
  }

  // Domain behavior checks
  canReceiveFriendRequests(): boolean {
    return UserStatusGuards.canReceiveFriendRequests(this._status);
  }

  canSendFriendRequests(): boolean {
    return UserStatusGuards.canSendFriendRequests(this._status);
  }

  isActive(): boolean {
    return UserStatusGuards.isActive(this._status);
  }

  // Domain events management
  private addDomainEvent(event: DomainEvent): void {
    this._domainEvents.push(event);
  }

  clearDomainEvents(): void {
    this._domainEvents = [];
  }

  // Factory methods
  static create(email: Email, name: UserName): User {
    const id = UserId.create(`user_${Date.now()}_${Math.random().toString(36).substring(2)}`);
    return new User(id, email, name);
  }

  static reconstitute(
    id: UserId,
    email: Email,
    name: UserName,
    status: UserStatus,
    createdAt: Date,
    updatedAt: Date
  ): User {
    return new User(id, email, name, status, createdAt, updatedAt);
  }

  // Equality
  equals(other: User): boolean {
    return this._id.equals(other._id);
  }

  toString(): string {
    return `User(${this._id.value}, ${this._email.value}, ${this._name.value})`;
  }
}
