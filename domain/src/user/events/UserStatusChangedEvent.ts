import { DomainEvent } from "./DomainEvent";
import { UserStatus } from "../types/RequestStatus";
import { UUID } from "domain/src/shared";

/**
 * User Status Changed Domain Event
 * Raised when a user's status changes (active, inactive, suspended, etc.)
 */
export class UserStatusChangedEvent extends DomainEvent {
  public readonly userId: UUID;
  public readonly previousStatus: UserStatus;
  public readonly newStatus: UserStatus;

  constructor(userId: UUID, previousStatus: UserStatus, newStatus: UserStatus) {
    super("UserStatusChanged");
    this.userId = userId;
    this.previousStatus = previousStatus;
    this.newStatus = newStatus;
  }

  getAggregateId(): string {
    return this.userId;
  }
}
