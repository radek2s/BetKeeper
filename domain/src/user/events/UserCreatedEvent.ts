import { DomainEvent } from './DomainEvent';
import { UserId } from '../value-objects/UserId';
import { Email } from '../value-objects/Email';
import { UserName } from '../value-objects/UserName';

/**
 * User Created Domain Event
 * Raised when a new user is created in the system
 */
export class UserCreatedEvent extends DomainEvent {
  public readonly userId: UserId;
  public readonly email: Email;
  public readonly name: UserName;

  constructor(userId: UserId, email: Email, name: UserName) {
    super('UserCreated');
    this.userId = userId;
    this.email = email;
    this.name = name;
  }

  getAggregateId(): string {
    return this.userId.value;
  }
}
