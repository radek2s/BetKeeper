/**
 * Bet Request Status Enumeration
 * Represents the current state of a bet request
 */
export enum BetRequestStatus {
  PENDING = "pending",
  APPROVED = "approved",
  REJECTED = "rejected",
  BLOCKED = "blocked",
  DELETED = "deleted",
}

/**
 * Participant Vote Enumeration
 * Represents a participant's vote on a bet request
 */
export enum ParticipantVote {
  UNKNOWN = "unknown",
  APPROVED = "approved",
  REJECTED = "rejected",
}

/**
 * Bet Request Status Guards
 * Utility functions for checking bet request status states
 */
export class BetRequestStatusGuards {
  static isPending(status: BetRequestStatus): boolean {
    return status === BetRequestStatus.PENDING;
  }

  static isApproved(status: BetRequestStatus): boolean {
    return status === BetRequestStatus.APPROVED;
  }

  static isRejected(status: BetRequestStatus): boolean {
    return status === BetRequestStatus.REJECTED;
  }

  static isBlocked(status: BetRequestStatus): boolean {
    return status === BetRequestStatus.BLOCKED;
  }

  static isDeleted(status: BetRequestStatus): boolean {
    return status === BetRequestStatus.DELETED;
  }

  static isFinal(status: BetRequestStatus): boolean {
    return (
      status === BetRequestStatus.APPROVED ||
      status === BetRequestStatus.REJECTED ||
      status === BetRequestStatus.DELETED
    );
  }

  static canBeModified(status: BetRequestStatus): boolean {
    return status === BetRequestStatus.PENDING;
  }

  static canBeApproved(status: BetRequestStatus): boolean {
    return status === BetRequestStatus.PENDING;
  }

  static canBeRejected(status: BetRequestStatus): boolean {
    return status === BetRequestStatus.PENDING;
  }

  static canBeBlocked(status: BetRequestStatus): boolean {
    return status === BetRequestStatus.PENDING;
  }

  static canBeDeleted(status: BetRequestStatus): boolean {
    return !BetRequestStatusGuards.isDeleted(status);
  }
}

/**
 * Participant Vote Guards
 * Utility functions for checking participant vote states
 */
export class ParticipantVoteGuards {
  static isUnknown(vote: ParticipantVote): boolean {
    return vote === ParticipantVote.UNKNOWN;
  }

  static isApproved(vote: ParticipantVote): boolean {
    return vote === ParticipantVote.APPROVED;
  }

  static isRejected(vote: ParticipantVote): boolean {
    return vote === ParticipantVote.REJECTED;
  }

  static hasVoted(vote: ParticipantVote): boolean {
    return vote !== ParticipantVote.UNKNOWN;
  }

  static isFinal(vote: ParticipantVote): boolean {
    return ParticipantVoteGuards.hasVoted(vote);
  }
}
