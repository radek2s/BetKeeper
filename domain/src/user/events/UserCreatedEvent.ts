import { DomainEvent } from "./DomainEvent";
import { Email } from "../value-objects/Email";
import { UUID } from "../../shared";

/**
 * User Created Domain Event
 * Raised when a new user is created in the system
 */
export class UserCreatedEvent extends DomainEvent {
  public readonly userId: UUID;
  public readonly email: Email;
  public readonly name: string;

  constructor(userId: UUID, email: Email, name: string) {
    super("UserCreated");
    this.userId = userId;
    this.email = email;
    this.name = name;
  }

  getAggregateId(): string {
    return this.userId;
  }
}
