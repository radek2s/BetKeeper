import { DomainEvent } from './DomainEvent';
import { UserId } from '../value-objects/UserId';
import { UserStatus } from '../types/RequestStatus';

/**
 * User Status Changed Domain Event
 * Raised when a user's status changes (active, inactive, suspended, etc.)
 */
export class UserStatusChangedEvent extends DomainEvent {
  public readonly userId: UserId;
  public readonly previousStatus: UserStatus;
  public readonly newStatus: UserStatus;

  constructor(userId: UserId, previousStatus: UserStatus, newStatus: UserStatus) {
    super('UserStatusChanged');
    this.userId = userId;
    this.previousStatus = previousStatus;
    this.newStatus = newStatus;
  }

  getAggregateId(): string {
    return this.userId.value;
  }
}
