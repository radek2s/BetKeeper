/**
 * Bet Status Enumeration
 * Represents the current state of an active bet
 */
export enum BetStatus {
  PENDING = "pending",
  RESOLVED = "resolved",
  COMPLETED = "completed",
  DELETED = "deleted",
}

/**
 * Bet Status Guards
 * Utility functions for checking bet status states
 */
export class BetStatusGuards {
  static isPending(status: BetStatus): boolean {
    return status === BetStatus.PENDING;
  }

  static isResolved(status: BetStatus): boolean {
    return status === BetStatus.RESOLVED;
  }

  static isCompleted(status: BetStatus): boolean {
    return status === BetStatus.COMPLETED;
  }

  static isDeleted(status: BetStatus): boolean {
    return status === BetStatus.DELETED;
  }

  static isActive(status: BetStatus): boolean {
    return status === BetStatus.PENDING || status === BetStatus.RESOLVED;
  }

  static isFinal(status: BetStatus): boolean {
    return status === BetStatus.COMPLETED || status === BetStatus.DELETED;
  }

  static canBeResolved(status: BetStatus): boolean {
    return status === BetStatus.PENDING;
  }

  static canBeCompleted(status: BetStatus): boolean {
    return status === BetStatus.RESOLVED;
  }

  static canBeDeleted(status: BetStatus): boolean {
    return !this.isDeleted(status);
  }

  static requiresAction(status: BetStatus): boolean {
    return status === BetStatus.PENDING || status === BetStatus.RESOLVED;
  }
}
